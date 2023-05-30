import { Match } from "@prisma/client";
import { Button, InputNumber, Modal, Spin } from "antd";
import { signIn, useSession } from "next-auth/react";
import Icon from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useUserDetail } from "../contexts/userContext";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import successAnimation from "../../public/lottie_success.json";
import failAnimation from "../../public/lottie_fail.json";

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
  const pickedTeam = teamASelected ? 1 : 2;

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const style = {
    height: isMobile ? "80px" : "200px",
  };
  return (
    <div>
      <Modal
        bodyStyle={style}
        width={isMobile ? "80%" : "50%"}
        title={null}
        onOk={handleOk}
        centered={true}
        onCancel={handleCancel}
        open={isModalOpen}
        closable={placePredictionMutation.status !== "loading"}
        maskClosable={placePredictionMutation.status !== "loading"}
        footer={
          placePredictionMutation.status === "success" ? null : (
            <div>
              {placePredictionMutation.status === "error" && (
                <>
                  <Button>Send report</Button>
                </>
              )}
            </div>
          )
        }
        maskStyle={{ backgroundColor: "rgba(160,160,160, 0.7)" }}
      >
        <div className="flex h-full">
          <div className="flex w-2/3 items-center justify-center">
            {placePredictionMutation.status === "success" && (
              <div>
                <p className="text-xl font-medium">
                  Prediction placed successfully !
                </p>
                <p className="mt-4">
                  Placed a{" "}
                  {Number(
                    placePredictionMutation.data.predictionAmount
                  ).toFixed(3) ?? 0}{" "}
                  prediction on{" "}
                  {placePredictionMutation.data.pickedTeam == 0
                    ? match.teamA_name
                    : match.teamB_name}{" "}
                  at {placePredictionMutation.data.predictionOdds?.toString()}{" "}
                  odds, possibly winning{" "}
                  {(
                    Number(placePredictionMutation.data.predictionOdds) *
                      Number(placePredictionMutation.data.predictionAmount) ?? 0
                  ).toFixed(3)}
                </p>
              </div>
            )}
            {placePredictionMutation.status === "loading" && (
              <div>
                <p className="text-xl font-medium">Placing prediction...</p>
              </div>
            )}
            {placePredictionMutation.status === "error" && (
              <div>
                <p className="text-xl font-medium">
                  There was an error while placing your prediction. Details:{" "}
                  {placePredictionMutation.error?.message}
                </p>
              </div>
            )}
          </div>
          <div className="flex w-1/3 items-center justify-center">
            {placePredictionMutation.status === "success" && (
              <Lottie
                className="w-3/5"
                animationData={successAnimation}
                loop={false}
              />
            )}
            {placePredictionMutation.status === "loading" && (
              <Spin size="large" />
            )}
            {placePredictionMutation.status === "error" && (
              <Lottie
                className="w-3/5"
                animationData={failAnimation}
                loop={false}
              />
            )}
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex rounded-b-md bg-zinc-700 p-3">
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
                sessionData != null ? placePrediction() : signIn();
              }}
            >
              Predict
            </Button>

            <div className="mt-1.5 ml-3 flex flex-row text-sm text-white md:ml-7 md:text-base">
              <div> Possible win: {winProbability.toFixed(2)}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PredictionBlock;
