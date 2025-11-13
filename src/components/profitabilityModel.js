const API_ENDPOINT = process.env.REACT_APP_ATHENA_API_ENDPOINT

/**
 * Fetch service profitability data from the API
 * @returns {Promise<Object>} Service profitability data with Pareto analysis and clustering
 * @throws {Error} If the API request fails
 */
export const getServiceProfitability = async () => {
  try {
    if (!API_ENDPOINT) {
      throw new Error("API endpoint not configured. Please set REACT_APP_ATHENA_API_ENDPOINT in your .env file")
    }

    const url = `${API_ENDPOINT}/descriptive`
    console.log("Fetching from URL:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
    })

    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    let data = await response.json()

    // API Gateway wraps Lambda responses - unwrap if needed
    if (data.body && typeof data.body === "string") {
      console.log("Unwrapping API Gateway response...")
      data = JSON.parse(data.body)
    }

    console.log("=== PARSED DATA ===")
    console.log("Success status:", data.success)

    // Handle the nested structure
    if (data.data && data.data.service_profitability && data.data.material_cost_pareto) {
      console.log("✅ Combined response format detected")

      const serviceData = data.data.service_profitability.results || []
      const materialData = data.data.material_cost_pareto.results || []
      const clusteringData = data.data.project_clustering?.results || []

      console.log("Service records:", serviceData.length)
      console.log("Material records:", materialData.length)
      console.log("Clustering records:", clusteringData.length)

      // 🔍 Debug: Check first clustering record
      if (clusteringData.length > 0) {
        console.log("First clustering record:", clusteringData[0])
        console.log("Clustering record keys:", Object.keys(clusteringData[0]))
      }

      if (!Array.isArray(serviceData)) {
        throw new Error(`Service data is not an array, got ${typeof serviceData}`)
      }

      if (!Array.isArray(materialData)) {
        throw new Error(`Material data is not an array, got ${typeof materialData}`)
      }

      return {
        success: true,
        timestamp: data.timestamp,
        recordCount: serviceData.length,
        data: serviceData,
        materialData: materialData,
        materialRecordCount: materialData.length,
        clusteringData: clusteringData,
        clusteringRecordCount: clusteringData.length,
      }
    }

    // Fallback for old format
    if (!data.data) {
      console.warn("No data returned from API")
      return {
        success: true,
        timestamp: data.timestamp,
        recordCount: 0,
        data: [],
        materialData: [],
        materialRecordCount: 0,
        clusteringData: [],
        clusteringRecordCount: 0,
      }
    }

    throw new Error(`API returned unexpected data structure`)

  } catch (error) {
    console.error("Error fetching service profitability data:", error)

    if (error.message.includes("Failed to fetch")) {
      throw new Error("Network error: Unable to reach API. Check your API endpoint URL and CORS settings.")
    }

    throw error
  }
}

/**
 * Simple K-Means clustering implementation for project data
 * @param {Array} data - Project data with metrics
 * @param {number} k - Number of clusters (default: 3)
 * @returns {Array} Data with cluster assignments
 */
