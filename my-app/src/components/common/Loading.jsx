export default function Loading({ text = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gray-950">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-gray-400">{text}</p>
      </div>
    </div>
  );
}