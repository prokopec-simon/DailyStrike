import { Match } from "@prisma/client";
import { Button, InputNumber, Modal, Spin } from "antd";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useUserDetail } from "../contexts/userContext";

const PredictionBlock: React.FC<{
  match: Match;
  selectedTeam: string;
}> = ({ match, selectedTeam }) => {
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const { data: sessionData } = useSession();
  const [userDetail, placePredictionMutation] = useUserDetail();
  const [input, setInput] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamASelected = selectedTeam === match.teamA_name;
  const predictionOdds = Number(
    teamASelected ? match.teamA_odds : match.teamB_odds
  );
  const pickedTeam = teamASelected ? 0 : 1;

  const winProbability = predictionOdds * input;

  useEffect(() => {
    setInput(Number(userDetail.data?.dailyPrediction.predictionAmount));
  }, [userDetail.data?.dailyPrediction.predictionAmount]);

  const setInputCallback = useCallback((value: number) => {
    setInput(value);
  }, []);

  const placePrediction = async () => {
    showModal();

    await placePredictionMutation.mutateAsync({
      userId: sessionData?.user?.id ?? "",
      pickedTeam,
      predictionOdds,
      predictionAmount: input,
    });
  };

  return (
    <div>
      <Modal
        title={<div>Placing prediction</div>}
        onOk={handleOk}
        onCancel={handleCancel}
        open={isModalOpen}
        closable={placePredictionMutation.status !== "loading"}
        maskClosable={placePredictionMutation.status !== "loading"}
        footer={
          placePredictionMutation.status === "success" ? (
            <div>
              <Button>Ok</Button>
            </div>
          ) : (
            <div>
              {placePredictionMutation.status === "error" && (
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
        {placePredictionMutation.status === "loading" && (
          <div className="flex">
            <Spin className="self-center" size="large" />
          </div>
        )}
        {placePredictionMutation.status === "success" && (
          <div>
            <>
              Prediction placed successfully, placed amount:
              {placePredictionMutation.data?.predictionAmount} at
              {placePredictionMutation.data?.predictionOdds}. Possible win:
              {(
                Number(placePredictionMutation.data?.predictionAmount) *
                Number(placePredictionMutation.data?.predictionOdds)
              ).toFixed(3)}
              Good luck!
            </>
          </div>
        )}
        {placePredictionMutation.status === "error" && (
          <div>
            There was an error while placing your bet. Details:
            {placePredictionMutation.error?.message}
          </div>
        )}
      </Modal>
      <div>Possible win: {winProbability.toFixed(3)}</div>
      <InputNumber
        value={input}
        disabled={userDetail.data?.dailyPrediction.pickedTeam != null}
        onChange={(numberInput) => setInputCallback(numberInput ?? 0)}
        controls={false}
      />
      <Button
        disabled={userDetail.data?.dailyPrediction.pickedTeam != null}
        onClick={() => {
          placePrediction();
        }}
      >
        Predict
      </Button>
    </div>
  );
};

export default PredictionBlock;
