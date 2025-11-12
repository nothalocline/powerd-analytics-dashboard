export const StatCard = ({ label, value }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}