import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import PathFollowSimulator from "./pages/PathFollowSimulator";
import NoPage from "./pages/NoPage";
import Help from './pages/Help';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="help" element={<Help />} />
      <Route path="path-follow-simulator" element={<PathFollowSimulator />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}

export default App;
