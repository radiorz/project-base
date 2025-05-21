
import { styledLog } from "../lib";
import { SimpleCrypto } from "../lib/crypt";
const crypto = new SimpleCrypto("tikkhbodyencryptdecryptpassword1");
const original = "aaa";
const dtext = crypto.aesEncrypt(original);

// const text = crypto.aesDecrypt(dtext);
// console.log(`dtext`, dtext);
// console.log(`text`, text);
// console.log(`text === original`, text === original);

const style = {
  color: "pink",
  fontWeight: "bold",
  fontSize: "3em",
  padding: "10px 0",
  textShadow:
    "0.7px 1px 0 rgb(255 255 255 / 100%), 1.4px 2px 0 rgb(255 255 255 / 96%), 2.1px 3px 0 rgb(255 255 255 / 92%), 2.8px 4px 0 rgb(255 255 255 / 88%), 1px 1px 2px rgb(100 100 100 / 70%)",
};

styledLog("TIKKHUN", style);
