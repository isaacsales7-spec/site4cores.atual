import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'EMPLOYEE' | 'ADMIN';
}

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar login.');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user);
      setIsLoggingIn(false);
      setEmail('');
      setPassword('');
      setShowPassword(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com o servidor.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao realizar cadastro.');
      }

      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      setIsRegistering(false);
      setIsLoggingIn(true);
      setName('');
      setPassword('');
      setShowPassword(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com o servidor.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
        ÁREA DO CLIENTE
      </span>
      <h1 className="text-3xl font-serif font-bold text-slate-800 mb-6">
        Meu perfil
      </h1>

      {user ? (
        <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 font-bold text-2xl flex items-center justify-center rounded">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded">
                Cargo: {user.role}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t flex gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
            >
              Sair da Conta
            </button>
            {user.role === 'ADMIN' && (
              <a
                href="/admin"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded inline-block"
              >
                Painel do Administrador
              </a>
            )}
          </div>
        </div>
      ) : isLoggingIn ? (
        <div className="border rounded-lg p-6 bg-white shadow-sm max-w-md">
          <h2 className="text-xl font-bold mb-4">Entrar na sua conta</h2>
          {errorMessage && (
            <p className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
              {errorMessage}
            </p>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 pr-10 rounded"
                  placeholder="******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs font-semibold"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 font-bold py-2 px-4 rounded hover:bg-yellow-500 text-slate-900"
            >
              Entrar
            </button>
            <div className="flex justify-between text-sm pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLoggingIn(false);
                  setIsRegistering(true);
                  setShowPassword(false);
                }}
                className="text-indigo-600 hover:underline"
              >
                Criar uma conta
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoggingIn(false);
                  setShowPassword(false);
                }}
                className="text-gray-500 hover:underline"
              >
                Voltar
              </button>
            </div>
          </form>
        </div>
      ) : isRegistering ? (
        <div className="border rounded-lg p-6 bg-white shadow-sm max-w-md">
          <h2 className="text-xl font-bold mb-4">Criar nova conta</h2>
          {errorMessage && (
            <p className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
              {errorMessage}
            </p>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Seu Nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border p-2 pr-10 rounded"
                  placeholder="******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs font-semibold"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 font-bold py-2 px-4 rounded hover:bg-yellow-500 text-slate-900"
            >
              Cadastrar
            </button>
            <div className="flex justify-between text-sm pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setIsLoggingIn(true);
                  setShowPassword(false);
                }}
                className="text-indigo-600 hover:underline"
              >
                Já tem conta? Fazer Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setShowPassword(false);
                }}
                className="text-gray-500 hover:underline"
              >
                Voltar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-white shadow-sm max-w-xl">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-yellow-400 font-bold text-3xl flex items-center justify-center rounded text-slate-800">
              4
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-slate-800">
                Olá, visitante.
              </h2>
              <p className="text-sm text-gray-500">
                Entre ou cadastre seus dados para acompanhar pedidos e salvar
                seus produtos favoritos.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsLoggingIn(true)}
                  className="bg-yellow-400 font-bold px-6 py-2 rounded text-slate-900 hover:bg-yellow-500"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setIsRegistering(true)}
                  className="border border-gray-300 font-bold px-4 py-2 rounded text-slate-800 hover:bg-gray-50"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}