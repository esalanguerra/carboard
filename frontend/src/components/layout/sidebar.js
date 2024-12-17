'use client';

import Link from 'next/link';
import {
  Car,
  BarChart,
  Home,
  FileText,
  Shield,
  LogOut
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  {
    title: 'Início',
    icon: Home,
    href: '/dashboard'
  },
  {
    title: 'Analytics',
    icon: BarChart,
    href: '/analytics'
  },
  {
    title: 'Veículos',
    icon: Car,
    href: '/veiculos'
  },
];

const legalItems = [
  {
    title: 'Termos de Uso',
    icon: FileText,
    href: '/termos-de-uso'
  },
  {
    title: 'Política de Privacidade',
    icon: Shield,
    href: '/politica-de-privacidade'
  }
];


export default function Sidebar() {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <aside className="fixed left-4 top-4 z-40 h-[calc(100vh-32px)] w-64 rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-sm text-white shadow-xl">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-zinc-800/50">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CarBoard
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  'hover:bg-zinc-800/50 hover:text-white hover:translate-x-1',
                  isActive
                    ? 'bg-zinc-800/50 text-white'
                    : 'text-zinc-400'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-zinc-800/50 space-y-2">
          {legalItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                'hover:bg-zinc-800/50 hover:text-white hover:translate-x-1',
                pathname === item.href ? 'bg-zinc-800/50 text-white' : 'text-zinc-400'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-all duration-200 hover:translate-x-1"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  )
}