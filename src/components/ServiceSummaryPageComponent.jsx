import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import HeaderPageComponent from "./HeaderPageComponent";
import { AiOutlinePlus, AiOutlineInfoCircle } from "react-icons/ai";
import { PiTrashLight } from "react-icons/pi";
import { LuEdit } from "react-icons/lu";
import { IoBarChartOutline } from "react-icons/io5";

const ServiceSummaryPageComponent = () => {
  const [services, setServices] = useState([]);
  const [registrationSuccessResponse, setRegistrationSuccessResponse] =
    useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  useEffect(() => {
    // Fetch services from the API
    fetch("http://localhost:5000/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {isSuccessMessageVisible && (
          <div
            style={{
              backgroundColor: "#F0FFF4",
              color: "rgb(9, 9, 9)",
              borderRadius: "5px",
              padding: "16px 8px",
              marginTop: "1rem",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              maxWidth: "700px",
            }}
          >
            <i
              class="bi bi-check-circle"
              style={{ color: "green", marginRight: "5px" }}
            ></i>
            <span style={{ color: "green", marginRight: "5px" }}>All set:</span>{" "}
            Successfully registered your AWD ID. Let's get started on the next
            steps.
            <button
              type="button"
              className="ml-2 close"
              onClick={handleSuccessMessageClose}
            >
              &times;
            </button>
          </div>
        )}
      </div>
      <div className="service-summary-container">
        {services.map((service) => (
          <div key={service.id} className="service-block">
            <div className="service-header">
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 className="mb-0 mr-3">{service.serviceName} </h3>
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip("Service Name")}
                >
                  <AiOutlineInfoCircle size={22} className="mr-3" />
                  {/* <i className="bi bi-info-circle tooltip-icon mr-3"></i> */}
                </OverlayTrigger>
                <div
                  className={`pl-3 service-status ${
                    service.authorizationStatus
                      ? "service-status-authorized"
                      : "service-status-unauthorized"
                  }`}
                  style={{ borderLeft: "2px solid #C8DAEB", lineHeight: 2.25 }}
                >
                  Authorization Status:{" "}
                  {service.authorizationStatus
                    ? "Authorized"
                    : "Not Authorized"}
                </div>
              </div>
              <div>
                {service.instances.length < 2 ? (
                  <Link to={`/ServiceItems/${service.id}`}>
                    <span className="add-link">
                      <AiOutlinePlus size={26} /> Add Service
                    </span>
                  </Link>
                ) : (
                  <span className="add-link-disabled">
                    <AiOutlinePlus size={26} /> Add Service
                  </span>
                )}
              </div>
            </div>
            <table className="instance-table">
              <thead className="table-heading">
                <tr>
                  <th className="table-cell">
                    <span>Instance Id </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Instance Id")}
                    >
                      <AiOutlineInfoCircle />
                      {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                    </OverlayTrigger>
                  </th>
                  <th className="table-cell">
                    <span>Instance Name </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Instance Name")}
                    >
                      <AiOutlineInfoCircle />
                      {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                    </OverlayTrigger>
                  </th>
                  <th className="table-cell">
                    <span>Start Date & Time </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Start Date & Time")}
                    >
                      <AiOutlineInfoCircle />
                      {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                    </OverlayTrigger>
                  </th>
                  <th className="table-cell">
                    <span> End Date & Time </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("End Date & Time")}
                    >
                      <AiOutlineInfoCircle />
                      {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                    </OverlayTrigger>
                  </th>
                  <th className="table-cell text-center">
                    <span>Action </span>
                    <OverlayTrigger
                      placement="top"
                      overlay={renderTooltip("Action")}
                    >
                      <AiOutlineInfoCircle />
                      {/* <i className="bi bi-info-circle tooltip-icon"></i> */}
                    </OverlayTrigger>
                  </th>
                </tr>
              </thead>
              <tbody>
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
                        className="p-0 m-2 remove-outline"
                        variant="link"
                        onClick={() => console.log("edit")}
                      >
                        <LuEdit size={22} color="#1B5962" />
                      </Button>
                      <Button
                        className="p-0 m-2 remove-outline"
                        variant="link"
                        onClick={() => console.log("chart")}
                      >
                        <IoBarChartOutline size={22} color="#1B5962" />
                      </Button>
                      <Button
                        className="p-0 m-2 remove-outline"
                        variant="link"
                        onClick={() =>
                          handleDeleteInstance(service.id, instance.instanceId)
                        }
                      >
                        <PiTrashLight size={22} color="#1B5962" />
                        {/* <i className="bi bi-trash"></i> */}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSummaryPageComponent;
