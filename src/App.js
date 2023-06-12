import './App.css';
import GlobalContextProvider from './GlobalContext';
import AuthBox from './components/AuthBox';
import CarPage from './components/CarPage';
import Home from './components/Home';
import MyCars from './components/MyCars';
import NavBar from './components/NavBar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OEMSpecs from './components/OEMSpecs';

function App() {
  return (
    <GlobalContextProvider> {/* Use GlobalContextProvider as the parent component */}
      <BrowserRouter>      
      <NavBar />

        <Routes>
          <Route path='/auth' element={<AuthBox />} />
          <Route path='/' element={<Home />} />
          <Route path='/mycars' element={<MyCars />} />
          <Route path='/car/:id' element={<CarPage/>} />
          <Route path='/oem-specs' element={<OEMSpecs/>} />

        </Routes>
      </BrowserRouter>
    </GlobalContextProvider>
  );
}

export default App;
