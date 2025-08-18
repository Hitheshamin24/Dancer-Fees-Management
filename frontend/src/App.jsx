import { Routes, Route, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import StudentsPage from "./pages/StudentsPage";
import UpdatePaymentsPage from "./pages/UpdatePaymentsPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";
import LoginHandler from "./components/LoginHandler";
function Nav() {
  const linkClass = ({ isActive }) =>
    "px-4 py-2 rounded-lg transition-colors duration-300 font-medium " +
    (isActive
      ? "bg-blue-500 text-white shadow-lg"
      : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700");

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
      {/* Clerk logout / profile button */}
      <UserButton afterSignOutUrl="/" />
    </nav>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* When user is signed out → show SignIn route */}
     <SignedOut>
  <div className="min-h-screen flex flex-col items-center justify-center">
    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
      Dance Fees
    </h1>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Simple fee tracker — works on phone & PC
    </p>

    {/* Sign In button instead of full form */}
    <SignInButton mode="modal">
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
        Sign In
      </button>
    </SignInButton>
  </div>
</SignedOut>


      {/* When user is signed in → show app */}
      <SignedIn>
        <LoginHandler/>
        <header className="text-center py-6 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Dance Fees
          </h1>
          <small className="text-gray-500 dark:text-gray-300 text-lg">
            Simple fee tracker — online & works on phone/PC
          </small>
        </header>

        <Nav />

        <main className="px-4 md:px-20 pb-10">
          <Routes>
            <Route path="/" element={<StudentsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/update" element={<UpdatePaymentsPage />} />
            <Route path="/details" element={<PaymentDetailsPage />} />
          </Routes>
        </main>
      </SignedIn>
      
    </div>
  );
}
