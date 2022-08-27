import { useContext, useEffect } from "react";
import { useState } from "react"
import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import axios from "axios"
import { AuthContext } from "../../context/AuthContext";
import Rightbar from "../rightbar/Rightbar";
import CloseFriend from "../closeFriend/CloseFriend";

export default function Feed({ username, home, userProfile }) {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const allUsers = async () => {
            try {
                const Users = await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/all");
                setAllUsers(Users.data);
            } catch (err) {
                console.log(err);
            }
        }
        allUsers();
    }, [])

    let topUsers = [...allUsers];
    topUsers = topUsers.sort((a, b) => b.followers.length - a.followers.length).slice(0, 5);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = username ?
                await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/posts/profile/${username}`)
                : await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/posts/timeline/${user._id}`);
            setPosts(res.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }));
        }
        fetchPosts();

    }, [username, user])
    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share />}

                {(home && posts.length === 0) && <div className="topOnSocialMedia">
                    <h3 className="sidebarTitle">Most Followed</h3>
                    {topUsers.map((u) => (
                        <CloseFriend key={u._id} user={u} />
                    ))}
                </div>}
                {!home && <div className="feedRightbar">
                    <Rightbar user={userProfile} />
                </div>}

                {posts.map((p) => (
                    <Post key={p._id} post={p} home={home} />
                ))}


            </div>
        </div>
    )
}
