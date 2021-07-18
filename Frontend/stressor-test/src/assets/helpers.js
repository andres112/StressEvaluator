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

export const textLength = function(text, context) {
  const LENGTHS = new Map([
    ["xs", 10],
    ["sm", 20],
    ["md", 30],
    ["lg", 50],
    ["xl", 75],
  ]);
  const len = LENGTHS.get(context.$vuetify.breakpoint.name);
  return text.length > len ? `${text.slice(0, len)}...` : text;
};

export const copyToClipboard = function(msg) {
  let tempInput = document.createElement("input");
  tempInput.value = msg;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
};

export const navigationType = function() {
  // Detect the type of navigation to implement actions
  let res = 0;
  if (window.performance.getEntriesByType("navigation")) {
    const p = window.performance.getEntriesByType("navigation")[0].type;
    if (p == "navigate") res = 0;
    if (p == "reload") res = 1;
    if (p == "back_forward") res = 2;
    if (p == "prerender") res = 3;
  }
  return res;
};
