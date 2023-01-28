import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { BsExclamationCircleFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import member, { addNewMember, removeMember } from "../features/member";
import * as collabs from "../collabs/js/src/generated";
import * as anchor from "@project-serum/anchor";
import { AdminSuccess } from "./AdminSuccess";
import {
  addCollabName,
  addDescription,
  addGitHub,
  addLeadName,
  addContributionPower,
} from "../features/collabInfo";
import { addLeader } from "../features/addLeader";
import { addContributor } from "../features/addContributor";
import { transferCp } from "../features/transferCp";
import { mintAndTransfer } from "../features/mintAndTransfer";
import {
  uploadImage,
  collabNftMetadata,
  creteNfts,
  airdropSol,
} from "../features/mintNft";
import { time } from "console";
import {
  Metaplex,
  mockStorage,
  walletAdapterIdentity,
  bundlrStorage,
  BundlrStorageDriver,
  MetaplexFile,
  toMetaplexFileFromBrowser,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import styles from "../styles/Form.module.css";
export const Form = () => {
  const { publicKey, connected, connect } = useWallet();

  const [form, setForm] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [name, setMemberName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [memberAddress, setWalletAddress] = useState<string>("");
  const [xp, setMemberXP] = useState<number>(0);
  const [ipfsHash, setHash] = useState<string>("0000000000");
  const [minted, setMinted] = useState<boolean>(false);
  const [nft, setNFT] = useState<string>("0x00000000");
  const [loading, setLoading] = useState<boolean>(false);

  // current value in reducers
  const Members = useAppSelector((state) => state.FormReducers.MemberArray);
  const memberCount = useAppSelector((state) => state.FormReducers.memberCount);
  const Title = useAppSelector((state) => state.collabInfo.collabName);
  const Description = useAppSelector((state) => state.collabInfo.Description);
  const GitHub = useAppSelector((state) => state.collabInfo.GitHub);
  const AdminWallet = useAppSelector((state) => state.collabInfo.AdminWallet);
  const LeadName = useAppSelector((state) => state.collabInfo.LeadName);
  const ContributionPower = useAppSelector(
    (state) => state.collabInfo.ContributionPower
  );
  const PreviewUrl = useAppSelector((state) => state.previewInfo.previewUrl);
  const dispatch = useAppDispatch();

  const wallet = useWallet();

  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());

  metaplex.use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    })
  );

  const AddMember = () => {
    const a = { name, role, memberAddress, xp, ipfsHash, minted, nft };
    try {
      const isValidWallet = PublicKey.isOnCurve(new PublicKey(a.memberAddress));
      if (isValidWallet) {
        dispatch(addNewMember(a));
        setDefault();
      }
    } catch (error) {
      alert("Member's wallet is invalid...");
      setDefault();
    }
  };

  const RemoveMember = (address: string) => {
    dispatch(removeMember(address));
  };

  const setDefault = () => {
    setMemberName("");
    setWalletAddress("");
    setMemberXP(0);
    setRole("");
  };

  const setPopup = (a: boolean) => {
    setSuccess(a);
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const addLeaderHandler = () => {
    addLeader(wallet, GitHub).then(() => {
      console.log("added leader");
    });
  };

  const sendData = async () => {
    setLoading(true);
    const bundlrStorage = metaplex.storage().driver() as BundlrStorageDriver;
    (await bundlrStorage.bundlr()).fund(1000);
    const solSig = await airdropSol(wallet, connection);
    var file = dataURLtoFile(PreviewUrl, "a.png");
    const files: MetaplexFile = await toMetaplexFileFromBrowser(file);

    const metadataUri = await collabNftMetadata(
      Title,
      Description,
      GitHub,
      files,
      metaplex,
      ContributionPower
    );
    console.log("Here ===> ", metadataUri);
    await creteNfts(
      metadataUri.uri,
      Title,
      ContributionPower,
      GitHub,
      metaplex,
      Members
    );
    setLoading(false);
  };
  return (
    <>
      <section className="px-12 flex flex-col ">
        <h1 className="text-white py-5 text-2xl xl:text-3xl font-Outfit font-medium ">
          Proof of Contribution NFT
        </h1>
        <hr className=" border border-borderline" />
        <div className="flex flex-col justify-center space-y-3 pt-5">
          <h1 className=" text-[#C0C0C0] flex space-x-2 justify-start items-baseline">
            <span className="text-2xl">Title</span>
            <BsExclamationCircleFill />{" "}
          </h1>
          <input
            type="text"
            name="Collab Name"
            onChange={(e) => dispatch(addCollabName(e.target.value))}
            className="w-full rounded-xl h-14 bg-transparent text-[#939393]  outline outline-[#939393] px-4"
            placeholder="Write collab title"
          />
        </div>
        {/**********************/}
        <div className="flex flex-col justify-center space-y-3 pt-5">
          <h1 className=" text-[#C0C0C0] flex space-x-2 justify-start items-baseline">
            <span className="text-2xl">Lead name</span>
            <BsExclamationCircleFill />{" "}
          </h1>
          <input
            type="text"
            name="lead name"
            onChange={(e) => dispatch(addLeadName(e.target.value))}
            className="w-full rounded-xl h-14 bg-transparent text-[#939393]  outline outline-[#939393] px-4"
            placeholder="Write lead name"
          />
        </div>
        {/**************************/}
        <div className="flex flex-col justify-center space-y-3 pt-5">
          <h1 className=" text-[#C0C0C0] flex space-x-2 justify-start items-baseline">
            <span className="text-2xl">GitHub URL</span>
            <BsExclamationCircleFill />{" "}
          </h1>
          <input
            type="text"
            name="GitHub"
            onChange={(e) => dispatch(addGitHub(e.target.value))}
            className="w-full rounded-xl h-14 bg-transparent text-[#939393]  outline outline-[#939393] px-4"
            placeholder="Enter GitHub URL"
          />
        </div>
        {/* <div className="flex flex-col justify-center space-y-3 pt-5">
          <h1 className=" text-[#C0C0C0] flex space-x-2 justify-start items-baseline">
            <span className="text-2xl">Contribution-Power</span>
            <BsExclamationCircleFill />{""}
          </h1>
          <input
            type="number"
            name="ContributionPower"
            onChange={(e) => dispatch(addContributionPower(e.target.value))}
            className="w-full rounded-xl h-14 bg-transparent text-[#939393]  outline outline-[#939393] px-4"
            placeholder="Give CPs"
          />
        </div> */}
        {/**************************/}
        <div className="flex flex-col justify-center space-y-3 py-6">
          <h1 className=" text-[#C0C0C0] flex space-x-2 justify-start items-baseline">
            <span className="text-2xl">Description</span>
            <BsExclamationCircleFill />{" "}
          </h1>
          <textarea
            rows={4}
            name="Description"
            onChange={(e) => dispatch(addDescription(e.target.value))}
            className="w-full rounded-xl pt-3  bg-transparent text-[#939393]  outline outline-[#939393] px-4 resize-none"
            placeholder="Write collab description"
          />
        </div>
        <div>
          <button onClick={addLeaderHandler} className={styles.btn}>
            Add Leader
          </button>
        </div>
        <br />
        <hr className=" border border-borderline" />
        <div>
          <p className="text-white py-5 text-2xl xl:text-3xl font-Outfit font-medium ">
            Add Contributor
          </p>
          {memberCount === 0 ? (
            <>
              <button
                onClick={() => {
                  setForm(true);
                }}
                className={styles.btn}
              >
                Add Contributor
              </button>
            </>
          ) : (
            <>
              <div className="flex space-x-2 items-center">
                <h1 className=" text-[#C0C0C0] flex space-x-2 justify-start items-baseline">
                  <span className="text-2xl">Added Member</span>
                  <BsExclamationCircleFill />{" "}
                </h1>
                {/* <button
                  onClick={() => setForm(true)}
                  className="bg-[#6758E5FD] w-20 h-7 rounded-lg flex justify-center items-center font-normal text-white font-Outfit"
                >
                  + Add
                </button> */}
              </div>
            </>
          )}
          {Members.map(({ memberAddress, name, xp }) => {
            return (
              <>
                <div
                  key={memberAddress}
                  className="flex justify-between border-2 border-[#939393] px-3 py-2 rounded-xl my-3"
                >
                  <div>
                    <h1 className="text-lg flex space-x-1">
                      <span className="text-[#636363]">Name:</span>
                      <span className="text-white font-normal">{name}</span>
                    </h1>
                    <h1 className="text-lg flex space-x-1">
                      <span className="text-[#636363]">Address:</span>
                      <span className="text-white font-normal">
                        {memberAddress === ""
                          ? "N/A"
                          : memberAddress.slice(0, 4) +
                            "...." +
                            memberAddress.slice(
                              memberAddress.length - 4,
                              memberAddress.length
                            )}
                      </span>
                    </h1>
                    <h1 className="text-lg flex space-x-1">
                      <span className="text-[#636363]">CPs:</span>
                      <span className="text-white font-normal">
                        {ContributionPower}
                      </span>
                    </h1>
                  </div>
                  <h1
                    onClick={() => RemoveMember(memberAddress)}
                    className="text-[#F24848] text-lg cursor-pointer align-top "
                  >
                    Remove
                  </h1>
                </div>
              </>
            );
          })}
        </div>
        {memberCount != 0 && (
          <>
            {loading && (
              <svg
                className={styles.svgDesign}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            <button
              onClick={async () => {
                await sendData();
                setSuccess(true);
                await transferCp(wallet, memberAddress, xp);
              }}
              className={styles.btn}
            >
              Submit
            </button>
          </>
        )}
        {success && <AdminSuccess setpopup={setPopup} />}
        {form && (
          <>
            <div className="z-40 fixed  transition-opacity w-full">
              <div className="w-full flex justify-center items-center">
                <div className="fixed inset-0  backdrop-blur-sm">
                  <div className="flex justify-center items-center min-h-screen">
                    <div className={styles.InnerCardForm}>
                      <h1 className="text-2xl text-white font-medium font-Outfit py-5">
                        Add a members
                      </h1>
                      <div className="flex flex-col space-y-3">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-start items-center gap-x-2">
                            <h1 className="text-[#D7D7D7] text-lg font-Outfit font-normal">
                              Name *
                            </h1>
                            {/* <p className="text-xs text-white font-medium font-Outfit p-1 px-2 rounded-xl bg-[#6758E5FD]">
                              Required
                            </p> */}
                          </div>
                          <input
                            onChange={(e) => setMemberName(e.target.value)}
                            type="text"
                            placeholder="Enter name"
                            className="w-full rounded-xl h-10 bg-transparent text-[#939393]  outline-none outline-[#939393] px-4"
                          />
                        </div>
                        {/*  */}
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-start items-center gap-x-2">
                            <h1 className="text-[#D7D7D7] text-lg font-Outfit font-normal">
                              Role *
                            </h1>
                            {/* <p className="text-xs text-white font-medium font-Outfit p-1 px-2 rounded-xl bg-[#6758E5FD]">
                              Required
                            </p> */}
                          </div>
                          <input
                            type="text"
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Enter role"
                            className="w-full rounded-xl h-10 bg-transparent text-[#939393]  outline-none outline-[#939393] px-4"
                          />
                        </div>
                        {/*****/}
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-start items-center gap-x-2">
                            <h1 className="text-[#D7D7D7] text-lg font-Outfit font-normal">
                              Wallet Address *
                            </h1>
                            {/* <p className="text-xs text-white font-medium font-Outfit p-1 px-2 rounded-xl bg-[#6758E5FD]">
                              Required
                            </p> */}
                          </div>
                          <input
                            type="text"
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="Enter wallet address "
                            className="w-full rounded-xl h-10 bg-transparent text-[#939393]  outline-none outline-[#939393] px-4"
                          />
                        </div>
                        {/************/}
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-start items-center gap-x-2">
                            <h1 className="text-[#D7D7D7] text-lg font-Outfit font-normal">
                              XPs *
                            </h1>
                            {/* <p className="text-xs text-white font-medium font-Outfit p-1 px-2 rounded-xl bg-[#6758E5FD]">
                              Required
                            </p> */}
                          </div>
                          <input
                            type="number"
                            onChange={(e) =>
                              dispatch(addContributionPower(e.target.value))
                            }
                            placeholder="Enter XPs"
                            className="w-full rounded-xl h-10 bg-transparent text-[#939393]  outline-none outline-[#939393] px-4"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between py-5 space-x-4">
                        <button
                          onClick={() => setForm(false)}
                          className={styles.Innerbtn}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            setForm(false);
                            AddMember();
                            await addContributor(
                              wallet,
                              name,
                              role,
                              memberAddress,
                              xp
                            );
                            console.log("done cp account");
                          }}
                          className={styles.Innerbtn}
                        >
                          Submit Here
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};
