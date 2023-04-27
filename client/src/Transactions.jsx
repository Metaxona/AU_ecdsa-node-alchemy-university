import server from "./server";
import React from "react";
function History({fetchData, setFetchData}) {
    const [history, setHistory] = React.useState(null);

    React.useEffect(()=>{
      if(fetchData){
        server.get(`history`).then((response) => {
          setHistory(response.data);
        })
      }
      return ()=>{setFetchData(false)}
    }, [fetchData])
      
  return (
    <div className="container accounts" key={"accountsdiv"}>
      <h1>Transaction History</h1>
      <table className="table">
        <thead>
          <tr>
            <th key={"12askd84"}>Sender</th>
            <th key={"12askd82"}>Recipient</th>
            <th key={"12askd87"}>Amount</th>
            <th key={"12ask347"}>Timestamp</th>
          </tr>
        </thead>
        <tbody className="centerText">
        {
        (history != null) 
        ? history.map(
          (hist, ind)=><tr key={ind+"kasjdiu"}><td className="history" key={ind+"dakjoiu"}>{hist.sender.slice(0,5) + "..." + hist.sender.slice(-5)}</td><td key={ind+"owerird"}>{hist.recipient.slice(0,5) +"..."+ hist.recipient.slice(-5)}</td><td key={ind+"owerirtyrd"}>{hist.amount || null}</td><td>{hist.date}</td></tr>) 
        : null}
        </tbody>
      </table>
    </div>
  );
}

export default History;