import { Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import Pro from "../../styles/pilotPro.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "../../components/loader";
import Countries from "../api/country.json";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import PaymentSuccessImg from "../../images/payment_success.png";
import Image from "next/image";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const stripePromise = loadStripe(
  "pk_test_51KqxC0SBkY4kbyYOgZAaa1VUn9UVe4FC4tR2rGAo6XqkpbJXFAz0p3ZZJhAipUxPG78kxQLTAPSG3hxVpRLHdHe500fGatStGD"
);

export async function getServerSideProps(context) {
  const { params } = context;
  const { type } = params;

  return {
    props: {
      id: type,
    },
  };
}

function Checkout({id}) {
  const router = useRouter();
  const planDetailsObj = {
    "gold-monthly": {
      job: 5,
      view: 50,
      email: 100,
      price: 50,
      days: " 30 Days",
      boostJob: 3
    },
    "gold-yearly": {
      job: 60,
      view: 600,
      email: 1200,
      price: 500,
      days: " 1 Year",
      boostJob: 15
    },
    "platinum-monthly": {
      job: 10,
      view: 100,
      email: 200,
      price: 100,
      days: " 30 Days",
      boostJob: 10
    },
    "platinum-yearly": {
      job: 120,
      view: 1200,
      email: 2400,
      price: 1000,
      days: " 1 Year",
      boostJob: 20
    },
  };
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    pin_code: "",
    city: "",
    state: "",
    country: "",
    country_code: "",
    country_object: {},
    gstNo: "",
  });
  const [loading, setLoading] = useState(false);
  const [payment_creation_failed, setPaymentCreationFailed] = useState(false);
  const [payment_failed, setPaymentFailed] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [code, setCode] = useState("");
  const [plan, setPlan] = useState(id)
  const [subId, setSubId] = useState("");
  const [isCompany, setIsCompany] = useState(true)
  let [paymentSuccess, setPaymentSuccess] = useState(false);
  const options = {
    clientSecret: secret,
  };  
  useEffect(() => {
    setIsCompany(localStorage.getItem("role") === "company")
    setPlan(router.query.type)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if(localStorage.getItem("role") === "company"){
      axios
      .post(`${domain}/api/company/getCompanyAddress`, config)
      .then((res) => {
        console.log(res.data);
        const options = Countries.map((d) => ({
          value: d.code,
          label: d.name,
        }));
        var country = {};
        for (var i = 0; i < Countries.length; i++) {
          if (
            Countries[i].name === res.data.country ||
            Countries[i].code === res.data.country
          ) {
            country = { value: Countries[i].code, label: Countries[i].name};
            break;
          }
        }
        console.log(country)
        setFormData({
          ...formData,
          name: res.data.name ? res.data.name : "",
          email: res.data.email ? res.data.email : "",
          line1: res.data.line1 ? res.data.line1 : "",
          line2: res.data.line2 ? res.data.line2 : "",
          pin_code: res.data.pin_code ? Number(res.data.pin_code) : "",
          city: res.data.city ? res.data.city : "",
          state: res.data.state ? res.data.state : "",
          country: country.label,
          country_code: country.value,
          country_object: country
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
    
  }, []);
  const submitStep1 = () => {
    console.log(plan)
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    function checkGST(g){
      let regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(g)
      console.log(regTest)
      return regTest
  }

    if (localStorage.getItem("role") === "company") {
      var fields = [
        "name",
        "email",
        "line1",
        "line2",
        "city",
        "state",
        "country",
        "gstNo"
      ];
    } else {
      var fields = [
        "name",
        "email",
        "phone",
        "line1",
        "line2",
        "city",
        "state",
        "country",
        "gstNo"
      ];
    }

    let error = false;
    let focusField = "";
    for (var i = 0; i < fields.length; i++) {
      if (fields[i] !== "line2" && fields[i] !== "state" && fields[i] !== "gstNo") {
        if (formData[fields[i]] === "") {
          error = true;
          document.getElementById(`${fields[i]}_error`).style.display =
            "contents";
          if (focusField === "" && fields[i] !== "country") {
            focusField = fields[i];
          }
        } else {
          if (
            fields[i] === "name" &&
            (formData.name.length > 100 || formData.name.length < 3)
          ) {
            error = true;
            document.getElementById(`${fields[i]}_error`).innerText =
              "Name length should be between 3 and 100";
            document.getElementById(`${fields[i]}_error`).style.display =
              "contents";
            if (focusField === "") {
              focusField = fields[i];
            }
          }
          if (fields[i] === "email") {
            console.log(formData.email);
            if (formData.email.length > 100) {
              error = true;
              document.getElementById(`${fields[i]}_error`).innerText =
                "EmailID length should not exceed 100";
              document.getElementById(`${fields[i]}_error`).style.display =
                "contents";
              if (focusField === "") {
                focusField = fields[i];
              }
            } else if (!validateEmail(formData.email)) {
              error = true;
              document.getElementById(`${fields[i]}_error`).innerText =
                "EmailId is not valid";
              document.getElementById(`${fields[i]}_error`).style.display =
                "contents";
              if (focusField === "") {
                focusField = fields[i];
              }
            }
          }
          if (fields[i] === "phone" && formData.phone.length < 10) {
            error = true;
            document.getElementById(`${fields[i]}_error`).innerText =
              "Phone number should have 10 numbers";
            document.getElementById(`${fields[i]}_error`).style.display =
              "contents";
            if (focusField === "") {
              focusField = fields[i];
            }
          }
          if (fields[i] === "line1" && formData.line1.length > 100) {
            error = true;
            document.getElementById(`${fields[i]}_error`).innerText =
              "Address Line1 length should not exceed 100";
            document.getElementById(`${fields[i]}_error`).style.display =
              "contents";
            if (focusField === "") {
              focusField = fields[i];
            }
          }
          if (fields[i] === "city" && formData.city.length > 100) {
            error = true;
            document.getElementById(`${fields[i]}_error`).innerText =
              "City length should not exceed 100";
            document.getElementById(`${fields[i]}_error`).style.display =
              "contents";
            if (focusField === "") {
              focusField = fields[i];
            }
          }
          if (fields[i] === "country" && formData.country.length > 100) {
            error = true;
            document.getElementById(`${fields[i]}_error`).innerText =
              "Country length should not exceed 100";
            document.getElementById(`${fields[i]}_error`).style.display =
              "contents";
            if (focusField === "") {
              focusField = fields[i];
            }
          }
        }
      } else {
        if (fields[i] === "line2" && formData.line2.length > 100) {
          error = true;
          document.getElementById(`${fields[i]}_error`).innerText =
            "Address Line2 length should not exceed 100";
          document.getElementById(`${fields[i]}_error`).style.display =
            "contents";
          if (focusField === "") {
            focusField = fields[i];
          }
        }
        if (fields[i] === "state" && formData.state.length > 100) {
          error = true;
          document.getElementById(`${fields[i]}_error`).innerText =
            "State length should not exceed 100";
          document.getElementById(`${fields[i]}_error`).style.display =
            "contents";
          if (focusField === "") {
            focusField = fields[i];
          }
        }
        if (fields[i] === "gstNo" && formData.gstNo.length > 0 && (formData.gstNo.length > 15 || !checkGST(formData.gstNo))) {
          error = true;
          document.getElementById(`${fields[i]}_error`).innerText =
            "GST No is not valid";
          document.getElementById(`${fields[i]}_error`).style.display =
            "contents";
          if (focusField === "") {
            focusField = fields[i];
          }
        }
      }
    }
    if (!error) {
      setLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };

      let submitData = {
        name: formData.name,
        email: formData.email,
        line1: formData.line1,
        line2: formData.line2,
        pin_code: formData.pin_code,
        city: formData.city,
        state: formData.state,
        country: formData.country_code,
        planName:
          (plan.includes("gold") ? "Gold " : "Platinum ") +
          (plan.includes("monthly") ? "Monthly" : "Quarterly"),
        gstNo: formData.gstNo
      };
      console.log(submitData);
      if (localStorage.getItem("role") === "company") {
        axios
          .post(`${domain}/api/payment/startCompanyPayment`, submitData, config)
          .then((res) => {
            if (saveAddress) {
              axios
                .post(
                  `${domain}/api/company/updateCompanyAddress`,
                  submitData,
                  config
                )
                .then((res) => console.log(res.data));
            }
            setLoading(false);
            console.log(res.data);
            console.log("step2")
            setStep(2);
            setSecret(res.data.clientSecret);
            setSubId(res.data.subscriptionId);
            window.scrollTo(0, 150);
          })
          .catch((err) => {
            setLoading(false);
            setPaymentCreationFailed(true);
          });
      } else {
        axios
          .post(`${domain}/api/user/createNewUser`, {
            name: formData.name,
            email: formData.email,
            phoneNo: formData.phone,
            country: formData.country,
            role: "halfCompany",
          })
          .then((res) => {
            console.log(res.data);
            localStorage.setItem("access_token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("email", res.data.verify)
            const config_temp = {
              headers: {
                Authorization: "Bearer " + res.data.token,
              },
            };
            axios
              .post(
                `${domain}/api/payment/startCompanyPayment`,
                submitData,
                config_temp
              )
              .then((res) => {
                if (saveAddress) {
                  axios
                    .post(
                      `${domain}/api/company/updateCompanyAddress`,
                      submitData,
                      config
                    )
                    .then((res) => console.log(res.data));
                }
                setLoading(false);
                console.log(res.data);
                setSecret(res.data.clientSecret);
                setSubId(res.data.subscriptionId);
                console.log("step2")
                setStep(2);
                window.scrollTo(0, 150);
              })
              .catch((err) => {
                setLoading(false);
                setPaymentCreationFailed(true);
              });
          })
          .catch((err) => {
            try {
              if (err.response.data === "User already exists") {
                document.getElementById(`email_error`).innerText =
                  "EmailId already exists";
                document.getElementById(`email_error`).style.display =
                  "contents";
                document.getElementById(`email`).focus();
                setLoading(false);
              } else {
                alert("Something went wrong. Try again later.");
              }
            } catch {
              alert("Something went wrong. Try again later.");
            }
          });
      }
    } else {
      document.getElementById(focusField).focus();
    }
  }
  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const handleSubmit = async (event) => {
      event.preventDefault();
      setCheckoutLoading(true);
      if (!stripe || !elements) {
        console.log("Loading");
        return;
      }

      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        // confirmParams: {
        //   return_url:
        //     "http://localhost:3000/pilot_dashboard/activities/images",
        // },
        redirect: "if_required",
      });
      if (result.error) {
        if (result.error.payment_intent) {
          console.log(result);
          const config = {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          };
          console.log(result.error);
          axios
            .post(
              `${domain}/api/payment/createPayment`,
              {
                userRole: "pilot",
                plan:
                  (plan.includes("gold") ? "Gold " : "Platinum ") +
                  (plan.includes("monthly") ? "Monthly" : "Quaterly"),
                transactionId: result.error.payment_intent.id,
                price: result.error.payment_intent.amount,
                status:
                  result.error.payment_intent.last_payment_error.decline_code,
                name: formData.name,
                line1: formData.line1,
                line2: formData.line2,
                city: formData.city,
                country: formData.country,
                pinCode: formData.pin_code,
                state: formData.state,
                gstNo: formData.gstNo,
              },
              config
            )
            .then((res) => {
              console.log(res);
              setPaymentFailed(true);
            });
          setCheckoutLoading(false);
        } else {
          setCheckoutLoading(false);
        }
      } else {
        console.log(result);
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios
          .post(
            `${domain}/api/payment/createPayment`,
            {
              userRole: "pilot",
              plan:
                (plan.includes("gold") ? "Gold " : "Platinum ") +
                (plan.includes("monthly") ? "Monthly" : "Quaterly"),
              transactionId: result.paymentIntent.id,
              price: result.paymentIntent.amount,
              status: result.paymentIntent.status,
              name: formData.name,
              line1: formData.line1,
              line2: formData.line2,
              city: formData.city,
              country: formData.country,
              pinCode: formData.pin_code,
              state: formData.state,
              gstNo: formData.gstNo,
            },
            config
          )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err.response);
          });
        setPaymentSuccess(true);
        setCheckoutLoading(false);
        axios
          .post(
            `${domain}/api/companySubscription/createCompanySubscription`,
              {
                plan: (plan.includes("gold") ? "Gold " : "Platinum ") +
                (plan.includes("monthly") ? "Monthly" : "Quaterly"),
                paymentId: subId,
              },
            config
          )
          .then((res) => {
            console.log(res);
          });
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <div style={{ textAlign: "right" }}>
          {!checkoutLoading ? (
            <button
              disabled={!stripe}
              style={{ display: "inline-block", margin: "5px" }}
              className="formBtn6"
              type="button"
              onClick={() => setStep(1)}
            >
              Cancel
            </button>
          ) : (
            ""
          )}

          <button
            disabled={!stripe}
            className="formBtn5"
            style={{ display: "inline-block", margin: "5px" }}
          >
            {checkoutLoading ? <Loader /> : ""}
            Submit
          </button>
        </div>
      </form>
    );
  };

  const phoneChangeHandler = (e) => {
    try {
      if (
        Number(e.target.value.slice(code.length + 1, 10 + code.length + 1)) ||
        e.target.value.slice(code.length + 1, 10 + code.length + 1) === ""
      ) {
        setFormData({
          ...formData,
          ["phone"]: e.target.value.slice(
            code.length + 1,
            10 + code.length + 1
          ),
        });
        document.getElementById(e.target.name + "_error").style.display =
          "none";
      }
    } catch {
      console.log("Not number");
    }
  };

  const formChangeHandler = (e) => {
    if (e.target.name === "gstNo"){
      setFormData({
        ...formData,
        gstNo: e.target.value.slice(0, 15),
      });
    }
    else if (e.target.name === "pin_code") {
      setFormData({
        ...formData,
        pin_code: e.target.value.slice(0, 10),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
    document.getElementById(`${e.target.name}_error`).style.display = "none";
  };

  const countryChangeHandler = (e) => {
    var country = e.target.value.split(",")
    console.log(country.length)
    setFormData({
      ...formData,
      country : country.slice(0,country.length - 2).toString(),
      country_code: country.slice(country.length - 2, country.length - 1)[0]
    })
    setCode(country.slice(country.length - 1)[0])
    // var result = Countries.filter(
    //   (obj) => obj.code == country.value || obj.label == country.value
    // );
    // console.log(result[0].dial_code);
    // setCode(result[0].dial_code);
    // setFormData({
    //   ...formData,
    //   country: country.label,
    //   country_code: country.value,
    //   country_object: country,
    // });
    document.getElementById("country_error").style.display = "none";
  };

  return (
    <div style={{ backgroundColor: "#f7f7f7", paddingTop: "30px" }}>
      <Container className="Container">
        <div>
          <Grid container spacing={4}>
            <Grid item xl={4.5} lg={4.5} md={4.5} sm={12} xs={12}>
              <div className={Pro.cont}>
                <div className={Pro.subsTitle}>By Upgrading you get</div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  No of active Jobs :{" "}
                  {router.query.type && planDetailsObj[router.query.type].job}
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Email proposals (Direct Hire) :{" "}
                  {router.query.type && planDetailsObj[router.query.type].email}
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />{" "}
                  Boost job : {router.query.type && planDetailsObj[router.query.type].boostJob}
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Saving Pilots
                </div>
                
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />{" "}
                  Draft Access
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Top Suggested Candidates
                </div>
              </div>
            </Grid>
            <Grid item xl={7.5} lg={7.5} md={7.5} sm={12} xs={12}>
              <div className={Pro.subsTitle}>
                Complete your payment and start living your dream.
              </div>
              <div className={Pro.midTitle}>Checkout Details</div>
              <hr style={{ borderBottom: "1px solid #e5e5e5" }} />

              <div className={Pro.costCont}>
                <div className={Pro.costValue}>
                  $
                  {router.query.type && planDetailsObj[router.query.type].price}
                  .00
                </div>
                <div className={Pro.costTitle}>Basic Cost:</div>
              </div>
              <div className={Pro.costCont}>
                <div className={Pro.costValue}>$0.00</div>
                <div className={Pro.costTitle}>Total GST:</div>
              </div>
              <div className={Pro.costCont}>
                <div className={Pro.costValue}>
                  $
                  {router.query.type && planDetailsObj[router.query.type].price}
                  .00
                </div>
                <div className={Pro.costTitle}>Total Payment:</div>
              </div>
              <div className={Pro.costLight}>
                All sales are charged in USD and all sales are final. You will
                be charged $
                {router.query.type && planDetailsObj[router.query.type].price}
                .00 USD immediately. You will be charged every
                {router.query.type &&
                  planDetailsObj[router.query.type].days}{" "}
                thereafter while the subscription is active. Cancel any time.
                Exchange rates are estimated based on our most recent conversion
                data and may not reflect the full charge value.
              </div>

              <hr style={{ borderBottom: "1px solid #e5e5e5" }} />
              {/* //Form */}
              {step === 1 ? (
                <>
                  <Grid container rowSpacing={1}>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="name">Name</label>
                      <input type="text" value = {formData.name} onChange={formChangeHandler} id = "name" name = "name" className="whiteInputBox" disabled = {isCompany}/>
                      <div className="input_error_msg" id="name_error">
                        Name is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="email">EmailId</label>
                      <input type="email" value = {formData.email} onChange={formChangeHandler} id = "email" className="whiteInputBox" name = "email" disabled = {isCompany}/>
                      <div className="input_error_msg" id="email_error">
                        EmailID is required
                      </div>
                    </Grid>
                    {!isCompany&&
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        <label className="inputLabel" htmlFor="email">Phone Number</label>
                        <input type="text" value={`${code} ${formData.phone}`} onChange={phoneChangeHandler} id = "phone" className="whiteInputBox" name = "phone"/>
                        <div className="input_error_msg" id="phone_error">
                          Phone is required
                        </div>
                      </Grid>
                    }
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="line1">Address Line1</label>
                      <input type="text" value = {formData.line1} onChange={formChangeHandler} id = "line1" className="whiteInputBox" name = "line1"/>
                      <div className="input_error_msg" id="line1_error">
                        Address Line1 is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="line2">Address Line2</label>
                      <input type="text" value = {formData.line2} onChange={formChangeHandler} id = "line2" className="whiteInputBox" name = "line2"/>
                      <div className="input_error_msg" id="line2_error">
                        Address Line2 length should not exceed 100
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="pin_code">Postal Code</label>
                      <input type="number" value = {formData.pin_code} onChange={formChangeHandler} id = "pin_code" className="whiteInputBox" name = "pin_code" onWheel={(e) => e.target.blur()}/>
                      <div
                        className="input_error_msg"
                        id="pin_code_error"
                      ></div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="city">City</label>
                      <input type="text" value = {formData.city} onChange={formChangeHandler} id = "city" className="whiteInputBox" name = "city"/>
                      <div className="input_error_msg" id="city_error">
                        City is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="state">State</label>
                      <input type="text" value = {formData.state} onChange={formChangeHandler} id = "state" className="whiteInputBox" name = "state"/>
                      <div
                        className="input_error_msg"
                        id="state_error"
                      ></div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="country">Country</label>
                      <select
                        id="country"
                        onChange={countryChangeHandler}
                        name="country"
                        style={{
                          color: formData.country ? "black" : "gray",
                        }}
                        className="whiteInputBox"
                        disabled = {isCompany}
                      >
                        <option value="" style={{ color: "#000" }}>
                          Select country
                        </option>
                        {Countries.map((country, index) => {
                          return (
                            <option
                              value={`${country.name},${country.code},${country.dial_code}`}
                              style={{ color: "#000" }}
                              key={index}
                              selected={
                                country.name === formData.country
                              }
                            >
                              {country.name}
                            </option>
                          );
                        })}
                      </select>
                      <div className="input_error_msg" id="country_error">
                        Country is required
                      </div>
                    </Grid>
                    {formData.country === "India" &&
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        <label className="inputLabel" htmlFor="gstNo">GST No</label>
                        <input type="text" value = {formData.gstNo} onChange={formChangeHandler} id = "gstNo" className="whiteInputBox" name = "gstNo"/>
                        <div className="input_error_msg" id="gstNo_error">
                          GST No should not exceed 100 characters
                        </div>
                      </Grid>
                    }
                  </Grid>
                  {isCompany&&
                    <div style={{ marginTop: "10px" }}>
                      <input id = "saveAddress" type="checkbox" checked = {saveAddress} onChange = {()=>setSaveAddress(!saveAddress)} style = {{cursor: "pointer"}}/>
                      <label className={Pro.costCheck} htmlFor = "saveAddress" style = {{cursor: "pointer"}}>
                        Save Address for future payments
                      </label>
                    </div>
                  }
                  <button className={Pro.contBtn} onClick = {()=>{!loading?submitStep1():console.log("Loading")}}>{loading&&<Loader />}Continue</button>
                </>
              ) : (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm />
                </Elements>
              )}

              {/* Form */}
            </Grid>
          </Grid>
        </div>
        <Dialog
          open={paymentSuccess}
          TransitionComponent={Transition}
          onClose={() => Router.push(isCompany?"/company-dashboard/account/subscription":"/create-company")}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <h3 style={{ textAlign: "center" }}>Thank you</h3>
              <p style={{ textAlign: "center" }}>We recieved your payment</p>
              <div className={Pro.PaymentSuccessImageContainer}>
                <Image
                  src={PaymentSuccessImg}
                  alt=""
                  className={Pro.paymentSuccessImage}
                />
              </div>
              <div className={Pro.btnContainer}>
                {isCompany
                ?<>
                <Button
                  className={Pro.popupBtn1}
                  onClick={() =>
                    Router.push("/company-dashboard/account/subscription")
                  }
                >
                  Go to Dashboard
                </Button>
                <Button
                  className={Pro.popupBtn2}
                  onClick={() => Router.push("/job/create")}
                >
                  Create job
                </Button>
                </>
                :<Button
                className={Pro.popupBtn1}
                onClick={() =>
                  Router.push("/create-company")
                }
              >
                Complete profile
              </Button>
                }
                
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={payment_failed}
          TransitionComponent={Transition}
          onClose={() => Router.push(isDisable?"/company-pro":"/create-company")}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <h3 style={{ textAlign: "center" }}>Payment failed. Please try again later.</h3>
              
              <div className={Pro.btnContainer}>
                {isCompany
                ?<Button
                className={Pro.popupBtn1}
                onClick={() =>
                  Router.push("/company-pro")
                }
              >
                Try again
              </Button>
                :<Button
                className={Pro.popupBtn1}
                onClick={() =>
                  Router.push("/create-company")
                }
              >
                Complete profile
              </Button>
                }
                
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
}

export default Checkout;
