import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { tezos } from "../../utils/tezos";
import { ContractStorage } from "../../interfaces/contract-utils";
import AdminContract from "../admin-contract/admin-contract";

export default function AdminContracts(props: {
    contractAddress: string[];
}) {
    const [adminContractComponents, setAdminContractComponents] = useState<React.ReactNode[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchContracts() {
            const promises = props.contractAddress.map(async (item) => {
                try {
                    const contract = await tezos.contract.at(item);
                    const contractStorage: ContractStorage = await contract.storage();
                    return (
                        <Col key={item}>
                            <AdminContract
                                contractAddress={item}
                                contractStorage={contractStorage}
                            />
                        </Col>
                    );
                } catch (error) {
                    console.log(error);
                }
            });

            const result = await Promise.all(promises);
            setAdminContractComponents(result);
            setLoading(false);
        }
        fetchContracts();
    }, [props.contractAddress]);

    return (
        <Row
            xs={1}
            sm={2}
            md={3}
            lg={4}
            xl={5}
            className="g-2 d-flex justify-content-center"
            style={{ height: "100%", padding: "5% 19%" }}
        >
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                adminContractComponents
            )}
        </Row>
    );
}