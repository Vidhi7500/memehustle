import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../utils/api';
import {
  Coins,
  TrendingUp,
  MessageSquareText,
  Trophy
} from 'lucide-react';

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    fetchLeaderboard().then(setTopMemes);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-md p-4 mx-auto max-w-md mt-16">
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Top Memes
      </h2>
      <ul className="space-y-4">
        {topMemes.map((meme, index) => (
          <li
            key={meme.id}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-800 mr-3">{index + 1}</span>
                <img
                  src="https://via.placeholder.com/48"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="font-semibold text-gray-800 truncate max-w-[150px]">{meme.title}</span>
              </div>
              <div className="text-right space-y-1">
                <span className="text-green-600 font-bold flex items-center justify-end gap-1">
                  <Coins className="w-4 h-4" />
                  {meme.score} pts
                </span>
                <span className="text-yellow-600 flex items-center justify-end gap-1 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {meme.highest_bid ?? 0} credits
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
              <MessageSquareText className="w-4 h-4" />
              <span className="italic">{meme.caption}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
