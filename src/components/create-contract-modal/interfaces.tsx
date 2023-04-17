import BigNumber from "bignumber.js";
export interface Contract {
    ownerAddress : string;
    ownerContribution : BigNumber;
    counterPartyAddress : string;
    counterPartyContribution : BigNumber;
    deadline : number;
    contractSecret : string;
    claimable: boolean;
    contractAddress: string;
}

export interface ContractModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (contract: Contract) => void;
    modalTitle: string;
    account: string;
}