const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
};

const Part = (props) => {
  return (
    <p>
      {props.p["name"]} {props.p["exercises"]}
    </p>
  );
}

const Content = (props) => {
  return (
    <>
      {props.parts.map(p => <Part p={p} />)}
    </>
  );
};

const Total = (props) => {
  let sum = 0;
  props.parts.forEach(p => sum += p.exercises)
  return (
    <p>Number of exercise {sum}</p>
  );
};

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };


  return (
    <div>
      <Header course={course["name"]} />
      <Content parts={course["parts"]}/>
      <Total parts={course["parts"]}/>
    </div>
  );
};

export default App;
