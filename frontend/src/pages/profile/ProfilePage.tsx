import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../shared/lib/supabase';

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
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const loggedUser: User = {
        id: session.user.id,
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
        email: session.user.email || '',
        role: (session.user.user_metadata?.role as 'CLIENT' | 'EMPLOYEE' | 'ADMIN') || 'CLIENT',
      };

      // Guarda no localStorage para os outros componentes (HomePage, ProductCard) lerem o cargo
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
    } else {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
      }

      if (data.user) {
        const loggedUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Usuário',
          email: data.user.email || '',
          role: (data.user.user_metadata?.role as 'CLIENT' | 'EMPLOYEE' | 'ADMIN') || 'CLIENT',
        };

        // Salva localmente e atualiza o estado
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        setIsLoggingIn(false);
        setEmail('');
        setPassword('');
        setShowPassword(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar login.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // 1. Cria a conta no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'CLIENT',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // 2. Salva os dados na tabela pública de utilizadores para gestão
      if (data.user) {
        await supabase.from('users').upsert([
          {
            id: data.user.id,
            name: name,
            email: email,
            role: 'CLIENT',
          },
        ]);
      }

      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      setIsRegistering(false);
      setIsLoggingIn(true);
      setName('');
      setPassword('');
      setShowPassword(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar cadastro.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('4cores_user');
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

          <div className="pt-4 border-t flex flex-wrap gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
            >
              Sair da Conta
            </button>

            {(user.role === 'EMPLOYEE' || user.role === 'ADMIN') && (
              <Link
                to="/historico-pedidos"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded inline-block"
              >
                📋 Histórico de Compras
              </Link>
            )}

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