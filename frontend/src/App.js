import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from './contexts/UserContext';
import getUserData from './utils/UserData';
import { createAccessToken } from './utils/AccessToken';
import Page404 from './pages/Page404';
import Home from './pages/Home';
import Play from './pages/Play';
import PlayOnline from './pages/PlayOnline';
import Navigation from './components/Navigation';
import Register from './pages/Register';

function App() {
  const { setUser } = useUser();
  const paths = ['/', '/register', '/play', '/play/online'];
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const fetchData = async() => {
      await createAccessToken();
      await getUserData(setUser);

      setIsLoaded(true);
    }

    fetchData();
  }, [setUser]);

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation routerPaths={paths} isLoaded={isLoaded} />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='register' element={<Register />} />
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
