const MotivationCard = ({ date, regret, quote }) => {
  return (
    <div className="p-4 rounded bg-gray-800 border border-gray-700 shadow-md">
      <p className="text-sm text-gray-400 mb-1">🗓️ {new Date(date).toDateString()}</p>
      <p className="italic text-red-400 font-medium">❌ {regret}</p>
      <p className="mt-2 text-green-300 font-semibold">💡 {quote}</p>
    </div>
  );
};

export default MotivationCard;
