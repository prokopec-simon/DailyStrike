/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUserDetail } from "../contexts/userContext";
import CountdownTimer from "./CountdownTimer";
import PredictionBlock from "./PredictionBlock";

const DailyMatchComponent: React.FC<{ match: Match }> = (props) => {
  const authSession = useSession();
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
      <div className="flex h-32 w-11/12 justify-between rounded-lg bg-zinc-800 p-3 text-white md:w-1/2">
        <div
          className={`${
            detailedUserInformationQuery.data?.dailyPrediction.pickedTeam ==
            null
              ? "cursor-pointer"
              : ""
          } flex h-full w-1/3 flex-col items-center justify-center rounded-lg bg-zinc-700 sm:justify-start ${
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
            <div className="text-lg text-zinc-100">
              {props.match.teamA_name}
            </div>
            <div className="text-sm text-zinc-100">
              {props.match.teamA_odds.toString()}
            </div>
          </div>
        </div>

        <div className="flex h-full w-1/3 flex-col items-center justify-center sm:justify-end">
          <div className="mt-5 flex h-7 w-12 items-center justify-center rounded-md bg-zinc-700 text-sm text-white">
            BO{props.match.bestOf}
          </div>
          <div className="w-100 mt-3 flex flex-col items-center text-white">
            {props.match.dateAndTime.getTime() - new Date().getTime() > 0 ? (
              <CountdownTimer
                targetDate={props.match.dateAndTime}
              ></CountdownTimer>
            ) : props.match.winner != null && props.match.winner > 0 ? (
              <div className="flex h-7 w-16 items-center justify-center rounded-md bg-gray-500 align-middle text-white">
                Over
              </div>
            ) : (
              <div className="flex h-7 w-16 items-center justify-center rounded-md bg-red-500 align-middle text-white">
                Live !
              </div>
            )}
          </div>
        </div>

        <div
          className={`${
            detailedUserInformationQuery.data?.dailyPrediction.pickedTeam ==
            null
              ? "cursor-pointer"
              : ""
          } flex h-full w-1/3 flex-col items-center justify-center rounded-lg bg-zinc-700 sm:justify-end ${
            selectedTeam === props.match.teamB_name
              ? "border-2 border-solid border-orange-500"
              : ""
          } sm:flex-row`}
          onClick={() => pickTeam(props.match.teamB_name)}
        >
          <div className="text-center sm:text-right">
            <div className="text-lg text-zinc-100">
              {props.match.teamB_name}
            </div>
            <div className="text-sm text-zinc-100">
              {props.match.teamB_odds.toString()}
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
          <div>
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
