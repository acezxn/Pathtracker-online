import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./pages/Home";
import Playground from "./pages/Playground";
import NoPage from "./pages/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="playground" element={<Playground />} />
          <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
