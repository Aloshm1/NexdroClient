import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import PilotActivities from "../../../components/layouts/PilotActivities";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import css from "../../../styles/center.module.css"
import job from "../../../styles/job.module.css"
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import Typography from "@mui/material/Typography";
import CompanyActivities from "../../../components/layouts/CompanyActivities";
import Alert from "@mui/material/Alert";
import Link from "next/link";

import Dialog from "@mui/material/Dialog";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import MessageIcon from "@mui/icons-material/Message";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Slide from "@mui/material/Slide";
import Router from "next/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Chat from "../../chat/[id]";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  visibility:"none",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
    visibility: "none"
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function SentProposals() {
  let [open, setOpen] = useState(false);
  let [data, setData] = useState([]);
  let [temp, setTemp] = useState("");
  let [mark, setMark] = useState(false);
  let [tempEnquiry, setTempEnquiry] = useState("");
  let [status, setStatus] = useState("");
  let [filter, setFilter] = useState("All");
  let [loader, setLoader] = useState(false)
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setLoader(true)
    axios
      .post(`${domain}/api/hireProposal/companyProposals`,{status :"All"} ,config)
      .then((res) => {
        console.log(res);
        setLoader(false)
        setData(res.data);
      });
  }, []);
  let tempLoadData = (data) => {};
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  let openChat = (otherId) => {
    setTemp("");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/chat/getCompanyChat`,
        { chatType: "companyChat", otherId },
        config
      )
      .then((res) => {
        console.log(res);
        setTemp(res.data[0]._id);
        setOpen(true);
      });
  };
  let closeChat = () =>{
    setOpen(false)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setLoader(true)
    axios
      .post(`${domain}/api/hireProposal/companyProposals`,{status: filter}, config)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoader(false)
      });
  }
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
    setLoader(true)
    axios.post(`${domain}/api/hireProposal/changeProposalStatus`, {id: tempEnquiry, status: status}).then(res=>{
      axios
      .post(`${domain}/api/hireProposal/companyProposals`,{status: filter}, config)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoader(false)
      });
      setMark(false)
    })
  
  };
  let changeFilter = (e) =>{
    setFilter(e.target.value)
    setLoader(true)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/hireProposal/companyProposals`,{status: e.target.value}, config)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoader(false)
      });
  }
  return (
    <div>
     <div>
  <select value={filter} onChange={changeFilter} className={job.filterSelect}>
    <option value="All">All</option>
    <option value="In Process">In Process</option>
    <option value="Hired">Hired</option>
    <option value="Canceled">Canceled</option>
  </select>
</div>
{
  loader ? <Skeleton
  count={2}
  style={{
    height: "100px",
    borderRadius: "5px",
    marginBottom: "20px",
    border: "1px solid #e8e8e8",
  }}
/> : <>
<center>
        {data.length == 0 ? (
          <Alert severity="info">No Proposals Yet</Alert>
        ) : (
          <></>
        )}
      </center>
      <div>
        {
          data.map((item,i)=>{
            return(
<div className={css.ceMainDiv} key={i}>
            <Grid container spacing={0}>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <Grid container spacing={0}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <div className={css.ceTitle}>Sent on</div>
                    <div className={css.ceDesc}>
                     {item.data.createdAt.slice(0,10)}
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                    <div className={css.ceTitle}>Last Chat</div>
                    <div className={css.ceDesc}>
                     {item.lastChat.slice(0,10)}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <Link href={`/pilot/${item.data.pilotId.userName}`}>
                <a className={css.ceDesc} style={{fontFamily:"roboto-bold", cursor:"pointer"}}>{item.data.pilotId.name}</a>
                </Link>
                <a href={`tel:${item.data.pilotId.phoneNo}`}>
                  <div
                    className={css.ceDesc}
                    style={{ textDecoration: "underline" }}
                  >
                    {item.data.pilotId.phoneNo}
                  </div>
                  </a>
                  <a href={`mailto:${item.data.pilotId.emailId}`}>
                <div className={css.ceDesc}>{item.data.pilotId.emailId}</div>
                </a>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-around", alignItems:"center" }}
                >
                  <div
                    style={{ position: "relative" }}
                    onClick={()=>openChat(item.data.pilotId.userId)}
                  >
                    <MessageIcon sx={{ color: "#00e7fc", cursor: "pointer" }}  />
                    <div className={css.ceBadge}>{item.allMessages}</div>
                  </div>
                  <div
                    style={{ position: "relative" }}
                    onClick={()=>openChat(item.data.pilotId.userId)}
                  >
                    <AddAlertIcon sx={{ color: "green", cursor: "pointer" }} />
                    <div className={css.ceBadge1}>{item.unRead}</div>
                  </div>
                    <div style={{ position: "relative" }}>
                    <a href={`tel:${item.data.pilotId.phoneNo}`}>
                      <AddIcCallIcon sx={{ cursor: "pointer" }} />
                      </a>
                    </div>
                  <div style={{}}>
                    <div
                      className={css.ceDesc}
                      style={{ textDecoration: "underline" }}
                    >
                      Marked as
                    </div>
                    <div  onClick={() =>
                        openStatusBox(item.data._id, item.data.status)
                      }>
                    {item.data.status == "Canceled" && (
                        <div className={css.ceClosedBtn}>
                          {item.data.status}
                        </div>
                      )}
                      {item.data.status == "In Process" && (
                        <div className={css.cePendingBtn}>
                          {item.data.status}
                        </div>
                      )}
                      {item.data.status == "Hired" && (
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
            )
          })
        }
      
      </div>
</>
}

      
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeChat}
        aria-describedby="alert-dialog-slide-description"
      >
        <ClearRoundedIcon
          className="popupClose"
          onClick={closeChat}
        />
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
          <div className="popupTitle">Mark the proposal as?</div>

          <div>
            <select
              className="inputBox"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="In Process">In Process</option>
              <option value="Hired">Hired</option>
              <option value="Canceled">Canceled</option>
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
SentProposals.Layout = CompanyActivities;
export default SentProposals;
