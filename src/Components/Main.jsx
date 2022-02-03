import React, { useRef, useState } from "react";
// import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Col, Container, Row, Card, Button } from "reactstrap";
import byteCode from "./byteCode";
import STANDARD_TOKEN from "./standard_token";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const TokenCreate = () => {
	const [state, setState] = useState({
		tokenName: "",
		symbol: "",

		contract: "",
	});
	// const { library } = new useWeb3React();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		console.log(tokenNameRef.current.value);
		console.log(symbolRef.current.value);

		await provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		const factory = new ethers.ContractFactory(
			STANDARD_TOKEN,
			byteCode,
			signer
		);

		const contract = await factory.deploy(
			tokenNameRef.current.value,
			symbolRef.current.value
		);
		console.log(contract);
		setState({ ...state, contract: contract.address });
		await contract.deployTransaction.wait();
	};

	const tokenNameRef = useRef("");
	const symbolRef = useRef("");

	return (
		<>
			<Card className="card bg-purple">
				<img
					className="card_img_top img-circle rounded-circle"
					src={`${process.env.PUBLIC_URL}/icons/swap_grey.svg`}
					alt="logo"
				/>
				<Container>
					<Row>
						<Col xs={4}>
							<Row className="h-100">
								<Col className="align-items-center text-center d-flex" xs={4}>
									<img
										src={`${process.env.PUBLIC_URL}/icons/coin.png`}
										alt="coin"
										className="coin_icon"
									/>
								</Col>
							</Row>
						</Col>
						<Col className="p-3">
							<Box
								component="form"
								sx={{
									"& > :not(style)": { m: 1, width: "25ch" },
								}}
								noValidate
								autoComplete="off"
							>
								<TextField
									id="tokenName"
									label="Token Name"
									variant="outlined"
									color="secondary"
									inputRef={tokenNameRef}
									focused
								/>
							</Box>

							<Box
								component="form"
								sx={{
									"& > :not(style)": { m: 1, width: "25ch" },
								}}
								noValidate
								autoComplete="off"
							>
								<TextField
									id="symbol"
									label="Symbol"
									variant="outlined"
									color="secondary"
									inputRef={symbolRef}
									focused
								/>
							</Box>
							<Button width="100%" onClick={handleSubmit}>
								Create
							</Button>
						</Col>
					</Row>
				</Container>
			</Card>
		</>
	);
};

export default TokenCreate;
