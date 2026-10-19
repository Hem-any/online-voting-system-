export default function UserTable({ users }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">

      <table className="w-full">

        <thead>

          <tr className="border-b border-gray-800">
  
            <th className="px-5 py-4 text-left">
              Name
            </th>

            <th>Email</th>

            <th>Role</th>
            

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr
              key={user.id}
              className="border-b border-gray-800"
            >

              <td className="px-5 py-3">
                {user.name}
              </td>

              <td>{user.email}</td>

              <td>{user.role}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}