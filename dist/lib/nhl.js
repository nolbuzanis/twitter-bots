var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
const LEAFS_TEAM_ID = 10;
const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';
export function getLatestGameId() {
    return __awaiter(this, void 0, void 0, function* () {
        const scheduleUrl = `${BASE_URL}/schedule?teamId=${LEAFS_TEAM_ID}&season=20212022`;
        try {
            const response = yield fetch(scheduleUrl);
            const data = (yield response.json());
            const filtered = data.dates.filter(({ date }) => isDateInPast(date));
            const lastDay = filtered[filtered.length - 1];
            const { gamePk } = lastDay.games[0];
            return gamePk;
        }
        catch (error) {
            console.error(error);
        }
    });
}
const isDateInPast = (dateString) => new Date(dateString).getTime() <= new Date().setHours(23, 59, 0, 0);
export function getHighlightsFromGame(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        const highlightsUrl = `${BASE_URL}/game/${gameId}/content`;
        try {
            const response = yield fetch(highlightsUrl);
            const data = (yield response.json());
            const { items } = data.highlights.gameCenter;
            console.log(data.highlights.gameCenter);
            const parsed = items.map(({ playbacks, title, description, duration }) => {
                const video = returnHighestQualityVideo(playbacks);
                return {
                    video,
                    title,
                    description,
                    duration,
                };
            });
            // console.log(parsed);
            return parsed;
            // separate
        }
        catch (error) {
            console.error(error);
        }
    });
}
const returnHighestQualityVideo = (playbacks) => {
    const mp4Videos = playbacks.filter(({ url }) => url.includes('.mp4'));
    return mp4Videos[mp4Videos.length - 1];
};
// (async function () {
//   const id = await getLatestGameId();
//   id && getHighlightsFromGame(id);
// })();
//# sourceMappingURL=nhl.js.map