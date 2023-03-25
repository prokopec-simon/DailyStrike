import { QuestionCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";

export const GameInfo: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    localStorage.setItem("gameInfoModalVisited", "true");
    setOpen(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  useEffect(() => {
    console.log(localStorage.getItem("gameInfoModalVisited"));
    if (localStorage.getItem("gameInfoModalVisited") != "true") {
      showModal();
    }
  }, []);

  //showModal();

  return (
    <>
      <QuestionCircleOutlined
        onClick={showModal}
        className="text-4xl text-white"
      />
      <Modal open={open} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <div>
          <h1>How to play</h1>
        </div>
      </Modal>
    </>
  );
};
