import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserProfile, StyleConfig } from "@/types/profile";
import { Paintbrush, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import StyleEditorModal from "./StyleEditorModal";
import BackgroundEditorModal from "./BackgroundEditorModal";
import { useState } from "react";

interface PersonalizationModalProps {
    profile: UserProfile;
    onProfileChange: (profile: UserProfile) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const PersonalizationModal = ({ profile, onProfileChange, open, onOpenChange }: PersonalizationModalProps) => {
    const [styleOpen, setStyleOpen] = useState(false);
    const [backgroundOpen, setBackgroundOpen] = useState(false);

    const handleStyleApply = (styleUpdate: Partial<StyleConfig>) => {
        onProfileChange({
            ...profile,
            style: {
                ...profile.style,
                ...styleUpdate
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-card border-border/50 max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl font-bold">Controles de Personalização</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Main Actions */}
                    <div className="space-y-3">
                        <Button
                            className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-900/20 text-lg font-medium"
                            onClick={() => setStyleOpen(true)}
                        >
                            <Paintbrush className="w-5 h-5 mr-2" />
                            Editar Estilo
                        </Button>

                        <Button
                            className="w-full h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-900/20 text-lg font-medium"
                            onClick={() => setBackgroundOpen(true)}
                        >
                            <ImageIcon className="w-5 h-5 mr-2" />
                            Editar Fundo
                        </Button>
                    </div>

                    <StyleEditorModal
                        open={styleOpen}
                        onOpenChange={setStyleOpen}
                        profile={profile}
                        onApply={handleStyleApply}
                    />

                    <BackgroundEditorModal
                        open={backgroundOpen}
                        onOpenChange={setBackgroundOpen}
                        profile={profile}
                        onApply={handleStyleApply}
                    />

                    {/* Current Settings Summary */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-4 border border-border/50">
                        <h3 className="font-semibold text-foreground">Configurações Atuais</h3>

                        <div className="space-y-3">
                            <div
                                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded-lg transition-colors"
                                onClick={() => setStyleOpen(true)}
                            >
                                <span className="text-sm text-muted-foreground">Cor dos itens:</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border border-border"
                                        style={{ backgroundColor: profile.style?.itemColor || '#2d295a' }}
                                    />
                                    <span className="text-sm font-mono text-foreground uppercase">
                                        {profile.style?.itemColor || '#2d295a'}
                                    </span>
                                </div>
                            </div>

                            <div
                                className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-1 rounded-lg transition-colors"
                                onClick={() => setStyleOpen(true)}
                            >
                                <span className="text-sm text-muted-foreground">Cor dos textos:</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-full border border-border"
                                        style={{ backgroundColor: profile.style?.textColor || '#ffffff' }}
                                    />
                                    <span className="text-sm font-mono text-foreground uppercase">
                                        {profile.style?.textColor || '#ffffff'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Opacidade:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {profile.style?.opacity || 100}%
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Cantos:</span>
                                <span className="text-sm font-medium text-foreground">
                                    {profile.style?.borderRadius || '12px'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Tipo de fundo:</span>
                                <span className="text-sm font-medium text-foreground capitalize">
                                    {profile.style?.backgroundType || 'Gradiente'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PersonalizationModal;
