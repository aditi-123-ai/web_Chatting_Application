import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from './components/Login';
import { useEffect } from 'react';
import db, { auth } from './firebase';
import { useDispatch } from 'react-redux';
import { logoutUser, setUser } from './redux/users/userAction';
import Main from "./components/Main";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if(authUser){
        //log in
        dispatch(setUser({
          username: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL,
          uid: authUser.uid
        }));

        db.collection("users").doc(authUser.email).set({
          username: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL,
          uid: authUser.uid
        }).catch(err => alert(err.message));

      }else{
        //log out
        dispatch(logoutUser());
      }
    });
    return () => {
      unsubscribe();
    }
  })

  
//1:42:36
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/main/:roomId">
            <Main/>
          </Route>
          <Route path="/">
            <Login/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
