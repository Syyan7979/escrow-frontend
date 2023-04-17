import React, { useEffect, useState, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import ContractOverview from "../contract-overview/contract-overview";
import { AccountContext } from "../../contexts/account-context";
import { ContractsProps } from "./interfaces";
import { tezos } from "../../utils/tezos";
import { ContractStorage } from "../../interfaces/contract-utils";

export default function Contracts(props: ContractsProps) {
  const account = useContext(AccountContext);
  const [contractComponents, setContractComponents] = useState<React.ReactNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchContracts() {
      const promises = props.contractAddress.map(async (item) => {
        try {
          const contract = await tezos.contract.at(item);
          const contractStorage: ContractStorage = await contract.storage();
          return contractStorage.owner === account || contractStorage.counterparty === account ? (
            <Col key={item}>
              <ContractOverview
                hash={item}
                asset={contractStorage.owner === account ? "owned" : "counterpartied"}
                deadline={new Date(contractStorage.epoch).getTime()}
                contract={{
                  ownerAddress: contractStorage.owner,
                  ownerContribution: contractStorage.fromOwner,
                  counterPartyAddress: contractStorage.counterparty,
                  counterPartyContribution: contractStorage.fromCounterparty,
                  deadline: new Date(contractStorage.epoch).getTime(),
                  contractSecret: contractStorage.hashedSecret,
                  claimable: false,
                  contractAddress: item,
                }}
              />
            </Col>
          ) : null;
        } catch (error) {
          console.log(error);
        }
      });

      const result = await Promise.all(promises);
      setContractComponents(result);
      setLoading(false);
    }
    fetchContracts();
  }, [props.contractAddress, account]);

  return (
    <Row
      xs={1}
      sm={2}
      md={3}
      lg={4}
      xl={5}
      className="g-2 d-flex justify-content-center"
      style={{ height: "100%", padding: "0 19%" }}
    >
      { loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        contractComponents
      )}
    </Row>
  );
}
