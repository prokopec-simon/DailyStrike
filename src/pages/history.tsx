import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { ConfigProvider, Spin, Table } from "antd";
import { Match, UserMatchPrediction } from "@prisma/client";
import { QuestionMarkIcon } from "../components/svg/questionmark";
import { CheckmarkIcon } from "../components/svg/checkmark";
import { ErrorIcon } from "../components/svg/error";
import CoinSvgComponent from "../components/svg/coin";
import Icon from "@ant-design/icons";
import { HistoryOutlined } from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const customizeRenderEmptyPredictions = () => (
  <div className="text-center">
    <HistoryOutlined style={{ fontSize: 50 }} />
    <p className="text-lg">You haven&apos;t made any predictions yet.</p>
  </div>
);

const History = () => {
  const { data: sessionData } = useSession();
  const { data: userPredictionHistory, isLoading: isMatchHistoryLoading } =
    trpc.user.getUserMatchHistory.useQuery(sessionData?.user?.id ?? "", {
      enabled: sessionData?.user !== undefined,
    });

  const { data: userBalanceHistory, isLoading: isBalanceHistoryLoading } =
    trpc.user.getUserBalanceHistory.useQuery(sessionData?.user?.id ?? "", {
      enabled: sessionData?.user !== undefined,
    });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const balanceHistoryChartLabels = userBalanceHistory?.map(
    (userBalanceHistory) => {
      return userBalanceHistory.dateAndTime.toLocaleDateString();
    }
  );
  const balanceHistoryChartData = {
    labels: balanceHistoryChartLabels,
    datasets: [
      {
        data: userBalanceHistory?.map((userBalanceHistory) => {
          return userBalanceHistory.balanceAfter;
        }),
        borderColor: "rgb(255,103,0)",
        backgroundColor: "rgba(255,103,0, 0.5)",
      },
    ],
  };

  const userPredictionHistoryColumns = [
    {
      width: "31%",
      ellipsis: true,
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => (
        <div className="flex flex-row pr-2 pl-2">
          <Image
            alt="profile picture"
            src={
              matchUserPrediction?.match.teamA_logoUrl ??
              "https://www.hltv.org/img/static/team/placeholder.svg"
            }
            loader={({ src }) => src}
            width={30}
            height={30}
          />
          <div className="mt-1 truncate pl-1">
            {matchUserPrediction?.match.teamA_name}
          </div>
        </div>
      ),
    },
    {
      width: "8%",
      render: () => <div>vs</div>,
    },
    {
      width: "31%",
      ellipsis: true,
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => (
        <div className="flex flex-row pr-3">
          <Image
            alt="profile picture"
            src={
              matchUserPrediction?.match.teamB_logoUrl ??
              "https://www.hltv.org/img/static/team/placeholder.svg"
            }
            loader={({ src }) => src}
            width={30}
            height={30}
          />
          <div className="mt-1 truncate pl-1">
            {matchUserPrediction?.match.teamB_name}
          </div>
        </div>
      ),
    },
    {
      width: "20%",
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => {
        const balanceResult = matchUserPrediction?.balanceChange;
        let isPositive = false;

        if (!balanceResult) {
          return null;
        } else {
          isPositive = Number(balanceResult) > 0;
        }

        const textClass = (isPositive ? "text-green-500" : "text-red-500") + "";
        const balanceResultFormatted =
          (isPositive ? "+" : "") + Number(balanceResult).toFixed(2);
        return (
          <div className="flex flex-row items-center justify-end">
            <div className={textClass}>{balanceResultFormatted}</div>
            <Icon
              className="mr-2 ml-0.5 mt-0.5 md:ml-1"
              component={CoinSvgComponent}
            ></Icon>
          </div>
        );
      },
    },
    {
      render: (
        width: "10%",
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => {
        const balanceResult = matchUserPrediction?.balanceChange;

        let resultIcon = QuestionMarkIcon;

        if (balanceResult && Number(balanceResult) > 0) {
          resultIcon = CheckmarkIcon;
        }

        if (balanceResult && Number(balanceResult) < 0) {
          resultIcon = ErrorIcon;
        }

        return <Icon className="w-6 md:w-8" component={resultIcon} />;
      },
    },
  ];
  return (
    <>
      <Head>
        <title>DailyStrike - History</title>
        <meta
          name="DailyStrike History"
          content="Your DailyStrike history page"
        />
      </Head>
      <div className="mt-6 flex flex-col items-center justify-center md:mt-24 md:w-full md:flex-row">
        <div className="flex w-4/5 flex-col justify-center md:flex-row-reverse">
          {isBalanceHistoryLoading ? (
            <Spin size="large" className="mt-10" />
          ) : (
            <div className="h-1/3 w-full rounded-xl bg-zinc-700 bg-opacity-20 px-6 pb-4 text-center md:ml-3 md:w-2/5 md:rounded-md md:px-4 md:pb-0">
              <h2 className="py-4 text-lg font-semibold text-white md:text-xl">
                Balance history
              </h2>
              <Line
                options={options}
                data={balanceHistoryChartData}
                className="h-full"
              />
            </div>
          )}
          <div className="mt-8 flex h-2/3 w-full items-center justify-center md:mr-3 md:mt-0 md:w-3/5">
            {isMatchHistoryLoading ? (
              <Spin size="large" className="mt-10" />
            ) : (
              <div className="flex h-full w-full flex-col rounded-md bg-zinc-700 bg-opacity-20 text-center md:px-4 md:pb-8">
                <h2 className="py-4 text-lg font-semibold text-white md:text-xl">
                  Prediction history
                </h2>
                <ConfigProvider renderEmpty={customizeRenderEmptyPredictions}>
                  <Table
                    className="compact-table"
                    pagination={{ pageSize: 5 }}
                    dataSource={userPredictionHistory}
                    columns={userPredictionHistoryColumns}
                    showHeader={false}
                  />
                </ConfigProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default History;
