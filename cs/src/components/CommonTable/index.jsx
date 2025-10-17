import React, { useMemo, useState } from "react";
import { debounce } from "lodash";
import {
  Button,
  Divider,
  Space,
  Table,
  DatePicker,
  Checkbox,
  InputNumber,
  Input,
} from "antd";
import dayjs from "dayjs";
import { timeFormat } from "../../utils/string";

// 通用筛选逻辑处理器
const filterHandlers = {
  string: (value, record, dataIndex) => {
    const cellValue = record[dataIndex] || "";
    return cellValue.toString().includes(value.toString());
  },
  number: (value, record, dataIndex) => {
    if (!Array.isArray(value)) return true;
    const [min, max] = value.map((v) => (v === null ? NaN : Number(v)));
    const numericValue = Number(record[dataIndex]) || 0;
    if (isNaN(min) && isNaN(max)) return true;
    if (isNaN(min)) return numericValue <= max;
    if (isNaN(max)) return numericValue >= min;

    return numericValue >= min && numericValue <= max;
  },
  date: (value, record, dataIndex) => {
    if (!value || value.length !== 2) return true;
    const [start, end] = value;
    const cellValue = record[dataIndex] ? dayjs(record[dataIndex]) : null;
    if (!cellValue) return false; // 跳过空值记录
    return cellValue.isAfter(dayjs(start)) && cellValue.isBefore(dayjs(end));
  },
};

// 带缓存的唯一值计算
const useUniqueValues = (dataSource, dataIndex) => {
  return useMemo(() => {
    return [
      ...new Set(
        dataSource
          .map((record) => record[dataIndex])
          .filter(Boolean)
          .sort()
      ),
    ];
  }, [dataSource, dataIndex]);
};

// 生成增强列配置

const CommonTable = ({ columns, dataSource, onFilterChange }) => {
  const enhancedColumns = columns.map((column) => {
    const commonProps = {
      ...column,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <FilterDropdown
          column={column}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          dataSource={dataSource}
        />
      ),
    };

    if (column.type === "string") {
      return {
        ...commonProps,
        filters: [],
        onFilter: (value, record) =>
          filterHandlers.string(value, record, column.dataIndex),
      };
    }

    if (
      column.type === "number" ||
      column.type === "int" ||
      column.type === "float"
    ) {
      return {
        ...commonProps,
        filterMode: "tree",
        onFilter: (value, record) =>
          filterHandlers.number(value, record, column.dataIndex),
      };
    }
    if (column.type === "date") {
      return {
        ...commonProps,
        filterMode: "tree",
        onFilter: (value, record) =>
          filterHandlers.date(value, record, column.dataIndex),
      };
    }

    return column;
  });
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 10,
  };
  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { currentDataSource = [] } = extra;
    // 筛选逻辑
    onFilterChange?.({ filters, currentDataSource });
  };
  return (
    <Table
      columns={enhancedColumns}
      dataSource={dataSource}
      size="small"
      scroll={{
        x: "max-content",
      }}
      pagination={pagination}
      onChange={handleTableChange}
    />
  );
};

