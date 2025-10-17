import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {read_all_departments} from "@/apis/auth_api.jsx";
import {genTreeData} from "@/utils/utils.js";
// 异步获取用户数据
export const getDeptData = createAsyncThunk(
  'system/getDept',
  async (forceUpdate = false, thunkAPI) => {
    const {fulfillWithValue, rejectWithValue, getState} = thunkAPI
    try {
      const {dept: {data, rawTreeData, selectTreeData}} = getState()
      if (data.length === 0 || forceUpdate) {
        const fetchData = await read_all_departments({display_name: ''}, ({data: {data}}) => data)
        const sortedData = fetchData.sort((a, b) => a.sort - b.sort)
        const selectTreeData = genTreeData(sortedData, {
          parentIdKey: 'parent_id',
          includes: [['id', 'value'], ['display_name', 'title']]
        })
        const rawTreeData = genTreeData(sortedData, {parentIdKey: 'parent_id'})
        return fulfillWithValue({data: fetchData, selectTreeData, rawTreeData})
      } else {
        return fulfillWithValue({data, selectTreeData, rawTreeData})
      }
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);
const deptSlice = createSlice({
  name: 'dept',
  initialState: {
    data: [],
    rawTreeData: [],
    selectTreeData: [],
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getDeptData.fulfilled, (state, action) => {
      const {data, selectTreeData, rawTreeData} = action.payload;
      state.data = data
      state.rawTreeData = rawTreeData
      state.selectTreeData = selectTreeData
      state.error = null;
    })
    .addCase(getDeptData.rejected, (state, action) => {
      state.error = action.payload;
    });
  }
});
export default deptSlice.reducer;
