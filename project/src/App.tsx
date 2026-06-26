import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Lifecycle } from './pages/Lifecycle';
import { Events } from './pages/Events';
import { Analytics } from './pages/Analytics';
import { Future } from './pages/Future';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/events" element={<Events />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/future" element={<Future />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
