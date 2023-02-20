import { Match } from "@prisma/client";
import { useCallback, useState } from "react";

export const PredictingBlock: React.FC<{
  match: Match;
  selectedTeam: string;
}> = ({ match, selectedTeam }) => {
  const [input, setInput] = useState("");

  const teamAOdds = Number(match.teamA_odds);
  const teamBOdds = Number(match.teamB_odds);
  const winProbability =
    selectedTeam === match.teamA_name
      ? teamAOdds * Number(input)
      : teamBOdds * Number(input);

  const setInputCallback = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  return (
    <div>
      <div>Expected win: {winProbability.toFixed(3)}</div>
      <input
        type="number"
        className="h-8 w-2/5 rounded bg-zinc-600 px-2 text-right"
        onInput={setInputCallback}
      />
      <button className="mt-1 mr-4 w-2/5 rounded bg-orange-500 p-1 px-4 text-center text-sm text-white">
        Predict
      </button>
    </div>
  );
};
