import { Routes, Route } from 'react-router-dom';
import RedirectHandler from './pages/RedirectHandler';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:code" element={<RedirectHandler />} />
    </Routes>
  );
}

export default App;