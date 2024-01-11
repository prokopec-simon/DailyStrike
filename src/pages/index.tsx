import Head from "next/head";
import React from "react";
import DailyMatchComponent from "../components/DailyMatchup";
import { trpc } from "../utils/trpc";
import { Spin } from "antd";
import { HistoryMatch } from "../components/HistoryMatch";

const Home = () => {
  const { data: upcomingMatch, isLoading: isLoadingUpcomingMatch } =
    trpc.match.getUpcomingMatch.useQuery();
  const { data: lastNMatches, isLoading: isLoadingLastNMatches } =
    trpc.match.getLastNMatches.useQuery({ matchCount: 3 });

  return (
    <>
      <Head>
        <title>DailyStrike</title>
        <meta
          name="description"
          content="Daily Counter Strike match predicting"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-0 mt-8 flex w-full flex-col items-center justify-center p-0 align-middle md:mt-16">
        {isLoadingUpcomingMatch || isLoadingLastNMatches ? <Spin /> : null}
        {upcomingMatch ? (
          <DailyMatchComponent match={upcomingMatch}></DailyMatchComponent>
        ) : null}
      </div>
      {isLoadingUpcomingMatch || isLoadingLastNMatches ? null : (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="w-4/5 rounded-md bg-zinc-700 bg-opacity-20 pb-2 text-center md:mt-4 md:w-1/3 md:px-4">
            <h3 className="pt-1 text-white md:-mb-5 md:pt-2 md:pb-1">
              Recent results
            </h3>
            {lastNMatches
              ? lastNMatches.map((match, index) => (
                  <HistoryMatch key={index} match={match}></HistoryMatch>
                ))
              : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
//
