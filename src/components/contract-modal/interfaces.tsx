import { Contract } from "../create-contract-modal/interfaces";

export interface CreatedContractModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (contract: Contract) => void;
    contract : Contract;
}