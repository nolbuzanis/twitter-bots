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
import { load } from 'cheerio';
import { Builder, By } from 'selenium-webdriver';
let URL = 'https://www.nhl.com/mapleleafs/video/';
export const example = () => __awaiter(void 0, void 0, void 0, function* () {
    let driver = yield new Builder().forBrowser('chrome').build();
    try {
        yield driver.manage().setTimeouts({ implicit: 10000 });
        console.log();
        yield driver.get(URL);
        // await driver.wait(until.elementLocated(By.id('bam-video-player')), 5000);
        let webElement = yield driver.findElement(By.id('bam-video-player'));
        console.log(webElement);
        // await driver.findElement(By);
    }
    finally {
        console.log('Ending...');
        yield driver.quit();
    }
});
export const scrapeLeafsNhlPage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(URL);
        const htmlText = yield response.text();
        const parsedData = load(htmlText);
        const mostRecentVid = parsedData('video');
        console.log(mostRecentVid[0]);
        // const videoCarosel = parsedData('.carousel__item');
        // console.log(videoCarosel[0].children[1]);
    }
    catch (error) {
        return { error };
    }
});
// scrapeLeafsNhlPage();
// export default (request: VercelRequest, response: VercelResponse) => {
//   response.status(200).send(`Hello ${name}!`);
// };
//# sourceMappingURL=webscraper.js.map