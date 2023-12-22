import React, { useEffect, useState } from "react";
import dashboardCss from "../../styles/DashboardSidebar.module.css";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import popup from "../../styles/popup.module.css";
import Link from "next/link";
import Slide from "@mui/material/Slide";
import axios from "axios";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
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

function HelpCenter() {
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
      setQueryData({
        ...queryData,
        name: res.data.name,
        email: res.data.email,
      });
    });
  }, []);
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let [queryData, setQueryData] = useState({
    name: "",
    email: "",
    query: "Payment not working",
    description: "",
  });
  let changeHandler = (e) => {
    if (e.target.id !== "query") {
      document.getElementById(`${e.target.id}_error`).style.display = "none";
    }
    setQueryData({
      ...queryData,
      [e.target.id]: e.target.value,
    });
  };
  let createQuery = () => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    var focusField = "";
    var error = false;
    let fields = ["name", "email", "description"];
    for (let i = 0; i < fields.length; i++) {
      console.log(queryData[fields[i]]);
      if (queryData[fields[i]] === "") {
        if(focusField == ""){
          focusField = fields[i]
        }
        document.getElementById(
          `${fields[i]}_error`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error`).style.display = "block";
        
      }
    }
    if (
      queryData.name !== "" &&
      (queryData.name.length < 3 || queryData.name.length > 100)
    ) {
      document.getElementById("name_error").innerHTML =
        "Name should be between 3 - 100 characters";
      document.getElementById("name_error").style.display = "block";
      error = true;
      if(focusField == ""){
        focusField = "name"
      }
    }
    if (queryData.email !== "" && !validateEmail(queryData.email)) {
      document.getElementById("email_error").innerHTML = "Invalid Email Id";
      document.getElementById("email_error").style.display = "block";
      error = true;
      if(focusField == ""){
        focusField = "email"
      }
    }
    if (
      queryData.description !== "" &&
      (queryData.description.length < 3 || queryData.description.length > 200)
    ) {
      document.getElementById("description_error").innerHTML =
        "Description should be between 3 - 200 characters";
      document.getElementById("description_error").style.display = "block";
      error = true;
      if(focusField == ""){
        focusField = "description"
      }
    }
    if(focusField !== ""){
      document.getElementById(focusField).focus()
    }else{
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      console.log("All Good")
      axios.post(`${domain}/api/query/createQuery`,{
        name: queryData.name,
        emailId: query.email,
        description: queryData.description,
        query: queryData.query
    } ,config).then(res=>{
      setOpen(false)
     
      axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
        setQueryData({
          query: "Payment not working",
          name: res.data.name,
          email: res.data.email,
          description:""
        });
      });
    })
    }
  };
  return (
    <>
      <div>
        <button className={dashboardCss.AskQuery} onClick={handleClickOpen}>
          Ask Query
        </button>
        <h4>Frequently asked Questions</h4>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Payment Pending, What to do?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>Amount debited and no active Status</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography>
              Does recurring mean we should pay our whole life??
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <Link href={`/help-center`}>
      <button className={dashboardCss.hcShowMore}>Show More</button>
      </Link>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className={popup.popupContainer}>
          <div className={popup.closeBtn} onClick={handleClose}>
            <CloseRoundedIcon style={{ fontSize: "30px" }} />
          </div>
          <div className={popup.popupHead}>Ask a Question?</div>
          <div className={popup.popupDesc}>
            Enter the below details to ask a question our team will connect with
            you soon
          </div>
          <label className="inputLabel" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            className="inputBox"
            id="name"
            value={queryData.name}
            onChange={changeHandler}
          />
          <div className="input_error_msg" id="name_error">
            Name is required
          </div>
          <label className="inputLabel" htmlFor="email">
            Email Id
          </label>
          <input
            type="email"
            className="inputBox"
            id="email"
            value={queryData.email}
            onChange={changeHandler}
          />
          <div className="input_error_msg" id="email_error">
            Email Id is required
          </div>
          <label className="inputLabel" htmlFor="query">
            Query
          </label>
          <select
            className="inputBox"
            value={queryData.query}
            id="query"
            onChange={changeHandler}
          >
            <option value="Payment not working">Payment not working</option>
            <option value="Money Stuck in bank">Money Stuck in bank</option>
            <option value="Want to know some details">
              Want to know some details
            </option>
            <option value="Others">Others</option>
          </select>
          <label className="inputLabel" htmlFor="description">
            Description
          </label>

          <textarea
            onChange={changeHandler}
            value={queryData.description}
            id="description"
            type="text"
            className="inputBox"
            style={{
              height: "150px",
              paddingTop: "10px",
              width: "100%",
              resize: "none",
            }}
          />
          <div className="input_error_msg" id="description_error">
            Description is required
          </div>
          <center>
            <button className={popup.popupSubmit} onClick={createQuery}>
              Submit
            </button>
          </center>
        </div>
      </Dialog>
    </>
  );
}

export default HelpCenter;
