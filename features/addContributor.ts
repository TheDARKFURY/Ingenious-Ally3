import * as spl from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import * as collabs from "../collabs/js/src/generated";
import { WalletContextState } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
export async function addContributor(
  wallet: WalletContextState,
  gitname: string,
  role: string,
  contributorWalletAddress: string,
  cp: number
) {
  const bonkMint = new anchor.web3.PublicKey(
    "GUwYWmcaThJHjM9W91M3kdkbW9GHiMv4PaJn8uBTT2MW"
  );
  const leaderTokenAcc = await spl.getAssociatedTokenAddress(
    bonkMint,
    wallet.publicKey
  );
  const [gitRepoPda, gitbump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("git_repo_xp_pool"), wallet.publicKey.toBuffer()],
    collabs.PROGRAM_ID
  );
  let contributorPubkey = new anchor.web3.PublicKey(contributorWalletAddress);
  const [contributorPda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("contributor"), contributorPubkey.toBuffer()],
    collabs.PROGRAM_ID
  );

  const ix = collabs.createCreateContributorInstruction(
    {
      leader: wallet.publicKey,
      contributor: contributorPubkey,
      systemProgram: anchor.web3.SystemProgram.programId,
      gitRepoXpPoolAccount: gitRepoPda,
      contributorAccount: contributorPda,
    },
    {
      contributorGitName: gitname,
    }
  );

  const tx = new anchor.web3.Transaction();
  tx.add(ix);
  const sig = await wallet.sendTransaction(
    tx,
    new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"))
  );
  console.log(sig);
}
