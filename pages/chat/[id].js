import React, { useEffect, useState } from "react";
import css from "../../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import Loader from "../../components/loader";
import { MouseOutlined } from "@mui/icons-material";
import Router from "next/router";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
var socket, selectedChatCompare;
export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  return {
    props: {
      id: id,
    },
  };
}
function Chat({ id, loadData}) {
  let [chatId1, setChatId] = useState(id);
  let [data, setData] = useState([]);
  let [myId, setMyId] = useState("");
  let [chatdetails, setChatDetails] = useState({});
  let [myRole, setMyRole] = useState("");

  useEffect(() => {
    loadData("hello")
   let z = moment().format('YYYY-MM-DD')
   console.log(z)
    document.getElementById("chatInput").focus()
  
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/message/getMessages/${id}`).then((res) => {
      console.log(res);
      setData(res.data);
      setTimeout(() => {
        var elem = document.getElementById("msgsContainer");
        elem.scrollTo({
          top: elem.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    });
    axios.get(`${domain}/api/chat/getChatDetails/${id}`).then((res1) => {
      // socket.emit("hello", res1.data.users);
      setChatData(res1.data);
    });
    axios
      .get(`${domain}/api/chat/getChatDetailsPopulated/${id}`)
      .then((res1) => {
        console.log(res1.data);
        setChatDetails(res1.data);
      });
    axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
      setMyRole(res.data.role);
      console.log(res);
      setMyId(res.data._id);
      if(!socket){
        socket = io(localhost);
        socket.emit("setup", res.data);
        socket.on("connected", () => console.log("connected"));
      }
      
      socket.on("newMessage", (chatId) => {
        if (chatId1 == chatId) {
          axios.get(`${domain}/api/message/getMessages/${id}`).then((res) => {
            console.log(res);
            setData(res.data);
            axios
              .post(`${domain}/api/chat/makemessagesRead/${id}`, config)
              .then((res) => {
                console.log(res.data);
              });
            setTimeout(() => {
              var elem = document.getElementById("msgsContainer");
              elem.scrollTo({
                top: elem.scrollHeight,
                behavior: "smooth",
              });
            }, 200);
          });
        }
      });
      socket.on("typingMessage", (data) => {
        let userId = data.userId;
        let chatId = data.chatId;
        if (chatId1 == chatId) {
          if (userId !== myId) {
            setTyping(true);
            setTimeout(() => {
              var elem = document.getElementById("msgsContainer");
              elem.scrollTo({
                top: elem.scrollHeight,
                behavior: "smooth",
              });
            }, 200);
          }
        }
      });
      socket.on("typingStopped", (userId) => {
        setTyping(false);
        setTimeout(() => {
          var elem = document.getElementById("msgsContainer");
          elem.scrollTo({
            top: elem.scrollHeight,
            behavior: "smooth",
          });
        }, 200);
      });
      
    });
    axios
      .post(`${domain}/api/chat/makemessagesRead/${id}`, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
     () =>  socket.disconnect()
  }, []);

  const [msgInput, setMsgInput] = useState("");
  let [typing, setTyping] = useState(false);
  const textChange = (e) => {
    if (e.target.value.length != 0) {
      socket.emit("typing", { chatData, myId });
    } else {
      socket.emit("typingStopped", { chatData, myId });
    }

    document.getElementById("message_error").display = "none";
    setMsgInput(e.target.value);
  };

  //test
  let [chatData, setChatData] = useState({});
  let checkEnter = (e) => {
    if (e.key == "Enter") {
      sendMsg();
    }
  };
  const sendMsg = () => {
    socket.emit("typingStopped", { chatData, myId });
    if (msgInput.length > 100 || msgInput.trim().length <= 0) {
      document.getElementById("message_error").innerHTML =
        "Message should be between 3 - 100";
      document.getElementById("message_error").display = "block";
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/message/createMessage`,
          { message: msgInput, chatId: id },
          config
        )
        .then((res) => {
          axios.get(`${domain}/api/chat/getChatDetails/${id}`).then((res1) => {
            setChatData(res1.data);
            socket.emit("newText", {
              chatData: res1.data,
              messageData: res.data,
            });
          });
         
          axios.get(`${domain}/api/message/getMessages/${id}`).then((res) => {

            console.log(res);
            setData(res.data);
            var elem = document.getElementById("msgsContainer");
            elem.scrollTo({
              top: elem.scrollHeight + 100,
              behavior: "smooth",
            });
          });
          loadData("hello")
        });
      setMsgInput("");
      setTimeout(() => {
        var elem = document.getElementById("msgsContainer");
        elem.scrollTo({
          top: elem.scrollHeight + 100,
          behavior: "smooth",
        });
      }, 350);
    }
  };
