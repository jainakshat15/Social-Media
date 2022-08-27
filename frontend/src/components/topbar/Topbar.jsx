import './topbar.css'
import { Chat, Home, MoreVert, Person, Search } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Menu, MenuItem, Modal } from '@mui/material'
import { FriendsModal, HelpModal, ResetPasswordModalTopbar } from '../post/Modals'
import axios from 'axios'


const Topbar = () => {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [showModal, setShowModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allUsers = async () => {
      try {
        const Users = await axios.get("https://socialmedia-jainakshat.herokuapp.com/api/users/all");
        setUsers(Users.data);
      } catch (err) {
        console.log(err);
      }
    }
    allUsers();
  }, [])



  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickResetPassword = () => {
    setShowModal(true);
    handleClose();
  }
  const handleClickHelp = () => {
    setShowHelpModal(true);
    handleClose();
  }

  const handleLogout = () => {
    localStorage.setItem("user", null);
    window.location.reload();
  }
  return (
    <>
      <Modal
        open={showModal}
        //className={classes.modal}
        onClose={() => setShowModal(false)}
      >
        <ResetPasswordModalTopbar onSuccess={() => setShowModal(false)} />
      </Modal>
      <Modal
        open={showHelpModal}
        //className={classes.modal}
        onClose={() => setShowHelpModal(false)}
      >
        <HelpModal onSuccess={() => setShowHelpModal(false)} />
      </Modal>
      <Modal
        open={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
      >
        <FriendsModal onSuccess={() => setShowFriendsModal(false)} users={users} />
      </Modal>
      <div className='topbarContainer'>
        <div className="topbarLeft">
          <div className="topbarIcons">
            <div className="topbarIconItem" onClick={() => navigate("/")}>
              <Home />
              {/* <span className='topbarIconBadge'>1</span> */}
            </div>
            <div className="topbarIconItem" onClick={() => navigate("/profile/" + user.username)}>
              <Person />
              {/* <span className='topbarIconBadge'>1</span> */}
            </div>
            <div className="topbarIconItem" onClick={() => navigate("/messenger")}>
              <Chat />
              {/* <span className='topbarIconBadge'>2</span> */}
            </div>
          </div>
        </div>
        <div className="topbarCenter">
          {/* <div className="searchbar">
          <Search className='searchIcon' />
          <input placeholder='Search for friend, post or video' className="searchInput" />
        </div> */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <span className='logo'>SOCIALMEDIA</span>
          </Link>
        </div>
        <div className="topbarRight">
          <Search onClick={() => setShowFriendsModal(true)} style={{ marginRight: '10px', marginLeft: '10px', cursor: 'pointer' }} />
          <Link to={`/profile/${user?.username}`}>
            <img src={user.profilePicture.url ? user.profilePicture.url : PF + "person/noAvatar.png"} alt="" className="topbarImg" />
          </Link>
          <MoreVert style={{ marginRight: '10px', marginLeft: '10px', cursor: 'pointer' }} aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined} onClick={handleClick} />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >

            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleClickResetPassword}>Reset password</MenuItem>
            <MenuItem onClick={handleClickHelp}>Help!!!</MenuItem>

          </Menu>
        </div>
      </div>
    </>
  )
}

export default Topbar