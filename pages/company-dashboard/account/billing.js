import React, { useState, useEffect } from "react";
import PilotAccount from "../../../components/layouts/PilotAccount";
import DashCss from "../../../styles/DashboardSidebar.module.css";
import Grid from "@mui/material/Grid";
import axios from "axios";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Alert from "@mui/material/Alert";
import CompanyAccount from "../../../components/layouts/CompanyAccount";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function Billing() {
  let [edit, setEdit] = useState(false);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/company/getCompanyAddress`, config).then((res) => {
      console.log(res.data);
      setData({
        ...data,
        line1: res.data.line1 ? res.data.line1 : "",
        line2: res.data.line2 ? res.data.line2 : "",
        postalCode: res.data.pin_code ? Number(res.data.pin_code) : "",
        city: res.data.city ? res.data.city : "",
        state: res.data.state ? res.data.state : "",
        country: res.data.country ? res.data.country : "",
      });
    });
  }, []);
  let [data, setData] = useState({
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
  });
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  let saveDetails = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    var focusField = "";
    var error = false;
    let fields = ["line1", "line2", "postalCode", "city", "state"];
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
    if (
      data.line1 !== "" &&
      (data.line1.length < 3 || data.line1.length > 100)
    ) {
      document.getElementById("line1_error").innerHTML =
        "Characters between 3-100";
      document.getElementById("line1_error").style.display = "block";
      focusField = "line1";
    }
    if (
      data.line2 !== "" &&
      (data.line2.length < 3 || data.line2.length > 100)
    ) {
      document.getElementById("line2_error").innerHTML =
        "Characters between 3-100";
      document.getElementById("line2_error").style.display = "block";
      focusField = "line2";
    }
    if (
      data.postalCode !== "" &&
      (data.postalCode < 0 || data.postalCode.length >10)
    ) {
      document.getElementById("postalCode_error").innerHTML =
        "Postal Address should be maximum of 10 numbers";
      document.getElementById("postalCode_error").style.display = "block";
      focusField = "postalCode";
    }
    if (
      data.state !== "" &&
      (data.state.length < 3 || data.state.length > 100)
    ) {
      document.getElementById("state_error").innerHTML =
        "Characters between 3-100";
      document.getElementById("state_error").style.display = "block";
      focusField = "state";
    }
    if (data.city !== "" && (data.city.length < 3 || data.city.length > 100)) {
      document.getElementById("city_error").innerHTML =
        "Characters between 3-100";
      document.getElementById("city_error").style.display = "block";
      focusField = "city";
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      let submitData = {
        line1: data.line1,
        line2: data.line2,
        pin_code: data.postalCode,
        city: data.city,
        state: data.state,
      };

      axios
        .post(`${domain}/api/company/updateCompanyAddress`, submitData, config)
        .then((res) => {
          setEdit(false);
          document.getElementById("alert").style.display = "block";
          axios.post(`${domain}/api/company/getCompanyAddress`, config).then((res) => {
            console.log(res.data);
            setData({
              ...data,
              line1: res.data.line1 ? res.data.line1 : "",
              line2: res.data.line2 ? res.data.line2 : "",
              postalCode: res.data.pin_code ? Number(res.data.pin_code) : "",
              city: res.data.city ? res.data.city : "",
              state: res.data.state ? res.data.state : "",
              country: res.data.country ? res.data.country : "",
            });
          });
        });
    }
    setTimeout(() => {
      if (document.getElementById("alert")) {
        document.getElementById("alert").style.display = "none";
      }
    }, 4000);
  };
  return (
    <div>
      <div
        style={{ marginBottom: "14px", display: "none", width: "100%" }}
        id="alert"
      >
        <Alert severity="success">Billing Address successfully updated!</Alert>
      </div>
      <div className={DashCss.billAddress}>
        Billing Address
        <button style={{display:"inline"}} className={DashCss.editIcon} onClick={() => setEdit(true)}>
          {edit ? "" : <EditRoundedIcon sx = {{width: {xs:"20px", sm: "25px"}, height: {xs:"20px", sm: "25px"}}}/>}
        </button>
      </div>
      <Grid container columnSpacing={2} rowSpacing={0}>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="line1">
              Address Line 1
            </label>
          </div>
          <div>
            <input
              type="text"
              id="line1"
              className="inputBox"
              value={data.line1}
              onChange={changeHandler}
              disabled={!edit}
            />
            <div className="input_error_msg" id="line1_error">
              Line1 is required
            </div>
          </div>
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="line2">
              Address Line 2
            </label>
          </div>
          <div>
            <input
              type="text"
              id="line2"
              className="inputBox"
              value={data.line2}
              onChange={changeHandler}
              disabled={!edit}
            />
            <div className="input_error_msg" id="line2_error">
              Line2 is required
            </div>
          </div>
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="postalCode">
              Postal Code
            </label>
          </div>
          <div>
            <input
              type="number"
              id="postalCode"
              className="inputBox"
              value={data.postalCode}
              onChange={changeHandler}
              disabled={!edit}
              onWheel={(e) => e.target.blur()}
            />
            <div className="input_error_msg" id="postalCode_error">
              PostalCode is required
            </div>
          </div>
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="city">
              City
            </label>
          </div>
          <div>
            <input
              type="text"
              id="city"
              className="inputBox"
              value={data.city}
              onChange={changeHandler}
              disabled={!edit}
            />
            <div className="input_error_msg" id="city_error">
              City is required
            </div>
          </div>
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="state">
              State
            </label>
          </div>
          <div>
            <input
              type="text"
              id="state"
              className="inputBox"
              value={data.state}
              onChange={changeHandler}
              disabled={!edit}
            />
            <div className="input_error_msg" id="state_error">
              State is required
            </div>
          </div>
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}>
          <div>
            <label className="inputLabel" htmlFor="country">
              Country
            </label>
          </div>
          <div style={{ opacity: 0.5 }}>
            <input
              type="text"
              id="country"
              className="inputBox"
              value={data.country}
              disabled
              onChange={changeHandler}
            />
          </div>
        </Grid>
      </Grid>
      {edit ? (
        <button className={DashCss.AddSave} onClick={saveDetails}>
          Save Changes
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
Billing.Layout = CompanyAccount;
export default Billing;
