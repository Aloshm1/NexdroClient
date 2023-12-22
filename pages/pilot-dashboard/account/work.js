import { Alert, Dialog, Grid, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import PilotAccount from "../../../components/layouts/PilotAccount";
import css from "../../../styles/experience.module.css";
import EditIcon from "@mui/icons-material/Edit";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import PlacesAutocomplete from "react-autocomplete-places/dist/PlacesAutocomplete";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";
import Link from "next/link";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const months = ["","January", "February", "March", "April", "May", "June", "July","August", "September","October", "November", "December"]
function Work() {
  let [edit, setEdit] = useState(true);
  let [newExperience, setNewExperience] = useState(false);
  let [myExperience, setMyExperience] = useState([])
  let [deleteExperience, setDeleteExperience] = useState(false)
  let [tempId, setTempId] = useState("")
  let [saveConfirm, setSaveConfirm] = useState(false)
  let [data, setData] = useState({
    willing: true,
    location: "",
    preferredLocation: [],
    workType: "full_time",
    hourlyPayment: "",
    monthlyPayment: "",
  });
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/experience/getMyExperience`, config).then(res=>{
      console.log(res)
      setMyExperience(res.data)
    })
    if (localStorage.getItem("profileCreated") == "true") {
      document.getElementById("alert").style.display = "flex";
      setEdit(true);
      axios.post(`${domain}/api/user/pilotDetails`, config).then((res) => {
        console.log(res);
        setData({
          ...data,
          willing: true,
          workType: res.data.workType,
          preferredLocation:
            res.data.preferredLocation.length > 0
              ? res.data.preferredLocation.split(",")
              : [],
          monthlyPayment: res.data.monthlyPayment
            ? res.data.monthlyPayment
            : "",
          hourlyPayment: res.data.hourlyPayment ? res.data.hourlyPayment : "",
        });
      });
    } else {
      axios.post(`${domain}/api/user/pilotDetails`, config).then((res) => {
        console.log(res);
        setData({
          ...data,
          willing: res.data.status,
          workType: res.data.workType,
          preferredLocation:
            res.data.preferredLocation.length > 0
              ? res.data.preferredLocation.split(",")
              : [],
          monthlyPayment: res.data.monthlyPayment
            ? res.data.monthlyPayment
            : "",
          hourlyPayment: res.data.hourlyPayment ? res.data.hourlyPayment : "",
        });
      });
    }
    setTimeout(() => {
      if (document.getElementById("alert")) {
        document.getElementById("alert").style.display = "none";
      }
      if (localStorage.getItem("profileCreated")) {
        localStorage.removeItem("profileCreated");
      }
    }, 4000);
  }, []);
  let handleChange1 = (address) => {
    setData({
      ...data,
      location: address,
    });
  };
  let handleSelect = (address) => {
    console.log(address);
    if (address && address.trim().length > 0) {
      setData({
        ...data,
        location: address,
      });
      let tempAddress = address.split(",")[0];
      if (data.preferredLocation.includes(tempAddress)) {
        setData({
          ...data,
          location: "",
        });
      } else if (data.preferredLocation.length >= 5) {
        setData({
          ...data,
          location: "",
        });
      } else {
        setData({
          ...data,
          preferredLocation: [...data.preferredLocation, tempAddress],
          location: "",
        });
      }
    }
  };

  let confirmNotWilling = () => {
    submitData()
    setSaveConfirm(false)
  }

  let changeWilling = () => {
    if (data.willing){
      setSaveConfirm(true)
      setData({
        ...data,
        willing: false
      })
    }else{
      setData({
        ...data,
        willing: true
      })
    }
  }
  let changeHandler = (e) => {
    if (document.getElementById("monthlyPayment_error")) {
      document.getElementById("monthlyPayment_error").style.display = "none";
    }
    if (document.getElementById("hourlyPayment_error")) {
      document.getElementById("hourlyPayment_error").style.display = "none";
    }
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  const removePreferedLocation = (index) => {
    if (edit) {
      var temp_locations = data.preferredLocation;
      temp_locations.splice(index, 1);
      setData({ ...data, preferredLocation: [...temp_locations] });
    }
  };
  let submitData = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!data.willing) {
      axios
        .post(
          `${domain}/api/pilot/updatePilotInfo`,
          {
            status: false,
            hourlyPayment: 0,
            monthlyPayment: 0,
            preferredLocation: "",
          },
          config
        )
        .then((res) => {
          console.log(res);
          setEdit(true);
          document.getElementById("alertSuccess").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("alertSuccess")) {
              document.getElementById("alertSuccess").style.display = "none";
            }
          }, 3000);
        });
    } else {
      if (data.workType == "full_time" && data.monthlyPayment == "") {
        document.getElementById("monthlyPayment_error").innerHTML =
          "Monthly Payment is required";
        document.getElementById("monthlyPayment_error").style.display = "block";
      } else if (data.workType == "part_time" && data.hourlyPayment == "") {
        document.getElementById("hourlyPayment_error").innerHTML =
          "Hourly Payment is required";
        document.getElementById("hourlyPayment_error").style.display = "block";
      } else if (data.workType == "part_time" && String(data.hourlyPayment).length > 3){
        document.getElementById("hourlyPayment_error").innerHTML = "Hourly Payment Should not exceed 3 characters";
        document.getElementById("hourlyPayment_error").style.display = "block";
      }
      else {
        axios
          .post(
            `${domain}/api/pilot/updatePilotInfo`,
            {
              status: data.willing,
              preferredLocation: String(data.preferredLocation),
              workType: data.workType,
              monthlyPayment:
                data.workType == "full_time" ? data.monthlyPayment : 0,
              hourlyPayment:
                data.workType == "part_time" ? data.hourlyPayment : 0,
            },
            config
          )
          .then((res) => {
            console.log(res);
            setEdit(true);
            document.getElementById("alertSuccess").style.display = "flex";
            setTimeout(() => {
              if (document.getElementById("alertSuccess")) {
                document.getElementById("alertSuccess").style.display = "none";
              }
            }, 3000);
          });
      }
    }
  };
  let [experienceData, setExperienceData] = useState({
    companyName: "",
    role: "",
    workType: "Full Time",
    startDate: "",
    endDate: "",
    location: "",
    present: false,
  });
  let [editExperience, setEditExperience] = useState(false)
  let [editExperienceData, setEditExperienceData] = useState({
    companyName: "",
    role: "",
    workType: "Full Time",
    startDate: "",
    endDate: "",
    location: "",
    present: false,
  });
  let experienceHandler = (e) => {
    if (document.getElementById(`${e.target.id}_error`)) {
      document.getElementById(`${e.target.id}_error`).style.display = "none";
    }
    if (e.target.id == "present") {
      setExperienceData({
        ...experienceData,
        present: !experienceData.present,
      });
    } else {
      setExperienceData({
        ...experienceData,
        [e.target.id]: e.target.value,
      });
    }
  };
  let experienceHandler1 = (e) => {
    if (document.getElementById(`${e.target.id}_error1`)) {
      document.getElementById(`${e.target.id}_error1`).style.display = "none";
    }
    if (e.target.id == "present") {
      setEditExperienceData({
        ...editExperienceData,
        present: !editExperienceData.present,
      });
    } else {
      setEditExperienceData({
        ...editExperienceData,
        [e.target.id]: e.target.value,
      });
    }
  };
  let createExperience = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let focusField = "";
    let fields = [];
    if (experienceData.present) {
      fields = ["companyName", "role", "location", "startDate"];
    } else {
      fields = ["companyName", "role", "location", "startDate", "endDate"];
    }
    for (let i = 0; i < fields.length; i++) {
      if (experienceData[fields[i]] === "") {
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
      experienceData.companyName !== "" &&
      (experienceData.companyName.length < 3 ||
        experienceData.companyName.length > 100)
    ) {
      document.getElementById("companyName_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("companyName_error").style.display = "block";
      focusField = "companyName";
    }
    if (
      experienceData.role !== "" &&
      (experienceData.role.length < 3 || experienceData.role.length > 100)
    ) {
      document.getElementById("role_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("role_error").style.display = "block";
      focusField = "role";
    }
    if (
      experienceData.location !== "" &&
      (experienceData.location.length < 3 ||
        experienceData.location.length > 100)
    ) {
      document.getElementById("location_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("location_error").style.display = "block";
      focusField = "location";
    }
    if((experienceData.startDate !== "") && (experienceData.endDate !== "") && (!experienceData.present) && (experienceData.startDate > experienceData.endDate)){
      document.getElementById("startDate_error").innerHTML =
        "Start Date should be lesser than end Date";
      document.getElementById("startDate_error").style.display = "block";
      focusField = "startDate";
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      axios.post(`${domain}/api/experience/createExperience`, {
        companyName: experienceData.companyName,
        role: experienceData.role,
        workType: experienceData.workType,
        location: experienceData.location,
        startDate: experienceData.startDate,
        endDate: experienceData.present ? "Present" : experienceData.endDate,
      }, config).then(res=>{
        document.getElementById("alertSuccess").style.display = "flex";
        setTimeout(()=>{
          if(document.getElementById("alertSuccess")){
            document.getElementById("alertSuccess").style.display = "none"
          }
        },[])
        setExperienceData({
          companyName: "",
    role: "",
    workType: "Full Time",
    startDate: "",
    endDate: "",
    location: "",
    present: false,
        })
        setNewExperience(false)
        window.scrollTo(0,0)
        console.log(res)
        axios.get(`${domain}/api/experience/getMyExperience`, config).then(res=>{
          console.log(res)
          setMyExperience(res.data)
        })
      })
    }
  };
  let editExperienceConfirm = () =>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let focusField = "";
    let fields = [];
    if (editExperienceData.present) {
      fields = ["companyName", "role", "location", "startDate"];
    } else {
      fields = ["companyName", "role", "location", "startDate", "endDate"];
    }
    for (let i = 0; i < fields.length; i++) {
      if (editExperienceData[fields[i]] === "") {
        if (focusField == "") {
          focusField = fields[i];
        }
        document.getElementById(
          `${fields[i]}_error1`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error1`).style.display = "block";
      }
    }
    if (
      editExperienceData.companyName !== "" &&
      (editExperienceData.companyName.length < 3 ||
        editExperienceData.companyName.length > 100)
    ) {
      document.getElementById("companyName_error1").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("companyName_error1").style.display = "block";
      focusField = "companyName";
    }
    if (
      editExperienceData.role !== "" &&
      (editExperienceData.role.length < 3 || editExperienceData.role.length > 100)
    ) {
      document.getElementById("role_error1").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("role_error1").style.display = "block";
      focusField = "role";
    }
    if (
      editExperienceData.location !== "" &&
      (editExperienceData.location.length < 3 ||
        editExperienceData.location.length > 100)
    ) {
      document.getElementById("location_error1").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("location_error1").style.display = "block";
      focusField = "location";
    }
    if((editExperienceData.startDate !== "") && (editExperienceData.endDate !== "") && (!editExperienceData.present) && (editExperienceData.startDate > editExperienceData.endDate)){
      document.getElementById("startDate_error1").innerHTML =
        "Start Date should be lesser than end Date";
      document.getElementById("startDate_error1").style.display = "block";
      focusField = "startDate";
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      axios.post(`${domain}/api/experience/editExperience/${tempId}`, {
        companyName: editExperienceData.companyName,
        role: editExperienceData.role,
    workType: editExperienceData.workType,

        location: editExperienceData.location,
        startDate: editExperienceData.startDate,
        endDate: editExperienceData.present ? "Present" : editExperienceData.endDate,

      }, config).then(res=>{
        document.getElementById("alertSuccess").style.display = "flex";
        setTimeout(()=>{
          if(document.getElementById("alertSuccess")){
            document.getElementById("alertSuccess").style.display = "none"
          }
        },3000)
        setEditExperienceData({
          companyName: "",
    role: "",
    workType: "Full Time",
    startDate: "",
    endDate: "",
    location: "",
    present: false,
        })
        setEditExperience(false)
        window.scrollTo(0,0)
        console.log(res)
        axios.get(`${domain}/api/experience/getMyExperience`, config).then(res=>{
          console.log(res)
          setMyExperience(res.data)
        })
      })
    }
  }
  let editExp = (id) =>{
    setTempId(id)
    setDeleteExperience(true)
  }
  let editMyExperience = (id) =>{
    setTempId(id)
    axios.get(`${domain}/api/experience/getExperienceById/${id}`).then(res=>{
      setEditExperienceData({
        ...editExperienceData,
        companyName: res.data.companyName,
    role: res.data.role,
    workType: res.data.workType,
    startDate: res.data.startDate,
    endDate: res.data.endDate,
    location: res.data.location,
      })
      setEditExperience(true)
    })
    
  }
  let confirmDelete = () =>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/experience/deleteExperience/${tempId}`).then(res=>{
      console.log(res)
      axios.get(`${domain}/api/experience/getMyExperience`, config).then(res=>{
        console.log(res)
        setMyExperience(res.data)
        setDeleteExperience(false)
      })
    })
  }
  return (
    <div>
      <Alert
        severity="success"
        id="alert"
        style={{ marginBottom: "10px", display: "none" }}
      >
        Your dashboard has been successfully created!! Enjoy ! :)
      </Alert>
      <Alert
        severity="success"
        id="alertSuccess"
        style={{ marginBottom: "10px", display: "none" }}
      >
        Your work Information updated successfully.
      </Alert>
      <div className={css.mainHead}>Work Information :</div>
      <div style={{ borderBottom: "1px solid #e5e5e5" }}>
        {/* willing to work */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className={css.willing}>
            Are you open to work? &nbsp;&nbsp;{" "}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={data.willing}
              id="test"
              disabled={!edit}
              onChange={changeWilling}
            />
            <span
              className="slider round"
              style={{ opacity: !edit ? 0.6 : 1 }}
            ></span>
          </label>
        </div>
        {/* //work Details */}
        {data.willing ? (
          <div>
            <Grid container columnSpacing={2}>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <label className="inputLabel">Work Type</label>
                <div>
                  <select
                    className="inputBox"
                    value={data.workType}
                    onChange={changeHandler}
                    id="workType"
                    disabled={!edit}
                  >
                    <option value="full_time">Full-Time</option>
                    <option value="part_time">Part-Time</option>
                  </select>
                </div>
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                {data.workType == "part_time" ? (
                  <>
                    <label className="inputLabel">Hourly Payment (USD)</label>
                    <input
                      type="number"
                      className="inputBox"
                      value={data.hourlyPayment}
                      onChange={changeHandler}
                      id="hourlyPayment"
                      disabled={!edit}
                      onWheel={(e) => e.target.blur()}
                    />
                    <div className="input_error_msg" id="hourlyPayment_error">
                      HourlyPayment is required
                    </div>
                  </>
                ) : (
                  <>
                    <label className="inputLabel">Monthly Payment</label>
                    <select
                      className="inputBox"
                      name="monthlyPayment"
                      id="monthlyPayment"
                      onChange={changeHandler}
                      disabled={!edit}
                    >
                      <option value="" selected={data.monthlyPayment === ""}>
                        Select salary range
                      </option>
                      <option
                        value="500"
                        selected={data.monthlyPayment == "500"}
                      >
                        0$ - 500$
                      </option>
                      <option
                        value="1000"
                        selected={data.monthlyPayment == "1000"}
                      >
                        500$ - 1000$
                      </option>
                      <option
                        value="5000"
                        selected={data.monthlyPayment == "5000"}
                      >
                        1000$ - 5000$
                      </option>
                      <option
                        value="10000"
                        selected={data.monthlyPayment == "10000"}
                      >
                        5000$ - 10000$
                      </option>
                      <option
                        value="10001"
                        selected={data.monthlyPayment == "10001"}
                      >
                        Above 10000$
                      </option>
                    </select>
                    <div className="input_error_msg" id="monthlyPayment_error">
                      MonthlyPayment is required
                    </div>
                  </>
                )}
              </Grid>
            </Grid>
            <div>
              <label className="inputLabel">
                Preferred Work Locations (Maximim 5)
              </label>
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
                        placeholder: "Type and click enter to add",
                        className: "location-search-input c_j_form_input ",
                      })}
                      style={{
                        marginBottom: "0px",
                      }}
                      className="inputBox"
                      id="location"
                      disabled={!edit}
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
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                {data.preferredLocation.map((item, i) => {
                  return (
                    <div className={css.locations} key = {i}>
                      <RemoveCircleIcon
                        sx={{ color: "#ff7f7f ", cursor: "pointer" }}
                        onClick={() => removePreferedLocation(i)}
                      />
                      &nbsp;{item}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        {data.willing ? (
          <div className={css.submit} onClick={submitData}>
            Submit
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* //work experience */}
      <div style={{ marginBottom: "20px" }}>
        <div className={css.addNew} onClick={()=>setNewExperience(true)}>Add new</div>
        <div className={css.mainTitle}>Experience Details:</div>
      </div>
      {
        myExperience.length == 0 ? <Alert severity="info">You have not added any experience yet!</Alert> : <></>
      }
      {/*  */}
      <Grid container spacing={2}>
        {
          myExperience.map((item,i)=>{
            return(
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} key = {i}>
              <div className={css.expDiv}>
                <div className={css.editDelete}>
                  <EditIcon className={css.edit} onClick={()=>editMyExperience(item._id)} />
                  <DeleteIcon className={css.delete} onClick={()=>editExp(item._id)} />
                </div>
                <div className={css.role}>{item.role}</div>
                <div className={css.companyName}>
                  {item.companyName} | {item.workType}
                </div>
                <div className={css.description}>{months[(item.startDate.slice(6,7))]}-{item.startDate.slice(0,4)} to {item.endDate=== "Present" ? item.endDate : months[(item.endDate.slice(6,7))] + "-" + item.endDate.slice(0,4)}</div>
                <div className={css.description}>{item.location}</div>
              </div>
            </Grid>
            )
          })
        }
     
      </Grid>
      <Dialog
        open={newExperience}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNewExperience(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setNewExperience(false)}
          />
          <div className={css.popupTitle}>
            Create new experience details
          </div>
          <label className="inputLabel">Company Name</label>
          <input
            type="text"
            className="inputBox"
            value={experienceData.companyName}
            onChange={experienceHandler}
            id="companyName"
          />
          <div className="input_error_msg" id="companyName_error">
            is required
          </div>
          <label className="inputLabel">Role</label>
          <input
            type="text"
            className="inputBox"
            placeholder="Ex: Ariel Shooter"
            value={experienceData.role}
            onChange={experienceHandler}
            id="role"
          />
          <div className="input_error_msg" id="role_error">
            is required
          </div>
          <label className="inputLabel">Work Type</label>
          <select
            className="inputBox"
            value={experienceData.workType}
            id="workType"
            onChange={experienceHandler}
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
          </select>
          <label className="inputLabel">Location</label>
          <input
            type="text"
            className="inputBox"
            placeholder="Ex: Bangalore, India"
            value={experienceData.location}
            id="location"
            onChange={experienceHandler}
          />
          <div className="input_error_msg" id="location_error">
            is required
          </div>
          <input
            type="checkbox"
            value={experienceData.present}
            onChange={experienceHandler}
            id="present"
          />{" "}
          <span>Still working here</span> <br />
          <label className="inputLabel">Duration</label>
          <Grid container spacing={0}>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              <input
                type="month"
                className="inputBox"
                max={`${new Date().getFullYear()}-${
                  new Date().getMonth() + 1 < 10 ? "0" : ""
                }${new Date().getMonth() + 1}`}
                value={experienceData.startDate}
                onChange={experienceHandler}
                id="startDate"
              />
              <div className="input_error_msg" id="startDate_error">
                MonthlyPayment is required
              </div>
            </Grid>
            <Grid item xl={1} lg={1} md={1} sm={1} xs={12}>
              <div className={css.to}>to</div>
            </Grid>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              {experienceData.present === true ? (
                <div className={css.present}>Present</div>
              ) : (
                <>
                  <input
                    type="month"
                    className="inputBox"
                    max={`${new Date().getFullYear()}-${
                      new Date().getMonth() + 1 < 10 ? "0" : ""
                    }${new Date().getMonth() + 1}`}
                    id="endDate"
                    value={experienceData.endDate}
                    onChange={experienceHandler}
                  />
                  <div className="input_error_msg" id="endDate_error">
                    is required
                  </div>
                </>
              )}

              {/* <div className={css.present}>
                Present
                </div> */}
            </Grid>
          </Grid>
          <center>
            <button
              className={css.submit}
              style={{ marginLeft: "0px" }}
              onClick={createExperience}
            >
              Submit
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
            open={deleteExperience}
            TransitionComponent={Transition}
            keepMounted
            onClose={()=>setDeleteExperience(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <div className="popupContainer">
              <ClearRoundedIcon className="popupClose" onClick={()=>setDeleteExperience(false)} />
              <div className="popupTitle">
               Are you sure you want to delete this Experience?
              </div>
              <center>
                  <button className="popupLoginBtn" onClick={confirmDelete}>Yes, Continue</button>
              </center>
            </div>
          </Dialog>
          <Dialog
        open={editExperience}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setEditExperience(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setEditExperience(false)}
          />
          <div className={css.popupTitle}>
            Enter below details to create new experience
          </div>
          <label className="inputLabel">Company Name</label>
          <input
            type="text"
            className="inputBox"
            value={editExperienceData.companyName}
            onChange={experienceHandler1}
            id="companyName"
          />
          <div className="input_error_msg" id="companyName_error1">
            is required
          </div>
          <label className="inputLabel">Role</label>
          <input
            type="text"
            className="inputBox"
            placeholder="Ex: Ariel Shooter"
            value={editExperienceData.role}
            onChange={experienceHandler1}
            id="role"
          />
          <div className="input_error_msg" id="role_error1">
            is required
          </div>
          <label className="inputLabel">Work Type</label>
          <select
            className="inputBox"
            value={editExperienceData.workType}
            id="workType"
            onChange={experienceHandler1}
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
          </select>
          <label className="inputLabel">Location</label>
          <input
            type="text"
            className="inputBox"
            placeholder="Ex: Bangalore, India"
            value={editExperienceData.location}
            id="location"
            onChange={experienceHandler1}
          />
          <div className="input_error_msg" id="location_error1">
            is required
          </div>
          <input
            type="checkbox"
            value={editExperienceData.present}
            onChange={experienceHandler1}
            id="present"
          />{" "}
          <span>Still working here</span> <br />
          <label className="inputLabel">Duration</label>
          <Grid container spacing={0}>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              <input
                type="month"
                className="inputBox"
                max={`${new Date().getFullYear()}-${
                  new Date().getMonth() + 1 < 10 ? "0" : ""
                }${new Date().getMonth() + 1}`}
                value={editExperienceData.startDate}
                onChange={experienceHandler1}
                id="startDate"
              />
              <div className="input_error_msg" id="startDate_error1">
                MonthlyPayment is required
              </div>
            </Grid>
            <Grid item xl={1} lg={1} md={1} sm={1} xs={12}>
              <div className={css.to}>to</div>
            </Grid>
            <Grid item xl={5.5} lg={5.5} md={5.5} sm={5.5} xs={12}>
              {editExperienceData.present === true ? (
                <div className={css.present}>Present</div>
              ) : (
                <>
                  <input
                    type="month"
                    className="inputBox"
                    max={`${new Date().getFullYear()}-${
                      new Date().getMonth() + 1 < 10 ? "0" : ""
                    }${new Date().getMonth() + 1}`}
                    id="endDate"
                    value={editExperienceData.endDate}
                    onChange={experienceHandler1}
                  />
                  <div className="input_error_msg" id="endDate_error1">
                    is required
                  </div>
                </>
              )}

              {/* <div className={css.present}>
                Present
                </div> */}
            </Grid>
          </Grid>
          <center>
            <button
              className={css.submit}
              style={{ marginLeft: "0px" }}
              onClick={editExperienceConfirm}
            >
              Edit Experience
            </button>
          </center>
        </div>
      </Dialog>
      <Dialog
          open={saveConfirm}
          TransitionComponent={Transition}
          onClose={()=>setSaveConfirm(false)}
        >
          <div className="popupContainer">
              <h4 style={{ textAlign: "center" }}>Are you sure, your account will not display in the <Link href="/hire-pilot"><a style={{textDecoration:"underline"}} target="_blank">hire pilots</a></Link> page.</h4>
              
              <div style = {{display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px"}}>
                    <button
                      className="formBtn4"
                      style = {{padding: "0px 30px"}}
                      onClick = {confirmNotWilling}
                    >
                      Continue
                    </button>
                    <button
                      className="formBtn3"
                      onClick={()=>{
                        setSaveConfirm(false)
                        setData({
                          ...data,
                          willing: true
                        })
                      }}
                    >
                      Cancel
                    </button>
              </div>
          </div>
        </Dialog>
    </div>
  );
}
Work.Layout = PilotAccount;
export default Work;
