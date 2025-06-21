// src/pages/Gallery.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import MemeBidCard from '../components/MemeBidCard';

export default function Gallery() {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/memes');
        setMemes(data || []);
      } catch (err) {
        console.error('Error fetching memes:', err);
      }
    };

    fetchMemes();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-200 px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
        {memes.map((meme) => (
          <MemeBidCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
