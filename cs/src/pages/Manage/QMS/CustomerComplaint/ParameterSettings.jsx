import React, { useState, useEffect } from 'react';
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
    Button,
    Form,
    Input,
    Select,
    Space,
    Table,
    Modal,
    message,
    Row,
    Col
} from "antd";
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { product_get, product_post, product_put, product_delete } from "../../../../apis/qms_router";
let listData = {}
function ParameterSettings() {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const navigate = useNavigate();

    const [cur, setCur] = useState(1);
    const [page_size, setPageSize] = useState(10);
    const [tb_total, setTbTotal] = useState(0)
    // 状态管理
    const [tableData, setTableData] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    // 弹窗状态
    const [editVisible, setEditVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // 批量选择相关状态
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    // 新增产品弹窗内的表格数据
    const [addTableData, setAddTableData] = useState([
        { key: 1, name: '' }
    ]);

    // 初始化筛选数据
    useEffect(() => {
        form.setFieldsValue({
            name: '',
            status: 1
        });
        handleSearch(1, 10);
    }, []);

    // 表格行选择配置
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log('onSelectAll:', selected, selectedRows, changeRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log('onSelect:', record, selected, selectedRows);
        },
    };

    // 表格列定义
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (text, record, index) => index + 1,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: '插入时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 200,
        },
        {
            title: '更新时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 200,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <span style={{ color: status == 1 ? '#52c41a' : '#ff4d4f' }}>
                    {status == 1 ? '启用' : '禁用'}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                </Space>
            ),
        },
    ];

    // 新增产品弹窗内表格列定义
    const addTableColumns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => handleAddTableInputChange(index, e.target.value)}
                    placeholder="请输入名称"
                />
            ),
        },
        {
            title: '删除',
            key: 'delete',
            width: 80,
            render: (text, record, index) => (
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteAddTableRow(index)}
                    disabled={addTableData.length === 1}
                />
            ),
        },
    ];

    // 查询功能
    const handleSearch = (page = 1, limit = 10) => {
        const values = form.getFieldsValue();
        setLoading(true);
        product_get({ page: page, limit: limit, name: values.name, status: values.status }, (res) => {
            setFilteredData(res.data.data);
            setTbTotal(res.data.total || 0);
            setLoading(false);
            message.success('查询完成');
            // 清空选择状态
            setSelectedRowKeys([]);
            setSelectedRows([]);
        }, (err) => {
            setLoading(false);
            message.error(err.data.msg);
        })
    };

    // 编辑功能
    const handleEdit = (record) => {
        setEditingRecord(record);
        listData = record;
        editForm.setFieldsValue(record);
        setEditVisible(true);

    };

    // 批量删除功能
    const handleBatchDelete = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请先选择要删除的数据');
            return;
        }

        Modal.confirm({
            title: '确认批量删除',
            content: `确定要删除选中的 ${selectedRowKeys.length} 条产品记录吗？此操作不可撤销。`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                const deleteIds = selectedRowKeys.map(key => String(key));
                product_delete({
                    id: deleteIds
                }, (res) => {
                    message.success(res.data.msg);
                    handleSearch(cur, page_size);
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                }, (err) => {
                    message.error(err.data.msg || '批量删除失败');
                });
            },
        });
    };

    // 删除功能
    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除产品"${record.name}"吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                product_delete({ id: record.id }, (res) => {
                    message.success(res.data.msg);
                    handleSearch(cur, page_size);
                });
            },
        });
    };

    // 保存编辑
    const handleEditSave = () => {
        let values = editForm.getFieldsValue();
        product_put({ ...values, id: listData.id }, (res) => {
            setEditVisible(false);
            message.success(res.data.msg);
            handleSearch(cur, page_size);
        });
    };

    // 新增产品弹窗相关功能
    const handleShowAddModal = () => {
        setAddTableData([{ key: Date.now(), name: '' }]);
        setAddVisible(true);
    };

    // 新增表格行
    const handleAddTableRow = () => {
        const newRow = { key: Date.now(), name: '' };
        setAddTableData([...addTableData, newRow]);
    };

    // 删除表格行
    const handleDeleteAddTableRow = (index) => {
        if (addTableData.length > 1) {
            const newData = addTableData.filter((item, i) => i !== index);
            setAddTableData(newData);
        }
    };

    // 修改表格输入框内容
    const handleAddTableInputChange = (index, value) => {
        const newData = [...addTableData];
        newData[index].name = value;
        setAddTableData(newData);
    };

    // 提交新增产品
    const handleAddSubmit = () => {
        const validData = addTableData.filter(item => item.name.trim() !== '');
        if (validData.length === 0) {
            message.error('请至少输入一个产品名称');
            return;
        }
        const newProducts = validData.map((item, index) => ({
            name: item.name.trim(),
        }));
        product_post({ data: newProducts }, (res) => {
            setAddVisible(false);
            message.success(res.data.msg);
            handleSearch(cur, page_size);
        }, (err) => {
            message.error(err.data.msg);
        })
    };

    // 提交表单
    const handleSubmit = () => {
        message.success('参数设置已保存');
    };

    const pagination = () => {
        return {
            current: cur,
            pageSize: page_size,
            position: ["bottomCenter"],
            total: tb_total,
            showTotal: (total) => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
                setCur(page);
                setPageSize(pageSize);
                handleSearch(page, pageSize);
            },
        };
    };

    return (
        <div>
            <MyBreadcrumb items={[window.sys_name, "客诉管理", "参数设置"]} />

            <div className="content_root" style={{ display: "flex", rowGap: 20, flexDirection: "column" }}>
                {/* 搜索表单 */}
                <Form layout="inline" form={form}>
                    <Form.Item>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/mng/qms_customer_complaint')}>
                            返回
                        </Button>
                    </Form.Item>
                    <Form.Item label="产品名称" name="name">
                        <Input placeholder="请输入产品名称" style={{ width: 200 }} />
                    </Form.Item>

                    <Form.Item label="状态" name="status">
                        <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                            <Select.Option value={1}>启用</Select.Option>
                            <Select.Option value={0}>禁用</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" onClick={() => handleSearch(cur, page_size)}>
                                查询
                            </Button>
                            <Button onClick={handleShowAddModal}>
                                新增产品
                            </Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleBatchDelete}
                                disabled={selectedRowKeys.length === 0}
                            >
                                删除 {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>

                {/* 数据表格 */}
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination()}
                    rowSelection={rowSelection}
                    bordered
                    size="small"
                />
            </div>

            {/* 编辑弹窗 */}
            <Modal
                title="编辑产品"
                open={editVisible}
                onOk={handleEditSave}
                onCancel={() => setEditVisible(false)}
                okText="保存"
                cancelText="取消"
            >
                <Form form={editForm} layout="vertical">
                    <Form.Item
                        label="产品名称"
                        name="name"
                        rules={[{ required: true, message: '请输入产品名称' }]}
                    >
                        <Input placeholder="请输入产品名称" />
                    </Form.Item>

                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select placeholder="请选择状态">
                            <Select.Option value={1}>启用</Select.Option>
                            <Select.Option value={0}>禁用</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 新增产品弹窗 */}
            <Modal
                title="新增产品"
                open={addVisible}
                onOk={handleAddSubmit}
                onCancel={() => setAddVisible(false)}
                okText="提交"
                cancelText="取消"
                width={600}
            >
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddTableRow}
                    >
                        新增
                    </Button>
                </div>

                <Table
                    columns={addTableColumns}
                    dataSource={addTableData}
                    rowKey="key"
                    pagination={false}
                    bordered
                    size="small"
                />
            </Modal>
        </div>
    );
}

export default ParameterSettings; 