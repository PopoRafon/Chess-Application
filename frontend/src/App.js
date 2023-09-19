import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
