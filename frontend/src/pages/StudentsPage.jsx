import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { fetchStudents, addStudent, deleteStudent } from '../api';

export default function StudentsPage() {
  const { user } = useUser(); // get logged-in Clerk user
  const clerkId = user?.id;

  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load students
  async function load() {
    if (!clerkId) return; // wait for user to load
    try {
      setLoading(true);
      const data = await fetchStudents('name', clerkId);
      setStudents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [clerkId]); // reload when clerkId is ready

  // Add student
  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !clerkId) return;
    try {
      await addStudent(name.trim(), clerkId);
      setName('');
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  // Delete student
  async function handleDelete(id) {
    if (!confirm('Delete this student?') || !clerkId) return;
    try {
      await deleteStudent(id, clerkId);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!user) return <p>Loading user...</p>; // wait for Clerk user

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Students
      </h2>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="New student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white shadow-inner placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300 text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {students.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 text-center">No students yet</p>
          )}

          {students.map((s,index) => (
            <div
              key={s._id}
              className="flex justify-between items-center p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600"
            >
              <div className='flex items-center gap-4'>
                      <div className="font-semibold text-gray-500 dark:text-gray-300">{index + 1}.</div>

                <div className="font-semibold text-gray-800 dark:text-white mb-2 text-lg">
                  {s.name}
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    s.paid
                      ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                      : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
                  }`}
                >
                  {s.paid ? 'Paid' : 'Not Paid'}
                </span>
              </div>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow hover:scale-105 transition-all duration-300"
                onClick={() => handleDelete(s._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
