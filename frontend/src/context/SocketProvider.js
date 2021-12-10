import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import * as event from "../constant/event/event";
import { ChatState } from "./ChatProvider";
const SocketContext = createContext();
const ENDPOINT =
    process.env.REACT_APP_REQUEST_BASE_URL || "http://localhost:5000";

let socket;
socket = io(ENDPOINT);
const SocketProvider = ({ children }) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const { selectedChat, user } = ChatState();

    useEffect(() => {
        socket.emit(event.SETUP, user);
        socket.on(event.CONNECTED, () => setSocketConnected(true));
        socket.on(event.TYPING, () => setIsTyping(true));
        socket.on(event.STOP_TYPING, () => setIsTyping(false));
    }, []);

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit(event.TYPING, selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <SocketContext.Provider
            value={{
                newMessage,
                setNewMessage,
                istyping,
                typingHandler,
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

const SocketState = () => {
    return useContext(SocketContext);
};

export { SocketProvider, SocketState };
