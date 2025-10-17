import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Select, Checkbox, Space, message, Form, Input, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { layered_audit_plan_put, fixed_info } from '../../../../apis/qms_router';
import dayjs from 'dayjs';
import { flushSync } from 'react-dom';
const { Option } = Select;

function ReviewDetail({ record, onClose, requestData }) {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);
    // 新增状态管理联级选择数据
    const [departmentData, setDepartmentData] = useState({});
    const [selectedDepartments, setSelectedDepartments] = useState({}); // 存储每行选择的部门
    // 新增状态管理子列
    const [subColumns, setSubColumns] = useState({}); // 存储每列的子列数量 {fieldKey: count}

    const mockData = {
        1: {
            data: []
        },
        2: {
            data: [
                { id: 1, time: '审核状态' },
                { id: 2, time: '审核日期' },
                { id: 3, time: '审核区域工作站' },
                { id: 4, time: '备注' },
            ]
        },
        3: {
            data: [
                { id: 1, time: '审核状态', },
                { id: 2, time: '审核日期', },
                { id: 3, time: '审核区域工作站' },
                { id: 4, time: '备注', }
            ]
        }
    };

    // 初始化部门数据
    useEffect(() => {
        fixed_info({ typeof: 2 }, (res) => {
            if (res.data.code === 200) {
                setDepartmentData(res.data.data);
            }
        });
    }, []);

    // 独立处理数据回填的useEffect
    useEffect(() => {
        console.log('=== 数据回填useEffect触发 ===');
        console.log('record.data存在:', !!record.data);
        console.log('record.level:', record.level);
        console.log('record.title存在:', !!record.title);

        if (record.data && (record.level === 2 || record.level === 3) && record.title) {
            console.log('开始数据回填处理');

            const subColumnCounts = {};
            record.data.forEach(item => {
                for (let i = 1; i < record.title.length; i++) {
                    const fieldKey = record.title[i];
                    if (item[fieldKey + '_sub_data'] && Array.isArray(item[fieldKey + '_sub_data'])) {
                        const currentCount = item[fieldKey + '_sub_data'].length;
                        subColumnCounts[fieldKey] = Math.max(subColumnCounts[fieldKey] || 0, currentCount);
                    }
                }
            });

            console.log('数据回填计算的subColumnCounts:', subColumnCounts);
            console.log('当前subColumns:', subColumns);

            // 检查是否需要更新
            const currentKeys = Object.keys(subColumns);
            const newKeys = Object.keys(subColumnCounts);

            console.log('currentKeys:', currentKeys);
            console.log('newKeys:', newKeys);

            const shouldUpdate = newKeys.length !== currentKeys.length ||
                newKeys.some(key => {
                    const oldValue = subColumns[key] || 0;
                    const newValue = subColumnCounts[key] || 0;
                    console.log(`检查字段 ${key}: 旧值=${oldValue}, 新值=${newValue}`);
                    return oldValue !== newValue;
                });

            console.log('是否需要更新:', shouldUpdate);

            if (shouldUpdate) {
                console.log('执行数据回填更新');
                setSubColumns(subColumnCounts);
            } else {
                console.log('无需更新，跳过');
            }
        } else {
            console.log('数据回填条件不满足，跳过');
        }
    }, [record.data, record.level, record.title]); // 移除subColumns依赖，避免循环

    useEffect(() => {
        const level = record.level;
        const columns = record;
        const config = mockData[level];
        if (config) {
            if (level == 1) {
                const dynamicColumns = [
                    {
                        title: '主部门',
                        dataIndex: 'mainDepartment',
                        key: 'mainDepartment',
                        width: 150,
                        fixed: 'left',
                        render: (text, record, index) => (
                            <Select
                                value={record.mainDepartment}
                                style={{ width: '100%' }}
                                onChange={(value) => handleMainDepartmentChange(record.id, value)}
                                placeholder="请选择主部门"
                            >
                                {Object.keys(departmentData || {}).map(dept => (
                                    <Option key={dept} value={dept}>{dept}</Option>
                                ))}
                            </Select>
                        )
                    },
                    {
                        title: '子部门',
                        dataIndex: 'subDepartment',
                        key: 'subDepartment',
                        width: 150,
                        fixed: 'left',
                        render: (text, record, index) => (
                            <Select
                                value={record.subDepartment}
                                style={{ width: '100%' }}
                                onChange={(value) => handleSubDepartmentChange(record.id, value)}
                                placeholder="请选择子部门"
                                disabled={!record.mainDepartment}
                            >
                                {record.mainDepartment && departmentData[record.mainDepartment] &&
                                    departmentData[record.mainDepartment].map(subDept => (
                                        <Option key={subDept} value={subDept}>{subDept}</Option>
                                    ))}
                            </Select>
                        )
                    }
                ];

                // 添加日期列
                for (let i = 1; i < columns.title.length; i++) {
                    const fieldKey = columns.title[i];
                    dynamicColumns.push({
                        title: columns.title[i],
                        dataIndex: fieldKey,
                        key: fieldKey,
                        width: 100,
                        render: (text, record, rowIndex) => (
                            <Checkbox
                                checked={Boolean(record[fieldKey])}
                                onChange={(e) => handleCheckboxChange(record.id, fieldKey, e.target.checked)}
                            />
                        )
                    });
                }

                // 添加操作列
                dynamicColumns.push({
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 80,
                    render: (text, record, index) => (
                        <Button danger size="small" onClick={() => handleDeleteRow(record.id)}>
                            删除
                        </Button>
                    )
                });

                setColumns(dynamicColumns);
                if (record.data) {
                    setTableData(record.data);
                } else {
                    // 为level 2和3的数据初始化默认值
                    const initializedData = config.data.map(item => {
                        const newItem = { ...item };
                        // 为每个字段设置默认值
                        for (let i = 1; i < columns.title.length; i++) {
                            const fieldKey = columns.title[i];
                            if (item.time === '审核状态') {
                                // 多选框默认值为0
                                newItem[fieldKey] = 0;
                                // 为3级审核初始化子列数据
                                if (level === 3) {
                                    newItem[fieldKey + '_sub'] = [];
                                }
                            } else if (item.time === '审核区域工作站') {
                                // 为审核区域工作站添加主部门和子部门字段
                                newItem[fieldKey + '_main'] = '';
                                newItem[fieldKey + '_sub'] = '';
                                // 为2级和3级审核初始化子列数据
                                if (level === 2 || level === 3) {
                                    newItem[fieldKey + '_sub_data'] = [];
                                }
                            } else if (item.time === '审核日期') {
                                // input和select默认值为空字符串
                                newItem[fieldKey] = '';
                                // 为2级和3级审核初始化子列数据
                                if (level === 2 || level === 3) {
                                    newItem[fieldKey + '_sub_data'] = [];
                                }
                            } else {
                                // input和select默认值为空字符串
                                newItem[fieldKey] = '';
                            }
                        }
                        return newItem;
                    });
                    setTableData(initializedData);
                }
            } else {
                const dynamicColumns = [
                    {
                        title: columns.title[0],
                        dataIndex: 'time',
                        key: 'time',
                        width: 200,
                        fixed: 'left',
                    }
                ];

                // 2级和3级审核都由专门的useEffect处理，这里不再处理columns
                if (record.data) {
                    setTableData(record.data);
                } else {
                    // 为level 2和3的数据初始化默认值
                    const initializedData = config.data.map(item => {
                        const newItem = { ...item };
                        // 为每个字段设置默认值
                        for (let i = 1; i < columns.title.length; i++) {
                            const fieldKey = columns.title[i];
                            if (item.time === '审核状态') {
                                // 多选框默认值为0
                                newItem[fieldKey] = 0;
                                // 为3级审核初始化子列数据
                                if (level === 3) {
                                    newItem[fieldKey + '_sub'] = [];
                                }
                            } else if (item.time === '审核区域工作站') {
                                // 为审核区域工作站添加主部门和子部门字段
                                newItem[fieldKey + '_main'] = '';
                                newItem[fieldKey + '_sub'] = '';
                                // 为3级审核初始化子列数据
                                if (level === 3) {
                                    newItem[fieldKey + '_sub_data'] = [];
                                }
                            } else if (item.time === '审核日期') {
                                // input和select默认值为空字符串
                                newItem[fieldKey] = '';
                                // 为3级审核初始化子列数据
                                if (level === 3) {
                                    newItem[fieldKey + '_sub_data'] = [];
                                }
                            } else {
                                // input和select默认值为空字符串
                                newItem[fieldKey] = '';
                            }
                        }
                        return newItem;
                    });
                    setTableData(initializedData);
                }
            }
        }
    }, [record, departmentData]); // 移除subColumns依赖，避免删除后重新触发

    // 专门处理columns更新的useEffect
    useEffect(() => {
        console.log('=== columns更新useEffect触发 ===');
        console.log('当前subColumns:', subColumns);

        const level = record.level;
        const columns = record;

        if ((level === 2 || level === 3) && columns.title) {
            const dynamicColumns = [
                {
                    title: columns.title[0],
                    dataIndex: 'time',
                    key: 'time',
                    width: 200,
                    fixed: 'left',
                }
            ];

            for (let i = 1; i < columns.title.length; i++) {
                const fieldKey = columns.title[i];
                const subColumnCount = subColumns[fieldKey] || 0;

                // 创建主列
                const mainColumn = {
                    title: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{columns.title[i]}</span>
                            <Button
                                type="text"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => handleAddSubColumn(fieldKey)}
                                style={{ padding: '0 4px' }}
                                title="添加子列"
                            />
                            {subColumnCount > 0 && (
                                <Button
                                    type="text"
                                    size="small"
                                    onClick={() => {
                                        console.log('点击删除按钮, fieldKey:', fieldKey, 'subColumnCount:', subColumnCount);
                                        console.log('当前subColumns状态:', subColumns);
                                        handleRemoveSubColumn(fieldKey);
                                    }}
                                    style={{ padding: '0 4px', color: '#ff4d4f' }}
                                    title="删除最后一个子列"
                                >
                                    −
                                </Button>
                            )}
                        </div>
                    ),
                    dataIndex: fieldKey,
                    key: fieldKey,
                    width: 120 + (subColumnCount * 120), // 根据子列数量调整宽度
                    render: (text, rowRecord, rowIndex) => {
                        return renderCellContent(rowRecord, fieldKey, subColumnCount, columns);
                    }
                };

                dynamicColumns.push(mainColumn);
            }

            console.log('更新columns:', dynamicColumns);
            setColumns(dynamicColumns);
        }
    }, [subColumns, record.level, record.title]); // 只依赖subColumns和必要的record属性

    // 处理一级审核的主部门变化
    const handleMainDepartmentChange = (recordId, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex].mainDepartment = value;
                newData[rowIndex].subDepartment = ''; // 清空子部门选择
                return newData;
            } else {
                return prevData;
            }
        });
    };

    // 处理一级审核的子部门变化
    const handleSubDepartmentChange = (recordId, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex].subDepartment = value;
                return newData;
            } else {
                return prevData;
            }
        });
    };

    // 处理二三级审核中审核区域工作站的主部门变化
    const handleMainDeptSelectChange = (recordId, colKey, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex][colKey + '_main'] = value;
                newData[rowIndex][colKey + '_sub'] = ''; // 清空子部门选择
                return newData;
            } else {
                return prevData;
            }
        });
    };

    // 处理二三级审核中审核区域工作站的子部门变化
    const handleSubDeptSelectChange = (recordId, colKey, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex][colKey + '_sub'] = value;
                return newData;
            } else {
                return prevData;
            }
        });
    };

    const handleCheckboxChange = (recordId, colKey, checked) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex][colKey] = checked ? 1 : 0;
                return newData;
            } else {
                return prevData;
            }
        });
    };

    const handleInputChange = (recordId, colKey, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex][colKey] = value;
                return newData;
            } else {
                return prevData;
            }
        });
    };

    const handleSelectChange = (recordId, colKey, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                newData[rowIndex][colKey] = value;
                return newData;
            } else {
                return prevData;
            }
        });
    };

    const handleDateChange = (recordId, colKey, date) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                // 将日期转换为YYYY-MM-DD格式的字符串
                newData[rowIndex][colKey] = date ? date.format('YYYY-MM-DD') : '';
                return newData;
            } else {
                return prevData;
            }
        });
    };

    const handleAddRow = () => {
        const level = record.level;
        if (level === 1) {
            const newId = Date.now();
            const newRow = {
                id: newId,
                mainDepartment: '',
                subDepartment: '',
            };
            for (let i = 1; i < record.title.length; i++) {
                const fieldKey = record.title[i];
                newRow[fieldKey] = 0;
            }
            const updatedData = [...tableData, newRow];
            setTableData(updatedData);
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        const submitData = {
            ...record,
            data: tableData,
            subColumns: (record.level === 2 || record.level === 3) ? subColumns : undefined
        };

        layered_audit_plan_put(submitData, (res) => {
            message.success(res.data.msg);
            setLoading(false);
            if (requestData && typeof requestData === 'function') {
                requestData();
            }
        }, () => {
            message.error('提交失败');
            setLoading(false);
        });
    };

    // 新增子列处理函数
    const handleAddSubColumn = useCallback((fieldKey) => {
        console.log('=== 开始添加子列 ===');
        console.log('添加子列 fieldKey:', fieldKey);
        console.log('添加前 subColumns:', subColumns);

        // 直接更新子列数量
        const newSubColumns = { ...subColumns };
        const newCount = (newSubColumns[fieldKey] || 0) + 1;
        newSubColumns[fieldKey] = newCount;
        console.log('添加后子列数量:', newCount);

        setSubColumns(newSubColumns);

        // 为现有数据添加新的子列默认值
        setTableData(prevData => {
            const newData = prevData.map(item => {
                const newItem = { ...item };

                if (item.time === '审核日期' || item.time === '审核区域工作站') {
                    if (!newItem[fieldKey + '_sub_data']) {
                        newItem[fieldKey + '_sub_data'] = [];
                    }
                    
                    // 确保数组长度与子列数量匹配，新增的位置填入空值
                    const currentLength = newItem[fieldKey + '_sub_data'].length;
                    const targetLength = newCount;
                    
                    // 如果当前长度小于目标长度，补充空值
                    while (newItem[fieldKey + '_sub_data'].length < targetLength) {
                        newItem[fieldKey + '_sub_data'].push('');
                    }
                    
                    console.log(`${item.time}子列数据更新后:`, newItem[fieldKey + '_sub_data']);
                }

                return newItem;
            });

            console.log('添加子列后的表格数据:', newData);
            return newData;
        });

        console.log('添加子列操作完成');
    }, [subColumns]); // 保持subColumns依赖

    // 删除子列处理函数
    const handleRemoveSubColumn = useCallback((fieldKey) => {
        console.log('=== 开始删除子列 ===');
        console.log('删除子列 fieldKey:', fieldKey);
        console.log('删除前 subColumns:', subColumns);

        const currentCount = subColumns[fieldKey] || 0;
        console.log('当前子列数量:', currentCount);

        if (currentCount <= 0) {
            console.log('没有子列可删除，退出');
            return;
        }

        // 直接更新子列数量
        const newSubColumns = { ...subColumns };
        const newCount = currentCount - 1;
        newSubColumns[fieldKey] = newCount;
        console.log('删除后子列数量:', newCount);

        setSubColumns(newSubColumns);

        // 更新表格数据，确保数组长度与子列数量匹配
        setTableData(prevData => {
            const newData = prevData.map(item => {
                const newItem = { ...item };

                if (item.time === '审核日期' || item.time === '审核区域工作站') {
                    if (newItem[fieldKey + '_sub_data']) {
                        // 确保数组长度与新的子列数量匹配
                        if (newItem[fieldKey + '_sub_data'].length > newCount) {
                            newItem[fieldKey + '_sub_data'] = newItem[fieldKey + '_sub_data'].slice(0, newCount);
                        }
                        console.log(`${item.time}删除子列数据后:`, newItem[fieldKey + '_sub_data']);
                    }
                }

                return newItem;
            });

            console.log('删除子列后的表格数据:', newData);
            return newData;
        });

        console.log('删除子列操作完成');
    }, [subColumns]); // 保持subColumns依赖

    // 删除一级审核行
    const handleDeleteRow = (rowId) => {
        setTableData(prev => prev.filter(item => item.id !== rowId));
    };

    // 渲染单元格内容
    const renderCellContent = (record, fieldKey, subColumnCount, columns) => {
        // 根据时间字段的值决定使用什么输入组件
        if (record.time === '审核状态') {
            return (
                <Checkbox
                    checked={Boolean(record[fieldKey])}
                    onChange={(e) => handleCheckboxChange(record.id, fieldKey, e.target.checked)}
                />
            );
        } else if (record.time === '审核日期') {
            const isLevel2Or3 = record.level === 2 || record.level === 3 || subColumnCount > 0;

            if (isLevel2Or3 && subColumnCount > 0) {
                // 3级审核且有子列时，渲染主列+子列
                return (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <div style={{ width: '110px', marginBottom: '4px' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>主审核</div>
                            <DatePicker
                                value={record[fieldKey] ? dayjs(record[fieldKey], 'YYYY-MM-DD') : null}
                                onChange={(date) => handleDateChange(record.id, fieldKey, date)}
                                placeholder="主审核日期"
                                format="YYYY-MM-DD"
                                style={{ width: '100%' }}
                                size="small"
                            />
                        </div>
                        {Array.from({ length: subColumnCount }, (_, index) => (
                            <div key={index} style={{ width: '110px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>子审核{index + 1}</div>
                            <DatePicker
                                value={record[fieldKey + '_sub_data'] && record[fieldKey + '_sub_data'][index] && record[fieldKey + '_sub_data'][index] !== ''
                                    ? dayjs(record[fieldKey + '_sub_data'][index], 'YYYY-MM-DD')
                                    : null}
                                onChange={(date) => handleSubDateChange(record.id, fieldKey, index, date)}
                                placeholder={`子审核日期${index + 1}`}
                                format="YYYY-MM-DD"
                                style={{ width: '100%' }}
                                size="small"
                            />
                            </div>
                        ))}
                    </div>
                );
            } else {
                // 原有逻辑
                return (
                    <DatePicker
                        value={record[fieldKey] ? dayjs(record[fieldKey], 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange(record.id, fieldKey, date)}
                        placeholder="请选择审核日期"
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                    />
                );
            }
        } else if (record.time === '审核区域工作站') {
            const isLevel2Or3 = record.level === 2 || record.level === 3 || subColumnCount > 0;

            if (isLevel2Or3 && subColumnCount > 0) {
                // 3级审核且有子列时，渲染主列+子列
                return (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <div style={{ width: '110px', marginBottom: '4px' }}>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>主工作站</div>
                            <Select
                                value={record[fieldKey] || ''}
                                style={{ width: '100%' }}
                                onChange={(value) => handleSelectChange(record.id, fieldKey, value)}
                                placeholder="主工作站"
                                size="small"
                            >
                                {columns.region && columns.region.map(area => (
                                    <Option key={area} value={area}>{area}</Option>
                                ))}
                            </Select>
                        </div>
                        {Array.from({ length: subColumnCount }, (_, index) => (
                            <div key={index} style={{ width: '110px', marginBottom: '4px' }}>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>子工作站{index + 1}</div>
                                <Select
                                    value={record[fieldKey + '_sub_data'] && record[fieldKey + '_sub_data'][index] && record[fieldKey + '_sub_data'][index] !== '' 
                                        ? record[fieldKey + '_sub_data'][index] 
                                        : undefined}
                                    style={{ width: '100%' }}
                                    onChange={(value) => handleSubSelectChange(record.id, fieldKey, index, value)}
                                    placeholder={`子工作站${index + 1}`}
                                    size="small"
                                >
                                    {columns.region && columns.region.map(area => (
                                        <Option key={area} value={area}>{area}</Option>
                                    ))}
                                </Select>
                            </div>
                        ))}
                    </div>
                );
            } else {
                // 原有逻辑
                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Select
                            value={record[fieldKey] || ''}
                            style={{ width: '100%' }}
                            onChange={(value) => handleSelectChange(record.id, fieldKey, value)}
                            placeholder="请选择区域工作站"
                        >
                            {columns.region && columns.region.map(area => (
                                <Option key={area} value={area}>{area}</Option>
                            ))}
                        </Select>
                    </div>
                );
            }
        } else if (record.time === '备注') {
            return (
                <Input
                    value={record[fieldKey] || ''}
                    onChange={(e) => handleInputChange(record.id, fieldKey, e.target.value)}
                    placeholder="请输入备注"
                />
            );
        } else {
            // 默认使用Checkbox
            return (
                <Checkbox
                    checked={Boolean(record[fieldKey])}
                    onChange={(e) => handleCheckboxChange(record.id, fieldKey, e.target.checked)}
                />
            );
        }
    };

    // 新增子列日期变化处理函数
    const handleSubDateChange = (recordId, colKey, subIndex, date) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                if (!newData[rowIndex][colKey + '_sub_data']) {
                    newData[rowIndex][colKey + '_sub_data'] = [];
                }
                newData[rowIndex][colKey + '_sub_data'][subIndex] = date ? date.format('YYYY-MM-DD') : '';
                return newData;
            } else {
                return prevData;
            }
        });
    };

    // 新增子列选择变化处理函数
    const handleSubSelectChange = (recordId, colKey, subIndex, value) => {
        setTableData(prevData => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(item => item.id === recordId);

            if (rowIndex !== -1) {
                if (!newData[rowIndex][colKey + '_sub_data']) {
                    newData[rowIndex][colKey + '_sub_data'] = [];
                }
                newData[rowIndex][colKey + '_sub_data'][subIndex] = value;
                return newData;
            } else {
                return prevData;
            }
        });
    };

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div></div>
                <Space>
                    {record.level == 1 && (
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
                            新增
                        </Button>
                    )}
                    <Button type="primary" loading={loading} onClick={handleSubmit}>
                        提交
                    </Button>
                </Space>
            </div>

            <Table
                rowKey="id"
                bordered
                size="small"
                columns={columns}
                dataSource={tableData}
                scroll={{
                    x: 'max-content',
                    y: 400
                }}
                pagination={false}
            />
        </div>
    );
}

export default ReviewDetail; 