import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import styles from "../styles/modal.module.css";
import CancelIcon from "@material-ui/icons/Cancel";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2xhdmFpZGVyIiwiYSI6ImNrbHhxY20xNDF2bDEyb3Azc2h6M3gydW4ifQ.lIJ0H5bCqxE7JmW892Hc6g";

class ModalMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: this.props.mapLon,
      lat: this.props.mapLat,
      zoom: 11,
    };
    this.mapContainer = React.createRef();
  }
  componentDidMount() {
    this.getMap();
  }

  getMap() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.props);
    if (prevProps !== this.props) {
      this.setState({
        lng: this.props.mapLon,
      });
      this.setState({
        lat: this.props.mapLat,
      });
      this.getMap();
    }
  }

  render() {
    return (
      <>
        <div
          className={`modal__map__wrapper ${
            this.props.isOpened ? "open" : "close"
          }`}
          style={{ ...this.props.style }}
        >
          <div
            className={styles.modal__body}
            onClick={(e) => e.stopPropagation}
          >
            <div
              className={styles.modal__close}
              onClick={this.props.onModalClose}
            >
              <CancelIcon style={{ fontSize: 40 }}></CancelIcon>
            </div>
            <div ref={this.mapContainer} className={styles.map} />
          </div>
        </div>
      </>
    );
  }
}

export default ModalMap;
