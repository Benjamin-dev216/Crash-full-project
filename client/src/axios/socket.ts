import io from "socket.io-client";

const socketInstance = io(import.meta.env.VITE_SOCKET_URL,{
    path: "/api/socket.io"
}); // Adjust to your backend URL

export default socketInstance;
