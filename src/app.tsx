import './app.css';
import MainScreen from './components/main-screen';
import {Col, Navbar} from 'react-bootstrap';

function App() {
  return (
    <div className="App">
    <Navbar bg="dark" variant="dark" className="py-0">
        <Col xs={9} className="mx-auto col-9 text-left d-flex justify-content-start">
            <Navbar.Brand href="#home">
                Zaganienie pośrednika
            </Navbar.Brand>
        </Col>
    </Navbar>
      <Col xs={9} className="mx-auto">
        <MainScreen />
      </Col>
    </div>
  );
}

export default App;
