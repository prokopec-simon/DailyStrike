import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import next from "next";
import CountdownTimer from "../components/CountdownTimer";
import DailyMatchComponent from "../components/DailyMatchupComponent";

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
  teamAName: string | undefined;
  teamBName: string | undefined;
  teamAOdds: string | undefined;
  teamBOdds: string | undefined;
  matchTime: string | undefined;
};

const Header = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="flex h-16">
      <div className="flex flex-1 items-center"></div>
      <div className="flex flex-1 items-center justify-center">
        <a href="#" className="text-3xl font-bold text-indigo-600">
          Daily CS:GO
        </a>
      </div>

      <div className="flex flex-1 items-center justify-end">
        {sessionData ? (
          <button
            onClick={() => signIn()}
            className=" mt-1 mr-4 rounded border border-solid border-indigo-600 p-2 text-center text-indigo-600 transition-colors duration-300 hover:bg-indigo-600 hover:text-white"
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        ) : (
          <div>huh</div>
        )}
      </div>
    </nav>
  );
};
