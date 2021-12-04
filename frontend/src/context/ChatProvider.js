import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();
console.log(">> jumped into ChatProvider !!");
const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);
    const [test, setTest] = useState("Test value");

    const history = useHistory();

    useEffect(() => {
        let userInfo;
        const unlistener = history.listen((location) => {
            console.log(">>check location changed in ChatProvider: ", location);
            userInfo = JSON.parse(localStorage.getItem("userInfo"));
            setUser(userInfo);
        });
        if (!userInfo) history.push("/");
        return unlistener;
        // console.log(">>history changed in ChatProvider", history);
        // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // console.log(">> check userInfo in ChatProvider: ", userInfo);
        // setUser(userInfo);
    }, [history]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
                test,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const ChatState = () => {
    console.log(">>Jumped into ChatState in ChatProvider");
    return useContext(ChatContext);
};

export { ChatContext, ChatProvider, ChatState };
