import {connectToDatabase} from "../util/mongodb";
import React from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Rating from "react-rating";
import {connect} from "react-redux";
import {fetchAll} from "../store/actions";
import LanguageIcon from "@material-ui/icons/Language";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import Modal from "./modal";

class Index extends React.Component {
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
            const user = {id, type: "auto_login"};
            axios.post("/api/auth", {user}).then((response) => {
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
            headers: {"content-type": "multipart/form-data"},
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
        const user = {email, name, password, imageUrl, type: "register"};
        const response = await axios.post("/api/auth", {user});
        localStorage.setItem("name", name);
        localStorage.setItem("avatar", imageUrl);
        localStorage.setItem("user", response.data.id);
        this.setState({isAuth: true});
    };
    LoginSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const user = {email, password, type: "login"};
        const response = await axios.post("/api/auth", {user});
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("avatar", response.data.imageUrl);
        localStorage.setItem("user", response.data.id);
        this.setState({isAuth: true});
    };

    searchText = (e) => {
        if (e.target.value === "") this.setState({filteredCountries: null});
        const filter = [...this.state.countries];
        const result = filter.filter((el) => {
            return el.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1;
        });
        this.setState({filteredCountries: result});
    };
    searchButton = () => {
        const value = document.querySelector("#search").value;
        if (value === "") this.setState({filteredCountries: null});
        const filter = [...this.state.countries];
        const result = filter.filter((el) => {
            return el.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        });
        this.setState({filteredCountries: result});
    };

    quit = () => {
        this.setState({isAuth: false});
        localStorage.clear();
    };

    changeLang = (e) => {
        this.setState({
            type: e.target.value,
        });
        axios.post("/api/country", {type: e.target.value}).then((response) => {
            this.setState({
                countries: response.data.data,
            });
            this.props.fetchAll(response.data.data);
        });
        localStorage.setItem("lang", e.target.value);
    };

    getRating = (rating) => {
        if (rating.length === 0) return 0;
        let res = 0;
        rating.map((item) => {
            Object.values(item).forEach((el) => {
                res += el.value;
            });
        });
        return (res / rating.length).toFixed(1);
    };

    clear = () => {
        document.getElementById("search").value = "";
        this.setState({filteredCountries: null});
    };

    render() {
        return (
            <div className={styles.homepage}>
                <header className={styles.header}>
                    <div className={styles.header__logo__container}>
                        <Link href={"/"}>
                            <CardTravelIcon
                                className={styles.logo__icon}
                                style={{fontSize: 60}}
                            />
                        </Link>
                        <select
                            className={styles.language__select}
                            onChange={(e) => this.changeLang(e)}
                            value={this.state.type}
                            name="lang"
                            id="lang"
                        >
                            <option value={"ru"}>RU</option>
                            <option value={"en"}>EN</option>
                            <option value={"ge"}>GE</option>
                        </select>
                        <LanguageIcon
                            className={styles.language__icon}
                            style={{fontSize: 60}}
                        />
                    </div>

                    <div className={styles.search__container}>
                        <input
                            type="text"
                            id={"search"}
                            onInput={(e) => this.searchText(e)}
                            placeholder={"Country"}
                            className={styles.search__input}
                            autoFocus
                        />
                        <button
                            className={styles.search__clear}
                            onClick={() => this.clear()}
                        >
                            &times;
                        </button>
                        <button
                            className={styles.search__button}
                            onClick={() => this.searchButton()}
                        >
                            Search
                        </button>
                    </div>
                    <div className={styles.registration__container}>
                        {!this.state.isAuth ?
                            <>
                                <div className={styles.registration__btn__container}>
                                    <button
                                        className={`login__btn ${this.state.isAuth ? "close" : "open"}`}
                                        onClick={() => this.setState({modalReg: true})}
                                    >
                                        Log In
                                    </button>
                                    <Modal
                                        isOpened={this.state.modalReg}
                                        onModalClose={() => this.setState({modalReg: false})}
                                    />
                                    <button
                                        className={`reg__btn ${this.state.isAuth ? "close" : "open"}`}
                                        onClick={() => this.setState({modalReg: true})}
                                    >
                                        Sighn In
                                    </button>
                                </div>
                                <div className={styles.auth__start}/>
                            </>
                            :
                            <div className={styles.avatar__container}>
                                <img
                                    className={styles.avatar}
                                    src={this.state.img}
                                    alt="avatar"
                                />
                                <p className={styles.avatar__user__title}>{this.state.name}</p>
                                <button
                                    className={styles.quit__btn}
                                    onClick={() => this.quit()}
                                >
                                    Exit
                                </button>
                            </div>}
                    </div>
                </header>

                {this.props.isConnected ? (
                    <>
                        <div className={styles.main}>
                            <ul>
                                {this.state[
                                    this.state.filteredCountries
                                        ? "filteredCountries"
                                        : "countries"
                                    ].map((country, index) => {
                                    return (
                                        <div key={index}>
                                            <Link href={`/${country.capital_alias}`}>
                                                <div className={styles.country__container__card}>
                                                    <div className={styles.country__wrapper}>
                                                        <div className={styles.country__info}>
                                                            <p className={styles.country__name}>
                                                                {country.name}
                                                            </p>
                                                            <img
                                                                className={styles.flag__img}
                                                                src={country.flagImageUrl}
                                                                alt={country.flagImageUrl}
                                                            />
                                                            <div className={styles.country__raitng}>
                                                                <Rating
                                                                    readonly={true}
                                                                    initialRating={this.getRating(country.rating)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={styles.country__map}>
                                                            <img
                                                                className={styles.country__map__img}
                                                                src={country.urlImage}
                                                                alt={country.urlImage}
                                                            />
                                                        </div>

                                                        <p className={styles.capital_description}>
                                                            {country.capital_description}
                                                        </p>

                                                        <hr/>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </ul>
                        </div>
                    </>
                ) : null}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAll: (data) => dispatch(fetchAll(data)),
    };
}

export default connect(null, mapDispatchToProps)(Index);

export async function getServerSideProps() {
    const {client} = await connectToDatabase();

    const isConnected = await client.isConnected();

    return {
        props: {isConnected},
    };
}
