import { useState, useEffect, useRef } from "react";
import axios from "axios";
import smile from "../images/520464@2x.png";
import mail from "../images/482947.svg";
import lock from "../images/2886699.svg";
import arrowBtnSignUp from "../images/arrowBtnSignUp.png";
import arrowBtnLogin from "../images/arrowBtnLogin.png";
import styles from "./Login.module.css";

const Login = ({
  setLoggedIn,
  wantToSignUp,
  goToForgotPassword,
  forgotPassword,
}) => {
  const emailRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emptyEmail, setEmptyEmail] = useState(false);
  const [emptyPw, setEmptyPw] = useState(false);

  const handleClick = (e) => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    const emailInput = document.getElementById("emailGroup");
    const warning = document.getElementById("warning");
    const forgotPassBtn = document.getElementById("forgotPassBtn");
    console.log();
    const emailRegex = /\S+@\S+\.\S+/;
    if (password !== "" && !email) {
      warning.style.display = "block";
      emailInput.style.border = "2px solid #FF0000";
      forgotPassBtn.style.marginTop = "20px";
    } else if (loading && !emailRegex.test(email)) {
      warning.style.display = "block";
      emailInput.style.border = "2px solid #FF0000";
      forgotPassBtn.style.marginBottom = "-20px";
    }
    // } else if (email && emailRegex.test(email)) {
    // 	warning.style.display = 'none';
    // 	emailInput.style.border = 'none';
    // } else {
    // 	warning.style.display = 'none';
    // 	emailInput.style.border = 'none';
    // }
    setEmptyEmail(false);
    setEmptyPw(false);
  }, [email, password, loading]);

  // localhost:5000 for dev

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() === "") setEmptyEmail(true);
    if (password.trim() === "") setEmptyPw(true);

    if (email.trim() === "" || password.trim() === "") return;
    setLoading(true);

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);
    axios.post("/foo", params);

    axios
      .post(
        "http://happiness-tracker-extension-dev.us-east-2.elasticbeanstalk.com/api/v1/users/login",
        params
      )
      .then((res) => {
        setLoading(false);
        localStorage.setItem("user", JSON.stringify(res.data));
        setLoggedIn(true);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        document.getElementById("wrong").style.display = "block";
      });
  };

  return (
    <main className={styles.main}>
      <section className={styles.login}>
        <div className={styles.mid}>
          <div className={styles.emoji}>
            <img
              width={68}
              height={68}
              src={smile}
              className={styles.smileImg}
              alt="Smiling face"
            />
          </div>
          <h1 className={styles.greeting}>Hi Amazing!</h1>

          <h2 className={styles.formName}>Login</h2>

          <form className={styles.formSection} onSubmit={handleSubmit}>
            <div className={styles.wrongEmailOrPassword} id="wrong">
              <p>YOU ENTERED THE WRONG EMAIL OR PASSWORD</p>
            </div>
            <p id="warning" className={styles.warning}>
              Invalid email address. Valid email format is - example@example.com
            </p>
            <div
              className={
                emptyEmail
                  ? `${styles.formInputWrapper} ${styles.wrapperError}`
                  : styles.formInputWrapper
              }
            >
              <div className={styles.formInput} id="emailGroup">
                <span className={styles.icon}>
                  <img src={mail} className={styles.mail} alt="mail icon" />
                </span>
                <input
                  ref={emailRef}
                  className={styles.email}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              {emptyEmail && (
                <span className={styles.requiredMsg}>Email Required</span>
              )}
            </div>
            <div
              className={
                emptyPw
                  ? `${styles.formInputWrapper} ${styles.wrapperError}`
                  : styles.formInputWrapper
              }
            >
              <div className={styles.formInput}>
                <span className={styles.icon}>
                  <img src={lock} alt="lock icon" className={styles.lock} />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />

                <span className={styles.showPass} onClick={handleClick}>
                  {passwordVisible ? (
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
                  ) : (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </span>
                {emptyPw && (
                  <span className={styles.requiredMsg}>Password Required</span>
                )}
              </div>
            </div>
            <button disabled={loading} type="submit">
              <img
                src={arrowBtnLogin}
                width={39}
                height={11}
                className={styles.submitArrow}
                alt="Arrow"
              />
            </button>
          </form>
          <button
            onClick={() => {
              goToForgotPassword(true);
            }}
            id="forgotPassBtn"
            className={styles.forgotPass}
          >
            FORGOT PASSWORD
          </button>
        </div>
      </section>
      <div className={styles.footerLinks}>
        <p>{"DON'T"} HAVE AN ACCOUNT?</p>
        <p>CREATE AN ACCOUNT</p>
        <button onClick={() => wantToSignUp(true)} href="/create-account">
          <img src={arrowBtnSignUp} className={styles.arrow} alt="Arrow" />
        </button>
      </div>
    </main>
  );
};

export default Login;
