import { Route, Switch } from "react-router-dom";
import "./App.css";
import Chatpage from "./pages/Chatpage";
import Homepage from "./pages/Homepage";

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/" component={Homepage} exact />
                <Route path="/chats" component={Chatpage} />
            </Switch>
        </div>
    );
}

export default App;
