/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import CinematicScrollProgress from './components/effects/CinematicScrollProgress';

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <CinematicScrollProgress />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
