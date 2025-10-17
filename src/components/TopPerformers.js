import { ChevronRight } from "lucide-react";
import { topPerformers } from "../data/mockData";

export const TopPerformers = () => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-foreground mb-6">Top performers</h2>
      
      <div className="space-y-4">
        {topPerformers.map((performer) => (
          <div key={performer.id} className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              {performer.avatar}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{performer.name}</p>
              <p className="text-sm text-muted-foreground">{performer.handle}</p>
            </div>
            <span className="text-lg font-bold text-foreground">{performer.percentage}%</span>
          </div>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-2 text-foreground hover:text-primary transition-colors">
        <span className="font-medium">View More</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};