import React, { useEffect, useRef } from "react";
import Game from "../components/Game";
import UserList from "../components/UserList";
import axiosInstance from "../axios/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Landing: React.FC = () => {
  const { setUserData } = useUserContext();
  const location = useLocation();

  const ranEffectRef = useRef(false);

  const showToastMessage = (msg: string) => {
    toast.error(msg, { position: "top-center" });
  };

  const saveUserData = (data: any) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUserData(data);
  };

  const handleAuth = async (endpoint: string, userId: number) => {
    try {
      const response = await axiosInstance.post(endpoint, {
        userId,
      });
      if (response.data) {
        saveUserData(response.data);
      } else {
        console.error("Authentication failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        showToastMessage(error.response.data.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "https://jackpot-junction.org/";
  };

  useEffect(() => {
    if (ranEffectRef.current) return; // block second run in dev
    ranEffectRef.current = true;
    const storedUser = localStorage.getItem("user");
    if (storedUser) return; // already logged in

    const params = new URLSearchParams(location.search);
    const userId = params.get("user_id");

    if (userId) {
      (async () => {
        await handleAuth("/auth/signin", Number(userId));
        window.history.replaceState({}, "", "/");
      })();
    }
  }, []);
  return (
    <div className="h-screen bg-[#090e2a] w-full md:min-w-[1400px] overflow-x-hidden relative">
      <div className="grid grid-cols-1 md:grid-cols-7 px-0 py-0 md:p-4 text-white min-h-screen gap-0 md:gap-4">
        <button
          onClick={handleLogout}
          className="px-1 py-0.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm bg-red-500 text-white rounded top-1 right-1 sm:top-4 sm:right-4 z-50 absolute"
        >
          Home
        </button>

        {/* Sidebar - UserList */}
        <div className="hidden md:block md:col-span-2 col-span-1 p-2 md:p-4">
          <UserList />
        </div>

        {/* Main Game */}
        <div className="md:col-span-5 col-span-1 p-2 md:p-4">
          <Game />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Landing;
