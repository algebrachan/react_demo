const { sessionStorage, localStorage } = window;

export function getSession(key, dv = "") {
  let str = sessionStorage.getItem(key);
  if (!str || str === null) {
    return dv;
  } else {
    return str;
  }
}

export function setSession(key, value) {
  sessionStorage.setItem(key, value);
}
export function setSessionObj(key, obj) {
  sessionStorage.setItem(key, JSON.stringify(obj));
}

export function getLocal(key, dv = "") {
  let str = localStorage.getItem(key);
  if (!str || str === null) {
    return dv;
  } else {
    return str;
  }
}

export function setLocal(key, value) {
  localStorage.setItem(key, value);
}
// 设置对象为session
export function setObj2Session(obj) {
  Object.keys(obj).forEach((key) => {
    sessionStorage.setItem(key, obj[key]);
  });
}

// 登出
export function logout() {
  //清空sessionStorage中所有信息
  sessionStorage.clear();
}
