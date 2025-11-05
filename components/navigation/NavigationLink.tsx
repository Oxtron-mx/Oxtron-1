import { SidebarProps } from "@/constants/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationLink = ({ children, name, route, isOpen }: SidebarProps) => {
  const path = usePathname().split('/');
  const relevantSegment = path.length > 3 ? path[3] : '';
  const isActive = relevantSegment === '' && route.split("/").pop() === 'dashboard' || (route.split("/").pop() || '') === relevantSegment;

  return (
    <Link
      href={route}
      className={`flex p-2 rounded-sm cursor-pointer place-items-center gap-3 transition-all duration-300 text-sidebar 
      ${isActive ? "shad-primary-btn border-b-2" : "hover:bg-neutral-700/30 border-b-0"}`}
    >
      <span>{children}</span>
      <p
        className={`text-inherit text-sm font-poppins overflow-clip whitespace-nowrap tracking-wide capitalize ${
          isOpen ? "opacity-100" : "opacity-0 lg:opacity-100"
        }`}
      >
        {name}
      </p>
    </Link>
  );
};

export default NavigationLink;
