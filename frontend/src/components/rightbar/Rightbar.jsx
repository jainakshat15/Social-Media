import "./rightbar.css"
import { useContext, useEffect } from "react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Add, Edit, Remove } from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import CloseFriend from "../closeFriend/CloseFriend"
import { Modal } from "@mui/material"
import { EditProfileModal, FriendsModal } from "../post/Modals"

export default function Rightbar({ user }) {
    const navigate = useNavigate();

    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [followed, setFollowed] = useState(true);
    const [posts, setPosts] = useState(0);
    const [followers, setFollowers] = useState([]);


    useEffect(() => {
        const fetchPosts = async () => {
            const res = user?._id ?
                await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/posts/profile/${user?.username}`)
                : await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/posts/profile/${currentUser.username}`)
            setPosts(res.data.length);
        }
        fetchPosts();

    }, [user, currentUser])

    useEffect(() => {
        setFollowed(currentUser.followings.includes(user?._id))
    }, [user, currentUser])
    useEffect(() => {
        const getFriends = async () => {
            try {

                const friendList = user?._id ? await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/friends/" + user?._id) : await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/friends/" + currentUser._id)
                setFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        }
        getFriends();
    }, [user, currentUser])

    useEffect(() => {
        const getFollowers = async () => {
            try {

                const friendList = user?._id ? await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/followers/" + user?._id) : await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/followers/" + currentUser._id)
                setFollowers(friendList.data);
            } catch (err) {
                console.log(err);
            }
        }
        getFollowers();
    }, [user, currentUser])


    const HomeRightbar = () => {
        return (
            <>
                {/* <div className="birthdayContainer">
                    <img className="birthdayImg" src="assets/gift.png" alt="" />
                    <span className="birthdayText"><b>Keshav Khandelwal</b> and <b>3 other friends</b> have a birthday today.</span>
                </div> */}
                <h4 className="rightbarTitle">Followings</h4>
                {friends.length ? <ul className="rightbarFriendList">
                    {friends?.map((u) => (
                        // <Online key={u.id} user={u} />
                        <CloseFriend key={u._id} user={u} />
                    ))}
                </ul> : <span className="noText">You have no followings</span>}
            </>
        )
    }

    const ProfileRightbar = () => {
        const PF = process.env.REACT_APP_PUBLIC_FOLDER;
        const [showModal, setShowModal] = useState(false)
        const [showFriendsModal, setShowFriendsModal] = useState({
            type: '',
            status: false,
        })



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
            <>
                <Modal
                    open={showModal}
                    //className={classes.modal}
                    onClose={() => setShowModal(false)}
                >

                    <EditProfileModal onSuccess={() => setShowModal(false)} />
                </Modal>

                <Modal
                    open={showFriendsModal.status}
                    //className={classes.modal}
                    onClose={() => setShowFriendsModal({
                        type: '',
                        status: false
                    })}
                >
                    {showFriendsModal.type === "followings" ? <FriendsModal onSuccess={() => setShowFriendsModal({
                        type: '',
                        status: false
                    })} users={friends} /> : <FriendsModal onSuccess={() => setShowFriendsModal({
                        type: '',
                        status: false
                    })} users={followers} />}
                </Modal>

                <div className="profileName">
                    <h4 className="rightbarTitle name">{user?.name?.toUpperCase()}</h4>

                    {user.username !== currentUser.username ? (
                        <button className="rightbarFollowButton" onClick={handleClick}>
                            {followed ? "Unfollow" : "Follow"}
                            {followed ? <Remove /> : <Add />}

                        </button>
                    ) :
                        <button className="rightbarFollowButton edit" onClick={() => setShowModal(true)}>
                            Edit Profile <Edit />

                        </button>}

                </div>

                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoValue">{posts}</span>
                        <span className="rightbarInfoKey">Posts</span>

                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoValue">{followers.length}</span>
                        <span className="rightbarInfoKey">Followers</span>

                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoValue">{friends.length}</span>
                        <span className="rightbarInfoKey">Following</span>

                    </div>
                </div>

                <h4 className="rightbarTitle">User followings</h4>

                <div className="rightbarFollowings">
                    {friends.length ? friends.slice(0, 3).map((f) => (

                        <div className="rightbarFollowing" key={f._id} onClick={() => navigate('/profile/' + f.username)}>
                            <img
                                src={f.profilePicture.url ? f.profilePicture.url : PF + "person/noAvatar.png"}
                                alt=""
                                className="rightbarFollowingImg"
                            />
                            <span className="rightbarFollowingName">{f.username}</span>
                        </div>
                    )) : <span className="noText">This user has no followings</span>}

                </div>
                {friends.length > 3 && <button className="rightbarFollowButton edit" style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    onClick={() => setShowFriendsModal({
                        type: 'followings',
                        status: true
                    })}>
                    See all followings

                </button>}

                <h4 className="rightbarTitle" style={{ marginTop: '5px' }}>User followers</h4>
                <div className="rightbarFollowings">
                    {followers.length ? followers.slice(0, 3).map((f) => (

                        <div className="rightbarFollowing" key={f._id} onClick={() => navigate('/profile/' + f.username)}>
                            <img
                                src={f.profilePicture.url ? f.profilePicture.url : PF + "person/noAvatar.png"}
                                alt=""
                                className="rightbarFollowingImg"
                            />
                            <span className="rightbarFollowingName">{f.username}</span>
                        </div>
                    )) : <span className="noText">This user has no followers</span>}

                </div>
                {followers.length > 3 && <button className="rightbarFollowButton edit" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '5px' }}
                    onClick={() => setShowFriendsModal({
                        type: 'followers',
                        status: true
                    })}>
                    See all followers

                </button>}
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}
