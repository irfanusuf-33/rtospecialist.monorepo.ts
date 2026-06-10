import Image from "next/image";
import type { StaticImageData } from "next/image";
interface Card {
    id: string;
    name: string;
    brand: string;
    last4: string;
    month: string;
    year: string;
}

type CardBrand = 'visa' | 'mastercard' | 'americanexp' | 'jcb';

interface PaymentMethodsProps {
    card: Card;
    cardType: Record<CardBrand, StaticImageData>;
    handleCard: (e: React.MouseEvent<HTMLElement>) => void;
    toBeChargedCard: string;
}

export default function PaymentMethods ({ card, cardType, handleCard, toBeChargedCard }: PaymentMethodsProps) {

    return (
        <div className={`method-container ${toBeChargedCard === card.id && 'card-selected'} `} data-pid={card.id} onClick={handleCard}>
            <div className="method-header">
                <p className="heading">{card.name}</p>
                <Image src={cardType[card.brand as CardBrand]} alt="card img" className="header-img" width={44} height={28} />
            </div>
            <div className="method-body">
                <p className="body-text">**** **** **** <span>{ card.last4 }</span></p>
                <p className="body-text">{ card.month }/{card.year}</p>
            </div>
        </div>
    );
}
