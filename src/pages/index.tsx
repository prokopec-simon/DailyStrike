import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import next from "next";

const Home: NextPage = () => {
  const nextMatch = trpc.example.getRandomMaxStarMatchInUpcomingDay.useQuery();
  console.log(nextMatch);
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
          teamAName={nextMatch.data?.teams[0]?.name}
          teamBName={nextMatch.data?.teams[1]?.name}
          teamAOdds={11.2}
          teamBOdds={1.02}
          matchTime="11:24"
        ></DailyMatchComponent>
      </div>
    </>
  );
};

export default Home;

type Timer = {
  time: number;
};
type DailyMatchupData = {
  teamAName: string | undefined;
  teamBName: string | undefined;
  teamAOdds: number;
  teamBOdds: number;
  matchTime: string;
};
const DailyMatchComponent = ({
  teamAName,
  teamAOdds,
  teamBName,
  teamBOdds,
  matchTime,
}: DailyMatchupData) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div>{teamAName}</div>
      <div></div>
      <div>{teamBName}</div>
      <div className="text-left">{teamAOdds}</div>
      <div className="text-center">
        <Timer time={500}></Timer>
      </div>
      <div className="text-right">{teamBOdds}</div>
      <div>
        <input
          type="text"
          placeholder="Stake..."
          className="input input-bordered h-9 w-20 max-w-xs text-sm"
        />
      </div>
      <div></div>
      <div>
        <input
          type="text"
          placeholder="Stake..."
          className="input input-bordered float-right h-9 w-20 max-w-xs text-sm"
        />
      </div>
    </div>
  );
};
const HeaderProfile = () => {
  const { data: sessionData } = useSession();
  return (
    <div>
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
    </div>
  );
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

const Timer = ({ time }: Timer) => {
  const [delay, setDelay] = useState(+time);
  const minutes = Math.floor(delay / 60);
  const seconds = Math.floor(delay % 60);
  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(delay - 1);
    }, 1000);

    if (delay === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <>
      <span>
        {minutes}:{seconds}
      </span>
    </>
  );
};
