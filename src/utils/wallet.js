import { BeaconWallet } from "@taquito/beacon-wallet";
//import { NetworkType } from "@airgap/beacon-sdk";

export const wallet = new BeaconWallet({
    name: "Escrow",
    preferredNetwork: 'ghostnet'
});

export const connectWallet = async () => {
    await wallet.requestPermissions({
        network: {
            type: 'ghostnet'
        }
    });
}

export const getAccount = async () => {
    const account = await wallet.client.getActiveAccount();
    if (account) {
        return account.address;
    } else {
        return "";
    }
}