export const performKMeansClustering = (data, k = 3) => {
  if (!data || data.length === 0) return []

  console.log("=== K-MEANS CLUSTERING START ===")
  console.log("Input data length:", data.length)
  console.log("First input record:", data[0])

  // Extract and normalize features
  const features = data.map(project => {
    const feature = {
      id: project.project_id,
      name: project.project_name,
      service: project.service_name,
      profitMargin: parseFloat(project.profit_margin_pct) || 0,
      daysToCompletion: parseFloat(project.days_to_completion) || 0,
      paymentRecovery: parseFloat(project.payment_recovery_days) || 0,
      revenue: parseFloat(project.revenue) || 0,
      cost: parseFloat(project.total_cost) || 0
    }
    
    // 🔍 Debug: Log if any values are still 0 after parsing
    if (feature.profitMargin === 0 || feature.daysToCompletion === 0) {
      console.log("⚠️ Zero value detected:", {
        name: feature.name,
        profitMargin: feature.profitMargin,
        original_profit: project.profit_margin_pct,
        daysToCompletion: feature.daysToCompletion,
        original_days: project.days_to_completion
      })
    }
    
    return feature
  })

  console.log("Transformed features count:", features.length)
  console.log("First transformed feature:", features[0])

  // Normalize features (min-max normalization)
  const normalize = (values) => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    console.log(`Normalizing: min=${min}, max=${max}, range=${range}`)
    return values.map(v => range === 0 ? 0 : (v - min) / range)
  }

  const profitMargins = features.map(f => f.profitMargin)
  const days = features.map(f => f.daysToCompletion)
  const payments = features.map(f => f.paymentRecovery)

  console.log("Profit margins range:", Math.min(...profitMargins), "to", Math.max(...profitMargins))
  console.log("Days range:", Math.min(...days), "to", Math.max(...days))
  console.log("Payment recovery range:", Math.min(...payments), "to", Math.max(...payments))

  const normalizedProfitMargins = normalize(profitMargins)
  const normalizedDays = normalize(days)
  const normalizedPayments = normalize(payments)

  const normalizedFeatures = features.map((f, i) => ({
    ...f,
    normProfit: normalizedProfitMargins[i],
    normDays: normalizedDays[i],
    normPayment: normalizedPayments[i]
  }))

  // Initialize centroids randomly
  const centroids = []
  const shuffled = [...normalizedFeatures].sort(() => 0.5 - Math.random())
  for (let i = 0; i < k; i++) {
    centroids.push({
      normProfit: shuffled[i].normProfit,
      normDays: shuffled[i].normDays,
      normPayment: shuffled[i].normPayment
    })
  }

  console.log("Initial centroids:", centroids)

  // K-means iterations
  let assignments = new Array(normalizedFeatures.length).fill(0)
  const maxIterations = 50

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    const newAssignments = normalizedFeatures.map(point => {
      let minDist = Infinity
      let cluster = 0

      centroids.forEach((centroid, c) => {
        const dist = Math.sqrt(
          Math.pow(point.normProfit - centroid.normProfit, 2) +
          Math.pow(point.normDays - centroid.normDays, 2) +
          Math.pow(point.normPayment - centroid.normPayment, 2)
        )
        if (dist < minDist) {
          minDist = dist
          cluster = c
        }
      })

      return cluster
    })

    // Check for convergence
    if (JSON.stringify(assignments) === JSON.stringify(newAssignments)) {
      console.log(`Converged after ${iter} iterations`)
      break
    }
    assignments = newAssignments

    // Update centroids
    for (let c = 0; c < k; c++) {
      const clusterPoints = normalizedFeatures.filter((_, i) => assignments[i] === c)
      if (clusterPoints.length > 0) {
        centroids[c] = {
          normProfit: clusterPoints.reduce((sum, p) => sum + p.normProfit, 0) / clusterPoints.length,
          normDays: clusterPoints.reduce((sum, p) => sum + p.normDays, 0) / clusterPoints.length,
          normPayment: clusterPoints.reduce((sum, p) => sum + p.normPayment, 0) / clusterPoints.length
        }
      }
    }
  }

  // Assign cluster labels based on characteristics
  const clusterStats = centroids.map((centroid, i) => {
    const clusterPoints = normalizedFeatures.filter((_, idx) => assignments[idx] === i)
    
    if (clusterPoints.length === 0) {
      return {
        id: i,
        avgProfitMargin: 0,
        avgDays: 0,
        avgPayment: 0,
        count: 0
      }
    }
    
    return {
      id: i,
      avgProfitMargin: clusterPoints.reduce((sum, p) => sum + p.profitMargin, 0) / clusterPoints.length,
      avgDays: clusterPoints.reduce((sum, p) => sum + p.daysToCompletion, 0) / clusterPoints.length,
      avgPayment: clusterPoints.reduce((sum, p) => sum + p.paymentRecovery, 0) / clusterPoints.length,
      count: clusterPoints.length
    }
  })

  console.log("Cluster statistics:", clusterStats)

  // Sort clusters by profit margin to assign meaningful labels
  const sortedClusters = clusterStats
    .map((stat, i) => ({ ...stat, originalId: i }))
    .sort((a, b) => b.avgProfitMargin - a.avgProfitMargin)

  const clusterLabels = ["High Performer", "Good", "Needs Attention", "At Risk"]
  const clusterMapping = {}
  sortedClusters.forEach((cluster, newId) => {
    clusterMapping[cluster.originalId] = {
      id: newId,
      label: clusterLabels[newId] || `Cluster ${newId + 1}`,
      ...cluster
    }
  })

  console.log("Cluster mapping:", clusterMapping)

  // Return data with cluster assignments
  const result = features.map((project, i) => ({
    ...project,
    cluster: clusterMapping[assignments[i]].id,
    clusterLabel: clusterMapping[assignments[i]].label,
    clusterStats: clusterMapping[assignments[i]]
  }))

  console.log("=== K-MEANS CLUSTERING END ===")
  console.log("Cluster distribution:", result.reduce((acc, p) => {
    acc[p.cluster] = (acc[p.cluster] || 0) + 1
    return acc
  }, {}))
  console.log("First clustered result:", result[0])

  return result
}

