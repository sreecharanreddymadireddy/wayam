import React, { useState, useEffect } from "react";
import HeaderPageComponent from "./HeaderPageComponent";
import { Form } from "react-bootstrap";
import Select from "react-select";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { PiTrashLight } from "react-icons/pi";
import { LuGlobe2, LuCalendarClock } from "react-icons/lu";

const ServiceItemPageComponent = () => {
  const [selectedId, setSelectedId] = useState("");
  const [ids, setIds] = useState([]);
  const [applyForAllIds, setApplyForAllIds] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const formData = useSelector((state) => state);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const [tagRows, setTagRows] = useState([]);
  const [tagKeyError, setTagKeyError] = useState(false);
  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone);
  };
  const generateTimezoneOptions = () => {
    const timezones = moment.tz.names();
    const options = timezones.map((tz) => ({
      value: tz,
      label: `${moment().tz(tz).format("z")} - ${tz}`,
    }));
    return options;
  };
  const timezones = generateTimezoneOptions();

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const userIDs = data.map((user) => user.id);
        setIds(userIDs);
      })
      .catch((error) => console.error("Error fetching IDs:", error));
  }, []);

  const handleSubmit = () => {};
  const handleDayChange = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddTagRow = () => {
    if (tagRows.length < 50) {
      setTagRows([...tagRows, { key: "", value: "" }]);
    }
  };

  const handleTagRowChange = (index, field, value) => {
    const newTagRows = [...tagRows];
    newTagRows[index][field] = value;
    setTagRows(newTagRows);

    if (field === "key") {
      const normalizedKey = value.toLowerCase();
      if (normalizedKey.startsWith("aws:")) {
        setTagKeyError(true);
      } else {
        setTagKeyError(false);
      }
    }
  };

  const handleRemoveTagRow = (index) => {
    const newTagRows = tagRows.filter((_, i) => i !== index);
    setTagRows(newTagRows);
  };
  const handleClearForm = () => {
    setSelectedId("");
    setApplyForAllIds(false);
    setSelectedTimezone(null);
    setSelectedEndDate("");
    setSelectedStartDate("");
    setSelectedDays([]);
    setTagRows([]);
    setTagKeyError(false);
  };
  return (
    <div>
      <HeaderPageComponent />
      <div className="add-service main-content mt-5">
        <div className="form-container">
          <div className="form-section serivce-content">
            <h3 className="heading text-center mb-3">Add Service</h3>
            <p className="content text-center mb-4">
              Lorem ipsum dolor sit amet consectetur. Commodo in tristique{" "}
              <span className="d-block">hendrerit porta viverra at.</span>
            </p>
            <div
              className="awd-info row mx-0"
              style={{
                backgroundColor: "#DFF3E7",
                padding: "24px 16px",
                borderRadius: "8px",
              }}
            >
              <div className="col-6 text-left aws-data">
                <p className="heading">AWS ID</p>
                <p className="content mb-0">{formData.formData.awdId}</p>
              </div>
              <div className="col-6 text-left aws-data">
                <p className="heading">AWD Region</p>
                <p className="content mb-0">{formData.formData.awdRegion}</p>
              </div>
            </div>
            <div
              className="mt-3 p-3"
              style={{
                border: "1px solid #F7FAFC",
                borderRadius: "8px",
                boxShadow: "0px 2px 3px 0px #033B691A",
              }}
            >
              <div className="form-field mb-3">
                <label>ID*</label>
                <div className="row">
                  <div className="custom-dropdown col-6 mr-1">
                    <select
                      className="form-control"
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      required
                    >
                      <option selected value="">
                        Select an Option
                      </option>

                      {ids.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pl-3 col-5 pl-4 ml-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={applyForAllIds}
                      onChange={(e) => setApplyForAllIds(e.target.checked)}
                    />
                    <label className="form-check-label">
                      Apply for all IDs
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-field mb-3">
                <label>Timezone*</label>
                <div className="row">
                  <Select
                    className="col-6"
                    value={selectedTimezone}
                    onChange={handleTimezoneChange}
                    options={timezones}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        minHeight: "30px",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="form-field mb-3">
                <div className="row">
                  <div className="col-6">
                    <label>Start Date & Time*</label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label>End Date & Time*</label>

                    <input
                      className="form-control"
                      type="datetime-local"
                      value={selectedEndDate}
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <label className="days-week">Days of the Week</label>
              <div
                className="form-field"
                style={{ display: "flex", flexDirection: "row", gap: "35px" }}
              >
                {daysOfWeek.map((day) => (
                  <label
                    key={day}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      style={{ width: "16px", height: "16px" }}
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                    />
                    <span className="day ml-2">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div
              className="my-3 p-3"
              style={{
                border: "1px solid #F7FAFC",
                borderRadius: "8px",
                boxShadow: "0px 2px 3px 0px #033B691A",
              }}
            >
              <div className="form-field tags">
                <label>Tag</label>
                <span className="add-link ml-4" onClick={handleAddTagRow}>
                  <AiOutlinePlus size={24} color="#1B5962" /> Add Tag
                </span>
                {tagRows.map((tagRow, index) => (
                  <div key={index} className="tag-section mt-2">
                    <div className="tag-inputs">
                      <div className="row">
                        <div className="col-6">
                          <label>Name</label>
                        </div>
                        <div className="col-5">
                          <label>Value</label>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-6"
                          // style={{ position: "relative", marginRight: "10px" }}
                        >
                          <Form.Control
                            type="text"
                            name="add-name"
                            placeholder="Add name"
                            value={tagRow.key}
                            onChange={(e) =>
                              handleTagRowChange(index, "key", e.target.value)
                            }
                            className={
                              tagKeyError &&
                              tagRow.key &&
                              tagRow.key.toLowerCase().startsWith("aws:")
                                ? "error-input"
                                : ""
                            }
                          />

                          {tagKeyError &&
                            tagRow.key &&
                            tagRow.key.toLowerCase().startsWith("aws:") && (
                              <div className="error-message">
                                Key cannot start with 'aws:'
                              </div>
                            )}
                        </div>
                        <div className="col-5">
                          <Form.Control
                            type="text"
                            name="add-value"
                            placeholder="Add value"
                            value={tagRow.value}
                            maxLength={20}
                            onChange={(e) =>
                              handleTagRowChange(index, "value", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-1 pl-0 text-center">
                          <span
                            onClick={() => handleRemoveTagRow(index)}
                            style={{ cursor: "pointer" }}
                          >
                            {/* <i className="bi bi-trash"></i> */}
                            <PiTrashLight size={24} color="#5A697B" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="form-field d-flex justify-content-end align-items-end mb-5">
              <button
                className="btn custom-outline-button mr-2 px-4"
                onClick={handleClearForm}
              >
                Clear Form
              </button>
              <button className="btn custom-button px-4" onClick={handleSubmit}>
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceItemPageComponent;
