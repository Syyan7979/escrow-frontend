import React from "react";
import CustomNavbar  from './components/navbar/navbar';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { Contract } from './components/create-contract-modal/interfaces';
import ContractModal from './components/create-contract-modal/create-contract-modal';
import Contracts from './components/contracts/contracts';
import './App.css';
import { AccountContext } from "./contexts/account-context";
import AdminContracts from "./components/admin-contracts/admin-contracts";

const App = () => {
  const [show, setShow] = React.useState<boolean>(false);
  const [account, setAccount] = React.useState<string>("");
  const [contractAddresses, setContractAddresses] = React.useState<string[]>(['KT1KYLJz4Ws8znSf1wHRkwqtndkuwH1NsZCR', 'KT1KYR676FBzmJ173bGqQK3Nw9FY7WuhngwH', 'KT1JVqrW2uYjXuCoeFLyhtsczRXU2NU1pEjr', 'KT1MU5e2eEqBZaGSnnRGD42CXnCuvUiJaegy']); // TODO: [1

  const updateAccount = (account: string) => {
    setAccount(account);
    console.log(account);
  }
  
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleConfirm = (contract: Contract) => {
    console.log(contract);
  }

  return (
    <AccountContext.Provider value={account}>
      <div className="App">
      <CustomNavbar onUpdateContext={updateAccount} brand="Escrow" buttonText="Connect Wallet" buttonVariant="info" />
      <Container style={{maxWidth: "none", margin: "0", padding: "56px 0", minHeight: '100vh', backgroundColor: "#3c5464", position: 'relative'}}>
        {
          account === 'tz1MLvzp18yuBX6umbSPAEgeJnqAzm65w9Zq' ? (
            <AdminContracts contractAddress={contractAddresses} />
          ) : (
            <>
              <Row className="new-contract-button-row">
                <Col>
                  <Button style={{backgroundColor: "#e67e22", border: "none"}} className="new-contract-button" onClick={handleShow} variant="primary">Create New Contract</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ContractModal account={account} show={show} onHide={handleClose} onConfirm={handleConfirm} modalTitle="Create New Contract" />
                </Col>
              </Row>
              <Contracts account={account} contractAddress={contractAddresses} />
            </>
          )
        }
      </Container>
    </div>
    </AccountContext.Provider>
  );
};

export default App;
