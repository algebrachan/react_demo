import dayjs from "dayjs";

export function isString(str) {
  return typeof str === "string" && str.constructor === String;
}

export const getCurrentTime = () => {
  return dayjs().unix();
};
export function isValidIP(ip) {
  var reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(ip);
}

export const dateFormat = "YYYY-MM-DD";
export const monthFormat = "YYYY/MM";
export const timeFormat = "YYYY-MM-DD HH:mm:ss";

export const selectList2Option = (list = [], cls = "") => {
  return list.map((e) => ({
    label: e,
    value: e,
    className: cls,
  }));
};
export const selectList2OptionAll = (list = [], cls = "") => {
  const temp_list = JSON.parse(JSON.stringify(list));
  // 判断 有没有全部
  if (!temp_list.includes("全部")) {
    temp_list.unshift("全部");
  }
  return temp_list.map((e) => ({
    label: e,
    value: e,
    className: cls,
  }));
};

export const lerpColor = (color1, color2, weight) => {
  const [r1, g1, b1] = color1.match(/\w\w/g).map((hex) => parseInt(hex, 16));
  const [r2, g2, b2] = color2.match(/\w\w/g).map((hex) => parseInt(hex, 16));

  const r = Math.round(r1 + (r2 - r1) * weight)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(g1 + (g2 - g1) * weight)
    .toString(16)
    .padStart(2, "0");
  const b = Math.round(b1 + (b2 - b1) * weight)
    .toString(16)
    .padStart(2, "0");

  return `#${r}${g}${b}`;
};

export const incrementStringAtPosition = (str, start, end) => {
  if (start < 0 || end >= str.length || start > end) {
    throw new Error("Invalid start or end index");
  }

  const targetPart = str.substring(start, end + 1);
  let number = parseInt(targetPart, 10);

  if (isNaN(number)) {
    throw new Error("The extracted part is not a valid number");
  }

  number += 1;

  const incrementedString = String(number)
    .padStart(end - start + 1, "0")
    .slice(-(end - start + 1));

  const result =
    str.substring(0, start) + incrementedString + str.substring(end + 1);

  return result;
};
