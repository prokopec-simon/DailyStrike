import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { Spin, Table } from "antd";
import { Match, UserMatchPrediction } from "@prisma/client";
import { QuestionMarkIcon } from "../components/svg/questionmark";
import { CheckmarkIcon } from "../components/svg/checkmark";
import { ErrorIcon } from "../components/svg/error";
import CoinSvgComponent from "../components/svg/coin";
import Icon from "@ant-design/icons";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      data: [0, 10, 5, 2, 20, 30, 45],
      borderColor: "rgb(255,103,0)",
      backgroundColor: "rgba(255,103,0, 0.5)",
    },
  ],
};

const History = () => {
  const { data: sessionData } = useSession();
  const { data: userPredictionHistory, isLoading: isMatchHistoryLoading } =
    trpc.user.getUserMatchHistory.useQuery(sessionData?.user?.id ?? "", {
      enabled: sessionData?.user !== undefined,
    });

  const userPredictionHistoryColumns = [
    {
      width: "5%",
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => {
        const balanceResult = matchUserPrediction?.balanceResult;

        let backgroundColor = "bg-gray-200";

        if (balanceResult != null) {
          if (balanceResult > 0) {
            backgroundColor = "bg-green-500";
          } else if (balanceResult < 0) {
            backgroundColor = "bg-red-500";
          }
        }

        return (
          <div
            className={`float-left -my-8 -ml-4 h-16 w-2 ${backgroundColor}`}
          ></div>
        );
      },
    },
    {
      width: "25%",
      title: "First Team",
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => (
        <div className="flex flex-row">
          <Image
            alt="profile picture"
            src={matchUserPrediction?.match.teamA_logoUrl ?? ""}
            loader={({ src }) => src}
            width={30}
            height={30}
          />
          <div className="mt-1.5">{matchUserPrediction?.match.teamA_name}</div>
        </div>
      ),
    },
    {
      width: "5%",
      render: () => <div>vs</div>,
    },
    {
      width: "25%",
      title: "Second Team",
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => (
        <div className="flex flex-row">
          <Image
            alt="profile picture"
            src={matchUserPrediction?.match.teamB_logoUrl ?? ""}
            loader={({ src }) => src}
            width={30}
            height={30}
          />
          <div className="mt-1.5">{matchUserPrediction?.match.teamB_name}</div>
        </div>
      ),
    },
    {
      width: "40%",
      title: "Result",
      render: (
        matchUserPrediction:
          | (UserMatchPrediction & {
              match: Match;
            })
          | undefined
      ) => {
        const balanceResult = matchUserPrediction?.balanceResult;

        if (balanceResult === null || balanceResult === undefined) {
          return (
            <div className="float-right mr-14 mt-2 flex flex-row content-end">
              <Icon className="mt-px" component={QuestionMarkIcon} />
            </div>
          );
        }

        const isPositive = balanceResult > 0;
        const textClass =
          (isPositive ? "text-green-500" : "text-red-500") + " mt-2";
        const IconComponent = isPositive ? CheckmarkIcon : ErrorIcon;
        const balanceResultFormatted =
          (isPositive ? "+" : "") + Number(balanceResult).toFixed(2);
        return (
          <div className="float-right flex flex-row content-end">
            <div className={textClass}>{balanceResultFormatted}</div>
            <Icon
              className="mr-2 ml-1 mt-1.5"
              component={CoinSvgComponent}
            ></Icon>
            <Icon className="mt-px" component={IconComponent} />
          </div>
        );
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
      <div className="flex w-4/5 flex-col justify-center md:w-3/5">
        <div className="h-1/3 w-full md:w-1/3">
          <Line options={options} data={data} className="h-full" />
        </div>
        <div className="h-2/3 w-full md:w-2/3">
          {isMatchHistoryLoading ? (
            <Spin size="large" className="mt-10" />
          ) : (
            <Table
              dataSource={userPredictionHistory}
              columns={userPredictionHistoryColumns}
              showHeader={false}
              className="h-full"
            />
          )}
        </div>
      </div>
    </>
  );
};
export default History;
