import { Alert, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import styles from "../styles/createPilot.module.css";
import Button from "@mui/material/Button";
import DroneImage from "../images/drone_image.png";
import Link from "next/link";
import Image from "next/image";
import DoneIcon from "@mui/icons-material/Done";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import VisibilityOffSharpIcon from "@mui/icons-material/VisibilityOffSharp";
import axios from "axios";
import Router from "next/router";
import Loader from "../components/loader";
import Countries from "./api/country.json";
import Select from "react-select";
import AddIcon from "@mui/icons-material/Add";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Dropdown from "../components/Dropdown";
import Dropdown1 from "../components/Dropdown1";
import InfoIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const allowedDocFormats = ["pdf", "jpg", "png"];

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#f5f5f7",
    borderRadius: "5px",
    borderColor: "#f5f5f7",
    marginBottom: "15px",
    boxShadow: state.isFocused ? null : null,
    cursor: "pointer",
    "&:hover": {
      borderColor: "#4ffea3",
    },
  }),
  menu: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuColor,
  }),
};

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function CreatePilot() {
  const [selectedOption, setSelectedOption] = useState([]);
  let [willWork, setWillWork] = useState(false);
  let [workType, setWorkType] = useState("full_time");
  let [drone, setDrone] = useState("");
  let [options, setOptions] = useState([]);
  const [formatError2, setFormatError2] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  let [filteredSkills, setFilteredSkills] = useState([]);
  const [formData, setFormData] = useState({
    userName: "",
    dob: "",
    gender: "",
    city: "",
    droneType: [],
    pilotType: "licensed",
    certificate: {},
    droneId: "",
    trainingCenter: "",
    completedYear: "",
    industry: [],
    experienceYear: "",
    experienceMonth: "",
    skills: [],
    status: false,
    workType: "full_time",
    preferredLocation: [],
    monthlyPayment: "",
    hourlyPayment: "",
    location: "",
    licenseNo: "",
  });
  const [isLoading, setLoading] = useState(false);
  let [brands, setBrands] = useState([]);
  let [filteredBrands, setFilteredBrands] = useState([]);
  let [allSkills, setAllSkills] = useState([]);
  let [skillStatus, setSkillStatus] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("role")) {
      Router.push("/login");
    } else if (
      localStorage.getItem("role") !== "halfPilot" &&
      localStorage.getItem("role") !== "undefined" &&
      localStorage.getItem("role") !== "booster"
    ) {
      Router.push("/no-page-found");
    }
    axios.get(`${domain}/api/skill/getSkills`).then((res) => {
      if (res.data) {
        const skills = res.data.map((skill) => skill.skill);
        setSuggestedSkills([...skills]);
        setAllSkills([...skills]);
      }
    });
    axios.get(`${domain}/api/industry/getIndustries`).then((res) => {
      const options = res.data.map((d) => ({
        value: d.industry,
        label: d.industry,
      }));
      setOptions([...options]);
    });
    axios.get(`${domain}/api/brand/getOnlyBrands`).then((res) => {
      console.log(res);
      setBrands(res.data);
      console.log(res.data,'oofodofodsfoofsdosdf')
    });
  }, []);

  const changeHandler = (e) => {
    if (e.target.id == "drone") {
      setBrandsStatus(true);
      let result = brands.filter((allBrands) =>
        allBrands.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredBrands(result);
      console.log(filteredBrands);
    } else if (e.target.id == "skills") {
      setSkillStatus(true);
      let result = allSkills.filter((allBrands) =>
        allBrands.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredSkills(result);
      console.log(filteredSkills);
    } else {
      if (e.target.id === "experienceMonth") {
        document.getElementById(`experienceYear_error`).style.display = "none";
        document.getElementById("credentials_error").style.display = "none";
      } else {
        document.getElementById(`${e.target.id}_error`).style.display = "none";
        document.getElementById("credentials_error").style.display = "none";
      }
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const addDrone = (brand) => {
    if (
      !formData.droneType.includes(brand) &&
      formData.droneType.length < 5 &&
      brand.trim().length > 0
    ) {
      setFormData({
        ...formData,
        droneType: [...formData.droneType, brand],
      });
    }
  };

  const removeDrone = (index) => {
    var temp_drones = formData.droneType;
    temp_drones.splice(index, 1);
    setFormData({ ...formData, droneType: [...temp_drones] });
  };
  const setSkillActive = (item) => {
    if (!formData.skills.includes(item)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, item],
      });
    }
    document.getElementById("skills").value = "";
    document.getElementById("skills").focus();
  };
  const addSkillInput = (skill) => {
   if(formData.skills.includes(skill)){
   }else{
    if(formData.skills.length < 10){
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
   }
   
    
    document.getElementById("skills_error").style.display = "none";
  };

  const removeSkill = (index) => {
    var temp_skills = formData.skills;
    setSuggestedSkills([temp_skills[index], ...suggestedSkills]);
    temp_skills.splice(index, 1);
    setFormData({ ...formData, skills: [...temp_skills] });
  };

  const addSkillSuggested = (index) => {
    var temp_skill = suggestedSkills[index];
    var temp_suggested_skills = suggestedSkills;
    temp_suggested_skills.splice(index, 1);
    setSuggestedSkills(temp_suggested_skills);
    setFormData({
      ...formData,
      skills: [...formData.skills, temp_skill],
    });
    document.getElementById("skills_error").style.display = "none";
  };

  const addPreferedLocation = (e) => {
    if (e.key === "Enter") {
      if (
        !formData.preferredLocation.includes(e.target.value) &&
        formData.preferredLocation.length < 5
      ) {
        setFormData({
          ...formData,
          preferredLocation: [...formData.preferredLocation, e.target.value],
        });
      }
      document.getElementById(e.target.id).value = "";
    }
  };

  const removePreferedLocation = (index) => {
    var temp_locations = formData.preferredLocation;
    temp_locations.splice(index, 1);
    setFormData({ ...formData, preferredLocation: [...temp_locations] });
  };

  const workTypeChangeHandler = (e) => {
    setFormData({
      ...formData,
      workType: e.target.value,
    });
  };

  const pilotTypeChangeHandler = (e) => {
    setFormData({ ...formData, pilotType: e.target.value });
  };

  const enterFormSubmit = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };
  const handleChange = (selectedOption) => {
    setFormData({ ...formData, industry: [...selectedOption] });
    document.getElementById("industry_error").style.display = "none";
  };
  const certificateChangeHandler = (e) => {
    if (e.target.files && e.target.files.length >= 1) {
      if (e.target.files[0].size / 1000000 > 2) {
        document.getElementById("certificate_error").innerText =
          "File size should not exceed 2MB";
        document.getElementById("certificate_error").style.display = "block";
        setTimeout(() => {
          document.getElementById("certificate_error").style.display = "none";
        }, 4000);
      } else {
        var file = e.target.files[0];
        var fileFormat = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
        console.log(fileFormat);
        if (allowedDocFormats.includes(fileFormat)) {
          setFormData({ ...formData, certificate: e.target.files[0] });
          document.getElementById("certificate_error").style.display = "none";
        } else {
          setFormatError2(true);
        }
      }
    }
  };

  const handleChangeWillWork = (e) => {
    setFormData({
      ...formData,
      status: !formData.status,
    });
  };

  const handleClick = () => {
    var year = new Date().getFullYear();
    let month = new Date().getMonth();
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    function isUserNameValid(username) {
      /* 
        Usernames can only have: 
        - Lowercase Letters (a-z)
        - Numbers (0-9)
        - Underscores (_)
        - Hyphen (-)
      */
      const res = /^[a-z0-9_-]+$/.exec(username);
      const valid = !!res;
      return valid;
    }
    function isDroneIdValid(DroneId) {
      const res = /^[a-zA-Z0-9]{1,30}$/.exec(DroneId);
      const valid = !!res;
      return valid;
    }
    function isLiceseNoValid(licenseNo) {
      const res = /^[a-zA-Z0-9]{1,30}$/.exec(licenseNo);
      const valid = !!res;
      return valid;
    }
    console.log(formData);
    var fields = [];
    if (formData.pilotType === "licensed") {
      fields = [
        "userName",
        "dob",
        "city",
        "licenseNo",
        "industry",
        "experienceYear",
        "experienceMonth",
        "skills",
      ];
    } else {
      fields = [
        "userName",
        "dob",
        "city",
        "industry",
        "experienceYear",
        "experienceMonth",
        "skills",
      ];
    }
    // if (formData.status) {
    //   fields.push(
    //     formData.workType === "full_time" ? "monthlyPayment" : "hourlyPayment"
    //   );
    // }
    var error = false;
    var focusField = "";
    for (var i = 0; i < fields.length; i++) {
      if (
        fields[i] !== "experienceYear" &&
        fields[i] !== "experienceMonth" &&
        String(formData[fields[i]]).trim().length <= 0
      ) {
        document.getElementById(
          `${fields[i]}_error`
        ).innerText = `${fields[i]} is required.`;
        document.getElementById(`${fields[i]}_error`).style.display = "block";
        console.log(fields[i]);
        if (focusField === "") {
          focusField = fields[i];
        }
        error = true;
      }
      if (fields[i] === "userName") {
        if (formData[fields[i]].trim().length === 0) {
          document.getElementById("userName_error").innerText =
            "Username is required";
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById(`${fields[i]}_error`).style.display = "block";
        } else if (formData[fields[i]].trim().length < 3) {
          document.getElementById("userName_error").innerText =
            "Username should have atleast 3 characters";
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById(`${fields[i]}_error`).style.display = "block";
        } else if (formData[fields[i]].trim().length > 25) {
          document.getElementById("userName_error").innerText =
            "Username should not exceed 25 characters";
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById(`${fields[i]}_error`).style.display = "block";
        } else if (!isUserNameValid(formData.userName)) {
          document.getElementById("userName_error").innerText =
            "Username is not valid. You can use only integers, characters(small letters), '-' and '_'";
          error = true;
          if (focusField === "") {
            focusField = fields[i];
          }
          document.getElementById(`${fields[i]}_error`).style.display = "block";
        }
      }
      if (fields[i] === "dob" && formData[fields[i]].slice(0, 4) > year - 13) {
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
        document.getElementById("dob_error").innerText =
          "Age must be minimum 13 years.";
        document.getElementById("dob_error").style.display = "block";
      }
      if (
        fields[i] === "city" &&
        (formData[fields[i]].trim().length > 100 ||
          formData[fields[i]].trim().length < 3)
      ) {
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
        document.getElementById("city_error").innerText =
          "City should be between 3 - 100 characters.";
        document.getElementById("city_error").style.display = "block";
      }
      if (
        fields[i] === "licenseNo" &&
        (formData[fields[i]].trim().length > 25 ||
          formData[fields[i]].trim().length < 3) &&
        formData[fields[i]].trim().length !== 0
      ) {
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
        document.getElementById("licenseNo_error").innerText =
          "License No should be between 3 - 25 characters.";
        document.getElementById("licenseNo_error").style.display = "block";
      }
      if (
        fields[i] === "licenseNo" &&
        !isLiceseNoValid(formData[fields[i]])
       ) {
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
        document.getElementById("licenseNo_error").innerText =
          "License No is not valid. Use only Alphabets and numbers.";
        document.getElementById("licenseNo_error").style.display = "block";
      }
      if (
        fields[i] === "droneId" &&
        !isDroneIdValid(formData.droneId) &&
        formData.droneId.length > 0
      ) {
        error = true;
        if (focusField === "") {
          focusField = fields[i];
        }
        document.getElementById("droneId_error").innerText =
          "DroneId is not valid.";
        document.getElementById("droneId_error").style.display = "block";
      }
      if (fields[i] === "completed_year" && data[fields[i]] !== "") {
        if (
          Number(formData.completedYear.slice(0, 4)) > year ||
          (Number(formData.completedYear.slice(0, 4)) === year &&
            Number(formData.completedYear.slice(5, 7)) > month + 1)
        ) {
          error = true;
          if (focusField === "") {
            focusField = "completedYear";
          }
          document.getElementById("completedYear_error").innerText =
            "Invalid year";
          document.getElementById("completedYear_error").style.display =
            "block";
        }
      }
      if (fields[i] === "certificate" && !formData[fields[i]].name) {
        document.getElementById(`${fields[i]}_error`).style.display = "block";
        document.getElementById(`${fields[i]}_error`).InnerText =
          "Certificate is required";
        if (focusField === "") {
          focusField = fields[i];
        }
        error = true;
      }
      if (
        fields[i] === "monthlyPayment" &&
        formData.monthlyPayment != "" &&
        formData.monthlyPayment <= 0
      ) {
        document.getElementById(`monthlyPayment_error`).innerText =
          "Monthly payment is not valid";
        document.getElementById(`monthlyPayment_error`).style.display = "block";
        if (focusField === "") {
          focusField = fields[i];
        }
        error = true;
      }
      if (
        fields[i] === "hourlyPayment" &&
        formData.hourlyPayment != "" &&
        formData.hourlyPayment <= 0
      ) {
        document.getElementById(`hourlyPayment_error`).innerText =
          "Hourly payment is not valid";
        document.getElementById(`hourlyPayment_error`).style.display = "block";
        if (focusField === "") {
          focusField = fields[i];
        }
        error = true;
      }
      if (
        fields[i] === "experienceYear" &&
        formData.experienceYear != "" &&
        (formData.experienceYear < 0 || formData.experienceYear > 50)
      ) {
        document.getElementById(`experienceYear_error`).style.display = "block";
        if (focusField === "") {
          focusField = fields[i];
        }
        error = true;
      }
      if (
        fields[i] === "experienceMonth" &&
        (formData.experienceMonth > 12 || formData.experienceMonth < 0)
      ) {
        document.getElementById(`experienceYear_error`).style.display = "block";
        if (focusField === "") {
          focusField = fields[i];
        }
        error = true;
      }
    }

    if (error) {
      document.getElementById(focusField).focus();
    } else {
      var industry_temp = formData.industry.map((x) => x.value);
      axios
        .post(`${domain}/api/pilot/checkUserName`, {
          userName: formData.userName,
        })
        .then((res) => {
          let data = new FormData();
          data.append("userName", formData.userName);
          data.append("dob", formData.dob);
          data.append("gender", formData.gender);
          data.append("city", formData.city);
          data.append("drones", formData.droneType);
          data.append("pilotType", formData.pilotType);
          data.append("file", formData.certificate);
          data.append("droneId", formData.droneId);
          data.append("trainingCenter", formData.trainingCenter);
          data.append("completedYear", formData.completedYear);
          data.append("industry", industry_temp);
          data.append("yearlyExperience", formData.experienceYear);
          data.append("monthlyExperience", formData.experienceMonth);
          data.append("skills", formData.skills);
          data.append("status", formData.status);
          data.append("workType", formData.workType);
          data.append("preferredLocation", formData.preferredLocation);
          data.append("monthlyPayment", formData.monthlyPayment);
          data.append("hourlyPayment", formData.hourlyPayment);
          data.append("licenseNo", formData.licenseNo);
          setLoading(true);
          axios
            .post(`${domain}/api/pilot/registerPilot`, data, config)
            .then((res) => {
              console.log(res.data);
              localStorage.setItem("role", "pilot");
              localStorage.setItem("profileCreated", "true");
              localStorage.removeItem("tempUserType")
              Router.push({
                pathname: "/pilot-dashboard/account/work",
              });
              setLoading(false);
            })
            .catch((err) => {
              console.log(err.response);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log(err);
          document.getElementById("userName_error").innerText =
            "Username already exists";
          document.getElementById("userName_error").style.display = "block";
          document.getElementById("userName").focus();
        });
    }
  };
  let handleChange1 = (address) => {
    document.getElementById("city_error").style.display = "none";
    setFormData({
      ...formData,
      city: address,
    });
  };
  let goBack = () => {
    Router.push("/choose-categories")
  }

  let handleSelect = (address) => {
    console.log(address);
    setFormData({
      ...formData,
      city: address,
    });
  };
  let [brandStatus, setBrandsStatus] = useState(false);
  let clickedOutsideBlock = () => {
    setBrandsStatus(false);
    setSkillStatus(false);
  };
  let setBrandsActive = (item) => {
    if (!formData.droneType.includes(item) && formData.droneType.length < 5) {
      setFormData({
        ...formData,
        droneType: [...formData.droneType, item],
      });
    }
    document.getElementById("drone").value = "";
    document.getElementById("drone").focus();
  };
  let [tempInd, setTempInd] = useState(filteredBrands[0]);
  const upHandler = ({ key }) => {
    console.log(key);
    if (filteredBrands.length !== 0) {
      if (key == "ArrowDown") {
        let i = filteredBrands.indexOf(tempInd);
        if (filteredBrands[i + 1] !== undefined) {
          setTempInd(filteredBrands[i + 1]);
          if (document.getElementById("dropDown")) {
            document.getElementById("dropDown").scrollTop += 42;
          }
        }
        setTimeout(() => {
          filteredBrands;
        }, 1000);
      }
      if (key == "ArrowUp") {
        let i = filteredBrands.indexOf(tempInd);
        if (filteredBrands[i - 1] !== undefined) {
          setTempInd(filteredBrands[i - 1]);
          if (document.getElementById("dropDown")) {
            document.getElementById("dropDown").scrollTop -= 42;
          }
        }
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
      <Container className="Container">
        <div className={styles.createPilot} onClick={clickedOutsideBlock}>
          <div
            className={styles.createPilotImage}
            style={{ flex: "1" }}
          >
            <Image src={DroneImage} />
          </div>
          <div
            className={styles.CreatePilotForm}
            style={{ margin: "20px auto", flex: "1" }}
          >
            <Link href = "/choose-categories"><a className = "go_back_link">Back</a></Link>
            {/* <h4 style={{ paddingBottom: "25px", fontSize: "20px" }}>
              Welcome almost done, Please fill below fields to complete your
              profile setup
            </h4> */}
            <Alert
              severity="success"
              sx={{ marginBottom: "10px" }}
              id="alertBox"
            >
              Welcome almost done, Please fill below fields to complete your
              profile setup!
            </Alert>
            <label htmlFor="userName">
              <div className="label" style = {{display: 'flex', alignItems: "center"}}>
                Username&nbsp;<Tooltip title="You can use only numbers, alphabets(small case), _
                and -" placement="top">
                      <InfoIcon sx = {{height: "18px", width: "18px"}}/>
                    </Tooltip>
              </div>
            </label>
            <input
              type="text"
              id="userName"
              className="inputBox"
              value={formData.userName}
              name="userName"
              onChange={changeHandler}
              onKeyUp={enterFormSubmit}
            />
            <div className="input_error_msg" id="userName_error">
              Username is required
            </div>
            <div className={styles.createPilotInputRow}>
              <div className={styles.createPilotInputCol}>
                <label htmlFor="dob">
                  <div className="label">Date of Birth</div>
                </label>
                <input
                  type="date"
                  id="dob"
                  className="inputBox"
                  value={formData.dob}
                  name="dob"
                  onChange={changeHandler}
                  onKeyUp={enterFormSubmit}
                  max={
                    new Date(
                      new Date().getFullYear() - 13,
                      new Date().getMonth(),
                      new Date().getDate()
                    )
                      .toISOString()
                      .split("T")[0]
                  }
                />
                <div className="input_error_msg" id="dob_error">
                  DOB is required
                </div>
              </div>
              <div className={styles.createPilotInputCol}>
                <label htmlFor="city">
                  <div className="label">City</div>
                </label>
                {/* <input
              type="text"
              id="city"
              className="inputBox"
              value={formData.city}
              name="city"
              onChange={changeHandler}
              onKeyUp={enterFormSubmit}
            /> */}
                <PlacesAutocomplete
                  value={formData.city}
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
                          className: "location-search-input c_j_form_input ",
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
                            suggestions.length === 0 ? "" : "1px solid grey",
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
                <div className="input_error_msg" id="city_error">
                  City is required
                </div>
              </div>
            </div>

            <label htmlFor="drone">
              <div className="label">
                Do you own a Drone? (Max 5)
              </div>
            </label>
            <Dropdown arr={brands} enterData={addDrone} />
            <div style={{ position: "relative" }}>
              <input
                type="text"
                id="drone"
                className="inputBox"
                name="drone"
                onKeyUp={addDrone}
                placeholder="Type and press enter to add."
                onChange={changeHandler}
                style={{ display: "none" }}
              />
              {brandStatus && (
                <div className={styles.suggestedBrands} id="suggestedBrands">
                  {filteredBrands.map((item, i) => {
                    return (
                      <div
                        className={styles.suggestBrands}
                        onClick={() => setBrandsActive(item)}
                        key={i}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              className={styles.createPilotSuggestedSkillsContainer}
              style={{ marginBottom: formData.droneType.length > 0 && "15px" }}
            >
              {formData.droneType.map((drone, index) => {
                return (
                  <div className={styles.createPilotSuggestedSkill} key={index}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <RemoveCircleIcon
                        className={styles.removeIcon}
                        onClick={() => removeDrone(index)}
                      />
                      {drone}{" "}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <div>
                <label>
                  <div className="label">Do You own a License?</div>
                </label>
                <div className={styles.createPilotPilotTypeContainer}>
                  <label className={styles.createPilotRadioLabel}>
                    <input
                      type="radio"
                      value={"licensed"}
                      name="pilotType"
                      onChange={pilotTypeChangeHandler}
                      onKeyUp={enterFormSubmit}
                      className={styles.CreatePilotRadio}
                      checked={formData.pilotType === "licensed"}
                    />
                    <div className={styles.createPilotRadioLabelContent}>
                      Yes
                    </div>
                  </label>
                  <label
                    className={styles.createPilotRadioLabel}
                    style={{ marginLeft: "20px" }}
                  >
                    <input
                      type="radio"
                      value={"unlicensed"}
                      name="pilotType"
                      onChange={pilotTypeChangeHandler}
                      onKeyUp={enterFormSubmit}
                      className={styles.CreatePilotRadio}
                      checked={formData.pilotType === "unlicensed"}
                    />
                    <div className={styles.createPilotRadioLabelContent}>
                      No
                    </div>
                  </label>
                </div>
              </div>
            </div>
            {formData.pilotType === "licensed" ? (
              <div
                style={{ display: "flex", flexWrap: "wrap", columnGap: "20px" }}
              >
                <div style={{ flex: "1", minWidth: "250px" }}>
                  <label htmlFor="licenseNo">
                    <div className="label">License No</div>
                  </label>
                  <input
                    type="text"
                    id="licenseNo"
                    className="inputBox"
                    value={formData.licenseNo}
                    name="licenseNo"
                    onChange={changeHandler}
                    onKeyUp={enterFormSubmit}
                  />
                  <div className="input_error_msg" id="licenseNo_error">
                    License No is required
                  </div>
                </div>
                <div style={{ flex: "1" }}>
                  <label htmlFor="certificate" className="label">
                    Pilot License Certificate (Optional)
                  </label>
                  <input
                    type="file"
                    id="certificate"
                    accept=".pdf, .jpg, .png"
                    onChange={certificateChangeHandler}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="certificate"
                    className={styles.createPilotCertificateContainer}
                  >
                    {formData.certificate.name ? (
                      <div className={styles.createPilotCertificateAttachment}>
                        Attached&nbsp; <DoneIcon sx={{ fontSize: "16px" }} />
                      </div>
                    ) : (
                      <div className={styles.createPilotCertificateAttachment}>
                        Attachments
                      </div>
                    )}

                    <div
                      className={styles.createPilotCertificateAttachmentName}
                    >
                      {formData.certificate.name
                        ? `${formData.certificate.name.slice(0, 15)}${
                            formData.certificate.name.length > 15
                              ? " . . ."
                              : ""
                          }`
                        : "Attach your certificate"}
                    </div>
                  </label>
                  <div className="input_error_msg" id="certificate_error">
                    Certificate is required
                  </div>
                  <div className={styles.createPilotInputRow}>
                    {/* <div className={styles.createPilotInputCol}>
                    <label htmlFor="trainingCenter">
                      <div className="label">Training Center Name:</div>
                    </label>
                    <input
                      type="text"
                      id="trainingCenter"
                      className="inputBox"
                      value={formData.centerName}
                      name="trainingCenter"
                      onChange={changeHandler}
                      onKeyUp={enterFormSubmit}
                    />
                    <div className="input_error_msg" id="trainingCenter_error">
                      Center name is required
                    </div>
                  </div> */}
                    {/* <div className={styles.createPilotInputCol}>
                    <label htmlFor="completedYear">
                      <div className="label">Completed Term:</div>
                    </label>
                    <input
                      type="month"
                      id="completedYear"
                      className="inputBox"
                      value={formData.completedYear}
                      name="completedYear"
                      onChange={changeHandler}
                      onKeyUp={enterFormSubmit}
                      max={`${new Date().getFullYear()}-${
                        new Date().getMonth() + 1 < 10 ? "0" : ""
                      }${new Date().getMonth() + 1}`}
                    />
                    <div className="input_error_msg" id="completedYear_error">
                      completed term is required
                    </div>
                  </div> */}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <label htmlFor="industry">
              <div className="label">Industries (Max 5)</div>
            </label>
            <Select
              value={formData.industry}
              onChange={handleChange}
              options={options}
              styles={{ ...customStyles }}
              isMulti
              id="industry"
              isOptionDisabled={() => formData.industry.length >= 5}
            />
            <div className="input_error_msg" id="industry_error">
              Industry is required
            </div>
            <label htmlFor="experienceYear">
              <div className="label">Flying Experience (if any)</div>
            </label>
            <div className={styles.createPilotInputRow}>
              <div className={styles.createPilotInputCol}>
                <input
                  type="number"
                  id="experienceYear"
                  className="inputBox"
                  value={formData.experienceYear}
                  name="experienceYear"
                  onChange={changeHandler}
                  onKeyUp={enterFormSubmit}
                  onWheel={(e) => e.target.blur()}
                  placeholder="Year maximum(50)"
                />
                <div className="input_error_msg" id="experienceYear_error">
                  Invalid experience
                </div>
              </div>
              <div className={styles.createPilotInputCol}>
                <input
                  type="number"
                  id="experienceMonth"
                  className="inputBox"
                  value={formData.exp_month}
                  name="experienceMonth"
                  onChange={changeHandler}
                  onKeyUp={enterFormSubmit}
                  placeholder="Month"
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
            <label htmlFor="skills">
              <div className="label">Add your Skills</div>
            </label>
            <Dropdown1 arr={allSkills} enterData={addSkillInput} />
            <div style={{ position: "relative", display:"none" }}>
              <input
                type="text"
                id="skills"
                className="inputBox"
                name="skill"
                onChange={changeHandler}
                onKeyUp={addSkillInput}
                placeholder="Type and press enter to add."
              />
              {skillStatus && (
                <div className={styles.suggestedBrands} id="suggestedBrands">
                  {filteredSkills.map((item, i) => {
                    return (
                      <div
                        className={styles.suggestBrands}
                        onClick={() => setSkillActive(item)}
                        key={i}
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              className={styles.createPilotSuggestedSkillsContainer}
              style={{ marginBottom: formData.skills.length > 0 && "15px" }}
            >
              {formData.skills.map((skill, index) => {
                return (
                  <div className={styles.createPilotSuggestedSkill} key={index}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <RemoveCircleIcon
                        className={styles.removeIcon}
                        onClick={() => removeSkill(index)}
                      />
                      {skill}{" "}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="input_error_msg" id="skills_error">
              Skills is required
            </div>
            {/* {suggestedSkills.length > 0 && (
              <>
                <label htmlFor="skill">
                  <div className="label">Suggested Skills:</div>
                </label>
                <div className={styles.createPilotSuggestedSkillsContainer}>
                  {suggestedSkills.map((skill, index) => {
                    return (
                      <div
                        className={styles.createPilotSuggestedSkill}
                        key={index}
                        onClick={() => addSkillSuggested(index)}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {skill}{" "}
                          <AddIcon
                            style={{ fontSize: "14px", fontWeight: "900" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )} */}

            <div className="input_error_msg" id="credentials_error">
              Something went wrong. Try again.
            </div>
            <div>
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
                  onClick={handleClick}
                  style={{ textTransform: "capitalize" }}
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        <Dialog
          open={formatError2}
          TransitionComponent={Transition}
          onClose={() => setFormatError2(false)}
        >
          <div className="popupContainer">
            <h3 style={{ textAlign: "center" }}>
              Invalid file format. You can choose pdf, jpg, png.
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
                onClick={() => setFormatError2(false)}
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

export default CreatePilot;
