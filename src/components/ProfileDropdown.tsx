import { UserOutlined } from "@ant-design/icons";
import {
  LogoutOutlined,
  OrderedListOutlined,
} from "@ant-design/icons/lib/icons";
import { Dropdown, MenuProps } from "antd";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

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
  },
];

export const ProfileDropdown: React.FC<{ user: User }> = ({ user }) => (
  <Dropdown menu={{ items }} trigger={["click"]}>
    <a onClick={(e) => e.preventDefault()}>{user.name}</a>
  </Dropdown>
);
