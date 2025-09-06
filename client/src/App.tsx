import { useState, useEffect, createContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import Sidebar from "@/components/app/Sidebar";

import { apiFetch } from "@/utils/apiFetch";

export const SocketContext = createContext<ReturnType<typeof io> | null>(null);

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  // Socket.io setup
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
          `${import.meta.env.VITE_BACKEND_URL}/auth/validate-token`,
          {
            method: "POST",
          }
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
      setIsAuthenticated(true);
      const newSocket = io(import.meta.env.VITE_WS_SERVER_URL as string, {
        auth: {
          token,
        },
      });
      setSocket(newSocket);
    }
    verifyAuth();
  }, [navigate]);

  return (
    <>
      {isAuthenticated && (
        <div className="app-container flex h-screen ">
          <Sidebar />
          <SocketContext.Provider value={socket}>
            <Outlet></Outlet>
          </SocketContext.Provider>
        </div>
      )}
    </>
  );
}

export default App;
