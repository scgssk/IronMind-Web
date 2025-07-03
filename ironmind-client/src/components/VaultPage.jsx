import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";

const VaultPage = () => {
  const userId = "sk"; // 🔐 Replace with dynamic ID once auth is added
  const [motivs, setMotivs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotivationVault = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/motivation/${userId}`
        );
        setMotivs(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch motivation vault:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMotivationVault();
  }, []);

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        💼 Motivation Vault
      </h2>
      {motivs.length > 0 && (
        <button
          onClick={() => {
            const random = motivs[Math.floor(Math.random() * motivs.length)];
            alert(`⚡ "${random.quote}"\n\n(based on: "${random.regret}")`);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded mb-6 hover:bg-purple-700"
        >
          🎯 Hit Me with Motivation
        </button>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : motivs.length === 0 ? (
        <p className="text-center text-gray-500">
          No motivational history yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {motivs.map((item) => (
            <div
              key={item._id}
              className="border border-blue-500 bg-gray-800 p-4 rounded-md"
            >
              <p className="text-sm text-gray-400 mb-1">
                {new Date(item.date).toLocaleString()}
              </p>
              <p className="text-white font-semibold">
                ❌ Regret: {item.regret}
              </p>
              <p className="text-green-400 mt-2">⚡ Quote: “{item.quote}”</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default VaultPage;
