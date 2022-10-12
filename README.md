# Ethereum standard examples

## Getting started
If you use VS Code, install the Solidity extension.
1. Run `npm i`
2. Open the Remix IDE at https://remix.ethereum.org/
3. Run `npm run connect` to connect to Remix IDE

## Compile and run on Remix IDE
1. Select the "Solidity compiler" section and compile the contract
2. Select the "Deploy & run transaction" section and deploy the contract

### ERC165Example
3. Deploy the A contract first
4. Deploy the B contract then, adding the A address previously deployed (click "copy" on the deployed A instance)
5. Call the `checkIfASupportsInterface` function with these values:
    - 0x00000000 - wrong value
    - 0x01ffc9a7 - `supportInterface` selector, correct value
    - 0x35e23170 - `Letter` selector (XOR of `getLetter` and `setLetter`), correct value

Contract A extends contact ERC165, which has only one function, and provides 2 functions (a getter and a setter); the result of "supportInterface" is calculated as the quality of the parameter and the selector for "supportInterface" or the XOR of getters and setters provided by the contract.