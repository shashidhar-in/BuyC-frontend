import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import MyCarCard from './MyCarCard';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';

const MyCars = () => {
    const {user}=useContext(GlobalContext);
  const [cars, setCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const [carSpecs, setCarSpecs] = useState([]);
  const [newCar, setNewCar] = useState({
    title: '',
    description: '',
    brand: '',
    model: '',
    year: '',
    imageUrl: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchCars();
    fetchCarSpecs();
  }, []);
  const navigate=useNavigate();
  useEffect(()=>{
    if(!user&&navigate){
        navigate("/");
    }
  },[]);


  const fetchCars = async () => {
    try {
      const response = await axios.get('/api/used-cars');
      const cars = response.data;
      setCars(cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const fetchCarSpecs = async () => {
    try {
      const response = await axios.get('/api/oem/all');
      const carSpecs = response.data;
      setCarSpecs(carSpecs);

      const brandList = Array.from(new Set(carSpecs.map((spec) => spec.brand)));
      setBrands(brandList);

      const modelList = Array.from(new Set(carSpecs.map((spec) => spec.model)));
      setModels(modelList);

      const yearList = Array.from(new Set(carSpecs.map((spec) => spec.year)));
      setYears(yearList);
    } catch (error) {
      console.error('Error fetching car specs:', error);
    }
  };

  const handleCarSelection = (carId) => {
    if (selectedCars.includes(carId)) {
      setSelectedCars(selectedCars.filter((id) => id !== carId));
    } else {
      setSelectedCars([...selectedCars, carId]);
    }
  };

  const handleDeleteSelectedCars = async () => {
    try {
      await axios.delete('/api/used-cars/delete-multiple', { data: { carIds: selectedCars } });
      fetchCars(); // Refresh the car list after deletion
      setSelectedCars([]); // Clear the selected cars
    } catch (error) {
      console.error('Error deleting cars:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCar((prevCar) => ({ ...prevCar, [name]: value }));
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddCar = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('title', newCar.title);
      formData.append('description', newCar.description);
      formData.append('brand', newCar.brand);
      formData.append('model', newCar.model);
      formData.append('year', newCar.year);

      await axios.post('/api/used-cars/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchCars(); // Refresh the car list after adding a new car
      handleCloseModal(); // Close the modal
      setNewCar({
        title: '',
        description: '',
        brand: '',
        model: '',
        year: '',
        imageUrl: '',
      }); // Reset the new car form
      setSelectedImage(null); // Reset the selected image state
    } catch (error) {
      console.error('Error adding car:', error);
      // Handle error response
    }
  };

  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setSelectedBrand(selectedBrand);

    const filteredModels = models.filter((model) => {
      const spec = carSpecs.find((spec) => spec.brand === selectedBrand && spec.model === model);
      return spec !== undefined;
    });

    setFilteredModels(filteredModels);
    setSelectedModel('');
    setNewCar((prevCar) => ({ ...prevCar, brand: selectedBrand }));
  };

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    setSelectedModel(selectedModel);
    setNewCar((prevCar) => ({ ...prevCar, model: selectedModel }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setNewCar((prevCar) => ({ ...prevCar, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setNewCar((prevCar) => ({ ...prevCar, imageUrl: '' }));
    }
  };
const filteredCars=cars.filter((car)=>car.userId === user.userId)
  return (
    <div className="container d-flex flex-column " >

<div className="card-container">
      {filteredCars.map((car) => (
        <MyCarCard
          key={car.id}
          car={car}
          selected={selectedCars.includes(car.id)}
          onSelect={handleCarSelection}
        />
      ))}
     
      </div>
      <div >    <Button className='me-2' variant="danger" disabled={selectedCars.length === 0} onClick={handleDeleteSelectedCars}>
        Delete Selected Cars
      </Button>

      <Button variant="primary" onClick={handleShowModal}>
        Add Car
      </Button></div>
  
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newCar.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCar.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control as="select" value={newCar.brand} onChange={handleBrandChange}>
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="model">
              <Form.Label>Model</Form.Label>
              <Form.Control as="select" value={newCar.model} onChange={handleModelChange}>
                <option value="">Select Model</option>
                {filteredModels.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control
                as="select"
                name="year"
                value={newCar.year}
                onChange={handleInputChange}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="imageFile">
              <Form.Label>Image File</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            {selectedImage && (
              <Form.Group>
                <Form.Label>Selected Image:</Form.Label>
                <br />
                <img
                  src={newCar.imageUrl}
                  alt="Selected"
                  style={{ maxWidth: '100%', marginBottom: '10px' }}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCar}>
            Add Car
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCars;
