import { useState } from "react";

const Display = ({counter}) => {
  return (
    <div>{counter}</div>
  );
};

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
};

const History = ({ allClicks }) => {
  if (allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    );
  }
  return (
    <div>
      button press history: {allClicks.join(' ')}
    </div>
  );
};

// complex state example
// const App = () => {
//   const [ clicks, setClicks ] = useState({ left: 0, right: 0 });

//   const handleLeftClicks = () => setClicks({...clicks, left: clicks.left + 1});
//   const handleRightClicks = () => setClicks({...clicks, right: clicks.right + 1});

//   return (
//     <div>
//       <Display counter={clicks.left} />
//       <Button onClick={handleLeftClicks} text={"left"}/>
//       <Button onClick={handleRightClicks} text={"right"}/>
//       <Display counter={clicks.right} />
//     </div>
//   );
// };

const App = () => {
  const [ clicks, setClicks ] = useState({ left: 0, right: 0 });
  const [ allClicks, setAll ] = useState([]);

  const handleLeftClicks = () => {
    setAll(allClicks.concat('L'));
    setClicks({ ...clicks, left: clicks.left + 1 });
  }

  const handleRightClicks = () => {
    setAll(allClicks.concat('R'));
    setClicks({ ...clicks, right: clicks.right + 1 });
  }

  return (
    <div>
      <Display counter={clicks.left}/>
      <Display counter={clicks.right}/>
      <Button onClick={handleLeftClicks} text={"left"}/>
      <Button onClick={handleRightClicks} text={"right"}/>
      <History allClicks={allClicks} />
    </div>
  );

};

export default App;
