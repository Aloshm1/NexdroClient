import React, { useState } from 'react'
import HelpCenter from '../../../components/pilot/HelpCenter'
import MyQueries from '../../../components/pilot/MyQueries'
import PilotAccount from '../../../components/layouts/PilotAccount'
import DashCss from "../../../styles/DashboardSidebar.module.css"
import CenterAccount from '../../../components/layouts/CenterAccount'
import BoosterAccount from '../../../components/layouts/BoosterAccount'
function HelpCenter1() {
    let [component, setComponent] = useState("helpCenter")
    let changeComponent = (e) =>{
        setComponent(e)
    }
  return (
    <>
    <div style={{marginBottom: "20px"}}>
    <div className={component == "helpCenter" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("helpCenter")}>Home</div>
    <div className={component == "myQueries" ?  DashCss.helpBadgesActive : DashCss.helpBadges} onClick={()=>changeComponent("myQueries")}>My Queries</div>
    </div>
    <div>
        {
            component == "helpCenter" ? <HelpCenter /> : <MyQueries />
        }
    </div>
    </>
  )
}
HelpCenter1.Layout = BoosterAccount
export default HelpCenter1