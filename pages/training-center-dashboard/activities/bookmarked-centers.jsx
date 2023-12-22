import TrainingCenterActivities from "../../../components/layouts/TrainingCenterActivities";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import DashCss from "../../../styles/pilotDashboard.module.css";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import axios from "axios";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Router, {useRouter} from "next/router";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
function BookmarkedCenters() {
  let [data, setData] = useState([]);
  const router = useRouter()
  useEffect(()=>{
    if (localStorage.getItem("role") != "training_center"){
      router.replace("/404")
    }
  })
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/user/getUserDataBookmarks`, config).then((res) => {
      setData(res.data);
    });
  }, []);
  let removeBookMark = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/center/unsaveCenter/${id}`, config)
      .then((res) => {
        axios
          .get(`${domain}/api/user/getUserDataBookmarks`, config)
          .then((res) => {
            setData(res.data);
          });
      });
  };
  return (
    <div>
      {data.length == 0 ? (
        <>
          <div className={DashCss.HideTitle}>
            <Alert severity="info">
              No Bookmarks yet.{" "}
              <span style={{ textDecoration: "underline" }}>
                <Link href="/service-center">Go to</Link>
              </span>{" "}
              service center directory
            </Alert>
          </div>
        </>
      ) : (
        <Grid container spacing={2}>
          {data.map((item, i) => {
            return (
              <Grid item xl = {4} sm={6} xs={12} key={i}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e5e5e5",
                    height: "100%",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={`${imageLink}/${item.coverPic}`}
                      style={{
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "10px 10px 0px 0px",
                      }}
                      data-src=""
                      loading="lazy"
                    />
                    <Link href={`/service-center/${item.slug}`}>
                      <a className={DashCss.profileImgContainer}>
                        <img
                          src={`${imageLink}/80x80/${item.profilePic}`}
                          className={DashCss.profileImg}
                          data-src=""
                          loading="lazy"
                        />
                      </a>
                    </Link>
                    <div
                      style={{
                        display: "flex",
                        position: "absolute",
                        right: "0px",
                        top: "0px",
                        backgroundColor: "#ffffff80",
                        padding: "8px",
                        borderRadius: "0px 0px 0px 10px",
                      }}
                    >
                      {item.rating >= 1 ? (
                        <StarRoundedIcon sx={{ color: "gold" }} />
                      ) : (
                        <StarBorderRoundedIcon />
                      )}
                      {item.rating >= 2 ? (
                        <StarRoundedIcon sx={{ color: "gold" }} />
                      ) : (
                        <StarBorderRoundedIcon />
                      )}
                      {item.rating >= 3 ? (
                        <StarRoundedIcon sx={{ color: "gold" }} />
                      ) : (
                        <StarBorderRoundedIcon />
                      )}
                      {item.rating >= 4 ? (
                        <StarRoundedIcon sx={{ color: "gold" }} />
                      ) : (
                        <StarBorderRoundedIcon />
                      )}
                      {item.rating >= 5 ? (
                        <StarRoundedIcon sx={{ color: "gold" }} />
                      ) : (
                        <StarBorderRoundedIcon />
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "30px 20px 20px 20px" }}>
                    <Link href={`/service-center/${item.slug}`}>
                      <a>
                        <button className="scName">{item.centerName}</button>
                      </a>
                    </Link>
                    <Grid container columnSpacing={1} rowSpacing={0}>
                      <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                        <div className="scTitle">Working Time :</div>
                        <div className="scDesc"> {item.workingHours}</div>
                      </Grid>
                      <Grid item xl={7} lg={7} md={7} sm={12} xs={12}>
                        <div className="scTitle">Location :</div>
                        <div className="scDesc">
                          {" "}
                          {item.address ? item.address.split(",")[0] : ""}
                          {item.address
                            ? item.address.split(",")[1]
                              ? "," + item.address.split(",")[1]
                              : ""
                            : ""}
                        </div>
                      </Grid>
                   
                      <Grid
                        item
                        xl={12}
                        lg={12}
                        md={6}
                        sm={12}
                        xs={12}
                      >
                        <div className="scTitle">Brands :</div>
                        <div
                          className="scDesc"
                          style={{ display: "inline-block" }}
                        >
                          {" "}
                          {item.brandOfDrones
                            .slice(0, 3)
                            .map((brand, index) => {
                              return (
                                <div
                                  className="service_center_brand_list"
                                  key={index}
                                  style={{ display: "inline-block" }}
                                >
                                  {brand}
                                  {index + 1 <
                                    item.brandOfDrones.slice(0, 4).length &&
                                    ","}{" "}
                                  &nbsp;{" "}
                                </div>
                              );
                            })}{" "}
                          {item.brandOfDrones.length > 4 && `. . .`}
                        </div>
                      </Grid>
                    </Grid>
                    
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
}
BookmarkedCenters.Layout = TrainingCenterActivities;
export default BookmarkedCenters;
