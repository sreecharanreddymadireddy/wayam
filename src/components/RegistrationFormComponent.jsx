import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, OverlayTrigger, Form, Tooltip, Alert } from 'react-bootstrap';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setFormData } from '../redux/formDataActions'; // Check the import path

const RegistrationFormComponent = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const formData = useSelector(state => state.formData);

    const [selectedServiceContent, setSelectedServiceContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [regions, setRegions] = useState([]);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [sampleTextContent, setSampleTextContent] = useState('');


    const [errors, setErrors] = useState({
        awdId: '',
        awdRegion: '',
    });

    const renderTooltip = (text) => (
        <Tooltip id="tooltip">{text}</Tooltip>
    );

    const simulateBackendError = (maskedEmail, isVisible) => {
        const errorMessage = `An error occurred for email: ${maskedEmail}. Please try again later.`;
        setErrorMessage(errorMessage);
        setIsErrorVisible(isVisible);
    };



    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const res = await fetch('http://localhost:5000/regions'); // Use the correct URL
                const data = await res.json();
                setRegions(data);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };

        fetchRegions();
    }, []);

    const schema = yup.object().shape({
        awdId: yup.string().matches(/^\d+$/, 'AWD ID must be a valid number').required(),
        awdRegion: yup.string().required('AWD Region is required'),
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form data:', formData);

            // Dispatch the form data to the Redux store
            dispatch(setFormData(formData));

            // Navigate to the service summary page after form submission
            history.push('/Services');
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
        let updatedFormData = { ...formData }; // Create a copy of the current form data

        if (name === 'awdId') {
            if (!/^\d*$/.test(value)) {
                return; // Only allow numeric values for AWD ID
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

        // Dispatch the updated form data to the Redux store
        dispatch(setFormData(updatedFormData));
    };

    const handleServiceClick = (serviceText) => {
        setSelectedServiceContent(serviceText);
    };


    return (

        <Container fluid className="vh-100 d-flex">
            <Row className="gradient-form" >
              <Col md={6} className="w-50 text-light d-flex flex-column justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #042F3A, #7DF6D2)', minHeight: '100vh' }}>
    {!selectedServiceContent && (
        <div className="mb-5">
            <img
                src={'/logo.png'}
                alt="Example"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
            />
        </div>
    )}
    {!selectedServiceContent && (
        <div className="d-flex flex-column align-items-start p-4">
            <h1>Your Cloud Cost</h1>
            <h1>Remote Controller</h1>
            <p>This tool helps you control your cloud costs.
                It provides you with insights into your spending
                and helps you identify areas where you can
                save money.
            </p>
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



                <Col md={6} className="overflow-auto p-5" style={{ height: '100vh' }}>
                    <div className="d-flex align-items-start flex-column">
                        <h2>Register</h2>
                        <p>Please register with your AWS account & select the appropriate plan and services you require.</p>
                    </div>
                    {isErrorVisible && errorMessage && (
                        <Alert variant="danger" className="mb-3 d-flex align-items-center">
                            <div>{errorMessage}</div>
                            <Button
                                variant="none"
                                onClick={() => setIsErrorVisible(false)}
                                className="btn-close ms-auto"
                            >
                                <span aria-hidden="true" className="bi bi-x"></span>
                            </Button>
                        </Alert>
                    )}
                    <Form noValidate onSubmit={handleFormSubmit}>
                        <Form.Group className="mb-3 ">
                            <div className="d-flex align-items-start">
                                <Form.Label>
                                    AWD ID<span className="text-danger">*</span>{' '}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip('Enter your AWD ID')}
                                    >
                                        <i className=" bi  bi-info-circle tooltip-icon"></i>
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
                            <Form.Control.Feedback type="invalid">{errors.awdId}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <div className="d-flex align-items-start">
                                <Form.Label>
                                    AWD Region<span className="text-danger">*</span>{' '}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip('Enter your AWD Region')}
                                    >
                                        <i className="bi bi-info-circle tooltip-icon"></i>
                                    </OverlayTrigger>
                                </Form.Label>
                            </div>
                            <Form.Control
                                as="select" // Use select element for the picklist
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
                            <Form.Control.Feedback type="invalid">
                                {errors.awdRegion}
                            </Form.Control.Feedback>
                        </Form.Group>


                        {/* Plan Type Radio Buttons */}
                        <Form.Group className="mb-3">
                            <div className="d-flex align-items-start">
                                <Form.Label className="me-2">Plan Type<span className="text-danger">*</span></Form.Label>
                            </div>
                            <div className="d-flex align-items-center">
                                <Form.Check
                                    type="radio"
                                    name="planType"
                                    id="freeForEver"
                                    label={
                                        <span className="me-3">
                                            Free For Ever{' '}
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={renderTooltip('Select Free For Ever plan')}
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
                                            <span>
                                                Premium{' '}
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={renderTooltip('Select Premium plan')}
                                                >
                                                    <i className="bi bi-info-circle tooltip-icon"></i>
                                                </OverlayTrigger>
                                            </span>
                                        }
                                        value="Premium"
                                        checked={formData.planType === 'Premium'}
                                        onChange={handleInputChange}

                                    />
                                </div>
                            </div>
                        </Form.Group>

                        {/* Select Services Checkboxes */}
                        <Form.Group className="mb-3" style={{ border: '1px solid lightgreen', borderRadius: '10px', padding: '10px' }}>
                            <div className="d-flex align-items-start">
                                <Form.Label>Select Services</Form.Label>
                            </div>
                            {/* Service 1 */}
                            <div className="service-item" style={{ border: '1px solid lightgreen', borderRadius: '10px', padding: '10px', marginBottom: '10px' }}>
                                <div className="service-checkbox d-flex align-items-start">
                                    <Form.Check
                                        type="checkbox"
                                        name="services"
                                        id="service1"
                                        value="service1"
                                        checked={formData.services.includes('service1')}
                                        onChange={handleInputChange}
                                        label="Service 1"
                                        className="me-3"
                                    />
                                </div>

                                <div className="service-content d-flex align-items-start ">
                                    This is Service 1. for more info.{''}
                                    <a
                                        href="#"
                                        className="link-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleServiceClick('Service 1 text');
                                        }}
                                    >
                                        Click here
                                    </a>
                                </div>
                            </div>

                            {/* Service 2 */}
                            <div className="service-item" style={{ border: '1px solid lightgreen', borderRadius: '10px', padding: '10px', marginBottom: '10px' }}>
                                <div className="service-checkbox d-flex align-items-start">
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

                                <div className="service-content d-flex align-items-start ">
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

                        <Button type="submit" className="btn btn-primary">
                            Submit
                        </Button>

                        <button onClick={() => simulateBackendError('example@example.com', true)}>Simulate Backend Error</button>

                    </Form>

                </Col>
            </Row>
        </Container>
    );
};

export default RegistrationFormComponent;


