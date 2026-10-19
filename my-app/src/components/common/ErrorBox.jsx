export default function ErrorBox({ message }) {
  return (
    <div className="bg-red-900/40 border border-red-700 text-red-300 p-3 rounded-lg">
      {message}
    </div>
  );
}