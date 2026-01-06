import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { UserProfile, StyleConfig } from "@/types/profile";
import { useRef } from "react";

interface BackgroundEditorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: UserProfile;
    onApply: (style: Partial<StyleConfig>) => void;
}

const PREDEFINED_GRADIENTS = [
    "linear-gradient(to bottom right, #6366f1, #a855f7)",
    "linear-gradient(to bottom right, #f472b6, #fb7185)",
    "linear-gradient(to bottom right, #22d3ee, #0ea5e9)",
    "linear-gradient(to bottom right, #34d399, #2dd4bf)",
    "linear-gradient(to bottom right, #fb923c, #facc15)",
    "linear-gradient(to bottom right, #bae6fd, #e0e7ff)",
    "linear-gradient(to bottom right, #fecdd3, #fef3c7)",
    "linear-gradient(to bottom right, #ffedd5, #fee2e2)",
    "linear-gradient(to bottom right, #3b82f6, #2dd4bf)",
    "linear-gradient(to bottom right, #7f1d1d, #f97316)",
    "linear-gradient(to bottom right, #1e1b4b, #312e81)",
    "linear-gradient(to bottom right, #10b981, #059669)",
];

const BackgroundEditorModal = ({ open, onOpenChange, profile, onApply }: BackgroundEditorModalProps) => {
    const [bgType, setBgType] = useState<StyleConfig['backgroundType']>(profile.style?.backgroundType || 'gradient');
    const [bgValue, setBgValue] = useState(profile.style?.backgroundValue || PREDEFINED_GRADIENTS[0]);
    const [solidColor, setSolidColor] = useState(profile.style?.backgroundType === 'color' ? profile.style.backgroundValue : '#1E40AF');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            setBgType(profile.style?.backgroundType || 'gradient');
            setBgValue(profile.style?.backgroundValue || PREDEFINED_GRADIENTS[0]);
            if (profile.style?.backgroundType === 'color') {
                setSolidColor(profile.style.backgroundValue);
            }
        }
    }, [open, profile.style]);

    const handleApply = () => {
        onApply({
            backgroundType: bgType,
            backgroundValue: bgType === 'color' ? solidColor : bgValue,
        });
        onOpenChange(false);
    };

    const handleGradientSelect = (gradient: string) => {
        setBgType('gradient');
        setBgValue(gradient);
    };

    const handleColorChange = (color: string) => {
        setBgType('color');
        setSolidColor(color);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBgType('image');
                setBgValue(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white text-slate-900 border-none max-w-[440px] rounded-[32px] p-6 overflow-hidden">
                <DialogHeader className="flex flex-row items-center justify-between mb-6">
                    <DialogTitle className="text-[#3B82F6] text-xl font-bold font-sans">
                        Editar fundo
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Image Upload */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    <Button
                        variant="outline"
                        className="w-full h-14 border-slate-200 border-dashed rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-5 h-5" />
                        Carregar imagem
                    </Button>

                    {/* Gradients */}
                    <div className="space-y-3">
                        <Label className="text-slate-900 font-semibold text-sm">Escolha um fundo degradê</Label>
                        <div className="grid grid-cols-4 gap-3">
                            {PREDEFINED_GRADIENTS.map((gradient, index) => (
                                <button
                                    key={index}
                                    className={`aspect-square rounded-xl cursor-pointer transition-transform hover:scale-105 border-2 ${bgType === 'gradient' && bgValue === gradient ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent'}`}
                                    style={{ background: gradient }}
                                    onClick={() => handleGradientSelect(gradient)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Solid Color */}
                    <div className="space-y-3">
                        <Label className="text-slate-900 font-semibold text-sm">Escolha a cor do fundo</Label>
                        <div className="flex gap-3">
                            <div
                                className="w-16 h-12 rounded-md border border-slate-200 shadow-sm shrink-0"
                                style={{ backgroundColor: solidColor }}
                            />
                            <Input
                                value={solidColor.toUpperCase()}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-2xl h-12 border-slate-200 text-slate-900 hover:bg-slate-50 font-semibold"
                        >
                            Fechar
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="flex-1 rounded-2xl h-12 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold"
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BackgroundEditorModal;
