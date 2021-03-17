import axios from "axios";
import styles from "../styles/Country_id.module.css";
import Link from "next/link";
import React from "react";
import mapboxgl from "mapbox-gl";
import Rating from "react-rating";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  A11y,
  EffectCube,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper";
import YouTube from "react-youtube";
import { connect } from "react-redux";
import { withRouter } from "next/router";
import { fetchAll } from "../store/actions";
import ModalMap from "../components/ModalMap";
import ModalSlider from "../components/ModalSlider";
import HomeIcon from "@material-ui/icons/Home";
import ZoomOutMapIcon from "@material-ui/icons/ZoomOutMap";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, EffectCube]);

class SingleCountry extends React.Component {
  state = {
    id: null,
    capitalImg: [],
    capital_description: [],
    capital: [],
    capitalData: [],
    currency: null,
    attractions: [],
    rating: [],
    videoUrl: null,
    isAuth: false,
    rates: {},
    date: null,
    offset: null,
    temp: null,
    wind: null,
    currencyTitle: null,
    courseTitle: null,
    dateTitle: null,
    weatherTitle: null,
    modalMap: false,
    modalSlider: false,
    lon: null,
    lat: null,
  };

  getData = () => {
    const id = this.props.router.query.id;
    const city = this.props.countries.find((el) => el.capital_alias === id);

    if (localStorage.getItem("lang") === "ru") {
      this.setState({
        currencyTitle: "Валюта страны: ",
        courseTitle: "Курсы валют: ",
        dateTitle: "Местное время:",
        weatherTitle: "Текущая погода:",
      });
    } else if (localStorage.getItem("lang") === "en") {
      this.setState({
        currencyTitle: "Country currency: ",
        courseTitle: "Exchange rates: ",
        dateTitle: "Local time:",
        weatherTitle: "Current weather:",
      });
    } else {
      this.setState({
        currencyTitle: "Landeswährung: ",
        courseTitle: "Wechselkurse: ",
        dateTitle: "Die ortszeit:",
        weatherTitle: "Aktuelles wetter: ",
      });
    }

    this.setState({
      id,
      currency: city.local_currency,
      attractions: city.attractions,
      rating: city.rating,
      capitalImg: city.capitalImageUrl,
      capital_description: city.capital_description,
      capital: city.capital,
      videoUrl: city.videoUrl.slice(-11),
    });

    // CURRENCY
    axios
      .post("/api/currency", { currency: city.local_currency })
      .then((response) => {
        if (!response.data.error) {
          this.setState({ rates: response.data.data });
        }
      });
    // WEATHER
    axios
      .post("/api/weather", { alias: city.capital_alias })
      .then((response) => {
        if (!response.data.error) {
          this.setState({
            temp: response.data.data.temp,
            wind: response.data.data.wind,
            lon: response.data.data.cords.lon,
            lat: response.data.data.cords.lat,
          });
          mapboxgl.accessToken =
            "pk.eyJ1Ijoic2xhdmFpZGVyIiwiYSI6ImNrbHhxY20xNDF2bDEyb3Azc2h6M3gydW4ifQ.lIJ0H5bCqxE7JmW892Hc6g";
          const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: [
              response.data.data.cords.lon,
              response.data.data.cords.lat,
            ], // starting position [lng, lat]
            zoom: 9, // starting zoom
          });
          new mapboxgl.Marker()
            .setLngLat([
              response.data.data.cords.lon,
              response.data.data.cords.lat,
            ])
            .addTo(map);

          // TIME
          axios
            .post("/api/time", {
              lon: response.data.data.cords.lon,
              lat: response.data.data.cords.lat,
            })
            .then((response) => {
              if (!response.data.error) {
                this.setState({
                  date: response.data.data,
                });
              }
            });
        }
      });
  };

  componentDidMount() {
    if (this.props.countries.length === 0) {
      axios
        .post("/api/country", {
          type: localStorage.getItem("lang") || "ru",
        })
        .then((response) => {
          this.props.fetchAll(response.data.data);
        });
    } else {
      this.getData();
    }
    const id = localStorage.getItem("user");
    if (id) {
      const user = { id, type: "auto_login" };
      axios.post("/api/auth", { user }).then((response) => {
        if (!response.data.error) {
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("avatar", response.data.imageUrl);
          localStorage.setItem("user", response.data.id);
          this.setState({ isAuth: true });
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.countries !== this.props.countries) {
      if (this.props.countries.length !== 0) this.getData();
    }
  }

  Rate = (value) => {
    const id = localStorage.getItem("user");
    const name = localStorage.getItem("name");
    const alias = this.props.router.query.id;
    axios.post("/api/rate", { value, alias, ownerName: name, ownerId: id });
  };

  render() {
    const opts = {
      height: "260",
      width: "100%",
      playerVars: {
        autoplay: 1,
      },
    };
    return (
      <>
        <div className={styles.full_country}>
          <img
            className={styles.capital__img}
            src={this.state.capitalImg}
            alt={this.state.capitalImg}
          />
          <div className={styles.capital__info_wrapper}>
            <div className={styles.link__home}>
              <Link className={styles.link__home} href={"/"}>
                <HomeIcon fontSize="large" className={styles.home__btn} />
              </Link>
            </div>
            <div className={styles.capital__info}>
              <p className={styles.capital__info_name}>{this.state.capital}</p>
              <p className={styles.capital__info_description}>
                {this.state.capital_description}
              </p>
            </div>

            {this.state.isAuth ? (
              <Rating onChange={(value) => this.Rate(value)} />
            ) : null}
            <p className={styles.rating__title}>RECENT RATING:</p>
            <ul>
              {this.state.rating.map((el) => {
                return Object.values(el).map((value) => {
                  return (
                    <li className={styles.rating__users} key={value.ownerName}>
                      Owner:{value.ownerName} Rate : {value.value}
                    </li>
                  );
                });
              })}
            </ul>
          </div>
          <div className={styles.capital__data_wrapper}>
            <div className={styles.capital__attraction_container}>
              <button
                className={styles.btn__modal_attraction}
                onClick={() => this.setState({ modalSlider: true })}
              >
                <ZoomOutMapIcon style={{ fontSize: 30 }}></ZoomOutMapIcon>
              </button>
              <Swiper
                className={styles.swiper__attraction}
                effect="cube"
                loop={true}
                pagination={{ clickable: true }}
              >
                {this.state.attractions.map((attraction, index) => {
                  return (
                    <li key={index}>
                      <SwiperSlide key={index}>
                        <img
                          className={styles.swiper__img}
                          src={attraction.imageUrl}
                          alt={attraction.imageUrl}
                        />
                        <p className={styles.swiper__attraction_title}>
                          {attraction.title}
                        </p>
                        <p className={styles.swiper__attraction_description}>
                          {attraction.description}
                        </p>
                      </SwiperSlide>
                    </li>
                  );
                })}
              </Swiper>
            </div>
            <div className={styles.capital__data_container}>
              <div className={styles.data__container_info}>
                <Swiper
                  className={styles.swiper__info}
                  effect="cube"
                  loop={true}
                  pagination={{ clickable: true }}
                >
                  <SwiperSlide className={styles.info__currency}>
                    <div className={styles.info__container}>
                      <p className={styles.currency__title}>
                        {this.state.currencyTitle} {this.state.currency}
                      </p>
                      <p className={styles.currency__course}>
                        {this.state.courseTitle}
                      </p>

                      <p className={styles.currency__course}>
                        USD/EUR:
                        {parseFloat(this.state.rates.usd).toFixed(3)}
                      </p>
                      <p className={styles.currency__course}>
                        RUB/EUR: {parseFloat(this.state.rates.rub).toFixed(3)}
                      </p>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className={styles.info__weather}>
                    <div className={styles.info__container}>
                      <p className={styles.weather__date_title}>
                        {this.state.dateTitle}
                      </p>
                      <p className={styles.weather__date}>{this.state.date}</p>
                      <p className={styles.weather__current_title}>
                        {this.state.weatherTitle}
                      </p>
                      <p className={styles.weather__current}>
                        tC = {this.state.temp}
                      </p>
                      <p className={styles.weather__current}>
                        wind {this.state.wind} m/s
                      </p>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>

              <div className={styles.data__container_map}>
                <button
                  className={styles.btn__modal_map}
                  onClick={() => this.setState({ modalMap: true })}
                >
                  <ZoomOutMapIcon style={{ fontSize: 40 }}></ZoomOutMapIcon>
                </button>
                <Swiper className={styles.swiper__map}>
                  <SwiperSlide>
                    <div id={"map"} className={styles.map} />
                  </SwiperSlide>
                </Swiper>
              </div>

              <div className={styles.data__container_video}>
                <Swiper className={styles.swiper__video}>
                  <SwiperSlide>
                    <YouTube
                      videoId={this.state.videoUrl}
                      opts={opts}
                      onReady={this._onReady}
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
            </div>
          </div>
          <ModalMap
            mapLon={this.state.lon}
            mapLat={this.state.lat}
            isOpened={this.state.modalMap}
            onModalClose={() => this.setState({ modalMap: false })}
          />
          <ModalSlider
            attractions={this.state.attractions}
            isOpened={this.state.modalSlider}
            onModalClose={() => this.setState({ modalSlider: false })}
          />
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    countries: state.countries.countries,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAll: (data) => dispatch(fetchAll(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SingleCountry));
