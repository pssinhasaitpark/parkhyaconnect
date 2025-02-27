import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
