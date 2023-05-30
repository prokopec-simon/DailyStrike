import { Decimal } from "@prisma/client/runtime";

export const CompetitorCard: React.FC<{
  teamName: string;
  teamOdds: Decimal;
  logoUrl: string | null;
  isWinner: boolean;
}> = (props) => {
  return (
    <div className="flex h-full w-1/3 flex-col items-center rounded-lg border-solid border-orange-500 bg-zinc-700">
      <img
        alt="team logo"
        className="h-1/2 p-1 pt-2"
        src={
          props.logoUrl ??
          "https://www.hltv.org/img/static/team/placeholder.svg"
        }
      ></img>
      <div
        className={`text-lg ${
          props.isWinner ? "text-green-500" : "text-red-500"
        }`}
      >
        {props.teamName}
      </div>
      <div className="text-sm text-white">
        {Number(props.teamOdds).toFixed(2)}
      </div>
    </div>
  );
};
