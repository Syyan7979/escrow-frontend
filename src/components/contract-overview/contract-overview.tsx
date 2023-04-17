import React from "react";
import { ContractOvervewProps } from "./interfaces";
import { Card } from "react-bootstrap";
import './contract-overview.css'
import { Contract } from "../create-contract-modal/interfaces";
import CreatedContractModal from "../contract-modal/contract-modal";

export default function ContractOverview(props : ContractOvervewProps) {
    const [show, setShow] = React.useState<boolean>(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const handleConfirm = (contract : Contract) => {
        console.log(contract);
    }
    const convertUnixToDate = (unix: number) => {
        const date = new Date(unix);
        return date.toLocaleString();
    }
    return (
        <>
            <Card className="contract-overview" onClick={handleShow} style={{backgroundColor: "aliceblue", margin: "2px", borderRadius: "15px"}}>
                <Card.Body>
                    <Card.Title>{props.hash}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{props.asset}</Card.Subtitle>
                    <Card.Text>Deadline: {convertUnixToDate(props.deadline)}</Card.Text>
                </Card.Body>
            </Card>
            <CreatedContractModal show={show} onHide={handleClose} onConfirm={handleConfirm} contract={props.contract} />
        </>
    )
}