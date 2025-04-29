import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50"> {/* <- AQUI! z-50 deixa no topo */}
      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-80 h-96 p-4 flex flex-col justify-between mb-2">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">ChatBot</h2>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <p className="text-gray-600 text-sm">Olá! Como posso ajudar?</p>
          </div>
          <div className="mt-2 flex">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              className="flex-1 border rounded-l-lg p-2 text-sm"
            />
            <button className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 text-sm">
              Enviar
            </button>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
