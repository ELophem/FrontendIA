// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Upload.css'

// const UploadPage = () => {
//   const [file, setFile] = useState();
//   const [loading, setLoading] = useState(false); // Add loading state
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     setFile(uploadedFile);
//   };

//   const handleGoToDisplay = async () => {
//     if (file) {
//       try {
//         setLoading(true); // Set loading state to true when starting the API call

//         const formData = new FormData();
//         formData.append('image', file);

//         const response = await axios.post('http://127.0.0.1:5000/recognize', formData);
//         console.log('Response from backend:', response.data);

//         // Redirect to DisplayPage after sending the image to the backend
//         navigate(`/Display?file=${encodeURIComponent(URL.createObjectURL(file))}`, {
//           state: { names: response.data },
//         });
//       } catch (error) {
//         console.error('Error sending image to backend:', error);
//       } finally {
//         setLoading(false); // Set loading state back to false after API call completes (success or failure)
//       }
//     } else {
//       // Handle case where no file is selected
//       console.error('Please select a file.');
//     }
//   };

//   return (
//     <div>
//       <h2>Add Image:</h2>
//       <input type="file" onChange={handleChange} />
//       {file && (
//         <div style={{ maxWidth: '400px' }}>
//           <img
//             src={URL.createObjectURL(file)}
//             alt="Uploaded file"
//             style={{ maxWidth: '100%', height: 'auto' }}
//           />
//         </div>
//       )}
//       {loading ? (
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <p style={{ marginRight: '8px' }}>The AI is analyzing the photo</p>
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <button onClick={handleGoToDisplay}>Go to Display</button>
//       )}
//     </div>
//   );
// };

// export default UploadPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css'; // Make sure to import your CSS file here

const UploadPage = () => {
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleGoToDisplay = async () => {
    if (file) {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post('http://127.0.0.1:5000/recognize', formData);
        console.log('Response from backend:', response.data);

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

  return (
    <div className="container">
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange}  />

      {file && (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded file"
            className="preview-image"
          />
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <p>The AI is analyzing the image</p>
          <div className="loader"></div>
        </div>
      ) : (
        <button className="upload-button" onClick={handleGoToDisplay}>
          Go to Display
        </button>
      )}
    </div>
  );
};

export default UploadPage;
