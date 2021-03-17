import { connectToDatabase } from "../util/mongodb";
import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { fetchAll } from "../store/actions";
import styles from "../styles/modal.module.css";
import CancelIcon from "@material-ui/icons/Cancel";


class Modal extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    img: null,
    name: null,
    countries: [],
    isAuth: false,
    filteredCountries: null,
    type: "ru",
    modalReg: false,
  };

  componentDidMount() {
    if (localStorage.getItem("lang")) {
      this.setState({
        type: localStorage.getItem("lang"),
      });
    } else {
      localStorage.setItem("lang", this.state.type);
    }
    axios
      .post("/api/country", {
        type: localStorage.getItem("lang") || this.state.type,
      })
      .then((response) => {
        this.setState({
          countries: response.data.data,
        });
        this.props.fetchAll(response.data.data);
      });

    const id = localStorage.getItem("user");
    if (id) {
      const user = { id, type: "auto_login" };
      axios.post("/api/auth", { user }).then((response) => {
        if (!response.data.error) {
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("avatar", response.data.imageUrl);
          localStorage.setItem("user", response.data.id);
          this.setState({
            name: response.data.name,
            img: response.data.imageUrl,
            isAuth: true,
          });
        }
      });
      document.getElementById("search").focus();
    }
  }

  RegisterSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const avatar = e.target.avatar.files;

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        console.log(
          `Current progress:`,
          Math.round((event.loaded * 100) / event.total)
        );
      },
    };
    const formData = new FormData();
    Array.from(avatar).forEach((file) => {
      formData.append("theFiles", file);
    });
    const imageUrlRaw = await axios.post("/api/uploads", formData, config);
    const imageUrl = imageUrlRaw.data.data;
    const user = { email, name, password, imageUrl, type: "register" };
    const response = await axios.post("/api/auth", { user });
    localStorage.setItem("name", name);
    localStorage.setItem("avatar", imageUrl);
    localStorage.setItem("user", response.data.id);
    this.setState({ isAuth: true });
  };
  LoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const user = { email, password, type: "login" };
    const response = await axios.post("/api/auth", { user });
    localStorage.setItem("name", response.data.name);
    localStorage.setItem("avatar", response.data.imageUrl);
    localStorage.setItem("user", response.data.id);
    this.setState({ isAuth: true });
  };

  quit = () => {
    this.setState({ isAuth: false });
    localStorage.clear();
  };

  render() {

    return (
      <div
        className={`modal_wrapper ${this.props.isOpened ? "open" : "close"}`}
        style={{ ...this.props.style }}
      >
        <div className="modal_body">
          <div className="modal_close" onClick={this.props.onModalClose}>
            <CancelIcon
              style={{ fontSize: 30 }}
              className={styles.modal__close}
            ></CancelIcon>
          </div>
          <div>
            {!this.state.isAuth ? (
              <div className={styles.auth__login__wrapper}>
                <div className={styles.auth__container}>
                  <p className={styles.auth__title}>Sighn In</p>
                  <div className={styles.auth}>
                    <form
                      id={"Register"}
                      onSubmit={(e) => this.RegisterSubmit(e)}
                    >
                      <div className={styles.name__container}>
                        <label htmlFor="file" className={styles.avatar__title}>
                          Avatar
                          <input
                            required
                            id="file"
                            name="avatar"
                            type="file"
                            className={styles.avatar__btn}
                          />
                        </label>
                      </div>

                      <div className={styles.name__container}>
                        <label
                          htmlFor="username"
                          className={styles.name__title}
                        >
                          Name:
                          <input
                            required
                            id={"username"}
                            type="text"
                            name="username"
                            className={styles.name__input}
                            placeholder={"Name"}
                          />
                        </label>
                      </div>

                      <div className={styles.name__container}>
                        <label htmlFor="email" className={styles.email__title}>
                          E-mail:
                          <input
                            id={"email"}
                            type="email"
                            required
                            name="email"
                            className={styles.email__input}
                            placeholder={"E-mail"}
                          />
                        </label>
                      </div>

                      <div className={styles.name__container}>
                        <label
                          htmlFor="password"
                          className={styles.password__title}
                        >
                          Password:
                          <input
                            required
                            id={"password"}
                            type="password"
                            name="password"
                            className={styles.password__input}
                            placeholder={"Password"}
                          />
                        </label>
                      </div>

                      <input
                        type="submit"
                        name="submit"
                        className={styles.submit__data}
                      />
                    </form>
                  </div>
                </div>

                <div className={styles.login__container}>
                  <div className={styles.name__container}>
                    <h3 className={styles.login__title}>Log In</h3>
                  </div>

                  <form id={"Login"} onSubmit={(e) => this.LoginSubmit(e)}>
                    <div className={styles.name__container}>
                      <label
                        htmlFor="login_email"
                        className={styles.email__title}
                      >
                        E-mail:
                        <input
                          required
                          id={"login_email"}
                          type="email"
                          name="email"
                          className={styles.email__input}
                          placeholder={"E-mail"}
                        />
                      </label>
                    </div>

                    <div className={styles.name__container}>
                      <label
                        htmlFor="login_password"
                        className={styles.password__title}
                      >
                        Password:
                        <input
                          required
                          id={"login_password"}
                          type="password"
                          name="password"
                          className={styles.password__input}
                          placeholder={"Password"}
                        />
                      </label>
                    </div>

                    <input
                      type="submit"
                      name="submit"
                      className={styles.submit__data}
                    />
                  </form>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.avatar}>
                  <img
                    className={styles.avatar__img}
                    src={this.state.img}
                    alt="avatar"
                  />
                  <p className={styles.avatar__name}>{this.state.name}</p>
                  <button
                    onClick={() => this.quit()}
                    className={styles.quit__btn__modal}
                  >
                    Exit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAll: (data) => dispatch(fetchAll(data)),
  };
}

export default connect(null, mapDispatchToProps)(Modal);

export async function getServerSideProps() {
  const { client } = await connectToDatabase();

  const isConnected = await client.isConnected();

  return {
    props: { isConnected },
  };
}
