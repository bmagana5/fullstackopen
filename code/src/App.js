import { useEffect, useState } from "react";
import axios from 'axios';


const Filter = ({ searchFilterHandler, searchFilterValue }) => {
  return(
    <div>
      find countries <input onChange={searchFilterHandler} value={searchFilterValue}/>
    </div>
  );
};

const Button = ({ countryName, buttonHandler}) => {
  return (
    <button onClick={buttonHandler} value={countryName}>show</button>
  );
};

const WeatherInfo = ({ weatherData }) => {
  if (weatherData === undefined)
    return (<></>);
  else {
    console.log('WeatherInfo component: ', weatherData)
    const icon_img = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    return (
      <div>
        <h2>Weather in {weatherData.name}</h2>
        <p>temperature {weatherData.main.temp}° Fahrenheit</p>
        <img src={icon_img} alt={icon_img}/>
        <p>{weatherData.weather[0].icon[-1] === 'd' ? 'Day' : 'Night'} time, {weatherData.weather[0].description}</p>
        <p>wind {weatherData.wind.speed} m/s</p>
      </div>
    );
  }
};

const CountryStats = ({ country, weatherData }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital <b>{country.capital[0]}</b></div>
      <div>area <b>{country.area}</b></div>
      <p><strong>languages:</strong></p>
      <ul>
        {Object.entries(country.languages).map(lang => <li key={lang[0]}>{lang[1]}</li>)}
      </ul>
      <div>
        <img src={country.flags['png']} alt={country.flags['png']}/>
      </div>
      <WeatherInfo weatherData={weatherData} />
    </div>
  );
};

const CountriesDisplay = ({ filteredCountries, buttonHandler, weatherData }) => {
  if (filteredCountries.length === 1) {
    let country = filteredCountries[0];
    return (
      <CountryStats country={country} weatherData={weatherData}/>
    );
  } else if (filteredCountries.length <= 10 && filteredCountries.length > 0) {
    return (
      <div>
        {filteredCountries.map(country => <div key={country.name.common}>{country.name.common} <Button countryName={country.name.common} buttonHandler={buttonHandler}/></div>)}
      </div>
    );
  } else {
    return (
      <div>Too many searches, specify another filter</div>
    ); 
  }
};

const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [weatherData, setWeatherData] = useState(undefined);

  // generate list of countries with api call here
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries([].concat(response.data));
      })
  }, []);

  useEffect(() => {
    if (filteredCountries.length === 1 && weatherData === undefined) {
      console.log('retrieving weather data...');
      const weatherCity = filteredCountries[0].capital[0];
      const api_key = process.env.REACT_APP_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity}&appid=${api_key}&units=imperial`;
      axios
        .get(url)
        .then(response => {
          setWeatherData(response.data);
        });
    } else if (filteredCountries.length > 1) {
      if (weatherData !== undefined) {
        setWeatherData(undefined);
      }
    }
  }, [filteredCountries, weatherData]);

  const searchFilterHandler = (event) => {
    setSearch(event.target.value);
    if (search !== '')
      setFilteredCountries([].concat(countries.filter(country => country.name.common.toUpperCase().includes(search.toUpperCase()))));
  };

  const countryButtonHandler = (event) => {
    console.log(event);
    setSearch(event.target.value);
  };

  return (
    <div>
      <Filter searchFilterHandler={searchFilterHandler} searchFilterValue={search}/>
      <CountriesDisplay filteredCountries={filteredCountries}
                        buttonHandler={countryButtonHandler}
                        weatherData={weatherData}/>
    </div>
  );
};

export default App;