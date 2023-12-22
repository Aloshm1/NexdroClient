import React, { useState } from 'react'
import HelpCenter from '../../../components/pilot/HelpCenter'
import MyQueries from '../../../components/pilot/MyQueries'
import PilotAccount from '../../../components/layouts/PilotAccount'
import DashCss from "../../../styles/DashboardSidebar.module.css"
function HelpCenter1() {
    let [component, setComponent] = useState("helpCenter")
    let changeComponent = (e) =>{
        setComponent(e)
    }
  return (
    <>
    <div style={{marginBottom: "20px"}}>
    <button className={component == "helpCenter" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("helpCenter")}>Home</button>
    <button className={component == "myQueries" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("myQueries")}>My Queries</button>
    </div>
    <div>
        {
            component == "helpCenter" ? <HelpCenter /> : <MyQueries />
        }
    </div>
    </>
  )
}
HelpCenter1.Layout = PilotAccount
export default HelpCenter1