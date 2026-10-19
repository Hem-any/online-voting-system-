export default function StatCard({ title, value, icon, color = "blue" }) {
  const colors = {
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    green: "text-green-400 border-green-500/20 bg-green-500/10",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  };

  return (
    <div
      className={`rounded-2xl border p-6 transition hover:scale-105 ${colors[color]}`}
    >
      <div className="text-4xl mb-3">{icon}</div>

      <h3 className="text-gray-400 text-sm">{title}</h3>

      <p className="text-3xl font-bold mt-2 text-white">
        {value}
      </p>
    </div>
  );
}