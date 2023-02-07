import { Match } from "@prisma/client";

const HistoryMatch: React.FC<{ match: Match }> = (props) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      <div className="row-span-2 h-20 w-20 justify-self-end bg-gray-700"></div>
      <div>{props.match.teamA_name}</div>
      <div className="flex items-end justify-center"></div>
      <div className="text-right">{props.match.teamB_name}</div>
      <div className="row-span-2 h-20 w-20 bg-gray-700"></div>
      <div className="text-left">{props.match.teamA_odds.toString()}</div>
      <div className="flex items-start justify-center"></div>
      <div className="text-right">{props.match.teamB_odds.toString()}</div>
    </div>
  );
};
export default HistoryMatch;
