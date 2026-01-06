import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CatalogItem } from "@/types/profile";
import { useState, useEffect } from "react";
import { Plus, Upload, X } from "lucide-react";

interface ProductModalProps {
    item?: CatalogItem | null;
    onSave: (item: CatalogItem) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ProductModal = ({
    item,
    onSave,
    open,
    onOpenChange,
}: ProductModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [buttonText, setButtonText] = useState("Mais informações");
    const [linkType, setLinkType] = useState<"whatsapp" | "custom" | "pix">("custom");
    const [linkUrl, setLinkUrl] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [imageAboveTitle, setImageAboveTitle] = useState(false);

    useEffect(() => {
        if (open) {
            if (item) {
                setName(item.name);
                setDescription(item.description);
                setPrice(item.price);
                setButtonText(item.buttonText);
                setLinkType(item.linkType);
                setLinkUrl(item.linkUrl);
                setImages(item.images || []);
                setImageAboveTitle(item.imageAboveTitle);
            } else {
                setName("");
                setDescription("");
                setPrice("");
                setButtonText("Mais informações");
                setLinkType("custom");
                setLinkUrl("");
                setImages([]);
                setImageAboveTitle(false);
            }
        }
    }, [open, item]);

    const formatCurrency = (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, "");
        // Convert to number and divide by 100 for decimals
        const number = Number(digits) / 100;
        // Format as currency
        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        // Ensure we only process if user is typing numbers or control keys
        // Determine the raw numeric value
        const digits = rawValue.replace(/\D/g, "");
        if (digits === "") {
            setPrice("");
            return;
        }
        const number = Number(digits) / 100;
        const formatted = number.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        setPrice(formatted);
    };

    const handleSave = () => {
        // Basic validation
        if (!name.trim()) {
            // Ideally show error, for now just don't save. 
            // Or we could let it save but its empty. User asked to "make save functional" implying it might not have been
            return;
        }

        onSave({
            id: item?.id || Date.now().toString(),
            name,
            description,
            price: price ? `R$ ${price}` : "", // Ensure R$ prefix if not present, wait formatCurrency adds it? 
            // Helper above `formatted` is just numbers "10,00". No "R$". 
            // The `setPrice` in handlePriceChange sets "10,00".
            // Wait, `toLocaleString` might add currency symbol if style: currency is used. 
            // My `handlePriceChange` uses defaults (just decimals, no symbol) -> "10,00".
            // The Input placeholder is "0,00".
            // The previous logic stored "R$ 0,00".
            // Let's store "R$ 10,00" or just "10,00"? Ideally just the value, but ProfileEditor usually displayed whatever string.
            // I will prepend R$ if it's just numbers.

            buttonText,
            linkType,
            linkUrl,
            images,
            imageAboveTitle,
        });
        onOpenChange(false);
    };

