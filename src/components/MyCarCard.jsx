import axios from 'axios';
import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function BasicExample({ car,selected, onSelect }) {
  const [showModal, setShowModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const [carSpecs, setCarSpecs] = useState([]);
  const [title, setTitle] = useState(car.title);
  const [description, setDescription] = useState(car.description);
  const [brand, setBrand] = useState(car.brand);
  const [model, setModel] = useState(car.model);
  const [year, setYear] = useState(car.year);
  const [imageUrl, setImageUrl] = useState(car.imageUrl);
  const [selectedImage, setSelectedImage] = useState(null); // Updated to null initially

  useEffect(() => {
    fetchCarSpecs();
  }, []);

  const fetchCarSpecs = async () => {
    try {
      const response = await axios.get('https://buyc-backend.onrender.com/api/oem/all');
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

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('brand', brand);
      formData.append('model', model);
      formData.append('year', year);

      // Check if a new image file was selected
      if (selectedImage && selectedImage !== car.imageUrl) {
        formData.append('image', selectedImage, selectedImage.name); // Append the image file to the form data
      }

      // Send the PUT request to update the car
      const response = await axios.put(`https://buyc-backend.onrender.com/api/used-cars/edit/${car.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data); // Assuming the server returns a success message

      // Reset the form and close the modal
      setTitle(car.title);
      setDescription(car.description);
      setBrand(car.brand);
      setModel(car.model);
      setYear(car.year);
      setImageUrl(car.imageUrl);
      setSelectedImage(null); // Reset the selected image state
      setShowModal(false);
    } catch (error) {
      console.error('Error updating car:', error);
      // Handle error response
    }
  };
  const handleDeleteCar = async () => {
    try {
      const response = await axios.delete(`https://buyc-backend.onrender.com/api/used-cars/delete/${car.id}`);
      console.log(response.data); // Assuming the server returns a success message
      // Perform any additional actions after deleting the car
    } catch (error) {
      console.error('Error deleting car:', error);
      // Handle error response
    }
  };
  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setSelectedBrand(selectedBrand);

    // Filter the models based on the selected brand
    const filteredModels = models.filter((model) => {
      const spec = carSpecs.find((spec) => spec.brand === selectedBrand && spec.model === model);
      return spec !== undefined;
    });

    setFilteredModels(filteredModels);
    setSelectedModel('');
    setBrand(selectedBrand); // Update the brand state with the selected brand
  };

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    setSelectedModel(selectedModel);
    setModel(selectedModel); // Update the model state with the selected model
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Store the file object in state
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result); // Set the image URL for preview
      };
      reader.readAsDataURL(file); // Read the file and generate a data URL
    } else {
      setSelectedImage(null);
      setImageUrl(car.imageUrl); // Reset the image URL
    }
  };
  const handleCheckboxChange = () => {
    onSelect(car.id);
  };
  return (
    <>
      <Card style={{ width: '18rem' }}>
      <input style={{position:"absolute",right:"0",top:"0",height:"1.5rem",width:"1.5rem",margin:"10px"}} type="checkbox" checked={selected} onChange={handleCheckboxChange} />

        <Card.Img variant="top" src={imageUrl} />
        <Card.Body>
          <Card.Title>{car.title}</Card.Title>
          <Card.Subtitle>
            <span>{car.brand}&nbsp;</span>
            <span>{car.model}&nbsp;</span>
            <span>{car.year}</span>
          </Card.Subtitle>
          <Card.Text>{car.description}</Card.Text>
          <Button variant="warning" className="me-2" onClick={handleModalOpen}>
            Edit Car
          </Button>
          <Button variant="danger" onClick={handleDeleteCar}>Delete</Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleModalClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control as="select" value={brand} onChange={handleBrandChange}>
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="model">
              <Form.Label>Model</Form.Label>
              <Form.Control as="select" value={model} onChange={handleModelChange}>
                <option value="">Select Model</option>
                {filteredModels.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="year">
              <Form.Label>Year</Form.Label>
              <Form.Control as="select" value={year} onChange={(e) => setYear(e.target.value)}>
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
                <img src={imageUrl} alt="Selected" style={{ maxWidth: '100%', marginBottom: '10px' }} />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="warning" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BasicExample;
