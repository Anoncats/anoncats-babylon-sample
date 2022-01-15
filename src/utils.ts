import { ethers } from "ethers";

const connectToInjectedProvider = async (window) => {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner()  

  return signer;
}

export { connectToInjectedProvider };