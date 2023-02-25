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
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="playground" element={<Playground />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