    // Actually, I want the input to show JUST the number "0,00" but maybe with R$ prefix outside?
    // Design has "Real (R$)" label block and "0,00" inside input.
    // So `price` state should hold "10,00".
    // When saving, Profile typically expects string price. I will ensure it saves as "R$ 10,00" for display consistency in catalog list.

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([...images, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const accentColor = "#19e6d5";
    const accentColorBg = "bg-[#19e6d5]";
    const accentColorText = "text-[#19e6d5]";
    const accentBorder = "border-[#19e6d5]";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-[#F8FAFC] dark:bg-card text-foreground p-0 gap-0 rounded-xl border-none">

                {/* Header */}
                <div className="flex flex-col items-center justify-center pt-8 pb-4 space-y-2 text-center bg-white dark:bg-card">
                    <div className={`w-12 h-12 ${accentColorBg} rounded-full flex items-center justify-center shadow-lg shadow-[${accentColor}]/20 mb-1`}>
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                        {item ? "Editar Produto" : "Novo Produto"}
                    </DialogTitle>
                    <p className="text-muted-foreground text-xs px-8">
                        Preencha as informações do produto para adicionar ao catálogo
                    </p>
                </div>

                <div className="p-6 space-y-5 bg-[#F8FAFC] dark:bg-muted/10">

                    {/* Name */}
                    <div className="space-y-1.5">
                        <Label className="font-semibold text-xs text-foreground">Nome do Produto *</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome do produto"
                            className="bg-white dark:bg-background border-border h-9 shadow-sm focus:border-[#19e6d5]"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <Label className="font-semibold text-xs text-foreground">Descrição</Label>
                            <span className="text-[10px] text-muted-foreground">{description.length}/1500</span>
                        </div>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Digite uma breve descrição do produto."
                            className="bg-white dark:bg-background border-border min-h-[80px] shadow-sm resize-none focus:border-[#19e6d5]"
                            maxLength={1500}
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                        <Label className="font-semibold text-xs text-foreground text-gray-500 uppercase tracking-wide">PREÇO</Label>
                        <div className="flex gap-2 items-center">
                            <span className={`text-sm font-bold text-white bg-[#19e6d5] px-3 py-2 rounded-md shadow-md shadow-[#19e6d5]/30`}>R$</span>
                            <Input
                                value={price}
                                onChange={handlePriceChange}
                                placeholder="0,00"
                                className="bg-white dark:bg-background border-border h-9 shadow-sm flex-1 focus:border-[#19e6d5]"
                            />
                        </div>
                    </div>

                    {/* Button Text */}
                    <div className="space-y-1.5">
                        <Label className="font-semibold text-xs text-foreground text-gray-500 uppercase tracking-wide">TEXTO DO BOTÃO</Label>
                        <Input
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            placeholder="Mais informações"
                            className="bg-white dark:bg-background border-border h-9 shadow-sm focus:border-[#19e6d5]"
                        />
                    </div>

                    {/* Link Type */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-xs text-foreground text-gray-500 uppercase tracking-wide">TIPO DE LINK PARA O BOTÃO</Label>
                        <RadioGroup
                            value={linkType}
                            onValueChange={(val: any) => setLinkType(val)}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="whatsapp" id="type-whatsapp" className={`text-[#19e6d5] border-[#19e6d5] focus:ring-[#19e6d5] shadow-sm shadow-[#19e6d5]/20`} />
                                <Label htmlFor="type-whatsapp" className="font-normal text-xs cursor-pointer">WhatsApp</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="custom" id="type-custom" className={`text-[#19e6d5] border-[#19e6d5] focus:ring-[#19e6d5] shadow-sm shadow-[#19e6d5]/20`} />
                                <Label htmlFor="type-custom" className="font-normal text-xs cursor-pointer">Link customizado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="pix" id="type-pix" className={`text-[#19e6d5] border-[#19e6d5] focus:ring-[#19e6d5] shadow-sm shadow-[#19e6d5]/20`} />
                                <Label htmlFor="type-pix" className="font-normal text-xs cursor-pointer">Cobre com PIX</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Link URL */}
                    <div className="space-y-1.5">
                        <Label className="font-semibold text-xs text-foreground">URL do Link</Label>
                        <Input
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://exemplo.com"
                            className="bg-white dark:bg-background border-border h-9 shadow-sm focus:border-[#19e6d5]"
                            disabled={linkType === 'pix'}
                        />
                    </div>

                    {/* Images */}
                    <div className="space-y-3 pt-2">
                        <Label className="font-semibold text-xs text-foreground text-gray-500 uppercase tracking-wide">IMAGENS DO PRODUTO</Label>
                        <p className="text-[10px] text-muted-foreground -mt-1">Você pode adicionar múltiplas imagens.</p>

                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="checkbox"
                                id="img-pos"
                                checked={imageAboveTitle}
                                onChange={(e) => setImageAboveTitle(e.target.checked)}
                                className={`rounded border-gray-300 ${accentColorText} focus:ring-[#19e6d5] shadow-sm shadow-[#19e6d5]/10`}
                            />
                            <Label htmlFor="img-pos" className="font-normal text-xs cursor-pointer">Exibir as imagens acima do título e descrição</Label>
                        </div>

                        <div className={`border-2 border-dashed border-border rounded-xl p-6 bg-white dark:bg-background text-center relative hover:bg-muted/5 transition-colors group`}>
                            <div className="flex flex-col items-center gap-2">
                                <Upload className={`w-6 h-6 ${accentColorText}`} />
                                <span className={`text-xs ${accentColorText} font-medium`}>Clique para adicionar</span>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Preview (Mini) */}
                    <div className="space-y-2 pt-2 border-t border-border/10">
                        <Label className="font-semibold text-xs text-foreground text-gray-500 uppercase tracking-wide">PREVIEW DO PRODUTO</Label>
                        <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm">
                            {imageAboveTitle && images[0] && (
                                <img src={images[0]} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-3" />
                            )}
                            <h3 className="font-bold text-sm text-foreground">{name || "Nome do Produto"}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description || "Descrição do produto"}</p>
                            {!imageAboveTitle && images[0] && (
                                <img src={images[0]} alt="Preview" className="w-full h-32 object-cover rounded-lg mt-3" />
                            )}
                            <div className="mt-3">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full h-8 text-xs text-white border-none shadow-md shadow-[#19e6d5]/20"
                                    style={{ backgroundColor: '#19e6d5' }}
                                >
                                    {buttonText}
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <DialogFooter className="p-4 bg-white dark:bg-card border-t border-border/10 flex justify-end gap-3 sticky bottom-0 z-10">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSave}
                        className={`h-9 text-xs ${accentColorBg} hover:opacity-90 text-white shadow-md shadow-[${accentColor}]/20 border-none`}
                        style={{ backgroundColor: accentColor }}
                    >
                        Salvar Produto
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default ProductModal;
