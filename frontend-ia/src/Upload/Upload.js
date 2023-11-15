import React, { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState();

  const handleChange = (e) => {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div>
      <h2>Add Image:</h2>
      <input type="file" onChange={handleChange} />
      {file && (
        <div style={{ maxWidth: '400px' }}> {/* Adjust the maximum width as needed */}
          <img src={file} alt="Uploaded file" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
      <p>This is a simple example of a React page.</p>
    </div>
  );
};

export default UploadPage;
