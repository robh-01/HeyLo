import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { apiFetch } from "@/utils/apiFetch";

function App() {
  const navigate = useNavigate();
  // Auth check on mount
  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const response = await apiFetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`
        );
        if (!response.ok) {
          navigate("/login", { replace: true });
          return;
        }
        const data = await response.json();
        if (data.status !== "success") {
          navigate("/login", { replace: true });
        }
      } catch {
        navigate("/login", { replace: true });
      }
    }
    verifyAuth();
  }, [navigate]);

  return (
    <>
      main app chat interface will be here
      <Outlet></Outlet>
    </>
  );
}

export default App;
