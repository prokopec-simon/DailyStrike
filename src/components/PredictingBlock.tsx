import { Match } from "@prisma/client";
import { Button } from "antd";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { trpc } from "../utils/trpc";

export const PredictingBlock: React.FC<{
  match: Match;
  selectedTeam: string;
}> = ({ match, selectedTeam }) => {
  const [input, setInput] = useState("");
  const { data: sessionData, status: sessionStatus } = useSession();

  const placePrediction = () => {
    trpc.matches.placePrediction.useMutation().mutate({
      userId: sessionData?.user?.id ?? "",
      pickedTeam: selectedTeam == match.teamA_name ? 0 : 1,
      predictionOdds:
        selectedTeam == match.teamA_name
          ? Number(match.teamA_odds)
          : Number(match.teamB_odds),
    });
  };

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
      <Button onClick={() => placePrediction()}>Predict</Button>
    </div>
  );
};
