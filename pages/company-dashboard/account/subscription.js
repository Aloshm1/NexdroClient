import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import Link from "next/link";
import { jsPDF } from "jspdf";
import React, { useEffect } from "react";
import { useState } from "react";
import CompanyAccount from "../../../components/layouts/CompanyAccount";
import DashCss from "../../../styles/pilotDashboard.module.css";
import invoice from "../../../styles/invoice.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Alert } from "@mui/material";
import styles from "../../../styles/pilotPro.module.css";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import Box from '@mui/material/Box';

import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Subscription() {
  const [open2, setOpen2] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  let [subscriptionDetails, setSubscriptionDetails] = useState("");
  let [data, setData] = useState([]);
  const [cardDetails, setCardDetails] = React.useState(false);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/companySubscription/getSubscriptionCompany`, config)
      .then((res) => {
        setSubscriptionDetails(res.data);
        console.log(res);
      });
    axios.get(`${domain}/api/payment/getPayments`, config).then((res) => {
      console.log(res);
      setData(res.data);
    });
    axios.post(`${domain}/api/subscription/getCardDetails`, config)
    .then(res => {
      console.log(res.data)
      setCardDetails(res.data)
    })
  }, []);
  let cancelSubscription = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/companySubscription/cancelSubscription`, config)
      .then((res) => {
        axios
          .post(
            `${domain}/api/companySubscription/getSubscriptionCompany`,
            config
          )
          .then((res) => {
            setSubscriptionDetails(res.data);
            console.log(res);
          });
        setOpen2(false);
      });
  };
  let [pdfData, setPdfData] = useState({
    name: "",
    transactionId: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    date: "",
    plan: "",
    status: "",
    price: "",
    gstNo: "123",
  });
  let downloadInvoice = (
    id,
    name,
    line1,
    line2,
    city,
    state,
    country,
    pinCode,
    createdAt,
    status,
    price,
    plan,
    gstNo
  ) => {
    setPdfData({
      transactionId: id,
      name: name,
      line1: line1,
      line2,
      city,
      state,
      country,
      pinCode,
      date: createdAt.slice(8, 10) + "-" + createdAt.slice(5, 7) + "-" + createdAt.slice(0, 4),
      status,
      price,
      plan,
      gstNo,
    });
    let doc = new jsPDF("portrait", "pt", "A4");
    doc.html(document.getElementById("pdf-view"), {
      callback: () => {
        doc.save("test.pdf");
      },
    });
  };
  return (
    <div>
      {subscriptionDetails == "" ? (
        <div className="HideTitle">Loading...</div>
      ) : (
        <></>
      )}
      {subscriptionDetails.subscription ? (
        <div className={DashCss.subsContainer}>
          <div className={DashCss.subscriptionStatus}>
            {subscriptionDetails.status}
          </div>
          <Grid container spacing={0} style = {{borderBottom: "1px solid #c5c5c5", paddingBottom: "15px", marginBottom:"10px"}}>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
            <div className={DashCss.planTitle} style = {{marginTop: "0px"}}>
                Current Plan :
                <span className={DashCss.planData}>
                {subscriptionDetails.subscription
              ? subscriptionDetails.subscription.planName
              : "Plan"}
                </span>
              </div>
              <div className={DashCss.planTitle}>
                Price :
                <span className={DashCss.planData}>
                  {" "}
                  {subscriptionDetails.price / 100}
                  {subscriptionDetails.currency === "inr" ? " INR " : " USD"}
                </span>
              </div>
              
              <div className={DashCss.planTitle}>
                Duration :
                <span className={DashCss.planData}>
                  {" "}
                  {subscriptionDetails.startDate
                    ? new Date(subscriptionDetails.startDate * 1e3)
                        .toISOString().slice(8,10) + "-" + new Date(subscriptionDetails.startDate * 1e3)
                        .toISOString().slice(5,7) + "-" + new Date(subscriptionDetails.startDate * 1e3)
                        .toISOString().slice(0,4) +
                      " -> " +
                      new Date(subscriptionDetails.endDate * 1e3)
                        .toISOString().slice(8,10) + "-" + new Date(subscriptionDetails.endDate * 1e3)
                        .toISOString().slice(5,7) + "-" + new Date(subscriptionDetails.endDate * 1e3)
                        .toISOString().slice(0,4)
                    : ""}
                </span>
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <div style = {{display: "flex", alignItems: "flex-end", justifyContent: "right", height: "100%", paddingTop: "10px"}}>
                <div className={DashCss.cardDetails}>
                  <img src = "https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo-2006-2014.png" className={DashCss.carcImg}/>
                  <div className={DashCss.cardDetailsContainer}>
                    <div className={DashCss.cardNumber}>{cardDetails.brand?cardDetails.brand.charAt(0).toUpperCase() + cardDetails.brand.slice(1):""} &nbsp; &#x2022;&#x2022;&#x2022;&#x2022; {cardDetails.last4digits}</div>
                    <div className={DashCss.cardExpDate}>Expires on {cardDetails.expMonth}/{cardDetails.expYear}</div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <div className={DashCss.planTitle}>
                No of active jobs :
                <span className={DashCss.planData}>
                  {subscriptionDetails.activeJobs} / {subscriptionDetails.subscription &&
                    subscriptionDetails.subscription.activeJobs}
                </span>
              </div>
              <div className={DashCss.planTitle}>
                Email proposals (Direct Hire) :
                <span className={DashCss.planData}>
                  {subscriptionDetails.proposals} / {subscriptionDetails.subscription &&
                    subscriptionDetails.subscription.directHires}
                </span>
              </div>
              <div className={DashCss.planTitle}>
                Boost job :
                <span className={DashCss.planData}>
                  {subscriptionDetails.jobBoosts} / {subscriptionDetails.subscription &&
                    subscriptionDetails.subscription.boostJob}
                </span>
              </div>
            </Grid>
            <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
              <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "10px",
                  height: "100%",
                  justifyContent: "right"
                }}>
                <button
                  className={DashCss.cancelSubs}
                  onClick={() => setOpen2(true)}
                >
                  Cancel
                </button>
              </div>
            </Grid>
          </Grid>
          
        </div>
      ) : (
        <></>
      )}
      {subscriptionDetails == "No Subscription" ? (
        <>
          <Alert severity="error">No active subscription</Alert>
          {/* <center>
            <Link href="/company-pro">
              <div className={DashCss.hideBtn}>Subscribe</div>
            </Link>
          </center> */}
        </>
      ) : (
        <></>
      )}
      <div style={{ marginTop: "20px" }}>
        {/* <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ visibility: "hidden" }} />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            style={{ pointerEvents: "none" }}
          >
            <div style={{ width: "100%", fontFamily: "roboto-bold" }}>
              <Grid container spcing={1}>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  Date:
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  Plan Name:
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  Cost:
                </Grid>
              </Grid>
            </div>
          </AccordionSummary>
        </Accordion> */}
        {/* {data.length == 0 ? (
          <div className="HideTitle">No Payments Yet</div>
        ) : (
          <></>
        )} */}
        {/* {data.map((item, i) => {
          return (
            <Accordion
              expanded={expanded === item._id}
              onChange={handleChange(item._id)}
              key={i}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div style={{ width: "100%" }}>
                  <Grid container spcing={1}>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                    {item.createdAt.slice(8,10) + "-" + item.createdAt.slice(5,7) + "-" + item.createdAt.slice(0,4)}
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      {item.plan}
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      {item.country !== "India"
                        ? `$ ${item.price / 100}.00`
                        : `INR ${item.price / 100}`}
                    </Grid>
                  </Grid>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ borderTop: "1px solid #e5e5e5" }}>
                  <div className={DashCss.PlanName}>
                    Plan: <span className={DashCss.planSpan}>{item.plan}</span>
                  </div>
                  <div className={DashCss.PlanName}>
                    Cost:{" "}
                    <span className={DashCss.planSpan}>
                      {" "}
                      {item.country !== "India"
                        ? `$ ${item.price / 100}.00`
                        : `INR ${item.price / 100}`}
                    </span>
                  </div>
                  <div className={DashCss.PlanName}>
                    Date:{" "}
                    <span className={DashCss.planSpan}>
                      {" "}
                      {item.createdAt.slice(8,10) + "-" + item.createdAt.slice(5,7) + "-" + item.createdAt.slice(0,4)}
                    </span>
                  </div>
                  <div className={DashCss.PlanName}>
                    Status:{" "}
                    <span className={DashCss.planSpan}>{item.status}</span>
                  </div>
                  <div className={DashCss.PlanName}>
                    Invoice:
                    <button
                      className={DashCss.planSpan}
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                        display: "inline",
                      }}
                      onClick={() =>
                        downloadInvoice(
                          item.transactionId,
                          item.name,
                          item.line1,
                          item.line2,
                          item.city,
                          item.state,
                          item.country,
                          item.pinCode,
                          item.createdAt,
                          item.status,
                          item.price,
                          item.plan,
                          item.gstNo
                        )
                      }
                    >
                      Download here
                    </button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })} */}
        {
          data.length !== 0 ?  <h4>Transaction History</h4>: <></>
        }
       
        <Box sx={{ display: { xs: 'none', lg: "block"}}}>
          {
            data.length !== 0 ?  <div className={styles.subsDetailContainer} style = {{border: "0px"}}>
            <div className={DashCss.PlanName} style = {{width: "21%"}}>
              Plan
            </div>
            <div className={DashCss.PlanName} style = {{width: "17%"}}>
              Cost
            </div>
            <div className={DashCss.PlanName} style = {{width: "15%"}}>
              Date
            </div>
            <div className={DashCss.PlanName} style = {{width: "15%"}}>
              Payment Status
            </div>
            <div className={DashCss.PlanName} style = {{width: "10%", textAlign: "center"}}>
              Invoice
            </div>
          </div> : <></>
          }
       
          {data.map((item, i) => {
            return (
              <div className={styles.subsDetailContainer} key = {i}>
                <div className={DashCss.PlanName} style = {{width: "21%"}}>
                  <span className={DashCss.planSpan}>{item.plan}</span>
                </div>
                <div className={DashCss.PlanName} style = {{width: "17%"}}>
                  {" "}
                  <span className={DashCss.planSpan}>
                    {" "}
                    {item.country !== "India"
                      ? `$ ${item.price / 100}.00`
                      : `INR ${item.price / 100}`}
                  </span>
                </div>
                <div className={DashCss.PlanName} style = {{width: "15%"}}>
                  {" "}
                  <span className={DashCss.planSpan}>
                    {" "}
                    {item.createdAt.slice(8, 10) +
                      "-" +
                      item.createdAt.slice(5, 7) +
                      "-" +
                      item.createdAt.slice(0, 4)}
                  </span>
                </div>
                <div className={DashCss.PlanName} style = {{width: "15%"}}>
                  <span className={DashCss.planSpan}>{item.status === "succeeded"?"success":(item.status ? item.status : "Failed")}</span>
                </div>
                <div className={DashCss.PlanName} style = {{marginRight: "5px", marginLeft: "5px", width: "10%", textAlign: "center"}} >
                  <button
                    className={DashCss.planSpan}
                    style={{
                      display: "inline",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: "0px"
                    }}
                    onClick={() =>
                      downloadInvoice(
                        item.transactionId,
                        item.name,
                        item.line1,
                        item.line2,
                        item.city,
                        item.state,
                        item.country,
                        item.pinCode,
                        item.createdAt,
                        item.status,
                        item.price,
                        item.plan,
                        item.gstNo
                      )
                    }
                  >
                    <DownloadForOfflineIcon/>
                  </button>
                </div>
              </div>
            );
          })}
        </Box>
        <Box sx={{ display: { xs: 'block', lg: "none"}}}>
          {data.map((item, i) => {
            return (
              <div className={styles.subsDetailContainer} key = {i}>
                <div className={DashCss.PlanName}>
                  Plan: <span className={DashCss.planSpan}>{item.plan}</span>
                </div>
                <div className={DashCss.PlanName}>
                  Cost:{" "}
                  <span className={DashCss.planSpan}>
                    {" "}
                    {item.country !== "India"
                      ? `$ ${item.price / 100}.00`
                      : `INR ${item.price / 100}`}
                  </span>
                </div>
                <div className={DashCss.PlanName}>
                  Date:{" "}
                  <span className={DashCss.planSpan}>
                    {" "}
                    {item.createdAt.slice(8, 10) +
                      "-" +
                      item.createdAt.slice(5, 7) +
                      "-" +
                      item.createdAt.slice(0, 4)}
                  </span>
                </div>
                <div className={DashCss.PlanName}>
                  Status: <span className={DashCss.planSpan}>{item.status === "succeeded"?"success":(item.status ? item.status : "Failed")}</span>
                </div>
                <div className={DashCss.PlanName} style = {{marginRight: "5px", marginLeft: "5px"}}>
                  <button
                    className={DashCss.planSpan}
                    style={{
                      display: "inline",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: "0px"
                    }}
                    onClick={() =>
                      downloadInvoice(
                        item.transactionId,
                        item.name,
                        item.line1,
                        item.line2,
                        item.city,
                        item.state,
                        item.country,
                        item.pinCode,
                        item.createdAt,
                        item.status,
                        item.price,
                        item.plan,
                        item.gstNo
                      )
                    }
                  >
                    <DownloadForOfflineIcon/>
                  </button>
                </div>
              </div>
            );
          })}
        </Box>
        
      </div>
      <Dialog
        open={open2}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose2}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose2} />
          <div className="popupTitle">
            Are you sure you want to cancel Subscription?
          </div>
          <center>
            <div className="popupLoginBtn" onClick={cancelSubscription}>
              Confirm
            </div>
          </center>
        </div>
      </Dialog>
      <div style={{ visibility: "hidden" }}>
        <div id="pdf-view">
          <div className={invoice.cont}>
            <div className={invoice.imageDiv}>
              <center>
                <img
                  src="https://www.nexevo.in/images/logolast.png"
                  className="pdf_iconImg"
                  data-src=""
                  loading="lazy"
                />
              </center>
            </div>
            <div className={invoice.pdfInvoiceDiv}>
              <div className={invoice.title}>Payment Invoice :</div>
              <div className={invoice.title}>{pdfData.transactionId}</div>
            </div>
            <div>
              <Grid container spacing={0}>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className={invoice.pdfInvoiceDiv}
                >
                  <div className={invoice.title1}>Client</div>
                  <div className={invoice.data}>Nexevo Technologies</div>
                  <div className={invoice.data}>Kasturi Nagar, Rajiv Nagar</div>
                  <div className={invoice.data}>Bangalore Karnataka</div>
                  <div className={invoice.data}>India 560041</div>
                </Grid>
                <Grid
                  item
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={6}
                  className={invoice.pdfInvoiceDiv}
                >
                  <div className={invoice.title1}>Customer</div>
                  <div className={invoice.data}>{pdfData.name}</div>
                  <div className={invoice.data}>
                    {pdfData.line1}, {pdfData.line2}
                  </div>
                  <div className={invoice.data}>
                    {pdfData.city} ,{pdfData.state}
                  </div>
                  <div className={invoice.data}>
                    {pdfData.country} {pdfData.pinCode}
                  </div>
                </Grid>
              </Grid>
            </div>
            <div>
              <Grid container spacing={0}>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={4}
                  className={invoice.pdfInvoiceDiv}
                >
                  <div className={invoice.title1}>Payment Date</div>
                  <div className={invoice.data}>{pdfData.date}</div>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={4}
                  className={invoice.pdfInvoiceDiv}
                >
                  <div className={invoice.title1}>Total Amount</div>
                  <div className={invoice.data}>${pdfData.price / 100}.00</div>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={4}
                  className={invoice.pdfInvoiceDiv}
                >
                  <div className={invoice.title1}>GST No:</div>
                  <div className={invoice.data}>
                    {pdfData.gstNo ? pdfData.gstNo : "Non Applicable"}
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className={invoice.pdfInvoiceDiv}>
              <div className={invoice.title1}>Payment Status :</div>
              <div className={invoice.data}>{pdfData.status?pdfData.status:"Failed"}</div>
            </div>
            <div className={invoice.pdfInvoiceDiv}>
              <Grid container spacing={3}>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <div className={invoice.title}>Sl. No</div>
                </Grid>
                <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
                  <div className={invoice.title}>Package Name</div>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                  <div className={invoice.title}>Amount</div>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <div className={invoice.title}>1</div>
                </Grid>
                <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
                  <div className={invoice.title}>{pdfData.plan}</div>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                  <div className={invoice.title}>${pdfData.price / 100}.00</div>
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xl={2} lg={2} md={2} sm={2} xs={2}>
                  <div className={invoice.title}></div>
                </Grid>
                <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
                  <div className={invoice.title}>Total:</div>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                  <div className={invoice.title}>${pdfData.price / 100}.00</div>
                </Grid>
              </Grid>
            </div>
            <div className={invoice.pdfInvoiceDiv}>
              <div className={invoice.data}>
                Notice : Payment once paid will not be refunded under any
                circumstances, your currency is evaluated based on your location
                of residence. Please find the refund policy in help section for
                more details
              </div>
            </div>
            <div className={invoice.pdfInvoiceDiv}>
              <center>
                <div className={invoice.data}>
                  Thank you for joining our Team Pro
                </div>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Subscription.Layout = CompanyAccount;

export default Subscription;
