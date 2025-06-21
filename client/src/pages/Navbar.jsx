// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { Home, Flame, Trophy, Zap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-black text-green-300 p-4 flex justify-between items-center border-b border-green-500 shadow-md">
      <h1 className="text-2xl font-bold text-green-400 flex items-center gap-2">
        <Zap className="w-6 h-6" />
        MemeHustle
      </h1>
      <div className="flex gap-6 items-center text-sm">
        <Link to="/" className="flex items-center gap-1 hover:text-green-500">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link to="/bidding" className="flex items-center gap-1 hover:text-green-500">
          <Flame className="w-4 h-4" />
          Bidding Arena
        </Link>
        <Link to="/leaderboard" className="flex items-center gap-1 hover:text-green-500">
          <Trophy className="w-4 h-4" />
          Leaderboard
        </Link>
      </div>
    </nav>
  );
}
