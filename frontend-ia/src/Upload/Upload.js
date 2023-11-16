import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState();

  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(URL.createObjectURL(uploadedFile));
  };

  return (
    <div>
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      {file && (
        <div style={{ maxWidth: '400px' }}>
          <img src={file} alt="Uploaded file" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
      <Link to={`/Gallery?file=${encodeURIComponent(file)}`}>
        <button>Go to Gallery</button>
      </Link>
      <p>This is a simple example of a React page.</p>
    </div>
  );
};

export default UploadPage;

