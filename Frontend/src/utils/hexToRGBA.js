// https://stackoverflow.com/a/53936623

const isValidHex = (hex) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);

const getChunksFromString = (st, chunkSize) =>
  st.match(new RegExp(`.{${chunkSize}}`, "g"));

const convertHexUnitTo256 = (hexStr) =>
  parseInt(hexStr.repeat(2 / hexStr.length), 16);

const getAlphaFloat = (a, alpha) => {
  if (typeof a !== "undefined") return a;
  if (typeof alpha != "number" || alpha < 0 || alpha > 1) return 255;
  return alpha;
};

export const hexToRGBA = (hex, alpha) => {
  if (!isValidHex(hex)) throw new Error("Invalid HEX");
  const chunkSize = Math.floor((hex.length - 1) / 3);
  const hexArr = getChunksFromString(hex.slice(1), chunkSize);
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
  return { r, g, b, a: getAlphaFloat(a, alpha) };
};
