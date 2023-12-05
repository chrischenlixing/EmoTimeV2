import React, { useEffect } from "react";
import UseCheckMsg from "../hooks/UseCheckMsg";
import { Link } from "react-router-dom";

function RegisterPage() {
  const registerURL = '/api/register/';

  const handleSubmit = (e) => {
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let position = document.getElementById("position").value;

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
    if (!position || position === "") {
      alert("Position Shouldn't be Empty.");
      e.preventDefault();
      return false;
    }

    return true;
  };

  UseCheckMsg();

  useEffect(() => {
    document.getElementById("register-form").action = registerURL;
  }, [registerURL]);

  return (
    <div className="gradient-custom-3" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <main>
        <div className="container">
          <div id="Register-row" className="row justify-content-center align-items-center">
            <div id="Register-column" className="col-md-6">
              <div id="Register-box" className="col-md-12">
                <form
                  id="register-form"
                  className="form px-5"
                  action="/"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="card">
                    <div className="card-body">
                      <div className="form-group mb-4">
                      <h1 className="register-login-title">Create an Account</h1>
                        <label htmlFor="username" className="aoe-text">
                          Username:
                        </label>
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="form-control"
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
                        />
                      </div>
                      <div className="form-group mb-4">
                        <label htmlFor="position" className="aoe-text">
                          Position:
                        </label>
                        <select className="form-select" name="position" id="position">
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-info btn-lg aoe-btn-submit">Register</button>
                        {/* Cancel button with Link */}
                        <Link to="/" className="btn aoe-btn-cancel btn-lg ml-2">Cancel</Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

RegisterPage.propTypes = {};

export default RegisterPage;
