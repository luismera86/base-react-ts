export const AdminPanel = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Usuarios</h3>
          <p className="text-2xl font-bold text-blue-600">150</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Reportes</h3>
          <p className="text-2xl font-bold text-green-600">45</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">Actividad</h3>
          <p className="text-2xl font-bold text-purple-600">98%</p>
        </div>
      </div>
    </div>
  );
};
