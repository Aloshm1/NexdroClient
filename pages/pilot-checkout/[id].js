import { Button, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Pro from "../../styles/pilotPro.module.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Loader from "../../components/loader";
import Countries from "../api/country.json";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
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
  const { id } = params;

  return {
    props: {
      id: id,
    },
  };
}

function Checkout({ id }) {
  const router = useRouter();
  const [planDetails, setPlanDetails] = useState({
    name: "",
    price: 0,
    gst: 0,
  });
  const [isDisable, setsDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [payment_creation_failed, setPaymentCreationFailed] = useState(false);
  const [payment_failed, setPaymentFailed] = useState(false);
  const [secret, setSecret] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  let [test, setTest] = useState([]);
  let [paymentSuccess, setPaymentSuccess] = useState(false);
  const [subId, setSubId] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    line1: "",
    line2: "",
    post_code: "",
    pin_code: "",
    city: "",
    state: "",
    country: {},
    planName: "",
    phone: "",
  });

  const options = {
    clientSecret: secret,
  };

  const CheckoutForm = () => {
    console.log(userDetails);
    const stripe = useStripe();
    const elements = useElements();

    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const handleSubmit = async (event) => {
      event.preventDefault();
      setCheckoutLoading(true);
      if (!stripe || !elements) {
        console.log("Loading");
        return;
      } else {
        console.log("Error");
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
        console.log(result);
        if (result.error.payment_intent) {
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
                plan: planDetails.name,
                transactionId: result.error.payment_intent.id,
                price: result.error.payment_intent.amount,
                status: "Failed",
                name: userDetails.name,
                line1: userDetails.line1,
                line2: userDetails.line2,
                city: userDetails.city,
                country: userDetails.country.code,
                pinCode: userDetails.pin_code,
                state: userDetails.state,
              },
              config
            )
            .then((res) => {
              console.log(res);
              setPaymentFailed(true);
            })
            .catch((err) => {
              setPaymentFailed(true);
            });
          setCheckoutLoading(false);
        } else {
          console.log("Error");
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
              plan: planDetails.name,
              transactionId: result.paymentIntent.id,
              price: result.paymentIntent.amount,
              status: result.paymentIntent.status,
              name: userDetails.name,
              line1: userDetails.line1,
              line2: userDetails.line2,
              city: userDetails.city,
              country: userDetails.country.code,
              pinCode: userDetails.pin_code,
              state: userDetails.state,
            },
            config
          )
          .then((res) => {
            console.log(res);
          });
        setPaymentSuccess(true);
        setCheckoutLoading(false);
        axios
          .post(
            `${domain}/api/pilotSubscription/createSubscription`,
            {
              plan: planDetails.name,
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

  const countryChangeHandler = (e) => {
    var country = e.target.value.split(",");
    console.log(country.length);
    setUserDetails({
      ...userDetails,
      country: {
        name: country.slice(0, country.length - 2).toString(),
        code: country.slice(country.length - 2, country.length - 1)[0],
        dial_code: country.slice(country.length - 1)[0],
      },
    });
    document.getElementById("country_error").style.display = "none";
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/subscription/getSubscription`, { id: id })
      .then((res) => {
        console.log(res);
        setPlanDetails({
          ...planDetails,
          price: res.data.price,
          name: res.data.name,
          gst: res.data.gst,
        });
      });
    let role = localStorage.getItem("role");
    if (role) {
      if (role === "pilot") {
        setsDisable(true);
        axios
          .post(`${domain}/api/pilot/sendBillingAddress`, config)
          .then((res) => {
            console.log(res.data);
            setUserDetails({
              ...userDetails,
              name: res.data.name,
              email: res.data.email,
              line1: res.data.line1,
              line2: res.data.line2,
              pin_code: res.data.postal_code,
              city: res.data.city,
              state: res.data.state,
              country: Countries.find(
                (x) =>
                  x.name === res.data.country || x.code === res.data.country
              ),
            });
          });
      } else {
        Router.push("/no-page-found");
      }
    }
  }, []);

  const submitStep1 = () => {
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
    let fields = [
      "name",
      "email",
      "line1",
      "line2",
      "pin_code",
      "city",
      "state",
      "country",
    ];
    if (!isDisable) {
      fields = [
        "name",
        "email",
        "phone",
        "line1",
        "line2",
        "pin_code",
        "city",
        "state",
        "country",
      ];
    }
    let focusField = "";
    let error = false;
    for (var i = 0; i < fields.length; i++) {
      if (fields[i] !== "pin_code") {
        if (userDetails[fields[i]] === "") {
          document.getElementById(`${fields[i]}_error`).innerText =
            fields[i] + " is required";
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        } else if (
          (userDetails[fields[i]].length < 2 ||
            userDetails[fields[i]].length > 100) &&
          fields[i] !== "pin_code"
        ) {
          document.getElementById(`${fields[i]}_error`).innerText =
            fields[i] + " should be between 2 and 100 characters";
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
        if (fields[i] === "email" && !validateEmail(userDetails.email)) {
          document.getElementById(`${fields[i]}_error`).innerText =
            "Email Id is not valid";
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
        if (fields[i] === "country" && !userDetails.country.name) {
          document.getElementById(`${fields[i]}_error`).innerText =
            "Country is required";
          document.getElementById(`${fields[i]}_error`).style.display = "block";
          if (focusField === "") {
            focusField = fields[i];
          }
          error = true;
        }
      }
    }
    if (error) {
      document.getElementById(focusField).focus();
    } else {
      setLoading(true);
      let submitData = {
        name: userDetails.name,
        email: userDetails.email,
        line1: userDetails.line1,
        line2: userDetails.line2,
        pin_code: userDetails.pin_code,
        city: userDetails.city,
        state: userDetails.state,
        country: userDetails.country.code,
        planName: planDetails.name,
      };
      if (saveAddress) {
        axios
          .post(`${domain}/api/pilot/updateBillingAddress`, submitData, config)
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            setPaymentCreationFailed(true);
          });
      }
      if (!isDisable) {
        let temp_data = {
          ...submitData,
          phoneNo: userDetails.phone,
          role: "halfPilot",
          country: userDetails.country.name
        };
        console.log(temp_data);
        axios
          .post(`${domain}/api/user/createNewUser`, temp_data)
          .then((res) => {
            console.log(res.data);
            localStorage.setItem("access_token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("email", res.data.verify);
            const config_temp = {
              headers: {
                Authorization: "Bearer " + res.data.token,
              },
            };
            axios
              .post(
                `${domain}/api/payment/startPaymentProcess`,
                submitData,
                config_temp
              )
              .then((res) => {
                setLoading(false);
                console.log(res.data);
                setSecret(res.data.clientSecret);
                setSubId(res.data.subscriptionId);
                setStep(2);
                window.scrollTo(0, 150);
              })
              .catch((err) => {
                console.log("Error");
                setLoading(false);
                setPaymentCreationFailed(true);
              });
          })
          .catch((err) => {
            console.log(err);
            document.getElementById("email_error").style.display = "block";
            document.getElementById("email_error").innerText =
              "Email Id already exists";
            document.getElementById("email").focus();
            setLoading(false);
          });
      } else {
        console.log(submitData);
        axios
          .post(`${domain}/api/payment/startPaymentProcess`, submitData, config)
          .then((res) => {
            if (saveAddress) {
              let tempSubmitData = submitData;
              submitData[country] = userDetails.country.name;
              axios
                .post(
                  `${domain}/api/pilot/updateBillingAddress`,
                  tempSubmitData,
                  config
                )
                .then((res) => console.log(res.data));
            }
            setLoading(false);
            console.log(res.data);
            setSecret(res.data.clientSecret);
            setSubId(res.data.subscriptionId);
            setStep(2);
            window.scrollTo(0, 150);
          })
          .catch((err) => {
            console.log("Error");
            setLoading(false);
            setPaymentCreationFailed(true);
          });
      }
    }
  };

  const handleChange = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    if (e.target.id !== "pin_code") {
      setUserDetails({
        ...userDetails,
        [e.target.id]: e.target.value,
      });
    } else {
      setUserDetails({
        ...userDetails,
        [e.target.id]: e.target.value.slice(0, 10),
      });
    }
  };

  const handleChangePhone = (e) => {
    try {
      setUserDetails({
        ...userDetails,
        phone:
          Number(
            e.target.value.slice(
              userDetails.country.dial_code
                ? userDetails.country.dial_code.length + 1
                : 0,
              userDetails.country.dial_code
                ? 10 + userDetails.country.dial_code.length + 1
                : 10
            )
          ) || "",
      });
      document.getElementById(`${e.target.id}_error`).style.display = "none";
    } catch {
      print("Not a number");
    }
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
                  Images
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />{" "}
                  Videos
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  3D Images
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Save as Draft Feature
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />{" "}
                  Multiple Upload Feature
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Immediate Approval of Images
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Daily Job Notifications
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Profile in suggestions of Top Jobs
                </div>
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Pro Label on your Profile
                </div>
                {/* <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Access to rearrange your images to display
                </div> */}
                <div className={Pro.subsDesc}>
                  <ThumbUpIcon sx={{ color: "#4ffea3", marginRight: "5px" }} />
                  Chances to get hired from your shoot pages
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
                  ${Number(planDetails.price).toFixed(2)}
                </div>
                <div className={Pro.costTitle}>Basic Cost:</div>
              </div>
              <div className={Pro.costCont}>
                <div className={Pro.costValue}>
                  ${Number(planDetails.gst).toFixed(2)}
                </div>
                <div className={Pro.costTitle}>Total GST:</div>
              </div>
              <div className={Pro.costCont}>
                <div className={Pro.costValue}>
                  $
                  {(
                    Number(planDetails.price) + Number(planDetails.gst)
                  ).toFixed(2)}
                </div>
                <div className={Pro.costTitle}>Total Payment:</div>
              </div>
              <div className={Pro.costLight}>
                All sales are charged in USD and all sales are final. You will
                be charged $
                {(Number(planDetails.price) + Number(planDetails.gst)).toFixed(
                  2
                )}{" "}
                USD immediately. You will be charged every
                {planDetails.name && planDetails.name.includes("Monthly")
                  ? " 30 days"
                  : " 1 year"}{" "}
                thereafter while the subscription is active. Cancel any time.
                Exchange rates are estimated based on our most recent conversion
                data and may not reflect the full charge value.
              </div>

              <hr style={{ borderBottom: "1px solid #e5e5e5" }} />
              {step === 1 ? (
                <>
                  <Grid container rowSpacing={1}>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="name">
                        Name
                      </label>
                      <input
                        type="text"
                        className="whiteInputBox"
                        value={userDetails.name}
                        disabled={isDisable}
                        id="name"
                        onChange={handleChange}
                      />
                      <div className="input_error_msg" id="name_error">
                        Name is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="email">
                        EmailId
                      </label>
                      <input
                        type="email"
                        className="whiteInputBox"
                        value={userDetails.email}
                        disabled={isDisable}
                        id="email"
                        onChange={handleChange}
                      />
                      <div className="input_error_msg" id="email_error">
                        Email ID is required
                      </div>
                    </Grid>
                    {!isDisable && (
                      <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                        <label className="inputLabel" htmlFor="email">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="whiteInputBox"
                          value={
                            userDetails.country.dial_code
                              ? userDetails.country.dial_code +
                                " " +
                                userDetails.phone
                              : userDetails.phone
                          }
                          id="phone"
                          onChange={handleChangePhone}
                        />
                        <div className="input_error_msg" id="phone_error">
                          Phone Number is required
                        </div>
                      </Grid>
                    )}
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="line1">
                        Address Line1
                      </label>
                      <input
                        type="text"
                        className="whiteInputBox"
                        value={userDetails.line1}
                        id="line1"
                        onChange={handleChange}
                      />
                      <div className="input_error_msg" id="line1_error">
                        Address Line1 is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="line2">
                        Address Line2
                      </label>
                      <input
                        type="text"
                        className="whiteInputBox"
                        onChange={handleChange}
                        value={userDetails.line2}
                        id="line2"
                      />
                      <div className="input_error_msg" id="line2_error">
                        Address Line2 is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="pin_code">
                        Postal Code
                      </label>
                      <input
                        type="number"
                        className="whiteInputBox"
                        onChange={handleChange}
                        value={userDetails.pin_code}
                        id="pin_code"
                        onWheel={(e) => e.target.blur()}
                      />
                      <div className="input_error_msg" id="pin_code_error">
                        Postal Code is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="city">
                        City
                      </label>
                      <input
                        type="text"
                        className="whiteInputBox"
                        onChange={handleChange}
                        value={userDetails.city}
                        id="city"
                      />
                      <div className="input_error_msg" id="city_error">
                        City is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="state">
                        State
                      </label>
                      <input
                        type="text"
                        className="whiteInputBox"
                        onChange={handleChange}
                        value={userDetails.state}
                        id="state"
                      />
                      <div className="input_error_msg" id="state_error">
                        State is required
                      </div>
                    </Grid>
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                      <label className="inputLabel" htmlFor="country">
                        Country
                      </label>
                      <select
                        id="country"
                        onChange={countryChangeHandler}
                        name="country"
                        style={{
                          color: userDetails.country ? "black" : "gray",
                        }}
                        className="whiteInputBox"
                        disabled={isDisable}
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
                                country.name === userDetails.country.name
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
                  </Grid>
                  {isDisable && (
                    <div style={{ marginTop: "10px" }}>
                      <input
                        type="checkbox"
                        id="save_address"
                        style={{ cursor: "pointer" }}
                        checked={saveAddress}
                        onChange={() => setSaveAddress(!saveAddress)}
                      />
                      <label
                        className={Pro.costCheck}
                        htmlFor="save_address"
                        style={{ cursor: "pointer" }}
                      >
                        Save Address for future payments
                      </label>
                    </div>
                  )}
                  <button
                    className={Pro.contBtn}
                    onClick={() => {
                      !loading ? submitStep1() : console.log("Loading");
                    }}
                  >
                    {loading && <Loader />}
                    Continue
                  </button>
                </>
              ) : (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm />
                </Elements>
              )}
            </Grid>
          </Grid>
        </div>
        <Dialog
          open={paymentSuccess}
          TransitionComponent={Transition}
          onClose={() =>
            Router.push(
              isDisable
                ? "/pilot-dashboard/account/subscription"
                : "/create-pilot"
            )
          }
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
                {isDisable ? (
                  <>
                    <Button
                      className={Pro.popupBtn1}
                      onClick={() =>
                        Router.push("/pilot-dashboard/account/subscription")
                      }
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      className={Pro.popupBtn2}
                      onClick={() => Router.push("/upload-files")}
                    >
                      Go to Upload Files
                    </Button>
                  </>
                ) : (
                  <Button
                    className={Pro.popupBtn1}
                    onClick={() => Router.push("/create-pilot")}
                  >
                    Complete profile
                  </Button>
                )}
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={payment_failed}
          TransitionComponent={Transition}
          onClose={() =>
            Router.push(isDisable ? "/pilot-pro" : "/create-pilot")
          }
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <h3 style={{ textAlign: "center" }}>
                Payment failed. Please try again later.
              </h3>

              <div className={Pro.btnContainer}>
                {isDisable ? (
                  <Button
                    className={Pro.popupBtn1}
                    onClick={() => Router.push("/pilot-pro")}
                  >
                    Try again
                  </Button>
                ) : (
                  <Button
                    className={Pro.popupBtn1}
                    onClick={() => Router.push("/create-pilot")}
                  >
                    Complete profile
                  </Button>
                )}
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={payment_creation_failed}
          TransitionComponent={Transition}
          onClose={() =>
            Router.push(isDisable ? "/pilot-pro" : "/create-pilot")
          }
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <h3 style={{ textAlign: "center" }}>
                Something went wrong. Please try again later.
              </h3>

              <div className={Pro.btnContainer}>
                <Button
                  className={Pro.popupBtn1}
                  onClick={() => Router.push("/pilot-pro")}
                >
                  Close
                </Button>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
}

export default Checkout;
