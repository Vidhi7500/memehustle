import { useState } from 'react';
import MemeForm from '../components/MemeForm';
import Leaderboard from '../components/Leaderboard';
import Gallery from '../components/Gallery';

import {
  UploadCloud,
  Flame,
  Trophy,
  Brain
} from 'lucide-react';

export default function HomePage() {
  const [view, setView] = useState('upload'); // 'upload', 'leaderboard', 'bidding'

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* 🔷 Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-cyan-600 text-white px-8 py-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <Brain className="w-6 h-6" /> MemeHustle
        </h1>
        <div className="space-x-6 text-sm font-medium flex items-center">
          <button
            onClick={() => setView('upload')}
            className={`hover:underline flex items-center gap-1 ${view === 'upload' ? 'underline' : ''}`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload
          </button>
          <button
            onClick={() => setView('bidding')}
            className={`hover:underline flex items-center gap-1 ${view === 'bidding' ? 'underline' : ''}`}
          >
            <Flame className="w-4 h-4" />
            Bidding Arena
          </button>
          <button
            onClick={() => setView('leaderboard')}
            className={`hover:underline flex items-center gap-1 ${view === 'leaderboard' ? 'underline' : ''}`}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>
        </div>
      </nav>

      {/* Spacer below navbar */}
      <div className="h-20" />

      {/* 🎯 Conditional Rendering */}
      <main className="px-6 py-10 max-w-5xl mx-auto">
        {view === 'upload' && (
          <>
            <MemeForm />
            <div className="my-12">
              <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center flex items-center justify-center gap-2">
                <Flame className="w-5 h-5" />
                Live Bidding Arena
              </h2>
              <Gallery />
            </div>
          </>
        )}
        {view === 'bidding' && <Gallery />}
        {view === 'leaderboard' && <Leaderboard />}
      </main>
    </div>
  );
}
