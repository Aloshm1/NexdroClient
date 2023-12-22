import { Container } from "@mui/material";
import Router from "next/router";
import React, { useEffect } from 'react'

function NoPageFound() {
  // useEffect(()=>{
  //   let role = localStorage.getItem("role")
  //   // if (role === "pilot"){
  //   //   Router.push("/pilot-dashboard/account")
  //   // }else if (role === "company"){
  //   //   Router.push("/company-dashboard/account")
  //   // }else if (role === "service_center"){
  //   //   Router.push("/center-dashboard/account")
  //   // }else if (role === "booster"){
  //   //   Router.push("/booster-dashboard/account")
  //   // }else if (role === "halfPilot"){
  //   //   Router.push("/create-pilot")
  //   // }else if (role === "halfCompany"){
  //   //   Router.push("/create-company")
  //   // }else 
  //   if (role === "undefined" && localStorage.getItem("email") === "true"){
  //     Router.push("/choose-categories")
  //   }else if (role === "undefined" && localStorage.getItem("email") !== "true"){
  //     Router.push("/verify-email")
  //   }
  //   else if (!role || role === ""){
  //     Router.push("/login")
  //   }
  // }, [])
  return (
    <Container sx = {{height: "100vh"}}>
      <h3 className="page404">404 | No Page Found</h3>
    </Container>
  )
}

export default NoPageFound