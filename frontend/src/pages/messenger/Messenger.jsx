import { useEffect, useRef } from "react"
import { useContext, useState } from "react"
import Topbar from "../../components/topbar/Topbar"
import { AuthContext } from "../../context/AuthContext"
import "./messenger.css"
import axios from "axios"
import Conversation from "../../components/conversations/Conversations"
import Message from "../../components/message/Message"
import { io } from "socket.io-client"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import CloseFriend from "../../components/closeFriend/CloseFriend"
import { ArrowBack } from "@mui/icons-material"

export default function Messenger() {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [search, setSearch] = useState("");
    const scrollRef = useRef();
    const socket = useRef();
    const [allUsers, setAllUsers] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [toggle, setToggle] = useState(true)
    const { user } = useContext(AuthContext);
    const [otherUser, setOtherUser] = useState(null);

    useEffect(() => {
        socket.current = io("https://socket-socialmedia.herokuapp.com/");

        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

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


    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage])

    }, [arrivalMessage, currentChat])
    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users => {
            setOnlineUsers(user.followings.filter(f => users.some(u => u.userId === f)));
        })
    }, [user])

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }

        }

        getConversations();
    }, [user._id, toggle])


    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/messages/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        getMessages();
    }, [currentChat]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        }

        const receiverId = currentChat.members.find(member => member !== user._id)
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        })

        try {
            const res = await axios.post("https://socialmedia-jainakshat.herokuapp.com/api/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }

    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        let searchUsers = [...allUsers];
        searchUsers = searchUsers.filter((u) => u.username !== user.username)

        setSearchedUsers(searchUsers.filter((u) => (u?.username?.toLowerCase().includes(search.toLowerCase())) || (u?.name?.toLowerCase().includes(search.toLowerCase()))))

    }, [search, allUsers, user.username])

    const handleClick = async (u) => {
        const obj = {
            senderId: user._id,
            receiverId: u._id
        }
        try {
            const res = await axios.post('https://socialmedia-jainakshat.herokuapp.com/api/conversations', obj);
            setCurrentChat(res.data);
            setToggle(!toggle);
            setSearch("");
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        let newUser = currentChat ? currentChat.members[0] : "";
        if (newUser === user._id) { newUser = currentChat.members[1] }



        if (newUser !== "") {
            const fetchUser = async () => {
                const res = await axios.get(`https://socialmedia-jainakshat.herokuapp.com/api/users?userId=${newUser}`);
                setOtherUser(res.data);
            }
            fetchUser();

        }

    }, [currentChat, user._id])


    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className={currentChat ? "chatMenu no" : "chatMenu"}>
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for Friends" autoFocus value={search} className="chatMenuInput" onChange={(e) => setSearch(e.target.value)} />
                        {conversations.length === 0 && <h4 className="noText noOnlineText noConversationsText">Search for friends to start a conversation.</h4>}
                        {search !== "" ? searchedUsers.map((u) => (
                            <div key={u._id} onClick={() => handleClick(u)}>
                                <CloseFriend key={u._id} user={u} messenger />
                            </div>
                        )) :
                            conversations.map((c) => (
                                <div key={c._id} onClick={() => setCurrentChat(c)}>
                                    <Conversation currentChat={currentChat} conversation={c} currentUser={user} />
                                </div>
                            ))}
                    </div>
                </div>
                <div className={currentChat ? "chatBox" : "chatBox no"}>
                    <div className="chatBoxWrapper">
                        {currentChat ?
                            <>
                                <div style={{ borderBottom: '3px solid lightgrey', display: 'flex', alignItems: 'center' }}>
                                    <div className="backButton" onClick={() => setCurrentChat(null)}>
                                        <ArrowBack />
                                    </div>

                                    {
                                        otherUser && <div className="messengerChatHeader"><CloseFriend user={otherUser} /></div>
                                    }
                                </div>

                                <div className="chatBoxTop">
                                    {messages.map(m => (
                                        <div ref={scrollRef} key={m._id}>
                                            <Message message={m} own={m.sender === user._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea className="chatMessageInput" placeholder="Write a Message" onChange={(e) => setNewMessage(e.target.value)} value={newMessage}></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                                </div>
                            </> : <span className="noConversationText">Open a conversation to start a chat</span>}
                    </div>
                </div>
                <div className={currentChat ? "chatOnlineContainer no" : "chatOnlineContainer"}>

                    <div className="chatOnlineWrapper">
                        <h2 className="onlineHeading">Currently Active</h2>
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} />
                    </div>
                </div>

            </div>
        </>
    )
}
