export interface NavbarProps {
    brand: string;
    buttonText: string;
    buttonVariant: string;
    onUpdateContext: (account: string) => void;
}