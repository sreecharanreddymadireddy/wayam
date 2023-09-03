import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, OverlayTrigger, Form, Tooltip } from 'react-bootstrap';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setFormData } from '../redux/formDataActions';

const RegistrationFormComponent = () => {
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const formData = useSelector(state => state.formData);
    const [selectedServiceContent, setSelectedServiceContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [regions, setRegions] = useState([]);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [isServiceErrorVisible, setIsServiceErrorVisible] = useState(false);
    const [errors, setErrors] = useState({
        awdId: '',
        awdRegion: '',
    });
    const renderTooltip = (text) => (
        <Tooltip
            id="custom-tooltip"
            style={{
                fontSize: 13,
                fontFamily: 'Nunito Sans',
                fontWeight: '800',
                lineHeight: 2,
                wordWrap: 'break-word'
            }}
        >
            {text}
        </Tooltip>

    );
    
    const simulateBackendError = (maskedEmail, isVisible) => {
        const errorMessage = `The AWS Account ID is already in use by b*****u@g****.com. Please choose another AWS Account.`;
        setErrorMessage(errorMessage);
        setIsErrorVisible(isVisible);
    };

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const res = await fetch('http://localhost:5000/regions');
                const data = await res.json();
                setRegions(data);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };

        fetchRegions();
    }, []);

    const schema = yup.object().shape({
        awdId: yup.string().matches(/^\d+$/, 'AWD ID  is required').required('AWD ID  is required'),
        awdRegion: yup.string().required('AWD Region is required'),
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form data:', formData);
            dispatch(setFormData(formData));
            history.push('/Services');
        }
        if (formData.planType === '') {
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

        if (name === 'awdId') {
            if (!/^\d*$/.test(value)) {
                return;
            }
            setErrors((prevErrors) => ({ ...prevErrors, awdId: '' }));
            updatedFormData = { ...updatedFormData, awdId: value };
        }

        if (name === 'awdRegion') {
            setErrors((prevErrors) => ({ ...prevErrors, awdRegion: '' }));
            updatedFormData = { ...updatedFormData, awdRegion: value };
        }

        if (type === 'checkbox') {
            const updatedServices = checked
                ? [...formData.services, value]
                : formData.services.filter((service) => service !== value);
            updatedFormData = { ...updatedFormData, services: updatedServices };
        }

        if (type === 'radio') {
            updatedFormData = { ...updatedFormData, [name]: value };
        }
        dispatch(setFormData(updatedFormData));
    };

    const handleServiceClick = (serviceText) => {
        setSelectedServiceContent(serviceText);
    };


    return (

        <Container fluid >
            <Row className="gradient-form">
                <Col className="custom-col-style">
                    {!selectedServiceContent && (
                        <div className="mb-5 logo-container">
                            <img
                                src={'/logo.png'}
                                alt="Example"
                                className="logo"
                            />
                        </div>
                    )}
                    {!selectedServiceContent && (
                        <div className="d-flex flex-column align-items-start ml-5">
                            <h1 className="custom-heading">
                                Your Cloud Cost
                                <span>Remote Controller</span>
                            </h1>
                            <div className="custom-description mt-2">
                                This tool helps you control your cloud costs.It
                                <span>provides you with insights into your spending</span>
                                <span>and helps you identify areas where you can</span>
                                <span>save money.</span>
                            </div>
                        </div>
                    )}
                    {selectedServiceContent && (
                        <div className="d-flex flex-column align-items-start p-4">
                            {selectedServiceContent}
                            <p>
                                This tool helps you control your cloud costs. It provides you with insights
                                into your spending and helps you identify areas where you can save money.
                                . Lorem ipsum dolor sit amet consectetur.
                                . Rhoncus integer fermentum mattis nec adipiscing accumsan. Ipsum elit
                                at nisi consectetur augue erat tempus.
                                . Rhoncus metus duis aliquam est aliquam scelerisque enim.
                                Scelerisque mauris risus consectetur amet aenean.
                                . Sit mauris egestas enim varius eros phasellus fringilla lectus facilisis.
                                . Dictum magna consequat vitae diam convallis justo malesuada consectetur. Ut arcu eu diam arcu.
                            </p>
                        </div>
                    )}
                </Col>

                <Col className="overflow-auto p-5" style={{ height: '100vh' }}>
                    <div className="d-flex align-items-start flex-column">
                        <h2 style={{ color: '#2D3748', fontSize: 30, fontFamily: 'Raleway', fontWeight: '600', lineHeight: 1, wordWrap: 'break-word' }}>Register</h2>

                        <p style={{ color: '#2D3748', fontSize: 15, fontFamily: 'Roboto', fontWeight: '400', lineHeight: 2, wordWrap: 'break-word' }}>
                            Please register with your AWS account & select the <span style={{ display: "block" }}>appropriate plan and services you require.</span>
                        </p>

                    </div>
                    <div>
                        {isErrorVisible && (
                            <div className="custom-error">
                                <div className="error-content" style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="error-title" style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                                        <i className="bi bi-exclamation-octagon" style={{ marginRight: '3px' }}></i>Error:
                                    </div>
                                    <div className="error-message-container">
                                        {errorMessage}
                                    </div>
                                    <i
                                        className="bi bi-x"
                                        style={{ marginLeft: '5px', color: '#6B7280', cursor: 'pointer', fontSize: '38px' }}
                                        onClick={() => setIsErrorVisible(false)}
                                    ></i>
                                </div>
                            </div>
                        )}
                    </div>



                    <Form noValidate onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3">
                            <div className="d-flex align-items-start">
                                <Form.Label className="custom-label">
                                    AWD ID<span className="text-danger">*</span>{' '}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id="awdIdTooltip"
                                            >
                                                <span className="d-flex align-items-start">Lorem ipsum</span>
                                                <br />
                                                <span className='tooltip-content d-flex align-items-start'>
                                                    Lorem ipsum dolor sit amet consectetur. Arcu urna commodo sociis turpis aliquam risus blandit.
                                                    Quam tincidunt condimentum semper non tellus.
                                                </span>
                                            </Tooltip>
                                        }
                                    >
                                        <i className="bi bi-info-circle tooltip-icon"></i>
                                    </OverlayTrigger>

                                </Form.Label>
                            </div>
                            <Form.Control
                                type="text"
                                name="awdId"
                                value={formData.awdId}
                                onChange={handleInputChange}
                                isInvalid={!!errors.awdId}
                                required
                            />
                            <Form.Control.Feedback type="invalid" className="error-feedback">{errors.awdId}</Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="mb-3 custom-label">
                            <div className="d-flex align-items-start">
                                <Form.Label>
                                    AWD Region<span className="text-danger">*</span>{' '}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip
                                                id="awdIdTooltip"
                                            >
                                                <span className="d-flex align-items-start">Lorem ipsum</span>
                                                <br />
                                                <span className='tooltip-content d-flex align-items-start'>
                                                    Lorem ipsum dolor sit amet consectetur. Arcu urna commodo sociis turpis aliquam risus blandit.
                                                    Quam tincidunt condimentum semper non tellus.
                                                </span>
                                            </Tooltip>
                                        }
                                    >
                                        <i className="bi bi-info-circle tooltip-icon"></i>
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
                                <option value="">Select AWD Region</option>
                                {regions.map((region, index) => (
                                    <option key={index} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid" className="error-feedback">
                                {errors.awdRegion}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <div className="d-flex align-items-start">
                                <Form.Label className="me-2 custom-label">Plan Type<span className="text-danger">*</span></Form.Label>
                            </div>
                            <div className="d-flex align-items-center">
                                <Form.Check
                                    type="radio"
                                    name="planType"
                                    id="freeForEver"
                                    label={
                                        <span className={`me-3 form-check-label`}>
                                            Free For Ever{' '}
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip
                                                        id="awdIdTooltip"
                                                    >
                                                        <span className="d-flex align-items-start">Lorem ipsum</span>
                                                        <br />
                                                        <span className='tooltip-content d-flex align-items-start'>
                                                            Lorem ipsum dolor sit amet consectetur. Arcu urna commodo sociis turpis aliquam risus blandit.
                                                            Quam tincidunt condimentum semper non tellus.
                                                        </span>
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="bi bi-info-circle tooltip-icon"></i>
                                            </OverlayTrigger>
                                        </span>
                                    }
                                    value="Free For Ever"
                                    checked={formData.planType === 'Free For Ever'}
                                    onChange={handleInputChange}
                                    className="me-5"
                                />
                                <div className="d-flex ml-3">
                                    <Form.Check
                                        type="radio"
                                        name="planType"
                                        id="premium"
                                        label={
                                            <span className={`me-3 form-check-label`}>
                                                Premium{' '}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip
                                                            id="awdIdTooltip"
                                                        >
                                                            <span className="d-flex align-items-start">Lorem ipsum</span>
                                                            <br />
                                                            <span className='tooltip-content d-flex align-items-start'>
                                                                Lorem ipsum dolor sit amet consectetur. Arcu urna commodo sociis turpis aliquam risus blandit.
                                                                Quam tincidunt condimentum semper non tellus.
                                                            </span>
                                                        </Tooltip>
                                                    }
                                                >
                                                    <i className="bi bi-info-circle tooltip-icon"></i>
                                                </OverlayTrigger>
                                            </span>
                                        }
                                        value="Premium"
                                        checked={formData.planType === 'Premium'}
                                        onChange={handleInputChange}

                                    />
                                    {formData.planType === '' && (
                                        <div className="error-message">
                                            Select a plan type
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Form.Group>
                        {submitted && formData.planType === '' && (
                            <div className="error-message1">
                                Select a plan type
                            </div>
                        )}
                        <Form.Group className="mb-3 custom-label" style={{
                            width: '100%',
                            height: '100%',
                            background: 'white',
                            boxShadow: '0px 2px 3px rgba(3, 59, 105, 0.10)',
                            borderRadius: 8,
                            border: '0.50px #9AE6B4 solid',
                            border: '1px solid lightgreen', // Add border style
                            borderRadius: '10px', // Add border radius
                            padding: '10px'
                        }}>
                            <div className="d-flex align-items-start">
                                <Form.Label>Select Services</Form.Label>
                            </div>
                            {submitted && isServiceErrorVisible && (
                                <div className="custom-error">
                                    <div className="error-content" style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="error-title" style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
                                            <i className="bi bi-exclamation-octagon" style={{ marginRight: '3px' }}></i>Error:
                                        </div>
                                        <div className="error-message-container1">
                                            Please select atleast one service
                                        </div>
                                        <i
                                            className="bi bi-x"
                                            style={{ marginLeft: '95px', color: '#6B7280', cursor: 'pointer', fontSize: '32px' }}
                                            onClick={() => setIsServiceErrorVisible(false)}
                                        ></i>
                                    </div>
                                </div>
                            )}
                            <div className="service-item mb-3">
                                <div className={`service-checkbox d-flex align-items-start ${isServiceErrorVisible ? 'is-invalid' : ''}`}>
                                    <Form.Check
                                        type="checkbox"
                                        name="services"
                                        id="service1"
                                        value="service1"
                                        checked={formData.services.includes('service1')}
                                        onChange={handleInputChange}
                                        label="Service 1"
                                        className="me-3 custom-form-check"
                                    />
                                </div>

                                <div className="service-content ml-4">
                                    Lorem ipsum dolor sit amet consectetur. Vel et varius libero diam dictum.{' '}
                                    <a
                                        href="#"
                                        className="link-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleServiceClick('Service 1 text');
                                        }}
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>

                            <div className="service-item mb-3 ">
                                <div className={`service-checkbox d-flex align-items-start ${isServiceErrorVisible ? 'custom-form-check service-error-visible' : ''}`}>
                                    <Form.Check
                                        type="checkbox"
                                        name="services"
                                        id="service2"
                                        value="service2"
                                        checked={formData.services.includes('service2')}
                                        onChange={handleInputChange}
                                        label="Service 2"
                                        className="me-3"
                                    />
                                </div>

                                <div className="service-content ml-4">
                                    <p>
                                        This is Service 2. for more info.{''}
                                        <a
                                            className="link-button"
                                            onClick={() => handleServiceClick('Service 2 text')}
                                        >
                                            Click here
                                        </a>

                                    </p>
                                </div>
                            </div>
                        </Form.Group>
                        <div className="button-container">
                            <Button type="submit" className="btn-primary custom-button">
                                Register
                            </Button>
                        </div>

                        <div className="mt-3">
                            <button onClick={() => simulateBackendError('example@example.com', true)}>Simulate Backend Error</button>
                        </div>

                    </Form>

                </Col>
            </Row>
        </Container>
    );
};

export default RegistrationFormComponent;


