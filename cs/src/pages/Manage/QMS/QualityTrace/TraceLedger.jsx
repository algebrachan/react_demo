import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Form,
    Input,
    DatePicker,
    Select,
    message,
    Card,
    Row,
    Col,
    Space,
    Tag
} from 'antd';
import {
    SearchOutlined,
    ExportOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
// import * as XLSX from 'xlsx';

const API_BASE_URL ='http://10.37.15.10:9125/api/quality-traces-tpm/api';
// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const { RangePicker } = DatePicker;
const { Option } = Select;

const TraceLedger = () => {
    const [traces, setTraces] = useState([]);
    const [filteredTraces, setFilteredTraces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchForm] = Form.useForm();

    // 获取所有质量跟踪记录
    const fetchTraces = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/quality-traces`);
            setTraces(response.data);
            setFilteredTraces(response.data);
        } catch (error) {
            message.error('获取质量跟踪记录失败');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTraces();
    }, []);

    // 搜索质量跟踪记录
    const handleSearch = async (values) => {
        try {
            const params = new URLSearchParams();

            if (values.keyword) {
                params.append('keyword', values.keyword);
            }

            if (values.proposer) {
                params.append('proposer', values.proposer);
            }

            if (values.dateRange && values.dateRange.length === 2) {
                params.append('start_date', values.dateRange[0].format('YYYY-MM-DD'));
                params.append('end_date', values.dateRange[1].format('YYYY-MM-DD'));
            }

            const response = await axios.get(`${API_BASE_URL}/quality-traces/search?${params}`);
            setFilteredTraces(response.data);
        } catch (error) {
            message.error('搜索质量跟踪记录失败');
            console.error(error);
        }
    };

    // 重置搜索
    const handleReset = () => {
        searchForm.resetFields();
        setFilteredTraces(traces);
    };

    // 导出Excel
    /*const exportToExcel = () => {
        if (filteredTraces.length === 0) {
            message.warning('没有数据可导出');
            return;
        }

        // 准备数据
        const data = [
            ['质量跟踪台账'],
            ['导出时间', dayjs().format('YYYY-MM-DD HH:mm:ss')],
            [],
            ['质量跟踪编号', '产品编号', '产品名称', '投产日期', '提出工序', '现象描述',
                '影响质量因素', '临时措施', '最终产品质量', '是否直接原因', '直接原因说明',
                '提出人', '质量确认人', '创建时间']
        ];

        // 添加数据行
        filteredTraces.forEach(trace => {
            data.push([
                trace.trace_number,
                trace.product_number,
                trace.product_name,
                dayjs(trace.production_date).format('YYYY-MM-DD'),
                trace.process,
                trace.phenomenon_description,
                trace.quality_factors,
                trace.temporary_measures,
                trace.final_quality,
                trace.is_direct_cause ? '是' : '否',
                trace.cause_explanation,
                trace.proposer,
                trace.quality_confirmer,
                dayjs(trace.created_at).format('YYYY-MM-DD HH:mm:ss')
            ]);
        });

        // 创建工作簿和工作表
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '质量跟踪台账');

        // 生成Excel文件并下载
        XLSX.writeFile(wb, `质量跟踪台账_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`);
        message.success('导出成功');
    };*/

    const columns = [
        {
            title: '质量跟踪编号',
            dataIndex: 'trace_number',
            key: 'trace_number',
            width: 150,
        },
        {
            title: '产品编号',
            dataIndex: 'product_number',
            key: 'product_number',
            width: 120,
        },
        {
            title: '产品名称',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 150,
        },
        {
            title: '投产日期',
            dataIndex: 'production_date',
            key: 'production_date',
            width: 120,
            render: (date) => dayjs(date).format('YYYY-MM-DD')
        },
        {
            title: '提出工序',
            dataIndex: 'process',
            key: 'process',
            width: 120,
        },
        {
            title: '提出人',
            dataIndex: 'proposer',
            key: 'proposer',
            width: 100,
        },
        {
            title: '质量确认人',
            dataIndex: 'quality_confirmer',
            key: 'quality_confirmer',
            width: 100,
        },
        {
            title: '状态',
            key: 'status',
            width: 100,
            render: (_, record) => (
                <Tag color={record.quality_confirmer ? 'green' : 'orange'}>
                    {record.quality_confirmer ? '已完成' : '待处理'}
                </Tag>
            ),
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 150,
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm')
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card title="质量跟踪台账">
                {/* 搜索表单 */}
                <Card size="small" style={{ marginBottom: 16 }}>
                    <Form
                        form={searchForm}
                        layout="inline"
                        onFinish={handleSearch}
                    >
                        <Form.Item name="keyword" label="关键词">
                            <Input placeholder="请输入产品编号/名称/跟踪编号" />
                        </Form.Item>

                        <Form.Item name="proposer" label="提出人">
                            <Input placeholder="请输入提出人" />
                        </Form.Item>

                        <Form.Item name="dateRange" label="创建时间">
                            <RangePicker />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                                搜索
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={handleReset} icon={<ReloadOutlined />}>
                                重置
                            </Button>
                        </Form.Item>

                        {/*<Form.Item>
                            <Button
                                type="primary"
                                icon={<ExportOutlined />}
                                onClick={exportToExcel}
                            >
                                导出Excel
                            </Button>
                        </Form.Item>*/}
                    </Form>
                </Card>

                <Table
                    columns={columns}
                    dataSource={filteredTraces}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1200 }}
                />
            </Card>
        </div>
    );
};

export default TraceLedger;
