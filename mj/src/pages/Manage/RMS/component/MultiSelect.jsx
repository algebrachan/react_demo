import React, {useState, useEffect} from 'react';
import {Select, Checkbox, Divider} from 'antd';
import './style/MultiSelect.less';

const {Option} = Select;
/**
 * 多选下拉框组件，支持全选功能
 * 支持Form.Item包装
 */
const MultiSelect = (props) => {
  const {
    options = [],                   // 选项数据
    value,                          // 选中的值
    onChange,                       // 值变化回调
    showCheckAll = false,           // 是否显示全选
    disabled = false,               // 是否禁用
    placeholder = '请选择',          // 占位文本
    labelKey = 'label',             // 标签字段名
    valueKey = 'value',             // 值字段名
    disabledKey = 'disabled',       // 禁用字段名
    collapseTags = true,            // 是否折叠标签
    clearable = true,               // 是否可清除
    filterable = false,             // 是否可筛选
    filterMethod,                   // 自定义筛选方法
    remote = false,                 // 是否远程搜索
    remoteMethod,                   // 远程搜索方法
    size,                           // 尺寸
    ...restProps                    // 其他属性
  } = props;
  // 内部状态
  const [selectedValues, setSelectedValues] = useState(value || []);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  // 计算所有可选值
  const allValues = React.useMemo(() => {
    return options
    .filter(item => !(item[disabledKey] ?? false))
    .map(item => item[valueKey] ?? item);
  }, [options, valueKey, disabledKey]);
  // 监听外部 value 变化
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);
  // 监听内部值变化，更新全选状态
  useEffect(() => {
    const checkedCount = selectedValues.length;
    const totalCount = allValues.length;
    setIsCheckAll(checkedCount > 0 && checkedCount === totalCount);
    setIsIndeterminate(checkedCount > 0 && checkedCount < totalCount);
  }, [selectedValues, allValues]);
  // 处理全选/取消全选
  const handleToggleCheckAll = (checked) => {
    const newValues = checked ? [...allValues] : [];
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };
  // 处理选项变化
  const handleChange = (newValues) => {
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };
  // 下拉菜单内容
  const dropdownRender = (menu) => {
    return (
      <>
        {showCheckAll && (
          <>
            <div className="check-all-container">
              <Checkbox
                checked={isCheckAll}
                indeterminate={isIndeterminate}
                onChange={(e) => handleToggleCheckAll(e.target.checked)}
                disabled={disabled}
              >
                全选
              </Checkbox>
            </div>
            <Divider style={{margin: '4px 0'}} />
          </>
        )}
        {menu}
      </>
    );
  };
  // 渲染选项
  const renderOptions = () => {
    return options.map((item, index) => (
      <Option
        key={index}
        value={item[valueKey] ?? item}
        disabled={item[disabledKey] ?? false}
      >
        <Checkbox
          checked={selectedValues.includes(item[valueKey] ?? item)}
          disabled={item[disabledKey] ?? false}
          style={{pointerEvents: 'none'}}
        >
          {item[labelKey] ?? item}
        </Checkbox>
      </Option>
    ));
  };
  return (
    <Select
      popupClassName="custom-multi-select__dropdown"
      mode="multiple"
      value={selectedValues}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      allowClear={clearable}
      showSearch={filterable}
      filterOption={filterMethod || filterable}
      maxTagCount={collapseTags ? 'responsive' : undefined}
      dropdownRender={dropdownRender}
      optionLabelProp="children"
      size={size}
      className="custom-multi-select"
      {...(remote ? {
        showSearch: true,
        filterOption: false,
        onSearch: remoteMethod
      } : {})}
      {...restProps}
    >
      {renderOptions()}
    </Select>
  );
};
export default MultiSelect;
