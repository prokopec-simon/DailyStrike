import Image from "next/image";
import { SeasonReward } from "@prisma/client";
import { Tooltip } from "antd";
import { getOrdinalNum } from "../utils/cardinalPositionFormatter";

const SeasonRewardCard: React.FC<{ seasonReward: SeasonReward }> = (props) => {
  const { seasonReward } = props;
  const ladderPlaceStart = seasonReward.ladderPlaceStart || "-";
  const ladderPlaceEnd = seasonReward.ladderPlaceEnd || "-";
  const ladderStartSuffix = getOrdinalNum(seasonReward.ladderPlaceStart);
  const ladderEndSuffix = getOrdinalNum(seasonReward.ladderPlaceEnd);

  return (
    <div className="items-center justify-start rounded-md border border-solid border-orange-500 bg-zinc-600 bg-opacity-40 px-2">
      <div className="absolute text-xs md:text-base">
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
    </div>
  );
};

export default SeasonRewardCard;
