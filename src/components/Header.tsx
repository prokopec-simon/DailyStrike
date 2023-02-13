import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  createMultiStyleConfigHelpers,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { menuAnatomy } from "@chakra-ui/anatomy";
import Image from "next/image";

const Header = () => {
  const { data: sessionData } = useSession();
  return (
    <nav className="flex h-16">
      <div className="flex flex-1 items-center"></div>
      <div className="flex flex-1 items-center justify-center">
        <a href="#" className="text-2xl text-orange-500">
          Daily CS:GO
        </a>
      </div>

      <div className="flex flex-1 items-center justify-end">
        {sessionData && sessionData.user && sessionData.user.image ? (
          <>
            <Image
              alt="userProfilePicture"
              src={sessionData.user.image}
              width={30}
              height={30}
            ></Image>
            <Menu>
              <MenuButton>
                <div className="flex flex-col items-start text-white">
                  <div>
                    {sessionData.user.name} <ChevronDownIcon />
                  </div>
                  <div className="text-xs">{sessionData.user.balance}</div>
                </div>
              </MenuButton>
              <MenuList bg={"pink"}>
                <MenuItem bg={"pink"} _hover={{ bg: "red" }}>
                  Profile
                </MenuItem>
                <MenuItem bg={"pink"} onClick={() => signOut()}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : null}

        {!sessionData && (
          <button
            onClick={() => signIn()}
            className=" mt-1 mr-4 rounded border border-solid border-indigo-600 p-2 text-center text-indigo-600 transition-colors duration-300 hover:bg-indigo-600 hover:text-white"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
