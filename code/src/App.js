import { useState } from 'react';

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>;

const Total = ({ ratings }) => {
  let sum = 0;
  Object.keys(ratings).forEach(key => sum += ratings[key]);
  return (
    <tr>
      <td>all</td><td>{sum}</td>
    </tr>
  );
};

const Average = ({ ratings }) => {
  let sum = 0;
  Object.keys(ratings).forEach(key => sum += ratings[key]);
  let average = (ratings.good - ratings.bad) / sum;
  if (isNaN(average)) {
    return (
      <tr>
        <td>average</td><td>0</td>
      </tr>
    );
  }
  return (
    <tr>
      <td>average</td><td>{average}</td>
    </tr>
  )
};

const Positive = ({ ratings }) => {
  let sum = 0;
  Object.keys(ratings).forEach(key => sum += ratings[key])
  let positive = ratings.good / sum * 100;
  if (isNaN(positive)) {
    return (
      <tr>
        <td>positive</td><td>0 %</td>
      </tr>
    );
  }
  return (
    <tr>
      <td>positive</td><td>{positive} %</td>
    </tr>
  );
};

const Statistics = ({ ratings }) => {
  let sum = 0;
  Object.keys(ratings).forEach(key => sum += ratings[key]);
  if (sum === 0) {
    return (
      <div> 
        No feedback given
      </div>
    );
  }
  return (
    <table>
      <tbody>
        {Object.keys(ratings).map(key => <StatisticLine text={key} value={ratings[key]} key={key}/>)}
        <Total ratings={ratings} />
        <Average ratings={ratings} />
        <Positive ratings={ratings} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [ratings, setRatings] = useState({
    good: 0,
    neutral: 0,
    bad: 0
  });

  const handleGoodButton = () => setRatings({ ...ratings, good: ratings.good + 1});
  const handleNeutralButton = () => setRatings({ ...ratings, neutral: ratings.neutral + 1});
  const handleBadButton = () => setRatings({ ...ratings, bad: ratings.bad + 1});

  return (
    <div>
      <Header text={"give feedback"} />
      <Button onClick={handleGoodButton} text={"good"} />
      <Button onClick={handleNeutralButton} text={"neutral"} />
      <Button onClick={handleBadButton} text={"bad"} />
      <Header text={"statistics"} />
      <Statistics ratings={ratings} />
    </div>
  );
};

export default App;
