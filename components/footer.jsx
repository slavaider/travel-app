import React, { Component } from "react";
import styles from "../styles/footer.module.css";

const logo = [
  {
    0: "./slavaider_avatar.jpg",
    1: "./avatar_victor.png",
  },
];

class Footer extends Component {
  render() {
    return (
      <>
        <div className={styles.footer}>
          <div className={styles.footer__container}>
            <a href="https://github.com/slavaider" alt="slavaider">
              <img
                className={styles.footer__link__img}
                src={logo[0][0]}
                alt="avatar_slavaider"
              />
            </a>
            <a href="https://github.com/VVK1978" alt="viсtor">
              <img
                className={styles.footer__link__img}
                src={logo[0][1]}
                alt="avatar_victorr"
              />
            </a>
            <a href="https://rs.school/">
              <img
                className={styles.footer__link__img}
                src="https://rs.school/images/rs_school.svg"
                alt="rs_school"
              />
            </a>
          </div>
        </div>
      </>
    );
  }
}

export default Footer;
