import type { ComponentType, ReactNode } from "react";
import * as Icons from "@ant-design/icons";

type MenuIconProps = {
  icon?: string;
  fallback?: ReactNode;
};

const MenuIcon = ({ icon, fallback = null }: MenuIconProps) => {
  if (!icon) return fallback;

  const IconComponent = (Icons as unknown as Record<string, ComponentType>)[icon];
  return IconComponent ? <IconComponent /> : fallback;
};

export default MenuIcon;
