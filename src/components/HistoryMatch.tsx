import { DailyMatchupData } from "../pages";

const HistoryMatch = ({
  teamAName,
  teamAOdds,
  teamBName,
  teamBOdds,
}: DailyMatchupData) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="row-span-2 h-20 w-20 justify-self-end bg-gray-700"></div>
      <div>{teamAName}</div>
      <div className="flex items-end justify-center">
        <div className="text-lg"></div>
      </div>
      <div className="text-right">{teamBName}</div>
      <div className="row-span-2 h-20 w-20 bg-gray-700"></div>
      <div className="text-left">{teamAOdds}</div>
      <div className="flex items-start justify-center"></div>
      <div className="text-right">{teamBOdds}</div>
    </div>
  );
};

export default HistoryMatch;