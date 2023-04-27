import server from "./server";
import React from "react";
function AccountPrivateKeys({fetchData, setFetchData}) {
    const [accountprivatekeys, setaccountprivatekeys] = React.useState([]);
    React.useEffect(()=>{
      if(fetchData){
        server.get(`privateKeyAll`).then((response) => {
            setaccountprivatekeys(response.data); });
      }
      
      return ()=>{setFetchData(false)}
    }, [fetchData])

  return (
    <div className="container accountprivatekeys" key="accountprivatekeysdiv">
      <h1>Private Keys</h1>
      <div hidden>{accountprivatekeys}</div>
      <table>
        <thead>
          <tr>
            <th key={"12askd84asd"}>No.</th>
            <th key={"12askd82fas"}>Private Key</th>
          </tr>
        </thead>
        <tbody>
        {(accountprivatekeys != null) ? accountprivatekeys.map((acc, ind)=><tr key={ind+"dasaiu"}><td className="accountprivatekeys" key={ind+"kuiuewasd"}>{ind+1}</td><td key={String(ind+"ueqoicj")}>{acc}</td></tr>) : null}
        </tbody>
      </table>
    </div>
  );
}

export default AccountPrivateKeys;