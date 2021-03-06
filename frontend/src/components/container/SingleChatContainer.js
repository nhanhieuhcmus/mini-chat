import { toast } from "@chakra-ui/toast";
import { useEffect, useState } from "react";
import * as event from "../../constant/event/event";
import { ChatState } from "../../context/ChatProvider";
import { SocketState } from "../../context/SocketProvider";
import SingleChat from "../SingleChat";
import {
    getMessageByIdService,
    sendMessageService,
} from "../../services/chatService";

let selectedChatCompare;

const SingleChatContainer = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const { selectedChat, user, notification, setNotification } = ChatState();
    const { newMessage, setNewMessage, socket, istyping, typingHandler } =
        SocketState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            setLoading(true);

            const { data } = await getMessageByIdService(
                selectedChat._id,
                user.token
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

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit(event.STOP_TYPING, selectedChat._id);
            try {
                setNewMessage("");
                const { data } = await sendMessageService(
                    { content: newMessage, chatId: selectedChat },
                    user.token
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

    return (
        <SingleChat
            messages={messages}
            loading={loading}
            newMessage={newMessage}
            istyping={istyping}
            typingHandler={typingHandler}
            fetchMessages={fetchMessages}
            sendMessage={sendMessage}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
        />
    );
};

export default SingleChatContainer;
