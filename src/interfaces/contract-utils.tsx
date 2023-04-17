import BigNumber from "bignumber.js";

export interface ContractStorage {
    balanceCounterparty : BigNumber,
    balanceOwner: BigNumber,
    counterparty: string,
    epoch: Date,
    fromCounterparty: BigNumber,
    fromOwner: BigNumber,
    hashedSecret: string,
    owner: string,
    admin: string,
    withdrawOwner: boolean,
    withdrawCounterparty: boolean,
    completed: boolean,
    cancelled: boolean
}