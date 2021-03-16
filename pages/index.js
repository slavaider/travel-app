import {connectToDatabase} from "../util/mongodb";
import React from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Rating from "react-rating";
import {connect} from "react-redux";
import {fetchAll} from "../store/actions";

class Index extends React.Component {
    state = {
        img: null,
        name: null,
        countries: [],
        isAuth: false,
        filteredCountries: null,
        type: "ru",
        showRegister: false,
        showLogin: false
    };

    componentDidMount() {
        window.scrollTo(0, 0)
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
                this.props.fetchAll(response.data.data)
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
            document.getElementById('search').focus()
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
            return (
                el.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
            );
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
        console.log(this.state.isAuth)
        this.setState({isAuth: !this.state.isAuth});
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
            this.props.fetchAll(response.data.data)
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
        document.getElementById('search').value = ''
        this.setState({filteredCountries: null})
    }

    register = () => {
        this.setState({showRegister: !this.state.showRegister})
    }
    
    login = () => {
        this.setState({showLogin: !this.state.showLogin})
    }
    

    render() {
        return (
            <div className={styles.homepage}>
                
                <div className={styles.header}>
                    <div className={styles.select__wrapper}>
                        <select
                            onChange={(e) => this.changeLang(e)}
                            value={this.state.type}
                            name="lang"
                            id="lang"
                            className={styles.select}
                        >
                            <option value={"ru"}>RU</option>
                            <option value={"en"}>EN</option>
                            <option value={"ge"}>GE</option>
                        </select>
                    </div>
                    <div className={styles.homepageLink}>
                        <Link  href="/">Homepage</Link>
                        </div>
                    <div className={styles.search__wrapper}>
                        <div>
                            <input
                                type="text"
                                id={"search"}
                                onInput={(e) => this.searchText(e)}
                                placeholder={"Search"}
                            />
                            <button className="clear"
                                    onClick={() => this.clear()}>&times;</button>
                        </div>
                        <button onClick={() => this.searchButton()}>Search</button>
                    </div>
                    {this.state.isAuth ? (
                        <div className={styles.reg}>
                            <button onClick={() => this.register()}>Register</button>
                            <button onClick={() => this.login()}>Login</button>
                        </div>
                        
                    ) : (
                        <div className={styles.accc}>
                            <img
                                className={styles.avatar}
                                src={this.state.img}
                                alt="avatar"
                            />
                            <p>{this.state.name}</p>
                            <button className={styles.quit} onClick={() => this.quit()}>quit</button>
                        </div>
                    )}
                </div>
                
                {this.props.isConnected ? (
                    <>
                        <div className={styles.main}>
                            {/* <ul> */}
                                {this.state[
                                    this.state.filteredCountries
                                        ? "filteredCountries"
                                        : "countries"
                                    ].map((country, index) => {
                                    return (
                                        <div className={styles.country__card} key={index}>
                                            <Link
                                                href={`/${country.capital_alias}`}
                                            >
                                                
                                                    {/* <hr/> */}
                                                    <div className={styles.country__wrapper}>
                                                        
                                                        {/* <div className={styles.country__info}> */}
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
                                                        {/* </div> */}

                                                        <div className={styles.country__map}>
                                                            <img
                                                                className={styles.country__map__img}
                                                                src={country.urlImage}
                                                                alt={country.urlImage}
                                                            />
                                                        </div>
                                                        {/*                             <p>{country.capital}</p>
                             */}
                                                        {/* <p>{country.capital_description}</p> */}

                                                        {/* <img
                            className={styles.capital__img}
                            src={country.capitalImageUrl}
                            alt={country.capitalImageUrl}
                          /> */}
                                                        {/* <hr/> */}
                                                    </div>
                                                
                                            </Link>
                                        </div>
                                    );
                                })}
                            {/* </ul> */}
                        </div>
                        
                    </>
                ) : null}
                {this.state.showRegister && <div className={styles.overlay}>
	                <div className={styles.popup}>
		            <h2>Register</h2>
		            <a onClick={() => {this.register()}} className={styles.close} href="#">&times;</a>
		            <div className={styles.content}>
                    <div className={styles.auth}>
                    <form id={"Register"} onSubmit={(e) => this.RegisterSubmit(e)} className={styles.form}>
                                <label htmlFor="file">
                                    Avatar
                                    <input required id="file" name="avatar" type="file"/>
                                </label>
                                <br/>
                                <label htmlFor="username">
                                    Name:
                                    <input required id={"username"} type="text" name="username"/>
                                </label>
                                <br/>
                                <label htmlFor="email">
                                    Email:
                                    <input id={"email"} type="email" required name="email"/>
                                </label>
                                <br/>
                                <label htmlFor="password">
                                    Password:
                                    <input
                                        required
                                        id={"password"}
                                        type="password"
                                        name="password"
                                    />
                                </label>
                                <br/>
                                <input type="submit" name="submit"/>
                            </form>
                            </div>
		            </div>
	            </div>
                </div>}
                {this.state.showLogin && <div className={styles.overlay}>
	                <div className={styles.popup}>
		            <h2>Login</h2>
		            <a onClick={() => {this.login()}} className={styles.close} href="#">&times;</a>
		            <div className={styles.content}>
                    <div className={styles.auth}>
                    <form id={"Login"} onSubmit={(e) => this.LoginSubmit(e)} className={styles.form2}>
                            <h1>Dev [LOGIN] : 1@mail.ru [PASSWORD]:123</h1>
                                <label htmlFor="login_email">
                                    Email:
                                    <input
                                        required
                                        id={"login_email"}
                                        type="email"
                                        name="email"
                                    />
                                </label>
                                <br/>
                                <label htmlFor="login_password">
                                    Password:
                                    <input
                                        required
                                        id={"login_password"}
                                        type="password"
                                        name="password"
                                    />
                                </label>
                                <br/>
                                <input type="submit" name="submit"/>
                            </form>
                            </div>
		            </div>
	            </div>
                </div>}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchAll: (data) => dispatch(fetchAll(data))
    }
}

export default connect(null, mapDispatchToProps)(Index)

export async function getServerSideProps() {
    const {client} = await connectToDatabase();

    const isConnected = await client.isConnected();

    return {
        props: {isConnected},
    };
}
