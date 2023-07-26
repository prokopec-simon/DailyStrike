import {
  DownOutlined,
  LogoutOutlined,
  OrderedListOutlined,
  MailOutlined,
  TrophyOutlined,
} from "@ant-design/icons/lib/icons";
import { Button, Dropdown, MenuProps, Spin } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useUserDetail } from "../contexts/userContext";
import CoinSvgComponent from "./svg/coin";
import Icon from "@ant-design/icons";

const items: MenuProps["items"] = [
  {
    label: <Link href="history">History</Link>,
    key: "0",
    icon: <OrderedListOutlined />,
  },
  {
    label: <Link href="inbox">Inbox</Link>,
    key: "1",
    icon: <MailOutlined />,
  },
  {
    label: <Link href="ladder">Ladder</Link>,
    key: "2",
    icon: <TrophyOutlined />,
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
            className="hidden rounded-md md:inline"
          />
          <div className="ml-2 text-white">
            <div className="text-sm">{sessionData?.user?.name}</div>
            <div className="text-xs">
              {query.data?.user?.balance ? (
                <>
                  {Number(query.data.user.balance).toFixed(2)}
                  <Icon component={CoinSvgComponent} />
                </>
              ) : (
                <Spin size="small" />
              )}
            </div>
          </div>
        </div>
        <DownOutlined className="text-white md:ml-2" />
      </div>
    </Dropdown>
  );
};
