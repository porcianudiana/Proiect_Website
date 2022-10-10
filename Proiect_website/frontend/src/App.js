
import './App.css';
import TabelShips from './components/Ships';
import TabelCrewMembers from './components/CrewMembers';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TabelShips />} />
          <Route path="/crewmembers" element={<TabelCrewMembers />} />

        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
