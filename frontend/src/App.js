import '#styles/main.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useUser } from '#contexts/UserContext';
import { AlertProvider } from '#contexts/AlertContext';
import AccessToken from '#utils/AccessToken';
import Navigation from '#components/navigation/Navigation';
import getUserData from '#utils/UserData';
import Alert from '#components/alert/Alert';
import Page404 from '#pages/Page404';
import Home from '#pages/Home';
import Register from '#pages/Register';
import Login from '#pages/Login';
import Play from '#pages/Play';
import PlayOnline from '#pages/PlayOnline';
import PlayComputer from '#pages/PlayComputer';
import Ranking from '#pages/Ranking';
import Settings from '#pages/Settings';
import PasswordChange from '#pages/PasswordChange';
import PasswordReset from '#pages/PasswordReset';
import PasswordResetConfirm from '#pages/PasswordResetConfirm';
import AccountDelete from '#pages/AccountDelete';

function App() {
  const { setUser } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await AccessToken.createToken();
      await getUserData(setUser);

      setIsLoaded(true);
    })()
  }, [setUser]);

  return isLoaded && (
    <BrowserRouter>
      <AlertProvider>
        <Navigation />
        <Alert />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='ranking' element={<Ranking />} />
            <Route path='settings' element={<Settings />} />
            <Route path='account/delete' element={<AccountDelete />} />
            <Route path='password'>
              <Route path='change' element={<PasswordChange />} />
              <Route path='reset' element={<PasswordReset />} />
              <Route path='reset/confirm/:uidb64/:token' element={<PasswordResetConfirm />} />
            </Route>
            <Route path='play'>
              <Route index element={<Play />} />
              <Route path='online/:id' element={<PlayOnline />} />
              <Route path='computer' element={<PlayComputer />} />
            </Route>
          </Route>
          <Route path='*' element={<Page404 />} />
        </Routes>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
