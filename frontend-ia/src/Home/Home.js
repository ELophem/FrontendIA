import React from 'react';
import './Home.css';
import {useNavigate} from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const goToUploadPage = () => {
    navigate('/Upload');
  };
  return (
    <div className="homepage-content">
      <h1 className='page-title'>Welcome to the smart image gallery</h1>
      <div className="text-content">
        <p>
          This is a web application allowing you to upload your favorite pictures. These photos are going to be analyzed
          by an Artificial Intelligence, which will detect the persons or animals that appear in the image.
        </p>
        <p>
          With this smart gallery, you will be able to easily find all the photos where your best friends appear and
          remember all those fun moments with them.
        </p>
      </div>
      <button onClick={goToUploadPage}>Try the smart gallery</button>
    </div>
  );
};

export default HomePage;
