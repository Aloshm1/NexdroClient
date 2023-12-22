import { Alert, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../styles/createPilot.module.css";
import Button from "@mui/material/Button";
import css from "../styles/center.module.css";
import DroneImage from "../images/drone_image.png";
import image from "../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Script from "next/script";
import Loader from "../components/loader";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import { Wrapper } from "@googlemaps/react-wrapper";
import axios from "axios";
import Router from "next/router";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Dropdown from "../components/Dropdown";
import Dropdown1 from "../components/Dropdown1"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const services = ["Drone repair", "Drone Reattach", "Drone modifiations", "Camera change"]
function CreateCenter() {
  const allowedFormats = ["jpg", "jpeg", "png", "webp"];

  const [isLoading, setLoading] = useState(false);

  let [brands, setBrands] = useState([]);
  let [allBrands, setAllBrands] = useState(false);
  const [formatError, setFormatError] = useState(false);
  let [selectedBrands1, setSelectedBrands1] = useState([]);
  let [showSuggestedBrands, setShowSuggestedBrands] = useState(false);
  let [data, setData] = useState({
    centerName: "",
    centerPhoneNo: "",
    centerEmailId: "",
    location: "",
    street: "",
    establishedYear: "",
    workingFrom: "09:00",
    workingTill: "19:00",
    description: "",
  });
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
      console.log(res);
      setData({
        ...data,
        centerPhoneNo: res.data.phoneNo,
        centerEmailId: res.data.email,
      });
    });
    axios.get(`${domain}/api/brand/getBrands1`).then((res) => {
      setBrands(res.data);
      
      setTimeout(() => {
        if (document.getElementById("alertBox")) {
          document.getElementById("alertBox").style.display = "none";
        }
      }, 4000);
    });
  }, []);

  let handleChange1 = (address) => {
    document.getElementById("location_error").style.display = "none";
    setData({
      ...data,
      location: address,
    });
  };

  let handleSelect = (address) => {
    console.log(address);
    setData({
      ...data,
      location: address,
    });

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log("Success", latLng))
      .catch((error) => console.error("Error", error));
  };
  let totalDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let [holidays, setHolidays] = useState(["Saturday", "Sunday"]);
  let [selectedPhotos, setSelectedPhotos] = useState([]);
  let addPhoto = (e) => {
    document.getElementById("photos_error").style.display = "none";
    let selectFiles = selectedPhotos.length;
    let tempArr = [];
    let otherFiles = e.target.files.length;
    if (selectFiles + otherFiles > 6) {
      document.getElementById("photos_error").innerHTML =
        "Cannot upload more than 6 images";
      document.getElementById("photos_error").style.display = "block";
    } else {
      for (let i = 0; i < e.target.files.length; i++) {
        if (e.target.files[i].size / 1000000 <= 2) {
          var fileFormat = e.target.files[i].name
            .substring(e.target.files[i].name.lastIndexOf(".") + 1)
            .toLowerCase();
          console.log(fileFormat);
          if (
            allowedFormats.includes(fileFormat) &&
            e.target.files[i].type.includes("image")
          ) {
            tempArr.push(e.target.files[i]);
          } else {
            setFormatError(true);
          }
        } else {
          document.getElementById("photos_error").innerHTML =
            "File Size exceeded 2MB";
          document.getElementById("photos_error").style.display = "block";
        }
      }
    }

    setSelectedPhotos([...selectedPhotos, ...tempArr]);
  };
  let removeImage = (index) => {
    let arr = selectedPhotos;
    arr.splice(index, 1);
    setSelectedPhotos([...arr]);
  };
  let changeHoliday = (day) => {
    let arr = holidays;
    if (!holidays.includes(day)) {
      arr.push(day);
    } else {
      arr = arr.filter((item) => item !== day);
    }
    console.log(arr);
    setHolidays([...arr]);
  };
  let [selectedBrands, setSelectedBrands] = useState([]);
  let addToBrand = (brand) => {
    document.getElementById("brands_error").style.display = "none";
    if (!selectedBrands.includes(brand) && (selectedBrands.length < 20)) {
      let arr = selectedBrands;
      arr.push(brand);

      setSelectedBrands([...arr]);
    }

  };
  let [selectedServices, setSelectedServices] = useState([]);
  let addToService = (brand) => {
    document.getElementById("brands_error").style.display = "none";
    if (!selectedServices.includes(brand) && (selectedServices.length < 20)) {
      let arr = selectedServices;
      arr.push(brand);

      setSelectedServices([...arr]);
    }

  };
  let removeFromMyBrands = (brand) => {
    selectedBrands.splice(
      selectedBrands.findIndex((e) => e === brand),
      1
    );
    setSelectedBrands([...selectedBrands]);
  };
  let removeFromMyServices = (brand) => {
    selectedServices.splice(
      selectedServices.findIndex((e) => e === brand),
      1
    );
    setSelectedServices([...selectedServices]);
  };
  let addBrand = (e) => {
    let result = brands.filter((allBrands) =>
      allBrands.brand.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setTempInd(result[0]);
    setSelectedBrands1(result);
    setShowSuggestedBrands(true);
    setTimeout(() => {
      console.log(selectedBrands1);
    }, 2000);
    document.getElementById("brands_error").style.display = "none";
    if (e.key == "Enter" && e.target.value.trim() !== "") {
      if (!selectedBrands.includes(e.target.value)) {
        let arr = selectedBrands;
        arr.push(e.target.value);
        document.getElementById("brands").value = "";
        setSelectedBrands([...arr]);
      } else {
        document.getElementById("brands").value = "";
      }
    }
  };
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let submitData = () => {
    setLoading(true);

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    var focusField = "";
    let fields = [
      "centerName",
      "centerPhoneNo",
      "centerEmailId",
      "location",
      "street",
      "establishedYear",
      "workingFrom",
      "workingTill",
      "description",
    ];
    for (let i = 0; i < fields.length; i++) {
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
      data.centerName !== "" &&
      (data.centerName.length < 3 || data.centerName.length > 25)
    ) {
      document.getElementById("centerName_error").innerHTML =
        "Characters should be between 3 - 25";
      document.getElementById("centerName_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerName";
      }
    }
    if (data.centerPhoneNo !== "" && data.centerPhoneNo.length !== 10) {
      document.getElementById("centerPhoneNo_error").innerHTML =
        "Phone No should be of 10 digits";
      document.getElementById("centerPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerPhoneNo";
      }
    }
    if (
      data.centerPhoneNo !== "" &&
      data.centerPhoneNo.length === 10 &&
      Number(data.centerPhoneNo) <= 0
    ) {
      document.getElementById("centerPhoneNo_error").innerHTML =
        "Phone No is not valid";
      document.getElementById("centerPhoneNo_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerPhoneNo";
      }
    }

    if (data.centerEmailId !== "" && !validateEmail(data.centerEmailId)) {
      document.getElementById("centerEmailId_error").innerHTML =
        "Invalid Email";
      document.getElementById("centerEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerEmailId";
      }
    }
    if (data.centerEmailId !== "" && data.centerEmailId.length > 100) {
      document.getElementById("centerEmailId_error").innerHTML =
        "Email cannot exceed 100 characters";
      document.getElementById("centerEmailId_error").style.display = "block";
      if (focusField == "") {
        focusField = "centerEmailId";
      }
    }
    if (data.location !== "" && data.location.length > 100) {
      document.getElementById("location_error").innerHTML =
        "Location cannot exceed 100 characters";
      document.getElementById("location_error").style.display = "block";
      if (focusField == "") {
        focusField = "location";
      }
    }
    if (
      data.street !== "" &&
      (data.street.length < 3 || data.street.length > 100)
    ) {
      document.getElementById("street_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("street_error").style.display = "block";
      if (focusField == "") {
        focusField = "street";
      }
    }
    if (
      data.establishedYear !== "" &&
      (data.establishedYear < 1900 || data.establishedYear > 2022)
    ) {
      document.getElementById("establishedYear_error").innerHTML =
        "Established year shuld be between 1900 - 2022";
      document.getElementById("establishedYear_error").style.display = "block";
      if (focusField == "") {
        focusField = "establishedYear";
      }
    }
    if (
      data.workingFrom !== "" &&
      data.workingTill !== "" &&
      data.workingFrom >= data.workingTill
    ) {
      document.getElementById("workingFrom_error").innerHTML =
        "Working From should be lesser then working till";
      document.getElementById("workingFrom_error").style.display = "block";
      if (focusField == "") {
        focusField = "workingFrom";
      }
    }
    if (selectedBrands.length === 0) {
      document.getElementById("brands_error").innerHTML =
        "Select atleast one brand";
      document.getElementById("brands_error").style.display = "block";
      if (focusField == "") {
        focusField = "brands";
      }
    }
    if (selectedPhotos.length === 0) {
      document.getElementById("photos_error").innerHTML =
        "Select atleast one Photo";
      document.getElementById("photos_error").style.display = "block";
      if (focusField == "") {
        focusField = "photos";
      }
    }
    if (
      data.description !== "" &&
      (data.description.length < 100 || data.description.length > 1500)
    ) {
      document.getElementById("description_error").innerHTML =
        "Characters should be between 100 - 1500 characters";
      document.getElementById("description_error").style.display = "block";
      if (focusField == "") {
        focusField = "description";
      }
    }
    if (focusField !== "") {
      setLoading(false);
      console.log(focusField);
      if (focusField == "photos") {
      } else {
        document.getElementById(focusField).focus();
      }
    } else {
      if (focusField == "photos") {
      } else {
        var formData = new FormData();

        formData.append("centerName", data.centerName);
        formData.append("phoneNo", data.centerPhoneNo);
        formData.append("email", data.centerEmailId);
        formData.append("address", data.location);
        formData.append("streetName", data.street);
        formData.append("establishedYear", data.establishedYear);
        formData.append(
          "workingHours",
          `${data.workingFrom} - ${data.workingTill}`
        );
        formData.append("brandOfDrones", selectedBrands);
        formData.append("services", selectedServices);
        formData.append("description", data.description);
        selectedPhotos.forEach((file) => {
          formData.append("file", file);
        });
        // formData.append("file", this.state.photos);
        formData.append("holidays", holidays);
        console.log(formData);
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios
          .post(`${domain}/api/center/createServiceCenter`, formData, config)
          .then((res) => {
            console.log(res.data);
            setLoading(false);
            localStorage.setItem("role", "service_center");
            localStorage.setItem("profileCreated", "true");
            localStorage.removeItem("tempUserType")
            Router.push("/center-dashboard/account");
          });
      }
    }
  };
  let goBack = () => {
    Router.push("/choose-categories")
  }
 
  return (
    <>
      <Head></Head>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyApOXpKSCrcudAr2BONFB4oYEjTi-VXFKQ&libraries=places`}
        strategy="beforeInteractive"
      ></Script>
      <Container
        className="Container"
        onClick={() => setShowSuggestedBrands(false)}
      >
        <Grid container spacing={2} sx = {{marginBottom: "20px"}}>
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
                sm: "block",
                md: "block",
                lg: "block",
                xl: "block",
              },
            }}
          >
            <div style={{ position: "relative", height: "100%" }}>
              <div style={{ position: "sticky", top: "100px" }}>
                <Image src={DroneImage} className="droneImg" />
              </div>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
            <div className="rightBox mb-10" style={{ marginTop: "20px" }}>
              <Alert
                severity="success"
                sx={{ marginBottom: "10px" }}
                id="alertBox"
              >
                Welcome almost done, Please fill below fields to complete your
                profile setup!
              </Alert>
              <div>
                <Grid container rowSpacing={0} columnSpacing={2}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="centerName">
                      Service Center Name
                    </label>
                    <input
                      type="text"
                      className="inputBox"
                      id="centerName"
                      value={data.centerName}
                      onChange={changeHandler}
                      placeholder="Enter your service center name"
                    />
                    <div className="input_error_msg" id="centerName_error">
                      CenterName is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="">
                      Business Contact No
                    </label>
                    <input
                      type="number"
                      className="inputBox"
                      id="centerPhoneNo"
                      value={data.centerPhoneNo}
                      onChange={changeHandler}
                      onWheel={(e) => e.target.blur()}
                    />
                    <div className="input_error_msg" id="centerPhoneNo_error">
                      CenterPhoneNo is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="centerEmailId">
                      Business Email Id
                    </label>
                    <input
                      type="email"
                      className="inputBox"
                      id="centerEmailId"
                      value={data.centerEmailId}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="centerEmailId_error">
                      CenterEmailId is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="street">
                      Address line1
                    </label>
                    <input
                      type="text"
                      className="inputBox"
                      value={data.street}
                      onChange={changeHandler}
                      id="street"
                      placeholder="Enter street name, area"
                    />
                    <div className="input_error_msg" id="street_error">
                      Street is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <div>
                      <label className="inputLabel">Address line2</label>

                      <PlacesAutocomplete
                        value={data.location}
                        onChange={handleChange1}
                        onSelect={handleSelect}
                        className="inputBox"
                      >
                        {({
                          getInputProps,
                          suggestions,
                          getSuggestionItemProps,
                          loading,
                        }) => (
                          <div style={{ position: "relative" }}>
                            <input
                              {...getInputProps({
                                placeholder: "Enter city/country",
                                className:
                                  "location-search-input c_j_form_input ",
                              })}
                              style={{
                                marginBottom: "0px",
                              }}
                              className="inputBox"
                              id="location"
                            />
                            <div
                              className="autocomplete-dropdown-container"
                              style={{
                                width: "calc(100%)",

                                position: "absolute",
                                top: "calc(100%)",
                                zIndex: 1000,
                                fontFamily: "roboto-regular",
                                fontSize: "16px",
                                border:
                                  suggestions.length === 0
                                    ? ""
                                    : "1px solid grey",
                                overflow: "hidden",
                                borderEndStartRadius: "10px",
                                borderEndEndRadius: "10px",
                                background: "white",
                              }}
                            >
                              {loading && <div>Loading...</div>}
                              {suggestions.map((suggestion, i) => {
                                const className = suggestion.active
                                  ? "suggestion-item--active"
                                  : "suggestion-item";
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                  ? {
                                      backgroundColor: "#e1e1e1",
                                      cursor: "pointer",
                                      padding: "10px 20px",
                                    }
                                  : {
                                      backgroundColor: "#ffffff",
                                      cursor: "pointer",
                                      padding: "10px 20px",
                                    };
                                return (
                                  <div
                                    {...getSuggestionItemProps(suggestion, {
                                      className,
                                      style,
                                    })}
                                    key={i}
                                  >
                                    <span>{suggestion.description}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </PlacesAutocomplete>
                    </div>
                    <div className="input_error_msg" id="location_error">
                      Location is required
                    </div>
                  </Grid>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="establishedYear">
                      Established Year
                    </label>
                    <input
                      type="number"
                      className="inputBox"
                      id="establishedYear"
                      value={data.establishedYear}
                      onChange={changeHandler}
                      min="0"
                      placeholder="Year of center establishment"
                      onWheel={(e) => e.target.blur()}
                    />
                    <div className="input_error_msg" id="establishedYear_error">
                      establishedYear is required
                    </div>
                  </Grid>
                  {/* <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="workingFrom">
                      Working From
                    </label>
                    <input
                      type="time"
                      className="inputBox"
                      id="workingFrom"
                      value={data.workingFrom}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="workingFrom_error">
                      workingFrom is required
                    </div>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="workingTill">
                      Working Till
                    </label>
                    <input
                      type="time"
                      className="inputBox"
                      id="workingTill"
                      value={data.workingTill}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="workingTill_error">
                      workingTill is required
                    </div>
                  </Grid> */}
                </Grid>
                <label className="inputLabel">Working Hours</label>
                <Grid container columnSpacing={2}>
                  <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={5.5}>
                    <input
                      type="time"
                      className="inputBox"
                      id="workingFrom"
                      value={data.workingFrom}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="workingFrom_error">
                      workingFrom is required
                    </div>
                  </Grid>
                  <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "8px",
                      }}
                    >
                      to
                    </div>
                  </Grid>
                  <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={5.5}>
                    <input
                      type="time"
                      className="inputBox"
                      id="workingTill"
                      value={data.workingTill}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="workingTill_error">
                      workingTill is required
                    </div>
                  </Grid>
                </Grid>

                <div>
                  <label className="inputLabel">Working days</label>
                  <div style={{ display: "inline" }}>
                    <div>
                      {totalDays.map((day, i) => {
                        return (
                          <div
                            className={
                              holidays.includes(day)
                                ? "dayBadgeActive"
                                : "dayBadge"
                            }
                            key={i}
                            onClick={() => changeHoliday(day)}
                          >
                            {day} &nbsp;
                            {holidays.includes(day) ? (
                              <CloseRoundedIcon sx={{ fontSize: "16px" }} />
                            ) : (
                              <DoneIcon sx={{ fontSize: "16px" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <Grid container rowSpacing={0} columnSpacing={2}>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <label className="inputLabel">
                      Drone Brands you service (Max 20)
                    </label>
                    <Dropdown arr= {brands} enterData={addToBrand} />
                    {/* <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="inputBox"
                        onKeyUp={addBrand}
                        id="brands"
                        placeholder="Type and enter to select"
                      />
                      <div className={css.suggestedBrandsDiv} id="dropDown">
                        {showSuggestedBrands &&
                          selectedBrands1.length > 0 &&
                          selectedBrands1.map((item, i) => {
                            return (
                              <div
                                className={css.brandName}
                                onClick={() => addToBrand(item.brand)}
                                key={i}
                              >
                                {item.brand}
                              </div>
                            );
                          })}
                      </div>
                    </div> */}

                    <div className="input_error_msg" id="brands_error">
                      Brands is required
                    </div>
                    <div style={{ display: "inline" }}>
                      {selectedBrands.map((brand, i) => {
                        return (
                          <div
                            className="dayBadge"
                            style={{ backgroundColor: "#eee" }}
                           
                            key={i}
                          >
                            <RemoveCircleIcon sx={{color:"#ff000080"}}  onClick={() => removeFromMyBrands(brand)}/> &nbsp;{brand}
                          </div>
                        );
                      })}
                    </div>
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <label className="inputLabel">
                      Services you offer (Max 20)
                    </label>
                    <Dropdown1 arr= {services} enterData={addToService} />
                   

                   
                    <div style={{ display: "inline" }}>
                      {selectedServices.map((brand, i) => {
                        return (
                          <div
                            className="dayBadge"
                            style={{ backgroundColor: "#eee" }}
                           
                            key={i}
                          >
                            <RemoveCircleIcon sx={{color:"#ff000080"}}  onClick={() => removeFromMyServices(brand)}/> &nbsp;{brand}
                          </div>
                        );
                      })}
                    </div>
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <label className="inputLabel" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      type="text"
                      className="inputBox"
                      style={{
                        height: "150px",
                        resize: "none",
                        paddingTop: "10px",
                      }}
                      placeholder="Short description about your service center"
                      id="description"
                      value={data.description}
                      onChange={changeHandler}
                    />
                    <div className="input_error_msg" id="description_error">
                      description is required
                    </div>
                  </Grid>
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <label className="inputLabel">
                      Center Images (Max 6 Images)
                    </label>
                    <input
                      type="file"
                      name=""
                      id="photoInput"
                      style={{ display: "none" }}
                      onChange={addPhoto}
                      accept=".jpg, .jpeg, .png, .webp"
                      multiple
                    />
                    <div>
                      <Grid container spacing={2}>
                        {selectedPhotos &&
                          selectedPhotos.map((item, i) => {
                            return (
                              <Grid
                                item
                                xl={2}
                                lg={2}
                                md={2}
                                sm={4}
                                xs={4}
                                key={i}
                              >
                                <div style={{ position: "relative" }}>
                                  <img
                                    src={URL.createObjectURL(item)}
                                    style={{
                                      height: "75px",
                                      width: "100%",
                                      borderRadius: "5px",
                                    }}
                                  />
                                  <DeleteOutlineIcon
                                    style={{
                                      position: "absolute",
                                      right: "0px",
                                      backgroundColor: "#ffffff80",
                                      color: "rgb(255, 68, 68)",
                                      borderRadius: "20px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => removeImage(i)}
                                  />
                                </div>
                              </Grid>
                            );
                          })}
                        {selectedPhotos.length < 6 ? (
                          <Grid item xl={2} lg={2} md={2} sm={4} xs={4}>
                            <label
                              htmlFor="photoInput"
                              className="s_c_a_photo_add"
                            >
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: "75px",
                                  backgroundColor: "#4ffea3",
                                  cursor: "pointer",
                                }}
                              >
                                <AddIcon />
                              </div>
                            </label>
                          </Grid>
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <div className="input_error_msg" id="photos_error">
                        Photos is required
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </div>
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
          </Grid>
        </Grid>
        <Dialog
          open={formatError}
          TransitionComponent={Transition}
          onClose={() => setFormatError(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              We are removing some files due to invalid format. You can choose
              jpg, jpeg, png and webp.
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                className="formBtn2"
                onClick={() => setFormatError(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </Container>
    </>
  );
}

export default CreateCenter;
