import React, { useContext } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "@/App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};
const Header = ({ title, onMenuClick, className, children }) => {
  return (
    <header className={cn(
      "bg-white border-b border-secondary-200 px-4 lg:px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          {title && (
            <h1 className="text-xl font-bold text-secondary-900">{title}</h1>
          )}
        </div>
<div className="flex items-center space-x-4">
          {children}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;