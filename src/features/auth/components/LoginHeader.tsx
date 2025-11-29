export const LoginHeader = () => {
  return (
    <div>
      <div className="mx-auto h-12 w-12 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className="h-12 w-12 text-blue-600"
        >
          <rect width="256" height="256" fill="none"></rect>
          <line
            x1="208"
            y1="128"
            x2="128"
            y2="208"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          ></line>
          <line
            x1="192"
            y1="40"
            x2="40"
            y2="192"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="16"
          ></line>
        </svg>
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Iniciar Sesión
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Mi Container - Sistema de Gestión
      </p>
    </div>
  );
};
