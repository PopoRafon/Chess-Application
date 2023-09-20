import './styles/main.css';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Page404 from './pages/Page404';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
