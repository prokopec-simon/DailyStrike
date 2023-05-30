import { User } from ".prisma/client";
import { ConfigProvider, Spin, Table } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { trpc } from "../utils/trpc";
import { InboxOutlined } from "@ant-design/icons";

const Inbox = () => {
  const { data: sessionData } = useSession();
  const secretQuery = trpc.user.getUserMessages.useQuery(
    sessionData?.user?.id ?? "",
    { enabled: sessionData?.user !== undefined }
  );

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <InboxOutlined style={{ fontSize: 50 }} />
      <p className="text-lg">You have no messages</p>
    </div>
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
        <div className="mx-auto flex  w-4/5 md:w-3/5">
          <ConfigProvider renderEmpty={customizeRenderEmpty}>
            <Table
              dataSource={secretQuery.data}
              columns={modalRewardColumns}
              showHeader={false}
              className="w-full"
            ></Table>
          </ConfigProvider>
        </div>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default Inbox;
