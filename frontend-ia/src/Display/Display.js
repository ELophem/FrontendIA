import React, { useEffect, useState } from 'react';
import { storage } from '../Firebase/firebaseConfig'; // Import your Firebase storage instance
import { list, ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs,getFirestore } from 'firebase/firestore'; // Import Firestore functions for querying data
import './display.css';

const Display = () => {
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch image URLs from Firebase Storage
      const storageRef = ref(storage); // Reference to Firebase Storage
      const imagesList = await list(storageRef); // Replace with your folder name

      try {
        // Fetch download URLs for all images in the folder
        const imageUrls = await Promise.all(
          imagesList.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );

        // Fetch person data from Firestore
        const db = getFirestore(); // Assuming you've initialized Firebase Firestore
        const personsCollection = collection(db, 'Persons'); // Replace with your collection name
        const querySnapshot = await getDocs(personsCollection);

        const personsData = [];
        let index = 0;

        querySnapshot.forEach((doc) => {
          const person = doc.data();
          if (index < imageUrls.length) {
            personsData.push({
              name: person.name,
              surname: person.surname,
              photo: imageUrls[index],
            });
            index++;
          }
        });

        setImageData(personsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="gallery">
      <h1>Image Gallery</h1>
      <div className="image-grid">
        {imageData.map((person, index) => (
          <div key={index} className="image-item">
            <div className="image-box">
              <img src={person.photo} alt={``} />
            </div>
            <div className="image-details">
              <p>{person.name}</p>
              <p>{person.surname}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Display;
