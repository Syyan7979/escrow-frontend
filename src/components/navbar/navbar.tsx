import React from "react";
import { Navbar, Container, Button  } from "react-bootstrap";
import { NavbarProps } from "./interfaces";
import "./navbar.css";
import { connectWallet, getAccount } from "../../utils/wallet";

export default function CustomNavbar(props : NavbarProps) { 
    let [account, setAccount] = React.useState<string>("");

    React.useEffect(() => {
        const getActiveAccount = async () => {
            const activeAccount = await getAccount();
            setAccount(activeAccount);
            props.onUpdateContext(activeAccount);
        }
        getActiveAccount();
    }, []);

    const truncateAddress = (address: string) => {
        return address.substring(0, 7) + "..." + address.substring(address.length - 4, address.length);
    }

    const onConnectWallet = async () => {
        await connectWallet();
        const activeAccount = await getAccount();
        setAccount(activeAccount);
        props.onUpdateContext(activeAccount);
    }

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="lg"> 
            <Container className="navbar-container">
                <div className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M11.0049 2L18.3032 4.28071C18.7206 4.41117 19.0049 4.79781 19.0049 5.23519V7H21.0049C21.5572 7 22.0049 7.44772 22.0049 8V10H9.00488V8C9.00488 7.44772 9.4526 7 10.0049 7H17.0049V5.97L11.0049 4.094L5.00488 5.97V13.3744C5.00488 14.6193 5.58406 15.7884 6.56329 16.5428L6.75154 16.6793L11.0049 19.579L14.7869 17H10.0049C9.4526 17 9.00488 16.5523 9.00488 16V12H22.0049V16C22.0049 16.5523 21.5572 17 21.0049 17L17.7848 17.0011C17.3982 17.5108 16.9276 17.9618 16.3849 18.3318L11.0049 22L5.62486 18.3318C3.98563 17.2141 3.00488 15.3584 3.00488 13.3744V5.23519C3.00488 4.79781 3.28913 4.41117 3.70661 4.28071L11.0049 2Z" fill="white"></path></svg>
                    <Navbar.Brand href="#home">{props.brand}</Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Button onClick={onConnectWallet} className="connect-button" variant={props.buttonVariant}>
                        <div className="connect-button-text">
                            {account === ''? props.buttonText : truncateAddress(account)}
                        </div>
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}