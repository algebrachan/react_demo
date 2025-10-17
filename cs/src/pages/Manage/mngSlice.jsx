import { createSlice } from "@reduxjs/toolkit";

export const mngSlice = createSlice({
  name: "mng",
  initialState: {
    single_form: {
      时间: ["", ""],
      工厂: "",
      车间: "",
      工序: "",
      机台: "",
      图号: "",
      坩埚编号: "",
    },
    quality_form: {
      时间: ["", ""],
      工厂: "",
      车间: "",
      工序: "",
      机台: "",
      图号: "",
      坩埚编号: "",
    },
    workshop: {
      cur_work: "原料",
    },
    qms: {
      inspection_tab: "1",
      inspection_code: "",
      cur_dcc_file_type: "全部流程",
      person: "",
      department: "",
      user_list: [],
    },
  },
  reducers: {
    setCommonParam: (state, action) => {
      const { param_name, param_val } = action.payload;
      let val = JSON.parse(JSON.stringify(param_val));
      state[param_name] = { ...state[param_name], ...val }; // 设置多个参数项
    },
    setParam: (state, action) => {
      // 单独设置某个参数
      const { param_name, param_val } = action.payload;
      state[param_name] = param_val;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCommonParam } = mngSlice.actions;

export const mngReducer = mngSlice.reducer;
