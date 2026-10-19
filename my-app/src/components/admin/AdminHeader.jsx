export default function AdminHeader({ title }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <p className="text-blue-400 uppercase tracking-widest text-sm">
          VoteSecure Admin
        </p>

        <h1 className="text-5xl font-bold mt-2">{title}</h1>
      </div>
    </header>
  );
}
