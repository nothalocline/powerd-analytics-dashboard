export const UpgradeCard = () => {
  return (
    <div className="bg-gradient-to-br from-muted/60 to-muted/40 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="w-10 h-10 mb-4 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
        RG
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-1">
        <span className="text-primary">Upgrade</span> Your Crowd
      </h3>
      <p className="text-sm text-muted-foreground mb-4">Pro plan for better results</p>
      
      <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 py-2">
        NOW
      </button>

      <div className="absolute -right-4 -top-4 w-32 h-32 opacity-30">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="8" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="#F7B731" strokeWidth="8" />
        </svg>
      </div>
    </div>
  );
};