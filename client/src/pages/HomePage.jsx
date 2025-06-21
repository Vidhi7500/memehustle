import { useEffect, useState } from 'react';
import MemeCard from '../components/MemeCard';
import MemeForm from '../components/MemeForm';
import Leaderboard from '../components/Leaderboard';
import { fetchMemes } from '../utils/api';
import { Rocket } from 'lucide-react';

export default function Home() {
  const [memes, setMemes] = useState([]);

  const refreshMemes = async () => {
    const data = await fetchMemes();
    setMemes(data.reverse()); 
  };

  useEffect(() => {
    refreshMemes();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-black min-h-screen">
      <h1 className="text-4xl text-cyan-400 font-bold flex items-center gap-2">
        <Rocket className="w-6 h-6" />
        MemeHustle
      </h1>
      
      <MemeForm onCreated={refreshMemes} />
      <Leaderboard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
