import { useState } from "react";
import { Building, MapPin, Users, DollarSign, Clock, Play, BarChart3, Wrench } from "lucide-react";

export default function ProjectInput() {
  const [formData, setFormData] = useState({
    serviceType: "",
    location: "",
    clientType: "",
    budget: "",
    timeline: "",
  });

  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setResults({
        costForecast: {
          materials: Math.round(parseFloat(formData.budget) * 0.4),
          labor: Math.round(parseFloat(formData.budget) * 0.35),
          overhead: Math.round(parseFloat(formData.budget) * 0.15),
          profit: Math.round(parseFloat(formData.budget) * 0.1),
        },
        timelineForecast: {
          planning: Math.round(parseFloat(formData.timeline) * 0.2),
          execution: Math.round(parseFloat(formData.timeline) * 0.7),
          completion: Math.round(parseFloat(formData.timeline) * 0.1),
        },
        laborAllocation: {
          electricians: 3,
          apprentices: 2,
          projectManager: 1,
        },
        paymentStructure: {
          deposit: "30%",
          milestone1: "40%",
          completion: "30%",
        },
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen rounded-2xl bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Input & Simulation</h1>
          <p className="text-muted-foreground">Enter project details to generate forecasts and recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Project Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select service type</option>
                  <option value="residential-wiring">Residential Wiring</option>
                  <option value="commercial-electrical">Commercial Electrical</option>
                  <option value="panel-upgrade">Panel Upgrade</option>
                  <option value="lighting-installation">Lighting Installation</option>
                  <option value="emergency-repair">Emergency Repair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter project location"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Client Type
                </label>
                <select
                  name="clientType"
                  value={formData.clientType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select client type</option>
                  <option value="hoa">HOA</option>
                  <option value="individual">Individual</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Proposed Budget (₱)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter proposed budget"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Expected Timeline (days)
                </label>
                <input
                  type="number"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  placeholder="Enter expected timeline in days"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Running Model...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Simulation
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="bg-card rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Model Results
            </h2>

            {!results ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted" />
                <p>Submit project details to see forecasts and recommendations</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Cost Forecast</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Materials:</span>
                      <span className="font-medium text-foreground">₱{results.costForecast.materials.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Labor:</span>
                      <span className="font-medium text-foreground">₱{results.costForecast.labor.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overhead:</span>
                      <span className="font-medium text-foreground">₱{results.costForecast.overhead.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-muted-foreground">Profit:</span>
                      <span className="font-medium text-green-600">₱{results.costForecast.profit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Timeline Forecast</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Planning:</span>
                      <span className="font-medium text-foreground">{results.timelineForecast.planning} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Execution:</span>
                      <span className="font-medium text-foreground">{results.timelineForecast.execution} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completion:</span>
                      <span className="font-medium text-foreground">{results.timelineForecast.completion} days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Optimized Labor Allocation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Electricians:</span>
                      <span className="font-medium text-foreground">{results.laborAllocation.electricians}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Apprentices:</span>
                      <span className="font-medium text-foreground">{results.laborAllocation.apprentices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project Manager:</span>
                      <span className="font-medium text-foreground">{results.laborAllocation.projectManager}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Suggested Payment Structure</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit:</span>
                      <span className="font-medium text-foreground">{results.paymentStructure.deposit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Milestone Payment:</span>
                      <span className="font-medium text-foreground">{results.paymentStructure.milestone1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Final Payment:</span>
                      <span className="font-medium text-foreground">{results.paymentStructure.completion}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}