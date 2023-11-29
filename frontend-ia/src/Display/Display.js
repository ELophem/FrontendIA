import React, { useEffect, useState } from 'react';
import { storage } from '../Firebase/firebaseConfig'; // Import your Firebase storage instance
import { list, ref, getDownloadURL } from 'firebase/storage';
import './display.css';

const Gallery = () => {
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    // Function to fetch image URLs from Firebase Storage
    const fetchImageURLs = async () => {
      const storageRef = ref(storage); // Reference to Firebase Storage
      const imagesList = await list(storageRef); // Replace with your folder name

      console.log(imagesList)
      try {

        // Fetch download URLs for all images in the folder
        const urls = await Promise.all(
          imagesList.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );

        setImageURLs(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImageURLs(); // Call the function to fetch image URLs
  }, []);

  return (
    <div className="gallery">
      <h1>Image Gallery</h1>
      <div className="image-grid">
        {imageURLs.map((url, index) => (
          <div key={index} className="image-item">
            <img src={url} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
