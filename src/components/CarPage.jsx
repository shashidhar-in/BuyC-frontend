import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap';

function CarPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [dealer, setDealer] = useState(null);
  const [carSpecs, setCarSpecs] = useState(null);

  useEffect(() => {
    fetchCar();
  }, []);

  const fetchDealer = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      const userData = response.data;
      setDealer(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchCar = async () => {
    try {
      const response = await axios.get(`/api/used-cars/${id}`);
      const carData = response.data;
      setCar(carData);
      fetchDealer(carData.userId);
      fetchCarSpecs(carData.brand, carData.model, carData.year);
    } catch (error) {
      console.error('Error fetching car:', error);
    }
  };

  const fetchCarSpecs = async (brand, model, year) => {
    const encodedBrand = encodeURIComponent(brand);
    const encodedModel = encodeURIComponent(model);
    const encodedYear = encodeURIComponent(year);

    try {
      const response = await axios.get(`/api/oem/specs/${encodedBrand}/${encodedModel}/${encodedYear}`);
      const specsData = response.data;
      setCarSpecs(specsData);
      console.log(specsData);
    } catch (error) {
      console.error('Error fetching car specs:', error);
    }
  };

  if (!car || !dealer || !carSpecs) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button variant="warning" disabled className="d-flex justify-content-between align-items-center">
          <Spinner animation="grow" />
          <h3>Loading...</h3>
        </Button>
      </div>
    );
  }

  // Splitting the description into bullet points
  const descriptionPoints = car.description.split(',').map((point) => point.trim());

  return (
    <div className="d-flex justify-content-around">
      <div style={{ width: '50vw', height: '100vh' }}>
        <img src={car.imageUrl} alt={car.title} style={{ width: '100%' }} />
        <h3 style={{ fontSize: '2.2rem' }}>{car.title}</h3>
        <h3><span>{car.brand}&nbsp;</span>
          <span>{car.model}&nbsp;</span>
          <span>{car.year}</span></h3>
        <p style={{ fontSize: '1.2rem',fontWeight:"400" }}>
        
          <ul>
            {descriptionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </p>
      </div>
      <div>
        <div>
          <h2>Dealer Details</h2>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Username</th>
                <td>{dealer.username}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{dealer.email}</td>
              </tr>
              <tr>
                <th>Mobile Number</th>
                <td>{dealer.mobileNumber}</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>{dealer.location}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2>Car Specifications</h2>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Brand</th>
                <td>{carSpecs.brand}</td>
              </tr>
              <tr>
                <th>Model</th>
                <td>{carSpecs.model}</td>
              </tr>
              <tr>
                <th>Year</th>
                <td>{carSpecs.year}</td>
              </tr>
              <tr>
                <th>Color</th>
                <td>{carSpecs.available_colors}</td>
              </tr>
              <tr>
                <th>List Price</th>
                <td>{carSpecs.list_price}$</td>
              </tr>
              <tr>
                <th>Max Speed</th>
                <td>{carSpecs.max_speed}KM/Hr</td>
              </tr>
              <tr>
                <th>Mileage</th>
                <td>{carSpecs.mileage}KM/Liter</td>
              </tr>
              <tr>
                <th>Power</th>
                <td>{carSpecs.power}BHp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CarPage;
