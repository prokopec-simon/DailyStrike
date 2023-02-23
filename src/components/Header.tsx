import { ProfileDropdown } from "./ProfileDropdown";

const Header: React.FC = () => {
  return (
    <nav className="flex h-16">
      <div className="ml-4 flex flex-1 items-center"></div>
      <div className="flex flex-1 items-center justify-center">
        <a href="#" className="text-2xl text-orange-500">
          Daily CS:GO
        </a>
      </div>

      <div className="mr-4 flex flex-1 items-center justify-end">
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Header;
