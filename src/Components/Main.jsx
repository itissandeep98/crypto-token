import { Button, TextField } from "@mui/material";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import byteCode from "./byteCode";
import STANDARD_TOKEN from "./standard_token";

const TokenCreate = () => {
	const [state, setState] = useState({
		tokenName: "",
		symbol: "",
		contract: "",
	});
	const ethereum = window.ethereum;
	const provider = new ethers.providers.Web3Provider(ethereum);

	useEffect(() => {
		addNetwork();
		// eslint-disable-next-line
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		await provider.send("eth_requestAccounts", []);
		const signer = provider.getSigner();
		const factory = new ethers.ContractFactory(
			STANDARD_TOKEN,
			byteCode,
			signer
		);

		const contract = await factory.deploy(state.tokenName, state.symbol);
		console.log(contract);
		setState({ ...state, contract: contract.address });
		await contract.deployTransaction.wait();
	};

	const addNetwork = async () => {
		if (typeof ethereum !== "undefined") {
			try {
				provider.provider.sendAsync({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: "0x13881",
							chainName: "Polygon Testnet",
							rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
							nativeCurrency: {
								name: "MATIC",
								symbol: "MATIC",
								decimals: 18,
							},
						},
					],
				});
			} catch (addError) {
				console.log(addError);
			}
		} else {
			console.log("Unable to connect to a Wallet", "error");
		}
	};

	const addToken = async () => {
		if (typeof ethereum !== "undefined") {
			provider.provider.sendAsync(
				{
					method: "metamask_watchAsset",
					params: {
						type: "ERC20",
						options: {
							address: state.contract,
							symbol: state.symbol,
							decimals: 18,
						},
					},
					id: Math.round(Math.random() * 100000),
				},
				(err, added) => {
					console.log("provider returned", err, added);
				}
			);
		} else {
			console.log("Unable to connect to a Wallet", "error");
		}
	};

	return (
		<Container fluid className=" d-flex justify-content-center ">
			<Row className="d-flex align-items-center">
				<Col xs={4}>
					<img
						src={`${process.env.PUBLIC_URL}/coin.gif`}
						alt="coin"
						className="img-fluid"
					/>
				</Col>
				<Col
					xs={6}
					className="p-3 text-center shadow bg-light text-dark rounded"
				>
					<h3>Create your own Token</h3>
					<hr />
					{state.contract && (
						<div className="d-flex justify-content-between my-3">
							<a
								href={`https://mumbai.polygonscan.com/address/${state.contract}`}
								target="_blank"
								rel="noreferrer"
							>
								View Token on Polygonscan
							</a>
							<Button variant="outlined" onClick={addToken} size="small">
								Add Token to MetaMask
							</Button>
						</div>
					)}
					<TextField
						label="Token Name"
						variant="outlined"
						fullWidth
						value={state.tokenName}
						onChange={(e) => setState({ ...state, tokenName: e.target.value })}
					/>

					<TextField
						label="Symbol"
						variant="outlined"
						className="my-3"
						fullWidth
						value={state.symbol}
						onChange={(e) => setState({ ...state, symbol: e.target.value })}
					/>
					<Button
						variant="contained"
						disabled={!state.tokenName || !state.symbol}
						onClick={handleSubmit}
					>
						Create
					</Button>
					<div className="text-left mt-3">
						Get Free{" "}
						<a
							href="https://faucet.polygon.technology/"
							target="_blank"
							rel="noreferrer"
						>
							Matic
						</a>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default TokenCreate;
