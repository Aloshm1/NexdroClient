import { Dialog, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import PilotActivities from "../../../components/layouts/PilotActivities";
import { styled } from "@mui/material/styles";
import css from "../../../styles/center.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chat from "../../chat/[id]";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import MessageIcon from "@mui/icons-material/Message";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Slide from "@mui/material/Slide";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
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
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
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
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function HireProposals() {
  let [data, setData] = useState([]);
  let [open, setOpen] = useState(false);
  let [temp, setTemp] = useState("");
  let [loader, setLoader] = useState(false)
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setLoader(true)
    axios
      .post(`${domain}/api/hireProposal/pilotProposals`, config)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoader(false)
       
      });
  }, []);
  const [expanded, setExpanded] = React.useState("panel1");
  let openChat1 = (otherId) => {
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
  const handleChange = (panel) => {
    setExpanded(panel);
  };

  let tempLoadData = (data) => {};
  let closeChat = () => {
    setOpen(false);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/hireProposal/pilotProposals`, config)
      .then((res) => {
        console.log(res);
        setData(res.data);
        if (res.data.length == 0) {
          document.getElementById("npy").style.display = "block";
        } else {
        }
      });
  };
  return (
    <div>
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
      <div>
        {
          data.length == 0 && <Alert severity="info">No Proposals Yet</Alert>
        }
        
        </div>
      <div>
        {data.map((item, i) => {
          return (
            <div className={css.ceMainDiv} key={i}>
              <Grid container spacing={0} sx = {{alignItems:"center"}}>
                <Grid item xl={3} lg={3} md={4} sm={4} xs={12}>
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
                <Grid item xl={3.5} lg={3.5} md={4} sm={4} xs={12}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`${imageLink}/${item.data.companyId.profilePic}`}
                      style={{
                        width: "25px",
                        height: "25px",
                        borderRadius: "15px",
                      }}
                    />
                    <div className={css.ceDesc} style={{ marginLeft: "10px" }}>
                      {item.data.companyId.companyName}
                    </div>
                  </div>

                  <div className={css.ceDesc} style={{ marginTop: "5px" }}>
                    {item.data.companyId.country}
                  </div>
                </Grid>
                <Grid item xl={3.5} lg={3.5} md={4} sm={4} xs={12}>
                  <div
                    className={css.ceDesc}
                    style={{ textDecoration: "underline" }}
                  >
                    <a href={`tel:${item.data.companyId.phoneNo}`}>
                      {item.data.companyId.phoneNo}
                    </a>
                  </div>
                  <a href={`mailto:${item.data.companyId.emailId}`}>
                    <div className={css.ceDesc}>
                      {item.data.companyId.emailId}
                    </div>
                  </a>
                </Grid>
                <Grid item xl={2} lg={2} md={3} sm={5} xs={12}>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div
                      style={{ position: "relative" }}
                      onClick={() => openChat1(item.data.companyId.userId)}
                    >
                      <MessageIcon
                        sx={{ color: "#00e7fc", cursor: "pointer" }}
                      />
                      <div className={css.ceBadge}>{item.allMessages}</div>
                    </div>
                    <div
                      style={{ position: "relative" }}
                      onClick={() => openChat1(item.data.companyId.userId)}
                    >
                      <AddAlertIcon
                        sx={{ color: "green", cursor: "pointer" }}
                      />
                      <div className={css.ceBadge1}>{item.unRead}</div>
                    </div>
                    <a href={`tel:${item.data.companyId.phoneNo}`}>
                      <div style={{ position: "relative" }}>
                        <AddIcCallIcon sx={{ cursor: "pointer" }} />
                      </div>
                    </a>
                  </div>
                </Grid>
              </Grid>
            </div>
          );
        })}
      </div></>
       }
      
      
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
    </div>
  );
}
HireProposals.Layout = PilotActivities;
export default HireProposals;
