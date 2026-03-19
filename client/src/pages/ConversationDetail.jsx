import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, CheckCheck, Bot, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');

function MessageBubble({ msg }) {
  const isOutbound = msg.direction === 'outbound';
  const isAI = msg.senderType === 'ai' || msg.senderType === 'system';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOutbound && (
        <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
          <User className="w-4 h-4 text-slate-500" />
        </div>
      )}
      <div className={`max-w-xs lg:max-w-md ${isOutbound ? 'order-first' : ''}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
          isOutbound
            ? isAI
              ? 'bg-slate-700 text-white rounded-br-sm'
              : 'bg-yellow-400 text-slate-900 rounded-br-sm'
            : 'bg-white border border-slate-100 text-slate-800 rounded-bl-sm shadow-sm'
        }`}>
          {isAI && isOutbound && (
            <div className="flex items-center gap-1 mb-1 opacity-70">
              <Bot className="w-3 h-3" />
              <span className="text-xs">AI</span>
            </div>
          )}
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>
        <p className={`text-xs text-slate-400 mt-1 ${isOutbound ? 'text-right' : 'text-left'}`}>
          {new Date(msg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          {isOutbound && msg.status === 'read' && <CheckCheck className="inline w-3 h-3 ml-1 text-blue-400" />}
        </p>
      </div>
    </div>
  );
}

export default function ConversationDetail() {
  const { id } = useParams();
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => axios.get(`${API}/conversations/${id}`, {
      headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.data),
    refetchInterval: 5000, // Actualizar cada 5 segundos
  });

  const replyMutation = useMutation({
    mutationFn: (message) => axios.post(`${API}/conversations/${id}/reply`,
      { message },
      { headers: { Authorization: `Bearer ${token()}` } }
    ),
    onSuccess: () => {
      setReplyText('');
      queryClient.invalidateQueries(['conversation', id]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data?.messages]);

  const contact = data?.contact || data?.conversation?.contact;

  return (
    <div className="flex h-full">
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4">
          <Link to="/conversations" className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {(contact?.name || contact?.whatsappNumber || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{contact?.name || contact?.whatsappNumber}</p>
            <p className="text-xs text-slate-400 capitalize">{contact?.type} · {contact?.whatsappNumber}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {isLoading ? (
            <div className="text-center text-slate-400 py-8">Cargando mensajes...</div>
          ) : (
            <>
              {data?.messages?.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Reply box */}
        <div className="bg-white border-t border-slate-100 p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (replyText.trim()) replyMutation.mutate(replyText.trim());
                }
              }}
              placeholder="Escribe un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              className="flex-1 resize-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 max-h-32"
              rows={1}
            />
            <button
              onClick={() => replyText.trim() && replyMutation.mutate(replyText.trim())}
              disabled={!replyText.trim() || replyMutation.isPending}
              className="p-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contact sidebar */}
      <div className="w-72 bg-white border-l border-slate-100 p-6 overflow-y-auto hidden lg:block">
        <h3 className="font-semibold text-slate-800 mb-4">Información del contacto</h3>
        {contact && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Nombre</p>
              <p className="text-slate-800 font-medium">{contact.name || '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">WhatsApp</p>
              <p className="text-slate-800">{contact.whatsappNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Tipo</p>
              <span className="capitalize bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">
                {contact.type}
              </span>
            </div>
            {contact.planType && (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Plan</p>
                <p className="text-slate-800">{contact.planType}</p>
              </div>
            )}
            {contact.insuranceCompany && (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Aseguradora</p>
                <p className="text-slate-800">{contact.insuranceCompany}</p>
              </div>
            )}
            {contact.paymentAmount && (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Pago mensual</p>
                <p className="text-slate-800 font-semibold">${contact.paymentAmount}</p>
              </div>
            )}
          </div>
        )}

        {/* Tareas */}
        {data?.tasks?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-slate-800 mb-3">Tareas</h3>
            <div className="space-y-2">
              {data.tasks.map(task => (
                <div key={task.id} className={`p-3 rounded-lg text-xs border ${
                  task.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'
                }`}>
                  <p className="font-medium text-slate-700">{task.title}</p>
                  <p className="text-slate-400 mt-0.5 capitalize">{task.type} · {task.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
