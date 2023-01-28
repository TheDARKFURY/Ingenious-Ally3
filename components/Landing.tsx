import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletConnectButton,
} from "@solana/wallet-adapter-react-ui";
import styles from "../styles/ConnectBtn.module.css";
import { checkContributionPower } from "../features/checkContributionPower";
import React, { useEffect } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addAdminWallet } from "../features/collabInfo";
import Router from "next/router";
import { useState } from "react";
import * as anchor from "@project-serum/anchor";
export const Landing = () => {
  const walletAddress = useAppSelector((state) => state.collabInfo.AdminWallet);
  const [contributorAddress, setContributorAddress] = useState(null);
  const dispatch = useAppDispatch();
  const { publicKey, connected, connect } = useWallet();
  const onChangeCpHandler = (event) => {
    const contributorPubkey = new anchor.web3.PublicKey(event.target.value);
    console.log(contributorPubkey.toBase58());
    setContributorAddress(contributorPubkey);
  };

  const checkCphandler = () => {
    checkContributionPower(contributorAddress).then(() => {
      console.log("checked");
    });
  };
  useEffect(() => {
    dispatch(addAdminWallet(publicKey?.toString()));
    if (connected) {
      Router.push("/reward");
    }
  }, [publicKey, connected, dispatch]);

  return (
    <>
      <div className="bgLanding md:grid  ">
        <div></div>
        <main className="  flex flex-col justify-center items-center space-y-20 min-h-screen  ">
          <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold uppercase super font-Lexend ">
            Ally3
          </h1>
          <div className="flex flex-col justify-center items-center text-center space-y-2">
            <p className="text-transparent bg-clip-text text-xl xl:text-2xl 2xl:text-3xl tracking-tighter font-medium capitalize superdes font-Lexend">
              {'"Tokens and NFTs can be bought,'}
            </p>
            <p className=" text-xl 2xl:text-3xl xl:text-xl font-medium capitalize  font-Lexend flex flex-row gap-x-3 ">
              <span className="text-transparent bg-clip-text superdes tracking-tighter ">
                {'Contribution Power needs to be earned"'}
              </span>
              🏆
            </p>
          </div>
          <div className="flex justify-center relative ">
            {" "}
            <WalletMultiButton className={styles.btn} />
          </div>
          <div>
            <p className=" text-xl 2xl:text-3xl xl:text-xl font-medium capitalize  font-Lexend flex flex-row gap-x-3 ">
              <span className="text-transparent bg-clip-text superdes tracking-tighter ">
                {"Check your Contribution Power here "}
              </span>
            </p>
            <br />
            <input
              type="text"
              name="Ally3"
              className="w-full rounded-xl h-14 bg-transparent text-[#939393] outline outline-[#939393] px-4"
              placeholder="Enter Wallet Address here"
              onChange={onChangeCpHandler}
            ></input>
            <br />
            <br />
            <div className="flex justify-center relative ">
              <button
                className="wallet-adapter-button ConnectBtn_btn__9N7zE"
                type="button"
                onClick={checkCphandler}
              >
                <i className="wallet-adapter-button-start-icon"></i>
                Check CPs
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
