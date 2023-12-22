import { Container } from "@mui/system";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from '@mui/material/styles';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import popup from "../styles/popup.module.css";
import Slide from "@mui/material/Slide";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Alert } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
export async function getServerSideProps(context) {
  
    const res = await fetch(`${domain}/api/faq/getFaqs`);
    const data = await res.json();

    return {
      props: {
        question: data
      },
    };
  }


  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `0px solid ${theme.palette.divider}`,
    marginBottom: "20px",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));
  
  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      {...props}
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    />
  ))(({ theme }) => ({
    border: "2px solid #e7e7e7",
    borderRadius: "35px",
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
      marginTop: "0px",
      marginBottom: "0px",
    },
  }));
  const domain = process.env.NEXT_PUBLIC_LOCALHOST;
  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    paddingLeft: theme.spacing(3),
    background: "#fff"
  }));
function HelpCenter({question}) {
    let [questions, setQuestions] = useState(question)
    useEffect(()=>{
        setExpanded(questions[0]._id)
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
    },[])
    const [expanded, setExpanded] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
    };
    let [data, setData] = useState("")
    let changeHandler1 = (e) =>{
        setData(e.target.value)
    }
    let search = (e) =>{
        e.preventDefault()
        if(data == ""){
          document.getElementById("inputHelp").focus()
        }
        axios.post(`${domain}/api/faq/searchFaqs`,{keyword: data}).then(res=>{
            setQuestions(res.data)
            if(res.data.length > 0)
            setExpanded(res.data[0]._id)
        })
    }
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
         window.scrollTo(0,0)
         document.getElementById("alert").style.display = "flex"
         setTimeout(()=>{
            if(document.getElementById("alert")){
                document.getElementById("alert").style.display = "none"
            }
         },4000)
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
      const [open, setOpen] = React.useState(false);
      const [open1, setOpen1] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
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
  let askQuestion = () =>{
    if(localStorage.getItem("access_token")){
        setOpen(true)
    }else{
        setOpen1(true)
    }
  }
   return (
    <div style={{ padding: "50px 0 30px 0px" }} className="help-center">
      <Container className="Container" maxWidth = "xxl">
        <div style={{ paddingBottom: "30px" }} className="help-query">
        <Alert severity="success" style={{display: "none"}} id="alert">Your Query is been asked!! Check for answers in your dashboard</Alert>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                border: "1px solid #00e6fb",
                boxShadow: "unset",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Keywords"
                value={data}
                onChange={changeHandler1}
                id="inputHelp"
              />
              <IconButton type="submit" sx={{ p: "10px" }} aria-label="search" onClick={search}>
                <SearchIcon />
              </IconButton>
            </Paper>
        </div>
        <div >
            <div className="askQuestion" onClick={askQuestion}>Ask Question</div>
            <h4 style={{paddingTop: "10px"}}>Frequently asked questions</h4>

        </div>
        <div style={{marginTop:"45px"}} className="help-faq">
            {
                questions.map((item, i)=>{
                    return(
                        <Accordion expanded={expanded === item._id} onChange={handleChange(item._id)} key={i}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                          <Typography className="faq_heading">{item.query}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography className="faq_content">
                          {item.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )
                })
            }
     
     
        </div>
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
            <div className={popup.popupSubmit} onClick={createQuery}>
              Submit
            </div>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={open1}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose1}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose1}/>
          <div className="popupTitle">
          You aren&#39;t logged into Nexdro. Please login to continue?
          </div>
          <center>
            <Link href="/login">
          <div className="popupLoginBtn">Login/Signup</div>
          </Link>
          </center>
        </div>
      </Dialog>
      </Container>
    </div>
  );
}

export default HelpCenter;
