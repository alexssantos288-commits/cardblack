import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserProfile, FormField } from "@/types/profile";
import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, CheckCircle2 } from "lucide-react";

interface ContactFormModalProps {
    profile: UserProfile;
    onProfileChange: (profile: UserProfile) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ContactFormModal = ({
    profile,
    onProfileChange,
    open,
    onOpenChange,
}: ContactFormModalProps) => {
    const [title, setTitle] = useState(profile.contactForm?.title || "Fale Conosco");
    const [fields, setFields] = useState<FormField[]>(profile.contactForm?.fields || []);
    const [receiveNotifications, setReceiveNotifications] = useState(
        profile.contactForm?.receiveNotifications || false
    );
    const [selectedFieldType, setSelectedFieldType] = useState("Nome");

    // Accent color from user request
    const accentColor = "#19e6d5";
    const accentColorBg = "bg-[#19e6d5]";
    const accentColorText = "text-[#19e6d5]";
    const accentBorder = "border-[#19e6d5]";

    // Reset state when modal opens with fresh data from profile
    useEffect(() => {
        if (open) {
            setTitle(profile.contactForm?.title || "Fale Conosco");
            setFields(profile.contactForm?.fields || []);
            setReceiveNotifications(profile.contactForm?.receiveNotifications || false);
        }
    }, [open, profile.contactForm]);

    const handleSave = () => {
        onProfileChange({
            ...profile,
            contactForm: {
                ...profile.contactForm,
                title,
                fields,
                receiveNotifications,
                enabled: true, // Auto-enable when saving settings
            },
        });
        onOpenChange(false);
    };

    const handleAddField = () => {
        const newField: FormField = {
            id: Date.now().toString(),
            type: "text",
            label: selectedFieldType,
            placeholder: "",
            required: false,
            enabled: true,
        };

        if (selectedFieldType === 'Nome') {
            newField.label = 'Nome';
            newField.id = 'name_' + Date.now();
        } else if (selectedFieldType === 'E-mail') {
            newField.label = 'E-mail';
            newField.type = 'email';
            newField.id = 'email_' + Date.now();
        } else if (selectedFieldType === 'Telefone') {
            newField.label = 'Telefone';
            newField.type = 'tel';
            newField.id = 'phone_' + Date.now();
        } else if (selectedFieldType === 'Mensagem') {
            newField.label = 'Mensagem';
            newField.type = 'textarea';
            newField.id = 'message_' + Date.now();
        }

        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter((f) => f.id !== id));
    };

    const toggleRequired = (id: string) => {
        setFields(
            fields.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-[#F8FAFC] dark:bg-card text-foreground p-0 gap-0 overflow-hidden rounded-xl border-none">
                {/* Header */}
                <div className="flex flex-col items-center justify-center pt-8 pb-6 space-y-2 text-center bg-white dark:bg-card">
                    <div className={`w-14 h-14 ${accentColorBg} rounded-full flex items-center justify-center shadow-lg shadow-[${accentColor}]/20 mb-2`}>
                        <Pencil className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        Editar Formulário
                    </DialogTitle>
                    <p className="text-muted-foreground text-sm">
                        Configure os campos e opções do seu formulário de contato
                    </p>
                </div>

                <div className="p-8 space-y-8 bg-[#F8FAFC] dark:bg-muted/10">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="form-title" className="font-semibold text-foreground">
                            Título
                        </Label>
                        <Input
                            id="form-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`bg-white dark:bg-background border-border shadow-sm h-11 focus:border-[${accentColor}]`}
                        />
                    </div>

                    {/* Fields Management */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="font-semibold text-foreground">Campos do Formulário</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={selectedFieldType}
                                    onValueChange={setSelectedFieldType}
                                >
                                    <SelectTrigger className="w-[140px] bg-white dark:bg-background border-border h-10 shadow-sm">
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Nome">Nome</SelectItem>
                                        <SelectItem value="E-mail">E-mail</SelectItem>
                                        <SelectItem value="Telefone">Telefone</SelectItem>
                                        <SelectItem value="Mensagem">Mensagem</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleAddField}
                                    variant="default"
                                    size="sm"
                                    className={`gap-2 h-10 ${accentColorBg} hover:opacity-90 text-white shadow-md shadow-[${accentColor}]/20 border-none`}
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <Plus className="w-4 h-4" /> Adicionar
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-end px-4 text-xs font-medium text-muted-foreground mb-2">
                                <span className="mr-8">Campo obrigatório?</span>
                                <span>Ações</span>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field) => (
                                    <div
                                        key={field.id}
                                        className={`flex items-center justify-between p-4 bg-[${accentColor}]/5 dark:bg-muted/30 border border-[${accentColor}]/20 dark:border-border rounded-xl`}
                                    >
                                        <span className="font-medium text-foreground pl-2">{field.label}</span>

                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => toggleRequired(field.id)}
                                                className="mr-8 focus:outline-none"
                                            >
                                                {field.required ? (
                                                    <CheckCircle2 className={`w-6 h-6 ${accentColorText} fill-none stroke-[1.5]`} />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 hover:border-primary transition-colors" />
                                                )}
                                            </button>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeField(field.id)}
                                                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4 pt-6 text-sm">
                        <Label className="text-sm font-medium text-foreground block mb-3">
                            Deseja receber um e-mail informando sempre que alguém se cadastrar em seu formulário?
                        </Label>
                        <RadioGroup
                            value={receiveNotifications ? "yes" : "no"}
                            onValueChange={(val) => setReceiveNotifications(val === "yes")}
                            className="space-y-3"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="notify-yes" className={`border-[${accentColor}] text-[${accentColor}]`} />
                                <Label htmlFor="notify-yes" className="text-foreground font-normal cursor-pointer">Quero receber</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="notify-no" className={`border-[${accentColor}] text-[${accentColor}]`} />
                                <Label htmlFor="notify-no" className="text-foreground font-normal cursor-pointer">Não quero receber</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 bg-white dark:bg-card border-t border-border/10 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-6">
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSave}
                        className={`h-10 px-6 ${accentColorBg} hover:opacity-90 text-white shadow-md shadow-[${accentColor}]/20 border-none`}
                        style={{ backgroundColor: accentColor }}
                    >
                        Salvar formulário
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ContactFormModal;
