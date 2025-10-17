import React, { useState, useEffect } from 'react';
import { Button, Table, Select, Input, DatePicker, Space, message, Form, Row, Col, Card, Modal, Upload, Radio } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyBreadcrumb } from '../../../../components/CommonCard';
import dayjs from 'dayjs';
import { dateFormat } from '../../../../utils/string';
import { audit_content, non_conform, get_non_conform, non_conform_put, get_audit_content, nick_name, examine_nick_name } from "../../../../apis/qms_router";

const { Option } = Select;
const { TextArea } = Input;
const guanli=['管理类','标准类','执行类','其他类']

function AuditForm({ record: propRecord, onClose, isModal = false }) {
    const [form] = Form.useForm();
    const [correctiveForm] = Form.useForm();
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [quyu, setquyu] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    const [制定人, set制定人] = useState([]);
    const [审核人, set审核人] = useState([]);
    // 从路由参数或props中获取record
    const record = propRecord || location.state?.record || {};
    // 结果评价选项
    const resultOptions = [
        { label: 'Y', value: 'Y' },
        { label: 'N', value: 'N' },
        { label: 'N/C', value: 'N/C' },
        { label: 'N/A', value: 'N/A' }
    ];


    useEffect(() => {
        nick_name({}, (res) => {
            if (res.data.code === 200) {
                set制定人(res.data.data);
            }
        })
       
        form.setFieldsValue({
            分层级别: getLevelText(record.level),
            编号: record.number,
            审核区域: record.region?.[0] || '',
            审核人: '',
            审核日期: dayjs().format(dateFormat),
            陪同人: ''
        });

        let values = form.getFieldsValue();
        get_audit_content(
            { number: values.编号, level: record.level, area: values.审核区域, workshop: record.workshop, department: record.department, review_date: values.审核日期 }
            , (res) => {
                if (res.data.code == 200) {
                    setTableData(res.data.data.data);
                    setquyu(res.data.data.area_)
          
                    form.setFieldsValue({
                        审核人: res.data.data.reviewer || '',
                        审核日期: res.data.data.review_date ? dayjs(res.data.data.review_date).format(dateFormat) : dayjs().format(dateFormat),
                        陪同人: res.data.data.confirm || '',
                        审核区域:res.data.data.area
                    });
                               examine_nick_name({ area: res.data.data.area, level: record.level, workshop: record.workshop }, (res) => {
            if (res.data.code === 200) {
                set审核人(res.data.data);
            }
        })
                } else {
                    message.error(res.data.msg);
                }
            })
    }, [record]);
    const getTableData = (type) => {
        let values = form.getFieldsValue();
        get_audit_content(
            { number: values.编号, level: record.level,type:type, area: values.审核区域, workshop: record.workshop, department: record.department, review_date: values.审核日期 }
            , (res) => {
                if (res.data.code == 200) {
                    setTableData(res.data.data.data);
                     setquyu(res.data.data.area_)
                    // 修复2：表格上方表单的审核日期初始化（第65-70行）
                    form.setFieldsValue({
                        审核人: res.data.data.reviewer || '',
                        // 审核日期: res.data.data.review_date ? dayjs(res.data.data.review_date).format(dateFormat) : dayjs().format(dateFormat),
                        陪同人: res.data.data.confirm || '',
                         审核区域: res.data.data.area || '',
                    });
                } else {
                    message.error(res.data.msg);
                }
            })
    }

    // 处理表格数据变化
    const handleTableChange = (index, field, value, record_table) => {
        const newData = [...tableData];
        newData[index][field] = value;
        setTableData(newData);

        // 当选择"N"时显示整改弹框
        if (field === '结果评价' && value === 'N') {
            setCurrentRowIndex(index);
            setIsModalVisible(true);

            // 调用接口获取整改数据
            get_non_conform({
                number: record.number,
                level: record.level,
                area: form.getFieldsValue().审核区域,
                review_date: form.getFieldsValue().审核日期,
                element_number: tableData[index]?.序号,
                department: record.department,
                workshop: record.workshop,
            }, (res) => {
                if (res.data.code == 200 && res.data.data) {
                    const formData = { ...res.data.data };

                    // 转换日期字段为 dayjs 对象
                    if (formData.planned_completion_time) {
                        formData.planned_completion_time = dayjs(formData.planned_completion_time);
                    }
                    // if (formData.problem_closure_time) {
                    //     formData.problem_closure_time = dayjs(formData.problem_closure_time);
                    // }
                    if (formData.verification_date) {
                        formData.verification_date = dayjs(formData.verification_date);
                    }

                    correctiveForm.setFieldsValue(formData);

                    // 处理附件回填 - 兼容数组和字符串格式
                    if (formData.evidence_rectification_name && formData.evidence_rectification_path) {
                        // 处理文件名：如果是数组直接使用，如果是字符串则分割
                        const fileNames = Array.isArray(formData.evidence_rectification_name)
                            ? formData.evidence_rectification_name
                            : formData.evidence_rectification_name.split(',').map(i => i.trim()).filter(Boolean);

                        // 处理文件路径：如果是数组直接使用，如果是字符串则分割
                        const filePaths = Array.isArray(formData.evidence_rectification_path)
                            ? formData.evidence_rectification_path
                            : formData.evidence_rectification_path.split(',').map(i => i.trim()).filter(Boolean);

                        const fileListData = fileNames.map((name, index) => ({
                            uid: `file-${index}`,
                            name: name,
                            status: 'done',
                            url: filePaths[index] || ''
                        }));

                        setFileList(fileListData);
                    } else {
                        setFileList([]);
                    }
                } else {
                    correctiveForm.resetFields();
                    setFileList([]);
                }
            })
        }
    };

    // 处理整改弹框确认
    const handleCorrectiveSubmit = () => {
        correctiveForm.validateFields().then(values => {
            const newData = [...tableData];
            newData[currentRowIndex].整改数据 = {
                ...values,
                整改证据: fileList
            };
            setTableData(newData);
            setIsModalVisible(false);
            message.success('整改信息保存成功');
        }).catch(errorInfo => {
            // console.log('表单验证失败:', errorInfo);
        });
    };

    // 处理文件上传
    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };


    const handleVerificationConfirm = () => {
        const allFieldsToValidate = [
            'non_conformance_description',
            'cause_analysis',
            'rectification_measures',
            'responsible_person',
            'non_conformance_type',
            'planned_completion_time',
            // 'problem_closure_time',
            'file_validation',
            'on_site_verification',
            'verifier',
            'verification_date'
        ];

        correctiveForm.validateFields(allFieldsToValidate).then(values => {
            // 检查验证字段是否填写
            if (!values.file_validation) {
                message.error('请选择文件验证结果');
                return;
            }
            if (!values.on_site_verification) {
                message.error('请选择现场验证结果');
                return;
            }
            if (!values.verifier) {
                message.error('请输入验证人');
                return;
            }
            if (!values.verification_date) {
                message.error('请选择验证时间');
                return;
            }

            // 构建请求数据（不包含文件）
            const requestData = {
                // 基础信息
                level: record.level,
                number: record.number,
                area: form.getFieldValue('审核区域'),
                review_date: form.getFieldValue('审核日期'),
                element_number: currentRowIndex !== null ? tableData[currentRowIndex]?.序号 : '',
                inspection_content: currentRowIndex !== null ? tableData[currentRowIndex]?.检查内容 : '',
                reviewer: form.getFieldValue('审核人'),
                // 整改信息
                non_conformance_description: values.non_conformance_description,
                non_conformance_type:values.non_conformance_type,
                cause_analysis: values.cause_analysis,
                rectification_measures: values.rectification_measures,
                responsible_person: values.responsible_person,
                planned_completion_time: values.planned_completion_time ? dayjs(values.planned_completion_time).format(dateFormat) : '',
                // problem_closure_time: values.problem_closure_time ? dayjs(values.problem_closure_time).format(dateFormat) : '',

                // 验证信息
                file_validation: values.file_validation,
                on_site_verification: values.on_site_verification,
                verifier: values.verifier,
                verification_date: values.verification_date ? dayjs(values.verification_date).format(dateFormat) : '',
                department: record.department,
                workshop: record.workshop,
            };

            // 使用FormData处理文件上传
            const formData = new FormData();

            // 收集所有文件的二进制数据
            const fileBlobs = [];
            fileList.forEach((fileItem, index) => {
                // 只处理新上传的文件，忽略回填的旧文件
                if (fileItem.originFileObj) {
                    fileBlobs.push(fileItem.originFileObj);
                    formData.append('file', fileItem.originFileObj, fileItem.name);
                }
            });
            const verificationFileData = fileBlobs.length > 0 ? fileBlobs[0] : null;

            non_conform_put({ non_conform: JSON.stringify(requestData), file: verificationFileData }, (res) => {
                if (res.data.code == 200) {
                    message.success(res.data.msg);
                    setIsModalVisible(false);
                } else {
                    message.error(res.data.msg);
                }
            }, (error) => {
                message.error('网络错误，提交失败');
            });
        }).catch(errorInfo => {
            message.error('请完善整改信息和验证信息后再提交');
            // console.log('表单验证失败:', errorInfo);
        });
    };

    // 表格列定义
    const columns = [
        {
            title: 'key',
            dataIndex: '序号',
            key: '序号',
            width: 50,
        },
        {
            title: '检查内容',
            dataIndex: '检查内容',
            key: '检查内容',
            width: 300,
            render: (text, record, index) => (
                <Input
                    value={text}
                    onChange={(e) => handleTableChange(index, '检查内容', e.target.value, record)}
                    placeholder="请输入检查内容"
                />
            )
        },
        {
            title: '结果评价',
            dataIndex: '结果评价',
            key: '结果评价',
            width: 150,
            render: (text, record, index) => (
                <Select
                    value={text}
                    onChange={(value) => handleTableChange(index, '结果评价', value, record)}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                >
                    {resultOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            )
        },
        {
            title: '问题描述',
            dataIndex: '问题描述',
            key: '问题描述',
            width: 300,
            render: (text, record, index) => {
                const isRequired = record.结果评价 === 'N/C';
                return (
                    <div>
                        <Input
                            value={text}
                            onChange={(e) => handleTableChange(index, '问题描述', e.target.value, record)}
                            placeholder={isRequired ? "请输入问题描述 *" : "请输入问题描述"}
                            style={{
                                borderColor: isRequired && (!text || text.trim() === '') ? '#ff4d4f' : undefined,
                                backgroundColor: isRequired && (!text || text.trim() === '') ? '#fff2f0' : undefined
                            }}
                        />
                        {isRequired && (
                            <div style={{
                                color: '#ff4d4f',
                                fontSize: '12px',
                                marginTop: '2px',
                                display: (!text || text.trim() === '') ? 'block' : 'none'
                            }}>
                                * 评价结果为N/C时必须填写问题描述
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 50,
            render: (text, record, index) => (
                <Button
                    type="link"
                    danger
                    onClick={() => deleteRow(index)}
                    style={{ padding: 0 }}
                >
                    删除
                </Button>
            )
        }
    ];

    // 添加行
    const addRow = () => {
        const newRow = {
            id: Date.now(),
            序号: tableData.length + 1,
            检查内容: '',
            结果评价: '',
            问题描述: ''
        };
        setTableData([...tableData, newRow]);
    };

    // 删除行
    const deleteRow = (index) => {
        const newData = tableData.filter((_, i) => i !== index);
        setTableData(newData);
    };

    // 获取分层级别显示文本
    const getLevelText = (level) => {
        const levelMap = {
            1: '一级审核',
            2: '二级审核',
            3: '三级审核'
        };
        return levelMap[level] || '';
    };

    // 提交表单
    const handleSubmit = () => {
        form.validateFields().then(values => {
            // 验证N/C评价结果的问题描述
            const ncRows = tableData.filter((row, index) => row.结果评价 === 'N/C');
            const missingDescriptions = ncRows.filter((row, index) => !row.问题描述 || row.问题描述.trim() === '');

            if (missingDescriptions.length > 0) {
                message.error('评价结果为N/C的行必须填写问题描述');
                return;
            }

            setLoading(true);
            const submitData = {
                "number": values.编号,
                "level": record.level,
                "area": values.审核区域,
                "reviewer": values.审核人,
                "review_date": values.审核日期,
                "confirm": values.陪同人,
                department: record.department,
                workshop: record.workshop,
                data: tableData
            };
            audit_content(submitData, (res) => {
                if (res.data.code == 200) {
                    message.success(res.data.msg);
                    setLoading(false);
                } else {
                    message.error(res.data.msg);
                }
            })


        });
    };
    const handleSubmitOne = () => {
        // 先验证表单数据（只验证整改相关字段）
        const fieldsToValidate = [
            'non_conformance_description',
            'cause_analysis',
            'rectification_measures',
            'non_conformance_type',
            'responsible_person',
            'planned_completion_time',
            // 'problem_closure_time'
        ];

        correctiveForm.validateFields(fieldsToValidate).then(values => {
            // 获取所有字段值（包括验证字段，可能为空）
            const allValues = correctiveForm.getFieldsValue();

            // 构建请求数据（不包含文件）
            const requestData = {
                // 基础信息
                level: record.level,
                number: record.number,
                area: form.getFieldValue('审核区域'),
                review_date: form.getFieldValue('审核日期'),
                element_number: currentRowIndex !== null ? tableData[currentRowIndex]?.序号 : '',
                inspection_content: currentRowIndex !== null ? tableData[currentRowIndex]?.检查内容 : '',
                reviewer: form.getFieldValue('审核人'),
                // 整改信息
                non_conformance_description: values.non_conformance_description,
                non_conformance_type:allValues.non_conformance_type,
                cause_analysis: values.cause_analysis,
                rectification_measures: values.rectification_measures,
                responsible_person: values.responsible_person,
                planned_completion_time: values.planned_completion_time ? dayjs(values.planned_completion_time).format(dateFormat) : '',
                // problem_closure_time: values.problem_closure_time ? dayjs(values.problem_closure_time).format(dateFormat) : '',

                // 验证信息（可能为空）
                file_validation: allValues.file_validation || '',
                on_site_verification: allValues.on_site_verification || '',
                verifier: allValues.verifier || '',
                verification_date: allValues.verification_date ? dayjs(allValues.verification_date).format(dateFormat) : '',
                permission: 0,
                department: record.department,
                workshop: record.workshop,
            };

            // 使用FormData处理文件上传
            const formData = new FormData();

            // 收集所有文件的二进制数据
            const fileBlobs = [];
            fileList.forEach((fileItem, index) => {
                // 只处理新上传的文件，忽略回填的旧文件
                if (fileItem.originFileObj) {
                    fileBlobs.push(fileItem.originFileObj);
                    formData.append('file', fileItem.originFileObj, fileItem.name);
                }
            });
            const correctiveFileData = fileBlobs.length > 0 ? fileBlobs[0] : null;

            non_conform({ non_conform: JSON.stringify(requestData), file: correctiveFileData }, (res) => {
                if (res.data.code == 200) {
                    message.success(res.data.msg || '提交提交成功');
                    
                    // 将不符合项描述回填到对应表格行的问题描述中
                    if (currentRowIndex !== null) {
                        const newData = [...tableData];
                        newData[currentRowIndex].问题描述 = values.non_conformance_description;
                        setTableData(newData);
                    }
                    
                    setIsModalVisible(false);
                } else {
                    message.error(res.data.msg || '提交提交失败');
                }
            }, (error) => {
                message.error('网络错误，提交失败');
            });
        }).catch(errorInfo => {
            message.error('请完善整改信息后再提交');
            // console.log('表单验证失败:', errorInfo);
        });
    };
    return (
        <div>
            {!isModal && <MyBreadcrumb items={[window.sys_name, "分层审核", "审核表单"]} />}
            <div
                className="content_root"
                style={{
                    display: "flex",
                    rowGap: 20,
                    flexDirection: "column",
                }}
            >
                <Form
                    form={form}
                    layout="inline"
                >
                    <Form.Item label="分层级别" name="分层级别">
                        <Input
                            value={getLevelText(record.level)}
                            disabled
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </Form.Item>

                    <Form.Item label="编号" name="编号">
                        <Input
                            disabled
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="审核区域"
                        name="审核区域"
                        rules={[{ required: true, message: '请选择审核区域' }]}
                    >
                        <Select style={{ width: '150px' }} placeholder="请选择审核区域" onChange={(value) => {
                            examine_nick_name({ area: value, level: record.level, workshop: record.workshop }, (res) => {
                                if (res.data.code === 200) {
                                    set审核人(res.data.data);
                                }
                            })
                            getTableData(1)
                        }}>
                            {(quyu|| []).map(area => (
                                <Option key={area} value={area}>{area}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="审核人"
                        name="审核人"
                        rules={[{ required: true, message: '请输入审核人' }]}
                    >
                        <Select
                            showSearch
                            options={(审核人 || []).map((item) => ({
                                label: item,
                                value: item
                            }))}
                            style={{ width: '150px' }}
                            placeholder="请输入审核人"
                        />
                    </Form.Item>

                    <Form.Item
                        label="审核日期"
                        name="审核日期"
                        rules={[{ required: true, message: '请选择审核日期' }]}
                        getValueProps={(value) => ({
                            value: value ? dayjs(value) : dayjs()
                        })}
                        normalize={(value) => value ? value.format(dateFormat) : ''}
                    >
                        <DatePicker
                            onChange={() => {
                                getTableData(2)
                            }}
                            format={dateFormat}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="陪同人"
                        name="陪同人"
                        rules={[{ required: true, message: '请输入陪同人' }]}
                    >
                        <Input
                            style={{ width: '150px' }}
                            placeholder="陪同人"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleSubmit}
                    >
                        提交审核
                    </Button>
                    <Button
                        type="primary"
                        onClick={addRow}
                        style={{ marginLeft: '10px' }}
                    >
                        新增
                    </Button>
                    <Button onClick={() => {
                        if (isModal && onClose) {
                            onClose();
                        } else {
                            navigate(-1);
                        }
                    }} style={{ marginLeft: '10px' }}>
                        返回
                    </Button>
                </Form>
                <Table
                    rowKey="id"
                    bordered
                    size="small"
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />

                {/* 整改弹框 */}
                <Modal
                    title="整改信息"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={900}
                >
                    <Form
                        form={correctiveForm}
                        layout="vertical"
                        onFinish={handleCorrectiveSubmit}
                    >
                        {/* 基础信息回填 */}
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item label="分层级别">
                                    <Input
                                        value={getLevelText(record.level)}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="编号">
                                    <Input
                                        value={record.number}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="审核区域">
                                    <Input
                                        value={form.getFieldValue('审核区域')}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="审核日期">
                                    <Input
                                        value={form.getFieldValue('审核日期') ? dayjs(form.getFieldValue('审核日期')).format(dateFormat) : ''}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>



                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item label="审核人">
                                    <Input
                                        value={form.getFieldValue('审核人')}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="要素编号">
                                    <Input
                                        value={currentRowIndex !== null ? tableData[currentRowIndex]?.序号 : ''}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="检查内容">
                                    <Input
                                        value={currentRowIndex !== null ? tableData[currentRowIndex]?.检查内容 : ''}
                                        disabled
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="不符合项描述"
                                    name="non_conformance_description"
                                    rules={[{ required: true, message: '请输入不符合项描述' }]}
                                >
                                    <TextArea
                                        rows={3}
                                        placeholder="请详细描述不符合项内容"
                                        style={{ resize: 'none' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                             <Col span={8}>
                                                        <Form.Item
                                                            label="不符合项类型"
                                                            name="non_conformance_type"
                                                            rules={[{ required: true, message: '请输入不符合项类型' }]}
                                                        >
                                                            <Select
                                                                showSearch
                                                                options={(guanli || []).map((item) => ({
                                                                    label: item,
                                                                    value: item
                                                                }))}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="担当人"
                                    name="responsible_person"
                                    rules={[{ required: true, message: '请输入担当人' }]}
                                >
                                    <Select
                                        showSearch
                                        options={(制定人 || []).map((item) => ({
                                            label: item,
                                            value: item
                                        }))}
                                        placeholder="输入姓名"
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="计划完成时间"
                                    name="planned_completion_time"
                                    rules={[{ required: true, message: '请选择计划完成时间' }]}
                                >
                                    <DatePicker
                                        format={dateFormat}
                                        style={{ width: '100%' }}
                                        placeholder="选择日期"
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={8}>
                                <Form.Item
                                    label="问题关闭时间"
                                    name="problem_closure_time"
                                    rules={[{ required: true, message: '请选择问题关闭时间' }]}
                                >
                                    <DatePicker
                                        format={dateFormat}
                                        style={{ width: '100%' }}
                                        placeholder="选择日期"
                                    />
                                </Form.Item>
                            </Col> */}
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="原因分析"
                                    name="cause_analysis"
                                >
                                    <TextArea
                                        disabled
                                        rows={3}
                                        placeholder="请分析问题产生的根本原因"
                                        style={{ resize: 'none' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="整改措施"
                                    name="rectification_measures"
                                >
                                    <TextArea
                                        rows={3}
                                        disabled
                                        placeholder="请详细说明整改措施和具体实施方案"
                                        style={{ resize: 'none' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>



                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={18}>
                                <div>
                                    <label style={{ marginBottom: 8, display: 'block', fontWeight: 'bold' }}>
                                        整改证据
                                    </label>
                                    <Upload
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        beforeUpload={() => false}
                                        maxCount={1}
                                        disabled
                                        multiple={false}
                                    >
                                        <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                                            附件形式
                                        </Button>
                                    </Upload>
                                </div>
                            </Col>

                            <Col span={3}>
                                {/* <Button
                                    type="primary"
                                    onClick={handleCorrectivePlan}
                                    disabled
                                    style={{ width: '100%', marginTop: 40 }}
                                >
                                    提交
                                </Button> */}
                            </Col>
                            <Col span={3}>
                                <Button
                                    type="primary"
                                    onClick={handleSubmitOne}
                                    style={{ width: '100%', marginTop: 40 }}
                                >
                                    提交
                                </Button>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item
                                    label="文件验证"
                                    name="file_validation"
                                >
                                    <Radio.Group disabled>
                                        <Radio value="是">是</Radio>
                                        <Radio value="否">否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="现场验证"
                                    name="on_site_verification"
                                >
                                    <Radio.Group disabled>
                                        <Radio value="是">是</Radio>
                                        <Radio value="否">否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="验证人"
                                    name="verifier"
                                >
                                    <Input placeholder="输入姓名" disabled />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="验证时间"
                                    name="verification_date"
                                >
                                    <DatePicker
                                        format={dateFormat}
                                        style={{ width: '100%' }}
                                        placeholder="选择日期"
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={18}>

                            </Col>
                            <Col span={6}>
                                <Button
                                    type="primary"
                                    onClick={handleVerificationConfirm}
                                    style={{ width: '100%' }}
                                    disabled
                                >
                                    通过
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div >
        </div >
    );
}

export default AuditForm;