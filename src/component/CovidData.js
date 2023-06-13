import "./CovidData.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
function CovidData() {
  const [continents, setContinents] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Getting the data from the API
  const fetchData = async () => {
    try {
      const details = await axios.get(
        "https://covid-193.p.rapidapi.com/statistics",
        {
          headers: {
            "X-RapidAPI-Key":
              "e96e802040msh44187c446f83cf9p109eb3jsn8b8f2100fd8d",
            "X-RapidAPI-Host": "covid-193.p.rapidapi.com",
          },
        }
      );

      console.log(details.data);
      // Scanning all the continents and storing only the unique results in variable uniqueContinents
      const uniqueContinents = Array.from(
        new Set(details.data.response.map((continent) => continent.continent))
      );

      // Setting the value of uniqueContinents in state continents through setContinents
      setContinents(
        uniqueContinents.map((continent) => ({
          name: continent,
          expanded: false,
          countries: details.data.response.filter(
            (item) => item.continent === continent
          ),
        }))
      );
    } catch (error) {
      setError("Error fetching data");
    }
  };
  // Function to updates the expansion status of a specific continent by toggling its expanded property.
  const handleExpandContinent = (continentName) => {
    setContinents((prevContinents) =>
      prevContinents.map((continent) =>
        continent.name === continentName
          ? { ...continent, expanded: !continent.expanded }
          : continent
      )
    );
  };
  //    Function to get the value of the input search box and update it to searchQuery state
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  // Function to
  const handleCountrySearch = () => {
    const result = continents
      .flatMap((continent) => continent.countries)
      .find(
        (country) => country.country.toLowerCase() === searchQuery.toLowerCase()
      );

    setSearchResult(result);
  };
  return (
    <div>
      <h1 className="title">
        COVID-REPORT<span>'s</span>{" "}
      </h1>
      <div className="input">
        <input
          type="text"
          placeholder="Search by country"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="search-btn" onClick={handleCountrySearch}>
          Search
        </button>
      </div>

      {error && <p>{error}</p>}

      {searchResult ? (
        <div>
          <h2>{searchResult.country}</h2>
          <table>
            <thead>
              <tr>
                <th>Population</th>
                <th>Total Cases</th>
                <th>Total Active Cases</th>
                <th>Total Critical Cases</th>
                <th>Total Recovered Cases</th>
                <th>Total Deaths</th>
                <th>Total Tests</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{searchResult.population}</td>
                <td>{searchResult.cases.total}</td>
                <td>{searchResult.cases.active}</td>
                <td>{searchResult.cases.critical}</td>
                <td>{searchResult.cases.recovered}</td>
                <td>{searchResult.deaths.total}</td>
                <td>{searchResult.tests.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="content">
          <h2>All Continents</h2>
          {continents.map((continent) => (
            <div key={continent.name}>
              <h3>
                {continent.name}{" "}
                <button
                  className="toggle-btn"
                  onClick={() => handleExpandContinent(continent.name)}>
                  <span>{continent.expanded ? "-" : "+"}</span>
                </button>
              </h3>

              {continent.expanded && (
                <table>
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Population</th>
                      <th>Total Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {continent.countries.map((country) => (
                      <tr key={country.country}>
                        <td>{country.country}</td>
                        <td>{country.population}</td>
                        <td>{country.cases.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default CovidData;
