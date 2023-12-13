import React, { useEffect, useState } from 'react';
import { storage } from '../Firebase/firebaseConfig';
import { list, ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import './display.css';

const Display = () => {
  const [imageData, setImageData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch image URLs from Firebase Storage
      const storageRef = ref(storage);
      const imagesList = await list(storageRef);

      try {
        const imageUrls = await Promise.all(
          imagesList.items.map(async (itemRef) => {
            return await getDownloadURL(itemRef);
          })
        );

        const db = getFirestore();
        const personsCollection = collection(db, 'Persons');
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

  const filteredImageData = imageData.filter((person) => {
    return (
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="gallery">
      <h1>Image Gallery</h1>
      <input
        type="text"
        placeholder="Search by name or surname"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="image-grid">
        {filteredImageData.map((person, index) => (
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
