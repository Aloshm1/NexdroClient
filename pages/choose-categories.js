import { Container } from "@mui/material";
import React, { useState } from "react";
import styles from "../styles/chooseCategories.module.css";
import Radio from "@mui/material/Radio";
import Button from '@mui/material/Button';
import Router from "next/router";
import axios from "axios";
import { useEffect } from "react";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
function ChooseCategories() {
  useEffect(()=>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if(!localStorage.getItem("access_token")){
      Router.push("/login")
    }
    axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
      console.log(res)
      localStorage.setItem("email",res.data.verify )
      localStorage.setItem("role", res.data.role)
    if(!localStorage.getItem("access_token")){
      Router.push("/login")
    }else if(localStorage.getItem("role") !== "undefined"){
      if(localStorage.getItem("role") == "pilot"){
        Router.push("/pilot-dashboard/account")
      }
      else if(localStorage.getItem("role") == "company"){
        Router.push("/company-dashboard/account")
      }
      else if(localStorage.getItem("role") == "service_center"){
        Router.push("/center-dashboard/account")
      }
      else if(localStorage.getItem("role") == "booster"){
        Router.push("/booster-dashboard/account")
      }
    }
  })
  },[])
  const [categories, setCategories] = useState([
    {
      title: "Want to register as a Drone Pilot",
      content:
        "By registering as a Drone Pilot, You can Upload your drone shots, list your profile under Hire Pilots Directory (Optional), Apply for Jobs, Create job opportunities Globally, Chat with Service centres and so many features.",
    },
    {
      title: "Want to list my service center",
      content:
        "By registering as service center you can create your own service center profiles, Received the Drone service related enquiries from Drone Pilots / Company, Direct Chat with customers and Manage your leads.",
    },
    {
      title: "Download Creatives?",
      content:
        "By Choosing this your account will be registered as a Others, You can Browse & Download the shots, Post a comments, Like, Share. You can switch your account any time Others to above profiles from your dashboard.",
    },
    {
      title: "Want to Hire a Drone Pilot / Post a Job",
      content:
        "By registering as a Employer you can post your Job vacancies, Receive the applicants, Browser Drone Pilots profiles, Direct Hiring, Chatting with Drone Experts Directly, Chat with Service centres and so many features.",
    },
    // {
    //   title: "Training center, want to post courses",
    //   content:
    //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled.",
    // },
  ]);
// const cats = ["pilot", "service_center","booster", "company", "training_center"]
const cats = ["pilot", "service_center","booster", "company"]
  const [selectedCategory, setSelectedCategory] = useState(0);
const selectCategory = () =>{
  let config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  };
console.log(cats[selectedCategory])
if(cats[selectedCategory] === "pilot"){
  Router.push("/create-pilot")
}else if(cats[selectedCategory] === "company"){
  Router.push("/create-company")
}else if(cats[selectedCategory] === "service_center"){
  Router.push("/create-center")
}else if (cats[selectedCategory] === "training_center"){
  Router.push("/create-training-center")
}
else if(cats[selectedCategory] === "booster"){
  axios.post(`${domain}/api/user/updateBoosterRole`, config).then(res=>{
    console.log(res)
    localStorage.setItem("role", "booster")
    localStorage.setItem("accountCreated", "true")
    Router.push("/booster-dashboard/account")
  })
  .catch(err => {
    Router.push("/login")
  })
  
}
}
  return (
    <Container className="Container">
      <h3 className={styles.categoriesTitle}>
        Choose what you are looking for?
      </h3>
      <div className={styles.categoriesListContainer}>
        {categories.map((category, index) => {
          return (
            <div
              className={`${styles.categoryContainer} ${index === selectedCategory&&styles.categoryContainerActive}`}
              style={{ marginRight: index % 2 === 0 ? "30px" : "0px" }}
              onClick = {()=>setSelectedCategory(index)} key={index}
            >
              <div style = {{display: "flex", alignItems: "center"}}>
              <Radio
                type="radio"
                className={styles.categoryRadio}
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: 30,
                    color: index === selectedCategory ? "#4ffea3" : "gray",
                  },
                }}
                checked = {index === selectedCategory}
              />
              <div className={styles.categoryTitle}>{category.title}</div>
              </div>
              <div className={styles.categoryContent}>{category.content}</div>
            </div>
          );
        })}
      </div>
      <div className = {styles.categoryBtnContainer} >
        <Button className = {`${styles.categoryBtn} formBtn`} onClick={selectCategory} style = {{textTransform: "initial"}}>Submit</Button>
      </div>
    </Container>
  );
}

export default ChooseCategories;
