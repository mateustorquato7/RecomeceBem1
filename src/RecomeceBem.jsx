import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
export default function RecomeceBem(){
  const [view,setView]=useState("home");
  const [messages,setMessages]=useState(()=> JSON.parse(localStorage.getItem("rb_chat"))|| [{from:"bot", text:"Olá — sou o assistente RecomeceBem. Como posso ajudar?"}]);
  const inputRef=useRef();
  useEffect(()=> localStorage.setItem("rb_chat", JSON.stringify(messages)), [messages]);
  async function send(msg){
    if(!msg) return;
    setMessages(m=>[...m, {from:"user", text:msg}]);
    inputRef.current.value="";
    try{
      const res = await axios.post('/api/chat', { message: msg });
      const reply = res.data?.reply || "Desculpe, não consegui responder agora.";
      setMessages(m=>[...m, {from:"bot", text:reply}]);
    }catch(e){
      setMessages(m=>[...m, {from:"bot", text:"Erro de conexão com o serviço de IA."}]);
    }
  }
  async function checkout(){
    try{
      const res = await axios.post('/api/create-checkout-session', { plan: 'premium' });
      if(res.data?.url) window.location.href = res.data.url;
      else alert("Erro ao iniciar o checkout.");
    }catch(e){
      alert("Erro no checkout. Confira variáveis de ambiente no Vercel.");
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold">RB</div>
            <div>
              <h1 className="text-2xl font-bold">RecomeceBem</h1>
              <div className="text-sm text-gray-500">Apoio emocional com IA</div>
            </div>
          </div>
          <nav className="hidden md:flex gap-3">
            <button onClick={()=>setView('home')} className="px-3 py-2 rounded hover:bg-gray-100">Início</button>
            <button onClick={()=>setView('chat')} className="px-3 py-2 rounded hover:bg-gray-100">Apoio IA</button>
            <button onClick={()=>setView('daily')} className="px-3 py-2 rounded hover:bg-gray-100">Dicas</button>
            <button onClick={()=>checkout()} className="px-3 py-2 bg-indigo-600 text-white rounded">Assinar</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        {view==='home' && (
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold">Seja bem-vindo ao RecomeceBem</h2>
              <p className="mt-2 text-gray-600">Espaço seguro com ferramentas para ansiedade, pânico e depressão.</p>
              <div className="mt-4 flex gap-3">
                <button onClick={()=>setView('chat')} className="px-4 py-2 bg-indigo-600 text-white rounded">Conversar com IA</button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow">
              <h3 className="font-semibold">Acompanhamento</h3>
              <p className="mt-2 text-gray-600">Registre seu humor e acompanhe seu progresso.</p>
            </div>
          </section>
        )}
        {view==='chat' && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">Apoio por IA — Conselheiro empático</h2>
            <div className="mt-4 border rounded p-4 max-h-96 overflow-auto">
              {messages.map((m,i)=>(
                <div key={i} className={`mb-3 ${m.from==='bot' ? 'text-left' : 'text-right'}`}>
                  <div className={`inline-block p-3 rounded-lg ${m.from==='bot' ? 'bg-gray-100' : 'bg-indigo-600 text-white'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input ref={inputRef} className="flex-1 p-2 border rounded" placeholder="Escreva aqui..." />
              <button onClick={()=>send(inputRef.current?.value)} className="px-4 py-2 bg-indigo-600 text-white rounded">Enviar</button>
            </div>
            <p className="mt-3 text-xs text-gray-500">Aviso: em risco procure ajuda imediata.</p>
          </section>
        )}
        {view==='daily' && (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold">Dicas e Exercícios</h2>
            <ul className="mt-3 list-disc list-inside text-gray-700">
              <li>Respiração 4-4-4</li>
              <li>Grounding 5-4-3-2-1</li>
              <li>Higiene do sono</li>
            </ul>
          </section>
        )}
      </main>
      <footer className="text-center text-sm text-gray-500 p-6">© {new Date().getFullYear()} RecomeceBem — não substitui avaliação clínica.</footer>
    </div>
  );
}
