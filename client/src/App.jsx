import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Account from "./Account";
import AccountPrivateKeys from './AccountPrivKeys';
import NewAccount from './GenerateNewAccount';
import History from './Transactions';
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setprivateKey] = useState("");
  const [fetchData, setFetchData] = useState(true);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey} 
        setprivateKey={setprivateKey}
      />
      <Transfer balance={balance} setBalance={setBalance} address={address} privateKey={privateKey} setFetchData={setFetchData} />
      <Account fetchData={fetchData} setFetchData={setFetchData} />
      <AccountPrivateKeys fetchData={fetchData} setFetchData={setFetchData} />
      <History fetchData={fetchData} setFetchData={setFetchData} />
      <NewAccount fetchData={fetchData} setFetchData={setFetchData} />
    </div>
  );
}

export default App;
