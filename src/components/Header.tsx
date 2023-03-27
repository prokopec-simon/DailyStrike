import Link from "next/link";
import Image from "next/image";

import { GameInfo } from "./GameInfo";
import { ProfileDropdown } from "./ProfileDropdown";

const Header: React.FC = () => {
  return (
    <nav className="flex h-20">
      <div className="ml-4 flex flex-1 items-center">
        <GameInfo />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Link href="/">
          <Image
            src="/DailyStrikeLogo-01.svg"
            width={300}
            height={30}
            alt="DailyStrike"
          />
        </Link>
      </div>

      <div className="mr-4 flex flex-1 items-center justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Header;
