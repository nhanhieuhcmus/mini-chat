import { useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
    addUserService,
    removeUserService,
    renameGroupService,
    searchUserService,
} from "../../services/userService";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";

const UpdateGroupChatModalContainer = ({
    fetchMessages,
    fetchAgain,
    setFetchAgain,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const { data } = await searchUserService(search, user.token);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const { data } = await renameGroupService(
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                user.token
            );

            // setSelectedChat("");
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await addUserService(
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                user.token
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                // description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (
            selectedChat.groupAdmin._id !== user._id &&
            user1._id !== user._id
        ) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const { data } = await removeUserService(
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                user.token
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                // description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <UpdateGroupChatModal
            onOpen={onOpen}
            isOpen={isOpen}
            onClose={onClose}
            selectedChat={selectedChat}
            groupChatName={groupChatName}
            renameloading={renameloading}
            handleRename={handleRename}
            loading={loading}
            searchResult={searchResult}
            handleRemove={handleRemove}
            setGroupChatName={setGroupChatName}
            handleSearch={handleSearch}
            handleAddUser={handleAddUser}
            user={user}
        />
    );
};

export default UpdateGroupChatModalContainer;
