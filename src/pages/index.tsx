import Head from "next/head";
import React from "react";

import DailyMatchComponent from "../components/DailyMatchup";
import Header from "../components/Header";
import { trpc } from "../utils/trpc";
import { Decimal } from "@prisma/client/runtime";
import HistoryMatches from "../components/HistoryMatches";

//const { data: session, status } = useSession();

const Home = () => {
  const { data: upcomingMatch, isLoading: isLoadingUpcomingMatch } =
    trpc.matches.getUpcomingMatch.useQuery();
  const { data: lastNMatches, isLoading: isLoadingLastNMatches } =
    trpc.matches.getLastNMatches.useQuery({ matchCount: 3 });

  return (
    <>
      <Head>
        <title>Daily CS:GO</title>
        <meta name="description" content="Daily CS:GO Betting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex w-full items-center justify-center pt-6 text-2xl">
        {isLoadingUpcomingMatch ? <div>Loading...</div> : null}
        {upcomingMatch ? (
          <DailyMatchComponent match={upcomingMatch}></DailyMatchComponent>
        ) : null}
      </div>
      <div className="flex w-full items-center justify-center pt-6">
        {isLoadingLastNMatches ? <div>Loading...</div> : null}
        {lastNMatches ? (
          <HistoryMatches Matches={lastNMatches}></HistoryMatches>
        ) : null}
      </div>
    </>
  );
};

export default Home;
