import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css'; 

const UploadPage = () => {
  //State variables to manage file and loading state
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false); //Loading state of the AI
  const navigate = useNavigate();
  //Function to handle file input change
  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };
  //function to send the uploaded image to the backend for processing through the AI
  const handleGoToDisplay = async () => {
    if (file) {
      try {
        setLoading(true);
        //Create a formdata object and append the uploaded file 
        const formData = new FormData();
        formData.append('image', file);
        //Send a post request to the backend with the uploaded image
        const response = await axios.post('http://127.0.0.1:5000/recognize', formData);
        console.log('Response from backend:', response.data);
        //Go to the Display page with the image url and the processed data 
        navigate(`/Display?file=${encodeURIComponent(URL.createObjectURL(file))}`, {
          state: { names: response.data },
        });
      } catch (error) {
        console.error('Error sending image to backend:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('Please select a file.');
    }
  };
//Render the upload page
  return (
    <div className="uploadpage-content">
    <div className="upload-container">
      <h2 className='page-title'>Upload image to the smart gallery:</h2>
      <label htmlFor="file-upload" className="custom-file-upload">
        <input id="file-upload" type="file" onChange={handleChange} />
      </label>

      {file && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded file"
              className="preview-image"
            />
          </div>
        )}

      <div>
        {loading ? (
          <div className="loading-container">
            <p>The AI is analyzing the image</p>
            <div className="loader"></div>
          </div>
        ) : (
          <button className="upload-button" onClick={handleGoToDisplay}>
            Analyze the image
          </button>
        )}
      </div>
    </div>
  </div>
  );
};

export default UploadPage;
