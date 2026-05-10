/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isContact = location.pathname === '/contact';

  return (
    <header className="fixed top-8 left-0 w-full z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-12 bg-black/65 backdrop-blur-[20px] glass-border px-8 py-3.5 rounded-full pointer-events-auto shadow-2xl">
        <Link to="/" className="font-display text-xl font-bold tracking-tighter text-white hover:opacity-70 transition-opacity">
          RHODIUM.
        </Link>
        
        <nav className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`font-ui text-[11px] uppercase tracking-[0.2em] transition-colors ${!isContact ? 'text-white font-semibold' : 'text-muted hover:text-white'}`}
          >
            Home
          </Link>
          <Link 
            to="/contact" 
            className={`font-ui text-[11px] uppercase tracking-[0.2em] transition-colors ${isContact ? 'text-white font-semibold' : 'text-muted hover:text-white'}`}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
