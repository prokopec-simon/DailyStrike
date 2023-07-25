import { Button, Modal, Select, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import CountdownTimer from "../components/CountdownTimer";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import CoinSvgComponent from "../components/svg/coin";
import Icon from "@ant-design/icons";
import Head from "next/head";
import { Decimal } from "@prisma/client/runtime";
import SeasonRewardCard from "../components/SeasonRewardCard";
import { SeasonReward } from "@prisma/client";
import { getOrdinalNum } from "../utils/cardinalPositionFormatter";

const Ladder = () => {
  const { data: allSeasonsInfo } = trpc.ladder.getAllSeasonInfo.useQuery();

  const seasonDropdown = allSeasonsInfo?.map((season) => {
    return { label: season.name, value: season.id };
  });

  const { data: ladder, isLoading: isLoading } =
    trpc.ladder.getCurrentSeasonLadder.useQuery();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const handleOk = () => {
    setRewardModalOpen(false);
  };

  useEffect(() => {
    if (
      seasonDropdown &&
      seasonDropdown.length > 0 &&
      seasonDropdown[0]?.value
    ) {
      setSelectedValue(seasonDropdown[0]?.value);
    }
  }, [seasonDropdown]);

  const modalRewardColumns = [
    {
      title: "Places",
      key: "ladderPlaceStart",
      render: (seasonReward: SeasonReward) => (
        <p className="ordinal">
          {seasonReward.ladderPlaceStart +
            getOrdinalNum(seasonReward.ladderPlaceStart)}
        </p>
      ),
    },
    {
      title: "Item name",
      dataIndex: "itemName",
      key: "itemName",
      render: (text: string) => <p>{text}</p>,
    },
    {
      title: "Reward count",
      dataIndex: "itemCount",
      key: "itemCount",
      render: (text: string) => <p>{text}</p>,
    },
  ];

  const handleCancel = () => {
    setRewardModalOpen(false);
  };

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => <div>#{index + 1}</div>,
    },
    {
      title: "Profile",
      key: "profile",
      render: (record: any) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {record && record.image && (
            <Image
              alt="profile image"
              width={30}
              height={30}
              src={record.image}
              loader={({ src }) => src}
            />
          )}
          {record && record.name && (
            <p style={{ marginLeft: "10px" }}>{record.name}</p>
          )}
        </div>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (userBalance: Decimal) => (
        <div className="flex flex-row">
          <div className="pr-1">{Number(userBalance).toFixed(2)}</div>
          <Icon className="mt-px" component={CoinSvgComponent}></Icon>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>DailyStrike - Ladder</title>
        <meta
          name="DailyStrike Ladder"
          content="An overview of the daily strike ladder"
        />
      </Head>
      <Modal
        open={rewardModalOpen}
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
                  ?.Rewards.sort(
                    (a, b) => a.ladderPlaceStart - b.ladderPlaceStart
                  )}
                columns={modalRewardColumns}
                pagination={false}
              />
            )}
          </ol>
        </div>
      </Modal>
      <div className="flex items-center justify-center md:mt-16">
        <div className="flex w-4/5 flex-col justify-center md:flex-row">
          <div className="flex  w-full flex-col pt-4 pb-4 text-white md:w-2/5 md:pt-0">
            <div className="flex w-full flex-col  md:flex-row md:py-2">
              <Select
                value={selectedValue}
                size="large"
                onChange={setSelectedValue}
                defaultActiveFirstOption
                className="mt-3 w-full pr-2 md:mt-0"
                defaultValue={allSeasonsInfo?.[0]?.id}
              >
                {allSeasonsInfo &&
                  allSeasonsInfo.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
              </Select>
              {/* <div className="mt-3 w-full pl-2 md:mt-0 md:w-1/2">
                <Button
                  className="h-10 w-full"
                  onClick={() => setRewardModalOpen(true)}
                >
                  Show season rewards
                </Button>
              </div> */}
            </div>
            <div className="mt-3 flex  flex-col pr-4  md:mt-0 md:flex-row md:py-2">
              <div className="mt-3 w-full justify-center rounded-md md:mt-0 md:w-1/2">
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
              <div className="mt-3 w-full justify-center rounded-md md:mt-0 md:w-1/2">
                <div className="flex flex-col">
                  <div className="text-xs text-zinc-400">Season ends in</div>
                  <div className="text-2xl">
                    <div className="text-2xl">
                      {allSeasonsInfo !== undefined && selectedValue ? (
                        allSeasonsInfo.find((item) => item.id === selectedValue)
                          ?.end !== undefined ? (
                          <CountdownTimer
                            targetDate={
                              allSeasonsInfo.find(
                                (item) => item.id === selectedValue
                              )?.end as Date
                            }
                          ></CountdownTimer>
                        ) : null
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {allSeasonsInfo != null
                ? allSeasonsInfo
                    .find((item) => item.id === selectedValue)
                    ?.Rewards.sort(
                      (a, b) => a.ladderPlaceStart - b.ladderPlaceStart
                    )
                    .slice(0, 7)
                    .map((reward, index) => (
                      <SeasonRewardCard
                        key={index}
                        seasonReward={reward}
                      ></SeasonRewardCard>
                    ))
                : null}
              <button
                className="break-all rounded-md border border-solid border-orange-500 bg-zinc-600 bg-opacity-10 px-2 text-xs md:text-base"
                onClick={() => setRewardModalOpen(true)}
              >
                <p>All</p>
                <p>Rewards</p>
              </button>
            </div>
          </div>
          {isLoading ? (
            <Spin size="large" className="mt-10" />
          ) : (
            <div className="w-full md:w-3/5">
              <Table
                className="mt-1"
                dataSource={ladder}
                rowKey={(record) => record.image ?? ""}
                columns={columns}
                showHeader={false}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Ladder;
