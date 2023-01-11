import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const AuthForm = ({
  isLoading,
  enterOTP,
  page,
  setPage,
  handleChange,
  clearData,
  handleSubmit,
  formData,
  setDisplay,
  display,
  handleOTPChange,
  handleSubmitOTP,
  handleSendOTP,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className={
        page === "Login"
          ? "formLogin"
          : page === "Register"
          ? "formRegister"
          : "formReset-password"
      }
    >
      {(page === "Login" || page === "Register") && (
        <div className="form-group">
          <small>
            <label className="form-label">Username</label>
          </small>
          <input
            type="text"
            name="username"
            placeholder={page === "Login" ? "Username / Email Id" : "Username"}
            value={formData.username}
            className="form-control"
            onChange={handleChange}
          />
        </div>
      )}

      {(page === "Register" || page === "Reset-password") && (
        <div className="form-group">
          <small>
            <label className="form-label">Email</label>
          </small>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            className="form-control"
            onChange={handleChange}
          />
        </div>
      )}

      {page === "Reset-password" && (
        <div className="input-group mb-2 mt-3">
          <span
            className="input-group-text bg-info "
            id="basic-addon2"
            onClick={handleSendOTP}
            role="button"
          >
            SendOTP
          </span>
          <input
            className="form-control"
            placeholder="Enter OTP"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            type="number"
            name="otp"
            value={enterOTP}
            onChange={handleOTPChange}
          />
          <span
            className="input-group-text bg-success text-light"
            id="basic-addon2"
            onClick={handleSubmitOTP}
            role="button"
          >
            Submit
          </span>
        </div>
      )}

      {(page === "Login" ||
        page === "Register" ||
        page === "Reset-password") && (
        <div className="form-group">
          <small>
            <label className="form-label">Password</label>
          </small>
          <input
            type="password"
            name="password"
            placeholder="Password is should be 6 char long"
            value={formData.password}
            className="form-control"
            onChange={handleChange}
            disabled={display}
          />
        </div>
      )}

      {page === "Reset-password" && (
        <div className="form-group">
          <small>
            <label className="form-label">Confirm_Password</label>
          </small>
          <input
            type="password"
            placeholder="ConfirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            className="form-control disabled"
            onChange={handleChange}
            disabled={display}
          />
        </div>
      )}

      {page === "Login" && (
        <div className="mt-2">
          <Link
            to="/reset-password"
            className="text-danger nav-link"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setPage("Reset-password");
              clearData();
              setDisplay(true);
            }}
          >
            forgot-password?
          </Link>
        </div>
      )}

      {page === "Register" && (
        <div className="form-group">
          <small>
            <label className="form-label">Contact_No</label>
          </small>
          <input
            type="number"
            name="contact"
            placeholder="Mobile No...+91"
            value={formData.contact}
            className="form-control"
            onChange={handleChange}
          />
        </div>
      )}
      {page === "Register" && (
        <div className="input-group mt-3">
          <select
            className="form-select"
            id="inputGroupSelect04"
            aria-label="Example select with button addon"
            name="gender"
            onChange={handleChange}
            defaultValue={"Gender"}
          >
            <option value="Gender">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
      {page === "Register" && (
        <div className="form-group mt-2">
          <small>
            <label className="form-label">DateOfBirth</label>
          </small>
          <input
            type="date"
            name="dateofbirth"
            value={formData.dateofbirth}
            className="form-control"
            onChange={handleChange}
          />
        </div>
      )}
      <div className="form-group mt-4 ">
        <div class="btn-group w-100" role="group" aria-label="Basic example">
          <button
            type="submit"
            class="btn btn-primary w-75"
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm me-3 fs-4"
                role="status"
                aria-hidden="true"
              ></span>
            ) : null}
            Submit
          </button>
          <button type="button" class="btn btn-danger w-25" onClick={clearData}>
            Reset
          </button>
        </div>
      </div>
      {(page === "Login" || page === "Register") && (
        <div className="form-group">
          <button
            style={{ visibility: "hidden" }}
            className="btn btn-success w-100"
          >
            Google
          </button>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
