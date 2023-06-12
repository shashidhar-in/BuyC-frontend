import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CarCard from './CarCard';
import { Button, Spinner, Form } from 'react-bootstrap';

const App = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    year: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/used-cars');
      setCars(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const getUniqueValues = (key) => {
    // Get unique values of a specific key from the cars list
    const uniqueValues = [...new Set(cars.map((car) => car[key]))];
    return ['All', ...uniqueValues];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      brand: '',
      model: '',
      year: '',
    });
  };

  const filterCars = () => {
    // Filter the cars array based on the selected filters
    let filteredCars = [...cars];
    if (filters.brand && filters.brand !== 'All') {
      filteredCars = filteredCars.filter(
        (car) => car.brand.toLowerCase() === filters.brand.toLowerCase()
      );
    }
    if (filters.model && filters.model !== 'All') {
      filteredCars = filteredCars.filter(
        (car) => car.model.toLowerCase() === filters.model.toLowerCase()
      );
    }
    if (filters.year && filters.year !== 'All') {
      filteredCars = filteredCars.filter(
        (car) => car.year.toString() === filters.year
      );
    }
    return filteredCars;
  };

  if (loading) {
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
        <Button
          variant="warning"
          disabled
          className="d-flex justify-content-between align-items-center"
        >
          <Spinner animation="grow" />
          <h3>Loading...</h3>
        </Button>
      </div>
    );
  }

  const filteredCars = filterCars();
  const brands = getUniqueValues('brand');
  const models = getUniqueValues('model');
  const years = getUniqueValues('year');

  return (
    <div className="container d-flex flex-column">
      <div className="filters d-flex flex-row align-items-center ">
        <Form.Group className='d-flex align-items-center m-2'  controlId="brandFilter">
          <Form.Label>Brand:</Form.Label>
          <Form.Control
            as="select"
            name="brand"
            value={filters.brand}
            onChange={handleFilterChange}
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className='d-flex align-items-center m-2' controlId="modelFilter">
          <Form.Label>Model:</Form.Label>
          <Form.Control
            as="select"
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className='d-flex align-items-center m-2' controlId="yearFilter">
          <Form.Label>Year:</Form.Label>
          <Form.Control
            as="select"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="secondary" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </div>


      <div className="card-container">
        {filteredCars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </div>
  );
};

export default App;
