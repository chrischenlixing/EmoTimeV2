import React, { useEffect } from "react";
import UseCheckMsg from "../hooks/UseCheckMsg";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

function IndexPage() {
  const loginURL = '/api/login/';
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!name || name === "") {
      alert("Username Shouldn't be Empty.");
      e.preventDefault();
      return false;
    }
    if (!password || password === "") {
      alert("Password Shouldn't be Empty.");
      e.preventDefault();
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    navigate("/register"); 
  };

  UseCheckMsg();

  useEffect(() => {
    document.getElementById("login-form").action = loginURL;
  }, [loginURL]);

  return (
    <div className="gradient-custom-3" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <header><nav>EmoTime</nav></header>
      <main>
        <div className="container">
          <div id="login-row" className="row justify-content-center align-items-center">
            <div id="login-column" className="col-md-6">
              <div id="login-box" className="col-md-12">
                {/* Card-like structure for the login form */}
                <div className="card">
                  <div className="card-body">
                    <form
                      id="login-form"
                      className="form px-5"
                      action="/"
                      method="post"
                      onSubmit={handleSubmit}
                    >
                      <h1 className="register-login-title">Login</h1>
                      <div className="form-group mb-4">
                        <label htmlFor="username" className="aoe-text">
                          Username:
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="form-control"
                          placeholder="Enter your username/email"
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="password" className="aoe-text">
                          Password:
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          className="form-control"
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-info btn-lg aoe-btn-submit">Sign In</button>
                      </div>
                      <div className="form-group">
                        <button type="button" className="btn btn-pink btn-lg aoe-btn-submit" onClick={handleRegister}>Sign Up</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

IndexPage.propTypes = {};

export default IndexPage;