/**
 * Prepare clustering data for scatter plot visualization
 * @param {Array} clusteredData - Data with cluster assignments
 * @returns {Array} Chart-ready clustering data
 */
export const prepareClusteringChartData = (clusteredData) => {
  if (!clusteredData || clusteredData.length === 0) return []

  console.log("=== PREPARE CHART DATA ===")
  console.log("Input clustered data length:", clusteredData.length)
  console.log("First clustered data item:", clusteredData[0])

  const result = clusteredData.map(project => ({
    x: project.daysToCompletion,
    y: project.profitMargin,
    z: project.paymentRecovery,
    cluster: project.cluster,
    clusterLabel: project.clusterLabel,
    name: project.name,
    service: project.service,
    revenue: project.revenue,
    cost: project.cost
  }))

  console.log("Chart data prepared:", result.length, "items")
  console.log("First chart data item:", result[0])

  return result
}

/**
 * Get cluster summary statistics
 * @param {Array} clusteredData - Data with cluster assignments
 * @returns {Array} Summary stats for each cluster
 */
export const getClusterSummary = (clusteredData) => {
  if (!clusteredData || clusteredData.length === 0) {
    console.warn("getClusterSummary: No clustered data provided")
    return []
  }

  console.log("=== GET CLUSTER SUMMARY ===")
  console.log("Input data length:", clusteredData.length)
  console.log("First data item:", clusteredData[0])
  console.log("Available properties:", Object.keys(clusteredData[0]))

  const clusters = {}

  clusteredData.forEach(project => {
    const clusterId = project.cluster
    
    if (!clusters[clusterId]) {
      clusters[clusterId] = {
        id: clusterId,
        label: project.clusterLabel,
        projects: [],
        totalRevenue: 0,
        totalCost: 0
      }
    }

    clusters[clusterId].projects.push(project)
    clusters[clusterId].totalRevenue += parseFloat(project.revenue) || 0
    clusters[clusterId].totalCost += parseFloat(project.cost) || 0
  })

  console.log("Clusters found:", Object.keys(clusters))

  const summary = Object.values(clusters).map(cluster => {
    const projectCount = cluster.projects.length
    
    // Calculate averages with proper null checking
    const avgProfitMargin = projectCount > 0 
      ? cluster.projects.reduce((sum, p) => sum + (parseFloat(p.profitMargin) || 0), 0) / projectCount
      : 0

    const avgDaysToCompletion = projectCount > 0
      ? cluster.projects.reduce((sum, p) => sum + (parseFloat(p.daysToCompletion) || 0), 0) / projectCount
      : 0

    const avgPaymentRecovery = projectCount > 0
      ? cluster.projects.reduce((sum, p) => sum + (parseFloat(p.paymentRecovery) || 0), 0) / projectCount
      : 0

    console.log(`Cluster ${cluster.id} (${cluster.label}):`, {
      count: projectCount,
      avgProfitMargin,
      avgDaysToCompletion,
      avgPaymentRecovery,
      totalRevenue: cluster.totalRevenue
    })

    return {
      id: cluster.id,
      label: cluster.label,
      count: projectCount,
      avgProfitMargin,
      avgDaysToCompletion,
      avgPaymentRecovery,
      totalRevenue: cluster.totalRevenue,
      totalCost: cluster.totalCost,
      totalProfit: cluster.totalRevenue - cluster.totalCost
    }
  })

  const sortedSummary = summary.sort((a, b) => a.id - b.id)
  
  console.log("Final cluster summary:", sortedSummary)
  
  return sortedSummary
}

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return "₱0.00"
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value)
}

