import Router from "next/router";
import React, { useEffect, useState } from "react";
import CreateJob from "../../components/company/createJob";
import DraftJob from "../../components/company/draftJob";
import job from "../../styles/job.module.css";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Container } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Create() {
  let [tab, setTab] = useState("create");
  let [backBtn, setBackBtn] = useState(false);
  let changeTab = (tab) => {
    setTab(tab);
  };
  let onChangeTab = (tab) => {
    setTab(tab);
  };
  useEffect(() => {
    // if (!localStorage.getItem("access_token")) {
    //   Router.push("/login");
    // } else if (localStorage.getItem("role") !== "company") {
    //   Router.push("/404");
    // }
    // if (localStorage.getItem("cancelDraft") === "true") {
    //   setTab("draft");
    //   setTimeout(() => {
    //     if (localStorage.getItem("cancelDraft")) {
    //       localStorage.removeItem("cancelDraft");
    //     }
    //   }, 200);
    // }
  }, []);

  // useEffect(() => {
  //     window.onpopstate = (e) => {
  //     history.go(1);
  //     setBackBtn(true)
  //     };
  // }, []);
  let goback = () => {
    window.onpopstate = () => {};
    history.back();
  };
  // useEffect(() => {
  //     return () => {
  //         window.onpopstate = () => {};
  //     }
  // }, [])
  const [goAway, setGoAway] = useState("");

  useEffect(() => {
    if (window) {
      Router.beforePopState(() => {
        const result = window.confirm("are you sure you want to leave?");
        if (!result) {
          Router.push("/job/create");
        }
        console.log(goAway); // this value is always "" even though set differently in code.
        return result;
      });
    }

    return () => {
      if (window) {
        window.onbeforeunload = null;
      }
      Router.beforePopState(() => {
        return true;
      });
    };
  }, [goAway]);

  return (
    <div>
      <div className={`${job.nav}`}>
        <Container>
          <div className={`${job.navContent}`}>
            <button
              className={tab == "create" ? job.navTitleActive : job.navTitle}
              onClick={() => changeTab("create")}
            >
              Create New
            </button>
            <button
              className={tab == "draft" ? job.navTitleActive : job.navTitle}
              onClick={() => changeTab("draft")}
            >
              Draft Job
            </button>
          </div>
        </Container>
      </div>
      <div>
        {tab == "create" ? (
          <CreateJob changeTab1={onChangeTab} />
        ) : (
          <DraftJob />
        )}
      </div>
      <Dialog
        open={backBtn}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setBackBtn(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setBackBtn(false)}
          />
          <div className="popupTitle">
            If you go back all filled data will be erased if any.
          </div>
          <div
            style={{
              display: "flex",
              columnSpace: "10px",
              justifyContent: "center",
            }}
          >
            <div className="formBtn2" onClick={goback}>
              Go back
            </div>
            <div className="formBtn3" onClick={() => setBackBtn(false)}>
              Cancel
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Create;
