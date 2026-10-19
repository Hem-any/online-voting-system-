import { useState } from "react";

export default function CandidateForm({ onSave, elections }) {
  const [candidate, setCandidate] = useState({
    name: "",
    role: "",
    party: "",
    electionId: elections?.[0]?.id || "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!candidate.name || !candidate.role || !candidate.electionId) {
      setError("Please enter candidate name, role, and select an election.");
      return;
    }

    try {
      setLoading(true);
      await onSave({
        name: candidate.name,
        role: candidate.role,
        party: candidate.party,
        electionId: candidate.electionId,
        bio: candidate.bio,
      });
    } catch (error) {
      console.error("Error saving candidate:", error);
      setError("Failed to save candidate");
    } finally {
      setLoading(false);
    }

    setCandidate({
      name: "",
      role: "",
      party: "",
      electionId: elections?.[0]?.id || "",
      bio: "",
    });
    setError("");
  };

  return (
    <form
      onSubmit={submit}
      className="bg-gray-900 rounded-xl border border-gray-800 p-6"
    >
      <h2 className="text-xl font-bold mb-5">Add Candidate</h2>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          placeholder="Candidate Name"
          value={candidate.name}
          onChange={(e) =>
            setCandidate({
              ...candidate,
              name: e.target.value,
            })
          }
          className="w-full bg-gray-800 rounded-lg px-4 py-3 outline-none"
          disabled={loading}
        />

        <input
          placeholder="Role / Position"
          value={candidate.role}
          onChange={(e) =>
            setCandidate({
              ...candidate,
              role: e.target.value,
            })
          }
          className="w-full bg-gray-800 rounded-lg px-4 py-3 outline-none"
          disabled={loading}
        />

        <input
          placeholder="Party"
          value={candidate.party}
          onChange={(e) =>
            setCandidate({
              ...candidate,
              party: e.target.value,
            })
          }
          className="w-full bg-gray-800 rounded-lg px-4 py-3 outline-none"
          disabled={loading}
        />

        <select
          value={candidate.electionId}
          onChange={(e) =>
            setCandidate({
              ...candidate,
              electionId: e.target.value,
            })
          }
          className="w-full bg-gray-800 rounded-lg px-4 py-3 outline-none"
          disabled={loading}
        >
          <option value="">Select Election</option>
          {elections?.map((election) => (
            <option key={election.id} value={election.id}>
              {election.title}
            </option>
          ))}
        </select>
      </div>

      <textarea
        rows="4"
        placeholder="Campaign summary"
        value={candidate.bio}
        onChange={(e) =>
          setCandidate({
            ...candidate,
            bio: e.target.value,
          })
        }
        className="w-full bg-gray-800 rounded-lg px-4 py-3 mt-4 outline-none"
        disabled={loading}
      />

      {error && <p className="text-red-400 mt-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Candidate"}
      </button>
    </form>
  );
}
