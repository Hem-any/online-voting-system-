import { useState } from "react";

export default function ElectionForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!title || !description || !endDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await onCreate({
        title,
        description,
        endDate,
      });
    } catch (error) {
      console.error("Error creating election:", error);
      alert("Failed to create election");
    } finally {
      setLoading(false);
    }

    setTitle("");
    setDescription("");
    setEndDate("");
  };

  return (
    <form
      onSubmit={submit}
      className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8"
    >
      <h2 className="text-xl font-bold mb-5">
        Create Election
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Election Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-3 outline-none"
          disabled={loading}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-3 outline-none"
          disabled={loading}
        />

      </div>

      <textarea
        placeholder="Election Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-gray-800 rounded-lg px-4 py-3 mt-4 outline-none"
        rows="3"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Election"}
      </button>
    </form>
  );
}