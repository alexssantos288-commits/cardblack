import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Copy, Check, Facebook, Twitter, Linkedin,
    MessageCircle, Send, Share2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileUrl: string;
    userName: string;
}

export const ShareDialog = ({
    open,
    onOpenChange,
    profileUrl,
    userName,
}: ShareDialogProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success("Link copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: MessageCircle,
            color: "bg-[#25D366]",
            url: `https://wa.me/?text=${encodeURIComponent(`Confira meu cartão digital: ${profileUrl}`)}`,
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "bg-[#1877F2]",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "bg-[#1DA1F2]",
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Confira meu cartão digital: ${profileUrl}`)}`,
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            color: "bg-[#0A66C2]",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
        },
        {
            name: "Telegram",
            icon: Send,
            color: "bg-[#0088CC]",
            url: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(`Confira meu cartão digital`)}`,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card border-border/50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        Compartilhar Perfil
                    </DialogTitle>
                    <DialogDescription>
                        Compartilhe seu cartão digital com seus contatos e redes sociais.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Social Icons Grid */}
                    <div className="grid grid-cols-5 gap-3">
                        {shareOptions.map((option) => (
                            <a
                                key={option.name}
                                href={option.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                                    <option.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground">{option.name}</span>
                            </a>
                        ))}
                    </div>

                    {/* Copy Link Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link do Perfil</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={profileUrl}
                                className="bg-muted/50 border-border h-11 text-sm"
                            />
                            <Button
                                variant="default"
                                className="shrink-0 h-11 w-11 p-0 rounded-xl"
                                onClick={handleCopy}
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
