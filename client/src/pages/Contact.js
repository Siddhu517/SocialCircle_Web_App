import React, { useState } from "react";
import "./contact.css";
import Navbar from "./../components/Home/Navbar/Navbar";
import { contactFormSubmit } from "../services/AuthApis";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const onChangeData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    //console.log(formData);
    const res = await contactFormSubmit(formData);
    //console.log(res);
    if (res.data.status !== "ok") {
      toast.error(res.data.error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    toast.success(res.data.message);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="container-fluid contact-container">
      <div className="row">
        <Navbar display="hidden" />
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col contactForm">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="name">Name:</label>
                  <input
                    type="text"
                    name="name"
                    onChange={(e) => onChangeData(e)}
                  />
                </div>
                <div className="form-group">
                  <label className="name">Email:</label>
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => onChangeData(e)}
                  />
                </div>
                <div className="form-group">
                  <label className="name">Contact_No:</label>
                  <input
                    type="number"
                    name="contact"
                    onChange={(e) => onChangeData(e)}
                  />
                </div>
                <div className="form-group">
                  <label className="name d-flex align-self-start">
                    Message:
                  </label>
                  <textarea
                    type="text"
                    className="ms-5"
                    name="message"
                    onChange={(e) => onChangeData(e)}
                  />
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-success w-75 "
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
