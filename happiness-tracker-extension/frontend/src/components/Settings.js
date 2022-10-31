import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./Settings.module.css";
import screw from "../images/screw.svg";
import settings from "../images/settings.png";
import smile from "../images/smile.png";
import hands from "../images/hands.png";
import check from "../images/check.svg";
import greyCheck from "../images/greyCheck.png";
import coloredSmile from "../images/coloredSmile.png";

import JaneLoo from "../images/janeLoo.jpeg";

const stripePromise = loadStripe(
  "pk_test_51KddlyDk6SusXP09fF6dnGqxnXpKOz3vB215G4WPbtoI3wvrrPifNbnZXIe9Q9Lu0SP8Paebt8JfxJkYWGVZxPgm00UBWt8TvU"
);

// const API_URL = 'http://localhost:5000/api/v1/users/me/';
const API_URL =
  "http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/users/me/";

const Settings = ({
  user,
  quoteOrBible,
  displayQuoteOrBible,
  toggleDisplayQuestion,
  toggleDisplayCalories,
  toggleDisplayWeather,
  toggleDisplayTime,
  toggleTwentyFourHours,
  displayWeather,
  displayTime,
  displayQuestion,
  displayCalories,
  twentyFourHours,
  isLoggedIn,
  wantToSignUp,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <Child
        user={user}
        quoteOrBible={quoteOrBible}
        displayQuoteOrBible={displayQuoteOrBible}
        toggleDisplayQuestion={toggleDisplayQuestion}
        toggleDisplayCalories={toggleDisplayCalories}
        toggleDisplayWeather={toggleDisplayWeather}
        toggleDisplayTime={toggleDisplayTime}
        toggleTwentyFourHours={toggleTwentyFourHours}
        displayWeather={displayWeather}
        displayTime={displayTime}
        displayQuestion={displayQuestion}
        displayCalories={displayCalories}
        twentyFourHours={twentyFourHours}
        isLoggedIn={isLoggedIn}
        wantToSignUp={wantToSignUp}
      />
    </Elements>
  );
};

const inputStyle = {
  width: "345px",
  height: "31px",
  fontSize: "12px",
  color: "#000000",
  background: "#FFFFFFBA 0% 0% no-repeat padding-box",
  padding: "14px 22px 11px 22px",
  margin: "auto",
};

