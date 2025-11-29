import { useAuth } from '../../../features/auth';
import { UserRole } from '../../../features/auth';

export const UserInfo = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
          <div className="text-xs text-gray-500">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user?.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' :
              user?.role === UserRole.MODERATOR ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center">
          {user?.avatar || 'U'}
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-gray-600 text-sm"
          title="Cerrar sesión"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
};
