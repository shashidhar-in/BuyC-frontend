import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';

const OEMSpecs = () => {
    const {user}=useContext(GlobalContext);
  const [specs, setSpecs] = useState([]);
    const navigate=useNavigate();
  useEffect(() => {
    fetchSpecs();
  }, []);

  useEffect(()=>{
    if(!user&&navigate){
        navigate("/");
    }
  },[]);

  const fetchSpecs = async () => {
    try {
      const response = await axios.get('/api/oem/all');
      setSpecs(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching OEM specs:', error);
    }
  };

  return (
    <div className="container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Year</th>
            <th>List Price</th>
            <th>Mileage</th>
            <th>Max Speed</th>
            <th>Power</th>
            <th>Available Colors</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.id}>
              <td>{spec.id}</td>
              <td>{spec.brand}</td>
              <td>{spec.model}</td>
              <td>{spec.year}</td>
              <td>{spec.list_price}</td>
              <td>{spec.mileage}</td>
              <td>{spec.max_speed}</td>
              <td>{spec.power}</td>
              <td>{spec.available_colors}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OEMSpecs;
