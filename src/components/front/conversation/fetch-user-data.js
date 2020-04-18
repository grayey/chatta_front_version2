import axios from "axios";
import {
  isChrome,
  isFirefox,
  isEdge,
  isOpera,
  isIE,
  isSafari,
} from "react-device-detect";
const getDate = () => {
  const time = new Date();
  return `${
    time.getMonth() + 1
  }/${time.getDate()}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
};

const getBrowser = () => {
  let browser = "";
  switch ("true") {
    case isChrome.toString():
      browser = "Chrome";
      break;
    case isFirefox.toString():
      browser = "Firefox";
      break;
    case isOpera.toString():
      browser = "Opera";
      break;
    case isIE.toString():
      browser = "IE";
      break;
    case isEdge.toString():
      browser = "Edge";
      break;
    default:
      browser = "Safari";
      break;
  }

  return browser;
};
const getUserData = async () => {
  const browser = getBrowser();
  const continentCodes = {
    AS: "Asia",
    AF: "Africa",
    AN: "Antarctica",
    NA: "North America",
    EU: "Europe",
    OC: "Ocenia",
    SA: "South America",
  };

  try {
    const result = await axios.get("https://ipapi.co/json/");

    const visitor = result.data;
    visitor.continent_name = continentCodes[visitor.continent_code];
    visitor.time = getDate();
    visitor.browser = browser;
    visitor.region_name = visitor.region;
    visitor.type = "ipv4";
    return visitor;
  } catch (error) {
    return error;
  }
};
export default getUserData;
