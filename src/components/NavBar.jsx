import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';
import { useContext } from 'react';
import { FaUser } from "react-icons/fa"
import axios from 'axios';


function NavScrollExample() {
  const { user,setUser } = useContext(GlobalContext);
  const location = useLocation();
  const navigate=useNavigate();

  const isAuthenticated = user !== null;
  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      setUser(null);
    }
    catch (error) {
      console.log(error);
    }

  }
  return (
    <Navbar bg="warning" expand="lg" style={{ position: "sticky" }}>
      <Container fluid>
        <Navbar.Brand href="#" style={{ fontSize: "2rem" }}>
          BUYC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/" style={{ fontSize: "1.3rem" }}>
              All Cars
            </Nav.Link>
            {isAuthenticated && (
              <Nav.Link as={Link} to="/mycars" style={{ fontSize: "1.3rem" }}>
                My Cars
              </Nav.Link>
            )}{isAuthenticated && (
              <Nav.Link as={Link} to="/oem-specs" style={{ fontSize: "1.3rem" }}>
                All OEM Specs
              </Nav.Link>
            )}
          </Nav>
          {location.pathname !== "/auth" && (

          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-secondary">Search</Button>
          </Form>)}
        </Navbar.Collapse>
      </Container>
      {location.pathname !== "/auth" && (

      <Nav style={{marginRight:"4rem"}} >
        <NavDropdown className='me-5' title={<FaUser style={{ fontSize: 16 }} />} id="collasible-nav-dropdown">
            {isAuthenticated && (<NavDropdown.Item className='text-center'onClick={handleLogout} >Sign Out</NavDropdown.Item>)}
            {!isAuthenticated && (<NavDropdown.Item className='text-center'onClick={(()=>navigate("/auth"))} >Sign In</NavDropdown.Item>)}
        </NavDropdown>
      </Nav>
      )}
    </Navbar>
  );
}

export default NavScrollExample;
