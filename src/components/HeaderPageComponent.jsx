import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsGearFill, BsBoxArrowRight } from 'react-icons/bs';

const HeaderPageComponent = () => {
    return (
        <Navbar
            bg="light"
            expand="lg"
            style={{
                border: '1px solid #ccc', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '15px', marginLeft: '25px', marginRight: '25px',
            }} className="rounded-pill ml-5 mr-5"
        >
            <Container className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <Navbar.Brand as={Link} to="/" className="ml-3">
                        <img
                            src={'/LogoHeader.png'}
                            alt="Example"
                            style={{ maxWidth: '50px', maxHeight: '50px' }}
                        />
                    </Navbar.Brand>
                    <p className="mb-0 ml-5">Lorem ipsum dolor sit amet consectetur. Commodo in tristique hendrerit porta viverra at.</p>
                </div>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ml-auto mr-3">
                        <Nav.Link
                            as={Link}
                            to="/Services"
                            style={{ color: '#333' }} r
                        >
                            <BsGearFill /> Add Service
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/"
                            style={{ color: '#333' }}
                        >
                            <BsBoxArrowRight /> Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default HeaderPageComponent;
