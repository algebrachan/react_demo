import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    role_list: [],
    auth_list: [],
  },
  reducers: {
    setCommonParam: (state, action) => {
      // 单个修改
      const { param_name, param_val } = action.payload;
      let val = JSON.parse(JSON.stringify(param_val));
      state[param_name] = { ...state[param_name], ...val }; // 重写内存地址
    },
    setFieldsValue: (state, action) => {
      // 批量修改
      const obj = JSON.parse(JSON.stringify(action.payload));
      Object.keys(obj).forEach((e) => {
        state[e] = obj[e];
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCommonParam, setFieldsValue } = authSlice.actions;

export const authReducer = authSlice.reducer;
