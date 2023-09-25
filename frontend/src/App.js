import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Page404 from './pages/Page404';
import Home from './pages/Home';
import Play from './pages/Play';
import PlayOnline from './pages/PlayOnline';
import Navigation from './components/Navigation';

function App() {
  const paths = ['/', '/play', '/play/online'];

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation routerPaths={paths} />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='play'>
              <Route index element={<Play />} />
              <Route path='online' element={<PlayOnline />} />
            </Route>
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
