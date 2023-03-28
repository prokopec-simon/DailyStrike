import { Button, Modal, Select, Spin, Table } from "antd";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Ladder = () => {
  const { data: allSeasonsInfo, isLoading: areSeasonsLoading } =
    trpc.ladder.getAllSeasonInfo.useQuery();

  const seasonDropdown = allSeasonsInfo?.map((season) => {
    return { label: season.name, value: season.id };
  });

  const { data: ladder, isLoading: isLoading } =
    trpc.ladder.getCurrentSeasonLadder.useQuery();

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setRewardModalOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setRewardModalOpen(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (text: bigint) => <a>{text.toString()}</a>,
    },
  ];

  return (
    <>
      <Modal
        open={rewardModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width="50%"
      >
        <div>
          <h1>This season rewards:</h1>
          <ul>
            <li> 1st place: 50$ Paypal</li>
            <li> 2nd place: 25$ Paypal</li>
            <li> 3rd place: 10$ Paypal</li>
          </ul>
        </div>
      </Modal>
      <div className="w-100 flex items-center justify-center">
        <div className="flex w-3/5 flex-col items-center justify-center">
          <div className="flex w-full flex-row text-white">
            <Select
              className="w-2/5"
              onChange={handleChange}
              defaultActiveFirstOption={true}
              filterOption={true}
              size="large"
              options={seasonDropdown}
            />
            <div className="w-1/5">Season start:</div>
            <div className="w-1/5">Season end:</div>
            <div className="w-1/5">
              <Button onClick={() => setRewardModalOpen(true)}>Rewards</Button>
            </div>
          </div>
          {isLoading ? (
            <Spin />
          ) : (
            <>
              <h1 className="mt-2 text-white">Standings:</h1>
              <Table
                className="mt-1 w-full"
                dataSource={ladder}
                columns={columns}
                showHeader={false}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Ladder;
