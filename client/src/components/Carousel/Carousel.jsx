import React, { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ children }) => {
  const settings = useMemo(() => {
    return {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  }, []);

  return <Slider {...settings}>{children}</Slider>;
};

export default Carousel;
