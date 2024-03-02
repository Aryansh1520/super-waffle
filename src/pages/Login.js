import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// const LOGIN_URL = '/auth';
import AuthContext from "../context/AuthProvider";
import axios from "axios";
const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    setUser("");
    setPwd("");
    setSuccess(true);

    try {
      const response = await axios.post(
        "http://localhost:8081/signup",
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className="after-log-in">
          <h1 className="after-log-in-head">Login Successful !</h1>
          <br />
          <p>
            <Link to="/oome">Go to Home</Link>
          </p>
        </section>
      ) : (
        <section className="inner-sec">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="Login-head">Have an Account Login !</h1>
          <form className="log-form" onSubmit={handleSubmit}>
            <label htmlFor="username">
              <strong>Username:</strong>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button type="submit" className="otp-but">
              Send OTP
            </button>

            <label htmlFor="otp">
              <strong>Enter OTP:</strong>
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
            //   onChange={(e) => setPwd(e.target.value)}
            //   value={pwd}
              required
            />
            
            <button type="submit" className="login-but">
              LOGIN
            </button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link to="/register">Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
