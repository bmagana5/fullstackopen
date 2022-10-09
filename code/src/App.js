import Note from './components/Note';

// const Display = ({counter}) => {
//   return (
//     <div>{counter}</div>
//   );
// };

// const Button = ({ onClick, text }) => {
//   return (
//     <button onClick={onClick}>{text}</button>
//   );
// };

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => <Note key={note.id} note={note} />)}
      </ul>
    </div>
  );
};

export default App;
