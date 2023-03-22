import Head from "next/head";
import React, { useEffect } from "react";
import DailyMatchComponent from "../components/DailyMatchup";
import { trpc } from "../utils/trpc";
import { Spin } from "antd";
import { HistoryMatch } from "../components/HistoryMatch";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { useUserDetail } from "../contexts/userContext";

const Home = () => {
  const { data: upcomingMatch, isLoading: isLoadingUpcomingMatch } =
    trpc.match.getUpcomingMatch.useQuery();
  const { data: lastNMatches, isLoading: isLoadingLastNMatches } =
    trpc.match.getLastNMatches.useQuery({ matchCount: 3 });

  return (
    <>
      <Head>
        <title>Daily CS:GO</title>
        <meta name="description" content="Daily CS:GO Match predicting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="m-0 flex w-full justify-center p-0 align-middle">
        {isLoadingUpcomingMatch || isLoadingLastNMatches ? <Spin /> : null}
        {upcomingMatch ? (
          <DailyMatchComponent match={upcomingMatch}></DailyMatchComponent>
        ) : null}
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        {lastNMatches
          ? lastNMatches.map((match, index) => (
              <HistoryMatch key={index} match={match}></HistoryMatch>
            ))
          : null}
      </div>
    </>
  );
};

export default Home;
