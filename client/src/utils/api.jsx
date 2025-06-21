// src/utils/api.js
const BASE_URL = 'http://localhost:5000/api';

export async function fetchMemes() {
  const res = await fetch(`${BASE_URL}/memes`);
  return res.json();
}

export async function createMeme(meme) {
  const res = await fetch(`${BASE_URL}/memes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meme),
  });
  return res.json();
}

export async function voteMeme(id, type) {
  return fetch(`${BASE_URL}/memes/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
}

export async function bidMeme(id, credits) {
  return fetch(`${BASE_URL}/memes/${id}/bid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credits }),
  });
}

export async function fetchLeaderboard() {
  const res = await fetch(`${BASE_URL}/memes/leaderboard`);
  return res.json();
}
