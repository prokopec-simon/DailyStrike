import Image from "next/image";
import { SeasonReward } from "@prisma/client";
import { Tooltip } from "antd";

const getOrdinalNum = (place: number) => {
  const suffix =
    (place >= 4 && place <= 20) || (place >= 24 && place <= 30)
      ? "th"
      : ["st", "nd", "rd"][(place % 10) - 1] || "th";
  return suffix;
};

const SeasonRewardCard: React.FC<{ seasonReward: SeasonReward }> = (props) => {
  const { seasonReward } = props;
  const ladderPlaceStart = seasonReward.ladderPlaceStart || "-";
  const ladderPlaceEnd = seasonReward.ladderPlaceEnd || "-";
  const ladderStartSuffix = getOrdinalNum(seasonReward.ladderPlaceStart);
  const ladderEndSuffix = getOrdinalNum(seasonReward.ladderPlaceEnd);

  return (
    <Tooltip placement="top" title={seasonReward.itemName}>
      <div className="rounded-md bg-zinc-600 bg-opacity-50 px-2">
        <div className="absolute">
          {ladderPlaceStart === ladderPlaceEnd ? (
            <>
              {ladderPlaceStart}
              {ladderStartSuffix}
            </>
          ) : (
            <>
              {ladderPlaceStart}
              {ladderStartSuffix}
              {" - "}
              {ladderPlaceEnd}
              {ladderEndSuffix}
            </>
          )}
        </div>
        <Image
          src={seasonReward.itemImageUrl || ""}
          alt="Item reward item"
          width={100}
          height={100}
        />
      </div>{" "}
    </Tooltip>
  );
};

export default SeasonRewardCard;
