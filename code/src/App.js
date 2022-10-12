import { useEffect, useState } from "react";
import axios from 'axios';

const Filter = ({ filterHandler, filterValue }) => {
  return (
    <div>
    filter shown with <input onChange={filterHandler} value={filterValue}/>
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submitHandler}>
      <div>
        name: <input onChange={props.nameHandler} value={props.nameValue}/>
      </div>
      <div>
        number: <input onChange={props.numberHandler} value={props.numberValue}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

const Persons = ({ persons, nameFilter }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()));
  return (
    filteredPersons.map(person => <div key={person.id}>{person.name} {person.number}</div>)
  );
};

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  // use state effect to fetch data from db.json; this needs to be called only once after initial render
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []
  );

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewPhoneNumber(event.target.value);
  };

  const handleFilterInput = (event) => {
    setNameFilter(event.target.value);
  };

  const addNewName = (event) => {
    event.preventDefault();
    if (newName === '' || newPhoneNumber === '') {
      alert('Please fill in the input fields');
      return;
    }
    let duplicateName = persons.find(person => newName === person.name);
    let duplicateNumber = persons.find(person => newPhoneNumber === person.number);
    if (duplicateName === undefined && duplicateNumber === undefined) {
      setPersons(persons.concat({ name: newName, number: newPhoneNumber, id: persons.length + 1 }));
      setNewName('');
      setNewPhoneNumber('');
    } else {
      let alertString = '';
      let duplicateCounter = 0;
      if (duplicateName) {
        duplicateCounter += 1;
        alertString += `The name '${newName}' `;
      }
      if (duplicateNumber) {
        duplicateCounter += 1;
        if (duplicateCounter === 2) {
          alertString += `and the number '${newPhoneNumber}' `;
        } else if (duplicateCounter === 1) {
          alertString += `The number '${newPhoneNumber}' `;
        }
      }
      if (duplicateCounter === 0) {
        alert('an error has occurred');
        return;
      }
      alertString += duplicateCounter === 2 ? 'are ' : 'is '; 
      alertString += 'already added to the phonebook';
      alert(alertString);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterHandler={handleFilterInput} filterValue={nameFilter}/>
      <h2>add a new</h2>
      <PersonForm submitHandler={addNewName} 
                  nameHandler={handleNameInput} 
                  numberHandler={handleNumberInput}
                  nameValue={newName}
                  numberValue={newPhoneNumber}/>

      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter}/>
    </div>
  );
};

export default App;