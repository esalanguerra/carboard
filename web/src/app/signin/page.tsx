import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { JSX } from 'react';

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center justify-center">
          {/* <Logo /> */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Bem-vindo ao CarBoard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistema inteligente de gestão de carros
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200 transform hover:scale-105"
          >
            Entrar
          </Button>

          <div className="flex items-center justify-center my-4">
            <div className="h-px w-full bg-gray-300" />
            <span className="px-2 text-sm text-gray-500 font-medium">ou</span>
            <div className="h-px w-full bg-gray-300" />
          </div>

          <Button
            type="button"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-200 transform hover:scale-105"
          >
            Entrar com Google
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Sistema privado da CarBoard</p>
          <p className="text-xs">2024 CarBoard. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
