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
        status: {
          abstractGameState: string;
          codedGameState: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
          detailedState: string;
          statusCode: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
          startTimeTBD: boolean;
        };
      }
    ];
  }[];
}

const FINISHED_GAME_CODES = ['5', '6', '7'];

export async function getLatestGameId() {
  const scheduleUrl = `${BASE_URL}/schedule?teamId=${LEAFS_TEAM_ID}&season=20212022&gameStatus=R`;

  try {
    const response = await fetch(scheduleUrl);
    const data = (await response.json()) as ScheduleData;

    const filtered = data.dates.filter(({ games }) => {
      const { statusCode } = games[0].status;
      const isComplete = FINISHED_GAME_CODES.includes(statusCode);
      return isComplete;
    });

    const lastDay = filtered[filtered.length - 1];
    const { gamePk } = lastDay.games[0];

    return gamePk;
  } catch (error) {
    console.error(error);
    //return { error };
  }
}

// const isDateInPast = (dateString: string) =>
//   new Date(dateString).getTime() <= new Date().setHours(23, 59, 0, 0);

interface HighlightsData {
  highlights: {
    gameCenter: {
      items: {
        id: string;
        type: 'video' | string;
        date: string;
        title: string;
        blurb: string;
        description: string;
        duration: string;
        authFlow: boolean;
        mediaPlaybackId: string;
        mediaState: string;
        image: {
          title: string;
          altText: string;
          cuts: {};
        };
        playbacks: Playback[];
        keywords: [];
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
      const { playbacks, type, id, date, title, blurb, description } = item;
      const video = returnHighestQualityVideo(playbacks);
      return {
        _id: parseInt(id),
        type,
        date: new Date(date),
        video,
        title,
        blurb,
        description,
      };
    });

    // console.log(parsed);

    return parsed;
    // separate
  } catch (error) {
    console.error(error);
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
