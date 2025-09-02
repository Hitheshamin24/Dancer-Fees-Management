import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { fetchStudents, updateStudent } from "../api";

export default function UpdatePaymentsPage() {
  const { user } = useUser();
  const clerkId = user?.id;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // search state

  // Load students for this user
  async function load() {
    if (!clerkId) return;
    try {
      setLoading(true);
      const data = await fetchStudents("name", clerkId);
      setStudents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [clerkId]);

  // Toggle payment status
  async function togglePaid(s) {
    if (!clerkId) return;
    try {
      const updated = await updateStudent(s._id, { paid: !s.paid }, clerkId);
      setStudents((prev) => prev.map((p) => (p._id === s._id ? updated : p)));
    } catch (e) {
      setError(e.message);
    }
  }

  if (!user) return <p>Loading user...</p>;

  // Apply search filter
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Update Payment Details
      </h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white shadow-inner placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300"
        />
        <button
          onClick={() => {}} // optional, search is instant
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredStudents.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No matching students
            </p>
          )}

          {filteredStudents.map((s, index) => (
            <div
              key={s._id}
              className="flex justify-between items-center p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-4">
                <div className="font-semibold text-gray-500 dark:text-gray-300">
                  {index + 1}.
                </div>

                <div className="font-semibold text-gray-800 dark:text-white text-lg">
                  {s.name}
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    s.paid
                      ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                      : "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200"
                  }`}
                >
                  {s.paid ? "Paid" : "Not Paid"}
                </span>
              </div>
              <button
                className={`px-4 py-2 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  s.paid
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={() => togglePaid(s)}
              >
                {s.paid ? "Mark Not Paid" : "Mark Paid"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
