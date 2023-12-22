import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Head from "next/head";
import { Alert, Button, Grid } from "@mui/material";
import blog from "../../styles/blog.module.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import Link from "next/link";
import Router, { useRouter } from "next/router";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const response = await fetch(`${domain}/api/category/getOneCategory/${slug}`);
  const data = await response.json();
  const blogsResponse = await fetch(
    `${domain}/api/blog/getBlogs/${data.category}?page=1`
  );
  const blogs = await blogsResponse.json();
  const categoriesResponse = await fetch(
    `${domain}/api/category/getCategories`
  );
  const categories = await categoriesResponse.json();
  const trendingResponse = await fetch(`${domain}/api/blog/getBlogsTrending`);
  const trending = await trendingResponse.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/blogs`);
  let metaDataObj = await metaData.json();
  return {
    props: {
      metaData: data,
      blogs: blogs,
      categories: categories,
      trending: trending,
      slugParam: slug,
      metaData: metaDataObj,
    },
  };
}
function BlogsListing({ metaData, blogs, categories, trending, slugParam }) {
  const router = useRouter();
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
  let [data, setData] = useState(blogs.results);
  const [page, setPage] = useState(blogs.next ? blogs.next.page : 2);
  const [nextPage, setNextPage] = useState(blogs.next ? true : false);
  const [slugState, setSlugState] = useState(slugParam);
  let [email, setEmail] = useState("");
  useEffect(() => {
    console.log(slugParam)
    console.log(categories)
    setData(blogs.results)
    setPage(blogs.next ? blogs.next.page : 2)
    document.getElementById("subscribe_error").style.display = "none"
    setEmail("")
  }, [router.asPath]);
  let changeCategory = (slug) => {
    document.getElementById("subscribe_error").style.display = "none"
    setEmail("")
    axios.get(`${domain}/api/category/getOneCategory/${slug}`).then((res) => {
      setSlugState(slug);
      console.log(res);
      axios
        .get(`${domain}/api/blog/getBlogs/${res.data.category}?page=1`)
        .then((res) => {
          setData(res.data.results);
          if (res.data.next) {
            setNextPage(true);
            setPage(res.data.next.page);
          } else {
            setNextPage(false);
          }
        });
    });
  };
  let loadMore = () => {
    axios
      .get(`${domain}/api/category/getOneCategory/${slugState}`)
      .then((res) => {
        console.log(res);
        axios
          .get(`${domain}/api/blog/getBlogs/${res.data.category}?page=${page}`)
          .then((res) => {
            console.log(res.data.results);
            setData([...data, ...res.data.results]);
            if (res.data.next) {
              console.log(res.data);
              setNextPage(true);
              setPage(res.data.next.page);
            } else {
              setNextPage(false);
            }
          });
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
    <div>
      <Head>
        <title>{metaData.title}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="Container">
        <div
          className="pageTitle"
          style={{
            textAlign: "center",
            paddingTop: "40px",
            marginBottom: "40px",
          }}
        >
          Our Blogs
        </div>
        {data.length == 0 ? (
                 <Alert severity="info" sx={{width:"100%"}}>No Blogs available on this category</Alert>
              ) : (
                <></>
              )}
        <Grid container spacing={3}>
          
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
          
            <Grid container spacing={3}>
              
              {data &&
                data.map((item, i) => {
                  return (
                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} key={i}>
                      <Link href={`/blog/${item.slug}`}>
                        <div
                          style={{
                            backgroundColor:
                              colors[i%colors.length],
                            borderRadius: "15px",
                            cursor: "pointer",
                          }}
                        >
                          <div>
                            <img
                              src={
                                item.image
                                  ? `${imageLink}/${item.image}`
                                  : ""
                              }
                              alt="wvrver"
                              className={blog.blogImage}
                            />
                          </div>
                          <div style={{padding: "30px" }}>
                            <div className={blog.blogCategory}>
                              {item.category}
                            </div>
                            <div className={blog.blogDesc}>{item.title}</div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "left",
                                color: "white",
                              }}
                            >
                              <CalendarMonthIcon />
                              <span style={{ margin: "0px 15px 0px 5px" }}>
                                {item.createdAt && item.createdAt.slice(0, 10)}
                              </span>{" "}
                              <LocationOnIcon />
                              <span style={{ margin: "0px 0px 0px 5px" }}>
                                {item.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Grid>
                  );
                })}
            </Grid>
            <div style={{ textAlign: "center", color: "#9f9f9f" }}>
              {nextPage ? (
                <Button className="formBtn" onClick={loadMore}>
                  Load more
                </Button>
              ) : data.length > 1 ? (
                "No more data"
              ) : (
                ""
              )}
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
              <div className={blog.subTitle}>Categories</div>
              <Link href={`/blogs`}>
                    <div
                      className="dayBadge"
                      style={{
                        backgroundColor: "#eee",
                      }}
                    >
                      All Blogs
                    </div>
                  </Link>
              {categories.map((item, i) => {
                return (
                  <Link href={`/blogs/${item.slug}`} key={i}>
                    <div
                      className="dayBadge"
                      style={{
                        backgroundColor:
                          slugParam == item.slug
                            ? "#4ffea3"
                            : "#eee",
                      }}
                      onClick={() => changeCategory(item.slug)}
                    >
                      {item.category}
                    </div>
                  </Link>
                );
              })}
              <div className={blog.subTitle}>Trending</div>
              {trending.map((item, i) => {
                return (
                  <Link href={`/blog/${item.slug}`} key={i}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <div>
                        <img
                          src={
                            item.image
                              ? `${imageLink}/${item.image}`
                              : ""
                          }
                          style={{
                            width: "100px",
                            height: "65px",
                            borderRadius: "10px",
                            marginRight: " 20px",
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div>
                        <div
                          className={blog.blogCategory}
                          style={{ color: "#000", marginBottom: "5px" }}
                        >
                          {item.category}
                        </div>
                        <div
                          className={blog.blogDesc}
                          style={{ color: "#000", margin: "0px" }}
                        >
                          {item.title}
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
  );
}

export default BlogsListing;
