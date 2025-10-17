import {get, getParams, postJson} from "./instance";

export const login = (param, then, error) => {
  const url = `/api/auth_router/login`;
  postJson(url, param, then, error);
};
// 权限
export const createPermission = (param, then, error) => {
  const url = `/api/auth_router/create_permission`;
  postJson(url, param, then, error);
};
export const updatePermission = (param, then, error) => {
  const url = `/api/auth_router/update_permission`;
  postJson(url, param, then, error);
};
export const deletePermission = (param, then, error) => {
  const url = `/api/auth_router/delete_permission`;
  postJson(url, param, then, error);
};
export const readPermissions = (then, error) => {
  const url = `/api/auth_router/read_permissions`;
  get(url, then, error);
};
export const getAllPermissionsTree = (then, error) => {
  const url = `/api/auth_router/get_all_permissions_tree`;
  get(url, then, error);
};
// 角色
export const createRole = (param, then, error) => {
  const url = `/api/auth_router/create_role`;
  postJson(url, param, then, error);
};
export const updateRole = (param, then, error) => {
  const url = `/api/auth_router/update_role`;
  postJson(url, param, then, error);
};
export const deleteRole = (param, then, error) => {
  const url = `/api/auth_router/delete_role`;
  postJson(url, param, then, error);
};
export const readRoles = (param, then, error) => {
  const url = `/api/auth_router/read_roles`;
  getParams(url, param, then, error);
};
// 用户
export const createUser = (param, then, error) => {
  const url = `/api/auth_router/create_user`;
  postJson(url, param, then, error);
};
export const updateUser = (param, then, error) => {
  const url = `/api/auth_router/update_user`;
  postJson(url, param, then, error);
};
export const deleteUser = (param, then, error) => {
  const url = `/api/auth_router/delete_user`;
  postJson(url, param, then, error);
};
export const readUsers = (param, then, error) => {
  const url = `/api/auth_router/read_users`;
  getParams(url, param, then, error);
};
export const modifyPassword = (param, then, error) => {
  const url = `/api/auth_router/modify_password`;
  postJson(url, param, then, error);
};
export const resetPassword = (param, then, error) => {
  const url = `/api/auth_router/reset_password`;
  postJson(url, param, then, error);
};
export const userOperations = (param, then, error) => {
  const url = `/api/auth_router/user_operations`;
  postJson(url, param, then, error);
};
export const create_employee = (param, then, error) => {
  const url = `/api/employee_router/create_employee`;
  postJson(url, param, then, error);
};
export const read_all_employees = (param, then, error) => {
  const url = `/api/employee_router/read_all_employees`;
  return postJson(url, param, then, error);
};
export const update_employee = (param, then, error) => {
  const url = `/api/employee_router/update_employee`;
  postJson(url, param, then, error);
};
export const delete_employee = (param, then, error) => {
  const url = `/api/employee_router/delete_employee`;
  postJson(url, param, then, error);
};
export const create_department = (param, then, error) => {
  const url = `/api/department/create_department`;
  postJson(url, param, then, error);
};
export const read_all_departments = (param, then, error) => {
  const url = `/api/department/read_all_departments`;
  return postJson(url, param, then, error);
};
export const update_department = (param, then, error) => {
  const url = `/api/department/update_department`;
  postJson(url, param, then, error);
};
export const delete_department = (param, then, error) => {
  const url = `/api/department/delete_department`;
  postJson(url, param, then, error);
};

