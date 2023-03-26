import { Spin, Table } from "antd";
import { trpc } from "../utils/trpc";

const Ladder = () => {
  const { data: ladder, isLoading: isLoading } =
    trpc.ladder.getCurrentLadder.useQuery();

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
      <div className="flex w-full items-center justify-center">
        {isLoading ? (
          <Spin />
        ) : (
          <Table
            className="w-3/5"
            dataSource={ladder}
            columns={columns}
            showHeader={false}
          />
        )}
      </div>
    </>
  );
};

export default Ladder;
