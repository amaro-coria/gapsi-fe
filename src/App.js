import React, { useState, useEffect } from 'react';
import logo from './images/gapsi.png';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProviderPage from './ProviderPage';
import './App.css';

function App() {
  const [welcomeText, setWelcomeText] = useState('');
  const [secondValue, setSecondValue] = useState('');

  useEffect(() => {
    fetchData(); // Fetch the data when the component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response1 = await fetch('http://localhost:4000/welcome');
      const data1 = await response1.json();
      setWelcomeText(data1.text);

      const response2 = await fetch('http://localhost:4000/version');
      const data2 = await response2.json();
      setSecondValue(data2.value);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1>e-Commerce Gapsi</h1>
      <img src={logo} alt="Logo" className="App-logo" />
        <h1>{welcomeText}</h1>
        <h2>{secondValue}</h2>
      </header>
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/providers">Providers</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/providers" element={<ProviderPage />} />
        </Routes>
      </div>
    </Router>
  
    </div>
  );
}
function Home() {
  return <h1>Home Page</h1>;
}

export default App;
