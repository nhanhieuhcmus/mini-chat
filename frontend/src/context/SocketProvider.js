import { createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext();
const ENDPOINT =
    process.env.REACT_APP_REQUEST_BASE_URL || "http://localhost:5000";
let socket, selectedChatCompare;
const SocketProvider = ({ children }) => {
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    return (
        <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>
    );
};

const SocketState = () => {
    return useContext(SocketContext);
};

export { SocketProvider, SocketState };
