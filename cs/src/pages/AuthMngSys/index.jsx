import React, { useEffect } from "react";
import { MyBreadcrumb } from "../../components/CommonCard";
import { Tabs } from "antd";
import User from "./User";
import Role from "./Role";
import Authority from "./Authority";
import Statistics from "./Statistics";
import { useDispatch } from "react-redux";
import {
  getAllPermissionsTree,
  readPermissions,
  readRoles,
} from "../../apis/auth_api";
import { setFieldsValue } from "./authSlice";
import "./ams.less";

// 权限管理系统
function AuthMngSys() {
  const dispatch = useDispatch();
  const auth_menus = [
    {
      label: "用户管理",
      key: "1",
      children: <User />,
    },
    {
      label: "角色管理",
      key: "2",
      children: <Role />,
    },
    {
      label: "权限管理",
      key: "3",
      children: <Authority />,
    },
    {
      label: "使用统计",
      key: "4",
      children: <Statistics />,
    },
  ];
  const initAuth = () => {
    getAllPermissionsTree(
      (res) => {
        const { code, data } = res.data;
        if (code === 0 && data) {
          const { permission_tree = [] } = data;
          dispatch(setFieldsValue({ auth_list: permission_tree }));
        } else {
          dispatch(setFieldsValue({ auth_list: [] }));
        }
      },
      () => {
        dispatch(setFieldsValue({ auth_list: [] }));
      }
    );
  };
  const initRole = () => {
    readRoles(
      { value: "" },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { roles = [] } = data;
          dispatch(setFieldsValue({ role_list: roles }));
        } else {
          dispatch(setFieldsValue({ role_list: [] }));
        }
      },
      () => {
        dispatch(setFieldsValue({ role_list: [] }));
      }
    );
  };
  useEffect(() => {
    console.log("权限管理加载");
    // 默认请求，权限，角色，存放redux
    initAuth();
    initRole();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={["权限管理系统"]} />
      <div class="content_root">
        <Tabs defaultActiveKey="1" type="card" items={auth_menus} />
      </div>
    </div>
  );
}

export default AuthMngSys;
