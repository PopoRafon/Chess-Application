import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from './contexts/UserContext';
import getUserData from './utils/UserData';
import { createAccessToken } from './utils/AccessToken';
import Alert from './components/Alert';
import Page404 from './pages/Page404';
import Home from './pages/Home';
import Play from './pages/Play';
import PlayOnline from './pages/PlayOnline';
import Navigation from './components/sidebars/Navigation';
import Register from './pages/Register';
import Login from './pages/Login';
import PlayComputer from './pages/PlayComputer';

function App() {
  const { setUser } = useUser();
  const paths = ['/', '/register', '/login', '/play', '/play/online', '/play/computer'];
  const [isLoaded, setIsLoaded] = useState(false);
  const [alert, setAlert] = useState({show: false, message: ''});

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
        {alert.show && (
          <Alert setAlert={setAlert} message={alert.message} />
        )}
        <Navigation setAlert={setAlert} routerPaths={paths} isLoaded={isLoaded} />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='register' element={<Register setAlert={setAlert} />} />
            <Route path='login' element={<Login setAlert={setAlert} />} />
            <Route path='play'>
              <Route index element={<Play />} />
              <Route path='online' element={<PlayOnline />} />
              <Route path='computer' element={<PlayComputer />} />
            </Route>
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
