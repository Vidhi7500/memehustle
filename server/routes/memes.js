const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');
const { getOllamaCaptionAndVibe } = require('../services/captionservice');

router.post('/', async (req, res) => {
  const { title, image_url, tags } = req.body;
  const user_id = 'cyberpunk420'; // mock user

  const { caption, vibe } = await getOllamaCaptionAndVibe(tags);

  const { data, error } = await supabase
    .from('memes')
    .insert([{ title, image_url, tags, upvotes: 0, caption, vibe, owner_id: user_id }])
    .select().single();

  if (error) {
    console.error('❌ Supabase insert error:', error);
  } else {
    console.log('📤 POST Meme Insert Result:', data);
  }

  res.json(data || { error });
});

router.get('/', async (req, res) => {
  console.log('📥 GET /memes requested');
  try {
    const { data, error } = await supabase.from('memes').select('*');

    if (error) {
      console.error('❌ Supabase SELECT error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data); // Explicit 200 OK
  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/vote', async (req, res) => {
  const { type } = req.body;
  const delta = type === 'up' ? 1 : -1;

  const { data, error } = await supabase.rpc('vote_meme', {
    meme_id: req.params.id,
    delta
  });

  res.json(data || { error });
});

router.post('/:id/bid', async (req, res) => {
  const { credits } = req.body;
  const user_id = 'cyberpunk420';

  // Get current highest bid
  const { data: meme, error: fetchError } = await supabase
    .from('memes')
    .select('highest_bid')
    .eq('id', req.params.id)
    .single();

  if (fetchError) return res.status(500).json({ error: fetchError.message });

  const currentBid = meme.highest_bid ?? 0;

  if (credits <= currentBid) {
    return res.status(400).json({ error: 'Bid must be higher than current highest bid' });
  }

  // Insert the bid
  await supabase.from('bids').insert({
    meme_id: req.params.id,
    credits,
    user_id
  });

  // Update the meme
  await supabase
    .from('memes')
    .update({ highest_bid: credits })
    .eq('id', req.params.id);

  res.json({ meme_id: req.params.id, credits });
});

let cachedLeaderboard = null;
let lastFetched = 0;
const CACHE_TTL = 10 * 1000; // 10 seconds

router.get('/leaderboard', async (req, res) => {
  const now = Date.now();

  if (cachedLeaderboard && (now - lastFetched < CACHE_TTL)) {
    console.log('⚡ Serving leaderboard from cache');
    return res.status(200).json(cachedLeaderboard);
  }

  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(50);

  if (error) {
    console.error('❌ Supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  const scoredData = data
    .map(meme => ({
      ...meme,
      score: (meme.upvotes || 0) - (meme.downvotes || 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  cachedLeaderboard = scoredData;
  lastFetched = now;

  console.log('🌐 Leaderboard refreshed from Supabase');
  res.status(200).json(scoredData);
});

// 🧠 Manual caption & vibe regeneration via Ollama
router.post('/:id/caption', async (req, res) => {
  try {
    const { data: meme, error: fetchError } = await supabase
      .from('memes')
      .select('id, tags')
      .eq('id', req.params.id)
      .single();

    if (fetchError || !meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }

    const tags = meme.tags || [];
    const { caption, vibe } = await getOllamaCaptionAndVibe(tags);

    const { error: updateError } = await supabase
      .from('memes')
      .update({ caption, vibe })
      .eq('id', req.params.id);

    if (updateError) {
      console.error('❌ Failed to update caption/vibe:', updateError);
      return res.status(500).json({ error: 'Failed to update meme' });
    }

    res.status(200).json({ caption, vibe });
  } catch (err) {
    console.error('❌ Caption generation error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
