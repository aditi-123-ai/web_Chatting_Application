import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import "../css/Login.css";
import db, { auth, provider } from '../firebase';
import { useState } from 'react';
import { useRef } from 'react';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';

function Login() {
    const user = useSelector(state => state.User.user);
    const [modalOpen, setModalOpen] = useState(false);
    const [joinModal, setJoinModal] = useState(false);
    const [waitingModal, setWatingModal] = useState(false);
    const roomNameRef = useRef("");
    const history = useHistory();

    useEffect(() => {
        const joiningRoomId = localStorage.getItem("roomId")
        if(waitingModal){
            db.collection("rooms")
            .doc(joiningRoomId)
            .collection("members")
            .where("memberId", "==", user.email)
            .onSnapshot(snap => {
                snap.docs.map(doc => {
                    if(!doc.data().isPending){
                        history.push(`/main/${joiningRoomId}`);
                    }else if(doc.data().isBlocked){
                        history.push("/");
                        alert("You are blocked from this chatroom...")
                    }
                })
            })
        }
    },[waitingModal])

    const handalOpen = () => {
        setModalOpen(true);
    };

    const handalClose = () => {
        setModalOpen(false);
        setJoinModal(false);
    };

    const handleJoin = () => {
        setJoinModal(true);
    }

    const loginUser = () => {
        if(user){
            auth.signOut().catch((err) => alert(err.message));
        }else{
        auth.signInWithPopup(provider).catch(err => alert(err.message))
        }
    }

    const makeARoom = () => {
        const randomString = Math.random().toString(36).substring(2,7);
        db.collection("rooms")
          .doc(user.uid + randomString)
          .set({
            roomName: roomNameRef.current.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            roomOwner: user.email,
            roomUniqueId: user.uid + randomString,
            photoUrl: user.photoURL
        }).then(() => {
            db.collection("rooms")
              .doc(user.uid + randomString)
              .collection("members")
              .add({
            memberId: user.email,
            isPending: false,
            isBlocked: false,
        })
            handalClose();
            history.push(`/main/${user.uid + randomString}`);
        }).catch((err) => alert(err.message))
    }

    const joinRoom = () => {
        const joiningRoomId = roomNameRef.current.value;
        db.collection("rooms")
          .doc(joiningRoomId)
          .collection("members")
          .add({
            memberId: user.email,
            isPending: true,
            isBlocked: false,
        }).then(() => {
            handalClose();
            setWatingModal(true);
            localStorage.setItem("roomId", joiningRoomId)
        }).catch(err => alert(err.message));
    }

    const RoomModal = ({join}) => {
        return(
            <div className="roomModal">
                <div onClick={handalClose} className="roomModal__outer">
                </div>
                <div className="roomModal__inner">
                    <input ref={roomNameRef} type="text" placeholder={join ? "Enter Room Id" : "Enter Room Name"} />
                    <button onClick={join ? joinRoom : makeARoom}>{join ? "Join Room" : "Create Room"}</button>
                </div>
            </div>
        )
    }

    const WaitHerModal = () => {
        return(
            <div className="roomModal">
                <div onClick={handalClose} className="roomModal__outer">
                </div>
                <div className="roomModal__inner">
                    <h1>Waiting For Approval...</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="login">
            {modalOpen && <RoomModal/>}
            {joinModal && <RoomModal join/>}
            {waitingModal && <WaitHerModal/>}
            <div className="login__middle">
                <div className="login_RoomBox">
                    <button onClick={handalOpen} disabled={!user} className="login_createBtn">CREATE A ROOM</button>
                    <button onClick={handleJoin} disabled={!user} className="login_joinBtn">JOIN A ROOM</button>
                </div>
                <div className="login__gmailBox">
                    <button onClick={loginUser}><img src="https://img.icons8.com/fluent/50/000000/google-logo.png" alt="" />
                    {user ? "Logout" : "Login With Google"}</button>
                </div>
            </div>
        </div>
    )
}

export default Login
