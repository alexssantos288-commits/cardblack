import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomLink } from "@/types/profile";
import {
    Globe, ShoppingBag, Utensils, MapPin, DollarSign, Send, Award,
    Facebook, Instagram, Mail, Info, Wifi, MessageCircle, Phone, Scale,
    Home, Music, GlassWater, BriefcaseMedical, Scissors, Calendar, FileText, Twitter,
    Gift, Music2, Disc, Clock, Star, Camera, Linkedin, Youtube, Link as LinkIcon, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomLinkModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (link: CustomLink) => void;
    editingLink?: CustomLink | null;
}

const iconOptions = [
    { id: "None", icon: null, label: "Sem ícone" },
    { id: "Globe", icon: Globe },
    { id: "ShoppingBag", icon: ShoppingBag },
    { id: "Utensils", icon: Utensils },
    { id: "MapPin", icon: MapPin },
    { id: "DollarSign", icon: DollarSign },
    { id: "Send", icon: Send },
    { id: "Award", icon: Award },
    { id: "Facebook", icon: Facebook },
    { id: "Instagram", icon: Instagram },
    { id: "Mail", icon: Mail },
    { id: "Info", icon: Info },
    { id: "Wifi", icon: Wifi },
    { id: "MessageCircle", icon: MessageCircle },
    { id: "Phone", icon: Phone },
    { id: "Scale", icon: Scale },
    { id: "Home", icon: Home },
    { id: "Music", icon: Music },
    { id: "GlassWater", icon: GlassWater },
    { id: "BriefcaseMedical", icon: BriefcaseMedical },
    { id: "Scissors", icon: Scissors },
    { id: "Calendar", icon: Calendar },
    { id: "FileText", icon: FileText },
    { id: "Twitter", icon: X },
    { id: "Gift", icon: Gift },
    { id: "Music2", icon: Music2 },
    { id: "Disc", icon: Disc },
    { id: "Clock", icon: Clock },
    { id: "Star", icon: Star },
    { id: "Camera", icon: Camera },
    { id: "Linkedin", icon: Linkedin },
    { id: "Youtube", icon: Youtube },
];

const CustomLinkModal = ({ open, onOpenChange, onSave, editingLink }: CustomLinkModalProps) => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("None");

    useEffect(() => {
        if (open) {
            if (editingLink) {
                setTitle(editingLink.title);
                setUrl(editingLink.url);
                setSelectedIcon(editingLink.icon || "None");
            } else {
                setTitle("");
                setUrl("");
                setSelectedIcon("None");
            }
        }
    }, [open, editingLink]);

    const handleSave = () => {
        onSave({
            id: editingLink?.id || Date.now().toString(),
            title,
            url,
            icon: selectedIcon,
            linkIconOnly: editingLink?.linkIconOnly || false
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white text-slate-900 border-none max-w-4xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-slate-800 text-xl font-bold uppercase tracking-tight">
                        CADASTRAR NOVO LINK
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-slate-500 text-sm">Título</Label>
                                <span className="text-xs text-slate-400">{title.length}/50</span>
                            </div>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                                className="h-12 border-slate-200 focus:ring-blue-500 rounded-lg bg-slate-50"
                                placeholder="Ex: Meu Site"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-500 text-sm">Link <span className="text-slate-300 text-[10px]">(é possível salvar um link, email ou número de telefone)</span></Label>
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="h-12 border-slate-200 focus:ring-blue-500 rounded-lg bg-slate-50"
                                placeholder="https://exemplo.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-slate-500 text-sm">Ícone do botão (ficará ao lado do título)</Label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {iconOptions.map((option) => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedIcon(option.id)}
                                        className={cn(
                                            "aspect-video md:aspect-square flex flex-col items-center justify-center gap-1 rounded-lg border-2 transition-all p-2 group",
                                            selectedIcon === option.id
                                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                                : "border-slate-100 hover:border-slate-300 bg-white"
                                        )}
                                    >
                                        {Icon ? (
                                            <Icon className={cn(
                                                "w-5 h-5",
                                                selectedIcon === option.id ? "text-blue-500" : "text-slate-600 group-hover:text-slate-800"
                                            )} />
                                        ) : (
                                            <span className="text-[10px] font-medium text-slate-500 text-center leading-tight">Sem ícone</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-40 rounded-lg h-10 border-blue-400 text-blue-500 hover:bg-blue-50 font-medium"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="w-40 rounded-lg h-10 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                            disabled={!title}
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CustomLinkModal;
