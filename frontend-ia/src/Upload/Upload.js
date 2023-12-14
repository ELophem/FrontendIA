import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const UploadPage = () => {
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleGoToGallery = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('http://127.0.0.1:5000/recognize', formData);
        console.log('Response from backend:', response.data);

        // Redirect to GalleryPage after sending the image to the backend
        navigate(`/Gallery?file=${encodeURIComponent(URL.createObjectURL(file))}`,{
          state: {names: response.data}
        });
      } catch (error) {
        console.error('Error sending image to backend:', error);
      }
    } else {
      // Handle case where no file is selected
      console.error('Please select a file.');
    }
  };

  return (
    <div>
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      {file && (
        <div style={{ maxWidth: '400px' }}>
          <img src={URL.createObjectURL(file)} alt="Uploaded file" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}     
      <button onClick={handleGoToGallery}>Go to Gallery</button>
    </div>
  );
};

export default UploadPage;


