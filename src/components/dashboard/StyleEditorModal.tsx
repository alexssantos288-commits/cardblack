import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { UserProfile, StyleConfig } from "@/types/profile";
import ColorPicker from 'react-best-gradient-color-picker';

interface StyleEditorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: UserProfile;
    onApply: (style: Partial<StyleConfig>) => void;
}

const StyleEditorModal = ({ open, onOpenChange, profile, onApply }: StyleEditorModalProps) => {
    const [itemColor, setItemColor] = useState(profile.style?.itemColor || "#4F46E5");
    const [textColor, setTextColor] = useState(profile.style?.textColor || "#FFFFFF");
    const [opacity, setOpacity] = useState(profile.style?.opacity || 100);
    const [borderRadius, setBorderRadius] = useState(parseInt(profile.style?.borderRadius || "14"));

    // Track which color we are currently picking: 'item' or 'text'
    const [activeTab, setActiveTab] = useState<'item' | 'text'>('item');

    useEffect(() => {
        if (open) {
            setItemColor(profile.style?.itemColor || "#4F46E5");
            setTextColor(profile.style?.textColor || "#FFFFFF");
            setOpacity(profile.style?.opacity || 100);
            setBorderRadius(parseInt(profile.style?.borderRadius || "14"));
        }
    }, [open, profile.style]);

    const handleApply = () => {
        onApply({
            itemColor,
            textColor,
            opacity: opacity,
            borderRadius: `${borderRadius}px`,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white text-slate-900 border-none max-w-[420px] rounded-[40px] p-0 overflow-hidden shadow-2xl">
                <div className="p-8 space-y-8">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <DialogTitle className="text-[#3B82F6] text-2xl font-bold font-sans tracking-tight">
                            Personalizar Estilo
                        </DialogTitle>
                    </DialogHeader>

                    {/* Color Picker Section */}
                    <div className="space-y-6">
                        <div className="flex bg-slate-100 p-1 rounded-2xl">
                            <button
                                onClick={() => setActiveTab('item')}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'item' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Cor dos Itens
                            </button>
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Cor dos Textos
                            </button>
                        </div>

                        <div className="flex justify-center bg-white rounded-3xl p-1 shadow-inner border border-slate-50">
                            <ColorPicker
                                value={activeTab === 'item' ? itemColor : textColor}
                                onChange={activeTab === 'item' ? setItemColor : setTextColor}
                                hideControls={false}
                                hideInputs={false}
                                hidePresets={true}
                                hideOpacity={true} // We have a separate slider for global opacity
                                width={320}
                                height={200}
                                style={{
                                    borderRadius: '24px',
                                }}
                            />
                        </div>
                    </div>

                    {/* Sliders Section */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-slate-900 font-bold text-xs uppercase tracking-widest opacity-60">Opacidade</Label>
                                <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-lg text-sm">{opacity}%</span>
                            </div>
                            <Slider
                                value={[opacity]}
                                onValueChange={(vals) => setOpacity(vals[0])}
                                max={100}
                                step={1}
                                className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:shadow-lg"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-slate-900 font-bold text-xs uppercase tracking-widest opacity-60">Cantos (bordas)</Label>
                                <span className="text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded-lg text-sm">{borderRadius}px</span>
                            </div>
                            <Slider
                                value={[borderRadius]}
                                onValueChange={(vals) => setBorderRadius(vals[0])}
                                max={40}
                                step={1}
                                className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:bg-blue-500 [&_[role=slider]]:shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-2xl h-14 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-widest transition-all"
                        >
                            Fechar
                        </Button>
                        <Button
                            onClick={handleApply}
                            className="flex-1 rounded-[24px] h-14 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/30 text-sm uppercase tracking-widest transition-all active:scale-95"
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StyleEditorModal;
