import { voteMeme, bidMeme } from '../utils/api';
import {
  HandCoins,
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  Palette
} from 'lucide-react';

export default function MemeCard({ meme }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-2">{meme.title}</h2>
      <img src={meme.image_url} alt={meme.title} className="mb-2 rounded" />
      
      <p className="text-sm text-cyan-400 flex items-center gap-1">
        <MessageSquareText className="w-4 h-4" />
        Caption: {meme.caption}
      </p>

      <p className="text-sm text-purple-400 flex items-center gap-1">
        <Palette className="w-4 h-4" />
        Vibe: {meme.vibe}
      </p>

      <p className="text-sm text-yellow-400">Upvotes: {meme.upvotes}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => voteMeme(meme.id, 'up')}
          className="bg-green-500 px-3 py-1 rounded flex items-center gap-1"
        >
          <ThumbsUp className="w-4 h-4" />
          Upvote
        </button>
        
        <button
          onClick={() => voteMeme(meme.id, 'down')}
          className="bg-red-500 px-3 py-1 rounded flex items-center gap-1"
        >
          <ThumbsDown className="w-4 h-4" />
          Downvote
        </button>
        
        <button
          onClick={() => {
            const credits = prompt('Bid Amount?');
            if (credits) bidMeme(meme.id, Number(credits));
          }}
          className="bg-pink-500 px-3 py-1 rounded flex items-center gap-1"
        >
          <HandCoins className="w-4 h-4" />
          Bid
        </button>
      </div>
    </div>
  );
}
