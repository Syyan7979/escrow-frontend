# Escrow Frontend

This project is part of the mini-project 2 for CS 173, which focuses on topics in software technology, specifically blockchain technologies.

## Deployed Netlify URL

The frontend for this project is deployed on Netlify and can be accessed at: [https://643d8df0ee189a0008cdede1--delicate-semifreddo-ead992.netlify.app](https://643d8df0ee189a0008cdede1--delicate-semifreddo-ead992.netlify.app)

## Requirements to Use the App

To use the app, you will need an account with one of the following addresses:

- Owner / Counterparty: `tz1hR44gwZNVWGJFUQiRJdedvCmAdPUHgkBC` or `tz1SWWafK382BqUpgsv26qDJUmswxWYX5Xq`
- Admin: `tz1MLvzp18yuBX6umbSPAEgeJnqAzm65w9Zq`

## App Navigation

The app has the following navigation:

1. Initial Look: The app's initial look, which provides an overview of the functionality.

<div align="center">
  <img src="https://i.ibb.co/nMgHG3z/1.png" alt="Initial Look Screenshot">
</div>

2. Connecting Wallet Account: Users can connect their wallet account with any of the required addresses.

<div align="center">
  <img src="https://i.ibb.co/HP1qMyx/2.png" alt="Connecting Wallet Account Screenshot">
</div>

3. Contract View: Once an account is connected, the view is updated to show all the contracts that the account either owns or is a counterparty to.

<div align="center">
  <img src="https://i.ibb.co/M9gKvwN/3.png" alt="Contract View 1 Screenshot">
  <img src="https://i.ibb.co/yXTkpPK/4.png" alt="Contract View 2 Screenshot">
  <img src="https://i.ibb.co/t8bd5BT/5.png" alt="Contract View 3 Screenshot">
</div>

4. Contract Actions: Users can click on the contracts to see what actions they can perform. The available actions are based on their role for that contract, such as owner, counterpart, or admin.

<div align="center">
  <img src="https://i.ibb.co/gwbrHDr/6.png" alt="Contract Actions 1 Screenshot">
  <img src="https://i.ibb.co/1M7g7SD/7.png" alt="Contract Actions 2 Screenshot">
  <img src="https://i.ibb.co/NFBRJbp/8.png" alt="Contract Actions 3 Screenshot">
</div>

## Note

Please note that the "Create Contract" button opens a modal where you can enter the values for the contract to be created. However, the app currently does not support the actual creation of a contract when you click on the "Create" button inside the modal. This is because it requires the use of creating a child process to run the smartpy compile command, which Netlify does not support.
