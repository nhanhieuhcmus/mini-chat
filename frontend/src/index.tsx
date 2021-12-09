import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ChatProvider } from "./context/ChatProvider";
// import { SocketProvider } from "./context/SocketProvider";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import dotenv from "dotenv";
dotenv.config();

ReactDOM.render(
    <BrowserRouter>
        <ChatProvider>
            {/* <SocketProvider> */}
            <ChakraProvider>
                <App />
            </ChakraProvider>
            {/* </SocketProvider> */}
        </ChatProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
