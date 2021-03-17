import React from "react";
import Slider from "react-slick";
import styles from "../styles/modalMap.module.css";
import CancelIcon from "@material-ui/icons/Cancel";

const ModalSlider = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
  };
  return (
    <>
      <div
        className={`html modal__slider__wrapper ${
          props.isOpened ? "open" : "close"
        }` }
        style={{ ...props.style }}
      >
        <div className={styles.modal__body} onClick={(e) => e.stopPropagation}>
          <div className={styles.modal__close} onClick={props.onModalClose}>
            <CancelIcon style={{ fontSize: 40 }}></CancelIcon>
          </div>
          <div className={styles.modal__slider__container}>
            <Slider {...settings} className={styles.modal__slider__attraction}>
              {props.attractions?props.attractions.map((attraction, index) => {
                return (
                  <li key={index}>
                    <img
                      className={styles.modal__slider__img}
                      src={attraction.imageUrl}
                      alt={attraction.imageUrl}
                    />
                  </li>
                );
              }):null}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};
export default ModalSlider;
