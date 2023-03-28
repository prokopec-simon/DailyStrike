import { QuestionCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";

export const GameInfo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    localStorage.setItem("gameInfoModalVisited", "true");
    setOpen(true);
  };

  useEffect(() => {
    console.log(localStorage.getItem("gameInfoModalVisited"));
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
      <Modal open={open} footer={null}>
        <div>
          <h1>How to play?</h1>
          <ul>
            <li>Log in</li>
            <li>Predict a winner of todays match</li>
            <li>Collect points</li>
            <li>Compare to others in timed leagues</li>
            <li>Win cool prizes!</li>
            <p>A new match is then picked at XX:XX every night.</p>
          </ul>
        </div>
      </Modal>
    </>
  );
};
