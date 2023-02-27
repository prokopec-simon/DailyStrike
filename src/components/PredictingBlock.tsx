import { Match } from "@prisma/client";
import { Button, InputNumber, Modal, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { trpc } from "../utils/trpc";

const PredictingBlock: React.FC<{
  match: Match;
  selectedTeam: string;
}> = ({ match, selectedTeam }) => {
  const [input, setInput] = useState<number>(0);
  const { data: sessionData, status: sessionStatus } = useSession();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const predictionMutation = trpc.matches.placePrediction.useMutation();

  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const placePrediction = () => {
    setIsModalOpen(true);

    const pickedTeam = selectedTeam === match.teamA_name ? 0 : 1;
    const predictionOdds =
      selectedTeam === match.teamA_name
        ? Number(match.teamA_odds)
        : Number(match.teamB_odds);


    predictionMutation
      .mutateAsync({
        userId: sessionData?.user?.id ?? "",
        pickedTeam,
        predictionOdds,
        predictionAmount: input,
      })
      .catch((error) => console.error("Error placing prediction", error));
  };

  const winProbability =
    selectedTeam === match.teamA_name
      ? Number(match.teamA_odds) * input
      : Number(match.teamB_odds) * input;

  const setInputCallback = useCallback((value: number) => setInput(value), []);

  return (
    <div>
      <Modal
        title="Prediction placement modal"
        onOk={handleOk}
        onCancel={handleCancel}
        closable={predictionMutation.status !== "loading"}
        maskClosable={predictionMutation.status !== "loading"}
        footer={null}
      >
        {predictionMutation.status === "loading" && (
          <div className="flex">
            <Spin className="self-center" size="large" />
          </div>
        )}
        {predictionMutation.status === "success" && (
          <div>
            <>
              Prediction placed successfully, placed amount:
              {predictionMutation.data?.predictionAmount} at
              {predictionMutation.data?.predictionOdds}. Possible win:
              {(
                Number(predictionMutation.data?.predictionAmount) *
                Number(predictionMutation.data?.predictionOdds)
              ).toFixed(3)}
              Good luck!
            </>
          </div>
        )}
        {predictionMutation.status === "error" && (
          <div>
            There was an error while placing your bet. Details:
            {predictionMutation.error?.message}
          </div>
        )}
      </Modal>
      <div>Expected win: {winProbability.toFixed(3)}</div>
      <InputNumber
        value={input}
        onChange={() => setInputCallback}
        controls={false}
      />
      <Button onClick={() => placePrediction()}>Predict</Button>
    </div>
  );
};

export default PredictingBlock;
