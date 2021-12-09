import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false);

    const history = useHistory();

    useEffect(() => {
        let userInfo;
        const unlistener = history.listen((location) => {
            console.log(location);
            userInfo = JSON.parse(localStorage.getItem("userInfo"));
            setUser(userInfo);
        });
        if (!userInfo) history.push("/");
        return unlistener;
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
                fetchAgain,
                setFetchAgain,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const ChatState = () => {
    return useContext(ChatContext);
};

export { ChatContext, ChatProvider, ChatState };
