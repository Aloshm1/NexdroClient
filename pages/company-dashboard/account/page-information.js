import { Alert, Grid } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CompanyAccount from "../../../components/layouts/CompanyAccount";
import css from "../../../styles/company.module.css";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
function PageInfo() {
  let [slug, setSlug] = useState("");
  let [edit, setEdit] = useState(false);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/company/getCompanyDetails`, config).then((res) => {
      setData({
        tagline: res.data.tagline,
        foundingYear: res.data.foundingYear,
        companySize: res.data.companySize,
        website: res.data.website,
        city: res.data.location,
        summary: res.data.summary,
      });
      setSlug(res.data.slug);
      if (localStorage.getItem("profileCreated")) {
        document.getElementById("successalert").style.display = "flex";
        setEdit(true);
        localStorage.removeItem("profileCreated")
      }
    });
  }, []);
  let [data, setData] = useState({
    tagline: "",
    foundingYear: "",
    companySize: "0-1 Employees",
    website: "",
    city: "",
    summary: "",
  });
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let submit = () => {
    const validateWebsite = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        );
    };
    var focusField = "";

    if (
      data.tagline &&
      (data.tagline.length < 3 || data.tagline.length > 100)
    ) {
      document.getElementById("tagline_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("tagline_error").style.display = "block";
      if (focusField == "") {
        focusField = "tagline";
      }
    }
    if (
      data.foundingYear !== "" &&
      (Number(data.foundingYear) < 1900 || Number(data.foundingYear) > 2022)
    ) {
      document.getElementById("foundingYear_error").innerHTML =
        "Invalid Founding Year";
      document.getElementById("foundingYear_error").style.display = "block";
      if (focusField == "") {
        focusField = "foundingYear";
      }
    }
    if (
      data.website &&
      (!validateWebsite(data.website) || data.website.length > 100)
    ) {
      document.getElementById("website_error").innerHTML = "Invalid Website";
      document.getElementById("website_error").style.display = "block";
      if (focusField == "") {
        focusField = "website";
      }
    }
    if (data.city && (data.city.length < 3 || data.city > 100)) {
      document.getElementById("city_error").innerHTML =
        "Characters should be between 3 - 100";
      document.getElementById("city_error").style.display = "block";
      if (focusField == "") {
        focusField = "city";
      }
    }
    if (
      data.summary &&
      (data.summary.length < 100 || data.summary.length > 1500)
    ) {
      document.getElementById("summary_error").innerHTML =
        "Characters should be between 100 - 1500";
      document.getElementById("summary_error").style.display = "block";
      if (focusField == "") {
        focusField = "summary";
      }
    }

    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };

      axios
        .post(
          `${domain}/api/company/updateCompanyDetails`,
          {
            tagline: data.tagline,
            foundingYear: data.foundingYear,
            companySize: data.companySize,
            website: data.website,
            location: data.city,
            summary: data.summary,
          },
          config
        )
        .then((res) => {
          console.log(res);
          setEdit(false);
          document.getElementById("alert").style.display = "flex";
          window.scrollTo(0, 0);
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 3000);
        });
    }
  };
  return (
    <div>
      <Alert severity="success" style={{ display: "none" }} id="alert">
        Your company profile has been successfully updated.
      </Alert>
      <Alert
        severity="success"
        style={{ display: "none", marginBottom: "10px" }}
        id="successalert"
      >
        Your dashboard has been successfully setup!! Thank you for completing.
        Create job using this{" "}
        <Link href="/job/create">
          <a className="link">link</a>
        </Link>
      </Alert>
      {!edit && (
        <div className={css.edit} onClick={() => setEdit(true)}>
          Edit
        </div>
      )}
      <div className={css.pageInfo}>Company Information:</div>

      <div style = {{textAlign: "right"}}>
        <Link href={`/company/${slug}`}>
          <a className={css.viewProfile}>View Profile</a>
        </Link>
      </div>
      <Grid container columnSpacing={2}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <label className="inputLabel">Company Tagline</label>
          <div>
            <input
              className="inputBox"
              type="text"
              value={data.tagline}
              onChange={changeHandler}
              id="tagline"
              disabled={!edit}
            />
            <div className="input_error_msg" id="tagline_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <label className="inputLabel">Founded Year</label>
          <div>
            <input
              className="inputBox"
              type="number"
              value={data.foundingYear}
              onChange={changeHandler}
              id="foundingYear"
              disabled={!edit}
              onWheel={(e) => e.target.blur()}
            />
            <div className="input_error_msg" id="foundingYear_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <label className="inputLabel">Company Size</label>
          <div>
            <select
              className="inputBox"
              value={data.companySize}
              onChange={changeHandler}
              id="companySize"
              disabled={!edit}
            >
              <option value="0-1 Employees">0-1 Employees</option>
              <option value="2-10 Employees">2-10 Employees</option>
              <option value="11-50 Employees">11-50 Employees</option>
              <option value="51-200 Employees">51-200 Employees</option>
              <option value="201-500 Employees">201-500 Employees</option>

              <option value="500+ Employees">500+ Employees</option>
            </select>
            <div className="input_error_msg" id="companySize_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <label className="inputLabel">Website</label>
          <div>
            <input
              className="inputBox"
              type="text"
              value={data.website}
              onChange={changeHandler}
              id="website"
              disabled={!edit}
            />
            <div className="input_error_msg" id="website_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
        <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
          <label className="inputLabel">City</label>
          <div>
            <input
              className="inputBox"
              type="text"
              value={data.city}
              onChange={changeHandler}
              id="city"
              disabled={!edit}
            />
            <div className="input_error_msg" id="city_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <label className="inputLabel">Summary</label>
          <div>
            <textarea
              className="inputBox"
              type="number"
              style={{ resize: "none", height: "100px", paddingTop: "10px" }}
              value={data.summary}
              onChange={changeHandler}
              id="summary"
              disabled={!edit}
              onWheel={(e) => e.target.blur()}
            />
            <div className="input_error_msg" id="summary_error">
              CompanyName is required
            </div>
          </div>
        </Grid>
      </Grid>
      {edit && (
        <div className={css.save} onClick={submit}>
          Save Changes
        </div>
      )}
    </div>
  );
}
PageInfo.Layout = CompanyAccount;
export default PageInfo;
