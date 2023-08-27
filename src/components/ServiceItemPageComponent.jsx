import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderPageComponent from './HeaderPageComponent';
import Select from 'react-select';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
const ServiceItemPageComponent = () => {
    const formData = useSelector(state => state);
    const { instanceId } = useParams();
    const handleTimezoneChange = (timezone) => {
        setSelectedTimezone(timezone);
    };

    // State for the form inputs
    const [selectedId, setSelectedId] = useState('');
    const [applyForAllIds, setApplyForAllIds] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [showAddTagFields, setShowAddTagFields] = useState(false);
    const [tagKey, setTagKey] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [tags, setTags] = useState([]);

    // Function to handle adding a tag
    const handleAddTag = () => {
        if (tagKey && tagValue && tags.length < 50) {
            setTags([...tags, { key: tagKey, value: tagValue }]);
            setTagKey('');
            setTagValue('');
            setShowAddTagFields(false);
        }
    };

    // Function to handle removing a tag
    const handleRemoveTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
    };
    const timezones = moment.tz.names().map((tz) => ({ value: tz, label: tz }));
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // Function to handle form submission
    const handleSubmit = () => {
        // Process and submit the form data as needed
        // ...
    };
    const handleDayChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <div>
            <HeaderPageComponent />
            <div className="d-flex justify-content-center " style={{ minHeight: '100vh', color: '#2D3748', fontSize: 20, fontFamily: 'Nunito', fontWeight: '400', wordWrap: 'break-word' }}>
                <div className="text-center">

                    <h3>Add Service</h3>
                    <p >Lorem ipsum dolor sit amet consectetur. Commodo in tristique hendrerit porta viverra at.</p>
                    <div>
                        <h2>Service Item Page</h2>
                        <p>AWD ID: {formData.formData.awdId}</p>
                        <p>AWD Region: {formData.formData.awdRegion}</p>
                    </div>
                    <p>Instance Id: {instanceId}</p>
                    <label>ID Select Box:</label>
                    <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                        <option value="">Select an ID</option>
                        <option value="id1">ID 1</option>
                        <option value="id2">ID 2</option>
                        {/* ... Other options ... */}
                    </select>
                    <div>
                        <input
                            type="checkbox"
                            checked={applyForAllIds}
                            onChange={(e) => setApplyForAllIds(e.target.checked)}
                        />
                        Apply for all IDs
                    </div>
                    <div>
                        <label>Timezone:</label>
                        <Select
                            value={selectedTimezone}
                            onChange={handleTimezoneChange}
                            options={timezones}
                        />
                    </div>
                    <div>
                        <label>End Date & Time:</label>
                        <input
                            type="datetime-local"
                            value={selectedEndDate}
                            onChange={(e) => setSelectedEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Days of the Week:</label>
                        {daysOfWeek.map((day) => (
                            <div key={day}>
                                <input
                                    type="checkbox"
                                    checked={selectedDays.includes(day)}
                                    onChange={() => handleDayChange(day)}
                                />
                                {day}
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>Tags</h3>
                        <button onClick={() => setShowAddTagFields(true)}>Add Tag</button>
                        {showAddTagFields && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tag Key"
                                    value={tagKey}
                                    onChange={(e) => setTagKey(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Tag Value (max 20 characters)"
                                    value={tagValue}
                                    maxLength={20}
                                    onChange={(e) => setTagValue(e.target.value)}
                                />
                                <button onClick={handleAddTag}>Add</button>
                                <button onClick={() => setShowAddTagFields(false)}>Clear</button>
                            </div>
                        )}
                        <ul>
                            {tags.map((tag, index) => (
                                <li key={index}>
                                    {tag.key}: {tag.value}
                                    <button onClick={() => handleRemoveTag(index)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={handleSubmit}>Add Service</button>
                </div>
            </div>
        </div>
    );
};



export default ServiceItemPageComponent;
