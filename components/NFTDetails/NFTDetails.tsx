import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';

import {GetTransactionRespT, TransactionStatusE} from '@/types';
import {useWeb3} from '@/hooks/useWeb3';
import TransferNFTForm from '@/components/TransferNFTForm/TransferNFTForm';
import {Box, Card, Field, Heading, IconNFT, Text, Button, Input} from 'degen';
import {ErrorBlock, Loader} from '..';
import {ethers} from 'ethers';

type NFTDetailsProps = {
  transaction: GetTransactionRespT;
};

const NFTDetails = (props: NFTDetailsProps): JSX.Element | null => {
  const {transaction} = props;
  const {contract, address, provider} = useWeb3();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<number>();
  const [nftOwner, setNftOwner] = useState<string | null>(null);

  const getInitialData = async () => {
    try {
      if (contract) {
        setError(null);
        setLoading(true);

        const tokenId = await contract.tokenURIToTokenId(transaction.id);
        const owner = await contract.ownerOf(tokenId);

        setTokenId(tokenId.toNumber());
        setNftOwner(owner);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const isOwner = useMemo(() => address === nftOwner, [address, nftOwner]);

  if (error) {
    return <ErrorBlock title="Fetching failed" message={error} />;
  }

  if (loading) {
    return <Loader />;
  }

const handleSubmit = async e =>  {
    e.preventDefault();
    if (address && provider && contract && nftOwner) {
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: nftOwner,
        value: ethers.utils.parseEther(amount)
      });

      alert('Sent ' + amount + " ether");
    }
    
  }

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.currentTarget.value);
  };

  if (transaction.status === TransactionStatusE.CONFIRMED) {
    return (
      <>
        {tokenId ? (
          <Card>
            <Box paddingTop="4" paddingX="4">
              <Field label={<IconNFT />}>
                <Box padding="4">
                  <Text>Token Id: {tokenId}</Text>
                  <Text>Owner: {nftOwner}</Text>
                  
                  <Input
                    label="Amount"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="amount..."
                    required
                    hideLabel
                  />
                  <form onSubmit={handleSubmit}>
                      <Button type="submit"
                      variant="highlight"
                      width={{xs: 'full', md: 'max'}}
                      >Tip</Button>
                  </form>
                    
                  {isOwner && (
                    <Box
                      marginTop="5"
                      padding="5"
                      backgroundColor="backgroundTertiary"
                      borderRadius="extraLarge"
                    >
                      <Field label="Transfer NFT">
                        <TransferNFTForm
                          tokenId={tokenId}
                          onSubmitted={getInitialData}
                        />
                      </Field>
                    </Box>
                  )}
                </Box>
              </Field>
            </Box>
          </Card>
        ) : (
          <ErrorBlock
            icon={<IconNFT color="red" />}
            title="Not found"
            message="Token hasn't been minted yet"
          />
        )}
      </>
    );
  }

  return null;
};

export default NFTDetails;
