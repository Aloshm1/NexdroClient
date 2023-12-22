import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import LinkIcon from "@mui/icons-material/Link";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import FestivalIcon from "@mui/icons-material/Festival";
import WorkIcon from "@mui/icons-material/Work";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BadgeIcon from "@mui/icons-material/Badge";
import AppsIcon from "@mui/icons-material/Apps";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import DehazeIcon from "@mui/icons-material/Dehaze";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "../pages/chat/[id]";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Link from "next/link";
import Router from "next/router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import navbarCss from "../styles/navbar.module.css";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Popover from "@mui/material/Popover";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { Alert, Grid } from "@mui/material";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import Image from "next/image";
import logo from "../images/nexdro_logo.png";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../images/logo.png";
const imageLink = process.env.NEXT_PUBLIC_CDN;
const settings = ["Nature", "Real estate", "Cinematography", "Festival"];
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
var socket, selectedChatCompare;
const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#fff",
      dark: "#000",
      main: "#fff",
    },
  },
});

const navLinkStyle = {
  my: 2,
  color: "black",
  display: "inline-block",
  fontFamily: "roboto-regular",
  fontSize: "16px",
  textTransform: "capitalize",
  minWidth: "0px",
  margin: "0px",
  paddingLeft: "10px",
  paddingRight: "10px",
  "&:hover": {
    color: "#00e7fc",
  },
};
const navLinkStyle1 = {
  my: 2,
  color: "black",
  display: "inline-block",
  fontFamily: "roboto-regular",
  fontSize: "16px",
  textTransform: "capitalize",
  minWidth: "0px",
  margin: "0px",
  paddingLeft: "20px",
  paddingRight: "20px",
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Navbar = ({ nav, load }) => {
  const router = useRouter();
  let [profileData, setProfileData] = useState({});
  let [dropWidth, setDropWidth] = useState(100);
  let [chats, setChats] = useState(false);
  let [chatOpen, setChatOpen] = useState(false);
  let [temp, setTemp] = useState("");
  let [profileOpen, setProfileOpen] = useState(false);
  let [shotslist, setShotsList] = useState(false);
  let [tempLoadData1, setTempLoadData1] = useState(true);
  let [activitiesTab, setAcivitiesTab] = useState("messages");
  let changeActivitiesTab = (tab) => {
    setAcivitiesTab(tab);
  };
  let tempLoadData = (data) => {
    setTempLoadData1(!tempLoadData1);
  };
  let [unRead, setUnread] = useState(0);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        if (!socket) {
          socket = io(localhost);
          socket.emit("setup", res.data);
        }
        socket.on("connected", () => console.log("connected"));
        socket.on("refresh", () => {
          axios.get(`${domain}/api/chat/getMyChats`, config).then((res) => {
            console.log(res);
            setChatContent(res.data.data);
            setUnread(res.data.unreadChats);
          });
          document.getElementById("msgIcon").classList.add("msgApp");
          setTimeout(() => {
            if (document.getElementById("msgIcon")) {
              document.getElementById("msgIcon").classList.remove("msgApp");
            }
          }, 1000);
        });
        socket.on("refreshYourChats", () => {
          axios.get(`${domain}/api/chat/getMyChats`, config).then((res) => {
            console.log(res);
            setChatContent(res.data.data);
            setUnread(res.data.unreadChats);
          });
        });
        socket.on("reloadProfilePic", () => {
          axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
            setProfileData(res.data);
          });
        });
        if (socket) return () => socket.disconnect();
      });
    }
  }, [load]);
  let [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("role")) {
      axios.get(`${domain}/api/chat/getMyChats`, config).then((res) => {
        console.log(res);
        setChatContent(res.data.data);
        setUnread(res.data.unreadChats);
      });
      axios
        .get(`${domain}/api/notification/getMyNotifications`, config)
        .then((res) => {
          console.log(res);
          setNotifications(res.data);
        });
    }
  }, [router.asPath]);
  useEffect(() => {
    if (!profileData._id && localStorage.getItem("access_token")) {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setProfileData(res.data);
        setRole(res.data.role);
      });
    }
    if (document.getElementById("accountWidth")) {
      let temp = document.getElementById("accountWidth").offsetWidth;
      setDropWidth(temp);
    }
  }, [router.asPath]);

  useEffect(() => {
    console.log("update profile");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("profileChanged")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setProfileData(res.data);
      });
      localStorage.removeItem("profileChanged");
    }
  });

  const [currentUrl, setCurrentUrl] = useState(router.pathname);
  const [uploadPopup, setUploadPopup] = useState(false);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  let [features, setFeatures] = useState(false);
  let changeFeatures = () => {
    setFeatures(!features);
  };
  let [insights, setInsights] = useState(false);
  let changeInsights = () => {
    setInsights(!insights);
  };
  let [usefullLinks, setUsefullLinks] = useState(false);
  let changeUsefullLinks = () => {
    setUsefullLinks(!usefullLinks);
  };
  let [sidebarShots, setSidebarShots] = useState(false);
  let changeSidebarShoots = () => {
    setSidebarShots(!sidebarShots);
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className={navbarCss.sideBarDiv}>
        {account ? (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  profileData.profilePic
                    ? `${imageLink}/${profileData.profilePic}`
                    : `${imageLink}/pilot-profilePic.png`
                }
                className={navbarCss.sideBarPic}
              />
              <div style={{ marginLeft: "8px" }}>
                <div className={navbarCss.sideBarName}>{profileData.name}</div>
                <div className={navbarCss.sideBarEmail}>
                  {profileData.email}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={navbarCss.sideBarCssText}>
              You are not logged into Nexdro
            </div>

            <center>
              <Link href="/login">
                <a
                  className={navbarCss.sideBarBtn}
                  onClick={toggleDrawer(anchor, false)}
                >
                  Login/Signup
                </a>
              </Link>
            </center>
          </>
        )}
      </div>
      <ul style={{ paddingLeft: "0px" }}>
        <div
          onClick={changeSidebarShoots}
          className={navbarCss.sideBarlinksContainer}
        >
          {sidebarShots ? (
            <ExpandLessIcon sx={{ marginRight: "20px", float: "right" }} />
          ) : (
            <ExpandMoreIcon sx={{ marginRight: "20px", float: "right" }} />
          )}
          <div
            className={navbarCss.sideBarlinks}
            style={{ marginBottom: !sidebarShots ? "20px" : "5px" }}
          >
            <ImageIcon />
            &nbsp; Shots
          </div>
        </div>
        {sidebarShots && (
          <div
            className={navbarCss.sideBarShoots}
            onClick={toggleDrawer(anchor, false)}
          >
            {tags.map((item, i) => {
              return (
                <Link href={`/shot/${item.slug}`} key={i}>
                  <a
                    className={navbarCss.tagName}
                    onClick={() => {
                      handleCloseShotsMenu(item.slug);
                    }}
                    key={i}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    {item.tag}
                  </a>
                </Link>
              );
            })}
          </div>
        )}
        <li onClick={toggleDrawer(anchor, false)}>
          <Link href="/apply-job">
            <a className={navbarCss.sideBarlinks}>
              <WorkIcon />
              &nbsp; Apply jobs
            </a>
          </Link>
        </li>
        <li onClick={toggleDrawer(anchor, false)}>
          <Link href="/hire-pilot">
            <a className={navbarCss.sideBarlinks}>
              <ContactPhoneIcon />
              &nbsp; Find Pilots
            </a>
          </Link>
        </li>
        <li onClick={toggleDrawer(anchor, false)}>
          <Link href="/service-center">
            <a className={navbarCss.sideBarlinks}>
              <MiscellaneousServicesIcon />
              &nbsp; Service Centers
            </a>
          </Link>
        </li>
        <div
          onClick={changeFeatures}
          className={navbarCss.sideBarlinksContainer}
        >
          {features ? (
            <ExpandLessIcon sx={{ marginRight: "20px", float: "right" }} />
          ) : (
            <ExpandMoreIcon sx={{ marginRight: "20px", float: "right" }} />
          )}

          <div
            className={navbarCss.sideBarlinks}
            style={{ marginBottom: !features ? "20px" : "5px" }}
          >
            <AppsIcon />
            &nbsp; Features
          </div>
        </div>
        {features && (
          <div className={navbarCss.sideBarShoots1}>
            <Link href="/pilot-pro">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Drone Pilots
              </a>
            </Link>
            <Link href="/company-pro">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Company
              </a>
            </Link>
            <Link href="/center-pro">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Center Details
              </a>
            </Link>
          </div>
        )}

        <div
          onClick={changeInsights}
          className={navbarCss.sideBarlinksContainer}
        >
          {insights ? (
            <ExpandLessIcon sx={{ marginRight: "20px", float: "right" }} />
          ) : (
            <ExpandMoreIcon sx={{ marginRight: "20px", float: "right" }} />
          )}

          <div
            className={navbarCss.sideBarlinks}
            style={{ marginBottom: !insights ? "20px" : "5px" }}
          >
            <NewspaperIcon />
            &nbsp; News and Insights
          </div>
        </div>
        {insights && (
          <div className={navbarCss.sideBarShoots1}>
            <Link href="/blogs">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Blogs
              </a>
            </Link>
            <Link href="/events">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Events
              </a>
            </Link>
          </div>
        )}
        <div
          onClick={changeUsefullLinks}
          className={navbarCss.sideBarlinksContainer}
        >
          {usefullLinks ? (
            <ExpandLessIcon sx={{ marginRight: "20px", float: "right" }} />
          ) : (
            <ExpandMoreIcon sx={{ marginRight: "20px", float: "right" }} />
          )}

          <div
            className={navbarCss.sideBarlinks}
            style={{ marginBottom: !usefullLinks ? "20px" : "5px" }}
          >
            <LinkIcon />
            &nbsp; Useful Links
          </div>
        </div>
        {usefullLinks && (
          <div className={navbarCss.sideBarShoots1}>
            <Link href="/about-us">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                About Us
              </a>
            </Link>
            <Link href="/help-center">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Help Center
              </a>
            </Link>
            <Link href="/complaints">
              <a
                className={navbarCss.tagName}
                onClick={toggleDrawer(anchor, false)}
              >
                Complaints
              </a>
            </Link>
          </div>
        )}
      </ul>
      {/* <div style={{ position: "relative" }}>
        
        <ul
          className={navbarCss.sidebarLinkContainer}
          style={{ margin: "0px" }}
        >
          <Link href="/apply-job">
            <li className={navbarCss.sidebarLink} onClick={handleCloseNavMenu}>
              <a>Apply jobs</a>
            </li>
          </Link>
          <Link href="/hire-pilot">
            <li className={navbarCss.sidebarLink} onClick={handleCloseNavMenu}>
              Hire pilot
            </li>
          </Link>
          <Link href="/service-center">
            <li className={navbarCss.sidebarLink} onClick={handleCloseNavMenu}>
              Service center
            </li>
          </Link>

          <Button
            sx={{
              ...navLinkStyle1,
              color: "black",
              position: "relative",
              width: "100%",
              padding: "10px",
            }}
            id="navbar_apply_jobs"
            disableRipple
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontFamily: "roboto-bold",
              }}
              onMouseOver={() => setShotsList(true)}
              onMouseOut={() => setShotsList(false)}
            >
              Shots <KeyboardArrowDownOutlinedIcon />
            </div>
            {shotslist ? (
              <div
                className={navbarCss.shotsList}
                onMouseOver={() => setShotsList(true)}
                onMouseOut={() => setShotsList(false)}
                onClick={() => setShotsList(false)}
                style={{ right: "30px", top: "35px" }}
              >
                {tags.map((item, i) => {
                  return (
                    <div
                      className={navbarCss.tagName}
                      onClick={() => handleCloseShotsMenu(item.slug)}
                      key={i}
                    >
                      {item.tag}
                    </div>
                  );
                })}
              </div>
            ) : (
              <></>
            )}
          </Button>
          {account ? (
            <></>
          ) : (
            <div>
              <Link href="/login">
                <a>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      ...navLinkStyle,
                      border: "2px solid #00e7fc",
                      fontFamily: "roboto-regular",
                      margin: "10px 0px 10px 10px",
                      "&:hover": {
                        backgroundColor: "#00e7fc80",
                      },
                      padding: "3px 20px",
                    }}
                  >
                    Sign In
                  </Button>
                </a>
              </Link>
              <Link href="/register">
                <a>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      ...navLinkStyle,
                      border: "2px solid #00e7fc",
                      fontFamily: "roboto-regular",
                      margin: "10px 0px 10px 10px",
                      "&:hover": {
                        backgroundColor: "#00e7fc80",
                      },
                      padding: "3px 20px",
                    }}
                  >
                    Sign Up
                  </Button>
                </a>
              </Link>
            </div>
          )}
        </ul>
      </div> */}
    </Box>
  );
  useEffect(() => {
    if (window.location.href.includes("apply-job")) {
      document
        .getElementById("navbar_apply_jobs")
        .classList.add("navbaraccountActive");
      document
        .getElementById("navbar_apply_jobs1")
        .classList.add("navbaraccountActive");
    } else if (window.location.href.includes("hire-pilot")) {
      document
        .getElementById("navbar_hire_pilots")
        .classList.add("navbaraccountActive");
    }
  }, []);
  let [tags, setTags] = useState([]);
  let [chatContent, setChatContent] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/tag/getTags`).then((res) => {
      console.log(res.data,'ooooooooooooooooooooooooooooooooooooo');
      setTags(res.data);
    });
  }, []);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.get(`${domain}/api/chat/getMyChats`, config).then((res) => {
        console.log(res.data,'cht');
        setChatContent(res.data.data);
       
        setUnread(res.data.unreadChats);
      });
    }
  }, [tempLoadData1]);
  let [account, setAccount] = useState(false);
  let [role, setRole] = useState("");
  useEffect(() => {
    if (document.getElementById("accountWidth")) {
      let temp = document.getElementById("accountWidth").offsetWidth;
      setDropWidth(temp);
    }
    setCurrentUrl(router.pathname);
    if (localStorage.getItem("access_token")) {
      console.log("Got in");
      if (!account) {
        setAccount(true);
      }

      if (localStorage.getItem("role")) {
        setRole(localStorage.getItem("role"));
      }
    } else {
      setAccount(false);
    }
  });
  let changeTab = (type) => {
    if (localStorage.getItem("email") !== "true") {
      Router.push("/verify-email");
    } else if (localStorage.getItem("role") === "undefined") {
      Router.push("/choose-categories");
    } else {
      if (localStorage.getItem("role") == "pilot") {
        if (type == "account") {
          router.push("/pilot-dashboard/account");
        }
        if (type == "activities") {
          router.push("/pilot-dashboard/activities");
        }
        if (type == "likes") {
          router.push("/pilot-dashboard/account/work");
        }
        if (type == "downloads") {
          router.push("/pilot-dashboard/activities/downloads");
        }
        if (type == "applied-jobs") {
          router.push("/pilot-dashboard/activities/applied-jobs");
        }
      }
      if (localStorage.getItem("role") == "company") {
        if (type == "account") {
          router.push("/company-dashboard/account");
        }
        if (type == "activities") {
          router.push("/company-dashboard/activities");
        }
        if (type == "likes") {
          router.push("/company-dashboard/activities/sent-proposals");
        }
        if (type == "downloads") {
          router.push("/company-dashboard/activities/downloads");
        }
        if (type == "applied-jobs") {
          router.push("/company-dashboard/activities/saved-pilots");
        }
      }
      if (localStorage.getItem("role") == "service_center") {
        if (type == "account") {
          router.push("/center-dashboard/account");
        }
        if (type == "activities") {
          router.push("/center-dashboard/activities");
        }
        if (type == "likes") {
          router.push("/center-dashboard/activities/likes");
        }
        if (type == "downloads") {
          router.push("/center-dashboard/activities");
        }
        if (type == "applied-jobs") {
          router.push("/center-dashboard/activities/center-enquiries");
        }
      }
      if (localStorage.getItem("role") == "booster") {
        if (type == "account") {
          router.push("/booster-dashboard/account");
        }
        if (type == "activities") {
          router.push("/booster-dashboard/activities");
        }
        if (type == "likes") {
          router.push("/booster-dashboard/activities/likes");
        }
        if (type == "downloads") {
          router.push("/booster-dashboard/activities");
        }
      }
    }
    setAccount(false);
  };
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElShots, setAnchorElShots] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const open = Boolean(anchorEl);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenShotsMenu = (event) => {
    setAnchorElShots(true);
  };

  const handleCloseShotsMenu = (slug) => {
    setAnchorElShots(false);
    localStorage.setItem("goBack", "dontGoBack");
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  let completeProfile = () => {
    var tempUserType = localStorage.getItem("tempUserType");
    if (tempUserType) {
      if (tempUserType === "pilot") {
        Router.push("/create-pilot");
      } else {
        Router.push("/choose-categories");
      }
    } else {
      if (localStorage.getItem("email") !== "true") {
        Router.push("/verify-email");
      } else if (localStorage.getItem("role") === "undefined") {
        Router.push("/choose-categories");
      } else if (localStorage.getItem("role") == "pilot") {
        Router.push("/pilot-dashboard/account");
      } else if (localStorage.getItem("role") == "company") {
        Router.push("/company-dashboard/account");
      } else if (localStorage.getItem("role") == "service_center") {
        Router.push("/center-dashboard/account");
      } else if (localStorage.getItem("role") == "booster") {
        Router.push("/booster-dashboard/account");
      } else if (localStorage.getItem("role") == "halfPilot") {
        Router.push("/create-pilot");
      } else if (localStorage.getItem("role") == "halfCompany") {
        Router.push("/create-company");
      }
    }
  };
  let mouseIned = () => {
    document.getElementById("logoutDiv").style.display = "block";
  };
  let mouseOuted = () => {
    document.getElementById("logoutDiv").style.display = "none";
  };
  let logout = () => {
    localStorage.clear();
    setProfileData({});
    Router.push("/login");
    handleCloseNavMenu();
    setRole("");
    setChatContent([]);
    socket.disconnect();
  };
  let RedirectUploadFiles = () => {
    setUploadPopup(false);
    Router.push("/upload-files");
  };
  let handleUploadfilePopup = () => {
    let date = new Date();
    let today =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

    console.log(today);
    if (localStorage.getItem("role")) {
      if (localStorage.getItem("uploadFilePopup") === today) {
        Router.push("/upload-files");
      } else {
        setUploadPopup(true);
        localStorage.setItem("uploadFilePopup", today);
      }
    } else {
      Router.push("/login");
    }
  };

  let openChat = (chatId) => {
    setTemp("");
    setTimeout(() => {
      setChatOpen(true);
      setTemp(chatId);
    }, 100);
  };
  let [closeChat, setCloseChat] = useState(false);
  let closeHandler = () => {
    setChatOpen(false);
    setCloseChat(true);
  };
  let setSideBar = () => {
    setState({
      ...state,
      left: true,
    });
  };
  let redirectToLanding = (id, notId) =>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setChats(false)
    axios.post(`${domain}/api/user/getRoute/${id}`).then(res=>{
      console.log(res)
      
      if(res.data !== "booster"){
  
        Router.push(res.data.path)
      }
      axios.post(`${domain}/api/notification/makeNotificationRead/${notId}`).then(res=>{
        console.log(res)
        axios
        .get(`${domain}/api/notification/getMyNotifications`, config)
        .then((res) => {
          console.log(res);
          setNotifications(res.data);
        });
      })
    })
  }
  let redirectImageLanding = (id, notId) =>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setChats(false)
    Router.push(`/image/${id}`)
    axios.post(`${domain}/api/notification/makeNotificationRead/${notId}`).then(res=>{
      console.log(res)
      axios
      .get(`${domain}/api/notification/getMyNotifications`, config)
      .then((res) => {
        console.log(res);
        setNotifications(res.data);
      });
    })
  }
  let markAllRead = () =>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/notification/makeAllNotificationsRead`, config).then(res=>{
      axios
      .get(`${domain}/api/notification/getMyNotifications`, config)
      .then((res) => {
        console.log(res);
        setNotifications(res.data);
      });
    })
  }
  return (
    <div className={`${navbarCss.navbar}`}>
      <React.Fragment>
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </React.Fragment>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static" elevation={0}>
          <Container className="Container" maxWidth="xxl">
            <Toolbar disableGutters className={navbarCss.navbarContainer}>
              <Box
                variant="div"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", lg: "flex" },
                }}
              >
                <Link href="/">
                  <a>
                    <Image src={Logo} className="logo" alt = "logo"/>
                  </a>
                </Link>
              </Box>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", lg: "none" } }}>
                <Box
                  variant="div"
                  noWrap
                  href=""
                  sx={{
                    mr: 2,
                    display: { xs: "flex", lg: "none" },
                    flexGrow: 1,
                  }}
                >
                  <Link href="/">
                    <a style={{ width: "125px" }} className="logoCont">
                      <Image src={Logo} className="logo" alt = "logo" />
                    </a>
                  </Link>
                </Box>
              </Box>

              {/* <Button
                    onClick={handleCloseNavMenu}
                    sx={{
                      ...navLinkStyle,
                      border: "2px solid #00e7fc",
                      margin: "0px 5px",
                      fontFamily: "roboto-regular",
                      "&:hover": {
                        background:
                          "transparent linear-gradient(180deg,#4ffea3,#00e7fc) 0 0 no-repeat padding-box",
                      },
                      padding: "3px 13px",
                      borderRadius: "30px",
                      background:
                        "transparent linear-gradient(180deg,#00e7fc,#4ffea3) 0 0 no-repeat padding-box",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <FileUploadOutlinedIcon />
                      <span style={{ marginLeft: "5px" }}>Add Shots</span>
                    </div>
                  </Button> */}

              <Box
                sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" } }}
              ></Box>
              <Box
                component="ul"
                sx={{
                  flexGrow: 0,
                  display: { xs: "none", md: "block", paddingLeft: "0px" },
                }}
                className="navbarRight"
              >
                <Button
                  component="li"
                  sx={{
                    ...navLinkStyle1,
                    color: "black",
                    position: "relative",
                  }}
                  id="navbar_apply_jobs"
                  disableRipple
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "roboto-bold",
                    }}
                    onMouseOver={() => setShotsList(true)}
                    onMouseOut={() => setShotsList(false)}
                  >
                    Shots <KeyboardArrowDownOutlinedIcon />
                  </div>
                  {shotslist ? (
                    <div
                      className={navbarCss.shotsList}
                      onMouseOver={() => setShotsList(true)}
                      onMouseOut={() => setShotsList(false)}
                      onClick={() => setShotsList(false)}
                    >
                      {tags.map((item, i) => {
                        return (
                          <Link href={`/shot/${item.slug}`} key={i}>
                            <a
                              className={navbarCss.tagName}
                              onClick={() => handleCloseShotsMenu(item.slug)}
                              key={i}
                            >
                              {item.tag}
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <></>
                  )}
                </Button>
                <li
                  style={{
                    ...navLinkStyle,
                    color: currentUrl === "/apply-job" ? "#00e7fc" : "black",
                  }}
                  id="navbar_apply_jobs1"
                >
                  <Link href="/apply-job">
                    <a className="navbarNewLink">Apply jobs</a>
                  </Link>
                </li>
                <li
                  style={{
                    ...navLinkStyle,
                    color: currentUrl === "/hire-pilot" ? "#00e7fc" : "black",
                  }}
                  id="navbar_hire_pilots"
                >
                  <Link href="/hire-pilot">
                    <a className="navbarNewLink">Find pilots</a>
                  </Link>
                </li>
                <li
                  style={{
                    ...navLinkStyle,
                    color:
                      currentUrl === "/service-center" ? "#00e7fc" : "black",
                  }}
                  id="navbar_service_center"
                >
                  <Link href="/service-center">
                    <a className="navbarNewLink">Service center</a>
                  </Link>
                </li>
                {account ? (
                  <></>
                ) : (
                  <li style={{...navLinkStyle}}>
                    <Link href="/login">
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{
                          ...navLinkStyle,
                          border: "2px solid #00e7fc",
                          margin: "0px 5px 0px 40px",
                          fontFamily: "roboto-regular",
                          "&:hover": {
                            backgroundColor: "#00e7fc80",
                          },
                          padding: "3px 20px",
                          backgroundColor:
                            currentUrl === "/login" ? "#00e7fc80" : "#fff",
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{
                          ...navLinkStyle,
                          display: { xs: "none", md: "initial" },
                          border: "2px solid #00e7fc",
                          margin: "0px 25px 0px 5px",
                          fontFamily: "roboto-regular",
                          "&:hover": {
                            backgroundColor: "#00e7fc80",
                          },
                          padding: "3px 20px",
                          backgroundColor:
                            currentUrl === "/register" ? "#00e7fc80" : "#fff",
                        }}
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </li>
                )}
              </Box>
              <div style={{ display: "flex", alignItems: "center" }}>
                {role === "company" || role === "pilot" || role === "" ? (
                  <>
                    {role == "pilot" ? (
                      <span onClick={handleUploadfilePopup}>
                        <Button
                          onClick={handleCloseNavMenu}
                          sx={{
                            ...navLinkStyle,
                            fontFamily: "roboto-regular",
                            "&:hover": {
                              background: "#000",
                            },
                            padding: "5px 20px",
                            borderRadius: "30px",
                            background: "#000",
                            color: "#fff",
                          }}
                          className={"addShotBtnNavbarBtn"}
                        >
                          <div className={"addShotBtnNavbarFree"}>Free</div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg width={0} height={0}>
                              <linearGradient
                                id="linearColors"
                                x1={1}
                                y1={0}
                                x2={1}
                                y2={1}
                              >
                                <stop offset={0} stopColor="#00e7fc" />
                                <stop offset={1} stopColor="#4ffea3" />
                              </linearGradient>
                            </svg>
                            <FileUploadOutlinedIcon
                              sx={{
                                fill: "url(#linearColors)",
                                fontSize: "1.3rem",
                              }}
                              className="addShotIconNav"
                            />
                            <span
                              style={{ marginLeft: "5px" }}
                              className="addShotBtnNavbar"
                            >
                              Add Shots
                            </span>
                          </div>
                        </Button>
                      </span>
                    ) : role == "company" ? (
                      <Link href="/job/create">
                        <Button
                          onClick={handleCloseNavMenu}
                          sx={{
                            ...navLinkStyle,
                            fontFamily: "roboto-regular",
                            "&:hover": {
                              background: "#000",
                            },
                            padding: "5px 20px",
                            borderRadius: "30px",
                            background: "#000",
                            color: "#fff",
                          }}
                          className={"addShotBtnNavbarBtn"}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg width={0} height={0}>
                              <linearGradient
                                id="linearColors"
                                x1={1}
                                y1={0}
                                x2={1}
                                y2={1}
                              >
                                <stop offset={0} stopColor="#00e7fc" />
                                <stop offset={1} stopColor="#4ffea3" />
                              </linearGradient>
                            </svg>
                            <FileUploadOutlinedIcon
                              sx={{
                                fill: "url(#linearColors)",
                                fontSize: "1.3rem",
                              }}
                              className="addShotIconNav"
                            />
                            <span
                              style={{ marginLeft: "5px" }}
                              className="addShotBtnNavbar"
                            >
                              Post Job
                            </span>
                          </div>
                        </Button>
                      </Link>
                    ) : (
                      <span onClick={handleUploadfilePopup}>
                        <Button
                          onClick={handleCloseNavMenu}
                          sx={{
                            ...navLinkStyle,
                            fontFamily: "roboto-regular",
                            "&:hover": {
                              background: "#000",
                            },
                            padding: "5px 20px",
                            borderRadius: "30px",
                            background: "#000",
                            color: "#fff",
                          }}
                          className={"addShotBtnNavbarBtn"}
                        >
                          <div className={"addShotBtnNavbarFree"}>Free</div>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg width={0} height={0}>
                              <linearGradient
                                id="linearColors"
                                x1={1}
                                y1={0}
                                x2={1}
                                y2={1}
                              >
                                <stop offset={0} stopColor="#00e7fc" />
                                <stop offset={1} stopColor="#4ffea3" />
                              </linearGradient>
                            </svg>
                            <FileUploadOutlinedIcon
                              sx={{
                                fill: "url(#linearColors)",
                                fontSize: "1.3rem",
                              }}
                              className="addShotIconNav"
                            />
                            <span
                              style={{ marginLeft: "5px" }}
                              className="addShotBtnNavbar"
                            >
                              Add Shots
                            </span>
                          </div>
                        </Button>
                      </span>
                    )}
                  </>
                ) : (
                  ""
                )}
                {account ? (
                  <div
                    style={{
                      marginLeft: "10px",
                      position: "relative",
                      width: "auto",
                      height: "100%",
                      marginTop: "4px",
                    }}
                    onMouseOver={() => setProfileOpen(true)}
                    onMouseOut={() => setProfileOpen(false)}
                  >
                    {profileData.profilePic && (
                      <img
                        src={
                          profileData.profilePic
                            ? `${imageLink}/100x100/${profileData.profilePic}`
                            : `${imageLink}/100x100/pilot-profilePic.png`
                        }
                        className={navbarCss.profilePic}
                        alt=""
                        loading="lazy"
                      />
                    )}

                    {profileOpen ? (
                      <>
                        <div
                          className={navbarCss.profileList}
                          onMouseOver={() => setProfileOpen(true)}
                          onMouseOut={() => setProfileOpen(false)}
                          onClick={() => setProfileOpen(false)}
                        >
                          {role !== "halfPilot" &&
                          role !== "halfCompany" &&
                          role !== "undefined" ? (
                            <>
                              <div
                                style={{
                                  padding: "10px 20px",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #e5e5e5",
                                }}
                                className="mainNavTab"
                                onClick={() => changeTab("account")}
                              >
                                <AccountCircleIcon sx={{ fontSize: "20px" }} />
                                <span className="navTab">Account</span>
                              </div>
                              <div
                                style={{
                                  padding: "10px 20px",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #e5e5e5",
                                }}
                                className="mainNavTab"
                                onClick={() => changeTab("activities")}
                              >
                                <LocalActivityIcon sx={{ fontSize: "20px" }} />
                                <span className="navTab">Activities</span>
                              </div>
                              <div
                                style={{
                                  padding: "10px 20px",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #e5e5e5",
                                }}
                                className="mainNavTab"
                                onClick={() => changeTab("likes")}
                              >
                                {(role === "pilot" && (
                                  <>
                                    <WorkOutlineOutlinedIcon
                                      sx={{ fontSize: "20px" }}
                                    />
                                    <span className="navTab">
                                      Willing to work
                                    </span>
                                  </>
                                )) ||
                                  (role === "company" && (
                                    <>
                                      <WorkOutlineOutlinedIcon
                                        sx={{ fontSize: "20px" }}
                                      />
                                      <span className="navTab">
                                        Hire proposals
                                      </span>
                                    </>
                                  )) || (
                                    <>
                                      <FavoriteIcon sx={{ fontSize: "20px" }} />
                                      <span className="navTab">Likes</span>
                                    </>
                                  )}
                              </div>
                              {role !== "booster" && (
                                <div
                                  style={{
                                    padding: "10px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #e5e5e5",
                                  }}
                                  className="mainNavTab"
                                  onClick={() => changeTab("applied-jobs")}
                                >
                                  {(role === "pilot" && (
                                    <>
                                      <WorkOutlineOutlinedIcon
                                        sx={{ fontSize: "20px" }}
                                      />
                                      <span className="navTab">
                                        Applied jobs
                                      </span>
                                    </>
                                  )) ||
                                    (role === "company" && (
                                      <>
                                        <BookmarkOutlinedIcon
                                          sx={{ fontSize: "20px" }}
                                        />
                                        <span className="navTab">
                                          Saved pilots
                                        </span>
                                      </>
                                    )) ||
                                    (role === "service_center" && (
                                      <>
                                        <HelpOutlinedIcon
                                          sx={{ fontSize: "20px" }}
                                        />
                                        <span className="navTab">
                                          Enquiries
                                        </span>
                                      </>
                                    ))}
                                </div>
                              )}
                              <div
                                style={{
                                  padding: "10px 20px",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #e5e5e5",
                                }}
                                className="mainNavTab"
                                onClick={() => changeTab("downloads")}
                              >
                                <DownloadForOfflineIcon
                                  sx={{ fontSize: "20px" }}
                                />
                                <span className="navTab">Downloads</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                style={{
                                  padding: "10px 20px",
                                  display: "flex",
                                  alignItems: "center",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #e5e5e5",
                                }}
                                className="mainNavTab"
                                onClick={completeProfile}
                              >
                                <DownloadForOfflineIcon
                                  sx={{ fontSize: "20px" }}
                                />
                                <span className="navTab">Complete profile</span>
                              </div>
                            </>
                          )}
                          <div
                            style={{
                              padding: "10px 20px",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            className="mainNavTab"
                            onClick={logout}
                          >
                            <ExitToAppIcon sx={{ fontSize: "20px" }} />
                            <span className="navTab">Logout</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {account ? (
                  <div style={{ marginLeft: "10px", position: "relative" }}>
                    <div
                      onMouseOver={() => setChats(true)}
                      onMouseOut={() => setChats(false)}
                      className=""
                      id="msgIcon"
                    >
                      <ChatIcon sx={{ color: "#00e7fc", cursor: "pointer" }} />
                    </div>
                    <div
                      className={`${navbarCss.redBtn} `}
                      onMouseOver={() => setChats(true)}
                      onMouseOut={() => setChats(false)}
                    >
                      {unRead}
                    </div>
                    {/* //chats */}
                    {chats ? (
                      <div
                        className={navbarCss.chat}
                        onMouseOver={() => setChats(true)}
                        onMouseOut={() => setChats(false)}
                      >
                        <div className={navbarCss.notificationBar}>
                          <Grid container spacing={0}>
                            <Grid
                              item
                              xl={6}
                              lg={6}
                              md={6}
                              sm={6}
                              xs={6}
                              sx={6}
                            >
                              <div
                                className={
                                  activitiesTab == "messages"
                                    ? navbarCss.notiTab
                                    : navbarCss.notiTabActive
                                }
                                onClick={() => changeActivitiesTab("messages")}
                              >
                                Messages
                              </div>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                              <div
                                className={
                                  activitiesTab == "activities"
                                    ? navbarCss.notiTab
                                    : navbarCss.notiTabActive
                                }
                                style={{ borderLeft: "2px solid #e5e5e5" }}
                                onClick={() =>
                                  changeActivitiesTab("activities")
                                }
                              >
                                Activities
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                        <div
                          style={{
                            padding: "2px 10px",
                            overflow: "auto",
                           
                          }}
                          className={navbarCss.chatDiv}
                        >
                          {activitiesTab == "messages" ? (
                            <>
                              {chatContent.length == 0 ? (
                                <>
                                  <Alert severity="info">
                                    No messages yet!!
                                  </Alert>
                                </>
                              ) : (
                                <></>
                              )}
                              {chatContent.map((item, i) => {
                                //chatcontent
                                return (
                                  //image and title part
                                  <>
                                    <div
                                      onClick={() => openChat(item._id)}
                                      key={i}
                                    >
                                      {/* //companyChat */}
                                      {item.chatType == "companyChat" && (
                                        <div
                                          style={{
                                            borderBottom: "1px solid #e5e5e5",
                                          }}
                                        >
                                          {item.users.map((user, i) => {
                                            return (
                                              <>
                                                <div key={i}>
                                                  {user._id !==
                                                    profileData._id && (
                                                    <div
                                                      className={
                                                        navbarCss.chatData
                                                      }
                                                    >
                                                      {!item.lastChat.readBy.includes(
                                                        profileData._id
                                                      ) ? (
                                                        <div
                                                          style={{
                                                            float: "right",
                                                            marginTop: "10px",
                                                            color: "#00e7fc",
                                                          }}
                                                        >
                                                          <NotificationsActiveIcon />
                                                        </div>
                                                      ) : (
                                                        <></>
                                                      )}

                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          padding: "5px",
                                                        }}
                                                      >
                                                        <img
                                                          src={
                                                            user.profilePic
                                                              ? `${imageLink}/100x100/${user.profilePic}`
                                                              : `${imageLink}/100x100/pilot-profilePic.png`
                                                          }
                                                          className={
                                                            navbarCss.chatPic
                                                          }
                                                          loading="lazy"
                                                        />
                                                        <div
                                                          style={{
                                                            marginLeft: "10px",
                                                          }}
                                                        >
                                                          {role == "company" ? (
                                                            <div
                                                              className={
                                                                navbarCss.chatName
                                                              }
                                                            >
                                                              {user.name}
                                                            </div>
                                                          ) : (
                                                            <div>
                                                              {
                                                                item.companyId
                                                                  .companyName
                                                              }
                                                            </div>
                                                          )}
                                                          <div
                                                            className={
                                                              item.lastChat &&
                                                              item.lastChat
                                                                .readBy &&
                                                              item.lastChat.readBy.includes(
                                                                profileData._id
                                                              )
                                                                ? navbarCss.chatmsg
                                                                : navbarCss.chatmsg1
                                                            }
                                                          >
                                                            {item .lastChat 
                                                              .message.length >
                                                            30
                                                              ? item.lastChat.message.slice(
                                                                  0,
                                                                  27
                                                                ) + "..."
                                                              : item.lastChat
                                                                  .message}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </>
                                            );
                                          })}
                                        </div>
                                      )}
                                      {/* //jobApplication */}
                                      {item.chatType == "jobApplication" && (
                                        <div
                                          style={{
                                            borderBottom: "1px solid #e5e5e5",
                                          }}
                                        >
                                          {item.users.map((user, i) => {
                                            return (
                                              <>
                                                <div key={i}>
                                                  {user._id !==
                                                    profileData._id && (
                                                    <div
                                                      className={
                                                        navbarCss.chatData
                                                      }
                                                    >
                                                      {item.lastChat &&
                                                      item.lastChat.readBy &&
                                                      !item.lastChat.readBy.includes(
                                                        profileData._id
                                                      ) ? (
                                                        <div
                                                          style={{
                                                            float: "right",
                                                            marginTop: "10px",
                                                            color: "#00e7fc",
                                                          }}
                                                        >
                                                          <NotificationsActiveIcon />
                                                        </div>
                                                      ) : (
                                                        <></>
                                                      )}

                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          padding: "5px",
                                                        }}
                                                      >
                                                        <img
                                                          src={
                                                            user.profilePic
                                                              ? `${imageLink}/100x100/${user.profilePic}`
                                                              : `${imageLink}/100x100/pilot-profilePic.png`
                                                          }
                                                          className={
                                                            navbarCss.chatPic
                                                          }
                                                          loading="lazy"
                                                        />
                                                        <div
                                                          style={{
                                                            marginLeft: "10px",
                                                          }}
                                                        >
                                                          {role == "company" ? (
                                                            <div
                                                              className={
                                                                navbarCss.chatName
                                                              }
                                                            >
                                                              {user.name}-
                                                              {
                                                                item.jobId
                                                                  .jobTitle
                                                              }
                                                            </div>
                                                          ) : (
                                                            <div>
                                                              {
                                                                item.jobId
                                                                  .jobTitle
                                                              }
                                                            </div>
                                                          )}
                                                          <div
                                                            className={
                                                              item.lastChat &&
                                                              item.lastChat
                                                                .readBy &&
                                                              item.lastChat.readBy.includes(
                                                                profileData._id
                                                              )
                                                                ? navbarCss.chatmsg
                                                                : navbarCss.chatmsg1
                                                            }
                                                          >
                                                            
                                                            {item .lastChat
                                                              .message.length >
                                                            30
                                                              ? item.lastChat.message.slice(
                                                                  0,
                                                                  27
                                                                ) + "..."
                                                              : item.lastChat
                                                                  .message}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </>
                                            );
                                          })}
                                        </div>
                                      )}
                                      {/* //centerEnquiry */}
                                      {item.chatType == "centerEnquiry" && (
                                        <div
                                          style={{
                                            borderBottom: "1px solid #e5e5e5",
                                          }}
                                        >
                                          {item.users.map((user, i) => {
                                            return (
                                              <>
                                                <div key={i}>
                                                  {user._id !==
                                                    profileData._id && (
                                                    <div
                                                      className={
                                                        navbarCss.chatData
                                                      }
                                                    >
                                                      {!item.lastChat.readBy.includes(
                                                        profileData._id
                                                      ) ? (
                                                        <div
                                                          style={{
                                                            float: "right",
                                                            marginTop: "10px",
                                                            color: "#00e7fc",
                                                          }}
                                                        >
                                                          <NotificationsActiveIcon />
                                                        </div>
                                                      ) : (
                                                        <></>
                                                      )}

                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          padding: "5px",
                                                        }}
                                                      >
                                                        <img
                                                          src={
                                                            user.profilePic
                                                              ? `${imageLink}/100x100/${user.profilePic}`
                                                              : `${imageLink}/100x100/pilot-profilePic.png`
                                                          }
                                                          className={
                                                            navbarCss.chatPic
                                                          }
                                                          loading="lazy"
                                                        />
                                                        <div
                                                          style={{
                                                            marginLeft: "10px",
                                                          }}
                                                        >
                                                          {role ==
                                                          "service_center" ? (
                                                            <div
                                                              className={
                                                                navbarCss.chatName
                                                              }
                                                            >
                                                              {user.name}
                                                            </div>
                                                          ) : (
                                                            <div>
                                                              {item.centerId &&
                                                                item.centerId
                                                                  .centerName}
                                                            </div>
                                                          )}
                                                          <div
                                                            className={
                                                              item.lastChat.readBy.includes(
                                                                profileData._id
                                                              )
                                                                ? navbarCss.chatmsg
                                                                : navbarCss.chatmsg1
                                                            }
                                                          >
                                                            {item.lastChat
                                                              .message.length >
                                                            30
                                                              ? item.lastChat.message.slice(
                                                                  0,
                                                                  27
                                                                ) + "..."
                                                              : item.lastChat
                                                                  .message}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                );

                                //chatcontent
                              })}
                            </>
                          ) : (
                            <>
                              {notifications.length == 0 ? (
                                <>
                                  <Alert severity="info">
                                    No activities yet!!
                                  </Alert>
                                </>
                              ) : (
                                <></>
                              )}
                              {
                                notifications.length !== 0 && <div className={navbarCss.markallasread} onClick={markAllRead}>
                                Mark all read
                              </div>
                              }
                              
                              {notifications.map((item, i) => {
                                return (
                                  <div key={i}>
                                    {item.notificationType == "follow" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            borderBottom: "1px solid #e5e5e5",
                                            cursor:"pointer"
                                          }}
                                          onClick={()=>redirectToLanding(item.createdBy._id, item._id)}
                                        >
                                          <img
                                            src={`${imageLink}/100x100/${item.createdBy.profilePic}`}
                                            className={navbarCss.chatPic}
                                            loading="lazy"
                                          />
                                          <div
                                            style={{
                                              marginLeft: "10px"
                                             
                                            }}
                                          >
                                            <div className={navbarCss.chatName} style={{fontFamily: item.read ? "roboto-regular" : "roboto-bold"}}>
                                              {item.createdBy.name} started following you.
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {item.notificationType == "likeImage" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            borderBottom: "1px solid #e5e5e5",
                                            cursor:"pointer"
                                          }}
                                          onClick={()=>redirectImageLanding(item.imageId.slug, item._id)}
                                        >
                                          <img
                                            src={`${imageLink}/100x100/${item.createdBy.profilePic}`}
                                            className={navbarCss.chatPic}
                                            loading="lazy"
                                          />
                                          <div
                                            style={{
                                              marginLeft: "10px"
                                             
                                            }}
                                          >
                                            <div className={navbarCss.chatName} style={{fontFamily: item.read ? "roboto-regular" : "roboto-bold"}}>
                                              {item.createdBy.name} liked your Image
                                            </div>
                                          </div>
                                          <img src={`${imageLink}/100x100/${item.imageId.file}`} className={navbarCss.notificationsImage}/>
                                        </div>
                                      </>
                                    )}
                                    {item.notificationType == "commentImage" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            borderBottom: "1px solid #e5e5e5",
                                            cursor:"pointer"
                                          }}
                                          onClick={()=>redirectImageLanding(item.imageId.slug, item._id)}
                                        >
                                          <img
                                            src={`${imageLink}/100x100/${item.createdBy.profilePic}`}
                                            className={navbarCss.chatPic}
                                            loading="lazy"
                                          />
                                          <div
                                            style={{
                                              marginLeft: "10px"
                                             
                                            }}
                                          >
                                            <div className={navbarCss.chatName} style={{fontFamily: item.read ? "roboto-regular" : "roboto-bold"}}>
                                              {item.createdBy.name} commented on your Shot - {item.commentId.comment.length<15 ? item.commentId.comment : item.commentId.comment.slice(0,13)+"..."}
                                            </div>
                                          </div>
                                          <img src={`${imageLink}/100x100/${item.imageId.file}`} className={navbarCss.notificationsImage}/>
                                        </div>
                                      </>
                                    )}
                                    {item.notificationType == "replyComment" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            borderBottom: "1px solid #e5e5e5",
                                            cursor:"pointer"
                                          }}
                                          onClick={()=>redirectImageLanding(item.imageId.slug, item._id)}
                                        >
                                          <img
                                            src={`${imageLink}/100x100/${item.createdBy.profilePic}`}
                                            className={navbarCss.chatPic}
                                            loading="lazy"
                                          />
                                          <div
                                            style={{
                                              marginLeft: "10px"
                                             
                                            }}
                                          >
                                            <div className={navbarCss.chatName} style={{fontFamily: item.read ? "roboto-regular" : "roboto-bold"}}>
                                              {item.createdBy.name} replied to your comment - {item.commentId.comment.length<15 ? item.commentId.comment : item.commentId.comment.slice(0,13)+"..."}
                                            </div>
                                          </div>
                                          <img src={`${imageLink}/100x100/${item.imageId.file}`} className={navbarCss.notificationsImage}/>
                                        </div>
                                      </>
                                    )}
                                    {item.notificationType == "newImage" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            borderBottom: "1px solid #e5e5e5",
                                            cursor:"pointer"
                                          }}
                                          onClick={()=>redirectImageLanding(item.imageId.slug, item._id)}
                                        >
                                          <img
                                            src={`${imageLink}/100x100/${item.createdBy.profilePic}`}
                                            className={navbarCss.chatPic}
                                            loading="lazy"
                                          />
                                          <div
                                            style={{
                                              marginLeft: "10px"
                                             
                                            }}
                                          >
                                            <div className={navbarCss.chatName} style={{fontFamily: item.read ? "roboto-regular" : "roboto-bold"}}>
                                              {item.createdBy.name} added new Shot
                                            </div>
                                          </div>
                                          <img src={`${imageLink}/100x100/${item.imageId.file}`} className={navbarCss.notificationsImage}/>
                                        </div>
                                      </>
                                    )}
                                    {item.notificationType == "likeComment" && (
                                      <>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "5px",
                                            borderBottom: "1px solid #e5e5e5",
                                            cursor:"pointer"
                                          }}
                                          onClick={()=>redirectImageLanding(item.imageId.slug, item._id)}
                                        >
                                          <img
                                            src={`${imageLink}/100x100/${item.createdBy.profilePic}`}
                                            className={navbarCss.chatPic}
                                            loading="lazy"
                                          />
                                          <div
                                            style={{
                                              marginLeft: "10px"
                                             
                                            }}
                                          >
                                            <div className={navbarCss.chatName} style={{fontFamily: item.read ? "roboto-regular" : "roboto-bold"}}>
                                              {item.createdBy.name} liked your comment - {item.commentId.comment.length<15 ? item.commentId.comment : item.commentId.comment.slice(0,13)+"..."}
                                            </div>
                                          </div>
                                          <img src={`${imageLink}/100x100/${item.imageId.file}`} className={navbarCss.notificationsImage}/>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <DehazeIcon
                  sx={{
                    cursor: "pointer",
                    marginLeft: "15px",
                    display: "none",
                  }}
                  onClick={setSideBar}
                  className={"toggleBtnNavBar"}
                />
              </div>
            </Toolbar>
            <Dialog
              open={uploadPopup}
              // open={true}
              onClose={() => setUploadPopup(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth={"md"}
              fullWidth={true}
              PaperProps={{
                style: {
                  width: "820px",
                  borderRadius: "10px",
                  paddingTop: "10px",
                },
              }}
            >
              <DialogContent style={{ color: "black" }}>
                <div style={{ textAlign: "right" }}>
                  <CloseIcon
                    onClick={() => setUploadPopup(false)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className={navbarCss.uploadfilePopupTitle}>Hi Pilot!.</div>
                <div className={navbarCss.uploadfilePopupDesc}>
                  We are glad to see you on board. To create your own job
                  opportunities and Explore your awesome works to others keep
                  your profile up to date by using{" "}
                  <Link href="/pilot-dashboard/account">
                    <a style={{ textDecoration: "underline" }}>link. </a>
                  </Link>
                  Nexdro is the right place to get connected with the Drone
                  pilots Network.
                </div>
                <div className={navbarCss.uploadfilePopupDesc}>
                  Here some of the quick guideline for Shot Upload.
                </div>
                {/* <div className={navbarCss.uploadfilePopupTitle2}>Terms</div> */}
                <section style={{ marginBottom: "20px" }}>
                  <div className={navbarCss.uploadfilePopupTitle3}>
                    Photo and 3D Type:{" "}
                    <span style={{ fontFamily: "roboto-regular" }}>
                      JPG, JPEG and PNG
                    </span>
                  </div>
                  <div className={navbarCss.uploadfilePopupTitle3}>
                    Video Type:{" "}
                    <span style={{ fontFamily: "roboto-regular" }}>
                      MP4 and MOV
                    </span>
                  </div>
                  <div className={navbarCss.uploadfilePopupTitle3}>
                    Photo and 3D Dimension:{" "}
                    <span style={{ fontFamily: "roboto-regular" }}>
                      Minimum Width: 1100px and Minimum Height: 500px
                    </span>
                  </div>
                  <div className={navbarCss.uploadfilePopupTitle3}>
                    Photo Size:{" "}
                    <span style={{ fontFamily: "roboto-regular" }}>
                      Minimum 2 MB to 25 MB (For Better View)
                    </span>
                  </div>
                  <div className={navbarCss.uploadfilePopupTitle3}>
                    3D Size:{" "}
                    <span style={{ fontFamily: "roboto-regular" }}>
                      Minimum 2 MB to 25 MB (For Better View)
                    </span>
                  </div>
                  <div className={navbarCss.uploadfilePopupTitle3}>
                    Video Size:{" "}
                    <span style={{ fontFamily: "roboto-regular" }}>
                      Minimum 2 MB to 100 MB (For Better View)
                    </span>
                  </div>
                </section>
                <div className={navbarCss.uploadfilePopupTitle2}>
                  Reason for Rejection
                </div>
                <div className={navbarCss.uploadfilePopupErrorsContainer}>
                  <div className={navbarCss.uploadfilePopupError}>
                    Size exceeded
                  </div>
                  <div className={navbarCss.uploadfilePopupError}>
                    Not Supported file formats
                  </div>
                  <div className={navbarCss.uploadfilePopupError}>
                    Image dimensions below the recommended
                  </div>
                </div>
                <div className={navbarCss.uploadfilePopupDesc}>
                  <span style={{ fontFamily: "roboto-bold" }}>Note: </span>
                  Photo should be in high Quality in standard landscape view and
                  photo should not contain any nudity and violence, For More
                  Detail kindly refer to our{" "}
                  <Link href={"/terms-and-conditions"}>
                    <a style={{ textDecoration: "underline" }}>
                      terms and conditions.
                    </a>
                  </Link>
                </div>

                <div className={navbarCss.uploadfilePopupBtnContainer}>
                  <Button className="formBtn2" onClick={RedirectUploadFiles}>
                    Upload Now
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Container>
        </AppBar>
      </ThemeProvider>

      <Dialog
        open={chatOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeHandler}
        aria-describedby="alert-dialog-slide-description"
      >
        <div>
          <ClearRoundedIcon className="popupClose" onClick={closeHandler} />
          {temp ? <Chat id={temp} loadData={tempLoadData} /> : <></>}
        </div>
      </Dialog>
    </div>
  );
};

export default Navbar;
