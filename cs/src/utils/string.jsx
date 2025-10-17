import dayjs from "dayjs";

export const mimeTypes = {
  // 文本类型
  txt: "text/plain",
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  csv: "text/csv",
  js: "application/javascript",
  json: "application/json",
  xml: "application/xml",

  // 文档类型
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",

  // 图像类型
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",

  // 音频类型
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",

  // 视频类型
  mp4: "video/mp4",
  webm: "video/webm",
  ogv: "video/ogg",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",

  // 压缩文件
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",

  // 其他
  bin: "application/octet-stream",
  exe: "application/x-msdownload",
  dmg: "application/x-apple-diskimage",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
  eot: "application/vnd.ms-fontobject",
};
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
