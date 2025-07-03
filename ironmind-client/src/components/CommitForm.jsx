import { useState, useEffect } from "react";
import {
  createCommit,
  getTodayCommits,
  markCommitComplete,
  deleteCommit,
  updateCommit,
} from "../services/api";

const CommitForm = () => {
  const userId = "sk";

  const [focus, setFocus] = useState("");
  const [reason, setReason] = useState("");
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [editFocus, setEditFocus] = useState("");
  const [editReason, setEditReason] = useState("");

  const fetchCommits = async () => {
    try {
      const res = await getTodayCommits(userId);
      const sorted = res.data.sort((a, b) => a.completed - b.completed);
      setCommits(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch commits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommit({ userId, focus, reason });
      setFocus("");
      setReason("");
      fetchCommits();
    } catch (err) {
      console.error("❌ Failed to commit:", err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await markCommitComplete(id);
      fetchCommits();
    } catch (err) {
      console.error("❌ Failed to complete task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCommit(id);
      fetchCommits();
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const handleEditStart = (commit) => {
    setEditId(commit._id);
    setEditFocus(commit.focus);
    setEditReason(commit.reason);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditFocus("");
    setEditReason("");
  };

  const handleEditSave = async (id) => {
    try {
      await updateCommit(id, { focus: editFocus, reason: editReason });
      handleEditCancel();
      fetchCommits();
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-bold text-lg">What will you focus on today?</label>
        <input
          type="text"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          className="border border-white p-2 rounded-xl text-white bg-transparent"
          required
        />
        <label className="font-bold text-lg">Why does it matter to you?</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border border-white p-2 rounded-xl text-white bg-transparent"
          rows={3}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Goal
        </button>
      </form>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold mb-2">🧠 Today's Focus Goals</h2>
        {loading ? (
          <p>Loading...</p>
        ) : commits.length === 0 ? (
          <p className="text-gray-400">No goals committed yet.</p>
        ) : (
          commits.map((commit) => (
            <div
              key={commit._id}
              className={`p-4 rounded border flex flex-col gap-2 ${
                commit.completed
                  ? "border-green-500 bg-green-800"
                  : "border-gray-600 bg-gray-800"
              }`}
            >
              {editId === commit._id ? (
                <>
                  <input
                    type="text"
                    value={editFocus}
                    onChange={(e) => setEditFocus(e.target.value)}
                    className="border border-white p-2 rounded-xl text-white bg-transparent"
                  />
                  <textarea
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    className="border border-white p-2 rounded-xl text-white bg-transparent"
                    rows={2}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditSave(commit._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3
                      className={`font-bold ${
                        commit.completed ? "line-through text-green-300" : ""
                      }`}
                    >
                      {commit.focus}
                    </h3>
                    <p className="text-sm text-gray-300">{commit.reason}</p>
                  </div>
                  {!commit.completed && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(commit._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => handleEditStart(commit)}
                        className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(commit._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommitForm;
