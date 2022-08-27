import { Favorite, FavoriteBorder, MoreVert } from "@mui/icons-material"
import "./post.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { CircularProgress, Menu, MenuItem, Modal } from "@mui/material"
import CommentsModal, { EditPostModal } from "./Modals"
import { toast } from 'react-toastify';



export default function Post({ post, home }) {
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setisLiked] = useState(false);
    const [user, setUser] = useState({});
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [editPostModal, setEditPostModal] = useState(false)
    const navigate = useNavigate();

    const deleteError = () => toast.error("something went wrong!");
    const postDeleted = () => toast.success("Post deleted successfully.")

    const [loading, setLoading] = useState(false);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        setisLiked(post.likes.includes(currentUser._id))
    }, [currentUser._id, post.likes])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/users?userId=${post.userId}`);
            setUser(res.data);
        }
        fetchUser();

    }, [post.userId])

    const likeHandler = () => {

        try {
            axios.put("https://socialmedia-jainakshat.herokuapp.com/api/posts/" + post._id + "/like", { userId: currentUser._id })
        } catch (err) {
            console.log(err);
        }
        setLike(isLiked ? like - 1 : like + 1);
        setisLiked(!isLiked);
    }



    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const deletePost = async () => {
        setLoading(true);
        const obj = {
            userId: currentUser._id
        }
        try {
            await axios.delete("https://socialmedia-jainakshat.herokuapp.com/api/comments/post/" + post._id).then(await axios.delete("https://socialmedia-jainakshat.herokuapp.com/api/posts/" + post._id, { data: obj }));
            postDeleted();
            handleClose();
            window.location.pathname === "/" ? navigate('/profile/' + currentUser.username) : window.location.reload();
        } catch (err) {
            console.log(err);
            setLoading(false);
            deleteError();
        }

    }

    const unfollow = async () => {
        try {

            await axios.put("https://socialmedia-jainakshat.herokuapp.com/api/users/" + post.userId + "/unfollow", { userId: currentUser._id })
            dispatch({ type: "UNFOLLOW", payload: user._id })
            window.location.reload();
        } catch (err) {
            console.log(err);
        }

        handleClose()
    }
    useEffect(() => {
        const fetchComments = async () => {
            const res = await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/comments/${post._id}`)
            setComments(res.data)

        }
        fetchComments();
    }, [post])

    const editButton = () => {
        setEditPostModal(true)
        handleClose()
    }

    return (
        <>
            <Modal
                open={showModal}
                //className={classes.modal}
                onClose={() => setShowModal(false)}
            >
                <CommentsModal onSuccess={() => setShowModal(false)} post={post} />
            </Modal>
            <Modal
                open={editPostModal}
                //className={classes.modal}
                onClose={() => setEditPostModal(false)}
            >
                <EditPostModal onSuccess={() => setEditPostModal(false)} post={post} />
            </Modal>
            <div className={home ? "post homePost" : "post profilePost"}>
                <div className="postWrapper">
                    <div className="postTop">
                        <div className="postTopLeft">
                            <div onClick={() => navigate('/profile/' + user?.username)} style={{ display: 'flex', alignItems: "center", cursor: 'pointer' }}>
                                <img className="postProfileImg" src={user?.profilePicture?.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="postUsername">{user?.username}</span>
                                    <span className="postDate">{new Date(post?.createdAt).toLocaleString()}</span>

                                </div>
                            </div>

                        </div>
                        <div className="postTopRight">
                            <MoreVert aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined} onClick={handleClick} style={{ cursor: 'pointer' }} />
                            {post.userId === currentUser._id ?
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >


                                    <MenuItem onClick={editButton}>Edit Post</MenuItem>
                                    <MenuItem disabled={loading} onClick={deletePost}>{loading ? <CircularProgress color="secondary" size="20px" /> : 'Delete Post'}</MenuItem>
                                </Menu> :
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                > <MenuItem onClick={unfollow}>Unfollow User</MenuItem>
                                </Menu>}
                        </div>

                    </div>
                    <div className="postCenter">

                        {post.desc && <span className={"postText"}>{post?.desc}</span>}

                        {post.img && <img className="postImg" src={post?.img?.url} alt="" />}
                    </div>
                    <div className="postBottom">
                        <div className="postBottomLeft">
                            {isLiked ? <Favorite onClick={likeHandler} className="likeIcon" /> : <FavoriteBorder onClick={likeHandler} className="notlikeIcon" />}

                            <span className="postLikeCounter">{like} people liked it</span>
                        </div>
                        <div className="postBottomRight" onClick={() => setShowModal(true)}>
                            <span className="postCommentText" >{comments.length} comments</span>
                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}
