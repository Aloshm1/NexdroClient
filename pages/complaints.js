import { Alert, Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import DroneImg from "../images/drone_image.png";
import Countries from "./api/country.json";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
function Complaints() {
  let [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Company Profile",
    country: "India",
    query: "",
  });
  let [countryCode, setCountryCode] = useState("+91")
  let changeHandler = (e)=>{
    if(e.target.id == "country"){
      var result = Countries.filter(obj => {
        return obj.name === e.target.value
      })
      setCountryCode(result[0].dial_code)
    }
    document.getElementById(`${e.target.id}_error`).style.display = "none"
    if (e.target.id === "phone") {
      console.log(
        e.target.value.slice(e.target.value.length - 1, e.target.value.length)
      );
      if (
        Number(
          e.target.value.slice(e.target.value.length - 1, e.target.value.length)
        ) >= 0 &&
        Number(
          e.target.value.slice(e.target.value.length - 1, e.target.value.length)
        ) <= 10
      ) {
        setData({
          ...data,
          phone: e.target.value
            .slice(countryCode.length + 1, e.target.value.length)
            .trim(),
        });
      }
    }else{
      setData({
        ...data,
        [e.target.id]: e.target.value
    })
    }
 
  }
  let raise = () =>{
    const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
      var focusField = "";
      var error = false;
      let fields = ["name", "email", "phone", "query"];
      for (let i = 0; i < fields.length; i++) {
        if (data[fields[i]] === "") {
          if (focusField == "") {
            focusField = fields[i];
          }
          document.getElementById(
            `${fields[i]}_error`
          ).innerHTML = `${fields[i]} is required`;
          document.getElementById(`${fields[i]}_error`).style.display = "block";
        }
      }
      if (
        data.name !== "" &&
        (data.name.length < 3 || data.name.length > 100)
      ) {
        document.getElementById("name_error").innerHTML =
          "Characters between 3-100";
        document.getElementById("name_error").style.display = "block";
        if(focusField !== ""){
            focusField = "name";
        }
      
      }
      if (
        data.email !== "" &&
        (data.email.length < 3 || data.email.length > 100 || !validateEmail(data.email))
      ) {
        document.getElementById("email_error").innerHTML =
          "Characters between 3-100";
        document.getElementById("email_error").style.display = "block";
        if(focusField !== ""){
            focusField = "email";
        }
      }
      if (
        data.phone !== "" &&
        ((Number(data.phone.length) < 9) || (Number(data.phone.length) > 14) )
      ) {
        document.getElementById("phone_error").innerHTML =
          "Phone No should be between 9  and 14 digits";
        document.getElementById("phone_error").style.display = "block";
            focusField = "phone";
        
      }
      if (
        data.query !== "" &&
        (data.query.length < 3 || data.query.length > 1000)
      ) {
        document.getElementById("query_error").innerHTML =
          "Characters between 3-1000";
        document.getElementById("query_error").style.display = "block";
        if(focusField !== ""){
            focusField = "query";
        }
      }
      if (focusField !== "") {
        document.getElementById(focusField).focus();
      } else {
        axios.post(`${domain}/api/complain/createComplain`, data).then(res=>{
            console.log(res)
            window.scrollTo(0,0)
            document.getElementById("alert").style.display = "flex"
            setTimeout(()=>{
                if(document.getElementById("alert")){
                    document.getElementById("alert").style.display = "none"
                }
            },4000)
        })
        setData({
            name: "",
            email: "",
            phone: "",
            subject: "Company Profile",
            country: "India",
            query: "",
        })
      }
  }
  return (
    <Container className="Container">
        <Alert severity="success" id="alert" sx={{display:"none", marginTop:"40px"}}>Your query has been successfully submitted! We will get in touch with you soon!!</Alert>
      <Grid container spacing={2}>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx = {{display: {xs: "none", md: "block"}}}>
          <Image src={DroneImg} />
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <div style={{ marginTop: "20px"}}>
            <h5 style={{ marginBottom: "20px" }}>
            Raise your complaints by using below form. Our experts will get back to you within 48 Hours.
            </h5>
            <Grid container columnSpacing={2}>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel">Name:</label>
                <input
                  className="inputBox"
                  type="text"
                  id="name"
                  onChange={changeHandler}
                  value={data.name}
                />
                <div className="input_error_msg" id="name_error">
              Password is required
            </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel">Email ID:</label>
                <input
                  className="inputBox"
                  type="email"
                  id="email"
                  onChange={changeHandler}
                  value={data.email}
                />
                <div className="input_error_msg" id="email_error">
              Password is required
            </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel">Phone No:</label>
                <input
                  className="inputBox"
                  type="text"
                  id="phone"
                  onChange={changeHandler}
                  value={`${countryCode} ${data.phone}`}
                />
                <div className="input_error_msg" id="phone_error">
              Password is required
            </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel">Country:</label>
                <select className="inputBox" type="text"
                  id="country"
                  onChange={changeHandler}
                  value={data.country}>
                    {
                        Countries.map((item,i)=>{
                            return(
                                <option value={item.name} key={i}>{item.name}</option>
                            )
                        })
                    }
                </select>
                <div className="input_error_msg" id="country_error">
              Password is required
            </div>
              </Grid>
            </Grid>
            <label className="inputLabel">Subject/Related to :</label>
            <select
              className="inputBox"
              id="subject"
              onChange={changeHandler}
              value={data.subject}
            >
              <option value="Company Profile">Company Profile</option>
              <option value="Pilot Profile">Pilot Profile</option>
              <option value="Center Profile">Center Profile</option>
              <option value="Payments">Payments</option>
              <option value="Shots">Shots</option>
              <option value="Others">Others</option>
            </select>
            <div className="input_error_msg" id="subject_error">
              Password is required
            </div>
            <label className="inputLabel">Your Query:</label>
            <textarea
              className="inputBox"
              type="text"
              style={{ height: "150px", resize: "none", paddingTop: "10px" }}
              id="query"
              onChange={changeHandler}
              value={data.query}
            />
            <div className="input_error_msg" id="query_error">
              Password is required
            </div>
            <Button
              className="formBtn"
              sx={{ marginTop: "10px !important", float: "right" }}
              onClick={raise}
            >
              Raise complain
            </Button>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Complaints;
