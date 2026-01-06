import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 1. Importe o navegador
import { toast } from "sonner"; // 2. Importe para o aviso de sucesso

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 3. Inicialize o navegador

  // 4. Função que processa o login e faz a "viagem"
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples: se houver algo escrito, ele entra
    if (email.length > 3 && password.length > 3) {
      toast.success("Acesso autorizado! Bem-vindo.");
      
      // Pequeno atraso para o usuário ver o feedback antes de mudar de tela
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } else {
      toast.error("Por favor, insira um e-mail e senha válidos.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 font-sans">
      {/* Efeito de luz de fundo (Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#1ccec8] blur-[180px] opacity-5 pointer-events-none"></div>

      <div className="w-full max-w-[440px] z-10">
        {/* Logo e Cabeçalho */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1ccec8] rounded-full mb-6 shadow-[0_0_30px_rgba(28,206,200,0.3)]">
            <span className="text-black font-black text-3xl">N</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-500 font-medium">
            Acesse seu painel NFCard Digital
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-[#1a1a1a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          {/* 5. Conectamos a função handleLogin ao formulário */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                E-mail
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#1ccec8] transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#1ccec8]/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Senha
                </label>
                <a href="#" className="text-[10px] font-bold text-[#1ccec8] uppercase tracking-widest hover:underline">
                  Esqueceu?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#1ccec8] transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-[#1ccec8]/50 transition-all"
                />
              </div>
            </div>

            {/* 6. O botão agora é do tipo submit para disparar a função */}
            <button 
              type="submit"
              className="w-full h-14 bg-[#1ccec8] hover:bg-[#18b5b0] text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            >
              Entrar na conta
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold">
              <span className="bg-[#1a1a1a] px-4 text-gray-600 tracking-widest">Ou continue com</span>
            </div>
          </div>

          {/* Login Social */}
          <button className="w-full h-14 bg-transparent border border-white/5 hover:bg-white/5 text-white font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all">
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        {/* Rodapé do Login */}
        <p className="text-center mt-8 text-gray-500 text-sm">
          Não tem uma conta?{" "}
          <a href="#" className="text-[#1ccec8] font-bold hover:underline">
            Criar agora grátis
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;