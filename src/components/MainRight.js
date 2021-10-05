import React, { useEffect, useRef, useState } from 'react';
import "../css/MainRight.css";
import { Avatar } from '@material-ui/core';
import moment from 'moment';
import ShareIcon from '@material-ui/icons/Share';
import SendIcon from '@material-ui/icons/Send';
import db from '../firebase';
import firebase from 'firebase';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';



function MainRight({room, roomId}) {

    const history = useHistory();
    const messageRef = useRef();
    const user = useSelector(state => state.User.user);
    const roomCreatedAt = moment(room?.timestamp?.toDate()).fromNow();
    const [message, setMessage] = useState([]);
    const messageEndRef = useRef(null);
    


    const scrollToBottom = () => {
        messageEndRef?.current.scrollIntoView({behavior: "smooth"})
    }

    useEffect(() => {
        scrollToBottom();
    }, [message])

    const MessageBox = ({ messageData}) => {
        const messageTimestamp = moment(messageData.timestamp?.toDate()).format('LT');
        const myMessage = messageData.ownerId === user.uid;

        if(messageData.messageType == "notification"){
            return(
                <div className="messageBox messageNotification">
                    <h1>{messageData.messageData}</h1>
                </div>
            )
        }

        return(
            <div className={`messageBox ${myMessage ? "messageBox__myMsg" : ""}`}>
                <div className="messageBox__avatar">
                    <Avatar src={messageData.ownerAvatar}/>
                </div>
                <div className="messageBox__message">
                    <div className="messageBox__message--owner">
                        <p>{messageData.ownerUsername}</p>
                        <div className="messageBox__message--message">
                            <p>{messageData.messageData}</p>
                        </div>
                        <div className="messageBox__message--time">
                            <p>{messageTimestamp}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const sendMessageUsingEnter = (e) =>{
        if(e.key === "Enter"){
            sendMessage();
        }
    }

    const sendMessage = () => {
        db.collection("rooms").doc(roomId).collection("messages").add({
            messageData: messageRef.current.value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            ownerId: user.uid,
            ownerUsername: user.username,
            ownerAvatar: user.photoURL 
        }).catch(err => alert(err.message));
        messageRef.current.value = "";
    }

    useEffect(() => {
        db.collection("rooms").doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot(snap => {
            setMessage(snap.docs.map(snap => snap.data()));
        })
    }, [roomId])

    const leaveTheRoom = () => {
        db.collection("rooms").doc(roomId).collection("members").where("memberId", "==", user.email).get().then(doc => {
            doc.docs.map(doc => {
                db.collection("rooms")
                  .doc(roomId)
                  .collection("members")
                  .doc(doc.id)
                  .delete()
                  .then(() => {
                    db.collection("rooms").doc(roomId).collection("messages").add({
                        messageData: `${user.username} has left the chat room!`,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        messageType: "notification"
                    }).catch(err => alert(err.message))
                    history.push("/");
                  })
                  .catch(err => alert(err.message));
            })
        })
    }
    
   

    return (
        <div className="mainRight">
            <div className="mainRight__header">
                <div className="mainRight__header--share">
                    
                    <ShareIcon style={{cursor: "pointer"}}/>
                    <button onClick={leaveTheRoom}>Leave Room</button>
                </div>
                <div className="mainRight__header--profile">
                    <Avatar src={room?.photoUrl}/>
                </div>
                <div className="mainRight__header--details">
                    <h3>{room?.roomName}</h3>
                    <p>Created { roomCreatedAt }</p>
                </div>
            </div>
            <div className="mainRight__messageArea">
                <img src="https://www.filepicker.io/api/file/u5frNNlBQDQbBX0nh9Mg"/>
                {message?.map(message => <MessageBox messageData={message}/>)}
                <div ref={messageEndRef}/>
            </div>
            <div className="mainRight__inputArea">
                <div className="mainRight__inputContainer">
                    <input ref={messageRef} onKeyDown={sendMessageUsingEnter} type="text" placeholder="Enter Your Message.." />
                    <SendIcon onClick={sendMessage} style={{ color: "white", cursor: "pointer"}}/>
                </div>
            </div>
        </div>
    )
}

export default MainRight;
