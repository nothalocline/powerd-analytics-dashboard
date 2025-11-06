import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const ServiceTypePieChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = process.env.REACT_APP_ATHENA_API_ENDPOINT;

        if (!endpoint) {
          throw new Error("API endpoint not configured");
        }

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const result = await response.json();

        // Some Lambda responses wrap data in `body` as a string, handle that case
        const parsedData = Array.isArray(result) ? result : JSON.parse(result.body || "[]");

        setData(parsedData);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name} ${value}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value}%`}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />

      </PieChart>
    </ResponsiveContainer>
  );
};