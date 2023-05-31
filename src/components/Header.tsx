import Link from "next/link";
import Image from "next/image";

import { GameInfo } from "./GameInfo";
import { ProfileDropdown } from "./ProfileDropdown";
import { useState, useEffect } from "react";

const Header: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="flex h-20">
      <div className="ml-4 flex flex-1 items-center">
        <GameInfo />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Link href="/">
          <Image
            style={{ maxWidth: isMobile ? "200px" : "100%" }}
            className="mt-2 md:mt-14 "
            src="/DailyStrikeLogo-01.svg"
            width={400}
            height={30}
            alt="DailyStrike"
          />
        </Link>
      </div>

      <div className="mr-2 flex flex-1 items-center justify-end md:mr-4">
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Header;
