/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
// import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUserDetail } from "../contexts/userContext";
import CountdownTimer from "./CountdownTimer";
import PredictionBlock from "./PredictionBlock";

const DailyMatchComponent: React.FC<{ match: Match }> = (props) => {
  // const authSession = useSession();
  const [detailedUserInformationQuery] = useUserDetail();

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    if (detailedUserInformationQuery.data?.dailyPrediction.pickedTeam == 0) {
      setSelectedTeam(props.match.teamA_name);
    }
    if (detailedUserInformationQuery.data?.dailyPrediction.pickedTeam == 1) {
      setSelectedTeam(props.match.teamB_name);
    }
  }, [
    detailedUserInformationQuery.data?.dailyPrediction.pickedTeam,
    props.match.teamA_name,
    props.match.teamB_name,
  ]);

  const pickTeam = (pickedTeam: string) => {
    if (pickedTeam === selectedTeam) {
      setSelectedTeam(null);
      return;
    }
    setSelectedTeam(pickedTeam);
  };

  return (
    <>
      <div className="flex h-32 w-11/12 justify-between rounded-lg bg-zinc-800 bg-opacity-50 p-3 text-white md:h-40 md:w-1/2">
        <div
          className={`${
            props.match.winner == null ? "cursor-pointer" : ""
          } flex h-full w-1/3 flex-col items-center justify-center rounded-lg bg-zinc-700 bg-opacity-30 sm:justify-start ${
            selectedTeam === props.match.teamA_name
              ? "border-2 border-solid border-orange-500"
              : ""
          } sm:flex-row`}
          onClick={() => pickTeam(props.match.teamA_name)}
        >
          <img
            alt="team A logo"
            className="h-1/2 p-1 pt-2 sm:mr-2 sm:ml-3 sm:h-3/4"
            src={props.match.teamA_logoUrl ?? ""}
          ></img>
          <div className="text-center sm:text-left">
            <div
              className={`w-24 truncate md:hidden ${
                props.match.winner === 2
                  ? "text-red-500"
                  : props.match.winner === 1
                  ? "text-green-500"
                  : "text-white"
              }`}
            >
              {props.match.teamA_name}
            </div>
            <div
              className={`hidden text-lg md:block ${
                props.match.winner === 2
                  ? "text-red-500"
                  : props.match.winner === 1
                  ? "text-green-500"
                  : "text-white"
              }`}
            >
              {props.match.teamA_name}
            </div>

            <div className="text-sm text-zinc-100">
              {Number(props.match.teamA_odds).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex h-full w-1/3 flex-col items-center justify-center">
          <div className="flex h-7 w-12 items-center justify-center rounded-md bg-zinc-700 bg-opacity-50 text-sm text-white">
            BO{props.match.bestOf}
          </div>
          <div className="w-100 mt-3 flex flex-col items-center text-white">
            {props.match.dateAndTime.getTime() - new Date().getTime() > 0 ? (
              <CountdownTimer
                targetDate={props.match.dateAndTime}
              ></CountdownTimer>
            ) : props.match.winner != null && props.match.winner > 0 ? (
              <div className="flex h-7 w-32 items-center justify-center rounded-md bg-gray-500 align-middle text-white">
                Match is over
              </div>
            ) : (
              <div className="flex h-7 w-16 animate-pulse items-center justify-center rounded-md bg-red-500 align-middle text-white hover:animate-ping">
                Live !
              </div>
            )}
          </div>
        </div>

        <div
          className={`${
            props.match.winner == null ? "cursor-pointer" : ""
          } flex h-full w-1/3 flex-col-reverse items-center justify-center rounded-lg bg-zinc-700 bg-opacity-30 sm:justify-end ${
            selectedTeam === props.match.teamB_name
              ? "border-2 border-solid border-orange-500"
              : ""
          } sm:flex-row`}
          onClick={() => pickTeam(props.match.teamB_name)}
        >
          <div className="text-center sm:text-right">
            <div
              className={`w-24 truncate ${
                props.match.winner === 2
                  ? "text-green-500"
                  : props.match.winner === 1
                  ? "text-red-500"
                  : "text-white"
              } md:hidden`}
            >
              {props.match.teamB_name}
            </div>
            <div
              className={`hidden text-lg ${
                props.match.winner === 2
                  ? "text-green-500"
                  : props.match.winner === 1
                  ? "text-red-500"
                  : "text-white"
              } md:block`}
            >
              {props.match.teamB_name}
            </div>
            <div className="text-sm text-zinc-100">
              {Number(props.match.teamB_odds).toFixed(2)}
            </div>
          </div>
          <img
            alt="team A logo"
            className="h-1/2 p-1 pt-2 sm:mr-3 sm:ml-2 sm:h-3/4"
            src={props.match.teamB_logoUrl ?? ""}
          ></img>
        </div>
      </div>
      <div
        className={`transition-max-height max-h-0 overflow-hidden ${
          selectedTeam ? "max-h-full" : ""
        }`}
      >
        {selectedTeam ? (
          <div className="mx-auto w-4/5 md:w-full">
            <PredictionBlock
              match={props.match}
              selectedTeam={selectedTeam}
            ></PredictionBlock>
          </div>
        ) : null}
      </div>
    </>
  );
};
export default DailyMatchComponent;
