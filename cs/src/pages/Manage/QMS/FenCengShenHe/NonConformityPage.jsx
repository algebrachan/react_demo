import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, DatePicker, Form, Select, Space, Table, Tag, message, Input, Modal, Upload, Radio, Row, Col } from 'antd';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { selectList2Option, dateFormat } from "../../../../utils/string";
import { get_non_conform_search,real_review, non_conform, non_conform_put, nick_name, online_review, } from "../../../../apis/qms_router";
import dayjs from "dayjs";

const { TextArea } = Input;
const guanli=['管理类','标准类','执行类','其他类']
function NonConformityPage({ record: propRecord, onClose, isModal = false }) {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();

    const [cur, setCur] = useState(1);
    const [page_size, setPageSize] = useState(20);
    const [tb_total, setTbTotal] = useState(0);
    const [tb_data, setTbData] = useState([]);
    const [tb_load, setTbLoad] = useState(false);
    const [searchData, setSearchData] = useState({});
    const [制定人, set制定人] = useState([]);

    // 编辑弹窗相关状态
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentEditRecord, setCurrentEditRecord] = useState(null);
    const [fileList, setFileList] = useState([]);

    // 从路由状态或props获取记录信息
    const record = propRecord || location.state?.record || {};

    // 模拟搜索选项数据
    const mockSearchData = {
        分层级别: [{ label: '一级审核', value: 1 }, { label: '二级审核', value: 2 }, { label: '三级审核', value: 3 }],
    };

    const [reason, setReason] = useState('');
    const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
    const [isHtmlModalVisible, setIsHtmlModalVisible] = useState(false);
    const [isHtmlModalVisible2, setIsHtmlModalVisible2] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [htmlTitle, setHtmlTitle] = useState('');
    const [pathData, setPathData] = useState('');

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
                requestData(page, pageSize);
            },
        };
    };

    const handleEvidence = (record, index) => {
        online_review({ path: record.evidence_rectification_path[index] }, (res) => {
            // 检查返回的数据类型
            if (res.data) {
                // 如果是HTML内容，直接在弹窗中显示
                setPathData(record.evidence_rectification_path[index]);
                if (typeof res.data === 'string' && res.data.includes('<html')) {
                    setHtmlContent(res.data);
                    setHtmlTitle(record.evidence_rectification_name[index] || '整改证据');
                    setIsHtmlModalVisible(true);
                } else {
                    // 如果是二进制文件或其他类型，保持原有的下载逻辑
                    const blob = new Blob([res.data], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.style.display = 'none';
                    link.href = url;
                    link.download = record.evidence_rectification_name[index] || 'file';
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                }
            } else {
                message.error('获取文件内容失败');
            }
        }, (error) => {
            console.error('Error fetching evidence:', error);
            message.error('获取文件内容失败');
        });
    };

    const columns = [
        {
            title: '编号',
            dataIndex: 'number',
            key: 'number',
            width: 100,
            fixed: 'left',
        },
        {
            title: '分层级别',
            dataIndex: 'level',
            key: 'level',
            width: 100,
            render: (text) => {
                return text == 1 ? '一级审核' : text == 2 ? '二级审核' : '三级审核';
            }
        },
        {
            title: '审核日期',
            dataIndex: 'review_date',
            key: 'review_date',
            width: 120,
        },
        {
            title: '审核区域/工序',
            dataIndex: 'area',
            key: 'area',
            width: 150,
        },
        {
            title: '要素编号',
            dataIndex: 'element_number',
            key: 'element_number',
            width: 100,
        },
        {
            title: '不符合项描述',
            dataIndex: 'non_conformance_description',
            key: 'non_conformance_description',
            width: 200,
            ellipsis: true,
        },
         {
            title: '不符合项类型',
            dataIndex: 'non_conformance_type',
            key: 'non_conformance_type',
            width: 200,
            ellipsis: true,
        },
        {
            title: '原因分析',
            dataIndex: 'cause_analysis',
            key: 'cause_analysis',
            width: 200,
            ellipsis: true,
        },
        {
            title: '整改措施',
            dataIndex: 'rectification_measures',
            key: 'rectification_measures',
            width: 200,
            ellipsis: true,
        },
        {
            title: '担当人',
            dataIndex: 'responsible_person',
            key: 'responsible_person',
            width: 100,
        },
        {
            title: '计划完成时间',
            dataIndex: 'planned_completion_time',
            key: 'planned_completion_time',
            width: 120,
        },
        {
            title: '问题关闭时间',
            dataIndex: 'problem_closure_time',
            key: 'problem_closure_time',
            width: 120,
        },
        
        {
            title: "驳回原因",
            dataIndex: "reason",
            key: "reason",
            width: 120,
        },
        {
            title: '整改证据',
            dataIndex: 'evidence_rectification_name',
            key: 'evidence_rectification_name',
            width: 150,
            render: (text, record) => {
                if (!text) return null;

                const arr = Array.isArray(text) ? text : text.split(',').map(i => i.trim()).filter(Boolean);
                return arr.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            type="link"
                            style={{ padding: 0 }}
                            onClick={() => handleEvidence(record, index)}
                        >
                            {item}
                        </Button>
                    );
                });
            }
        },
        {
            title: '文件验证',
            dataIndex: 'file_validation',
            key: 'file_validation',
            width: 100,
            render: (text) => {
                let color = 'default';
                if (text === '是') color = 'green';
                else if (text === '否') color = 'red';
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: '现场验证',
            dataIndex: 'on_site_verification',
            key: 'on_site_verification',
            width: 100,
            render: (text) => {
                let color = 'default';
                if (text === '是') color = 'green';
                else if (text === '否') color = 'red';
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: '验证人',
            dataIndex: 'verifier',
            key: 'verifier',
            width: 100,
        },
        {
            title: '验证日期',
            dataIndex: 'verification_date',
            key: 'verification_date',
            width: 120,
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            fixed: 'right',
            width: 120,
            render: (text) => {
                let color = 'default';
                if (text === '通过') color = 'green';
                else if (text === '驳回') color = 'red';
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 70,
            render: (text, record) => (
                <Space>
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                </Space>
            ),
        },
    ];

    const handleDelete = (record) => {
        console.log(record);
    }

    const requestData = (page = 1, pageSize = 20) => {
        let val = form.getFieldsValue();

        // 处理日期格式化
        const params = { ...val };
        if (params.start_time) {
            params.start_time = dayjs(params.start_time).format('YYYY-MM-DD');
        }
        if (params.end_time) {
            params.end_time = dayjs(params.end_time).format('YYYY-MM-DD');
        }

        // 添加分页参数
        params.page = page;
        params.limit = pageSize;
        params.person = form.getFieldsValue().person;
        params.department = record.department || '';
        params.workshop = record.workshop || '';
        setTbLoad(true);
        get_non_conform_search(params, (res) => {
            if (res.data.code == 200) {
                setTbData(res.data.data);
                setTbTotal(res.data.total);
                setTbLoad(false);
            } else {
                message.error(res.data.msg);
                setTbLoad(false);
            }
        }, (error) => {
            console.log(error);
            setTbLoad(false);
        });
    };

    const handleEdit = (record) => {
        setCurrentEditRecord(record);
        setIsEditModalVisible(true);

        // 从表格记录回填数据
        const formData = { ...record };

        // 转换日期字段为 dayjs 对象
        if (formData.planned_completion_time) {
            formData.planned_completion_time = dayjs(formData.planned_completion_time);
        }
        if (formData.verification_date) {
            formData.verification_date = dayjs(formData.verification_date);
        }

        editForm.setFieldsValue(formData);

        // 处理附件回填 - 支持多文件，兼容数组和字符串格式
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
    };

    const handleUploadChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    // 处理点击文件名的函数
    const handleFileClick = (file) => {
        if (file.originFileObj) {
            const formData = new FormData();
            formData.append('file', file.originFileObj, file.name);
            real_review(formData, (res) => {
                    setHtmlContent(res.data);
                    setIsHtmlModalVisible2(true);
            }, (error) => {

            });
            }

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

    // 提交提交
    const handleCorrectivePlan = () => {
        const fieldsToValidate = [
            'non_conformance_description',
            'cause_analysis',
            'rectification_measures',
            'responsible_person',
            'planned_completion_time',
        ];

        editForm.validateFields(fieldsToValidate).then(values => {
            const allValues = editForm.getFieldsValue();

            const requestDatas = {
                level: currentEditRecord.level,
                number: currentEditRecord.number,
                area: currentEditRecord.area,
                review_date: currentEditRecord.review_date,
                element_number: currentEditRecord.element_number,
                inspection_content: currentEditRecord.inspection_content || '',
                reviewer: currentEditRecord.reviewer,
                non_conformance_description: values.non_conformance_description,
                non_conformance_type:values.non_conformance_type,
                cause_analysis: values.cause_analysis,
                rectification_measures: values.rectification_measures,
                responsible_person: values.responsible_person,
                planned_completion_time: values.planned_completion_time ? dayjs(values.planned_completion_time).format(dateFormat) : '',
                file_validation: allValues.file_validation || '',
                on_site_verification: allValues.on_site_verification || '',
                verifier: allValues.verifier || '',
                verification_date: allValues.verification_date ? dayjs(allValues.verification_date).format(dateFormat) : '',
                permission: 1,
                department: currentEditRecord.department || '',
                workshop: currentEditRecord.workshop || '',
            };

            const formData = new FormData();
            const fileBlobs = [];
            fileList.forEach((fileItem, index) => {
                // 只处理新上传的文件，忽略回填的旧文件
                if (fileItem.originFileObj) {
                    fileBlobs.push(fileItem.originFileObj);
                    formData.append('file', fileItem.originFileObj, fileItem.name);
                }
            });
            // 支持多文件上传
            const correctiveFileData = fileBlobs.length > 0 ? fileBlobs : null;
            formData.append("non_conform", JSON.stringify(requestDatas));
            non_conform(formData, (res) => {
                if (res.data.code == 200) {
                    message.success(res.data.msg);
                    setIsEditModalVisible(false);
                    requestData(); // 刷新列表
                } else {
                    message.error(res.data.msg);
                }
            }, (error) => {
            });
        }).catch(errorInfo => {
            message.error('请完善整改信息后再提交');
        });
    };

    // 通过提交
    const handleVerificationConfirm = (status) => {
        const allFieldsToValidate = [
            'non_conformance_description',
            'cause_analysis',
            'rectification_measures',
            'responsible_person',
            'planned_completion_time',
            'file_validation',
            'on_site_verification',
            'verifier',
            'verification_date'
        ];

        editForm.validateFields(allFieldsToValidate).then(values => {

            if (status != '驳回') {
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
            } else {
                // 气泡弹出框
                setIsReasonModalVisible(true);
                return;
            }

            const requestDatas = {
                level: currentEditRecord.level,
                number: currentEditRecord.number,
                area: currentEditRecord.area,
                review_date: currentEditRecord.review_date,
                element_number: currentEditRecord.element_number,
                inspection_content: currentEditRecord.inspection_content || '',
                reviewer: currentEditRecord.reviewer,
                non_conformance_description: values.non_conformance_description,
                non_conformance_type:values.non_conformance_type,
                cause_analysis: values.cause_analysis,
                rectification_measures: values.rectification_measures,
                responsible_person: values.responsible_person,
                planned_completion_time: values.planned_completion_time ? dayjs(values.planned_completion_time).format(dateFormat) : '',
                file_validation: values.file_validation,
                on_site_verification: values.on_site_verification,
                verifier: values.verifier,
                verification_date: values.verification_date ? dayjs(values.verification_date).format(dateFormat) : '',
                permission: 2,
                status: status,
                department: currentEditRecord.department || '',
                workshop: currentEditRecord.workshop || '',
            };

            const formData = new FormData();
            const fileBlobs = [];
            fileList.forEach((fileItem, index) => {
                // 只处理新上传的文件，忽略回填的旧文件
                if (fileItem.originFileObj) {
                    fileBlobs.push(fileItem.originFileObj);
                    formData.append('file', fileItem.originFileObj, fileItem.name);
                }
            });
            // 支持多文件上传
            const verificationFileData = fileBlobs.length > 0 ? fileBlobs : null;
            formData.append("non_conform", JSON.stringify(requestDatas));
            non_conform_put(formData, (res) => {
                if (res.data.code == 200) {
                    message.success(res.data.msg);
                    setIsEditModalVisible(false);
                    requestData(); // 刷新列表
                } else {
                    message.error(res.data.msg);
                }
            }, (error) => {
                message.error('网络错误，提交失败');
            });
        }).catch(errorInfo => {
            message.error('请完善整改信息和验证信息后再提交');
        });
    };

    const handleBack = () => {
        if (isModal && onClose) {
            onClose();
        } else {
            navigate(`/mng/qms_fen_ceng_shen_he`);
        }
    };

    useEffect(() => {
        nick_name({}, (res) => {
            if (res.data.code === 200) {
                set制定人(res.data.data);
            }
        })
        setSearchData(mockSearchData);
        form.setFieldsValue({
            level: record.level,
            number: record.number,
            start_time: '',
            end_time: '',
            person: '否'
        });
        requestData();
    }, [record]);

    return (
        <div>
            {!isModal && <MyBreadcrumb items={[window.sys_name, "分层审核", "不符合项目详情"]} />}
            <div
                className="content_root"
                style={{
                    display: "flex",
                    rowGap: 20,
                    flexDirection: "column",
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        style={{ marginRight: 16 }}
                    >
                        返回
                    </Button>
                </div>

                <Form layout="inline" form={form}>
                    <Form.Item label="分层级别" name="level">
                        <Select
                            options={(searchData.分层级别 || [])}
                            style={{ width: 150 }}
                            placeholder="请选择"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item label="编号" name="number">
                        <Input
                            style={{ width: 150 }}
                            placeholder="请输入"
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item label="开始时间" name="start_time">
                        <DatePicker style={{ width: 150 }} placeholder="请选择开始时间" />
                    </Form.Item>
                    <Form.Item label="结束时间" name="end_time">
                        <DatePicker style={{ width: 150 }} placeholder="请选择结束时间" />
                    </Form.Item>
                    <Form.Item
                        label="本人审批项"
                        name="person"
                    >
                        <Radio.Group >
                            <Radio value="是">是</Radio>
                            <Radio value="否">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Space>
                        <Button type="primary" onClick={() => {
                            setCur(1);
                            requestData(1, page_size);
                        }}>
                            搜索
                        </Button>
                        <Button onClick={() => {
                            form.resetFields();
                            setCur(1);
                            requestData(1, page_size);
                        }}>
                            重置
                        </Button>
                    </Space>
                </Form>

                <Table
                    rowKey="id"
                    bordered
                    loading={tb_load}
                    size="small"
                    columns={columns}
                    dataSource={tb_data}
                    scroll={{
                        x: "max-content",
                        y: 500
                    }}
                    pagination={pagination()}
                />
            </div>

            {/* 编辑弹窗 */}
            <Modal
                title="编辑不符合项"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                width={900}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                >
                    {/* 基础信息回填 */}
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="分层级别">
                                <Input
                                    value={currentEditRecord ? getLevelText(currentEditRecord.level) : ''}
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="编号">
                                <Input
                                    value={currentEditRecord?.number || ''}
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="审核区域">
                                <Input
                                    value={currentEditRecord?.area || ''}
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="审核日期">
                                <Input
                                    value={currentEditRecord?.review_date || ''}
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
                                    value={currentEditRecord?.reviewer || ''}
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="要素编号">
                                <Input
                                    value={currentEditRecord?.element_number || ''}
                                    disabled
                                    style={{ backgroundColor: '#f5f5f5' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="检查内容">
                                <Input
                                    value={currentEditRecord?.inspection_content || ''}
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
                                    disabled
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
                                    disabled
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
                                    disabled
                                    style={{ width: '100%' }}
                                    placeholder="输入姓名"
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
                                    disabled
                                    format={dateFormat}
                                    style={{ width: '100%' }}
                                    placeholder="选择日期"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="原因分析"
                                name="cause_analysis"
                                rules={[{ required: true, message: '请输入原因分析' }]}
                            >
                                <TextArea
                                    disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回") ? false : true}
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
                                rules={[{ required: true, message: '请输入整改措施' }]}
                            >
                                <TextArea
                                    rows={3}
                                    disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回") ? false : true}
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
                                    multiple={true}
                                    disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回") ? false : true}
                                    itemRender={(originNode, file) => {
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
                                                <span
                                                    style={{
                                                        color: '#1890ff',
                                                        cursor: 'pointer',
                                                        textDecoration: 'underline',
                                                        flex: 1
                                                    }}
                                                    onClick={() => handleFileClick(file)}
                                                >
                                                    {file.name}
                                                </span>
                                                {!((currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回") ? false : true) && (
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        onClick={() => {
                                                            const newFileList = fileList.filter(item => item.uid !== file.uid);
                                                            setFileList(newFileList);
                                                        }}
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        删除
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    }}
                                >
                                    <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                                        附件形式
                                    </Button>
                                </Upload>
                            </div>
                        </Col>
                        <Col span={6}>
                            <Button
                                type="primary"
                                onClick={handleCorrectivePlan}
                                style={{ width: '100%', marginTop: 40 }}
                                disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回") ? false : true}
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
                                <Radio.Group disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回"|| currentEditRecord?.status == "通过") ? true : false}>
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
                                <Radio.Group disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回"|| currentEditRecord?.status == "通过") ? true : false}>
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
                                <Select
                                    showSearch
                                    disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回"|| currentEditRecord?.status == "通过") ? true : false}
                                    options={(制定人 || []).map((item) => ({
                                        label: item,
                                        value: item
                                    }))}
                                    style={{ width: '100%' }}
                                    placeholder="输入姓名"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="验证时间"
                                name="verification_date"
                            >
                                <DatePicker
                                    disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回"|| currentEditRecord?.status == "通过") ? true : false}
                                    format={dateFormat}
                                    style={{ width: '100%' }}
                                    placeholder="选择日期"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={18}>
                        </Col>
                        <Col span={3}>
                            <Button
                                type="primary"
                                onClick={() => handleVerificationConfirm("驳回")}
                                disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回"|| currentEditRecord?.status == "通过") ? true : false}
                                style={{ width: '100%' }}
                            >
                                驳回
                            </Button>
                        </Col>
                        <Col span={3}>
                            <Button
                                type="primary"
                                onClick={() => handleVerificationConfirm("通过")}
                                disabled={(currentEditRecord?.status == "待填写提交" || currentEditRecord?.status == "待填写整改计划"|| currentEditRecord?.status == "驳回"|| currentEditRecord?.status == "通过") ? true : false}
                                style={{ width: '100%' }}
                            >
                                通过
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="驳回原因"
                open={isReasonModalVisible}
                onOk={() => {
                    if (!reason.trim()) {
                        message.error('请输入驳回原因');
                        return;
                    }
                    setIsReasonModalVisible(false);
                    // 继续处理驳回逻辑
                    const values = editForm.getFieldsValue();
                    const requestDatas = {
                        level: currentEditRecord.level,
                        number: currentEditRecord.number,
                        area: currentEditRecord.area,
                        review_date: currentEditRecord.review_date,
                        element_number: currentEditRecord.element_number,
                        inspection_content: currentEditRecord.inspection_content || '',
                        reviewer: currentEditRecord.reviewer,
                        non_conformance_description: values.non_conformance_description,
                        cause_analysis: values.cause_analysis,
                        non_conformance_type:values.non_conformance_type,
                        rectification_measures: values.rectification_measures,
                        responsible_person: values.responsible_person,
                        planned_completion_time: values.planned_completion_time ? dayjs(values.planned_completion_time).format(dateFormat) : '',
                        file_validation: values.file_validation,
                        on_site_verification: values.on_site_verification,
                        verifier: values.verifier,
                        verification_date: values.verification_date ? dayjs(values.verification_date).format(dateFormat) : '',
                        permission: 2,
                        status: '驳回',
                        reason: reason,
                        department: currentEditRecord.department || '',
                        workshop: currentEditRecord.workshop || '',
                    };

                    const formData = new FormData();
                    const fileBlobs = [];
                    fileList.forEach((fileItem, index) => {
                        if (fileItem.originFileObj) {
                            fileBlobs.push(fileItem.originFileObj);
                            formData.append('file', fileItem.originFileObj, fileItem.name);
                        }
                    });
                    const verificationFileData = fileBlobs.length > 0 ? fileBlobs : null;
                    formData.append("non_conform", JSON.stringify(requestDatas));
                    non_conform_put(formData, (res) => {
                        if (res.data.code == 200) {
                            message.success(res.data.msg);
                            setIsEditModalVisible(false);
                            requestData();
                        } else {
                            message.error(res.data.msg);
                        }
                    }, (error) => {
                        message.error('网络错误，提交失败');
                    });
                }}
                onCancel={() => setIsReasonModalVisible(false)}
            >
                <Input.TextArea
                    placeholder="请输入驳回原因"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                />
            </Modal>

            <Modal
                title={htmlTitle}
                open={isHtmlModalVisible}
                onCancel={() => setIsHtmlModalVisible(false)}
                footer={[
                    <div key="footer">
                        <Button key="download" type='primary' style={{ marginRight: '10px' }} onClick={() => {
                            const url = new URL(import.meta.env.VITE_BASE_API + '/api/layered_audit/download_online_review');
                            url.searchParams.append('path', pathData);
                            window.open(url.toString(), "_blank");
                        }}>
                            下载
                        </Button>
                        <Button key="close" onClick={() => setIsHtmlModalVisible(false)}>
                            关闭
                        </Button>
                    </div>
                ]}
                width={1400}
                style={{
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    style={{
                        padding: '16px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        backgroundColor: '#fafafa',
                        maxHeight: '60vh',
                        overflow: 'auto'
                    }}
                />
            </Modal>
             <Modal
                title={htmlTitle}
                open={isHtmlModalVisible2}
                onCancel={() => setIsHtmlModalVisible2(false)}
                footer={[
                    <div key="footer">
                        <Button key="close" onClick={() => setIsHtmlModalVisible2(false)}>
                            关闭
                        </Button>
                    </div>
                ]}
                width={1400}
                style={{
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    style={{
                        padding: '16px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '4px',
                        backgroundColor: '#fafafa',
                        maxHeight: '60vh',
                        overflow: 'auto'
                    }}
                />
            </Modal>
        </div>
    );
}

export default NonConformityPage;
