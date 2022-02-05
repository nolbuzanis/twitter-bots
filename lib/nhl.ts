import fetch from 'node-fetch';
const LEAFS_TEAM_ID = 10;
const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

interface ScheduleData {
  dates: {
    date: string;
    games: [
      {
        gamePk: number;
        content: {};
      }
    ];
  }[];
}

export async function getLatestGameId() {
  const scheduleUrl = `${BASE_URL}/schedule?teamId=${LEAFS_TEAM_ID}&season=20212022`;

  try {
    const response = await fetch(scheduleUrl);
    const data = (await response.json()) as ScheduleData;

    const filtered = data.dates.filter(({ date }) => isDateInPast(date));

    const lastDay = filtered[filtered.length - 1];
    const { gamePk } = lastDay.games[0];

    return gamePk;
  } catch (error) {
    return { error };
  }
}

const isDateInPast = (dateString: string) =>
  new Date(dateString).getTime() <= new Date().setHours(23, 59, 0, 0);

interface HighlightsData {
  highlights: {
    gameCenter: {
      items: {
        id: string;
        type: 'video' | string;
        title: string;
        description: string;
        duration: string;
        image: {};
        playbacks: Playback[];
      }[];
    };
  };
}

interface Playback {
  name: string;
  width: string;
  height: string;
  url: string;
}

export async function getHighlightsFromGame(gameId: number) {
  const highlightsUrl = `${BASE_URL}/game/${gameId}/content`;

  try {
    const response = await fetch(highlightsUrl);
    const data = (await response.json()) as HighlightsData;

    const { items } = data.highlights.gameCenter;

    const parsed = items.map((item) => {
      const { playbacks } = item;
      const video = returnHighestQualityVideo(playbacks);
      return {
        ...item,
        video,
      };
    });

    // console.log(parsed);

    return parsed;
    // separate
  } catch (error) {
    return { error };
  }
}

const returnHighestQualityVideo = (playbacks: Playback[]) => {
  const mp4Videos = playbacks.filter(({ url }) => url.includes('.mp4'));
  return mp4Videos[mp4Videos.length - 1];
};

// (async function () {
//   const id = await getLatestGameId();
//   id && getHighlightsFromGame(id);
// })();
