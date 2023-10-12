import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from './contexts/UserContext';
import getUserData from './utils/UserData';
import { createAccessToken } from './utils/AccessToken';
import { AlertProvider } from './contexts/AlertContext';
import Alert from './components/Alert';
import Page404 from './pages/Page404';
import Home from './pages/Home';
import Play from './pages/Play';
import PlayOnline from './pages/PlayOnline';
import Register from './pages/Register';
import Login from './pages/Login';
import PlayComputer from './pages/PlayComputer';

function App() {
  const { setUser } = useUser();
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
        <AlertProvider>
          <Alert />
          <Routes>
            <Route path='/'>
              <Route index element={<Home isLoaded={isLoaded} />} />
              <Route path='register' element={<Register isLoaded={isLoaded} />} />
              <Route path='login' element={<Login isLoaded={isLoaded} />} />
              <Route path='play'>
                <Route index element={<Play isLoaded={isLoaded} />} />
                <Route path='online/:id' element={<PlayOnline isLoaded={isLoaded} />} />
                <Route path='computer' element={<PlayComputer isLoaded={isLoaded} />} />
              </Route>
            </Route>
            <Route path='*' element={<Page404 />} />
          </Routes>
        </AlertProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
