import { QuestionCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { DiscordSvgComponent } from "./svg/discord";
import { GithubSvgComponent } from "./svg/github";
import { EmailSvgComponent } from "./svg/email";

export const GameInfo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    localStorage.setItem("gameInfoModalVisited", "true");
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (localStorage.getItem("gameInfoModalVisited") != "true") {
      showModal();
    }
  }, []);

  return (
    <>
      <QuestionCircleOutlined
        onClick={showModal}
        className="text-4xl text-white"
      />
      <Modal open={open} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div>
          <h1 className="py-2 text-xl">What is DailyStrike?</h1>
          <p>
            DailyStrike is a game that combines predicting Counter-Strike
            matches with daily challenges like Wordle. Every day, a high-level
            Counter-Strike match is picked, and you can predict the winning team
            by placing a prediction. You can test your gaming knowledge and have
            a chance to win rewards!
          </p>
          <h1 className="py-2 text-xl">How to play?</h1>
          <ol className="list-inside list-decimal py-1 text-base">
            <li>Login to your account</li>
            <li>Predict the winner of today&apos;s Counter-Strike match</li>
            <li>Earn points based on the accuracy of your predictions</li>
            <li>Return daily to place new predictions and earn more points</li>
            <li>
              Compare your performance with other players throughout the season
            </li>
            <li>
              Win exciting prizes based on your final position on the ladder
            </li>
          </ol>
          <div className="py-2 text-xs md:text-sm">
            DailyStrike is a non-profit project developed by fellow passionate
            gamers and is mostly open-source, created as a side project. The
            rewards are generously provided by either me or from a sponsor.
            <br />
            If you want to contribute, become a possible sponsor or just talk to
            me, feel free to contact me on:
          </div>
          <div className="flex items-center gap-3">
            <a>
              <DiscordSvgComponent />
            </a>
            <a>
              <EmailSvgComponent />
            </a>
            <a>
              <GithubSvgComponent />
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};
