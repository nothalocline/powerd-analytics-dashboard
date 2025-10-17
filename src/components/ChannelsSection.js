import { channelsData } from "../data/mockData";
import { ChevronRight } from "lucide-react";

export const ChannelsSection = () => {
  return (
    <div className="bg-muted/40 rounded-2xl p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Channels</h2>
        <p className="text-muted-foreground">
          Your channels statistics for <span className="font-semibold">1 week</span> period.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {channelsData.map((channel) => (
          <div key={channel.id} className="bg-card rounded-2xl p-6 shadow-sm">
            <div className={`w-12 h-12 ${channel.color} rounded-full flex items-center justify-center mb-4`}>
              <span className="text-white font-bold text-lg">
                {channel.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <h3 className="font-bold text-foreground mb-1">{channel.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{channel.handle}</p>
            <p className="text-2xl font-bold text-foreground">
              {channel.change}
              <span className="text-base ml-1">%</span>
            </p>
          </div>
        ))}

        <div className="bg-secondary rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <button className="text-white hover:opacity-90 transition-opacity">
            <h3 className="text-xl font-bold mb-2">Full Stats</h3>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};