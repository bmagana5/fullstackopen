import { useEffect, useState } from "react";
import personService from './services/person';

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

const Persons = ({ persons, nameFilter, deleteCallback }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(nameFilter.toLowerCase()));
  const confirmDeletion = (name, id) => {
    if (window.confirm(`Are you sure you want to delete entry for '${name}'?`)) {
      deleteCallback(id)
    }
  };
  return (
    filteredPersons.map(person => 
      <div key={person.id}>
        {person.name} {person.number} <button onClick={() => confirmDeletion(person.name, person.id)}>Delete</button>
      </div>
    )
  );
};

const Notification = ({ message }) => {
  if (message === '') {
    return null;
  }
  return (
    <div className="msg">
      {message}
    </div>
  );
};

const ErrorNotification = ({ message }) => {
  if (message === '') {
    return null;
  }
  return (
    <div className="error-msg">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // use state effect to fetch data from db.json; this needs to be called only once after initial render
  useEffect(() => {
    personService.getAll().then(fetchedPersons => setPersons(fetchedPersons));
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
      const personObj = {
        name: newName,
        number: newPhoneNumber
      }
      personService.create(personObj)
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          setNotificationMessage(`Added '${newPerson.name}'`);
          setTimeout(() => {
            setNotificationMessage('');
          }, 5000);
        })
        .catch((error) => {
          // setErrorMessage(`Information for ${personObj.name} has already been removed from the server.`);
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage('');
          }, 5000);
        });
    } else if (duplicateName && duplicateNumber === undefined) {
        if (window.confirm(`'${duplicateName.name}' is already in the phonebook. Do you want to replace current number with a new one?`)) {
          const duplicatePerson = persons.find(p => p.name.toLowerCase() === duplicateName.name.toLowerCase());
          personService.update(duplicatePerson.id, {...duplicatePerson, number: newPhoneNumber})
            .then(updatedPerson => {
              setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p));
              setNotificationMessage(`Updated entry for '${updatedPerson.name}'`);
              setTimeout(() => {
                setNotificationMessage('');
              }, 5000);
            })
            .catch(error => {
              // setErrorMessage(`Information for ${duplicatePerson.name} has already been removed from the server.`);
              setErrorMessage(error.response.data.error);
              setTimeout(() => {
                setErrorMessage('');
              }, 5000);
            });
        }
    } else if (duplicateName === undefined && duplicateNumber) {
      alert('This phone number is already in use!');
      return;
    } else {
      alert('This phonebook entry already exists.');
      return;
    }
    setNewName('');
    setNewPhoneNumber('');
  };

  const removePerson = (id) => {
    personService._delete(id).then(() => {
      setPersons(persons.filter(p => p.id !== id));
    });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage}/>
      <ErrorNotification message={errorMessage}/>
      <Filter filterHandler={handleFilterInput} filterValue={nameFilter}/>
      <h2>add a new</h2>
      <PersonForm submitHandler={addNewName} 
                  nameHandler={handleNameInput} 
                  numberHandler={handleNumberInput}
                  nameValue={newName}
                  numberValue={newPhoneNumber}/>

      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} deleteCallback={removePerson}/>
    </div>
  );
};

export default App;