export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return "0.00%"
  return `${value.toFixed(decimals)}%`
}

export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return "0"
  return new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const getTopServices = (data, n = 5) => {
  if (!data || !Array.isArray(data)) return []
  return data.slice(0, n)
}

export const calculateTotalMetrics = (data) => {
  if (!data || !Array.isArray(data)) {
    return {
      totalProjects: 0,
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      overallMargin: 0,
    }
  }

  const totals = data.reduce(
    (acc, service) => ({
      totalProjects: acc.totalProjects + (service.project_count || 0),
      totalRevenue: acc.totalRevenue + (service.total_revenue || 0),
      totalCost: acc.totalCost + (service.total_cost || 0),
      totalProfit: acc.totalProfit + (service.total_profit || 0),
    }),
    { totalProjects: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0 },
  )

  totals.overallMargin = totals.totalCost !== 0 ? (totals.totalProfit / totals.totalCost) * 100 : 0

  return totals
}

export const getParetoServices = (data) => {
  if (!data || !Array.isArray(data)) return []
  return data.filter((service) => service.cumulative_percentage && service.cumulative_percentage <= 80)
}

export const prepareChartData = (data, limit = 10) => {
  if (!data || !Array.isArray(data)) return []

  const chartData = data.slice(0, limit).map((service) => ({
    name: service.service_name || "Unknown",
    revenue: service.total_revenue || 0,
    cost: service.total_cost || 0,
    profit: service.total_profit || 0,
    margin: service.avg_profit_margin_pct || 0,
    projects: service.project_count || 0,
    cumulativePercentage: service.cumulative_percentage || 0,
  }))

  return chartData
}

export const calculateClientTypeProfitability = (data) => {
  if (!data || !Array.isArray(data)) return []

  const clientTypeMap = {}

  data.forEach((service) => {
    const clientType = service.client_type || "Unknown"

    if (!clientTypeMap[clientType]) {
      clientTypeMap[clientType] = {
        clientType,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        projectCount: 0,
        serviceCount: 0,
      }
    }

    clientTypeMap[clientType].totalRevenue += service.total_revenue || 0
    clientTypeMap[clientType].totalCost += service.total_cost || 0
    clientTypeMap[clientType].totalProfit += service.total_profit || 0
    clientTypeMap[clientType].projectCount += service.project_count || 0
    clientTypeMap[clientType].serviceCount += 1
  })

  const clientTypeData = Object.values(clientTypeMap).map((ct) => ({
    name: ct.clientType,
    margin: ct.totalCost !== 0 ? (ct.totalProfit / ct.totalCost) * 100 : 0,
    revenue: ct.totalRevenue,
    cost: ct.totalCost,
    profit: ct.totalProfit,
    projects: ct.projectCount,
    services: ct.serviceCount,
  }))

  return clientTypeData.sort((a, b) => b.margin - a.margin)
}

