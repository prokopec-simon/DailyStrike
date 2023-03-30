import { User } from ".prisma/client";
import { Spin, Table } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";

const Inbox = () => {
  const { data: sessionData } = useSession();
  const secretQuery = trpc.user.getUserMessages.useQuery(
    sessionData?.user?.id ?? "",
    { enabled: sessionData?.user !== undefined }
  );
  const modalRewardColumns = [
    {
      title: "From",
      dataIndex: "sender",
      key: "sender",
      render: (sender: User) => (
        <div className="flex flex-row">
          <Image
            src={sender.image ?? ""}
            alt="profile picture"
            width={30}
            height={30}
          />
          <div>{sender.name}</div>
        </div>
      ),
    },
    {
      title: "content",
      dataIndex: "content",
      key: "content",
      render: (text: string) => <a>{text}</a>,
    },
  ];
  return (
    <>
      {secretQuery.data ? (
        <Table
          dataSource={secretQuery.data}
          columns={modalRewardColumns}
        ></Table>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default Inbox;
