import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Page404 from './pages/Page404';
import Home from './pages/Home';
import Play from './pages/Play';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/play' element={<Play />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