const Child = ({
  user,
  quoteOrBible,
  displayQuoteOrBible,
  toggleDisplayQuestion,
  toggleDisplayCalories,
  toggleDisplayWeather,
  toggleDisplayTime,
  toggleTwentyFourHours,
  displayCalories,
  displayWeather,
  displayTime,
  displayQuestion,
  twentyFourHours,
  isLoggedIn,
  wantToSignUp,
}) => {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("settings");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  // const [dob, setDob] = useState();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const quoteRef = useRef(null);
  const verseRef = useRef(null);
  const password1Ref = useRef(null);
  const password2Ref = useRef(null);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (tab === "payment") {
      axios
        .get(
          `http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/subscriptions/${user.email}`
        )
        .then((res) => {
          console.log(res.data.data);
          setSubscriptions([...res.data.data]);
        })
        .catch((err) => console.log(err));
    }
  }, [tab, user]);

  const handleClick = (e) => {
    setPasswordVisible(!passwordVisible);
  };

  const handleVerseToggle = () => {
    // make verse visible
    displayQuoteOrBible("bible");
    localStorage.removeItem("showQuoteOrBible");
    localStorage.setItem("showQuoteOrBible", "bible");
  };

  const handleQuoteToggle = () => {
    // make quote visible
    displayQuoteOrBible("quote");
    localStorage.removeItem("showQuoteOrBible");
    localStorage.setItem("showQuoteOrBible", "quote");
  };

  const updateLocalStorage = (name) => {
    const user = JSON.parse(localStorage.getItem("user"));
    user.name = name;
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = user.token;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const userData = {
      name,
      newPassword: password1,
      password: password2,
      email,
    };

    if (password2 !== "") {
      axios
        .put(API_URL, userData, config)
        .then((res) => {
          if (password1 !== "" && name !== user.name) {
            updateLocalStorage(name);
            isLoggedIn(false);
            wantToSignUp(false);
            localStorage.removeItem("user");
            window.location.reload();
          } else if (password1 !== "" && name === user.name) {
            isLoggedIn(false);
            wantToSignUp(false);
            localStorage.removeItem("user");
            window.location.reload();
          } else if (password1 === "" && name !== user.name) {
            updateLocalStorage(name);
            window.location.reload();
          }
          setLoading(false);
          setPassword2("");
          password1Ref.current.value = "";
          password2Ref.current.value = "";
          alert("Profile updated successfully!");
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      alert("You need to enter your password to update your profile!");
    }
  };

  const getAmountInCentsAndDollars = (cents) => {
    const dollars = cents / 100;
    return dollars.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // const onDateChange = (date) => {
  // 	setDob(date);
  // };

  const [animation, setAnimation] = useState(styles.scaleIn);
  const toggleSettings = () => {
    if (visible) {
      setAnimation(styles.scaleOut);
      setTimeout(() => {
        setVisible(false);
      }, 200);
      return;
    }
    setAnimation(styles.scaleIn);
    setVisible(true);
  };

  const handleChangeCard = async (e) => {
    e.preventDefault();

    const cardPayment = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    const res = await axios.post(
      `http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/changecard/${user.email}`,
      {
        ...cardPayment,
      }
    );

    console.log(res);
  };

  let header;
  const mainSettingsContainer = useRef(null);
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    setFaded(true);
    setTimeout(() => {
      setFaded(false);
    }, 350);
  }, [tab]);

  if (tab === "settings") {
    header = <p className={styles.normalHeader}>Settings</p>;
    if (mainSettingsContainer.current) {
      mainSettingsContainer.current.style.transform = "translateX(0)";
    }
  } else if (tab === "profile") {
    header = <p className={styles.normalHeader}>Profile</p>;

    if (mainSettingsContainer.current) {
      mainSettingsContainer.current.style.transform = "translateX(-361px)";
    }
  } else if (tab === "payment") {
    header = (
      <div className={styles.header}>
        <h2>7,345,600</h2>
        <h3>LIVES UPGRADED</h3>
      </div>
    );

    if (mainSettingsContainer.current) {
      mainSettingsContainer.current.style.transform = "translateX(-722px)";
    }
  }

  const settingsPopup = useRef(null);

  useEffect(() => {
    const closeIfOutside = (e) => {
      if (!visible) return;
      if (!settingsPopup.current) return;
      if (settingsPopup.current.contains(e.target)) return;

      toggleSettings();

    };

    window.addEventListener("click", closeIfOutside);
    return () => {
      window.removeEventListener("click", closeIfOutside);
    };
  }, [toggleSettings, visible]);

  return (
    <div className={styles.settings} ref={settingsPopup}>
      {visible && (
        <div className={`${styles.component} ${animation}`}>
          <div className={styles.tabIcons}>
            <button
              onClick={() => setTab("settings")}
              style={
                tab === "settings"
                  ? {
                      boxShadow: "0px 3px 6px #FFBFBF",
                      border: "0.5px solid #FFBFBF",
                      borderRadius: "20px 12px 3px 3px",
                      background: "#FFEFEF 0% 0% no-repeat padding-box",
                    }
                  : {}
              }
            >
              <img src={settings} alt="settings" />
            </button>
            <button
              style={
                tab === "profile"
                  ? {
                      boxShadow: "0px 3px 6px #FFBFBF",
                      border: "0.5px solid #FFBFBF",
                      borderRadius: "20px 20px 3px 3px",
                      background: "#FFEFEF 0% 0% no-repeat padding-box",
                    }
                  : {}
              }
              onClick={() => setTab("profile")}
            >
              <img
                src={tab === "profile" ? coloredSmile : smile}
                alt="smile emoji"
              />
            </button>
            <button
              style={
                tab === "payment"
                  ? {
                      boxShadow: "0px 3px 6px #FFBFBF",
                      border: "0.5px solid #FFBFBF",
                      borderRadius: "20px 12px 3px 3px",
                      background: "#FFEFEF 0% 0% no-repeat padding-box",
                    }
                  : {}
              }
              onClick={() => setTab("payment")}
            >
              <img src={hands} alt="clasped hands emoji" />
            </button>
          </div>
          {/* {header} */}
          <div className={styles.mainSettingsWrapper}>
            <div
              className={
                faded
                  ? `${styles.mainSettingsContainer} ${styles.faded}`
                  : styles.mainSettingsContainer
              }
              ref={mainSettingsContainer}
            >
              <div className={styles.main}>
                <p className={styles.normalHeader}>Settings</p>
                <div className={styles.separator} />
                <div className={styles.switchContainer}>
                  <div className={styles.bible}>
                    <div className={styles.dotAndText}>
                      <div className={styles.pinkDot}></div>
                      <p>Bible Verses</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        onChange={handleVerseToggle}
                        ref={verseRef}
                        type="checkbox"
                        id="toggleVerse"
                        className={styles.checkbox}
                        checked={quoteOrBible === "bible"}
                      />
                      <label
                        htmlFor="toggleVerse"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.quotes}>
                    <div className={styles.dotAndText}>
                      <div className={styles.yellowDot}></div>
                      <p>Quotes</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        onChange={handleQuoteToggle}
                        ref={quoteRef}
                        type="checkbox"
                        id="toggleQuote"
                        className={styles.checkbox}
                        checked={quoteOrBible === "quote"}
                      />
                      <label
                        htmlFor="toggleQuote"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.time}>
                    <div className={styles.dotAndText}>
                      <div className={styles.lightBlueDot}></div>
                      <p>Time</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        type="checkbox"
                        id="toggleTime"
                        className={styles.checkbox}
                        onChange={() => {
                          toggleDisplayTime(!displayTime);
                          localStorage.removeItem("showTime");
                          localStorage.setItem("showTime", !displayTime);
                        }}
                        checked={displayTime}
                      />
                      <label
                        htmlFor="toggleTime"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.weather}>
                    <div className={styles.dotAndText}>
                      <div className={styles.blueDot}></div>
                      <p>Weather</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        type="checkbox"
                        id="toggleWeather"
                        className={styles.checkbox}
                        onChange={() => {
                          toggleDisplayWeather(!displayWeather);
                          localStorage.removeItem("showWeather");
                          localStorage.setItem("showWeather", !displayWeather);
                        }}
                        checked={displayWeather}
                      />
                      <label
                        htmlFor="toggleWeather"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.time}>
                    <div className={styles.dotAndText}>
                      <div className={styles.greenDot}></div>
                      <p>24 Hr/12 Hr Toggle</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        type="checkbox"
                        id="toggleTwentyFour"
                        className={styles.checkbox}
                        onChange={() => {
                          toggleTwentyFourHours(!twentyFourHours);
                          localStorage.removeItem("twentyFourHours");
                          localStorage.setItem(
                            "twentyFourHours",
                            !twentyFourHours
                          );
                        }}
                        checked={twentyFourHours}
                      />
                      <label
                        htmlFor="toggleTwentyFour"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.dailyQuestions}>
                    <div className={styles.dotAndText}>
                      <div className={styles.pinkDot}></div>
                      <p>Daily Questions</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        type="checkbox"
                        id="toggleQuestions"
                        className={styles.checkbox}
                        onChange={() => {
                          toggleDisplayQuestion(!displayQuestion);
                          localStorage.removeItem("showQuestion");
                          localStorage.setItem(
                            "showQuestion",
                            !displayQuestion
                          );
                        }}
                        checked={displayQuestion}
                      />
                      <label
                        htmlFor="toggleQuestions"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                  <hr />
                  <div className={styles.dailyQuestions}>
                    <div className={styles.dotAndText}>
                      <div className={styles.blueDot}></div>
                      <p>Calories</p>
                    </div>
                    <div className={styles.toggleBtn}>
                      <input
                        type="checkbox"
                        id="toggleCalories"
                        className={styles.checkbox}
                        onChange={() => {
                          toggleDisplayCalories(!displayCalories);
                          localStorage.removeItem("showCalories");
                          localStorage.setItem(
                            "showCalories",
                            !displayCalories
                          );
                        }}
                        checked={displayCalories}
                      />
                      <label
                        htmlFor="toggleCalories"
                        className={styles.switch}
                      ></label>
                    </div>
                  </div>
                </div>
                <div className={styles.bottomText}>
                  <p>Click the switch to hide the different options</p>
                  <p>Being displayed on your screen</p>
                </div>
              </div>
              <div className={styles.mainProfile}>
                <p className={styles.normalHeader}>Profile</p>
                <div className={styles.separator} />
                <div className={styles.profileContent}>
                  <p className={styles.disclaimer}>
                    To change or update your name click the save button below
                    for the update to be effective
                  </p>
                  <div className={styles.changeUserDetails}>
                    <div className={styles.changeName}>
                      <div className={styles.pinkDot}></div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className={styles.changeEmail}>
                      <div className={styles.yellowDot}></div>
                      <input
                        disabled={true}
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/*<div className={styles.setBirthDate}>
					<SelectDatepicker
						value={dob}
						onDateChange={(date) => setDob(date)}
						minDate={new Date(1900, 0, 1)}
						maxDate={new Date()}
						format='day/month/year'
					/>
		</div>*/}
                  </div>
                  <div className={styles.hairline}></div>
                  <div className={styles.updatePassword}>
                    <h3>Update Password</h3>
                    <p className={styles.disclaimer}>
                      To change or update your name click the save button below
                      for the update to be effective
                    </p>
                    <div className={styles.passwordField}>
                      <div className={styles.lightBlueDot}></div>
                      <div className={styles.passwordInput}>
                        <input
                          ref={password1Ref}
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          id="password1"
                          placeholder="New Password"
                          onChange={(e) => setPassword1(e.target.value)}
                          value={password1}
                        />
                        <span className={styles.showPass} onClick={handleClick}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.eye}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className={styles.passwordField}>
                      <div className={styles.lightBlueDot}></div>
                      <div className={styles.passwordInput}>
                        <input
                          ref={password2Ref}
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          id="password2"
                          placeholder="Current Password"
                          onChange={(e) => setPassword2(e.target.value)}
                          value={password2}
                          required={true}
                        />
                        <span className={styles.showPass} onClick={handleClick}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.eye}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.save}
                  disabled={loading}
                  onClick={handleSave}
                >
                  {loading ? <LoadingSpinner /> : "SAVE"}
                </button>
              </div>
              <div className={styles.mainPayment}>
                <div className={styles.header}>
                  <h2>7,345,600</h2>
                  <h3>LIVES UPGRADED</h3>
                </div>
                <div className={styles.separator} />
                <div className={styles.feedbackContainer}>
                  <div className={styles.scroller}>
                    <div className={styles.feedbackCard}>
                      <div className={styles.feedbackTop}>
                        <div className={styles.profilePic}>
                          <img src={JaneLoo} alt="" />
                        </div>
                        <div className={styles.name}>Jane Loo</div>
                        <div className={styles.location}>New York</div>
                      </div>
                      <div className={styles.feedbackContent}>
                        Absolutely beautiful. Looks Exactly how I expected and
                        wanted. Amazing quality and seller was perfect❤️
                      </div>
                    </div>

                    <div className={styles.feedbackCard}>
                      <div className={styles.feedbackTop}>
                        <div className={styles.profilePic}>
                          <img src={JaneLoo} alt="" />
                        </div>
                        <div className={styles.name}>Jane Loo</div>
                        <div className={styles.location}>New York</div>
                      </div>
                      <div className={styles.feedbackContent}>
                        Absolutely beautiful. Looks Exactly how I expected and
                        wanted. Amazing quality and seller was perfect❤️
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.logout}
                  onClick={() => {
                    isLoggedIn(false);
                    wantToSignUp(false);
                    localStorage.removeItem("user");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => toggleSettings()}>
        <img src={screw} alt="settings view toggle" />
      </button>
    </div>
  );
};

export default Settings;
