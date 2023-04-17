import { tezos } from './tezos';
import { ContractStorage } from '../interfaces/contract-utils';

export const AddBalanceOwner = async (contractAddress : string) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const contractStorage : ContractStorage = await contract.storage();

        const operation = await contract.methods.addBalanceOwner().send(
            {
                amount: contractStorage.fromOwner.toNumber(),
                mutez: true
            }
        );

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}

export const AddBalanceCounterparty = async (contractAddress : string) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const contractStorage : ContractStorage = await contract.storage();
        console.log(contractStorage)

        const operation = await contract.methods.addBalanceCounterparty().send(
            {
                amount: contractStorage.fromCounterparty.toNumber(),
                mutez: true
            }
        );

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}

export const ClaimOwner = async (contractAddress : string) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.claimOwner().send();

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}

export const ClaimCounterparty = async (contractAddress : string, secretPassword: string) => {
    try {
        const byteArray = new Uint8Array(secretPassword.slice(2).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const byteString = Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('');
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.claimCounterparty(byteString).send();

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}

export const withdrawCounterparty = async (contractAddress : string) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.withdrawCounterparty().send();

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}

export const withdrawOwner = async (contractAddress : string) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.withdrawOwner().send();

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}

export const revertFunds = async (contractAddress : string) => {
    try {
        const contract = await tezos.wallet.at(contractAddress);
        const operation = await contract.methods.revertFunds().send();

        await operation.confirmation(1);
    } catch (error) {
        throw error;
    }
}