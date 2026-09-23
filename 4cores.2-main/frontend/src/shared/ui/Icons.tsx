import {
  ArrowRight,
  Facebook,
  Instagram,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<typeof Search>;
export const CartIcon = (props: IconProps) => <ShoppingCart {...props} />;
export const SearchIcon = (props: IconProps) => <Search {...props} />;
export const MenuIcon = (props: IconProps) => <Menu {...props} />;
export const CloseIcon = (props: IconProps) => <X {...props} />;
export const UserIcon = (props: IconProps) => <User {...props} />;
export const ArrowRightIcon = (props: IconProps) => <ArrowRight {...props} />;
export const InstagramIcon = (props: IconProps) => <Instagram {...props} />;
export const FacebookIcon = (props: IconProps) => <Facebook {...props} />;
export const SunIcon = (props: IconProps) => <Sun {...props} />;
export const MoonIcon = (props: IconProps) => <Moon {...props} />;
