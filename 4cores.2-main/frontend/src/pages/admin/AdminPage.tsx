import { useEffect, useState } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function AdminEmployeesPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/admin/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          setEmployees(data);
        } else if (Array.isArray(data.data)) {
          setEmployees(data.data);
        } else if (Array.isArray(data.employees)) {
          setEmployees(data.employees);
        } else if (Array.isArray(data.users)) {
          setEmployees(data.users);
        } else {
          setEmployees([]);
        }
      } else {
        console.error('Erro ao buscar funcionários:', response.statusText);
      }
    } catch (err) {
      console.error('Erro de rede ao carregar a lista de funcionários:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar funcionário.');
      }

      setSuccessMessage('Funcionário cadastrado com sucesso!');
      setForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
      setShowPassword(false);
      await fetchEmployees();
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com o servidor.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm('Tem certeza de que deseja remover este funcionário?')) {
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/admin/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || `Erro ao remover funcionário (Código ${response.status}).`
        );
      }

      setSuccessMessage('Funcionário removido com sucesso!');
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          Cadastrar Novo Funcionário
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded border border-green-200">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleCreateEmployee} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Nome do funcionário"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              placeholder="funcionario@4cores.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Senha Provisória
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="******"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border p-2 pr-20 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded w-full font-semibold transition-colors"
          >
            Cadastrar Funcionário
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          Funcionários Cadastrados
        </h2>

        {employees.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum funcionário encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm font-semibold text-gray-600 bg-gray-50">
                  <th className="p-3">Nome</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Cargo</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{employee.name}</td>
                    <td className="p-3 text-gray-600">{employee.email}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {employee.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                      >
                        Apagar Conta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}