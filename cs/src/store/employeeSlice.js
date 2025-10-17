import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {read_all_employees} from "@/apis/auth_api.jsx";
// 异步获取用户数据
export const getEmployeeData = createAsyncThunk(
  'system/getEmployee',
  async (forceUpdate = false, thunkAPI) => {
    const {fulfillWithValue, rejectWithValue, getState} = thunkAPI
    try {
      const {employee: {data}} = getState()
      if (data.length === 0 || forceUpdate) {
        const fetchData = await read_all_employees({page: 1, limit: 9999}, ({data: {data}}) => data)
        return fulfillWithValue(fetchData)
      } else {
        return fulfillWithValue(data)
      }
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);
const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    data: [],
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getEmployeeData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.error = null;
    })
    .addCase(getEmployeeData.rejected, (state, action) => {
      state.error = action.payload;
    });
  }
});
export default employeeSlice.reducer;
