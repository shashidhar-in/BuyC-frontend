import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function BasicExample({ car }) {
  // Splitting the description into points
  const descriptionPoints = car.description.split(',');
  const imageUrl=`https://buyc-backend.onrender.com${car.imageUrl}`
console.log(car);
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={imageUrl} />
      <Card.Body>
        <Card.Title>{car.title}</Card.Title>
        <Card.Subtitle>
          <span>{car.brand}&nbsp;</span>
          <span>{car.model}&nbsp;</span>
          <span>{car.year}</span>
        </Card.Subtitle>
        <Card.Text>
          {descriptionPoints[0].trim()}
        </Card.Text>
        <Link to={`/car/${car.id}`}>
          <Button variant="warning">View Car</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default BasicExample;
