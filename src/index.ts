import { getMerkleProof, getMerkleRoot, keypairIdentity, Metadata, Metaplex, programModule, sol, toBigNumber, toDateTime, token } from '@metaplex-foundation/js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import allowLists from './allow-lists-prod';
const secret = JSON.parse(process.env.PK as string);
const keypair = Keypair.fromSecretKey(new Uint8Array(secret))
const connection = new Connection(process.env.RPC_HOST as string, 'confirmed')
const CM_ID = process.env.CM_ID as string;
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

//devnet
// const xinToken = new PublicKey('FzGQM7yLGg8Kdk3hqCNVEGgjC7VRRs2kpF1R83cbDq3k');
// const xinWlToken = new PublicKey('55y9fk2WLBmeUNwtP6tyJ5VCqJjZpcGsDwiiib3Urftb');
// const bonk = new PublicKey('EdXC6Yib5ntdCNSSnxjZU9Px6LX2KACY49otT3oDPhyb');
// const burnMintToken = new PublicKey('E3W3ZZwJ3pPHaq176n8zXDMnGi1qEXwQ67JM2vD1bws1');

// prod
const xinToken = new PublicKey('FBdRvc9CmHUf8ib2sV8PDv2oiFAmyxoftjid3Uv9e4kK');
const xinWlToken = new PublicKey('AyXGAXN9FPygt1ggTf1NtUL8P4YLofq5PKn1oQckM7vH');
const bonk = new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263');
const burnMintToken = new PublicKey('BpAyvn8Y4hKdugPpjQPEADAU8XPPH4YKssp8oJDYHESM');

(async () => {
  const candyMachine = await metaplex.candyMachines().findByAddress({ address: new PublicKey(CM_ID) });

  await metaplex.candyMachines().update({
    candyMachine,
    groups: [
      {
        label: "Mitsu",
        guards: {
          startDate: { date: toDateTime("2023-01-04T20:00:00Z") },
          nftBurn: {
            requiredCollection: new PublicKey('EBuL9wduTnC19iatgCQuufKN3K9H2iuZycRPrbEsXkCs')
          },
        },
      },
      {
        label: 'LGCY',
        guards: {
          startDate: { date: toDateTime("2023-01-04T20:00:00Z")},
          nftBurn: {
            requiredCollection: new PublicKey('6Ruqus3woChBxANdnVr2aMpHDoYn9cWcGHyV5opr7MRP')
          },
        }
      },
      {
        label: 'Burned',
        guards: {
          startDate: { date: toDateTime("2023-01-04T20:00:00Z")},
          tokenBurn: {
            amount: token(1, 0),
            mint: burnMintToken,
          },
        }
      },
      {
        label: "$XIN",
        guards: {
          startDate: { date: toDateTime("2023-01-04T20:00:00Z") },
          nftGate: {
            requiredCollection: new PublicKey('3YZDCKyZmpp9oLszDFiduocKfChZRqcfCaXwCT3yucbJ')
          },
          tokenPayment: {
            amount: token(1000, 6),
            mint: xinToken,
            destinationAta: metaplex.tokens().pdas().associatedTokenAccount({
              mint: xinToken,
              owner: metaplex.identity().publicKey,
            }),
          },
          tokenBurn: {
            amount: token(1, 0),
            mint: xinWlToken,
          },
        },
      },
      // {
      //   label: "FFA",
      //   guards: {
      //     // startDate: { date: toDateTime("2023-01-05T10:30:00Z") },
      //     // nftGate: {
      //     //   // LIVE
      //     //   // requiredCollection: new PublicKey('3YZDCKyZmpp9oLszDFiduocKfChZRqcfCaXwCT3yucbJ')
      //     //   // DEVNET
      //     //   requiredCollection: new PublicKey('8fwJkoyqNWG4V3nBtY8QUSZYwg9Hg5zEMExZsGuZJ1NE')
      //     // },
      //     tokenPayment: {
      //       amount: token(1000, 6),
      //       mint: xinToken,
      //       destinationAta: metaplex.tokens().pdas().associatedTokenAccount({
      //         mint: xinToken,
      //         owner: metaplex.identity().publicKey,
      //       }),
      //     },
      //     // addressGate: {
      //     //   address: myWallet
      //     // }
      //   },
      // },
      {
        label: "$BONK",
        guards: {
          startDate: { date: toDateTime("2023-01-04T20:00:00Z") },
          tokenBurn: {
            amount: token(10_000_000, 5),
            mint: bonk,
          },
          tokenPayment: {
            amount: token(30_000_000, 5),
            mint: bonk,
            destinationAta: metaplex.tokens().pdas().associatedTokenAccount({
              mint: bonk,
              owner: metaplex.identity().publicKey,
            }),
          },
        },
      },
    ],

  });

  // await metaplex.candyMachines().callGuardRoute({
  //   candyMachine,
  //   guard: 'freezeSolPayment',
  //   group: 'OG',
  //   settings: {
  //     path: 'initialize',
  //     period: 30 * 24 * 60 * 60, // 30 days.
  //     candyGuardAuthority: metaplex.identity(),
  //   },
  // });

  // const candyGuard = await metaplex.candyMachines().findCandyGuardByAddress({ address: new PublicKey('HdFaCyZaZsy5HPGENBzviPkC1UAJ2mJ7zHPeWs851Swp')})

  // const limiter = new Bottleneck({
  //   minTime: 60
  // });

  // const limited = limiter.wrap(updateRoyalties);

  // async function updateRoyalties(nft: any, i: number) {
  //   await metaplex.nfts().update({
  //     nftOrSft: nft,
  //     sellerFeeBasisPoints: 500
  //   })
  //   console.log('updated', i)
  // }

  // async function thawNft(nft: any) {
  //   const largestAccounts = await connection.getTokenLargestAccounts(nft.mintAddress);
  //   const largestAccountInfo = await connection.getParsedAccountInfo(
  //     largestAccounts.value[0].address
  //   );
  //   const owner = get(largestAccountInfo, 'value.data.parsed.info.owner');

  //   try {
  //     await metaplex.candyMachines().callGuardRoute({
  //       candyMachine: {
  //         address: new PublicKey(CM_ID),
  //         candyGuard
  //       },
  //       guard: 'freezeSolPayment',
  //       group: 'Public',
  //       settings: {
  //         path: 'thaw',
  //         nftMint: nft.mintAddress,
  //         nftOwner: new PublicKey(owner)
  //       },
  //     });
  //     console.log('Thawed', nft.mintAddress.toBase58());
  //   } catch (err) {
  //     console.log(err)
  //     console.log('skipping', nft.mintAddress.toBase58())
  //   }
  // }

  // await metaplex.candyMachines().callGuardRoute({
  //   candyMachine: {
  //     address: new PublicKey(CM_ID),
  //     candyGuard
  //   },
  //   guard: 'freezeSolPayment',
  //   group: 'Public',
  //   settings: {
  //     path: 'unlockFunds',
  //     candyGuardAuthority: metaplex.identity(),
  //   },
  // });
  
  console.log('done')
    
})();