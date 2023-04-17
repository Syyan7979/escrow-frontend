import React from "react";
import { ContractModalProps } from "./interfaces";
import { Modal, Button, Form } from "react-bootstrap";
import BigNumber from "bignumber.js";

export default function ContractModal(props : ContractModalProps) {
    const [ownerContribution, setOwnerContribution] = React.useState<BigNumber>(new BigNumber(0));
    const [counterPartyAddress, setCounterPartyAddress] = React.useState<string>("");
    const [counterPartyContribution, setCounterPartyContribution] = React.useState<BigNumber>(new BigNumber(0));
    const [deadline, setDeadline] = React.useState<number>(0);
    const [contractSecret, setContractSecret] = React.useState<string>("");
    const claimable = false;

    const convertDateToUnix = (date: Date) => {
        setDeadline(Math.floor(date.getTime() / 1000));
    }

    const handleConfirm = () => {
        props.onConfirm({
            contractAddress: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
            ownerAddress : props.account,
            ownerContribution,
            counterPartyAddress,
            counterPartyContribution,
            deadline,
            contractSecret,
            claimable
        })
        props.onHide();
    }

    if (!props.show) {
        return null;
    }

    return (
        <Modal centered show={props.show} onHide={props.onHide}>
            <Modal.Header style={{backgroundColor: "#ECECEC"}} closeButton>
                <Modal.Title>{props.modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: "#ECECEC"}}>
                <Form>
                    <Form.Group controlId="formInput1">
                    <Form.Label>My Contribution</Form.Label>
                    <Form.Control 
                        style={{backgroundColor: "#D9D9D9"}} 
                        type="number" 
                        placeholder="Enter amount in Tez" 
                        onChange={
                            (e) => {
                                let number = Number(e.target.value);
                                let bignumber = new BigNumber(number * 1e6);
                                setOwnerContribution(bignumber);
                            }
                        }/>
                    </Form.Group>

                    <Form.Group controlId="formInput2">
                    <Form.Label>Addres of Counterparty</Form.Label>
                    <Form.Control 
                        style={{backgroundColor: "#D9D9D9"}}
                        type="text" 
                        placeholder="Enter address of wallet" 
                        onChange={
                            (e) => {
                                setCounterPartyAddress(e.target.value);
                            }
                        }/>
                    </Form.Group>

                    <Form.Group controlId="formInput3">
                    <Form.Label>Counterparty Contribution</Form.Label>
                    <Form.Control 
                        style={{backgroundColor: "#D9D9D9"}}
                        type="number" 
                        placeholder="Enter amount in Tez" 
                        onChange={
                            (e) => {
                                let number = Number(e.target.value);
                                let bignumber = new BigNumber(number * 1e6);
                                setCounterPartyContribution(bignumber);
                            }
                        }/>
                    </Form.Group>

                    <Form.Group controlId="formInput4">
                    <Form.Label>Deadline of contract</Form.Label>
                    <Form.Control 
                        style={{backgroundColor: "#D9D9D9"}}
                        type="date" 
                        onChange={
                            (e) => {
                                    convertDateToUnix(new Date(e.target.value));
                            }
                        } />
                    </Form.Group>

                    <Form.Group controlId="formInput5">
                    <Form.Label>Contract Secret</Form.Label>
                    <Form.Control 
                        style={{backgroundColor: "#D9D9D9"}}
                        type="text" 
                        placeholder="Secret will be hashed" 
                        onChange={
                            (e) => {
                                setContractSecret(e.target.value);
                            }
                        } />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: "#ECECEC"}}>
            <Button 
                variant="primary" 
                onClick={handleConfirm}
                disabled={ownerContribution.toNumber() === 0 || counterPartyAddress === "" || counterPartyContribution.toNumber() === 0 || deadline === 0 || contractSecret === ""}>
                Confirm
            </Button>
            </Modal.Footer>

        </Modal>
    )
}