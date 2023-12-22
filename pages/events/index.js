import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import Head from "next/head";
import { Button, Grid } from "@mui/material";
import blog from "../../styles/blog.module.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import Link from "next/link";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

export async function getServerSideProps(context) {
  const response = await fetch(
    `${domain}/api/category/getOneCategory/ecommerce-in-drone`
  );
  const data = await response.json();
  const blogsResponse = await fetch(`${domain}/api/event/getAllEvents?page=1`);
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
      slugParam: "ecommerce-in-drone",
      metaData: metaDataObj,
    },
  };
}
function BlogsListing({ metaData, blogs, categories, trending, slugParam }) {
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
  useEffect(() => {}, []);
  let changeCategory = (slug) => {
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
    axios.get(`${domain}/api/blog/getAllEvents?page=${page}`).then((res) => {
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
      <Container className="Container" style={{ marginBottom: "40px" }} maxWidth = "xxl">
        <div className="pageTitle blogPageTitle">Our Events</div>
        {data.length == 0 ? (
          <div className="HideTitle">No Events available</div>
        ) : (
          <></>
        )}
        <Grid container spacing={3}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={3}>
              {data &&
                data.map((item, i) => {
                  return (
                    <>
                      <Grid item xl={3} lg={4} md={6} sm={6} xs={12} key={i}>
                        <Link href={`/event/${item.slug}`}>
                          <div
                            style={{
                              backgroundColor: colors[i % colors.length],
                              borderRadius: "15px",
                              cursor: "pointer",
                              height: "100%",
                            }}
                          >
                            <div>
                              <img
                                src={`${imageLink}/${item.image}`}
                                alt="wvrver"
                                className={blog.blogImage}
                                style={{ backgroundColor: "#e5e5e5" }}
                              />
                            </div>
                            <div style={{ height: "100%", padding: "30px" }}>
                              <div className={blog.blogCategory}>
                                {item.title}
                              </div>
                              <div className={blog.blogDesc}>
                                {item.category}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "left",
                                  color: "white",
                                }}
                              >
                                <CalendarMonthIcon />
                                <span style={{ margin: "0px 15px 0px 5px" }}>
                                  {item.createdAt &&
                                    item.createdAt.slice(0, 10)}
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
                    </>
                  );
                })}
            </Grid>
            <div style={{ textAlign: "center", color: "#9f9f9f" }}>
              {nextPage ? (
                <Button className="formBtn" onClick={loadMore}>
                  Load more
                </Button>
              ) : (
                ""
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default BlogsListing;
