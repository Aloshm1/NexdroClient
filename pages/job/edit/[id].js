import { Grid } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import Script from "next/script";
import React, { useEffect, useState, useRef } from "react";
import job from "../../../styles/job.module.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import { Wrapper } from "@googlemaps/react-wrapper";
import Router from "next/router";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";

import dynamic from "next/dynamic";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;
 
  return {
    props: {
      id: id
    },
  };
}
function CreateJob({id}) {


  let [mainIndustries, setMainIndustries] = useState([]);
  let [industries, setIndustries] = useState([]);
  let [activeJobs, setActiveJobs] = useState(0);
  useEffect(() => {
    axios.get(`${domain}/api/industry/getIndustries`).then((res) => {
      setIndustries(res.data);
      setMainIndustries(res.data);
    });
    console.log(id)
    axios
      .get(`${domain}/api/jobs/jobLanding/${id}`)
      .then((res) => {
        console.log(res);

        if (res.data.jobDesc) {
          console.log("true");
          setDesc(res.data.jobDesc);
          setData({
            title: res.data.jobTitle,
            industry: res.data.industry,
            location: res.data.workLocation,
            jobType: res.data.jobType,
            employeeType: res.data.employeeType,
            minSalary: res.data.minSalary,
            maxSalary: res.data.maxSalary,
            rate: res.data.rate,
            openings: res.data.noOfOpenings,
            experience: res.data.experience,
            description: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(res.data.jobDesc)
              )
            ),
          });
        } else {
          setData({
            ...data,
            title: res.data.jobTitle,
            industry: res.data.industry,
            location: res.data.workLocation,
            jobType: res.data.jobType,
            experience:res.data.experience,
            employeeType: res.data.employeeType,
            minSalary: res.data.minSalary,
            maxSalary: res.data.maxSalary,
            rate: res.data.rate,
            openings: res.data.noOfOpenings,
          });
        }
      });

    if (document.getElementById("dropDown")) {
      document.getElementById("dropDown").style.display = "none";
    }
  }, []);
  let [data, setData] = useState({
    title: "",
    industry: "",
    location: "",
    description: EditorState.createEmpty(),
    jobType: "Full-time",
    employeeType: "Unlicensed Pilot",
    minSalary: "",
    maxSalary: "",
    rate: "",
    openings: "",
    experience: "0-1years"
  });
  let onEditorStateChange = (editorState) => {
    document.getElementById("description_error").style.display = "none"
    let data1 = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log(data1);
    setDesc(data1);
    setData({
      ...data,
      description: editorState,
    });
  };

  let MouseIned = (id) => {
    document.getElementById(`options/${id}`).style.backgroundColor = "#e7e7e7";
  };
  let MouseOuted = (id) => {
    document.getElementById(`options/${id}`).style.backgroundColor = "#ffffff";
  };
  let changeIndustry = (item) => {
    setData({
      ...data,
      industry: item,
    });
  };
  let changeHandler = (e) => {
    if (document.getElementById(`${e.target.id}_error`)) {
      document.getElementById(`${e.target.id}_error`).style.display = "none";
    }
    if(e.target.id == "minSalary" || e.target.id == "maxSalary"){
      document.getElementById(`salary_error`).style.display = "none";
    }
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
  };
  let clicked = () => {
    if (document.getElementById("dropDown")) {
      document.getElementById("dropDown").style.display = "none";
    }
  };
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
  let descriptionChange = (data1) => {
    setData({
      ...data,
      description: data1,
    });
  };
  let hourChangeHandler = (e) => {
    var job_type;
    if (e.target.value === "per-month") {
      job_type = "Full-time";
    } else {
      job_type = "Part-time";
    }
    setData({
      ...data,
      rate: e.target.value,
      jobType: job_type,
    });
  };
  let [desc, setDesc] = useState("");
  let CreateJob = () => {
    var focusField = "";
    let fields = ["title", "industry", "openings", "location", "description"];
    for (let i = 0; i < fields.length; i++) {
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
    if (data.title) {
      if (
        data.title !== "" &&
        (data.title.length < 3 || data.title.length > 100)
      ) {
        document.getElementById("title_error").innerHTML =
          "Characters should be between 3 - 100";
        document.getElementById("title_error").style.display = "block";
        if (focusField == "") {
          focusField = "title";
        }
      }
    }
    if (data.industry) {
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
    }
    if (data.minSalary < 0 || data.maxSalary < 0) {
      document.getElementById("salary_error").innerHTML = "invalid Salary";
      document.getElementById("salary_error").style.display = "block";
      focusField = "minSalary";
    }
    if (data.minSalary > data.maxSalary) {
      document.getElementById("salary_error").innerHTML =
        "MaxSalary should be greater";
      document.getElementById("salary_error").style.display = "block";
      focusField = "minSalary";
    }
    if (data.openings !== "" && (data.openings < 1 || data.openings > 50)) {
      document.getElementById("openings_error").innerHTML =
        "Openings should be between 1 - 50";
      document.getElementById("openings_error").style.display = "block";
      focusField = "openings";
    }
    if (desc !== "" && (desc.length < 1000 || desc.length > 50000)) {
      document.getElementById("description_error").innerHTML =
        "Please write atleast 50 words to maximum 1000 words";
      document.getElementById("description_error").style.display = "block";
      focusField = "description";
    }

    if (focusField !== "" && document.getElementById(focusField)) {
      document.getElementById(focusField).focus();
    }
    if (focusField == "") {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };

      console.log(data);
      console.log(desc);

      axios.post(
        `${domain}/api/jobs/editJob/${id}`,
          {
            jobTitle: data.title,
            industry: data.industry,
            jobType: data.jobType,
            employeeType: data.employeeType,
            minSalary: data.minSalary,
            maxSalary: data.maxSalary,
            salaryType: data.rate,
            workLocation: data.location,
            jobDesc: desc,
            noOfOpenings: data.openings,
            experience: data.experience
          },
          config
        )
        .then((res) => {
          localStorage.setItem("jobedited", "true")
         Router.push({
          pathname: "/company-dashboard/activities",
         
         })
        })
        .catch((err) => {
          console.log(err.response.message);
        });
    }
  };
  return (
    <>
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyApOXpKSCrcudAr2BONFB4oYEjTi-VXFKQ&libraries=places`}
          defer
        />
      </Head>
      <Script src={``}></Script>

      <div
        style={{ backgroundColor: "rgb(248,248,251)", paddingTop: "30px" }}
        onClick={clicked}
      >
        <div className={job.container}>
          <div className={job.jobShowTalentContainer}>
            <div className={job.jobMainTitle}>Edit your job post</div>
            <div className={job.jobMainDesc}>
            Exclusive job portal to hire Drone Pilots Globally, Post your Job now and get connected with Pilots
            </div>
          </div>
          <div
            className={job.jobShowTalentContainer}
            style={{ padding: "50px" }}
          >
            <div className={job.jobBoxTitle}>Job Information</div>
            <div style={{ marginTop: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <label className="inputLabel" htmlFor="title">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="inputBox"
                    id="title"
                    value={data.title}
                    onChange={changeHandler}
                  />
                  <div className="input_error_msg" id="title_error">
                    Title is required
                  </div>
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <div>
                    <label className="inputLabel" htmlFor="industry">
                      Industry
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        className="inputBox"
                        id="industry"
                        value={data.industry}
                        style={{ marginBottom: "0px" }}
                        onChange={changeHandler}
                        autoComplete="off"
                      />
                      {typeof window !== "undefined" && (document.getElementById("industry") ===
                        document.activeElement && data.industry !== "") ? (
                        <div
                          style={{
                            position: "absolute",
                            backgroundColor: "#ffffff",
                            border: "1px solid #e7e7e7",
                            width: "100%",
                            maxHeight: "150px",
                            overflow: "auto",
                            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                            borderRadius: "0px 0px 10px 10px",
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
                  </div>
                </Grid>
              </Grid>
            </div>

            <div style={{ margin: "15px 0px 20px 0px" }}>
              <label className="inputLabel">Job Type</label>
              <div>
                <input
                  type="radio"
                  name="jobType"
                  checked={data.jobType == "Full-time"}
                  onClick={() => {
                    setData({
                      ...data,
                      jobType: "Full-time",
                      rate: "per-month",
                    });
                  }}
                  id="fullTime"
                />
                <label className={job.jobSpan} htmlFor="fullTime">
                  Full Time
                </label>
                <input
                  type="radio"
                  name="jobType"
                  style={{ marginLeft: "50px" }}
                  checked={data.jobType == "Part-time"}
                  onClick={() => {
                    setData({
                      ...data,
                      jobType: "Part-time",
                      rate: "per-hour",
                    });
                  }}
                  id="partTime"
                />
                <label className={job.jobSpan} htmlFor="partTime">
                  Part Time
                </label>
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label className="inputLabel">EmployeeType</label>
              <div>
                <input
                  type="radio"
                  name="employeeType"
                  checked={data.employeeType == "Licensed Pilot"}
                  id="licensed"
                  onClick={() => {
                    setData({
                      ...data,
                      employeeType: "Licensed Pilot",
                    });
                  }}
                />
                <label className={job.jobSpan} htmlFor="licensed">
                  Licensed Pilot
                </label>
                <input
                  type="radio"
                  name="employeeType"
                  style={{ marginLeft: "50px" }}
                  checked={data.employeeType == "Unlicensed Pilot"}
                  id="unlicensed"
                  onClick={() => {
                    setData({
                      ...data,
                      employeeType: "Unlicensed Pilot",
                    });
                  }}
                />
                <label className={job.jobSpan} htmlFor="unlicensed">
                  Unlicensed Pilot
                </label>
              </div>
            </div>
            <div>
              <div className="inputLabel">Salary Range</div>
              <Grid container spacing={2}>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <div className={job.jobSpan}>Minimum</div>
                  <input
                    type="number"
                    className="inputBox"
                    value={data.minSalary}
                    id="minSalary"
                    onChange={changeHandler}
                    onWheel={(e) => e.target.blur()}
                  />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <div className={job.jobSpan}>Maximum</div>
                  <input
                    type="number"
                    className="inputBox"
                    value={data.maxSalary}
                    id="maxSalary"
                    onChange={changeHandler}
                    onWheel={(e) => e.target.blur()}
                  />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                  <div className={job.jobSpan}>Rate</div>
                  <select className="inputBox" onChange={hourChangeHandler}>
                    <option
                      selected={data.rate == "per-month"}
                      value="per-month"
                    >
                      Per Month
                    </option>
                    <option selected={data.rate == "per-hour"} value="per-hour">
                      Per Hour
                    </option>
                  </select>
                </Grid>
              </Grid>
              <div className="input_error_msg" id="salary_error">
                Salary is required
              </div>
            </div>
            <Grid container spacing={2}>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <div>
                  <label className="inputLabel" htmlFor="experience">
                    Experience
                  </label>
                  <select
                    className="inputBox"
                    id="experience"
                    value={data.experience}
                    onChange={changeHandler}
                  >
                    <option>0-1 years</option>
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5-10 years</option>
                    <option>10+ years</option>
                  </select>
                  <div className="input_error_msg" id="experience_error">
                    experience is required
                  </div>
                </div>
                </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div>
                  <label className="inputLabel" htmlFor="openings">
                    No of Openings
                  </label>
                  <input
                    type="number"
                    className="inputBox"
                    id="openings"
                    value={data.openings}
                    onChange={changeHandler}
                    onWheel={(e) => e.target.blur()}
                  />
                  <div className="input_error_msg" id="openings_error">
                    Openings is required
                  </div>
                </div>
              </Grid>
              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <div>
                  <label className="inputLabel">Work Location</label>
                  <Wrapper
                    apiKey={
                      "https://maps.googleapis.com/maps/api/js?key=AIzaSyApOXpKSCrcudAr2BONFB4oYEjTi-VXFKQ&libraries=places"
                    }
                  >
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
                              placeholder: "Search Places ...",
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
                  </Wrapper>
                </div>
                <div className="input_error_msg" id="location_error">
                  Location is required
                </div>
              </Grid>
            </Grid>

            <div>
              <label className="inputLabel">Job Description</label>

              <Editor
                editorState={data.description}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                stripPastedStyles={true}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                  options: ["inline", "list", "history"],
                  inline:{
                    options: ["bold", "italic", "underline"]
                  },
                  list: {
                  options: ["unordered", "ordered"],
                  },
                  }}
              />
              <div className="input_error_msg" id="description_error">
                description is required
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div className={job.jobCancel} onClick={()=>Router.back()}>Cancel</div>

            <div className={job.saveJob} onClick={CreateJob}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateJob;
