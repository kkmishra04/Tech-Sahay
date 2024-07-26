import React from 'react';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import Home from './Component/home'
import Aboutus from './Component/AboutUS'
import Gallery from './Component/Gallery'
import Howitworks from './Component/HowItWorks'
import Dprofile from './Component/donorprofile'
import Dform from './Component/donorform'
import DonatedList from './Component/donated'
import Rhome from './Component/recipienthome'
import Rprofile from './Component/recipientprofile'
import Rgadgets from './Component/recievedpage'
import DeliveryLogin from './Component/DeliveryLogin'
import DeliveryList from './Component/DeliveryList'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element = {<Home/>} />
        <Route path="/about" element={<Aboutus/>} />
        <Route path="/gallery" element={<Gallery/>} />
        <Route path="/howitworks" element={<Howitworks/>} />
        <Route path='/dprofile' element={<Dprofile/>} />
        <Route path="/dform" element={<Dform/>} />
        <Route path='/donatedlist' element={<DonatedList/>} />
        <Route path='/rhome' element={<Rhome/>} />
        <Route path='/rprofile' element={<Rprofile/>} />
        <Route path='/rpage' element={<Rgadgets/>} />
        <Route path='/dlogin' element={<DeliveryLogin/>} />
        <Route path='/dlist' element={<DeliveryList/>} />
      </Routes>
    </Router>
  );
}

export default App;
