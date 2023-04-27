import server from "./server";
import React from "react";
function Account({fetchData, setFetchData}) {
    const [account, setAccount] = React.useState(null);
    const [balances, setBalances] = React.useState(null)
    React.useEffect(()=>{
      if(fetchData){
        server.get(`accounts`).then((response) => {
        setAccount(response.data);
        })

        server.get(`balanceAll`).then((response) => {
          setBalances(response.data);
        })
      }

      return ()=>{setFetchData(false)}

    }, [fetchData])

  return (
    <div className="container accounts" key={"accountsdiv"}>
      <h1>Accounts</h1>
      <div hidden>{account}</div>
      <table>
        <thead>
          <tr>
            <th key={"12askd84"}>No.</th>
            <th key={"12askd82"}>Wallet Address</th>
            <th key={"12ask652"}>Balance</th>
          </tr>
        </thead>
        <tbody className="centerText">
        {(account != null) ? account.map((acc, ind)=><tr key={ind+acc.slice(6)}><td className="accounts" key={ind+acc.slice(4)}>{ind+1}</td><td key={String(ind+acc.slice(7))}>{acc}</td><td>{(balances) ? balances[ind] : null}</td></tr>) : null}
        </tbody>
      </table>
    </div>
  );
}

export default Account;