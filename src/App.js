import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import About from './pages/About';
import Playground from "./pages/Playground";
import NoPage from "./pages/NoPage";
import Help from './pages/Help';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/pathtracker" element={<Home />} />
          <Route path="/pathtracker/about" element={<About />} />
          <Route path="/pathtracker/help" element={<Help />} />
          <Route path="/pathtracker/playground" element={<Playground />} />
          <Route path="/pathtracker/*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
