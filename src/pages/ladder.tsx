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
  const { data: ladder, isLoading: isLoading } =
    trpc.ladder.getCurrentSeasonLadder.useQuery();

  const { data: allSeasonsInfo, isLoading: seasonsAreLoading } =
    trpc.ladder.getAllSeasonInfo.useQuery();

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>();

  useEffect(() => {
    if (
      !seasonsAreLoading &&
      allSeasonsInfo &&
      allSeasonsInfo.length > 0 &&
      allSeasonsInfo[0] != undefined
    ) {
      setSelectedSeasonId(allSeasonsInfo[0].id);
    }
  }, [allSeasonsInfo, seasonsAreLoading]);

  const [rewardModalOpen, setRewardModalOpen] = useState(false);

  const handleOk = () => {
    setRewardModalOpen(false);
  };

  const handleChange = (value: string) => {
    setSelectedSeasonId(value);
  };

  const selectedSeason = allSeasonsInfo?.find(
    (item) => item.id === selectedSeasonId
  );

  const modalRewardColumns = [
    {
      title: "Places",
      key: "ladderPlaceStart",
      render: (seasonReward: SeasonReward) => (
        <p className="ordinal">
          {seasonReward.ladderPlaceStart +
            getOrdinalNum(seasonReward.ladderPlaceStart) +
            (seasonReward.ladderPlaceEnd != seasonReward.ladderPlaceStart
              ? "-" +
                seasonReward.ladderPlaceEnd +
                getOrdinalNum(seasonReward.ladderPlaceEnd)
              : "")}
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
                  .find((item) => item.id === selectedSeasonId)
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
        <div className="flex w-4/5 flex-col justify-center md:flex-row md:gap-5">
          <div className="flex  w-full flex-col pt-4 pb-4 text-white md:w-2/5 md:pt-0 md:pb-0">
            <div className="flex flex-col rounded-lg bg-zinc-700 bg-opacity-20 p-2">
              <h2 className="self-center text-white md:pb-4 md:pt-1 md:text-xl">
                Season Info
              </h2>
              <div className="flex w-full flex-col  md:flex-row md:py-2">
                {!seasonsAreLoading ? (
                  <Select
                    size="large"
                    defaultActiveFirstOption
                    className="mt-3 w-full md:mt-0"
                    defaultValue={allSeasonsInfo?.[0]?.id}
                    value={selectedSeasonId}
                    onChange={handleChange}
                  >
                    {allSeasonsInfo &&
                      allSeasonsInfo.map((option) => (
                        <Select.Option key={option.id} value={option.id}>
                          {option.name}
                        </Select.Option>
                      ))}
                  </Select>
                ) : null}
              </div>
              <div className="mt-3 flex  flex-row  items-center md:mt-0 md:py-2">
                <div className="mt-3 w-full justify-center rounded-md md:mt-0 md:w-1/2">
                  <div className="flex flex-col">
                    <div className="text-xs text-zinc-400">
                      Season started on
                    </div>
                    <div className="text-lg md:text-2xl">
                      {selectedSeason != undefined
                        ? selectedSeason.start.toLocaleDateString()
                        : null}
                    </div>
                  </div>
                </div>
                {selectedSeason != undefined ? (
                  <div className="mt-3 w-full justify-center rounded-md md:mt-0 md:w-1/2">
                    <div className="flex flex-col">
                      <div className="text-xs text-zinc-400">
                        Season
                        {selectedSeason?.end < new Date()
                          ? "ends in"
                          : "ended on"}
                      </div>
                      <div className="text-lg md:text-2xl">
                        <div className="text-lg md:text-2xl">
                          {selectedSeason?.end < new Date() ? (
                            selectedSeason?.end.toLocaleDateString()
                          ) : (
                            <CountdownTimer targetDate={selectedSeason?.end} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            {selectedSeason?.Rewards && selectedSeason.Rewards.length > 0 ? (
              <div className="mt-4 flex flex-col items-center rounded-lg bg-zinc-700 bg-opacity-20 p-2 md:p-3">
                <h2 className="self-center pb-2.5 text-white md:pb-4 md:pt-1 md:text-xl">
                  Rewards
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {allSeasonsInfo != null ? (
                    <>
                      {allSeasonsInfo
                        .find((item) => item.id === selectedSeasonId)
                        ?.Rewards.sort(
                          (a, b) => a.ladderPlaceStart - b.ladderPlaceStart
                        )
                        .slice(0, 7)
                        .map((reward, index) => (
                          <SeasonRewardCard
                            key={index}
                            seasonReward={reward}
                          ></SeasonRewardCard>
                        ))}
                      <button
                        className="break-all rounded-md border border-solid border-orange-500 bg-zinc-600 bg-opacity-40 px-2 text-xs md:text-base"
                        onClick={() => setRewardModalOpen(true)}
                      >
                        <p>All</p>
                        <p>Rewards</p>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          {isLoading ? (
            <Spin size="large" className="mt-10" />
          ) : (
            <div className="flex w-full flex-col rounded-lg bg-zinc-700 bg-opacity-20 p-3 md:w-3/5">
              <h2 className="self-center pb-2 text-white md:pb-4 md:pt-1 md:text-xl">
                Standings
              </h2>
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
