import { Match } from "@prisma/client";
import { Button, InputNumber, Modal, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useCallback, useContext, useState } from "react";
import { useGlobalContext } from "../contexts/userContext";
import { trpc } from "../utils/trpc";

const PredictingBlock: React.FC<{
  match: Match;
  selectedTeam: string;
}> = ({ match, selectedTeam }) => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [input, setInput] = useState<number>(
    sessionData?.user?.livePredictionAmount ?? 0
  );

  const { copy, setCopy } = useGlobalContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const predictionMutation = trpc.match.placePrediction.useMutation();

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => setIsModalOpen(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const placePrediction = async () => {
    showModal();

    const pickedTeam = selectedTeam === match.teamA_name ? 0 : 1;
    const predictionOdds =
      selectedTeam === match.teamA_name
        ? Number(match.teamA_odds)
        : Number(match.teamB_odds);
    const result: any = await predictionMutation
      .mutateAsync({
        userId: sessionData?.user?.id ?? "",
        pickedTeam,
        predictionOdds,
        predictionAmount: input,
      })
      .catch((error: any) => console.error("Error placing prediction", error));
    setCopy({ name: copy.name, balance: Number(result.newBalance) });
  };

  const winProbability =
    selectedTeam === match.teamA_name
      ? Number(match.teamA_odds) * input
      : Number(match.teamB_odds) * input;

  const setInputCallback = useCallback((value: number) => {
    setInput(value);
  }, []);

  return (
    <div>
      <Modal
        title={<div>Placing prediction</div>}
        onOk={handleOk}
        onCancel={handleCancel}
        open={isModalOpen}
        closable={predictionMutation.status !== "loading"}
        maskClosable={predictionMutation.status !== "loading"}
        footer={
          predictionMutation.status === "success" ? (
            <div>
              <Button>Ok</Button>
            </div>
          ) : (
            <div>
              {predictionMutation.status === "error" && (
                <>
                  <Button>Send report</Button>
                  <Button>Ok</Button>
                </>
              )}
            </div>
          )
        }
        maskStyle={{ backgroundColor: "rgba(160,160,160, 0.7)" }}
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
        disabled={sessionData?.user?.livePredictionAmount != null}
        onChange={(numberInput) => setInputCallback(numberInput ?? 0)}
        controls={false}
      />
      <Button
        disabled={sessionData?.user?.livePredictionAmount != null}
        onClick={() => {
          placePrediction();
        }}
      >
        Predict
      </Button>
    </div>
  );
};

export default PredictingBlock;
