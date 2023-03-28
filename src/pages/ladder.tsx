import { Button, Select, Spin, Table } from "antd";
import { trpc } from "../utils/trpc";

const Ladder = () => {
  const { data: allSeasonsInfo, isLoading: areSeasonsLoading } =
    trpc.ladder.getAllSeasonInfo.useQuery();

  const seasonDropdown = allSeasonsInfo?.map((season) => {
    return { label: season.name, value: season.id };
  });

  const { data: ladder, isLoading: isLoading } =
    trpc.ladder.getCurrentSeasonLadder.useQuery();

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

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
      <div className="flex w-3/5 flex-col items-center justify-center">
        <div className="flex w-full flex-row text-white">
          <Select
            className="w-2/5 leading-9"
            onChange={handleChange}
            defaultActiveFirstOption={true}
            filterOption={true}
            size="large"
            options={seasonDropdown}
          />
          <div className="w-1/5">Season start:</div>
          <div className="w-1/5">Season end:</div>
          <div className="w-1/5">
            <Button>Rewards</Button>
          </div>
        </div>
        {isLoading ? (
          <Spin />
        ) : (
          <Table
            className="mt-4 w-full"
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
