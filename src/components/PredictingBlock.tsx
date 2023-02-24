import { Match } from "@prisma/client";
import { Button, InputNumber, Modal, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { trpc } from "../utils/trpc";

const PredictingBlock: React.FC<{
  match: Match;
  selectedTeam: string;
}> = ({ match, selectedTeam }) => {
  const [input, setInput] = useState("");
  const { data: sessionData, status: sessionStatus } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const predictionMutation = trpc.matches.placePrediction.useMutation();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const placePrediction = () => {
    showModal();
    predictionMutation.mutate({
      userId: sessionData?.user?.id ?? "",
      pickedTeam: selectedTeam == match.teamA_name ? 0 : 1,
      predictionOdds:
        selectedTeam == match.teamA_name
          ? Number(match.teamA_odds)
          : Number(match.teamB_odds),
      predictionAmount: Number(input),
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
      <Modal
        title="Prediction placement modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closeIcon=<></>
        maskClosable={predictionMutation.status == "loading" ? false : true}
        footer=<></>
      >
        <div className="flex">
          <>
            {predictionMutation.status == "loading" ? (
              <Spin className="self-center" size="large" />
            ) : null}
            {predictionMutation.status == "success"
              ? predictionMutation.data?.predictionOdds
              : null}
            {predictionMutation.status == "error"
              ? predictionMutation.error.message
              : null}
          </>
        </div>
      </Modal>
      <div>Expected win: {winProbability.toFixed(3)}</div>
      <InputNumber
        controls={false}
        onInput={() => setInputCallback}
      ></InputNumber>
      <Button onClick={() => placePrediction()}>Predict</Button>
    </div>
  );
};
export default PredictingBlock;
