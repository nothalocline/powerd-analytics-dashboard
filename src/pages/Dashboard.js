import { Bell, Settings } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { StatCard } from "../components/StatCard";
import { ActivityChart } from "../components/ActivityChart";
import { TopPerformers } from "../components/TopPerformers";
import { ChannelsSection } from "../components/ChannelsSection";
import { UpgradeCard } from "../components/UpgradeCard";
import { statsData } from "../data/mockData";

const Index = () => {
  return (
    <div className="flex min-h-screen rounded-2xl bg-background">
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted/40 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted/40 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {statsData.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
            <UpgradeCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <ActivityChart />
            </div>
            <TopPerformers />
          </div>

          <ChannelsSection />
        </div>
      </main>
    </div>
  );
};

export default Index;