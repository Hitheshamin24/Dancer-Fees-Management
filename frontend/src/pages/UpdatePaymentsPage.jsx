import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { fetchStudents, updateStudent } from "../api";

export default function UpdatePaymentsPage() {
  const { user } = useUser();
  const clerkId = user?.id;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Update Payment Details
      </h2>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Loading...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {students.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No students available
            </p>
          )}

          {students.map((s, index) => (
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
