import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import next from "next";
import CountdownTimer from "../components/CountdownTimer";
import DailyMatchComponent from "../components/DailyMatchup";
import Header from "../components/Header";

const Home: NextPage = () => {
  //const nextMatch = trpc.example.getRandomMaxStarMatchInUpcomingDay.useQuery();
  //console.log(nextMatch);
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Daily CS:GO</title>
        <meta name="description" content="Daily CS:GO Betting" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex w-full items-center justify-center pt-6 text-2xl">
        <DailyMatchComponent
          teamAName="Team A"
          teamBName="Team B"
          teamAOdds="2.0"
          teamBOdds="2.0"
          matchTime="14h 59m 12s"
        ></DailyMatchComponent>
      </div>
    </>
  );
};

export default Home;

export type DailyMatchupData = {
  teamAName: string;
  teamBName: string;
  teamAOdds: string;
  teamBOdds: string;
  matchTime: string;
};
