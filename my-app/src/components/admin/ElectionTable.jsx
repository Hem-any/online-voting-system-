export default function ElectionTable({
  elections,
  onToggle,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800">

      <table className="w-full">

        <thead>

          <tr className="border-b border-gray-800">

            <th className="text-left px-6 py-4">
              Election
            </th>

            <th>Status</th>

            <th>Candidates</th>

            <th>Votes</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {elections.map((election) => (

            <tr
              key={election.id}
              className="border-b border-gray-800 hover:bg-gray-800"
            >

              <td className="px-6 py-4">
                {election.title}
              </td>

              <td className="text-center">
                {election.status}
              </td>

              <td className="text-center">
                {election.candidates ? election.candidates.length : 0}
              </td>

              <td className="text-center">
                {election.candidates ? election.candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0) : 0}
              </td>

              <td className="text-center py-4">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => onToggle(election.id)}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => onDelete(election.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}