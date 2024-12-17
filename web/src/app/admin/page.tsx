'use client';

import { useState, useEffect, JSX } from "react";
import LayoutDefault from "@/src/components/layout/default";
import Footer from "@/src/components/layout/footer";
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Car, MessageCircle, Bot, Smile, Paperclip, Send } from 'lucide-react';

export default function Page(): JSX.Element {
  return (
    <LayoutDefault>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 tracking-tight">Painel de Controle</h1>
      <Footer />
    </LayoutDefault>
  );
}
