import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Users, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 gradient-dark" />
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />

    <div className="container relative z-10 px-4 py-20">
      <div className="max-w-4xl mx-auto text-center animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            INTEGRETY TAG
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
          Seu cartão de visita{" "}
          digital
          em um toque
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Crie, personalize e compartilhe seu perfil profissional com tecnologia NFC.
          Impressione seus contatos com um cartão que nunca fica desatualizado.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <Button variant="hero" size="xl" onClick={() => navigate('/login')}>
            Criar meu cartão
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
              10k+
            </div>
            <div className="text-sm text-muted-foreground">Usuários ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
              50k+
            </div>
            <div className="text-sm text-muted-foreground">Cartões criados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
              99%
            </div>
            <div className="text-sm text-muted-foreground">Satisfação</div>
          </div>
        </div>
      </div>

      {/* Floating Cards Preview */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="relative">
          <div className="w-64 h-80 rounded-2xl glass shadow-card rotate-12 animate-float" />
          <div className="w-64 h-80 rounded-2xl gradient-primary shadow-glow absolute top-8 -left-8 -rotate-6 animate-float" style={{
            animationDelay: '1s'
          }} />
        </div>
      </div>
    </div>
  </section>;
};
export default HeroSection;