import React from "react";
import Carousel from "react-material-ui-carousel";
import HorizontalRuleRoundedIcon from "@mui/icons-material/HorizontalRuleRounded";
import { textOne, textTwo } from "../../appData/appData";
import firstImage from "../../assets/images/firstImage.jpg";
import secondImage from "../../assets/images/secondImage.jpg";
import { Paper } from "@mui/material";

type itemProps = {
  src: string;
  description: any;
};

const Item = (props: itemProps) => {
  const { src, description } = props;
  return (
    <Paper sx={{ backgroundColor: "#000000", position: "relative" }}>
      <img src={src} className="login-form-carousel-image-size" alt="" />
      <div className="carousel-text">
        <p
          style={{
            color: "white",
            fontFamily: "Suisse Intl",
            fontSize: "28px",
            width: "82%",
          }}
        >
          {description}
        </p>
      </div>
    </Paper>
  );
};

const FormCarousel = () => {
  return (
    <Carousel
      sx={{
        height: "100vh",
        position: "relative",
      }}
      IndicatorIcon={
        <HorizontalRuleRoundedIcon
          sx={{
            width: "40px",
            height: "60px",
          }}
        />
      }
      indicatorIconButtonProps={{
        style: {
          fontSize: "50px",
          fontWeight: "bold",
          color: "#808080",
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "#0b694c",
          width: "60px",
        },
      }}
      indicatorContainerProps={{
        style: {
          textAlign: "left",
          marginLeft: "30px",
          position: "absolute",
          top: "90%",
          zIndex: 999,
        },
      }}
    >
      <Item  src={firstImage} description={textOne} />
      <Item src={secondImage} description={textTwo} />
    </Carousel>
  );
};

export default FormCarousel;
