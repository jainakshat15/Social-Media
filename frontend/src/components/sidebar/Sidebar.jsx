import { Chat, Home, Person, Search } from "@mui/icons-material"
import "./sidebar.css"
import CloseFriend from "../closeFriend/CloseFriend"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"


export default function Sidebar() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchedUsers, setSearchedUsers] = useState([]);

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

    let newUsers = [...allUsers];
    newUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    newUsers = newUsers.filter((u) => u.username !== user.username).slice(0, 5);

    let topUsers = [...allUsers];
    topUsers = topUsers.sort((a, b) => b.followers.length - a.followers.length).slice(0, 5);

    const value = Math.floor(Math.random() * 2);

    useEffect(() => {
        const searchUsers = [...allUsers];
        setSearchedUsers(searchUsers.filter((u) => (u.username.toLowerCase().includes(search.toLowerCase())) || (u.name.toLowerCase().includes(search.toLowerCase()))))

    }, [search, allUsers])

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem" onClick={() => navigate('/')}>
                        <Home className="sidebarIcon" />
                        <span className="sidebarListItemText">Home</span>
                    </li>
                    <li className="sidebarListItem" onClick={() => navigate('/profile/' + user.username)}>
                        <Person className="sidebarIcon" />
                        <span className="sidebarListItemText">{user.name}</span>
                    </li>

                    <li className="sidebarListItem" onClick={() => navigate('/messenger')}>
                        <Chat className="sidebarIcon" />
                        <span className="sidebarListItemText">Messenger</span>
                    </li>

                </ul>
                {/* <button className="sidebarButton">Show More</button> */}
                <hr className="sidebarHr" />
                <div className="searchbar">
                    <Search className='searchIcon' />
                    <input value={search} placeholder='Search for Person' className="searchInput" onChange={(e) => setSearch(e.target.value)} />
                </div>
                <ul className="sidebarFriendList">
                    {search === "" ? value ? <><h3 className="sidebarTitle">Most Followed</h3>
                        {topUsers.map((u) => (
                            <CloseFriend key={u._id} user={u} />
                        ))}</> :
                        <>
                            <h3 className="sidebarTitle">New to SocialMedia</h3>
                            {newUsers.map((u) => (
                                <CloseFriend key={u._id} user={u} />
                            ))}</>
                        :
                        <>
                            <h3 className="sidebarTitle">Search Results...</h3>
                            {searchedUsers.map((u) => (
                                <CloseFriend key={u._id} user={u} />
                            ))}</>}

                </ul>
            </div>
        </div>
    )
}
