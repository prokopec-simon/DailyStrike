import { UserOutlined } from "@ant-design/icons";
import {
  DownOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  MailOutlined,
} from "@ant-design/icons/lib/icons";
import { Button, Dropdown, MenuProps, Spin } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useUserDetail } from "../contexts/userContext";

const items: MenuProps["items"] = [
  {
    label: <Link href="profile">Profile</Link>,
    key: "0",
    //disabled: true,
    icon: <UserOutlined />,
  },
  {
    label: <Link href="inbox">Inbox</Link>,
    key: "1",
    //disabled: true,
    icon: <MailOutlined />,
  },
  {
    label: <Link href="ladder">Ladder</Link>,
    key: "2",
    icon: <OrderedListOutlined />,
    //disabled: true,
  },
  {
    type: "divider",
  },
  {
    label: "Logout",
    key: "3",
    icon: <LogoutOutlined />,
    onClick: () => {
      signOut();
    },
  },
];
export const ProfileDropdown: React.FC = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const [query] = useUserDetail();

  if (sessionStatus === "loading") {
    return null;
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <Button
        onClick={() => {
          signIn();
        }}
      >
        Sign in
      </Button>
    );
  }

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <div className="flex cursor-pointer items-center">
        <div className="mr-2 flex items-center">
          <Image
            alt="userProfilePicture"
            src={sessionData?.user?.image ?? ""}
            width={35}
            height={35}
            className="rounded-md"
          />
          <div className="ml-2 text-white">
            <div className="text-sm">{sessionData?.user?.name}</div>
            <div className="text-xs">
              {query.data?.user?.balance ? (
                query.data?.user.balance?.toString()
              ) : (
                <Spin size="small" />
              )}
            </div>
          </div>
        </div>
        <DownOutlined className="ml-2 text-white" />
      </div>
    </Dropdown>
  );
};
