import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import HeaderPageComponent from "./HeaderPageComponent";
import { AiOutlinePlus, AiOutlineInfoCircle } from "react-icons/ai";
import { PiTrashLight } from "react-icons/pi";
import { BiSolidCheckCircle } from "react-icons/bi";
import { LuEdit } from "react-icons/lu";
// import { IoBarChartOutline } from "react-icons/io5";

const ServiceSummaryPageComponent = () => {
  const [services, setServices] = useState([]);
  const [registrationSuccessResponse, setRegistrationSuccessResponse] =
    useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  // const dispatch = useDispatch();
  // const formData = useSelector((state) => state.formData);

  useEffect(() => {
    // Fetch services from the API
    fetch("http://localhost:5000/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => console.error("Error fetching services:", error));

    // Fetch registration success response from the API (assuming it's under the key "registrationSuccessResponse")
    fetch("http://localhost:5000/registrationSuccessResponse")
      .then((response) => response.json())
      .then((data) => {
        setRegistrationSuccessResponse(data.success);
        console.log("Fetched registration success response:", data.success);
      })
      .catch((error) =>
        console.error("Error fetching registration success response:", error)
      );
  }, []);

  const handleDeleteInstance = (serviceId, instanceId) => {
    // Delete logic based on serviceId and instanceId
    // For example, if you want to remove the instance from the service's instances array:
    const updatedServices = services.map((service) => {
      if (service.id === serviceId) {
        const updatedInstances = service.instances.filter(
          (instance) => instance.instanceId !== instanceId
        );
        return { ...service, instances: updatedInstances };
      }
      return service;
    });

    setServices(updatedServices);
  };
  const handleSuccessMessageClose = () => {
    setIsSuccessMessageVisible(false);
  };
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  useEffect(() => {
    if (registrationSuccessResponse) {
      setIsSuccessMessageVisible(true);
      console.log("registrationSuccessResponse" + registrationSuccessResponse);
    }
  }, [registrationSuccessResponse]);
  console.log("setIsSuccessMessageVisible" + isSuccessMessageVisible);
  return (
    <div className="container-fluid">
      <HeaderPageComponent />
      {isSuccessMessageVisible && (
        <div
          className="w-100 font-Nunito text-black d-flex align-items-center justify-content-between mx-auto"
          style={{
            backgroundColor: "#F0FFF4",
            color: "rgb(9, 9, 9)",
            borderRadius: "5px",
            padding: "16px 8px",
            border: "1px solid #2F855A",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            maxWidth: "845px",
            fontSize: "14px",
            lineHeight: "24px",
          }}
        >
          <span>
            <BiSolidCheckCircle size={16} color="#2F855A" className="mr-1" />
            <span style={{ color: "green", marginRight: "5px" }}>
              All set:
            </span>{" "}
            Successfully registered your AWD ID. Let's get started on the next
            steps.
          </span>
          <button
            type="button"
            className="ml-2 close"
            onClick={handleSuccessMessageClose}
          >
            &times;
          </button>
        </div>
      )}
      <div className="text-center py-4 serivce-content">
        <h2 className="heading mb-3">Summary of All Services Selected</h2>
        <p className="content">
          Lorem ipsum dolor sit amet consectetur. Commodo in tristique{" "}
          <span className="d-block">hendrerit porta viverra at.</span>
        </p>
      </div>
      <div className="service-summary-container">
        {services.map((service) => (
          <div className="service-main-block">
            <div key={service.id} className="service-block">
              <div className="service-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="d-flex align-items-center">
                    <h3 className="mb-0 mr-1">{service.serviceName} </h3>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Service Name")}
                    >
                      <AiOutlineInfoCircle
                        size={17}
                        color="#1B5962"
                        className="mr-3"
                      />
                      {/* <i className="bi bi-info-circle tooltip-icon mr-3"></i> */}
                    </OverlayTrigger>
                  </div>
                  <div
                    className={`pl-3 service-status`}
                    style={{ borderLeft: "2px solid #C8DAEB" }}
                  >
                    Authorization Status:{" "}
                    <span
                      className={
                        service.authorizationStatus
                          ? "service-status-authorized"
                          : "service-status-unauthorized"
                      }
                    >
                      {service.authorizationStatus ? "Approved" : "Denied"}
                    </span>
                  </div>
                </div>
                <div>
                  {service.instances.length < 2 ? (
                    <Link
                      to={`/ServiceItems/${service.id}`}
                      className="add-link d-flex align-items-center"
                    >
                      <AiOutlinePlus size={24} color="#1B5962" />{" "}
                      <span>Add Service</span>
                    </Link>
                  ) : (
                    <span className="add-link disabled d-flex align-items-center">
                      <AiOutlinePlus size={24} color="#1B5962" />{" "}
                      <span>Add Service</span>
                    </span>
                  )}
                </div>
              </div>
              <table className="instance-table">
                <thead className="table-heading">
                  {service.instances.length > 0 && (
                    <tr>
                      <th className="table-cell">
                        <span>Instance Id </span>
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("Instance Id")}
                        >
                          <AiOutlineInfoCircle
                            className="ml-1"
                            size={16}
                            color="#1B5962"
                          />
                          {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                        </OverlayTrigger>
                      </th>
                      <th className="table-cell">
                        <span>Instance Name </span>
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("Instance Name")}
                        >
                          <AiOutlineInfoCircle
                            className="ml-1"
                            size={16}
                            color="#1B5962"
                          />
                          {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                        </OverlayTrigger>
                      </th>
                      <th className="table-cell">
                        <span>Start Date & Time </span>
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("Start Date & Time")}
                        >
                          <AiOutlineInfoCircle
                            className="ml-1"
                            size={16}
                            color="#1B5962"
                          />
                          {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                        </OverlayTrigger>
                      </th>
                      <th className="table-cell">
                        <span> End Date & Time </span>
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("End Date & Time")}
                        >
                          <AiOutlineInfoCircle
                            className="ml-1"
                            size={16}
                            color="#1B5962"
                          />
                          {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                        </OverlayTrigger>
                      </th>
                      <th className="table-cell text-center">
                        <span>Action </span>
                        <OverlayTrigger
                          placement="top"
                          overlay={renderTooltip("Action")}
                        >
                          <AiOutlineInfoCircle
                            className="ml-1"
                            size={16}
                            color="#1B5962"
                          />
                          {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                        </OverlayTrigger>
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {service.instances.length > 0 ? (
                    <>
                      {service.instances.map((instance) => (
                        <tr key={instance.instanceId} className="table-row">
                          <td className="table-cell">{instance.instanceId}</td>
                          <td className="table-cell">
                            <Link to={`/instance/${instance.instanceId}`}>
                              {instance.instanceName}
                            </Link>
                          </td>
                          <td className="table-cell">{instance.startDate}</td>
                          <td className="table-cell">{instance.endDate}</td>
                          <td className="table-cell text-center">
                            <Button
                              className="p-0 mx-2 remove-outline"
                              variant="link"
                              onClick={() => console.log("edit")}
                            >
                              <LuEdit size={16} color="#1B5962" />
                            </Button>
                            <Button
                              className="p-0 mx-2 remove-outline"
                              variant="link"
                              onClick={() => console.log("chart")}
                            >
                              <img src="/bar-chart-big.svg" alt="bar chart" />
                              {/* <IoBarChartOutline size={22} color="#1B5962" /> */}
                            </Button>
                            <Button
                              className="p-0 mx-2 remove-outline"
                              variant="link"
                              onClick={() =>
                                handleDeleteInstance(
                                  service.id,
                                  instance.instanceId
                                )
                              }
                            >
                              <PiTrashLight size={16} color="#1B5962" />
                              {/* <i className="bi bi-trash"></i> */}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr className="table-row">
                      <td
                        className="table-cell text-center"
                        style={{ color: "#718096" }}
                      >
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSummaryPageComponent;
