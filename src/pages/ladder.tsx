import { Button, Modal, Select, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import CoinSvgComponent from "../components/svg/coin";
import Icon from "@ant-design/icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DailyStrike - Ladder",
};

const Ladder = () => {
  const { data: allSeasonsInfo, isLoading: areSeasonsLoading } =
    trpc.ladder.getAllSeasonInfo.useQuery();

  const seasonDropdown = allSeasonsInfo?.map((season) => {
    return { label: season.name, value: season.id };
  });

  const { data: ladder, isLoading: isLoading } =
    trpc.ladder.getCurrentSeasonLadder.useQuery();

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setRewardModalOpen(false);
  };

  useEffect(() => {
    if (seasonDropdown && seasonDropdown.length > 0) {
      setSelectedValue(seasonDropdown[0]!.value);
    }
  }, [seasonDropdown]);

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
      render: (text: bigint) => (
        <div className="flex flex-row">
          <div className="pr-1">{text.toString()}</div>
          <Icon className="mt-px" component={CoinSvgComponent}></Icon>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        visible={rewardModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        className="w-3/5 md:w-1/2"
      >
        <div>
          <ol>
            {allSeasonsInfo && (
              <Table
                dataSource={allSeasonsInfo
                  .find((item) => item.id === selectedValue)
                  ?.Rewards.sort((a, b) => a.order - b.order)}
                columns={modalRewardColumns}
                pagination={false}
              />
            )}
          </ol>
        </div>
      </Modal>
      <div className="w-100 flex items-center justify-center md:mt-16">
        <div className="flex w-4/5 flex-col items-center justify-center md:w-3/5">
          <div className="flex  w-full flex-col pt-4 pb-4 text-white">
            <div className="flex flex-col md:flex-row md:py-2">
              <Select
                value={selectedValue}
                size="large"
                onChange={setSelectedValue}
                defaultActiveFirstOption
                className="w-100 mt-3 pr-2 md:mt-0 md:w-1/2"
                defaultValue={allSeasonsInfo?.[0]?.id}
              >
                {allSeasonsInfo &&
                  allSeasonsInfo.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
              </Select>
              <div className="w-100 mt-3 pl-2 md:mt-0 md:w-1/2">
                <Button
                  className="h-10 w-full"
                  onClick={() => setRewardModalOpen(true)}
                >
                  Show season rewards
                </Button>
              </div>
            </div>
            <div className="mt-3 flex  flex-col pr-4  md:mt-0 md:flex-row md:py-2">
              <div className="mt-3 w-full justify-center rounded-md bg-zinc-800 md:mt-0 md:w-1/2">
                <div className="flex flex-col">
                  <div className="text-xs text-zinc-400">Season started on</div>
                  <div className="text-2xl">
                    {allSeasonsInfo != undefined && selectedValue
                      ? allSeasonsInfo
                          .find((item) => item.id == selectedValue)
                          ?.start.toLocaleDateString()
                      : null}
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full justify-center rounded-md bg-zinc-800 md:mt-0 md:w-1/2">
                <div className="flex flex-col">
                  <div className="text-xs text-zinc-400">Season ends in</div>
                  <div className="text-2xl">
                    {allSeasonsInfo != undefined && selectedValue ? (
                      <CountdownTimer
                        targetDate={
                          allSeasonsInfo.find(
                            (item) => item.id == selectedValue
                          )!.end
                        }
                      ></CountdownTimer>
                    ) : null}
                  </div>
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
