import Grid from "@mui/material/Grid"; // Grid version 1
import * as React from "react";
import Alert from '@mui/material/Alert';

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import styles from "../../../styles/pol.module.css";
import { Step } from '@mui/material';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
import { useState } from "react";
import { convertLength } from "@mui/material/styles/cssUtils";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const nextDomain = process.env.NEXT_PUBLIC_BASE_URL;

// const images = [
//   {
//     label: "San Francisco – Oakland Bay Bridge, United States",
//     imgPath:
//       "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
//   },
//   {
//     label: "Bird",
//     imgPath:
//       "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
//   },
//   {
//     label: "Bali, Indonesia",
//     imgPath:
//       "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250",
//   },
//   {
//     label: "Goč, Serbia",
//     imgPath:
//       "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
//   },
//   {
//     label: "Goč, Serbia",
//     imgPath:
//       "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
//   },
//   {
//     label: "Goč, Serbia",
//     imgPath:
//       "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
//   },
// ];

export async function getServerSideProps(context){
  const { params } = context;
  const { username } = params;
  const res = await fetch(`${domain}/api/pilot/pilotDetails/${username}`);
  const data = await res.json();

  //following
  const followersData = await fetch(
    `${domain}/api/follow/getUserFollowers/${username}`
  );
  const followers = await followersData.json();
  const followingData = await fetch(
    `${domain}/api/follow/getUserFollowing/${username}`
  );
  const following = await followingData.json();
  const all = await fetch(`${domain}/api/pilot/getPilotMedia/${username}`);
  const allImages = await all.json();
  const im = await fetch(`${domain}/api/image/getUserImagesOnly/${username}`);
  const images = await im.json();
  const three = await fetch(`${domain}/api/image/getUser3dOnly/${username}`);
  const threed = await three.json();
  const video = await fetch(
    `${domain}/api/image/getUserVideosOnly/${username}`
  );
  const videos = await video.json();
  return{
    props:{
      data:data,
      followers,
      following,
      allImages,
      images,
      threed,
      videos

    }
  }
}
const newone = ({data, followers,following,allImages,images,threed,videos}) => {
  console.log(data,"oi")
  console.log(followers,'ko')
  console.log(images,'img')
  const [tab, setTab] = useState("images");
  let [myAllImages, setMyAllImages] = useState([]);
  let [myOnlyImages, setMyOnlyImages] = useState(images);
  let [myOnly3d, setMyonly3d] = useState(threed);
  let [myOnlyVideos, setMyOnlyVideos] = useState(videos);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const handleImageClick=(index)=>{
    console.log(index,'opoo')
   setActiveStep(index)
  }
  return (
    <>
      <Container sx={{ marginTop: "60px" }}>
        <div className={styles.main_container}>
          <div className={styles.image_container}>
            <div>
              {/* <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        
      </Paper>  */}
               <AutoPlaySwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                onChangeIndex={()=>handleStepChange(activeStep)}
                enableMouseEvents
              >
                
                <Box
                  component="img"
                  sx={{
                    height: 149,
                    display: "block",
                    maxWidth: 400,
                    overflow: "hidden",
                    width: 149,
                    borderRadius: 20,
                  }}
                  src={images[0].imgPath}
                  alt={""}
                />
              </AutoPlaySwipeableViews>
              <MobileStepper
              className="MuiMobileStepper-dotActive"
                sx={{ justifyContent:'center', marginTop:'16px'}}
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                
              
              />
            </div>
            
           
            <div className={styles.bio_container}>
              <h2 className={styles.name_c}>{data.userName}</h2>
              <div className={styles.loc_container}>
                <LocationOnIcon sx={{ width: "19px", height: "19px" }} />{" "}
                <p style={{ margin: 0 }} className={styles.loc_p}>
                  {data.state},{data.country}({data.workType})
                </p>
              </div>

              <div className={styles.btn_container}>
                <Button
                  sx={{
                    border: "1px solid #12E4B2",
                    borderRadius: "100px",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    lineHeight: "19px",
                    color: "#303F4B",
                    padding: "9px  17px 8px 18px ",
                    fontSize: "16px",
                    textAlign: "left",
                    opacity: 1,
                    width: "fit-content",
                    textTransform: "inherit",
                  }}
                >
                  Hire Me
                </Button>

                <Button
                  sx={{
                    fontFamily: "roboto",
                    fontWeight: "bold",
                    lineHeight: "19px",
                    color: "#303F4B",
                    padding: "9px  17px 8px 18px ",
                    fontSize: "16px",
                    textAlign: "left",
                    opacity: 1,
                    width: "fit-content",
                    textTransform: "inherit",
                    marginLeft: "2px",
                  }}
                >
                  Follow
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.fan_container}>
            <div className={styles.fan_me_container}>
              <p className={styles.fan_para}>Fans of me</p>
              <h2 className={styles.fan_h}>{following.length}</h2>
            </div>
            <div className={styles.fan_me_container}>
              <p className={styles.fan_para}>Fans of mine</p>
              <h2 className={styles.fan_h}>{followers.length}</h2>
            </div>
          </div>
        </div>

        <div className={styles.view_selector}>
          <Button
            onClick={() => setTab("images")}
            className={
              tab == "images" ? styles.feed_option_select : styles.feed_option
            }
          >
            Images
          </Button>
          <Button
            onClick={() => setTab("videos")}
            className={
              tab == "videos" ? styles.feed_option_select : styles.feed_option
            }
          >
            Video
          </Button>
          <Button
            onClick={() => setTab("about")}
            className={
              tab == "about" ? styles.feed_option_select : styles.feed_option
            }
            sx={{ marginRight: 0 }}
          >
            About
          </Button>
        </div>
        {/* {tab==='images' ? (
          <>
          {images.length ==0 ?(
            <Alert severity='info' id='noDataAlert'>
              Pilot has not posted any images
            </Alert>
          ):(
            <>
             <Grid
          container
          spacing={2.8}
          sx={{ marginTop: "0px", marginBottom: "60px" }}
        >
          {myOnlyImages.map((item, i) => (
            <Grid
            key={i}
              sx={{ height: { xs: "200px", sm: "340px" } }}
              item
              xs={6}
              md={4}
              lg={i % 3 === 0 ? 6 : 3}
              
            >
              <img
                className={styles.img_pilot_land}
                src={item.imgPath}
                alt={item}
              />
            </Grid>
          ))}
        </Grid>
        </>
          )
          }
          </>

          ):(
            <>
            
            </>
          )
            
          
  
        }
        */}
      </Container>
    </>
  );
};
export default newone;
