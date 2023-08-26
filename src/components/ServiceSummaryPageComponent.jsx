import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import HeaderPageComponent from './HeaderPageComponent';

const ServiceSummaryPageComponent = () => {
    const [services, setServices] = useState([]);
    const [registrationSuccessResponse, setRegistrationSuccessResponse] = useState(false);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

    useEffect(() => {
        // Fetch services from the API
        fetch('http://localhost:5000/services')
            .then(response => response.json())
            .then(data => setServices(data))
            .catch(error => console.error('Error fetching services:', error));

        // Fetch registration success response from the API (assuming it's under the key "registrationSuccessResponse")
        fetch('http://localhost:5000/registrationSuccessResponse')
            .then(response => response.json())
            .then(data => {

                setRegistrationSuccessResponse(data.success);
                console.log('Fetched registration success response:', data.success);
            })
            .catch(error => console.error('Error fetching registration success response:', error));
    }, []);

    const handleDeleteInstance = (serviceId, instanceId) => {
        // Delete logic based on serviceId and instanceId
        // For example, if you want to remove the instance from the service's instances array:
        const updatedServices = services.map(service => {
            if (service.id === serviceId) {
                const updatedInstances = service.instances.filter(instance => instance.instanceId !== instanceId);
                return { ...service, instances: updatedInstances };
            }
            return service;
        });

        setServices(updatedServices);
    };
    const handleSuccessMessageClose = () => {
        setIsSuccessMessageVisible(false);
    };
    const renderTooltip = (text) => (
        <Tooltip>{text}</Tooltip>
    );


    useEffect(() => {
        if (registrationSuccessResponse) {
            setIsSuccessMessageVisible(true);
            console.log('registrationSuccessResponse' + registrationSuccessResponse)

        }
    }, [registrationSuccessResponse]);
    console.log('setIsSuccessMessageVisible' + isSuccessMessageVisible)
    return (
        <div>
            <HeaderPageComponent />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {isSuccessMessageVisible && (
                    <div style={{
                        backgroundColor: '#92ebd5', color: 'rgb(9, 9, 9)', borderRadius: '5px', padding: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', maxWidth: '700px',

                    }}>
                        <i class="bi bi-check-circle" style={{ color: 'green', marginRight: '5px' }}></i>
                        <span style={{ color: 'green', marginRight: '5px' }}>All set:</span> Successfully registered your AWD ID. Let's get started on the next steps.
                        <button type="button" className="close" onClick={handleSuccessMessageClose}>&times;</button>
                    </div>
                )}
            </div>
            <div className="service-summary-container" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
                {services.map((service) => (
                    <div key={service.id} className="service-block">
                        <div className="service-header">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h3 style={{ marginRight: '10px' }}>{service.serviceName}{' '}</h3>
                                    <OverlayTrigger placement="top" overlay={renderTooltip('Service Name')}>
                                        <i className="bi bi-info-circle tooltip-icon"></i>
                                    </OverlayTrigger>
                                </div>
                            <div className={service.authorizationStatus ? 'service-status-authorized' : 'service-status-unauthorized'}>
                                Authorization Status: {service.authorizationStatus ? 'Authorized' : 'Not Authorized'}
                            </div>
                            <div>
                                {service.instances.length < 2 ? (
                                    <Link to={`/add-instance/${service.id}`}>
                                        <span className="add-link"><i className="bi bi-plus-circle"></i> Add</span>
                                    </Link>
                                ) : (
                                    <span className="add-link-disabled"><i className="bi bi-plus-circle"></i> Add</span>
                                )}
                            </div>
                        </div>
                        <table className="instance-table">
                            <thead className="table-heading">
                                <tr>
                                    <th className="table-cell">
                                        <span>
                                            Instance Id{' '}</span>
                                        <OverlayTrigger placement="top" overlay={renderTooltip('Instance Id')}>

                                            <i className="bi bi-info-circle tooltip-icon"></i>

                                        </OverlayTrigger>
                                    </th>
                                    <th className="table-cell">
                                        <span>
                                            Instance Name{' '}</span>
                                        <OverlayTrigger placement="top" overlay={renderTooltip('Instance Name')}>

                                            <i className="bi bi-info-circle tooltip-icon"></i>

                                        </OverlayTrigger>
                                    </th>
                                    <th className="table-cell">
                                        <span>
                                            Start Date & Time{' '}</span>
                                        <OverlayTrigger placement="top" overlay={renderTooltip('Start Date & Time')}>

                                            <i className="bi bi-info-circle tooltip-icon"></i>

                                        </OverlayTrigger>
                                    </th>
                                    <th className="table-cell">
                                        <span> End Date & Time{' '} </span>
                                        <OverlayTrigger placement="top" overlay={renderTooltip('End Date & Time')}>
                                            <i className="bi bi-info-circle tooltip-icon"></i>
                                        </OverlayTrigger>
                                    </th>
                                    <th className="table-cell">
                                        <span>
                                            Action{' '}</span>
                                        <OverlayTrigger placement="top" overlay={renderTooltip('Action')}>
                                            <i className="bi bi-info-circle tooltip-icon"></i>
                                        </OverlayTrigger>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {service.instances.map((instance) => (
                                    <tr key={instance.instanceId} className="table-row">
                                        <td className="table-cell">{instance.instanceId}</td>
                                        <td className="table-cell">
                                            <Link to={`/instance/${instance.instanceId}`}>{instance.instanceName}</Link>
                                        </td>
                                        <td className="table-cell">{instance.startDate}</td>
                                        <td className="table-cell">{instance.endDate}</td>
                                        <td className="table-cell">
                                            <Button variant="link" onClick={() => handleDeleteInstance(service.id, instance.instanceId)}>
                                                <i className="bi bi-trash"></i>
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
