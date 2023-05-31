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
import CoinSvgComponent from "./svg/coin";

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
              addonAfter={<Icon component={CoinSvgComponent} />}
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
