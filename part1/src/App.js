import { useState } from 'react';

const Header = ({ text }) => <h1>{text}</h1>;

const Anecdote = ({ anecdote }) => <p>{anecdote}</p>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const VoteCount = ({ voteCount }) => {
  if (voteCount === 0) {
    return (
      <></>
    );
  } else if (voteCount === 1) {
    return (
      <div>has {voteCount} vote</div>
    );
  }
  return (
    <div>has {voteCount} votes</div>
  );
};

const Popular = ({ anecdotes, votes }) => {
  let max = 0;
  let max_i = -1;
  for (let i = 0; i < votes.length; i++) {
    if (votes[i] > max) {
      max = votes[i];
      max_i = i;
    }
  }
  if (max_i === -1) {
    return (
      <></>
    );
  }
  return (
    <div>
      <Header text={"Anecdote with most votes"} />
      <Anecdote anecdote={anecdotes[max_i]}/>
      <VoteCount voteCount={votes[max_i]} />
    </div>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const getRandomIndex = () => setSelected(Math.floor(Math.random() * anecdotes.length));
  const updateVotes = (index) => {
    const newArray = [...votes];
    newArray[index] += 1;
    setVotes(newArray);
  };

  return (
    <div>
      <Header text={"Anecdote of the day"} />
      <Anecdote anecdote={anecdotes[selected]} />
      <VoteCount voteCount={votes[selected]} />
      <Button onClick={() => updateVotes(selected)} text={"vote"} />
      <Button onClick={getRandomIndex} text={"next anecdote"}/>
      <Popular anecdotes={anecdotes} votes={votes} />
    </div>
  );
};

export default App;