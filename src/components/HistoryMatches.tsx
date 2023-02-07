import { Match } from "@prisma/client";
import HistoryMatch from "./HistoryMatch";

const HistoryMatches: React.FC<{ Matches: Match[] }> = (props) => {
  return (
    <div>
      {props.Matches.map((match, index) => (
        <div key={index}>
          <HistoryMatch match={match}></HistoryMatch>
        </div>
      ))}
    </div>
  );
};
export default HistoryMatches;
