import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Purchased from './pages/Purchased';
import Purchase from './pages/Purchase';
import Dashboard from './pages/Dashboard';
import MyHomes from './pages/MyHomes';

function App() {

  
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/purchase/:id" element={<Purchase />} />
        <Route exact path="/purchased/:id" element={<Purchased />} />
        <Route exact path="/dashboard/:id" element={<Dashboard />} />
        <Route exact path="/myhomes" element={<MyHomes />} />
      </Routes>
    </Router>
  );
}

export default App;