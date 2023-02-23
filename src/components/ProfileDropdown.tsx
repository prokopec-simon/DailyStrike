import { UserOutlined } from "@ant-design/icons";
import {
  DownOutlined,
  LogoutOutlined,
  OrderedListOutlined,
} from "@ant-design/icons/lib/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const items: MenuProps["items"] = [
  {
    label: <a href="https://www.antgroup.com">Profile</a>,
    key: "0",
    icon: <UserOutlined />,
  },
  {
    label: <a href="https://www.antgroup.com">League</a>,
    key: "1",
    icon: <OrderedListOutlined />,
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    label: "Logout",
    key: "2",
    icon: <LogoutOutlined />,
    onClick: () => {
      signOut();
    },
  },
];
export const ProfileDropdown: React.FC = () => {
  const { data: sessionData, status: sessionStatus } = useSession();

  return (
    <>
      {sessionStatus != "unauthenticated" ? (
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
              <div className="ml-2">
                <div className="text-sm">{sessionData?.user?.name}</div>
                <div className="text-xs">123.123</div>
              </div>
            </div>
            <DownOutlined className="ml-2" />
          </div>
        </Dropdown>
      ) : (
        <Button
          onClick={() => {
            signIn();
          }}
        >
          Sign in
        </Button>
      )}
    </>
  );
};