let mouseOvered = (id) =>{
  document.getElementById(`date_${id}`).style.display = "block"
}
let MouseOutlined = (id) =>{
  document.getElementById(`date_${id}`).style.display = "none"
}
let redirectToLanding = (id) =>{
  axios.post(`${domain}/api/user/getRoute/${id}`).then(res=>{
    console.log(id)
    console.log(res)
    if(res.data !== "booster"){
      Router.push(res.data.path)
    }
  })
}

  return (
    <div className={css.mainDiv}>
      <div className={css.navTab}>
        {/* //companyChat */}
       {
        chatData.chatType == "companyChat" && <>
        {
         chatdetails.users && chatdetails.users.map((user,i)=>{
          return(
            <>
            {user._id !== myId && <div style={{display:"flex", alignItems:"center"}}>
              <img src={`${imageLink}/100x100/${user.profilePic}`} className={css.profilePic} onClick={()=>redirectToLanding(user._id)} />
              {
                myRole == "company" ? <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{user.name}</div> : <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{chatdetails.companyId.companyName}</div>
              }
              </div>}
            </>
          )
         })
        }
        </>
       }
       {/* //jobApplication */}
       {
        chatData.chatType == "jobApplication" && <>
        {
         chatdetails.users && chatdetails.users.map((user,i)=>{
          return(
            <>
            {user._id !== myId && <div style={{display:"flex", alignItems:"center"}}>
              <img src={`${imageLink}/100x100/${user.profilePic}`} className={css.profilePic}  onClick={()=>redirectToLanding(user._id)}/>
              {
                myRole == "company" ? <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{user.name}-{chatdetails.jobId.jobTitle}</div> : <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{chatdetails.jobId.jobTitle}</div>
              }
              </div>}
            </>
          )
         })
        }
        </>
       }
       {/* centerEnquiry */}
       {
        chatData.chatType == "centerEnquiry" && <>
        {
         chatdetails.users && chatdetails.users.map((user,i)=>{
          return(
            <>
            {user._id !== myId && <div style={{display:"flex", alignItems:"center"}}>
              <img src={`${imageLink}/100x100/${user.profilePic}`} className={css.profilePic} onClick={()=>redirectToLanding(user._id)} />
              {
                myRole == "service_center" ? <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{user.name}</div> : <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{chatdetails.centerId.centerName}</div>
              }
              </div>}
            </>
          )
         })
        }
        </>
       }
       {/* courseEnquiry */}
       {
        chatData.chatType == "courseEnquiry" && <>
        {
         chatdetails.users && chatdetails.users.map((user,i)=>{
          return(
            <>
            {user._id !== myId && <div style={{display:"flex", alignItems:"center"}}>
              <img src={`${imageLink}/100x100/${user.profilePic}`} className={css.profilePic} onClick={()=>redirectToLanding(user._id)} />
              {
                myRole == "training_center" ? <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{user.name}</div> : <div className={css.mainName} onClick={()=>redirectToLanding(user._id)}>{`${chatdetails.trainingCenterId.centerName} - ${chatdetails.courseId.courseTitle}`}</div>
              }
              </div>}
            </>
          )
         })
        }
        </>
       }
      </div>
      <div className={css.chatBox}>
        {/* //message input */}
        <div className={css.msg}>
          <input
            type="text"
            className={css.input}
            placeholder="Type message..."
            onChange={textChange}
            value={msgInput}
            onKeyUp={checkEnter}
            id="chatInput"
          />
          <div className={css.send} onClick={sendMsg}>
            <SendIcon sx={{ margin: "0px", padding: "0px" }} />
          </div>
          <div className="input_error_msg" id="message_error"></div>
        </div>
        <div
          style={{ height: "calc(100% - 50px)", overflowY: "auto" }}
          id="msgsContainer"
        >
          {/* //message input */}
          {data.map((item, index) => {
            return (
              <div key={index}>
                {
                  index == 0 && <div className={css.headDate}>{moment().format('DD-MM-YY') !== moment(item.createdAt).format("DD-MM-YY") ? moment(item.createdAt).format("DD-MM-YY") : "Today"}</div>
                }
                {
                index !== 0 &&  (moment(item.createdAt).format("DD-MM-YY") !== moment(data[index-1].createdAt).format("DD-MM-YY")) && <div className={css.headDate}>{moment().format('DD-MM-YY') !== moment(item.createdAt).format("DD-MM-YY") ? moment(item.createdAt).format("DD-MM-YY") : "Today"}</div>
                }
                
                <>
                  {item.sender._id == myId ? (
                    <div className={css.msgBlock1} >
                      <div className={css.msgDiv1}></div>
                      <div className={css.date} id={`date_${item._id}`}>{moment(item.createdAt).format("HH:mm")}</div>
                      <div className={css.message1}>{item.message}</div>
                      <img
                        src={`${imageLink}/100x100/${item.sender.profilePic}`}
                        className={css.messagePic}
                        onClick={()=>redirectToLanding(item.sender._id)}
                      />
                    </div>
                  ) : (
                    <div className={css.msgBlock}>
                      <div className={css.date1} id={`date_${item._id}`}>{moment(item.createdAt).format("HH:mm")}</div>
                      <div className={css.msgDiv2}></div>
                      <img
                        src={`${imageLink}/100x100/${item.sender.profilePic}`}
                        className={css.messagePic}
                        onClick={()=>redirectToLanding(item.sender._id)}
                      />
                      <div className={css.message}>{item.message}</div>
                    </div>
                  )}
                </>
              </div>
            );
          })}
          {typing ? (
            <div className={css.typing} style={{ width: "fit-content" }}>
              <Loader />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
