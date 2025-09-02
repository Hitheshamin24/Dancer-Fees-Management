import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { fetchPayments } from "../api";

export default function PaymentDetailsPage() {
  const { user } = useUser();
  const clerkId = user?.id;

  const [unpaid, setUnpaid] = useState([]);
  const [paid, setPaid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(""); // search state

  async function load() {
    if (!clerkId) return;
    try {
      setLoading(true);
      const data = await fetchPayments(clerkId);
      setUnpaid(data.unpaid || []);
      setPaid(data.paid || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [clerkId]);

  if (!user) return <p>Loading user...</p>;

  // Apply filtering based on search
  const filteredUnpaid = unpaid.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPaid = paid.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Payment Details
        </h2>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center">
          <input
            type="text"
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white shadow-inner placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300"
          />
          <button
            onClick={() => {}} // optional, search works instantly
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Loading...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="space-y-6">
            {/* Not Paid Section */}
            <section className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-800 dark:text-white">
                Not Paid
              </h3>
              {filteredUnpaid.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300 text-center">
                  No matching students 🎉
                </p>
              ) : (
                filteredUnpaid.map((s, index) => (
                  <div
                    key={s._id}
                    className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800 dark:text-white">
                      {index + 1}. {s.name}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium shadow">
                      Not Paid
                    </span>
                  </div>
                ))
              )}
            </section>

            {/* Paid Section */}
            <section className="bg-white dark:bg-gray-700 rounded-2xl p-5 shadow hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 text-gray-800 dark:text-white">
                Paid
              </h3>
              {filteredPaid.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300 text-center">
                  No matching paid students
                </p>
              ) : (
                filteredPaid.map((s, index) => (
                  <div
                    key={s._id}
                    className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-gray-800 dark:text-white">
                      {index + 1}. {s.name}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-medium shadow">
                      Paid
                    </span>
                  </div>
                ))
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
