import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

function LoginHandler() {
  const { user } = useUser();

  useEffect(() => {
    const saveUser = async () => {
      if (!user) return;

      const userData = {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName,
      };

      try {
        const res = await axios.post("http://localhost:8080/api/login", userData);
        console.log("User saved:", res.data.user);
      } catch (err) {
        console.error("Failed to save user:", err.response?.data || err.message);
      }
    };

    saveUser();
  }, [user]);

  return null;
}

export default LoginHandler;
