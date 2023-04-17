import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { CreatedContractModalProps } from "./interfaces";
import { AccountContext } from "../../contexts/account-context";
import { AddBalanceOwner, AddBalanceCounterparty, ClaimOwner, ClaimCounterparty, withdrawOwner, withdrawCounterparty } from "../../utils/operation";
import { tezos } from "../../utils/tezos";
import { ContractStorage } from "../../interfaces/contract-utils";

export default function CreatedContractModal(props : CreatedContractModalProps) {
    const account = React.useContext(AccountContext);
    const [contractStorage, setContractStorage] = React.useState<ContractStorage>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [contractSecret, setContractSecret] = React.useState<string>('');
    const [widthraw, setWidthraw] = React.useState<boolean>(false);
    const [counterPartyClaimable, setCounterPartyClaimable] = React.useState<boolean>(true);
    const [completed, setCompleted] = React.useState<boolean>(false);
    const [cancelled, setCancelled] = React.useState<boolean>(false);
    const [withdrawn, setWithdrawn] = React.useState<boolean>(false);
    const [withdrawLoading, setWithdrawLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchContractStorage = async () => {
            try {
                if (props.show){
                    const contract = await tezos.contract.at(props.contract.contractAddress);
                    const contractStorage: ContractStorage = await contract.storage();
                    console.log(contractStorage);
                    setContractStorage(contractStorage);
                    if (contractStorage.owner === account) {
                        if (contractStorage.fromOwner.toNumber() === contractStorage.balanceOwner.toNumber()) {
                            if (new Date(contractStorage.epoch).getTime() < new Date().getTime()) {
                                setLoading(false);
                            } else {
                                setLoading(true);
                            }
                            setWidthraw(true);
                        } else {
                            setWidthraw(false);
                        }
                        if (contractStorage.withdrawOwner) {
                            setWithdrawn(true);
                        } else {
                            setWithdrawn(false);
                        }                        
                    } else if (contractStorage.counterparty === account) {
                        if (contractStorage.fromCounterparty.toNumber() === contractStorage.balanceCounterparty.toNumber()) {
                            if (new Date(contractStorage.epoch).getTime() < new Date().getTime()) {
                                setCounterPartyClaimable(false);
                            } else {
                                setCounterPartyClaimable(true);
                            }
                            setLoading(false);
                            setWidthraw(true);
                        } else {
                            setWidthraw(false);
                        }

                        if (contractStorage.withdrawCounterparty) {
                            setWithdrawn(true);
                        } else {
                            setWithdrawn(false);
                        }
                    }

                    if (contractStorage.completed) {
                        setCompleted(true);
                    } else {
                        setCompleted(false);
                    }

                    if (contractStorage.cancelled) {
                        setCancelled(true);
                    } else {
                        setCancelled(false);
                    }
                }
            } catch (error) {
                throw error;
            }
        };
        fetchContractStorage();
    }, [props.contract.contractAddress, props.show, account]);

    const handleConfirm = async() => {
        setLoading(true);
        try {
            if (props.contract.ownerAddress === account) {
                await AddBalanceOwner(props.contract.contractAddress);
            } else {
                await AddBalanceCounterparty(props.contract.contractAddress);
            }
            const contract = await tezos.contract.at(props.contract.contractAddress);
            const contractStorage: ContractStorage = await contract.storage();
            setContractStorage(contractStorage);
            setWidthraw(true);
    
            // Check if the balance has been updated successfully
            if (props.contract.ownerAddress === account && contractStorage.fromOwner.toNumber() === contractStorage.balanceOwner.toNumber()) {
                if (new Date(contractStorage.epoch).getTime() < new Date().getTime()) {
                    setLoading(false);
                } else {
                    setLoading(true);
                }
            } else if (props.contract.ownerAddress !== account && contractStorage.fromCounterparty.toNumber() === contractStorage.balanceCounterparty.toNumber()) {
                if (new Date(contractStorage.epoch).getTime() > new Date().getTime()) {
                    setCounterPartyClaimable(true);
                } else {
                    setCounterPartyClaimable(false);
                }
                setLoading(false);
            } else {
                // If the balance has not been updated yet, keep loading set to true
                setLoading(true);
            }
        } catch (error) {
            setLoading(false); // Set loading to false in case of error
        }
    }

    const handleClaim = async() => {
        setLoading(true);
        try {
            if (props.contract.ownerAddress === account) {
                await ClaimOwner(props.contract.contractAddress);
            } else {
                await ClaimCounterparty(props.contract.contractAddress, contractSecret);
            }
            const contract = await tezos.contract.at(props.contract.contractAddress);
            const contractStorage: ContractStorage = await contract.storage();
            setContractStorage(contractStorage);
    
            if (contractStorage.completed) {
                setCompleted(true);
                setLoading(false);
            } 
        } catch (error) {
            setLoading(false); // Set loading to false in case of error
        }
    }

    const handleWithdraw = async() => {
        setWithdrawLoading(true);
        try {
            if (props.contract.ownerAddress === account) {
                await withdrawOwner(props.contract.contractAddress);
            } else {
                await withdrawCounterparty(props.contract.contractAddress);
            }
            const contract = await tezos.contract.at(props.contract.contractAddress);
            const contractStorage: ContractStorage = await contract.storage();
            setContractStorage(contractStorage);

            if (contractStorage.withdrawOwner) {
                setWithdrawn(true);
            } else if (contractStorage.withdrawCounterparty) {
                setWithdrawn(true);
            }
            setWithdrawLoading(false);
        } catch (error) {
            setWithdrawLoading(false); // Set loading to false in case of error
        }
    }
    
    if (!props.show) {
        return null;
    }

    return (
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header style={{backgroundColor: "#ECECEC"}} closeButton>
                <Modal.Title>{props.contract.ownerAddress === account ? 'Your Own Contract' : 'Your Counterpartied Contract'}</Modal.Title>
            </Modal.Header>
            <Modal.Body  style={{backgroundColor: "#ECECEC"}}>
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    {
                        completed ? (
                            <p style={{color: "green", fontWeight: 'bold'}}>This contract has been completed</p>
                        ) : cancelled ? (
                            <p style={{color: "red", fontWeight: 'bold'}}>This contract has been cancelled</p>
                        ) : (
                            <div style={{
                                width: '100%',
                            }} className="text-center">
                                <p style={{
                                    fontWeight: 'bold',
                                }} className="my-0 d-flex justify-content-center">Your contribution: {props.contract.ownerAddress === account ? props.contract.ownerContribution.toNumber()/1e6 : props.contract.counterPartyContribution.toNumber()/1e6} tez</p>
                                {
                                    contractStorage && (contractStorage.counterparty === account) && (contractStorage.balanceCounterparty.toNumber() === contractStorage.fromCounterparty.toNumber())? (
                                        <div>
                                            {
                                                counterPartyClaimable ? (
                                                    <Form >
                                                        <Form.Group className='d-flex' controlId="formInput1">
                                                        <Form.Label>Secret Password</Form.Label>
                                                        <Form.Control 
                                                            style={{backgroundColor: "#D9D9D9"}} 
                                                            type="string" 
                                                            placeholder="Enter your contract secret" 
                                                            onChange={
                                                                (e) => {
                                                                    setContractSecret(e.target.value);
                                                                }
                                                            }/>
                                                        </Form.Group>
                                                    </Form>
                                                ) : (
                                                    <p style={{
                                                        color: "red",
                                                        fontWeight: "bold",
                                                        margin: "0"
                                                    }}>
                                                        You have exceeded the time limit to claim the amount stored in the escrow contract.
                                                    </p>
                                                )
                                            }
                                        </div>
                                    ) : null
                                }
                            </div>
                        )
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex align-items-center justify-content-center" style={{backgroundColor: "#ECECEC"}}>
                {
                    completed || cancelled ? (
                        null
                    ) : withdrawn ? (
                        <p style={{
                            fontWeight: 'bold'
                        }}>
                            Waiting for admin to process your withdrawal request ...
                        </p>
                    ) : (
                        <>
                            <div>
                                {
                                    widthraw ? (
                                        <div>
                                            {
                                                withdrawLoading ? (
                                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Button variant="danger" onClick={handleWithdraw}> Withdraw </Button>
                                                )
                                            }
                                        </div>
                                    ) : null
                                }
                            </div>
                            <div>
                                {
                                    loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : contractStorage && (contractStorage.owner === account) ? (
                                        <div>
                                            {
                                                contractStorage && (contractStorage.fromOwner.toNumber() === contractStorage.balanceOwner.toNumber()) ? (
                                                    <Button variant="success" onClick={handleClaim}>Claim</Button>
                                                ) : (
                                                    <Button variant="primary" onClick={handleConfirm}>
                                                        Send Amount
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    ) : contractStorage && (contractStorage.counterparty === account) ? (
                                        <div>
                                            {
                                                contractStorage && (contractStorage.fromCounterparty.toNumber() === contractStorage.balanceCounterparty.toNumber()) ? (
                                                    <div>
                                                        {
                                                            counterPartyClaimable ? (
                                                                <Button variant="success" onClick={handleClaim}>Claim</Button>
                                                            ) : null
                                                        }
                                                    </div>
                                                ) : (
                                                    <Button variant="primary" onClick={handleConfirm}>
                                                        Send Amount
                                                    </Button>
                                                ) 
                                            }
                                        </div>
                                    ) : null
                                }
                            </div>
                        </>
                    )
                }
                
            </Modal.Footer>
        </Modal>
    )
}