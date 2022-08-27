import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId }) {
    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const getFriends = async () => {
            const res = await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/friends/" + currentId);
            setFriends(res.data);
        };

        getFriends();
    }, [currentId]);

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    }, [friends, onlineUsers]);


    return (
        <div className="chatOnline">
            {onlineFriends.length ? onlineFriends.map((o) => (
                <div key={o._id} className="chatOnlineFriend">
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src={
                                o?.profilePicture?.url
                                    ? o?.profilePicture?.url
                                    : PF + "person/noAvatar.png"
                            }
                            alt=""
                        />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{o?.username}</span>
                </div>
            )) : <span className="noText noOnlineText">No Active users</span>}
        </div>
    );
}