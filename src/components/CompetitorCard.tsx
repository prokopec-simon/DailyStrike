import { Decimal } from "@prisma/client/runtime";

export const CompetitorCard: React.FC<{
  teamName: string;
  teamOdds: Decimal;
  logoUrl: string | null;
  isWinner: boolean;
  isFirst: boolean;
}> = (props) => {
  const flexRowClass = props.isFirst ? "md:flex-row" : "md:flex-row-reverse";
  const itemsAlignmentClass = props.isFirst ? "md:items-start" : "md:items-end";

  return (
    <div
      className={`flex h-full w-1/3 min-w-0 flex-col items-center rounded-lg border-solid border-orange-500 bg-zinc-700 px-2 ${flexRowClass}`}
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
        className={`flex flex-col ${itemsAlignmentClass} items-center overflow-hidden`}
      >
        <div
          className={`text-base md:text-lg ${
            props.isWinner ? "text-green-500" : "text-red-500"
          }`}
          style={{
            maxWidth: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {props.teamName}
        </div>
        <div className="text-xs text-white md:text-sm">
          {Number(props.teamOdds).toFixed(2)}sa
        </div>
      </div>
    </div>
  );
};
