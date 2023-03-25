import Link from "next/link";
import { GameInfo } from "./GameInfo";
import { ProfileDropdown } from "./ProfileDropdown";

const Header: React.FC = () => {
  return (
    <nav className="flex h-16">
      <div className="ml-4 flex flex-1 items-center">
        <GameInfo />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Link href="/"> Daily CS:GO</Link>
      </div>

      <div className="mr-4 flex flex-1 items-center justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Header;
