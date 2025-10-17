import { base_url, get, getParams, postJson } from "./instance";

const AUTH_PREFIX = `${base_url}/api/auth_router`;
const SOFTWARE_PREFIX = `${base_url}/api/software_router`;

// 默认错误处理
const defaultError = (error) => console.error('Auth API Error:', error);

// 用户认证相关
export const login = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/login`, param, then, error);

export const modifyPassword = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/modify_password`, param, then, error);

export const resetPassword = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/reset_password`, param, then, error);

export const userOperations = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/user_operations`, param, then, error);

// 权限管理
export const createPermission = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/create_permission`, param, then, error);

export const updatePermission = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/update_permission`, param, then, error);

export const deletePermission = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/delete_permission`, param, then, error);

export const readPermissions = (then, error = defaultError) => 
  get(`${AUTH_PREFIX}/read_permissions`, then, error);

export const getAllPermissionsTree = (then, error = defaultError) => 
  get(`${AUTH_PREFIX}/get_all_permissions_tree`, then, error);

// 角色管理
export const createRole = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/create_role`, param, then, error);

export const updateRole = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/update_role`, param, then, error);

export const deleteRole = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/delete_role`, param, then, error);

export const readRoles = (param, then, error = defaultError) => 
  getParams(`${AUTH_PREFIX}/read_roles`, param, then, error);

// 用户管理
export const createUser = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/create_user`, param, then, error);

export const updateUser = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/update_user`, param, then, error);

export const deleteUser = (param, then, error = defaultError) => 
  postJson(`${AUTH_PREFIX}/delete_user`, param, then, error);

export const readUsers = (param, then, error = defaultError) => 
  getParams(`${AUTH_PREFIX}/read_users`, param, then, error);

// 软件激活
export const activeStatus = (param, then, error = defaultError) => 
  postJson(`${SOFTWARE_PREFIX}/active_status`, param, then, error);

export const getActiveCode = (param, then, error = defaultError) => 
  postJson(`${SOFTWARE_PREFIX}/get_code`, param, then, error);

export const submitActivation = (param, then, error = defaultError) => 
  postJson(`${SOFTWARE_PREFIX}/activation`, param, then, error);
