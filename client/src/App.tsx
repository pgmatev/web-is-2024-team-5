import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PublicOutlet } from './components/auth/outlets/PublicOutlet';
import { PrivateOutlet } from './components/auth/outlets/PrivateOutlet';
import { UserProvider } from './contexts/UserContext';
import { ChatList } from './components/chat-list/ChatList';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Header } from './components/header/Header';
import { Chat } from './components/chat/Chat';

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
              <Route path="/chats" element={<ChatList />} />
              <Route path="/chat" element={<Chat />} />
            </Route>

            <Route path="*" element={<Navigate to="/chats" />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  );
}
