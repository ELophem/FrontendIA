import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import './display.css'
const DisplayPersons = () => {
  const [personsData, setPersonsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const personsCollection = collection(db, 'Persons');
        const querySnapshot = await getDocs(personsCollection);

        const persons = querySnapshot.docs.map((doc) => doc.data());
        setPersonsData(persons);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredPersons = personsData.filter((person) => {
    const names = Object.values(person);
    return names.some(
      (name) =>
        name && name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="gallery">
      <h1>Image Gallery</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="image-grid">
        {filteredPersons.map((person, index) => (
          <div key={index} className="image-item">
            <div className="image-box">
              <img src={person.Photo} alt={`Person ${index + 1}`} />
            </div>
            <div className="image-details">
              {Object.values(person)
                .filter((name) => typeof name === 'string' && name !== person.Photo)
                .map((name, nameIndex) => (
                  <p key={nameIndex}>{name}</p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayPersons;
