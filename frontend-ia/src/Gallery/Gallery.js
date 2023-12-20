import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import './Gallery.css'
// Gallery page where all the images will be shown


const GalleryPersons = () => {
  const [personsData, setPersonsData] = useState([]); //Store fetched Data
  const [searchTerm, setSearchTerm] = useState(''); // Store the search term from the searchbar
  //When the components mount it fetches the data from firebase 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(); //Get data from the Firestore collection 'Persons'
        const personsCollection = collection(db, 'Persons');
        const querySnapshot = await getDocs(personsCollection);
        //Get the data from the documents and update the state
        const persons = querySnapshot.docs.map((doc) => doc.data());
        setPersonsData(persons);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); //Invoke this function when component mounts
  }, []);
  //Filtered persons to show based on the search term in the search bar 
  const filteredPersons = personsData.filter((person) => {
    const names = Object.values(person);
    return names.some(
      (name) =>
        name && name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  //Render gallery elements
  return (
    <div className='gallery-container'>
    <div className="gallery">
      <h1 className='page-title'>Image Gallery</h1>
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
    </div>
  );
};

export default GalleryPersons;
