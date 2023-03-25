import { Table } from "antd";
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
      <div className="w-3/5">
        <Table dataSource={ladder} columns={columns} />
      </div>
    </>
  );
};

export default Ladder;
