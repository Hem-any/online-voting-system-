export default function AdminActions({
  onAddElection,
  onAddCandidate,
  onManageUsers,
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-10">

      <button
        onClick={onAddElection}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
      >
        + Add Election
      </button>

      <button
        onClick={onAddCandidate}
        className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold transition"
      >
        + Add Candidate
      </button>

      <button
        onClick={onManageUsers}
        className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-xl font-semibold transition"
      >
        Manage Users
      </button>

    </div>
  );
}