import React, { useState, useEffect } from 'react';
import HeaderPageComponent from './HeaderPageComponent';
import Select from 'react-select';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

const ServiceItemPageComponent = () => {

    const [selectedId, setSelectedId] = useState('');
    const [ids, setIds] = useState([]);
    const [applyForAllIds, setApplyForAllIds] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const formData = useSelector(state => state);
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    const [tagRows, setTagRows] = useState([]);
    const [tagKeyError, setTagKeyError] = useState(false);
    const handleTimezoneChange = (timezone) => {
        setSelectedTimezone(timezone);
    };
    const generateTimezoneOptions = () => {
        const timezones = moment.tz.names();
        const options = timezones.map((tz) => ({
            value: tz,
            label: `${moment().tz(tz).format('z')} - ${tz}`,
        }));
        return options;
    };
    const timezones = generateTimezoneOptions();

    useEffect(() => {
        fetch('http://localhost:5000/users')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const userIDs = data.map(user => user.id);
                setIds(userIDs);
            })
            .catch(error => console.error('Error fetching IDs:', error));
    }, []);

    const handleSubmit = () => {

    };
    const handleDayChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleAddTagRow = () => {
        if (tagRows.length < 50) {
            setTagRows([...tagRows, { key: '', value: '' }]);
        }
    };

    const handleTagRowChange = (index, field, value) => {
        const newTagRows = [...tagRows];
        newTagRows[index][field] = value;
        setTagRows(newTagRows);

        if (field === 'key') {
            const normalizedKey = value.toLowerCase();
            if (normalizedKey.startsWith('aws:')) {
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
        setSelectedId('');
        setApplyForAllIds(false);
        setSelectedTimezone(null);
        setSelectedEndDate('');
        setSelectedStartDate('');
        setSelectedDays([]);
        setTagRows([]);
        setTagKeyError(false);
    };
    return (
        <div>
            <HeaderPageComponent />
            <div className="main-content mt-5">
                <div className="form-container">
                    <div className="form-section">
                        <h3 className="text-center">Add Service</h3>
                        <p>Lorem ipsum dolor sit amet consectetur. Commodo in tristique hendrerit porta viverra at.</p>
                        <div className="awd-info" style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: '#DFF3E7', padding: '2px', borderRadius: '5px' }}>
                            <div>
                                <p>AWD ID:</p>

                                <p>{formData.formData.awdId}</p>
                            </div>
                            <div>
                                <p>AWD Region:</p>

                                <p>{formData.formData.awdRegion}</p>
                            </div>
                        </div>
                        <div className="form-field">
                            <label>ID<span className="text-danger">*</span></label>
                            <div className="d-flex align-items-center">
                                <div className="custom-dropdown">
                                    <select className="form-control" style={{ width: '250px' }} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>

                                        <option value="">Select an Option</option>

                                        {ids.map(id => (
                                            <option key={id} value={id}>
                                                {id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ml-5" style={{ paddingLeft: '25px' }}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={applyForAllIds}
                                        onChange={(e) => setApplyForAllIds(e.target.checked)}
                                    />
                                    <label className="form-check-label">Apply for all IDs</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-field" >
                            <label>Timezone<span className="text-danger">*</span></label>

                            <Select
                                value={selectedTimezone}
                                onChange={handleTimezoneChange}
                                options={timezones}
                                styles={{
                                    control: provided => ({
                                        ...provided,
                                        width: '250px',
                                        minHeight: '30px',
                                    }),
                                }}
                            />
                        </div>
                        <div className="form-field">
                            <div className="d-flex">
                                <div style={{ flex: 1, flexDirection: 'column' }}>
                                    <label>Start Date & Time<span className="text-danger">*</span></label>
                                    <input
                                        type="datetime-local"
                                        value={selectedStartDate}
                                        onChange={(e) => setSelectedStartDate(e.target.value)}
                                    />
                                </div>
                                <div style={{ flex: 1, marginLeft: '1rem', display: 'flex', flexDirection: 'column' }}>
                                    <label>End Date & Time<span className="text-danger">*</span></label>

                                    <input
                                        type="datetime-local"
                                        value={selectedEndDate}
                                        onChange={(e) => setSelectedEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <label>Days of the Week:</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="form-field" style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
                                {daysOfWeek.map((day) => (
                                    <label key={day} style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(day)}
                                            onChange={() => handleDayChange(day)}
                                        />
                                        <span style={{ marginLeft: '5px' }}>{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-field">
                            <label>Tags</label>
                            <span className="add-link ml-4" onClick={handleAddTagRow}>
                                <i className="bi bi-plus-circle"></i> Add
                            </span>
                            {tagRows.map((tagRow, index) => (
                                <div key={index} className="tag-section">
                                    <div className="tag-inputs">
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <label>Key</label>
                                            </div>
                                            <div style={{ paddingLeft: '278px' }}>
                                                <label>Value</label>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div style={{ position: 'relative', marginRight: '10px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Key"
                                                    value={tagRow.key}
                                                    onChange={(e) => handleTagRowChange(index, 'key', e.target.value)}
                                                    className={tagKeyError && tagRow.key && tagRow.key.toLowerCase().startsWith('aws:') ? 'error-input' : ''}
                                                />
                                                {tagKeyError && tagRow.key && tagRow.key.toLowerCase().startsWith('aws:') && (
                                                    <div className="error-message">
                                                        Key cannot start with 'aws:'
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ paddingLeft: '120px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Value (max 20 characters)"
                                                    value={tagRow.value}
                                                    maxLength={20}
                                                    onChange={(e) => handleTagRowChange(index, 'value', e.target.value)}
                                                />
                                            </div>
                                            <div className="ml-2">
                                                <span onClick={() => handleRemoveTagRow(index)}>
                                                    <i className="bi bi-trash"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="form-field d-flex justify-content-end">
                            <button className="btn btn-secondary mr-2" onClick={handleClearForm}>Clear Form</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>Add Service</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};
export default ServiceItemPageComponent;




