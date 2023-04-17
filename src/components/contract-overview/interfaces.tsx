import { Contract } from "../create-contract-modal/interfaces";

export interface ContractOvervewProps {
    hash: string,
    asset: string,
    deadline: number,
    contract: Contract
}