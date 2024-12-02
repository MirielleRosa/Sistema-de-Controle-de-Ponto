import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useParams } from "react-router-dom"; 

const CustomNavbar: React.FC = () => {
const { userId } = useParams(); 
  
  return (
    <Navbar 
      expand="lg" 
      className="bg-dark navbar p-3 d-flex flex-row align-items-start justify-content-start gap-4 text-left text-base text-body font-open-sans"
    >
      <Container>
        <Navbar.Brand className="text-secondary" href="#">
          {/* Ilumeo */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <GiHamburgerMenu className="text-white" size={24} />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar-nav me-auto mb-2 mb-lg-0">
          <Nav className="me-auto ">
            <Nav.Link className="text-white" href={`/${userId}`}>
              Home
            </Nav.Link>
            <Nav.Link className="text-white" href={`/history/${userId}`}>
              Histórico
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link className="text-white" href="/">
              Sair
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
