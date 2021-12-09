import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { ChatState } from "./ChatProvider";
import * as event from "../constant/event/event";
import axios from "../config/axios";
import { toast } from "@chakra-ui/toast";
const SocketContext = createContext();
const ENDPOINT =
    process.env.REACT_APP_REQUEST_BASE_URL || "http://localhost:5000";

let socket, selectedChatCompare;
socket = io(ENDPOINT);
const SocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const {
        selectedChat,
        user,
        notification,
        setNotification,
        fetchAgain,
        setFetchAgain,
    } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `http://localhost:5000/api/message/${selectedChat._id}`,
                config
            );

            setMessages(data);
            setLoading(false);

            socket.emit(event.JOIN_CHAT, selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        socket.emit(event.SETUP, user);
        socket.on(event.CONNECTED, () => setSocketConnected(true));
        socket.on(event.TYPING, () => setIsTyping(true));
        socket.on(event.STOP_TYPING, () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on(event.MESSAGE_RECEIVED, (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit(event.STOP_TYPING, selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "http://localhost:5000/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit(event.NEW_MESSAGE, data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

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
                messages,
                loading,
                newMessage,
                istyping,
                typingHandler,
                fetchMessages,
                sendMessage,
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
