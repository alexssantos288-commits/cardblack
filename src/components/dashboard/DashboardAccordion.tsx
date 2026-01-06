import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LucideIcon } from "lucide-react";

interface AccordionSectionProps {
  value: string;
  title: string;
  icon: LucideIcon;
  iconBgColor: string; // Ex: bg-amber-500
  children: React.ReactNode;
}

export const DashboardAccordion = ({ children }: { children: React.ReactNode }) => {
  return (
    <Accordion type="multiple" className="space-y-3 w-full">
      {children}
    </Accordion>
  );
};

export const AccordionSection = ({ value, title, icon: Icon, iconBgColor, children }: AccordionSectionProps) => {
  return (
    <AccordionItem 
      value={value} 
      className="bg-[#1a1a1a] rounded-xl border border-white/5 px-4 mb-3 overflow-hidden"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3">
          {/* Box do Ícone exatamente como na imagem */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          {/* Texto em Uppercase, Bold e Branco */}
          <span className="font-sans font-bold text-white text-sm uppercase tracking-wider">
            {title}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2 border-t border-white/5">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
};