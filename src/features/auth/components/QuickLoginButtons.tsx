interface QuickLoginButtonsProps {
  onQuickLogin: (userType: 'admin' | 'user' | 'moderator') => void;
}

export const QuickLoginButtons = ({ onQuickLogin }: QuickLoginButtonsProps) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">Usuarios de prueba</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => onQuickLogin('admin')}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="text-red-600 font-semibold mr-2">Admin:</span>
          admin@micontainer.com
        </button>
        
        <button
          type="button"
          onClick={() => onQuickLogin('moderator')}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="text-yellow-600 font-semibold mr-2">Moderador:</span>
          mod@micontainer.com
        </button>
        
        <button
          type="button"
          onClick={() => onQuickLogin('user')}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="text-green-600 font-semibold mr-2">Usuario:</span>
          user@micontainer.com
        </button>
      </div>
      
      <p className="mt-2 text-center text-xs text-gray-500">
        Contraseña para todos: <span className="font-mono">password123</span>
      </p>
    </div>
  );
};
