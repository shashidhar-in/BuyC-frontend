import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext';

const AuthBox = () => {
  const { user, getCurrentUser } = useContext(GlobalContext);

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate=useNavigate();

  useEffect(()=>{
    if(user && navigate){
        navigate("/");
    }
},[user,navigate])


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username,
      email,
      password,
      mobileNumber,
      location
    };

    try {
      let response;
      if (isLogin) {
        response = await axios.post('/api/users/login', user);
      } else {
        response = await axios.post('/api/users/signup', user);
      }

      console.log(response.data);
      // Handle successful login or signup here
      getCurrentUser();
    } catch (error) {
      console.error(error.response.data);
      setErrorMessage(error.response.data.error);
      // Handle error during login or signup here
    }
  };

  return (
    <Container style={{ height: '100vh' }}>
      <Row className="align-items-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card style={{ width: '30vw' }}>
            <Card.Body>
              <h2 className="text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
              <Form onSubmit={handleSubmit}>
                {/* Add form fields for login or sign up */}
                {!isLogin && (
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                )}
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                {!isLogin && (
                  <>
                    <Form.Group controlId="formBasicMobileNumber">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicLocation">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </>
                )}
                <div className="text-center mt-4">
                  <Button variant="outline-warning" type="submit">
                    {isLogin ? 'Login' : 'Sign Up'}
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-4">
                {isLogin ? (
                  <p>
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={toggleForm}
                    >
                      Sign up
                    </Button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={toggleForm}
                    >
                      Login
                    </Button>
                  </p>
                )}
              </div>
              {errorMessage && (
                <div className="text-center mt-4">
                  <p className="text-danger">{errorMessage}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthBox;
