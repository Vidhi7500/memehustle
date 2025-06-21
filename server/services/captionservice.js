const axios = require('axios');

const fallbackCaptions = [
  "HODL to the moon!",
  "Doge hacks the matrix!",
  "404 Humor Not Found",
  "Keep Calm and Crypto On"
];

const fallbackVibes = [
  "Neon Crypto Chaos",
  "Retro Meme Frenzy",
  "Dark Hacker Vibes",
  "Internet Gold Rush"
];

async function getOllamaCaptionAndVibe(tags) {
  const prompt = `
You are a meme expert AI.
Given these tags: ${tags.join(', ')}, generate:

Caption: A funny meme caption.
Vibe Description: A short 2-3 word phrase that describes the meme's overall vibe (e.g., "Neon Hacker Energy").
`;

  try {
    const res = await axios.post('http://192.168.0.164:11434/api/generate', {
      model: "llama3.2:latest",
      prompt,
      stream: false
    });

    const responseText = res.data.response || '';

    const captionMatch = responseText.match(/Caption:\s*(.*)/i);
    const vibeMatch = responseText.match(/Vibe\s*Description:\s*(.*)/i);

    const caption = captionMatch?.[1]?.trim() || getRandom(fallbackCaptions);
    const vibe = vibeMatch?.[1]?.trim() || getRandom(fallbackVibes);

    return { caption, vibe };
  } catch (err) {
    console.error('Ollama API error:', err.message);
    return {
      caption: getRandom(fallbackCaptions),
      vibe: getRandom(fallbackVibes)
    };
  }
}

function getRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = { getOllamaCaptionAndVibe };
