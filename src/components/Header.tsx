import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ProfileDropdown } from "./ProfileDropdown";

const Header: React.FC = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  return (
    <nav className="flex h-16">
      <div className="ml-4 flex flex-1 items-center"></div>
      <div className="flex flex-1 items-center justify-center">
        <a href="#" className="text-2xl text-orange-500">
          Daily CS:GO
        </a>
      </div>

      <div className="mr-4 flex flex-1 items-center justify-end">
        {sessionData && sessionData.user && sessionData.user.image ? (
          <>
            <Image
              alt="userProfilePicture"
              src={sessionData.user.image}
              width={30}
              height={30}
            ></Image>
            <ProfileDropdown user={sessionData.user}></ProfileDropdown>
          </>
        ) : null}

        {sessionStatus == "unauthenticated" && (
          <button
            onClick={() => signIn()}
            className="mt-1 mr-4 rounded bg-orange-500 p-1 px-4 text-center text-sm text-white"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
