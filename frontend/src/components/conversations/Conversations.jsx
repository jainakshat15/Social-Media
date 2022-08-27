import axios from "axios";
import { useEffect, useState } from "react";
import "./conversations.css";

export default function Conversation({ conversation, currentUser, currentChat }) {
    const [user, setUser] = useState(null);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [current, setCurrent] = useState(currentChat);

    useEffect(() => {
        setCurrent(currentChat)
    }, [currentChat])

    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id);

        const getUser = async () => {
            try {
                const res = await axios("/users?userId=" + friendId);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, [currentUser, conversation]);

    return (
        (conversation === current) ? (
            <div className="conversation current">
                <img
                    className="conversationImg currentImg"
                    src={
                        user?.profilePicture?.url
                            ? user.profilePicture.url
                            : PF + "person/noAvatar.png"
                    }
                    alt=""

                />
                <span className="conversationName">{user?.username}</span>

            </div>
        ) : <div className="conversation">
            <img
                className="conversationImg"
                src={
                    user?.profilePicture?.url
                        ? user.profilePicture.url
                        : PF + "person/noAvatar.png"
                }
                alt=""
            />
            <span className="conversationName">{user?.username}</span>
        </div>

    );
}