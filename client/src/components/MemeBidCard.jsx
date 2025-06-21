import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import {
  Globe,
  MessageSquareText,
  Palette,
  ThumbsUp,
  ThumbsDown,
  Coins,
  User,
  HandCoins
} from 'lucide-react';

const socket = io('http://localhost:5000');

export default function MemeBidCard({ meme }) {
  const [bidAmount, setBidAmount] = useState('');
  const [highestBid, setHighestBid] = useState(meme.highest_bid || 0);
  const [highestBidder, setHighestBidder] = useState(meme.highest_bidder || 'None');
  const [upvotes, setUpvotes] = useState(meme.upvotes || 0);
  const [downvotes, setDownvotes] = useState(meme.downvotes || 0);

  useEffect(() => {
    socket.on('new-bid', ({ meme_id, credits, user_id }) => {
      if (meme_id === meme.id) {
        setHighestBid(credits);
        setHighestBidder(user_id ?? 'Anonymous');
      }
    });

    socket.on('vote-updated', ({ meme_id, change }) => {
      if (meme_id === meme.id) {
        if (change === 1) setUpvotes(prev => prev + 1);
        else setDownvotes(prev => prev + 1);
      }
    });

    return () => {
      socket.off('bid_update');
      socket.off('vote_update');
    };
  }, [meme.id]);

  const handleBid = async () => {
    const credits = parseInt(bidAmount, 10);
    if (isNaN(credits)) return;

    try {
      socket.emit('bid', {
        memeId: meme.id,
        credits,
        user_id: 'cyberpunk420'
      });

      await axios.post(`http://localhost:5000/api/memes/${meme.id}/bid`, { credits });
      setBidAmount('');
    } catch (err) {
      console.error('Bid failed:', err);
    }
  };

  const handleVote = async (type) => {
    try {
      socket.emit('vote', {
        memeId: meme.id,
        type
      });

      const res = await axios.post(`http://localhost:5000/api/memes/${meme.id}/vote`, { type });

      if (res.data) {
        setUpvotes(res.data.upvotes ?? upvotes);
        setDownvotes(res.data.downvotes ?? downvotes);
      }
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <div className="w-[350px] h-[500px] bg-green-200 border border-green-500 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 overflow-hidden flex flex-col justify-between">
      {/* Header: Meme title and URL */}
      <div className="p-5 space-y-2">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {meme.title}
        </h5>
        <p className="text-xs text-white-500 truncate flex items-center gap-1">
          <Globe className="w-4 h-4 inline-block" />
          <p className="text-xs text-white truncate dark:text-white">
            <a
              href={meme.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {meme.image_url}
            </a>
          </p>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex items-center gap-1">
          <MessageSquareText className="w-4 h-4 inline-block" />
          <span className="italic">{meme.caption}</span>
        </p>
        <p className="text-sm text-purple-400 flex items-center gap-1">
          <Palette className="w-4 h-4 inline-block" />
          {meme.vibe}
        </p>
        <div className="flex justify-between text-sm mt-2">
          <p className="text-green-600 flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {upvotes}
          </p>
          <p className="text-red-500 flex items-center gap-1">
            <ThumbsDown className="w-4 h-4" />
            {downvotes}
          </p>
        </div>
        <div className="text-sm text-cyan-700 dark:text-cyan-400 space-y-1 pt-2">
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4" /> Bid: <strong>{highestBid}</strong>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> cyberpunk420
          </div>
        </div>
      </div>

      {/* Footer: Bid input & buttons */}
      <div className="p-5 pt-0 space-y-2">
        <div className="flex gap-2">
          <input
            type="number"
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <button
            onClick={handleBid}
            className="flex items-center gap-1 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            <HandCoins className="w-4 h-4" />
            Bid
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleVote('up')}
            className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm w-full"
          >
            <ThumbsUp className="w-4 h-4" />
            Upvote
          </button>
          <button
            onClick={() => handleVote('down')}
            className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm w-full"
          >
            <ThumbsDown className="w-4 h-4" />
            Downvote
          </button>
        </div>
      </div>
    </div>
  );
}
