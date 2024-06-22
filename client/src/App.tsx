import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicOutlet } from './components/auth/outlets/PublicOutlet';
import { PrivateOutlet } from './components/auth/outlets/PrivateOutlet';
import { UserProvider } from './contexts/UserContext';
import { ChatList } from './components/chat-list/ChatList';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Home } from './components/Home';

export function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/" element={<PublicOutlet />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>

            <Route path="/" element={<PrivateOutlet />}>
              <Route path="/chats" element={<ChatList />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}
