import React from 'react'
import { MoreVert } from "@mui/icons-material"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Menu, MenuItem } from "@mui/material"
import "./comment.css"
import { toast } from 'react-toastify';


export default function Comment({ comment }) {
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [commentUser, setCommentUser] = useState({});
    const [deleted, setDeleted] = useState(false);


    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/users?userId=${comment.userId}`);
            setCommentUser(res.data);
        }
        fetchUser();

    }, [comment])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const uploadError = () => toast.error("something went wrong!");

    const commentDeleted = () => toast.success("comment deleted");

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteComment = async () => {
        const obj = {
            userId: currentUser._id
        }
        try {
            await axios.delete("https://socialmedia-jainakshat.herokuapp.com/api/comments/" + comment._id, { data: obj });
            setDeleted(true);
            commentDeleted();
        } catch (err) {
            console.log(err);
            uploadError();
        }
        handleClose()
    }


    return (
        <>
            <div className="post comment">
                <div className="postWrapper">
                    <div className="postTop">
                        <div className="postTopLeft">
                            <div onClick={() => navigate('/profile/' + commentUser?.username)} style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                                <img className="postProfileImg" src={commentUser?.profilePicture?.url ? commentUser?.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="postUsername">{commentUser?.username}</span>
                                    <span className="postDate">{new Date(comment?.createdAt).toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                        <div className="postTopRight">
                            {comment.userId === currentUser._id && <MoreVert aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined} onClick={handleClick} style={{ cursor: 'pointer' }} />}
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={deleteComment}>Delete Comment</MenuItem>
                            </Menu>
                        </div>

                    </div>
                    <div className="postCenter commentCenter">
                        <span className={deleted ? "postText deleted" : "postText"}>{comment?.text}</span>
                    </div>
                    <div className="postBottom">
                        <div className="postBottomLeft">
                            {/* {isLiked ? <Favorite onClick={likeHandler} className="likeIcon" /> : <FavoriteBorder onClick={likeHandler} className="notlikeIcon" />} */}

                            {/* <span className="postLikeCounter">2 people liked it</span> */}
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}
