import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import "../css/Main.css";
import db from '../firebase';
import { Avatar } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import MainRight from './MainRight';
import firebase from 'firebase';
import PaletteIcon from '@material-ui/icons/Palette';
import ThemeModal from './ThemeModal';

function Main() {

    const [room, setRoom] = useState(null);
    const user = useSelector(state => state.User.user);
    const [members, setMembers] = useState([]);
    const {roomId} = useParams();
    const [themeModal, setThemeModal] = useState(false);
    
    useEffect(() => {
        db.collection("rooms").doc(roomId).get().then((room) => {
            setRoom(room.data());
        }).catch(err => alert(err.message));
    }, []) 

    useEffect(() => {
        const unsubscribe = db.collection("rooms").doc(roomId).collection("members").onSnapshot(snap => {
            setMembers(snap.docs.map(doc => doc));
        });
        return () => {
            unsubscribe();
        }
    }, [])

    const MemberContainer = ({isPending, memberData}) => {
        const memberId = memberData.data().memberId;
        const [member, setMember] = useState();

        const isOwner = room?.roomOwner === user.email;
        const isMyOwn = room?.roomOwner === memberId;

        useEffect(() => {
            db.collection("users").doc(memberId).get().then(data => {
                setMember(data.data());
            }).catch(err => alert(err.message))
        }, [])

        const letHimIn = () => {
            db.collection("rooms").doc(roomId).collection("members").doc(memberData.id).update({
                isPending: false,
                isBlocked: false
            }).then(() => {
                db.collection("rooms").doc(roomId).collection("messages").add({
                    messageData: `${member.username} Joined the chat room!`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    messageType: "notification"
                }).catch(err => alert(err.message));
            }).catch(err => alert(err.message));
        }

        const blockHim = () => {
            db.collection("rooms").doc(roomId).collection("members").doc(memberData.id).update({
                isBlocked: true,
                isPending: true
            }).then(() => {
                db.collection("rooms").doc(roomId).collection("messages").add({
                    messageData: `${member.username} Blocked from the chat room!`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    messageType: "notification"
                }).catch(err => alert(err.message))
            }).catch(err => alert(err.message))
        }
        return(
            <p>
                <div className="main__memberInfoContainer">
                    <Avatar src={member?.photoURL} />
                    <p>{member?.username}</p>
                </div>
                <div className={`main__iconContainer ${isPending ? "main__iconContainer--pending" : ""}`}>
                    {isPending && isOwner && !isMyOwn && <CheckIcon onClick={letHimIn}/>}
                    {isOwner && !isMyOwn && <ClearIcon onClick={blockHim}/>}
                </div>
            </p>
        )
    }

    return (
        <div className="main__chatting">
            <ThemeModal themeModal={themeModal} setThemeModal={setThemeModal}/>
            <div className="main__chatting--left">
                <div className="main__leftTop">
                    <Avatar src={user?.photoURL}/>
                    <h3>{user?.username}</h3>
                    <PaletteIcon onClick={() => setThemeModal(true)} fontSize="large" style={{cursor: "pointer", marginLeft: "40px"}}/>
                </div>
                <div className="main__left--joined">
                    <h2>Joined Members</h2>
                    <div className="main__left--joinedMembers">
                        {members.filter(member => member.data().isPending === false && !member.data().isBlocked).map(person => <MemberContainer memberData={person}/>)}
                    </div>
                </div>
                <div className="main__left--pending">
                    <h2>Pending Members</h2>
                    <div className="main__left--pendingMembers">
                        {members.filter(member => member.data().isPending === true && !member.data().isBlocked).map(person => <MemberContainer isPending memberData={person}/>)}
                    </div>
                </div>
            </div>
            <div className="main__chatting--right">
                <MainRight room={room} roomId = {roomId}/>
            </div>
        </div>
    )
}

export default Main;