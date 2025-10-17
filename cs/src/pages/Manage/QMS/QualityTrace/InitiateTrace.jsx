import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    DatePicker,
    message,
    Card,
    Row,
    Col,
    Space
} from 'antd';
import {
    SaveOutlined,
    SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = 'http://10.37.15.10:9125/api/quality-traces-tpm/api';
// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const InitiateTrace = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [productInfo, setProductInfo] = useState(null);

    // 根据产品编号获取产品信息
    const fetchProductInfo = async () => {
        const productNumber = form.getFieldValue('product_number');
        if (!productNumber) {
            message.warning('请输入产品编号');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productNumber}`);
            setProductInfo(response.data);
            form.setFieldsValue({
                product_name: response.data.product_name,
                production_date: dayjs(response.data.production_date)
            });
            message.success('产品信息获取成功');
        } catch (error) {
            message.error('获取产品信息失败');
            console.error(error);
        }
    };
    const testTPM = async () => {
        const url = `${API_BASE_URL}/quality-traces-tpm`
        const params = {
            'lotnumber': '2501020111',
            'equipment_code': 'RR11',
        }
        await axios.post(url, params).then((res) => {
            console.log(res)
        })
    }
    // 提交质量跟踪
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const traceData = {
                ...values,
                production_date: values.production_date.format('YYYY-MM-DD')
            };

            await axios.post(`${API_BASE_URL}/quality-traces`, traceData);
            message.success('质量跟踪发起成功');
            form.resetFields();
            setProductInfo(null);
        } catch (error) {
            message.error('发起质量跟踪失败');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <Card title="发起质量跟踪">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="产品编号"
                                name="product_number"
                                rules={[{ required: true, message: '请输入产品编号' }]}
                            >
                                <Input
                                    placeholder="请输入产品编号"
                                    addonAfter={
                                        <Button
                                            type="link"
                                            icon={<SearchOutlined />}
                                            onClick={fetchProductInfo}
                                        >
                                            获取信息
                                        </Button>
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="产品名称"
                                name="product_name"
                                rules={[{ required: true, message: '请输入产品名称' }]}
                            >
                                <Input placeholder="请输入产品名称" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="投产日期"
                                name="production_date"
                                rules={[{ required: true, message: '请选择投产日期' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="提出工序"
                                name="process"
                                rules={[{ required: true, message: '请输入提出工序' }]}
                            >
                                <Input placeholder="请输入提出工序" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="现象描述"
                        name="phenomenon_description"
                        rules={[{ required: true, message: '请输入现象描述' }]}
                    >
                        <Input.TextArea rows={4} placeholder="请输入现象描述" />
                    </Form.Item>

                    <Form.Item
                        label="影响质量因素"
                        name="quality_factors"
                        rules={[{ required: true, message: '请输入影响质量因素' }]}
                    >
                        <Input.TextArea rows={4} placeholder="请输入影响质量因素" />
                    </Form.Item>

                    <Form.Item
                        label="提出人"
                        name="proposer"
                        rules={[{ required: true, message: '请输入提出人' }]}
                    >
                        <Input placeholder="请输入提出人" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                                发起跟踪
                            </Button>
                            <Button onClick={() => form.resetFields()}>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default InitiateTrace;
