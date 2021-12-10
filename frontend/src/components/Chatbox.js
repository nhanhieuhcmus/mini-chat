import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatProvider";
import { SocketProvider } from "../context/SocketProvider";
import SingleChatContainer from "./container/SingleChatContainer";
import "../styles/styles.css";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <SocketProvider>
            <Box
                d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
                alignItems="center"
                flexDir="column"
                p={3}
                bg="white"
                w={{ base: "100%", md: "68%" }}
                borderRadius="lg"
                borderWidth="1px"
            >
                <SingleChatContainer
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                />
            </Box>
        </SocketProvider>
    );
};

export default Chatbox;
