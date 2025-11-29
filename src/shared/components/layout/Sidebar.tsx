import { useAuth, UserRole } from '../../../features/auth';
import { SidebarLink, type NavLink } from './SidebarLink';

const navigationLinks: NavLink[] = [
  { name: "Dashboard", href: "/dashboard", icon: "🏠" },
  { name: "Mi Perfil", href: "/", icon: "👤" },
  { name: "Test", href: "/test", icon: "🧪" },
  { name: "Panel Admin", href: "/admin", icon: "⚙️", roles: [UserRole.ADMIN] },
  { name: "Usuarios", href: "/users", icon: "👥", roles: [UserRole.ADMIN] },
  { name: "Reportes", href: "/reports", icon: "📊", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
  { name: "Moderación", href: "/moderator", icon: "🛡️", roles: [UserRole.MODERATOR] },
  { name: "Admin/Mod", href: "/admin-or-mod", icon: "🔧", roles: [UserRole.ADMIN, UserRole.MODERATOR] },
  { name: "Todos los Usuarios", href: "/all-users", icon: "👨‍👩‍👧‍👦", roles: [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER] },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const filteredLinks = navigationLinks.filter((link) => {
    // Si no tiene roles definidos, mostrarlo a todos
    if (!link.roles || link.roles.length === 0) return true;
    // Si tiene roles, verificar que el usuario tenga uno de esos roles
    return user?.role && link.roles.includes(user.role as UserRole);
  });

  return (
    <aside
      id="sidebar"
      className="fixed hidden z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 bg-white">
            <ul className="space-y-2">
              {filteredLinks.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};
