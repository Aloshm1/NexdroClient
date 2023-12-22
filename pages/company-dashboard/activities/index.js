import React, { useEffect, useState } from 'react'
import DashCss from "../../../styles/DashboardSidebar.module.css"
import CompanyActivities from '../../../components/layouts/CompanyActivities'
import Uploaded from '../../../components/company/uploadedJobs'
import Pending from '../../../components/company/pendingJobs'
import Expired from '../../../components/company/expiredJobs'
import Router from 'next/router'
import { Alert } from '@mui/material'
function HelpCenter1() {
  useEffect(()=>{
    if(localStorage.getItem("jobcreated")){
      document.getElementById("alert").style.display = "block"
      localStorage.removeItem("jobcreated")
    }
    if(localStorage.getItem("jobedited")){
      document.getElementById("alert1").style.display = "block"
      localStorage.removeItem("jobedited")
    }
    setTimeout(()=>{
      if(document.getElementById("alert")){
        document.getElementById("alert").style.display = "none"
      }
      if(document.getElementById("alert1")){
        document.getElementById("alert1").style.display = "none"
      }
    },3000)
  },[])
    let [component, setComponent] = useState("uploaded")
    let changeComponent = (e) =>{
        setComponent(e)
    }
  return (
    <>
    <div id="alert" style={{display:"none", marginBottom:"20px"}}>
    <Alert severity="success">Job created successfully !! View Applications below</Alert>
    </div>
    <div id="alert1" style={{display:"none", marginBottom:"20px"}}>
    <Alert severity="success">Job edited successfully !! View Applications below</Alert>
    </div>
    <div style={{marginBottom: "10px"}}>
    <button className={component == "uploaded" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("uploaded")}>Active</button>
    <button className={component == "pending" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("pending")}>Pending</button>
    <button className={component == "expired" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("expired")}>Expired</button>
    </div>
    
    
    <div>
        {
          component == "uploaded" ? <Uploaded /> : component == "pending" ? <Pending /> : <Expired />
        }
    </div>
    </>
  )
}
HelpCenter1.Layout = CompanyActivities
export default HelpCenter1