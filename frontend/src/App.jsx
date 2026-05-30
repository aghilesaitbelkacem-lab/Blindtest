import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import SetupPage from './Pages/SetupPage';
import GamePage from './Pages/GamePage';
import ResultPage from './Pages/ResultPage';
import './App.css';

function Navigation() {
  const navigate = useNavigate();
}

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;