export const formatMaterialParetoChartData = (data, limit = 10) => {
  if (!data || !Array.isArray(data)) {
    return []
  }

  const result = data.slice(0, limit).map((item) => ({
    name: item.material_name || "Unknown Material",
    cost: item.total_material_cost || 0,
    percentage: item.cost_percentage || 0,
    cumulativePercentage: item.cumulative_percentage || 0,
  }))

  return result
}

export const getMaterialCostPareto = (data) => {
  if (!data || !Array.isArray(data)) return []

  const categoryMap = {}

  data.forEach((item) => {
    const category = item.service_name || "Other"
    const materialCost = item.total_material_cost || 0

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        cost: 0,
        count: 0,
      }
    }

    categoryMap[category].cost += materialCost
    categoryMap[category].count += 1
  })

  let categories = Object.values(categoryMap)
    .map((cat) => ({
      name: cat.category,
      cost: cat.cost,
      itemCount: cat.count,
    }))
    .sort((a, b) => b.cost - a.cost)

  const totalCost = categories.reduce((sum, cat) => sum + cat.cost, 0)

  if (totalCost === 0) return []

  let cumulativeCost = 0
  categories = categories.map((cat) => {
    cumulativeCost += cat.cost
    return {
      ...cat,
      percentage: (cat.cost / totalCost) * 100,
      cumulativePercentage: (cumulativeCost / totalCost) * 100,
    }
  })

  return categories
}

export const prepareParetoChartData = (data, limit = 10) => {
  console.log("[prepareParetoChartData] input data:", data)
  console.log("[prepareParetoChartData] data length:", data?.length)

  const paretoData = getMaterialCostPareto(data)
  console.log("[prepareParetoChartData] paretoData result:", paretoData)

  const result = paretoData.slice(0, limit).map((item) => ({
    name: item.name,
    cost: item.cost,
    percentage: item.percentage,
    cumulativePercentage: item.cumulativePercentage,
  }))

  console.log("[prepareParetoChartData] final chart data:", result)
  return result
}

export const getTopCostDrivers = (data) => {
  const paretoData = getMaterialCostPareto(data)
  return paretoData.filter((item) => item.cumulativePercentage <= 80)
}

export const exportToCSV = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) return ""

  const headers = [
    "Service Name",
    "Project Count",
    "Total Revenue",
    "Total Cost",
    "Total Profit",
    "Avg Revenue per Project",
    "Avg Cost per Project",
    "Avg Profit Margin (%)",
    "Avg Profit per Project",
    "Cumulative Percentage",
  ]

  const rows = data.map((service) => [
    service.service_name || "",
    service.project_count || 0,
    service.total_revenue || 0,
    service.total_cost || 0,
    service.total_profit || 0,
    service.avg_revenue_per_project || 0,
    service.avg_cost_per_project || 0,
    service.avg_profit_margin_pct || 0,
    service.avg_profit_per_project || 0,
    service.cumulative_percentage || 0,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  return csvContent
}

export const getTopMaterialCostDrivers = (data) => {
  if (!data || !Array.isArray(data)) return []
  return data.filter((item) => item.cumulative_percentage && item.cumulative_percentage <= 80)
}

export default {
  getServiceProfitability,
  performKMeansClustering,
  prepareClusteringChartData,
  getClusterSummary,
  formatCurrency,
  formatPercentage,
  formatNumber,
  getTopServices,
  calculateTotalMetrics,
  getParetoServices,
  prepareChartData,
  calculateClientTypeProfitability,
  formatMaterialParetoChartData,
  getTopMaterialCostDrivers,
  getMaterialCostPareto,
  prepareParetoChartData,
  getTopCostDrivers,
  exportToCSV,
}