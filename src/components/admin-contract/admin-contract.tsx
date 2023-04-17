import React from "react";
import { AdminContractProps } from "./interfaces";
import { Button, Card } from "react-bootstrap";
import { revertFunds } from "../../utils/operation";
import { tezos } from "../../utils/tezos";
import { ContractStorage } from "../../interfaces/contract-utils";

export default function AdminContract(props : AdminContractProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [cancelled, setCancelled] = React.useState<boolean>(false);
    const [cardColor, setCardColor] = React.useState<string>("aliceblue");

    React.useEffect(() => {
        const checkCancelled = async () => {
            const contract = await tezos.contract.at(props.contractAddress);
            const contractStorage : ContractStorage = await contract.storage();
            setCancelled(contractStorage.cancelled);
            setCardColor(contractStorage.cancelled ? "red" : "aliceblue");
        }

        checkCancelled();
    })

    const handleRevert = async () => {
        setLoading(true);
        try {
            await revertFunds(props.contractAddress);
            setLoading(false);
            setCardColor("red");
            setCancelled(true);
        } catch (error) {
            setLoading(false);
        }
    }
            
    return (
        <Card className="contract-overview" style={{backgroundColor: cardColor, margin: "2px", borderRadius: "15px"}}>
            <Card.Body>
                {
                    cancelled ? (
                        <Card.Title>{`Funds on ${props.contractAddress} have been returned to their respective owners. Contract is now closed`}</Card.Title>
                    ) : (
                        <div>
                            <Card.Title>{props.contractAddress}</Card.Title>
                            {
                                props.contractStorage.withdrawOwner ? <Card.Subtitle className="mb-2 text-muted" style={{
                                    color: "red"
                                }}>Owner is requesting to withdraw from the contract</Card.Subtitle> : null
                            }
                            {
                                props.contractStorage.withdrawCounterparty ? <Card.Subtitle className="mb-2 text-muted" style={{
                                    color: "red"
                                }}>Counterparty is requesting to withdraw from the contract</Card.Subtitle> : null
                            }
                            {
                                loading ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <Button variant="primary" onClick={handleRevert} disabled={!(props.contractStorage.withdrawCounterparty && props.contractStorage.withdrawOwner)}>Revert Funds</Button>
                                )
                            }
                        </div>
                    )
                }
                
            </Card.Body>
        </Card>
    )
}