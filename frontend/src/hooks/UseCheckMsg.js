/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

function UseCheckMsg() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [msg, setMsg] = useState(null);

  const checkMsg = () => {
    if (msg) {
      alert(msg);
    }
  }

  useEffect(() => {
    setMsg(urlParams.get("msg"));
    checkMsg();
  }, [msg]);
}

UseCheckMsg.propTypes = {};

export default UseCheckMsg;