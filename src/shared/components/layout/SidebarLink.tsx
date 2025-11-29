import { Link } from 'react-router-dom';
import type { UserRole } from '../../../features/auth/types/auth.types';

export interface NavLink {
  name: string;
  href: string;
  icon: string;
  roles?: UserRole[];
}

interface SidebarLinkProps {
  link: NavLink;
}

export const SidebarLink = ({ link }: SidebarLinkProps) => {
  return (
    <li>
      <Link
        to={link.href}
        className="text-base capitalize text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
      >
        <span className="mr-3">{link.icon}</span>
        <span>{link.name}</span>
      </Link>
    </li>
  );
};
