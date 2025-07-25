import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket"],
});

export default socket;