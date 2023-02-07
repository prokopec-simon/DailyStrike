import Head from "next/head";
import React from "react";

import DailyMatchComponent from "../components/DailyMatchup";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";
import { Decimal } from "@prisma/client/runtime";

const Home = () => {
  const { data: upcomingMatch, isLoading } =
    trpc.matches.getUpcomingMatch.useQuery();
  //const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Daily CS:GO</title>
        <meta name="description" content="Daily CS:GO Betting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex w-full items-center justify-center pt-6 text-2xl">
        {isLoading == true ? <div>Loading...</div> : null}
        {upcomingMatch != null ? (
          <DailyMatchComponent
            teamAName={upcomingMatch.teamA_name}
            teamBName={upcomingMatch.teamB_name}
            teamAOdds={upcomingMatch.teamA_odds}
            teamBOdds={upcomingMatch.teamB_odds}
            matchTime={upcomingMatch.dateAndTime.toString()}
          ></DailyMatchComponent>
        ) : null}
      </div>
    </>
  );
};

export default Home;

export type DailyMatchupData = {
  teamAName: string;
  teamBName: string;
  teamAOdds: Decimal;
  teamBOdds: Decimal;
  matchTime: string;
};
