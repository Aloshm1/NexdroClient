import React, { useEffect, useState } from "react";
import CenterActivities from "../../../components/layouts/CenterActivities";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid } from "@mui/material";
import axios from "axios";
import css from "../../../styles/center.module.css";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import MessageIcon from "@mui/icons-material/Message";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Slide from "@mui/material/Slide";
import Router from "next/router";
import Chat from "../../chat/[id]";
import { SettingsSystemDaydreamSharp } from "@mui/icons-material";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CenterEnquiries(props) {
  let [data, setData] = useState([]);
  let [open, setOpen] = useState(false);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/enquiry/getEnquiries`, config).then((res) => {
      console.log(res);
      setData(res.data);
    });
  }, []);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  let [temp, setTemp] = useState("");
  let [mark, setMark] = useState(false);
  let [tempEnquiry, setTempEnquiry] = useState("");
  let [status, setStatus] = useState("");
  let openChat = (otherId) => {
    setTemp("");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/chat/getCenterEnquiry`,
        { chatType: "centerEnquiry", otherId },
        config
      )
      .then((res) => {
        console.log(res);
        setTemp(res.data[0]._id);
        setOpen(true);
      });
  };
  let tempLoadData = (data) => {};
  let openStatusBox = (id, status) => {
    setTempEnquiry(id);
    setStatus(status);
    setMark(true);
  };
  let changeStatus = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/enquiry/changeEnquiryStatus`, {
        id: tempEnquiry,
        status: status,
      })
      .then((res) => {
        axios.get(`${domain}/api/enquiry/getEnquiries`, config).then((res) => {
          console.log(res);
          setData(res.data);
        });
        setMark(false);
      });
  };
  let [flag, setFlag] = useState(false);
  let closeChat = () => {
    setOpen(false);
    props.reload(!flag);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/enquiry/getEnquiries`, config).then((res) => {
      console.log(res);
      setData(res.data);
    });
  };
  return (
    <div>
      {data.length == 0 ? (
        <>
          <Alert severity="info">You don&apos;t have any enquiries yet.</Alert>
        </>
      ) : (
        <></>
      )}
      {data.map((item, i) => {
        return (
          <div className={css.ceMainDiv} key={i}>
            <Grid container spacing={0}>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <Grid container spacing={0}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <div className={css.ceTitle}>Received at</div>
                    <div className={css.ceDesc}>
                      {item.data.createdAt.slice(0, 10)}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <div className={css.ceTitle}>Last Chat</div>
                    <div className={css.ceDesc}>
                      {item.lastChat.slice(0, 10)}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div className={css.ceDesc}>{item.data.name}</div>
                <a href={`tel:${item.data.phoneNo}`}>
                  <div
                    className={css.ceDesc}
                    style={{ textDecoration: "underline" }}
                  >
                    {item.data.phoneNo}
                  </div>
                </a>
                <div className={css.ceDesc}>{item.data.location}</div>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div
                    style={{ position: "relative" }}
                    onClick={() => openChat(item.data.userId)}
                  >
                    <MessageIcon sx={{ color: "#00e7fc", cursor: "pointer" }} />
                    <div className={css.ceBadge}>{item.allMessages}</div>
                  </div>
                  <div
                    style={{ position: "relative" }}
                    onClick={() => openChat(item.data.userId)}
                  >
                    <AddAlertIcon sx={{ color: "green", cursor: "pointer" }} />
                    <div className={css.ceBadge1}>{item.unRead}</div>
                  </div>
                  <a href={`tel:${item.data.phoneNo}`}>
                    <div style={{ position: "relative" }}>
                      <AddIcCallIcon sx={{ cursor: "pointer" }} />
                    </div>
                  </a>
                  <div style={{}}>
                    <div
                      className={css.ceDesc}
                      style={{ textDecoration: "underline" }}
                    >
                      Marked as
                    </div>
                    <div
                      onClick={() =>
                        openStatusBox(item.data._id, item.data.status)
                      }
                    >
                      {item.data.status == "Closed" && (
                        <div className={css.ceClosedBtn}>
                          {item.data.status}
                        </div>
                      )}
                      {item.data.status == "Pending" && (
                        <div className={css.cePendingBtn}>
                          {item.data.status}
                        </div>
                      )}
                      {item.data.status == "Canceled" && (
                        <div className={css.ceCanceledBtn}>
                          {item.data.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      })}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeChat}
        aria-describedby="alert-dialog-slide-description"
      >
        <ClearRoundedIcon className="popupClose" onClick={closeChat} />
        <div>{temp ? <Chat id={temp} loadData={tempLoadData} /> : <></>}</div>
      </Dialog>
      <Dialog
        open={mark}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setMark(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <ClearRoundedIcon
          className="popupClose"
          onClick={() => setMark(false)}
          style={{ zIndex: "999" }}
        />
        <div className="popupContainer">
          <div className="popupTitle">Mark enquiry as?</div>

          <div>
            <select
              className="inputBox"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Canceled">Canceled</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <center>
            <button className="popupLoginBtn" onClick={changeStatus}>
              Update
            </button>
          </center>
        </div>
      </Dialog>
    </div>
  );
}
CenterEnquiries.Layout = CenterActivities;
export default CenterEnquiries;
