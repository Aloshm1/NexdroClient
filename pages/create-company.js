import { Alert, Button, Container, Grid, Radio } from "@mui/material";
import React, { useState, useEffect } from "react";
import DroneImage from "../images/drone_image.png";
import Image from "next/image";
import axios from "axios";
import Router from "next/router";
import Loader from "../components/loader";
import Countries from "./api/country.json";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function CreatePilot() {
  const [isLoading, setLoading] = useState(false);
  let [industries, setIndustries] = useState([]);
  let [mainIndustries, setMainIndustries] = useState([]);
  let [countryCode, setCountryCode] = useState("");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/industry/getIndustries`).then((res) => {
      setIndustries(res.data);
      setMainIndustries(res.data);
    });
    axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
      setData({
        ...data,
        companyPhoneNo: res.data.phoneNo,
        companyEmailId: res.data.email,
        contactPerson: res.data.name,
      });
      console.log(res);
      var result = Countries.filter((obj) => {
        return obj.name === res.data.country;
      });
      console.log(result);
      setCountryCode(result[0].dial_code);
    });
    setTimeout(() => {
      if (document.getElementById("alertBox")) {
        document.getElementById("alertBox").style.display = "none";
      }
    }, 4000);
  }, []);
  let MouseIned = (id) => {
    document.getElementById(`options/${id}`).style.backgroundColor = "#e7e7e7";
  };
  let MouseOuted = (id) => {
    document.getElementById(`options/${id}`).style.backgroundColor = "#ffffff";
  };
  let clicked = () => {
    if (document.getElementById("dropDown")) {
      document.getElementById("dropDown").style.display = "none";
    }
  };
  let changeIndustry = (item) => {
    setData({
      ...data,
      industry: item,
    });
  };

  let [data, setData] = useState({
    companyName: "",
    companyType: "company",
    contactPerson: "",
    industry: "",
    companyPhoneNo: "",
    companyEmailId: "",
  });
  let changeCompanyType = (type) => {
    setData({
      ...data,
      companyType: type,
    });
  };
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    if (e.target.id === "companyPhoneNo") {
      console.log(
        e.target.value.slice(e.target.value.length - 1, e.target.value.length)
      );
      if (
        Number(
          e.target.value.slice(e.target.value.length - 1, e.target.value.length)
        ) >= 0 &&
        Number(
          e.target.value.slice(e.target.value.length - 1, e.target.value.length)
        ) <= 10
      ) {
        setData({
          ...data,
          companyPhoneNo: e.target.value
            .slice(countryCode.length + 1, e.target.value.length)
            .trim(),
        });
      }
    } else {
      if (e.target.id === "industry") {
        let result = mainIndustries.filter((mainIndustries) =>
          mainIndustries.industry
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
        setIndustries(result);
      }
      setData({
        ...data,
        [e.target.id]: e.target.value,
      });
    }
  };
  let goBack = () => {
    Router.push("/choose-categories")
  }
  let submitData = () => {
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
    var focusField = "";
    let fields = ["companyName", "contactPerson", "industry"];
    for (let i = 0; i < fields.length; i++) {
      console.log(fields[i]);
      console.log(data[fields[i]]);
      if (data[fields[i]] === "") {
        if (focusField == "") {
          focusField = fields[i];
        }
        document.getElementById(
          `${fields[i]}_error`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error`).style.display = "block";
      }
    }
    if (
      data.companyName !== "" &&
      (data.companyName.length < 3 || data.companyName.length > 75)
    ) {
      document.getElementById("companyName_error").innerHTML =
        "Characters should be between 3 - 75";
      document.getElementById("companyName_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyName";
      }
    }
    if (
      data.contactPerson !== "" &&
      (data.contactPerson.length < 3 || data.contactPerson.length > 25)
    ) {
      document.getElementById("contactPerson_error").innerHTML =
        "Characters should be between 3 - 25";
      document.getElementById("contactPerson_error").style.display = "block";
      if (focusField == "") {
        focusField = "contactPerson";
      }
    }
    if (
      data.industry !== "" &&
      (data.industry.length < 3 || data.industry.length > 100)
    ) {
      document.getElementById("industry_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("industry_error").style.display = "block";
      if (focusField == "") {
        focusField = "industry";
      }
    }
    if (
      data.companyPhoneNo !== "" &&
      (data.companyPhoneNo.length < 7 || data.companyPhoneNo.length > 14)
    ) {
      document.getElementById("companyPhoneNo_error").innerHTML =
        "Phone No should be between 7 - 14 digits";
      document.getElementById("companyPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyPhoneNo";
      }
    }
    if (data.companyPhoneNo !== "" && Number(data.companyPhoneNo) <= 0) {
      document.getElementById("companyPhoneNo_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("companyPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyPhoneNo";
      }
    }

    if (data.companyEmailId !== "" && !validateEmail(data.companyEmailId)) {
      document.getElementById("companyEmailId_error").innerHTML =
        "Invalid Email";
      document.getElementById("companyEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyEmailId";
      }
    }
    if (data.companyEmailId !== "" && data.companyEmailId.length > 100) {
      document.getElementById("companyEmailId_error").innerHTML =
        "Email Id should be maximum 100 characters";
      document.getElementById("companyEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "companyEmailId";
      }
    }

    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      var postData = {
        companyType: data.companyType,
        companyName: data.companyName,
        emailId: data.companyEmailId,
        phoneNo: data.companyPhoneNo,
        contactPersonName: data.contactPerson,
        industry: data.industry,
      };
      setLoading(true);
      axios
        .post(`${domain}/api/company/registerCompany`, postData, config)
        .then((res) => {
          localStorage.setItem("role", "company");
          localStorage.setItem("profileCreated", "true");
          localStorage.removeItem("tempUserType")
          Router.push({
            pathname: "/company-dashboard/account/page-information"
          });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  //arrows
  let [tempInd, setTempInd] = useState(industries[0]);
  const upHandler = ({ key }) => {
    console.log(key);
    if (
      document.getElementById("industry") === document.activeElement &&
      data.industry !== ""
    ) {
      if (key == "ArrowDown") {
      }
      if (key == "ArrowUp") {
      }
      if (key == "Enter") {
      }
      setTimeout(() => {
        console.log(tempInd);
      }, 2000);
    }
  };
  React.useEffect(() => {
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  });
  //arrows
  return (
    <>
      <Container className="Container" onClick={clicked}>
        <Grid container spacing={2}>
          <Grid
            item
            xl={6}
            lg={6}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: {
                xs: "none",
                md: "block",
                lg: "block",
                xl: "block",
              },
            }}
          >
            <div>
              <Image src={DroneImage} />
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <div style={{ marginTop: "20px" }}>
              <Alert
                severity="success"
                sx={{ marginBottom: "10px" }}
                id="alertBox"
              >
                Welcome almost done, Please fill below fields to complete your
                profile setup!
              </Alert>
              {/* <h4 style={{ paddingBottom: "25px", fontSize: "20px" }}>
                Welcome almost done, Please fill below fields to complete your
                profile setup
              </h4> */}
              <div>
                <Grid container rowSpacing={0} columnSpacing={2}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div>
                      <label className="inputLabel" htmlFor="companyName">
                        Organisation Name
                      </label>
                      <input
                        className="inputBox"
                        type="text"
                        value={data.companyName}
                        onChange={changeHandler}
                        id="companyName"
                      />
                    </div>
                    <div className="input_error_msg" id="companyName_error">
                      CompanyName is required
                    </div>
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <div>
                      <div className="inputLabel">Company Type</div>
                      <Grid container rowSpacing={0} columnSpacing={2}>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div
                            className={
                              data.companyType == "company"
                                ? "radioCompanyActive"
                                : "radioCompany"
                            }
                            onClick={() => changeCompanyType("company")}
                          >
                            <Radio
                              checked={data.companyType == "company"}
                              value="b"
                              name="radio-buttons"
                            />
                            Company
                          </div>
                        </Grid>
                        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                          <div
                            className={
                              data.companyType == "consultant"
                                ? "radioCompanyActive"
                                : "radioCompany"
                            }
                            onClick={() => changeCompanyType("consultant")}
                          >
                            <Radio
                              checked={data.companyType == "consultant"}
                              value="b"
                              name="radio-buttons"
                            />
                            Consultant
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="contactPerson">
                      Contact Person Name
                    </label>
                    <input
                      className="inputBox"
                      pattern="[A-Za-z]+"
                      type="text"
                      value={data.contactPerson}
                      onChange={changeHandler}
                      id="contactPerson"
                    />
                    <div className="input_error_msg" id="contactPerson_error">
                      ContactPerson is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <div style={{ position: "relative" }}>
                      <label className="inputLabel" htmlFor="industry">
                        Industry
                      </label>
                      <input
                        className="inputBox"
                        type="text"
                        value={data.industry}
                        onChange={changeHandler}
                        id="industry"
                        style={{ marginBottom: "0px" }}
                      />
                      {typeof window !== "undefined" &&
                      document.getElementById("industry") ===
                        document.activeElement &&
                      data.industry !== "" ? (
                        <div
                          style={{
                            position: "absolute",
                            width: "100%",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e7e7e7",
                            maxHeight: "150px",
                            overflow: "auto",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                            borderRadius: "0px 0px 10px 10px",
                            zIndex: 999
                          }}
                          id="dropDown"
                        >
                          {industries.map((item, i) => {
                            return (
                              <div
                                style={{
                                  padding: "10px",
                                  borderBottom: "1px solid gray",
                                  cursor: "pointer",
                                  width: "100%",
                                }}
                                key={i}
                                id={`options/${item._id}`}
                                onMouseOver={() => MouseIned(item._id)}
                                onMouseOut={() => MouseOuted(item._id)}
                                onClick={() => changeIndustry(item.industry)}
                              >
                                {item.industry}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="input_error_msg" id="industry_error">
                      Industry is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="companyPhoneNo">
                      Official Contact No (Optional)
                    </label>
                    <input
                      className="inputBox"
                      type="text"
                      value={`${countryCode} ${data.companyPhoneNo}`}
                      onChange={changeHandler}
                      id="companyPhoneNo"
                    />
                    <div className="input_error_msg" id="companyPhoneNo_error">
                      Company PhoneNo is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="companyEmailId">
                      Official Email Id (Optional)
                    </label>
                    <input
                      className="inputBox"
                      type="email"
                      value={data.companyEmailId}
                      onChange={changeHandler}
                      id="companyEmailId"
                    />
                    <div className="input_error_msg" id="companyEmailId_error">
                      companyEmailId is required
                    </div>
                  </Grid>
                </Grid>
              </div>
              <Button
                className="formBtn1 mb-10 mt-10"
                onClick={goBack}
                style={{ textTransform: "capitalize", marginRight: "10px" }}
              >
                Back
              </Button>
              {isLoading ? (
                <Button
                  className="formBtn9 mb-10 mt-10"
                  style={{ textTransform: "capitalize" }}
                >
                  <Loader />
                  Complete Profile
                </Button>
              ) : (
                <Button
                  className="formBtn9 mb-10 mt-10"
                  style={{ textTransform: "capitalize" }}
                  onClick={submitData}
                >
                  Complete Profile
                </Button>
              )}
              {/* <div
                className="formBtnLoading"
                style={{ textTransform: "capitalize", display: "inline-block" }}
                onClick={submitData}
              >
                Complete Profile
              </div> */}
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default CreatePilot;
