'use client';

import { useState } from 'react';

export default function Page() {
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <h1>Envie uma mensagem no WhatsApp</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phone">Telefone (com código do país):</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: 5511999999999"
            required
          />
        </div>
        <div>
          <label htmlFor="message">Mensagem:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem"
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
