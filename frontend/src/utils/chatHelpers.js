import axios from "axios";

const fetchChats = async (user, setChats) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.get(
            "http://localhost:5000/api/chat",
            config
        );

        setChats(data);
    } catch (error) {
        console.log(error);
    }
};

export { fetchChats };