// 独立筛选组件
const FilterDropdown = ({
  column,
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
  dataSource,
}) => {
  const uniqueValues = useUniqueValues(dataSource, column.dataIndex);

  const handleRangeConfirm = () => {
    confirm();
  };

  if (column.type === "string") {
    if (["炉次号", "设备号"].includes(column.title)) {
      const [searchValue, setSearchValue] = useState("");
      const handleSearch = useMemo(
        () =>
          debounce((value) => {
            setSearchValue(value);
          }, 300),
        []
      );

      const filteredValues = useMemo(
        () =>
          uniqueValues.filter((value) =>
            value.toLowerCase().includes(searchValue.toLowerCase())
          ),
        [uniqueValues, searchValue]
      );
      return (
        <div style={{ padding: 8 }}>
          <Input.Search
            placeholder="输入搜索内容"
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 2 }}
          />
          <Checkbox
            indeterminate={
              selectedKeys.length > 0 &&
              selectedKeys.length < filteredValues.length
            }
            checked={selectedKeys.length === filteredValues.length}
            onChange={(e) => {
              setSelectedKeys(e.target.checked ? filteredValues : []);
            }}
          >
            全选 ({filteredValues.length})
          </Checkbox>

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {filteredValues.map((value) => (
              <div key={value}>
                <Checkbox
                  checked={selectedKeys.includes(value)}
                  onChange={(e) => {
                    const newKeys = e.target.checked
                      ? [...selectedKeys, value]
                      : selectedKeys.filter((k) => k !== value);
                    setSelectedKeys(newKeys);
                  }}
                >
                  {value}
                </Checkbox>
              </div>
            ))}
          </div>

          <Divider style={{ margin: "8px 0" }} />
          <Space>
            <Button type="primary" size="small" onClick={() => confirm()}>
              确认
            </Button>
            <Button size="small" onClick={clearFilters}>
              重置
            </Button>
          </Space>
        </div>
      );
    } else {
      return (
        <div style={{ padding: 8 }}>
          <Checkbox
            indeterminate={
              selectedKeys.length > 0 &&
              selectedKeys.length < uniqueValues.length
            }
            checked={selectedKeys.length === uniqueValues.length}
            onChange={(e) => {
              setSelectedKeys(e.target.checked ? uniqueValues : []);
            }}
          >
            全选 ({uniqueValues.length})
          </Checkbox>

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {uniqueValues.map((value) => (
              <div key={value}>
                <Checkbox
                  checked={selectedKeys.includes(value)}
                  onChange={(e) => {
                    const newKeys = e.target.checked
                      ? [...selectedKeys, value]
                      : selectedKeys.filter((k) => k !== value);
                    setSelectedKeys(newKeys);
                  }}
                >
                  {value}
                </Checkbox>
              </div>
            ))}
          </div>

          <Divider style={{ margin: "8px 0" }} />
          <Space>
            <Button type="primary" size="small" onClick={() => confirm()}>
              确认
            </Button>
            <Button size="small" onClick={clearFilters}>
              重置
            </Button>
          </Space>
        </div>
      );
    }
  }
  if (
    column.type === "number" ||
    column.type === "int" ||
    column.type === "float"
  ) {
    return (
      <div style={{ padding: 8, width: 200 }}>
        <InputNumber
          placeholder="最小值"
          value={selectedKeys.length > 0 ? selectedKeys[0][0] : null}
          onChange={(val) => {
            if (!selectedKeys[0]) {
              setSelectedKeys([[val, null]]);
              return;
            } else {
              setSelectedKeys([[val, selectedKeys[0][1]]]);
            }
          }}
          style={{ width: "100%", marginBottom: 8 }}
        />
        <InputNumber
          placeholder="最大值"
          value={selectedKeys.length > 0 ? selectedKeys[0][1] : null}
          onChange={(val) => {
            if (!selectedKeys[0]) {
              setSelectedKeys([[null, val]]);
              return;
            } else {
              setSelectedKeys([[selectedKeys[0][0], val]]);
            }
          }}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <Divider style={{ margin: "8px 0" }} />
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleRangeConfirm(selectedKeys)}
          >
            确认
          </Button>
          <Button
            size="small"
            onClick={() => {
              setSelectedKeys([null, null]);
              clearFilters();
            }}
          >
            重置
          </Button>
        </Space>
      </div>
    );
  }
  if (column.type === "date") {
    return (
      <div style={{ padding: 8, width: 330 }}>
        <DatePicker.RangePicker
          allowClear={false}
          showTime
          format={timeFormat}
          value={
            selectedKeys[0]
              ? [dayjs(selectedKeys[0][0]), dayjs(selectedKeys[0][1])]
              : null
          }
          onChange={(dates, dateStrings) => {
            setSelectedKeys([dateStrings]);
          }}
          style={{ width: "100%" }}
        />
        <Divider style={{ margin: "8px 0" }} />
        <Space>
          <Button type="primary" size="small" onClick={() => confirm()}>
            确认
          </Button>
          <Button
            size="small"
            onClick={() => {
              setSelectedKeys([]);
              clearFilters();
            }}
          >
            重置
          </Button>
        </Space>
      </div>
    );
  }

  return null;
};

export default CommonTable;
