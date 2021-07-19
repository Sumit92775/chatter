import './App.css';
import {Route} from 'react-router-dom';
import Login from './Components/Pages/Login/Login';
import Profile from './Components/Pages/Profile/Profile';
import Signup from './Components/Pages/Signup/Signup';
import Chat from './Components/Pages/Chat/Chat';
import CreateGroup from './Components/Pages/CreateGroup/createGroup';


function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Login}></Route>
      <Route path="/signup" component={Signup}></Route>
      <Route path="/profile" component={Profile}></Route>
      <Route path="/chat" component={Chat} render={(props) => <Chat {...props}/>}></Route>
      <Route path="/createGroup" component={CreateGroup} render={(props) => <CreateGroup {...props}/>}></Route>

    </div>
  );
}

export default App;
