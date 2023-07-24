import Image from "next/image";
import { SeasonReward } from "@prisma/client";

const getOrdinalNum = (number: number) => {
  const suffix =
    (number >= 4 && number <= 20) || (number >= 24 && number <= 30)
      ? "th"
      : ["st", "nd", "rd"][(number % 10) - 1];
  return suffix;
};

const SeasonRewardCard: React.FC<{ seasonReward: SeasonReward }> = (props) => {
  return (
    <div className="rounded-md bg-zinc-600 bg-opacity-50 px-2">
      <div className="absolute">
        {props.seasonReward.ladderPlaceStart +
          (getOrdinalNum(props.seasonReward.ladderPlaceStart) ?? "")}
      </div>
      <Image
        src={props.seasonReward.itemImageUrl ?? ""}
        alt="Item reward item"
        width={100}
        height={100}
      />
    </div>
  );
};

export default SeasonRewardCard;
