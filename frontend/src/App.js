import './styles/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Page404 from './pages/Page404';
import Home from './pages/Home';
import Play from './pages/Play';
import PlayOnline from './pages/PlayOnline';
import Navigation from './components/Navigation';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState({isLoggedIn: false});
  const paths = ['/', '/register', '/play', '/play/online'];
  const token = localStorage.getItem('access');

  useEffect(() => {
    fetch('api/v1/user/data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        setUser({
          ...data.success,
          isLoggedIn: true
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation routerPaths={paths} />
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
