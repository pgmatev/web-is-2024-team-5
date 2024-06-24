import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ChatPage } from './components/ChatPage/ChatPage';
import { Header } from './components/Header/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { PrivateOutlet } from './components/Auth/outlets/PrivateOutlet';
import { PublicOutlet } from './components/Auth/outlets/PublicOutlet';

export function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/chats" />} />

            <Route path="/" element={<PublicOutlet />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>

            <Route path="/" element={<PrivateOutlet />}>
              <Route path="/chats" element={<ChatPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/chats" />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}
