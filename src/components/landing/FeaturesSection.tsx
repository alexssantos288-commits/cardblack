import { Smartphone, Palette, Share2, Zap, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Design otimizado para todos os dispositivos. Seu cartão fica perfeito em qualquer tela.",
  },
  {
    icon: Palette,
    title: "Personalização Total",
    description: "Cores, fontes, layout e muito mais. Deixe seu cartão com a sua cara.",
  },
  {
    icon: Share2,
    title: "Compartilhe Fácil",
    description: "NFC, QR Code, link direto. Várias formas de compartilhar seu perfil.",
  },
  {
    icon: Zap,
    title: "Atualização Instantânea",
    description: "Mudou de cargo? Atualize uma vez e todos veem a nova versão.",
  },
  {
    icon: Shield,
    title: "Seguro e Privado",
    description: "Você controla o que aparece e quem pode ver suas informações.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Saiba quantas vezes seu cartão foi visualizado e quais links foram clicados.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tudo que você precisa
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recursos poderosos para criar o cartão de visita digital perfeito
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
