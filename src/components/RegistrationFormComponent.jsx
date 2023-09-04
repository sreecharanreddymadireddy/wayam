import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Form,
  Tooltip,
} from "react-bootstrap";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setFormData } from "../redux/formDataActions";

const RegistrationFormComponent = () => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const formData = useSelector((state) => state.formData);
  const [selectedServiceContent, setSelectedServiceContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [regions, setRegions] = useState([]);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isServiceErrorVisible, setIsServiceErrorVisible] = useState(false);
  const [errors, setErrors] = useState({
    awdId: "",
    awdRegion: "",
    planType: null,
    service: null,
  });

  const simulateBackendError = (maskedEmail, isVisible) => {
    const errorMessage = `The AWS Account ID is already in use by b*****u@g****.com. Please choose another AWS Account.`;
    setErrorMessage(errorMessage);
    setIsErrorVisible(isVisible);
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("http://localhost:5000/regions");
        const data = await res.json();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  const schema = yup.object().shape({
    awdId: yup
      .string()
      .matches(/^\d+$/, "AWD ID  is required")
      .required("AWD ID  is required"),
    awdRegion: yup.string().required("AWD Region is required"),
    planType: yup.bool().oneOf([true], "error"),
    service: yup.bool().oneOf([true], "error"),
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    if (validateForm()) {
      console.log("Form data:", formData);
      dispatch(setFormData(formData));
      history.push("/Services");
    }
    if (formData.planType === "") {
      setSubmitted(true); // Mark the form as submitted
    }
    if (formData.services.length === 0) {
      setIsServiceErrorVisible(true);
    } else {
      // Handle your form submission logic here
      // ...
      setIsServiceErrorVisible(false); // Reset service error visibility
      setSubmitted(true); // Mark the form as submitted
    }
  };

  const validateForm = () => {
    try {
      schema.validateSync(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFormData = { ...formData };

    if (name === "awdId") {
      if (!/^\d*$/.test(value)) {
        return;
      }
      setErrors((prevErrors) => ({ ...prevErrors, awdId: "" }));
      updatedFormData = { ...updatedFormData, awdId: value };
    }

    if (name === "awdRegion") {
      setErrors((prevErrors) => ({ ...prevErrors, awdRegion: "" }));
      updatedFormData = { ...updatedFormData, awdRegion: value };
    }

    if (type === "checkbox") {
      setErrors((prevErrors) => ({ ...prevErrors, service: null }));
      const updatedServices = checked
        ? [...formData.services, value]
        : formData.services.filter((service) => service !== value);
      updatedFormData = { ...updatedFormData, services: updatedServices };
    }

    if (type === "radio") {
      setErrors((prevErrors) => ({ ...prevErrors, planType: null }));
      updatedFormData = { ...updatedFormData, [name]: value };
    }
    dispatch(setFormData(updatedFormData));
  };

  const handleServiceClick = (serviceText) => {
    setSelectedServiceContent(serviceText);
  };

  return (
    <Container fluid>
      <Row className="gradient-form">
        <Col
          md={6}
          className={`${selectedServiceContent ? 'custom-col-highlight' : 'custom-col-style'
            }`}
        >
          {!selectedServiceContent && (
            <div className="my-5 py-5 mx-auto logo-container">
              <img src={"/logo.png"} alt="Example" className="logo" />
            </div>
          )}
          {!selectedServiceContent ? ( // Check if selectedServiceContent is falsy
            <div className="d-flex flex-column align-items-start ml-md-5 my-4">
              <h1 className="custom-heading">
                Your Cloud Cost
                <span>Remote Controller</span>
              </h1>
              <div className="custom-description mt-2">
                This tool helps you control your cloud costs. It
                <span>provides you with insights into your spending</span>
                <span>and helps you identify areas where you can</span>
                <span>save money.</span>
              </div>
            </div>
          ) : null}

          {selectedServiceContent ? (
            <div className="d-flex flex-column align-items-start p-4">
              {selectedServiceContent}
              <p>
                This tool helps you control your cloud costs. It provides you
                with insights into your spending and helps you identify areas
                where you can save money. . Lorem ipsum dolor sit amet
                consectetur. . Rhoncus integer fermentum mattis nec adipiscing
                accumsan. Ipsum elit at nisi consectetur augue erat tempus. .
                Rhoncus metus duis aliquam est aliquam scelerisque enim.
                Scelerisque mauris risus consectetur amet aenean. . Sit mauris
                egestas enim varius eros phasellus fringilla lectus facilisis. .
                Dictum magna consequat vitae diam convallis justo malesuada
                consectetur. Ut arcu eu diam arcu.
              </p>
            </div>
          ) : null}
        </Col>


        <Col
          md={6}
          className="overflow-auto p-md-5 p-3 mx-auto ml-md-0"
          //   style={{ maxWidth: "540px" }}
        >
          <div className="d-flex align-items-start flex-column">
            <h2
              style={{
                color: "#2D3748",
                fontSize: "32px",
                fontFamily: "RalewaySemiBold",
                lineHeight: "40px",
                wordWrap: "break-word",
              }}
            >
              Register
            </h2>
            <p
              style={{
                color: "#2D3748",
                fontSize: "14px",
                fontFamily: "RobotoRegular",
                lineHeight: "24px",
                wordWrap: "break-word",
              }}
            >
              Please register with your AWS account & select the{" "}
              <span style={{ display: "block" }}>
                appropriate plan and services you require.
              </span>
            </p>
          </div>
          <div>
            {isErrorVisible && (
              <div className="aws-account-error custom-error mb-3">
                <div
                  className="error-content"
                  style={{ display: "flex", alignItems: "flex-start" }}
                >
                  <div
                    className="error-title"
                    style={{
                      marginRight: "5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="bi bi-exclamation-octagon"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Error:
                  </div>
                  <div className="error-message-container">{errorMessage}</div>
                  <i
                    className="bi bi-x"
                    style={{
                      color: "#6B7280",
                      cursor: "pointer",
                      fontSize: "38px",
                    }}
                    onClick={() => setIsErrorVisible(false)}
                  ></i>
                </div>
              </div>
            )}
          </div>

          <Form noValidate onSubmit={handleFormSubmit}>
            <div style={{ maxWidth: "410px" }}>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-start">
                  <Form.Label className="custom-label">
                    AWD ID<span className="text-danger">*</span>{" "}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip">
                          <div class="tooltip__arrow" ></div>
                          <span className="d-flex align-items-start tooltip-heading">
                            Lorem ipsum
                          </span>
                          <span className="tooltip-content d-flex align-items-start">
                            Lorem ipsum dolor sit amet consectetur. Arcu urna
                            commodo sociis turpis aliquam risus blandit. Quam
                            tincidunt condimentum semper non tellus.
                          </span>
                        </Tooltip>
                      }
                    >
                      <i className="bi bi-info-circle small"></i>

                    </OverlayTrigger>
                  </Form.Label>
                </div>
                <Form.Control
                  type="text"
                  name="awdId"
                  placeholder="Add AWD ID"
                  value={formData.awdId}
                  onChange={handleInputChange}
                  isInvalid={!!errors.awdId}
                  required
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="error-feedback"
                >
                  {errors.awdId}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 custom-label">
                <div className="d-flex align-items-start">
                  <Form.Label>
                    AWD Region<span className="text-danger">*</span>{" "}
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip">
                          <div class="tooltip__arrow"></div>
                          <span className="d-flex align-items-start tooltip-heading">
                            Lorem ipsum
                          </span>

                          <span className="tooltip-content d-flex align-items-start">
                            Lorem ipsum dolor sit amet consectetur. Arcu urna
                            commodo sociis turpis aliquam risus blandit. Quam
                            tincidunt condimentum semper non tellus.
                          </span>
                        </Tooltip>
                      }
                    >
                      <i className="bi bi-info-circle small"></i>
                    </OverlayTrigger>
                  </Form.Label>
                </div>
                <Form.Control
                  as="select"
                  name="awdRegion"
                  value={formData.awdRegion}
                  onChange={handleInputChange}
                  isInvalid={!!errors.awdRegion}
                  required
                >
                  <option value="" className="default-option">
                    Select AWD Region
                  </option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback
                  type="invalid"
                  className="error-feedback"
                >
                  {errors.awdRegion}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-2">
                <div className="d-flex align-items-start">
                  <Form.Label className="mr-2 custom-label">
                    Plan Type<span className="text-danger">*</span>
                  </Form.Label>
                </div>
                <div
                  className={`d-flex align-items-center ${
                    errors.planType !== null && "is-invalid"
                  }`}
                >
                  <Form.Check
                    type="radio"
                    name="planType"
                    id="freeForEver"
                    label={
                      <span className={`mr-3 ml-0 form-check-label`}>
                        Free For Ever{" "}
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip">
                              <div class="tooltip__arrow"></div>
                              <span className="d-flex align-items-start tooltip-heading">
                                Lorem ipsum
                              </span>

                              <span className="tooltip-content d-flex align-items-start">
                                Lorem ipsum dolor sit amet consectetur. Arcu
                                urna commodo sociis turpis aliquam risus
                                blandit. Quam tincidunt condimentum semper non
                                tellus.
                              </span>
                            </Tooltip>
                          }
                        >
                          <i className="bi bi-info-circle tooltip-icon ml-1"></i>
                        </OverlayTrigger>
                      </span>
                    }
                    value="Free For Ever"
                    checked={formData.planType === "Free For Ever"}
                    onChange={handleInputChange}
                  />
                  <div className="d-flex ml-3">
                    <Form.Check
                      type="radio"
                      name="planType"
                      id="premium"
                      label={
                        <span className={`mr-3 ml-0 form-check-label`}>
                          Premium{" "}
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip">
                                <div class="tooltip__arrow"></div>
                                <span className="d-flex align-items-start tooltip-heading">
                                  Lorem ipsum
                                </span>

                                <span className="tooltip-content d-flex align-items-start">
                                  Lorem ipsum dolor sit amet consectetur. Arcu
                                  urna commodo sociis turpis aliquam risus
                                  blandit. Quam tincidunt condimentum semper non
                                  tellus.
                                </span>
                              </Tooltip>
                            }
                          >
                            <i className="bi bi-info-circle tooltip-icon ml-1"></i>
                          </OverlayTrigger>
                        </span>
                      }
                      value="Premium"
                      checked={formData.planType === "Premium"}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Form.Group>
              {submitted && formData.planType === "" && (
                <div className="error-message1 mb-3">Select a plan type</div>
              )}
            </div>
            <div style={{ maxWidth: "440px" }}>
              <Form.Group
                className="mb-3 custom-label"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "white",
                  boxShadow: "0px 2px 3px rgba(3, 59, 105, 0.10)",
                  borderRadius: 8,
                  border: "0.50px #9AE6B4 solid",
                  border: "1px solid lightgreen", // Add border style
                  borderRadius: "10px", // Add border radius
                  padding: "10px",
                }}
              >
                <div className="d-flex align-items-start">
                  <Form.Label>Select Services</Form.Label>
                </div>
                {submitted && errors.service !== null && (
                  <div className="custom-error mb-3">
                    <div
                      className="error-content"
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          marginRight: "5px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div className="error-title">
                          <i
                            className="bi bi-exclamation-octagon"
                            style={{ marginRight: "8px" }}
                          ></i>
                          Error:
                        </div>
                        <div
                          className="error-message-container1"
                          style={{ marginLeft: "10px" }}
                        >
                          Please select atleast one service
                        </div>
                      </div>
                      <i
                        className="bi bi-x"
                        style={{
                          color: "#6B7280",
                          cursor: "pointer",
                          fontSize: "32px",
                        }}
                        onClick={() => setIsServiceErrorVisible(false)}
                      ></i>
                    </div>
                  </div>
                )}
                <div className="service-item mb-3">
                  <div
                    className={`service-checkbox d-flex align-items-start ${
                      errors.service !== null ? "is-invalid" : ""
                    }`}
                  >
                    <Form.Check
                      name="services"
                      id="service1"
                      value="service1"
                      checked={formData.services.includes("service1")}
                      onChange={handleInputChange}
                      label="Service Name 1"
                      className="mr-3 custom-form-check"
                    />
                  </div>

                  <div className="service-content">
                    Lorem ipsum dolor sit amet consectetur. Vel et varius libero
                    diam dictum.{" "}
                    <a
                      href="#"
                      className="link-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleServiceClick("Service 1 text");
                      }}
                    >
                      View Details
                    </a>
                  </div>
                </div>

                <div className="service-item mb-3 ">
                  <div
                    className={`service-checkbox d-flex align-items-start ${
                      errors.service !== null ? "is-invalid" : ""
                    }`}
                  >
                    <Form.Check
                      type="checkbox"
                      name="services"
                      id="service2"
                      value="service2"
                      checked={formData.services.includes("service2")}
                      onChange={handleInputChange}
                      label="Service Name 2"
                      className="mr-3 custom-form-check"
                    />
                  </div>

                  <div className="service-content">
                    Lorem ipsum dolor sit amet consectetur. Vel et varius libero
                    diam dictum.{" "}
                    <a
                      href="#"
                      className="link-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleServiceClick("Service 1 text");
                      }}
                    >
                      View Details
                    </a>
                  </div>
                </div>

                <div className="service-item mb-3">
                  <div
                    className={`service-checkbox d-flex align-items-start ${
                      errors.service !== null ? "is-invalid" : ""
                    }`}
                  >
                    <Form.Check
                      name="services"
                      id="service3"
                      value="service3"
                      checked={formData.services.includes("service3")}
                      onChange={handleInputChange}
                      label="Service Name 3"
                      className="mr-3 custom-form-check"
                    />
                  </div>

                  <div className="service-content">
                    Lorem ipsum dolor sit amet consectetur. Vel et varius libero
                    diam dictum.{" "}
                    <a
                      href="#"
                      className="link-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleServiceClick("Service 3 text");
                      }}
                    >
                      View Details
                    </a>
                  </div>
                </div>

                <div className="service-item mb-3">
                  <div
                    className={`service-checkbox d-flex align-items-start ${
                      errors.service !== null ? "is-invalid" : ""
                    }`}
                  >
                    <Form.Check
                      type="checkbox"
                      name="services"
                      id="service4"
                      value="service4"
                      checked={formData.services.includes("service4")}
                      onChange={handleInputChange}
                      label="Service Name 4"
                      className="mr-3 custom-form-check"
                    />
                  </div>

                  <div className="service-content">
                    Lorem ipsum dolor sit amet consectetur. Vel et varius libero
                    diam dictum.{" "}
                    <a
                      href="#"
                      className="link-button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleServiceClick("Service 4 text");
                      }}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </Form.Group>
              <div className="button-container">
                <Button type="submit" className="btn-primary custom-button">
                  Register
                </Button>
              </div>

              <div className="mt-3 button-containe">
                <Button
                  type="submit"
                  className="btn-primary custom-button"
                  onClick={() =>
                    simulateBackendError("example@example.com", true)
                  }
                >
                  Simulate Backend Error
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationFormComponent;
