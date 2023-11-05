/* eslint-disable @next/next/no-img-element */
import { Match } from "@prisma/client";
import { useUserDetail } from "../contexts/userContext";
import { CompetitorCard } from "./CompetitorCard";
import CoinSvgComponent from "../components/svg/coin";
import Icon from "@ant-design/icons";

export const HistoryMatch: React.FC<{ match: Match }> = (props) => {
  const [userDetail] = useUserDetail();

  const matchPrediction = userDetail.data?.lastThreeMatchesResult.find(
    (match) => match.matchId == props.match.id
  );
  return (
    <div className="flex h-28 w-full justify-between self-center rounded-lg bg-zinc-800 bg-opacity-80 p-3 text-white md:mt-4 md:h-[90px] md:p-2">
      <CompetitorCard
        isWinner={props.match.winner == 1}
        teamName={props.match.teamA_name}
        teamOdds={props.match.teamA_odds}
        logoUrl={props.match.teamA_logoUrl}
        isFirst={true}
      />
      <div className="flex h-full w-1/3 flex-col items-center">
        <div className="mt-4 flex h-7 w-12 items-center justify-center rounded-md  bg-zinc-700 bg-opacity-50 text-sm text-white md:mt-2">
          BO{props.match.bestOf}
        </div>
        {matchPrediction?.balanceChange ? (
          <div
            className={`mt-2 flex h-7 items-center justify-center rounded-md bg-zinc-700 bg-opacity-50 px-2 py-2 text-sm md:mt-1 md:text-base ${
              Number(matchPrediction?.balanceChange) >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {Number(matchPrediction?.balanceChange) >= 0 ? "+" : ""}
            {Number(matchPrediction?.balanceChange)?.toFixed(2)}
            <Icon
              className="ml-0.5 mt-0.5 md:ml-1"
              component={CoinSvgComponent}
            ></Icon>
          </div>
        ) : null}
      </div>
      <CompetitorCard
        isWinner={props.match.winner == 2}
        teamName={props.match.teamB_name}
        teamOdds={props.match.teamB_odds}
        logoUrl={props.match.teamB_logoUrl}
        isFirst={false}
      />
    </div>
  );
};
