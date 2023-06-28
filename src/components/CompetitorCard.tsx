import { Decimal } from "@prisma/client/runtime";

export const CompetitorCard: React.FC<{
  teamName: string;
  teamOdds: Decimal;
  logoUrl: string | null;
  isWinner: boolean;
  isFirst: boolean;
}> = (props) => {
  const flexRowClass = props.isFirst ? "md:flex-row" : "md:flex-row-reverse";
  const itemsAlignmentClass = props.isFirst
    ? "md:items-start md:text-left"
    : "md:items-end md:text-right";

  return (
    <div
      className={`flex h-full w-1/3 min-w-0 flex-col items-center rounded-lg border-solid border-orange-500 bg-zinc-700 bg-opacity-40 px-2 ${flexRowClass}`}
    >
      <img
        alt="team logo"
        className="h-1/2 p-1 pt-2 md:h-2/3"
        src={
          props.logoUrl ??
          "https://www.hltv.org/img/static/team/placeholder.svg"
        }
      />
      <div
        className={`flex flex-col md:px-1 ${itemsAlignmentClass} items-center overflow-hidden`}
      >
        <div
          className={`flex text-sm md:block md:text-base ${
            props.isWinner ? "text-green-500" : "text-red-500"
          }`}
        >
          <div className="w-20 truncate md:hidden">{props.teamName}</div>
          <div className="hidden leading-5 md:block">{props.teamName}</div>
        </div>
        <div className="text-sm text-white md:text-sm">
          {Number(props.teamOdds).toFixed(2)}
        </div>
      </div>
    </div>
  );
};
