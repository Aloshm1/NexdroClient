import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Head from "next/head";
import { Grid } from "@mui/material";
import blog from "../../styles/blog.module.css";
import parse from "html-react-parser";
import Link from "next/link";
import axios from "axios";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  const res = await fetch(`${domain}/api/event/eventDetails/${slug}`);
  const data = await res.json();
  const categoriesResponse = await fetch(
    `${domain}/api/category/getCategories`
  );
  const categories = await categoriesResponse.json();
  const trendingResponse = await fetch(`${domain}/api/event/getEventsTrending`);
  const trending = await trendingResponse.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/blog`);
  let metaDataObj = await metaData.json();
  return {
    props: {
      data: data,
      categories: categories,
      trending: trending,
      metaData: metaDataObj
    },
  };
}
function BlogsLanding({ data, blogs, categories, trending, metaData }) {
  const colors = [
    "#00a66c",
    "#fa0707",
    "#c7650a",
    "#0434d1",
    "#961187",
    "#3b1196",
    "#829611",
    "#119677",
    "#519611",
    "#963011",
  ];
  let [blogData, setBlogData] = useState(data);
  let [email, setEmail] = useState("");

  useEffect(() => {}, []);
  let changeBlog = (slug) => {
    document.getElementById("subscribe_error").style.display = "none";
    setEmail("");
    axios.get(`${domain}/api/event/eventDetails/${slug}`).then((res) => {
      setBlogData(res.data);
    });
  };
  let subscribe = () => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    if (!validateEmail(email)) {
      document.getElementById("subscribe_error").innerHTML = "Invalid Email Id";
      document.getElementById("subscribe_error").style.display = "block";
    } else {
      axios
        .post(`${domain}/api/newsletter/createNewsletter`, { emailId: email })
        .then((res) => {
          setEmail("");
          if (res.data === "successfull") {
            document.getElementById("subscribe_error").innerHTML =
              "Thanks for Subscribing";
            document.getElementById("subscribe_error").style.display = "block";
          } else {
            document.getElementById("subscribe_error").innerHTML =
              "Email Already subscribed";
            document.getElementById("subscribe_error").style.display = "block";
          }
        });
    }
  };
  return (
    <>
    {
      !data.title && <></>
    }
    {
      data.title && 
      <div style={{ paddingTop: "40px" }}>
      <Head>
        <title>{`Nexdro Event ${data.title}`}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={`${imageLink}/${data.image}`} />
      </Head>
      <Container className="Container" maxWidth = "xxl">
        <Grid container spacing={3}>
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
            <div>
              <img
                src={
                  blogData.image
                    ? `${imageLink}/${blogData.image}`
                    : "https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/Beautiful-High-Quality-Backgrounds-For-Desktopcc3e7c159087ffc8b36cca399aaaf6859c687e24c8f5012b49e7575db28ac20707dbebcff9aed9387b27ead272a0ccbbf99e2d57387365b739e42f520b086ea2.jpg"
                }
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
              <div className={blog.subTitle} style={{ color: "#2fbe46" }}>
                {blogData.title}
              </div>
              <p className={blogData.blogMainDesc}>
                {parse(String(blogData.description))}
              </p>
            </div>
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <div>
              <div className={blog.subscriptionBox}>
                <div className={blog.subscriptionHead}>
                  Subscribe info for latest Updates
                </div>
                <div className={blog.subscriptionLight}>
                  Subscribe o our newsletter and get benifits of getting updates
                  before hand
                </div>
                <input
                  type="text"
                  className="inputBox"
                  style={{ borderRadius: "25px" }}
                  placeholder="E-mail Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    document.getElementById("subscribe_error").style.display =
                      "none";
                  }}
                />
                <div className="input_error_msg" id="subscribe_error">
                  Password is required
                </div>
                <button className={blog.subscriptionBtn} onClick={subscribe}>
                  Subscribe
                </button>
              </div>
              {/* <div className={blog.subTitle}>Categories</div>
              <div
                      className="dayBadge"
                      style={{
                        backgroundColor: "#eee",
                      }}
                    >
                      Upcoming
                    </div>
              <div
                      className="dayBadge"
                      style={{
                        backgroundColor: "#eee",
                      }}
                    >
                      Present
                    </div>
              <div
                      className="dayBadge"
                      style={{
                        backgroundColor: "#eee",
                      }}
                    >
                      Past
                    </div> */}
              
              <div className={blog.subTitle}>Trending</div>
              {trending.map((item, i) => {
                return (
                  <Link href={`/event/${item.slug}`} key={i}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <div onClick={() => changeBlog(item.slug)}>
                        <img
                          src={
                            item.image
                              ? `${imageLink}/${item.image}`
                              : "https://dn-nexevo-original-files.s3.ap-south-1.amazonaws.com/Beautiful-High-Quality-Backgrounds-For-Desktopcc3e7c159087ffc8b36cca399aaaf6859c687e24c8f5012b49e7575db28ac20707dbebcff9aed9387b27ead272a0ccbbf99e2d57387365b739e42f520b086ea2.jpg"
                          }
                          style={{
                            width: "100px",
                            height: "65px",
                            borderRadius: "10px",
                            marginRight: " 20px",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                      <div>
                        <div
                          className={blog.blogCategory}
                          style={{ color: "#000", marginBottom: "5px" }}
                        >
                          {item.title}
                        </div>
                        <div
                          className={blog.blogDesc}
                          style={{ color: "#000", margin: "0px" }}
                        >
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
    }
   
    </>
  );
}

export default BlogsLanding;
