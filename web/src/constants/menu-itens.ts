import { BarChart, Car, Heart, Home, MessageCircle, Users } from "lucide-react";

export const menuItems = [
  {
    title: 'Início',
    icon: Home,
    href: '/dashboard'
  },
  {
    title: 'Analytics',
    icon: BarChart,
    href: '/admin'
  },
  {
    title: 'Veículos',
    icon: Car,
    href: '/cars'
  },
  {
    title: 'Mensagens',
    icon: Heart,
    href: '/messages'
  },
  {
    title: 'Clientes',
    icon: Users,
    href: '/admin/customers'
  },
  {
    title: 'Templates',
    icon: MessageCircle,
    href: '/messages/templates'
  }
];
