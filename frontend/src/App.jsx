import { Routes, Route, NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import StudentsPage from './pages/StudentsPage'
import UpdatePaymentsPage from './pages/UpdatePaymentsPage'
import PaymentDetailsPage from './pages/PaymentDetailsPage'
import LoginPage from './pages/Login'

function Nav({ onLogout }) {
  const linkClass = ({ isActive }) =>
    'px-4 py-2 rounded-lg transition-colors duration-300 font-medium ' +
    (isActive
      ? 'bg-blue-500 text-white shadow-lg'
      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700')

  return (
    <nav className="flex justify-center gap-4 my-6 flex-wrap">
      <NavLink to="/students" className={linkClass}>
        Students
      </NavLink>
      <NavLink to="/update" className={linkClass}>
        Update Payment
      </NavLink>
      <NavLink to="/details" className={linkClass}>
        Payment Details
      </NavLink>
      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </nav>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsLoggedIn(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
            Dance Fees
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Simple fee tracker — works on phone & PC
          </p>
        </div>
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="text-center py-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Dance Fees
        </h1>
        <small className="text-gray-500 dark:text-gray-300 text-lg">
          Simple fee tracker — online & works on phone/PC
        </small>
      </header>

      <Nav onLogout={handleLogout} />

      <main className="px-4 md:px-20 pb-10">
        <Routes>
          <Route path="/" element={<StudentsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/update" element={<UpdatePaymentsPage />} />
          <Route path="/details" element={<PaymentDetailsPage />} />
        </Routes>
      </main>
    </div>
  )
}
