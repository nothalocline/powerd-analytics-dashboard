import { Info } from "lucide-react";

export const StatCard = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
          <Info className="w-3 h-3 text-secondary" />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};