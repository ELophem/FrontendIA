import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './Gallery.css';

const GalleryPersons = () => {
  const [personsData, setPersonsData] = useState([]); // Store fetched Data
  const [searchTerm, setSearchTerm] = useState(''); // Store the search term from the searchbar
  const [editIndex, setEditIndex] = useState(null); // Store the index of the item being edited
  const [editedPersons, setEditedPersons] = useState([]); // Store the edited persons

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const personsCollection = collection(db, 'Persons');
        const querySnapshot = await getDocs(personsCollection);
        const persons = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPersonsData(persons);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (index) => {
    setEditIndex(index);
    const personKeys = Object.keys(personsData[index]).filter((key) => key.includes('Person'));
    const editedPersonsArray = personKeys.map((key) => personsData[index][key]);
    setEditedPersons(editedPersonsArray);
  };

  const handleSaveClick = async (index) => {
    try {
      const db = getFirestore();
      const personsCollection = collection(db, 'Persons');
      const docId = personsData[index].id;
      const updateData = {};

      editedPersons.forEach((person, personIndex) => {
        const fieldKey = `Person${personIndex + 1}`;
        updateData[fieldKey] = person;
      });

      await updateDoc(doc(personsCollection, docId), updateData);

      const updatedSnapshot = await getDocs(personsCollection);
      const updatedPersons = updatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPersonsData(updatedPersons);

      setEditIndex(null);
      setEditedPersons([]);
    } catch (error) {
      console.error('Error updating persons:', error);
    }
  };

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
          {personsData.map((person, index) => (
            <div key={index} className="image-item">
              <div className="image-box">
                <img src={person.Photo} alt={`Person ${index + 1}`} />
              </div>
              <div className="image-details">
                {editIndex === index ? (
                  <div>
                    {editedPersons.map((editedPerson, personIndex) => (
                      <div key={personIndex}>
                        <input
                          type="text"
                          value={editedPerson}
                          onChange={(e) => {
                            const updatedPersons = [...editedPersons];
                            updatedPersons[personIndex] = e.target.value;
                            setEditedPersons(updatedPersons);
                          }}
                        />
                      </div>
                    ))}
                    <button className='editButton' onClick={() => handleSaveClick(index)}>Save</button>
                  </div>
                ) : (
                  <>
                    {Object.keys(person).map((key) => {
                      if (key.includes('Person')) {
                        return <p key={key}>{person[key]}</p>;
                      }
                      return null;
                    })}
                    <button className='editButton' onClick={() => handleEditClick(index)}>Edit</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPersons;
