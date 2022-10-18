import { t } from "../trpc";
import { z } from "zod";
import HLTV from "hltv-api";
import cheerio from "cheerio";
import fetch from "node-fetch";
import UserAgent from "user-agents";
import { json } from "stream/consumers";

const CONFIG = {
  BASE: "https://www.hltv.org",
  CDN: "https://img-cdn.hltv.org",
  RSS: "rss",
  RESULTS: "results",
  MATCHES: "matches",
  PLAYERS: "stats/players",
  TEAMS: "ranking/teams",
  TEAM: "team",
};

const MAPS = {
  trn: "Train",
  mrg: "Mirage",
  d2: "Dust 2",
  inf: "Inferno",
  vtg: "Vertigo",
  ovp: "Overpass",
  nuke: "Nuke",
};
interface IEvent {
  name: string;
  logo: string;
}

interface ITeam {
  name: string;
  logo: string;
}

interface IMatch {
  id: number;
  time: string;
  event: IEvent;
  stars: number;
  maps: string;
  teams: ITeam[];
}

const USER_AGENT = new UserAgent().toString();

export const exampleRouter = t.router({
  getRandomMaxStarMatchInUpcomingDay: t.procedure.query(async () => {
    try {
      const body = await (
        await fetch(CONFIG.BASE + "/" + CONFIG.MATCHES, {
          headers: { "User-Agent": USER_AGENT },
        })
      ).text();
      const $ = cheerio.load(body, {});

      const allContent = $(".upcomingMatch");
      const matches: IMatch[] = [];

      allContent.map((_i, element) => {
        const el = $(element);

        const link = el.children("a").attr("href") as string;
        const id = Number(link.split("/")[2]);
        const time = new Date(
          parseInt(el.find(".matchTime").attr("data-unix")!, 10)
        ).toISOString();
        const event: IEvent = {
          name: el.find(".matchEventName").text(),
          logo: el.find(".matchEventLogo").attr("src") as string,
        };
        const stars = Number(el.attr("stars"));
        const map: keyof typeof MAPS = el.find(".matchMeta").text() as any;

        const teamsEl = el.find(".matchTeams");

        // return just valid matches
        if (!teamsEl.html()) {
          return;
        }

        const team1El = teamsEl.find(".matchTeam.team1");
        const team2El = teamsEl.find(".matchTeam.team2");

        const team1 = {
          id: Number(el.attr("team1")),
          name:
            team1El.find(".matchTeamName").text() ||
            /* istanbul ignore next */ "n/a",
          logo: team1El.find(".matchTeamLogo").attr("src") as string,
        };

        const team2 = {
          id: Number(el.attr("team2")),
          name: team2El.find(".matchTeamName").text() || "n/a",
          logo: team2El.find(".matchTeamLogo").attr("src") as string,
        };

        const response: IMatch = {
          id,
          time,
          event,
          stars,
          maps: MAPS[map] || map,
          teams: [team1, team2],
        };

        matches[matches.length] = response;
      });

      if (!matches.length) {
        throw new Error(
          "There are no matches available, something went wrong. Please contact the library maintainer on https://github.com/dajk/hltv-api"
        );
      }

      //custom selection
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(2, 0, 0);

      const matchesBeforeTomorrow = matches.filter(
        (match) => Date.parse(match.time) <= Date.parse(tomorrow.toString())
      );

      const highestStars = Math.max(
        ...matchesBeforeTomorrow.map((match) => match.stars)
      );
      const bestRatedMatches = matchesBeforeTomorrow.filter(
        (match) => match.stars === highestStars
      );
      const randomMatch =
        bestRatedMatches[Math.floor(Math.random() * bestRatedMatches.length)];
      return randomMatch;
    } catch (error) {
      throw new Error(error as any);
    }
  }),
});
