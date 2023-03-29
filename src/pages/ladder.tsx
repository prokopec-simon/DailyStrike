import { Button, Modal, Select, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
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

  const modalRewardColumns = [
    {
      title: "Places",
      dataIndex: "places",
      key: "places",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Item name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Reward count",
      dataIndex: "itemCount",
      key: "itemCount",
      render: (text: string) => <a>{text}x</a>,
    },
  ];

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setRewardModalOpen(false);
  };
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

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

  useEffect(() => {
    if (seasonDropdown && seasonDropdown.length > 0) {
      setSelectedValue(seasonDropdown[0]!.value);
    }
  }, [seasonDropdown]);

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
          <ol>
            {allSeasonsInfo !== undefined && (
              <Table
                dataSource={
                  allSeasonsInfo
                    .find((item) => item.id === selectedValue)
                    ?.Rewards.sort((a, b) => a.order - b.order) // Pass a comparator function to sort by order
                }
                columns={modalRewardColumns}
                pagination={false}
              ></Table>
            )}
          </ol>
        </div>
      </Modal>
      <div className="w-100 flex items-center justify-center">
        <div className="flex w-3/5 flex-col items-center justify-center">
          <div className="flex w-full flex-row text-white">
            <Select
              value={selectedValue}
              onChange={(value) => setSelectedValue(value)}
              defaultActiveFirstOption
              className="w-2/5"
              defaultValue={seasonDropdown ? seasonDropdown[0]?.value : null}
            >
              {seasonDropdown
                ? seasonDropdown.map((option) => (
                    <Select.Option key={option.label} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))
                : null}
            </Select>

            <div className="flex w-1/5 flex-row">
              <div> Season start: </div>
              <div>
                {allSeasonsInfo != undefined
                  ? allSeasonsInfo
                      .find((item) => item.id == selectedValue)
                      ?.start.toLocaleDateString()
                  : null}
              </div>
            </div>
            <div className="flex w-1/5 flex-row">
              <div>Season ends in:</div>
              {allSeasonsInfo != undefined && selectedValue ? (
                <CountdownTimer
                  targetDate={
                    allSeasonsInfo.find((item) => item.id == selectedValue)!.end
                  }
                ></CountdownTimer>
              ) : null}
            </div>
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
