import { NextApiRequest, NextApiResponse } from 'next';

const ROCKET_LEAGUE_APP_ID = 252950;

async function getStats() {
  const key = process.env.STEAM_API_KEY;

  const request = encodeURIComponent(
    JSON.stringify({
      steamid: process.env.STEAM_ACCOUNT_ID,
      appids_filter: [ROCKET_LEAGUE_APP_ID],
    })
  );

  const response = await fetch(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&format=json&input_json=${request}`
  );

  return await response.json();
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await getStats();
  const game = data.response.games.find(
    (game: any) => game.appid === ROCKET_LEAGUE_APP_ID
  );

  // Cache for an hour across all users
  res.setHeader('Cache-Control', 'public, s-maxage=3600, must-revalidate');
  res.status(200).json({ minutes: game.playtime_forever, time: Date.now() });
}
