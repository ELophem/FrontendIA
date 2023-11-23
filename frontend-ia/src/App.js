import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Navbar} from './Navbar/Navbar';
import HomePage from './Home/Home';
import GalleryPage from './Gallery/Gallery';
import UploadPage from './Upload/Upload';
import DisplayPage from './Display/Display';

const App = () => {
  return (
    <div className="App">

        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Gallery" element={<GalleryPage />}/>
            <Route path="/Upload" element={<UploadPage />} />
            <Route path= "/Display" element={<DisplayPage/>}/>
          </Routes>
        </Router>

    </div>
  );
};

export default App;