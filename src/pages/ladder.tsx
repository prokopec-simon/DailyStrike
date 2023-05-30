import { Button, Modal, Select, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { trpc } from "../utils/trpc";
import Image from "next/image";

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
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      render: (text: string, record: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            alt="profile image"
            width={30}
            height={30}
            src={record.image}
            loader={({ src }) => src}
          />
          <p style={{ marginLeft: "10px" }}>{record.name}</p>
        </div>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (text: bigint) => <p>{text.toString()}</p>,
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
        className="w-3/5 md:w-1/2"
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
        <div className="flex w-4/5 flex-col items-center justify-center md:w-3/5">
          <div className="flex  w-full flex-col pt-4 pb-4 text-white">
            <div className="flex flex-col md:flex-row md:py-2">
              <Select
                value={selectedValue}
                onChange={(value) => setSelectedValue(value)}
                defaultActiveFirstOption
                className="w-100 mt-3 md:mt-0 md:w-1/2"
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
              <div className="w-100 mt-3 md:mt-0  md:w-1/2">
                <Button
                  className="w-full"
                  onClick={() => setRewardModalOpen(true)}
                >
                  Show season rewards
                </Button>
              </div>
            </div>
            <div className="mt-3 flex  flex-col md:mt-0 md:flex-row  md:py-2">
              <div className="w-100 flex flex-col rounded-md border-2 border-solid border-gray-800 p-1 md:w-1/2">
                <div className="flex flex-row text-sm">Season started on</div>
                <div className="flex flex-row text-xl">
                  {allSeasonsInfo != undefined && selectedValue
                    ? allSeasonsInfo
                        .find((item) => item.id == selectedValue)
                        ?.start.toLocaleDateString()
                    : null}
                </div>
              </div>
              <div className="w:100 mt-3 flex flex-col rounded-md border-2 border-solid border-gray-800 p-1 md:mt-0  md:w-1/2">
                <div className="flex flex-row text-sm">Season ends in</div>
                <div className="flex flex-row text-xl">
                  {allSeasonsInfo != undefined && selectedValue ? (
                    <CountdownTimer
                      targetDate={
                        allSeasonsInfo.find((item) => item.id == selectedValue)!
                          .end
                      }
                    ></CountdownTimer>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {isLoading ? (
            <Spin size="large" className="mt-10" />
          ) : (
            <Table
              className="mt-1 w-full"
              dataSource={ladder}
              columns={columns}
              showHeader={false}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Ladder;
