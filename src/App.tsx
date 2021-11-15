import './App.css';
import MainScreen from './components/main-screen';
import {Col} from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Col xs={9} className="mx-auto">
        <MainScreen />
      </Col>
    </div>
  );
}

export default App;
