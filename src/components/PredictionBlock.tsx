import { Match } from "@prisma/client";
import { Button, Input, InputNumber, Modal, Spin } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Icon from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useUserDetail } from "../contexts/userContext";

const SvgComponent = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 673.99 674" {...props}>
    <defs>
      <style>{".cls-2{fill:#fcfcfc}"}</style>
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_6" data-name="Layer 6">
        <path
          d="M337 0C150.88 0 0 150.87 0 337s150.88 337 337 337 337-150.89 337-337S523.11 0 337 0Zm-86.5 359.07a26.49 26.49 0 0 1-26.5 26.48H60a26.48 26.48 0 0 1-26.5-26.48V315A26.46 26.46 0 0 1 60 288.55h164A26.47 26.47 0 0 1 250.5 315ZM288.45 60a26.46 26.46 0 0 1 26.47-26.5H359A26.47 26.47 0 0 1 385.45 60v164A26.49 26.49 0 0 1 359 250.5h-44.08a26.49 26.49 0 0 1-26.47-26.5ZM379 337a42 42 0 1 1-42-42 42 42 0 0 1 42 42Zm6.55 277a26.49 26.49 0 0 1-26.47 26.49H315A26.49 26.49 0 0 1 288.54 614V450A26.47 26.47 0 0 1 315 423.5h44.05a26.46 26.46 0 0 1 26.49 26.5ZM614 385.44H450A26.48 26.48 0 0 1 423.5 359v-44.08a26.48 26.48 0 0 1 26.5-26.48h164a26.49 26.49 0 0 1 26.48 26.48V359A26.48 26.48 0 0 1 614 385.44Z"
          style={{
            fill: "#ff6700",
          }}
        />
        <path
          className="cls-2"
          d="M250.5 315v44a26.49 26.49 0 0 1-26.5 26.55H60a26.48 26.48 0 0 1-26.5-26.48V315A26.46 26.46 0 0 1 60 288.55h164A26.47 26.47 0 0 1 250.5 315Z"
        />
        <circle className="cls-2" cx={336.99} cy={337} r={42} />
        <path
          className="cls-2"
          d="M385.45 60v164A26.49 26.49 0 0 1 359 250.5h-44.08a26.49 26.49 0 0 1-26.47-26.5V60a26.46 26.46 0 0 1 26.47-26.5H359A26.47 26.47 0 0 1 385.45 60ZM640.5 314.92V359a26.48 26.48 0 0 1-26.5 26.44H450A26.48 26.48 0 0 1 423.5 359v-44.08a26.48 26.48 0 0 1 26.5-26.48h164a26.49 26.49 0 0 1 26.5 26.48ZM385.54 450v164a26.49 26.49 0 0 1-26.47 26.49H315A26.49 26.49 0 0 1 288.54 614V450A26.47 26.47 0 0 1 315 423.5h44.05a26.46 26.46 0 0 1 26.49 26.5Z"
        />
      </g>
    </g>
  </svg>
);

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
    if (userDetail.data?.dailyPrediction.predictionAmount) {
      setInput(Number(userDetail.data?.dailyPrediction.predictionAmount));
    }
  }, [
    userDetail.data?.dailyPrediction,
    userDetail.data?.dailyPrediction.predictionAmount,
  ]);

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
      <div className="flex  rounded-b-md bg-zinc-700 p-3">
        <InputNumber
          className="w-1/3"
          value={input}
          disabled={userDetail.data?.dailyPrediction.pickedTeam != null}
          onChange={(numberInput) => setInputCallback(numberInput ?? 0)}
          controls={false}
          addonAfter={<Icon component={SvgComponent} />}
        />

        <Button
          disabled={userDetail.data?.dailyPrediction.pickedTeam != null}
          onClick={() => {
            placePrediction();
          }}
        >
          Predict
        </Button>

        <div className="mt-1 ml-3 flex flex-row text-white">
          <div> Possible win: {winProbability.toFixed(3)}</div>

          <Icon component={SvgComponent} />
        </div>
      </div>
    </div>
  );
};

export default PredictionBlock;
