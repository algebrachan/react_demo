import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { routes } from "./route";
import { getSession } from "./utils/storage";
import "./App.css";

// 定义无需检查的路径列表为常量，避免每次调用函数都重新创建数组
const uncheckedUrl = (pathname) => {
  let unchecked_list = [
    "/workshop",
    "/melting_monitor_input",
    "/melting_monitor_record",
    "/activation",
    "/mng/err_handle_ocap",
    "large_screen",
    "/test",
  ];
  return unchecked_list.some((str) => pathname.includes(str));
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (uncheckedUrl(location.pathname)) {
      return;
    }
    // 进行登录校验
    const user_str = getSession("user_info");
    // 获取权限菜单,并渲染菜单,redux?
    // 没有保存用户跳转到登录
    if (!user_str) {
      navigate("/login");
    } else {
      // const user_info = JSON.parse(user_str);
      const { role_ids = [] } = JSON.parse(user_str);
      if (role_ids.includes(0)) {
        // 如果是超管，没有限制
        return;
      } else {
        const permissions_str = getSession("permissions");
        if (permissions_str) {
          let val = JSON.parse(permissions_str);
          // 过滤菜单
          let permissions_list = val
            .filter((e) => e.menu_type === "菜单")
            .map((e) => e.path);
          if (!permissions_list.includes(location.pathname)) {
            navigate("/mng/404");
          }
          // 获取路径
        } else {
          navigate("/mng/404");
        }
      }
    }
    return () => {
      // 销毁之前执行
    };
  }, []);
  let element = useRoutes(routes);
  return element;
}

export default App;
