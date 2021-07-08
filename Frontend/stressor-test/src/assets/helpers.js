import { nanoid } from "nanoid";

export const removeEmpty = function(obj) {
  for (let p in obj) {
    if (!obj[p]) {
      delete obj[p];
    }
  }
  return obj;
};

export const createNanoId = function() {
  return nanoid();
};

export const copyToClipboard = function(msg) {
  let tempInput = document.createElement("input");
  tempInput.value = msg;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
};
