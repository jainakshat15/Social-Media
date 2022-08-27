import { Add, Remove } from "@mui/icons-material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./closeFriend.css";
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function CloseFriend({ user, messenger }) {

    const [followed, setFollowed] = useState(true);
    const navigate = useNavigate();
    const { user: currentUser, dispatch } = useContext(AuthContext);

    useEffect(() => {
        setFollowed(currentUser.followings.includes(user?._id))
    }, [user, currentUser])

    const handleClick = async () => {
        try {

            if (followed) {
                await axios.put("https://socialmedia-jainakshat.herokuapp.com/api/users/" + user._id + "/unfollow", { userId: currentUser._id })
                dispatch({ type: "UNFOLLOW", payload: user._id })
            }
            else {
                await axios.put("https://socialmedia-jainakshat.herokuapp.com/api/users/" + user._id + "/follow", { userId: currentUser._id })
                dispatch({ type: "FOLLOW", payload: user._id })
            }
        } catch (err) {
            console.log(err);
        }

        setFollowed(!followed)
    }

    return (
        (messenger ? <li className="sidebarFriend" >
            <img className="sidebarFriendImg" src={user.profilePicture.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
            <span className="sidebarFriendName">{user.username}</span>
        </li> : <li className="sidebarFriend jcsb" >
            <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/profile/' + user.username)}>
                <img className="sidebarFriendImg" src={user.profilePicture.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
                <span className="sidebarFriendName">{user.username}</span>
            </div>

            {user.username !== currentUser.username && (
                <button className="closeFriendFollowButton" onClick={handleClick}>
                    {followed ? "Unfollow" : "Follow"}
                    {followed ? <Remove /> : <Add />}

                </button>)}
        </li>)

    );
}