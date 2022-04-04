const {provider} = useWeb3();

const signer = provider.getSigner();

const tx = signer.sendTransaction({
    to: "ringaile.eth",
    value: ethers.utils.parseEther("1.0")
});