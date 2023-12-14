// import React, { useEffect, useState } from 'react';
// import { storage } from '../Firebase/firebaseConfig';
// import { list, ref, getDownloadURL } from 'firebase/storage';
// import { collection, getDocs, getFirestore } from 'firebase/firestore';
// import './display.css';

// const Display = () => {
//   const [imageData, setImageData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       // Fetch image URLs from Firebase Storage
//       const storageRef = ref(storage);
//       const imagesList = await list(storageRef);

//       try {
//         const imageUrls = await Promise.all(
//           imagesList.items.map(async (itemRef) => {
//             return await getDownloadURL(itemRef);
//           })
//         );

//         const db = getFirestore();
//         const personsCollection = collection(db, 'Persons');
//         const querySnapshot = await getDocs(personsCollection);

//         const personsData = [];

//         querySnapshot.forEach((doc) => {
//           const person = doc.data();
//           const personDetails = [];

//           for (const field in person){
//             if (field.startsWith('Person')){
//               personDetails.push(person[field]);
//             }
//           }
          
//           if (personDetails.length > 0) {
//             personsData.push({
//               names: personDetails,
//               photo: imageUrls[personsData.length],
//             });
//           }
//         });

//         setImageData(personsData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredImageData = imageData.filter((personData) => {

//     for (const name in personData.names){
//       if (
//         personData.details[name].toLowerCase().includes(searchTerm.toLowerCase())
//       ){
//         return true;
//       }
//     }
//     return false;
//   });

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div className="gallery">
//       <h1>Image Gallery</h1>
//       <input
//         type="text"
//         placeholder="Search by name or surname"
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       <div className="image-grid">
//         {filteredImageData.map((person, index) => (
//           <div key={index} className="image-item">
//             <div className="image-box">
//               <img src={person.photo} alt={`Person ${index +1}`} />
//             </div>
//             <div className="image-details">
//               {person.names.map((name,idx) => (
//               <p key= {idx}>{name}</p>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Display;

// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, getFirestore } from 'firebase/firestore';

// const DisplayPersons = () => {
//   const [personsData, setPersonsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {

//         const db = getFirestore();
//         const personsCollection = collection(db, 'Persons');
//         const querySnapshot = await getDocs(personsCollection);

//         const persons = querySnapshot.docs.map((doc) => doc.data());
//         console.log(personsData);
//         setPersonsData(persons);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredPersons = personsData.filter((person) => {
//     const names = Object.values(person);

//     return names.some(
//       (name) => name && name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search by name"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       {filteredPersons.map((person, index) => (
//         <div key={index}>
//           <img src={person.Photo} alt={`Person ${index + 1}`} />
//           <p>{person.Name}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DisplayPersons;

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
