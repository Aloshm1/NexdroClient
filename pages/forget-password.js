import React, { useEffect } from 'react'
import Router from 'next/router'
function ForgetPassword() {
  useEffect(()=>{
    Router.push("/forgot-password")
  })
  return (
    <div style = {{height: "100vh"}}>forget-password</div>
  )
}

export default ForgetPassword