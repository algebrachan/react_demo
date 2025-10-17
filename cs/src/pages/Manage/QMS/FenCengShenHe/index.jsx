import React, {useEffect, useState} from "react";
import {MyBreadcrumb} from "../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Badge,
  Row,
  Col,
  message,
  InputNumber,
  Modal,
  TreeSelect
} from "antd";
import {selectList2Option, dateFormat, timeFormat} from "../../../../utils/string";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {
  get_layered_audit_plan,
  layered_audit_plan,
  fixed_info,
  nick_name,
  layered_audit_plan_fencile_delete
} from "../../../../apis/qms_router";
import ReviewDetail from "./ReviewDetail.jsx";
import NonConformityPage from "./NonConformityPage.jsx";
import AuditForm from "./AuditForm.jsx";
import AuditForm_auto from "./AuditForm_auto.jsx";

const {RangePicker} = DatePicker;
let id = ''
let mockOpData = {}

function CustomerComplaint({isMobile = false}) {
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const navigate = useNavigate();
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [opData, setOpData] = useState({制定部门: {}, 分层级别: []});
  // 新增Modal相关状态
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalLoading, setAddModalLoading] = useState(false);
  // 查看详情Modal相关状态
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  // 不符合项目Modal相关状态
  const [nonConformityModalVisible, setNonConformityModalVisible] = useState(false);
  const [nonConformityRecord, setNonConformityRecord] = useState(null);
  // 审核记录Modal相关状态
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditRecord, setAuditRecord] = useState(null);
  const [auditType, setAuditType] = useState('normal'); // 'normal' 或 'auto'
  const default_form_data = {}
  const [department, setDepartment] = useState('');
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
        // 请求数据
      },
    };
  };
  const initOpt = () => {
    mockOpData = {
      分层级别: [{label: '一级审核', value: 1}, {label: '二级审核', value: 2}, {label: '三级审核', value: 3}],
      级联数据: {},
      制定部门: {},
      子部门: [],
      制定人: []
    };
    // 先设置初始数据
    setOpData(mockOpData);
    fixed_info({typeof: 1}, (res) => {
      if (res.data.code === 200) {
        // 保存原始级联数据
        mockOpData.级联数据 = res.data.data;
        // 提取所有制定部门（去重）
        const allDepartments = new Set();
        Object.values(res.data.data).forEach(levelData => {
          Object.keys(levelData).forEach(dept => {
            allDepartments.add(dept);
          });
        });
        // 构建制定部门选项
        mockOpData.制定部门 = Array.from(allDepartments).reduce((acc, dept) => {
          acc[dept] = dept;
          return acc;
        }, {});
        setDepartment(Array.from(allDepartments)[0] || '');
        // 更新opData
        setOpData({...mockOpData});
      }
    })
    nick_name({}, (res) => {
      if (res.data.code === 200) {
        mockOpData.制定人 = res.data.data;
        setOpData({...mockOpData});
      }
    })
    form.setFieldsValue({
      分层级别: [],
      制定人: '',
      创建日期: ['', ''],
      生效日期: ['', ''],
    });
    requestData();
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "number",
      key: "number",
      width: 120,
    },
    {
      title: "分层级别",
      dataIndex: "level",
      key: "level",
      width: 120,
      render: (text) => {
        return (opData.分层级别 || []).find(item => item.value === text)?.label || '';
      }
    },
    {
      title: "创建日期",
      dataIndex: "creation_date",
      key: "creation_date",
      width: 120,
    },
    {
      title: "生效日期",
      dataIndex: "effective_date",
      key: "effective_date",
      width: 120,
    },
    {
      title: "制定人",
      dataIndex: "set_person",
      key: "set_person",
      width: 120,
    },
    // {
    //   title: "当前审核状态",
    //   dataIndex: "current_status",
    //   key: "current_status",
    //   width: 120,
    // },
    {
      title: "制定部门",
      dataIndex: "department",
      key: "department",
      width: 120,
    },
    {
      title: "子部门",
      dataIndex: "workshop",
      key: "workshop",
      width: 120,
    },
    {
      title: "不符合项目",
      dataIndex: "不符合项目",
      key: "不符合项目",
      width: 120,
      render: (text, record) => (
        <Badge count={record.non_conform_count}>
          <Button
            type="link"
            style={{padding: 0}}
            onClick={() => handleNonConformityView(record)}
          >
            查看
          </Button>
        </Badge>
      ),
    },
    {
      title: "审核计划",
      key: "opt",
      fixed: "right",
      width: 120,
      render: (record) => (
        <Space>
          <Button
            type="link"
            style={{padding: 0}}
            onClick={() => handleReviewView(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
    {
      title: "审核记录",
      key: "opt",
      fixed: "right",
      width: 120,
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            style={{padding: 0}}
            onClick={() => handleReviewAudit(record)}
          >
            {/* {record.current_status} */}
            查看
          </Button>
        </Space>
      ),
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 120,
      render: (record) => (
        <Space>
          <Button
            danger
            type="link"
            style={{padding: 0}}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这条审核计划吗？删除后无法恢复。',
                okText: '确认删除',
                cancelText: '取消',
                okType: 'danger',
                onOk() {
                  layered_audit_plan_fencile_delete({_id: record._id}, (res) => {
                    requestData()
                    message.success(res.data.msg)
                  })
                }
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
  const requestData = (page = 1, pageSize = 20) => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    get_layered_audit_plan(
      {
        limit: pageSize,
        page: page,
        level: val.分层级别,
        set_person: val.制定人,
        creation_date: val.创建日期,
        effective_date: val.生效日期,
        department: val.制定部门,
        workshop: val.子部门
      },
      (res) => {
        setTbLoad(false);
        if (res.data.code === 200 && res.data.data) {
          setTbData(res.data.data);
          setTbTotal(res.data.length);
        } else {
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        setTbTotal(0);
      }
    );
  };
  const handleSelectAllLevels = () => {
    const allLevels = (opData.分层级别 || []).map(item => item.value);
    form.setFieldsValue({
      分层级别: allLevels
    });
  };
  useEffect(() => {
    initOpt();
  }, []);
  // 处理查看详情
  const handleReviewView = (record) => {
    setCurrentRecord(record);
    setReviewModalVisible(true);
  };
  // 处理审核
  const handleReviewAudit = (record) => {
    setAuditRecord(record);
    if (record.level == 2) {
      setAuditType('auto');
    } else {
      setAuditType('normal');
    }
    setAuditModalVisible(true);
  };
  // 处理不符合项目查看
  const handleNonConformityView = (record) => {
    setNonConformityRecord(record);
    setNonConformityModalVisible(true);
  };
  // 处理新增审核计划
  const handleAddPlan = () => {
    setAddModalVisible(true);
    const firstDepartment = Object.keys(opData.制定部门 || {})[0] || '';
    setDepartment(firstDepartment);
    addForm.setFieldsValue({
      分层级别: opData.分层级别?.[0]?.value || '',
      制定部门: firstDepartment,
      子部门: '',
      创建日期: '',
      生效日期: '',
    });
  };
  // 提交新增审核计划
  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      setAddModalLoading(true);
      layered_audit_plan({
          level: values.分层级别,
          // set_person: values.制定人,
          creation_date: dayjs().format(dateFormat),
          effective_date: values.生效日期,
          department: values.制定部门,
          workshop: values.子部门,
        },
        (res) => {
          setAddModalLoading(false);
          setAddModalVisible(false);
          if (res.data.code === 200) {
            message.success(res.data.msg);
            requestData(cur, page_size);
          } else {
            message.error(res.data.msg);
          }
        },
        () => {
          setAddModalLoading(false);
        }
      )
    });
  };
  return (
    <div>
      {!isMobile && <MyBreadcrumb items={[window.sys_name, "分层审核"]} />}
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form layout="inline" form={form}>

          <Form.Item label="分层级别">
            <Space.Compact>
              <Form.Item name="分层级别" noStyle>
                <Select
                  allowClear
                  options={opData.分层级别 || []}
                  style={{width: 200}}
                  maxTagCount={1}
                  mode="multiple"
                  placeholder="请选择分层级别"
                  onChange={() => {
                    // 当分层级别改变时，清空子部门选择以触发重新计算
                    form.setFieldsValue({子部门: undefined});
                  }}
                />
              </Form.Item>
              <Button type="link" onClick={handleSelectAllLevels}>一键全选</Button>
            </Space.Compact>
          </Form.Item>
          <Form.Item label="制定人" name="制定人">
            <Select
              showSearch
              options={(opData.制定人 || []).map((item) => ({
                label: item,
                value: item
              }))}
              placeholder="请输入制定人"
              style={{width: 100}}
            />
          </Form.Item>
          <Form.Item
            label="制定部门"
            name="制定部门"
            style={{marginBottom: '24px'}}
          >
            <Select
              allowClear
              options={Object.keys(opData.制定部门 || {}).map((key) => ({
                label: key,
                value: key
              }))}
              onChange={(value) => {
                setDepartment(value || '');
                form.setFieldsValue({子部门: undefined});
              }}
              placeholder="请选择制定部门"
              style={{width: 150}}
            />
          </Form.Item>
          <Form.Item
            label="子部门"
            name="子部门"
            style={{marginBottom: '24px'}}
          >
            <Select
              allowClear
              options={(() => {
                if (!department || !opData.级联数据) return [];
                // 获取当前选中的分层级别
                const selectedLevels = form.getFieldValue('分层级别') || [];
                const allSubDepts = new Set();
                // 如果没有选择分层级别，显示所有子部门
                if (selectedLevels.length === 0) {
                  Object.values(opData.级联数据).forEach(levelData => {
                    if (levelData[department]) {
                      levelData[department].forEach(subDept => allSubDepts.add(subDept));
                    }
                  });
                } else {
                  // 根据选中的分层级别显示对应的子部门
                  selectedLevels.forEach(level => {
                    const levelKey = opData.分层级别.find(item => item.value === level)?.label;
                    if (levelKey && opData.级联数据[levelKey] && opData.级联数据[levelKey][department]) {
                      opData.级联数据[levelKey][department].forEach(subDept => allSubDepts.add(subDept));
                    }
                  });
                }
                return Array.from(allSubDepts).map(subDept => ({
                  label: subDept,
                  value: subDept
                }));
              })()}
              placeholder="请选择子部门"
              style={{width: 150}}
            />
          </Form.Item>
          <Form.Item
            label="创建日期"
            name="创建日期"
            getValueProps={(value) => {
              return {
                value: value && value.length === 2 && value.every(v => v)
                  ? [dayjs(value[0]), dayjs(value[1])]
                  : undefined,
              };
            }}
            normalize={(value) => {
              return value && value.length === 2
                ? [value[0].format(dateFormat), value[1].format(dateFormat)]
                : ['', ''];
            }}
          >
            <RangePicker
              style={{width: 220}}
              allowClear={true}
              placeholder={['开始日期', '结束日期']}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item
            label="生效日期"
            name="生效日期"
            getValueProps={(value) => {
              return {
                value: value && value.length === 2 && value.every(v => v)
                  ? [dayjs(value[0]), dayjs(value[1])]
                  : undefined,
              };
            }}
            normalize={(value) => {
              return value && value.length === 2
                ? [value[0].format(dateFormat), value[1].format(dateFormat)]
                : ['', ''];
            }}
          >
            <RangePicker
              style={{width: 220}}
              allowClear={true}
              placeholder={['开始日期', '结束日期']}
              format={dateFormat}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => requestData(cur, page_size)}>
                查询
              </Button>
            </Space>
            <Space>
              <Button style={{marginLeft: 10}} onClick={handleAddPlan}>
                新增审核计划
              </Button>
            </Space>
          </Form.Item>

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
          }}
          pagination={pagination()}
        />
      </div>
      {/* 新增审核计划Modal */}
      <Modal
        title="新增审核计划"
        open={addModalVisible}
        onOk={handleAddSubmit}
        onCancel={() => setAddModalVisible(false)}
        confirmLoading={addModalLoading}
        width={700}
        okText="确认新增"
        cancelText="取消"
        styles={{
          body: {
            padding: '32px 24px',
            backgroundColor: '#fafafa'
          }
        }}
      >
        <div style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <Form
            form={addForm}
            layout="horizontal"
            labelCol={{span: 10}}
            wrapperCol={{span: 14}}
          >
            <Row gutter={[32, 24]}>
              <Col span={12}>
                <Form.Item
                  label="分层级别"
                  name="分层级别"
                  rules={[{required: true, message: '请选择分层级别'}]}
                  style={{marginBottom: '24px'}}
                >
                  <Select
                    options={opData.分层级别 || []}
                    onChange={(value) => {
                      // 当分层级别改变时，清空制定部门和子部门选择
                      addForm.setFieldsValue({制定部门: undefined, 子部门: undefined});
                      setDepartment('');
                      // 设置默认的制定部门
                      if (value && opData.级联数据) {
                        const levelKey = opData.分层级别.find(item => item.value === value)?.label;
                        if (levelKey && opData.级联数据[levelKey]) {
                          const firstDept = Object.keys(opData.级联数据[levelKey])[0];
                          if (firstDept) {
                            setTimeout(() => {
                              addForm.setFieldsValue({制定部门: firstDept});
                              setDepartment(firstDept);
                            }, 0);
                          }
                        }
                      }
                    }}
                    placeholder="请选择分层级别"
                    style={{borderRadius: '6px'}}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                {/* <Form.Item
                                    label="制定人"
                                    name="制定人"
                                    rules={[{ required: true, message: '请选择制定人' }]}
                                    style={{ marginBottom: '24px' }}
                                >
                                    <Select
                                        showSearch
                                        options={(opData.制定人 || []).map((item) => ({
                                            label: item,
                                            value: item
                                        }))}
                                        placeholder="请输入制定人"
                                        style={{ borderRadius: '6px' }}
                                    />
                                </Form.Item> */}
                <Form.Item
                  label="生效日期"
                  name="生效日期"
                  rules={[{required: true, message: '请选择生效日期'}]}
                  style={{marginBottom: '24px'}}
                  labelCol={{span: 8}}
                  wrapperCol={{span: 16}}
                  getValueProps={(value) => {
                    return {
                      value: value ? dayjs(value) : '',
                    };
                  }}
                  normalize={(value) => {
                    return value ? value.format(dateFormat) : '';
                  }}
                >
                  <DatePicker
                    style={{width: '100%', borderRadius: '6px'}}
                    format={dateFormat}
                    placeholder="请选择生效日期"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[32, 24]}>
              <Col span={12}>
                <Form.Item
                  label="制定部门"
                  name="制定部门"
                  rules={[{required: true, message: '请选择制定部门'}]}
                  style={{marginBottom: '24px'}}
                >
                  <Select
                    options={(() => {
                      // 获取当前选中的分层级别
                      const selectedLevel = addForm.getFieldValue('分层级别');
                      if (!selectedLevel || !opData.级联数据) return [];
                      // 根据选中的分层级别获取对应的制定部门
                      const levelKey = opData.分层级别.find(item => item.value === selectedLevel)?.label;
                      if (!levelKey || !opData.级联数据[levelKey]) return [];
                      return Object.keys(opData.级联数据[levelKey]).map(dept => ({
                        label: dept,
                        value: dept
                      }));
                    })()}
                    onChange={(value) => {
                      setDepartment(value);
                      addForm.setFieldsValue({子部门: undefined});
                    }}
                    placeholder="请选择制定部门"
                    style={{borderRadius: '6px'}}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="子部门"
                  name="子部门"
                  rules={[{required: true, message: '请选择子部门'}]}
                  style={{marginBottom: '24px'}}
                >
                  <Select
                    options={(() => {
                      if (!department || !opData.级联数据) return [];
                      // 获取当前选中的分层级别
                      const selectedLevel = addForm.getFieldValue('分层级别');
                      if (!selectedLevel) return [];
                      // 根据选中的分层级别获取对应的子部门
                      const levelKey = opData.分层级别.find(item => item.value === selectedLevel)?.label;
                      if (!levelKey || !opData.级联数据[levelKey] || !opData.级联数据[levelKey][department]) {
                        return [];
                      }
                      return opData.级联数据[levelKey][department].map(subDept => ({
                        label: subDept,
                        value: subDept
                      }));
                    })()}
                    placeholder="请选择子部门"
                    style={{borderRadius: '6px'}}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[32, 24]}>
              <Col span={12}>


              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      {/* 审核详情Modal */}
      <Modal
        title="审核详情"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        width={1200}
        style={{top: 20}}
      >
        {currentRecord && (
          <ReviewDetail
            record={currentRecord}
            onClose={() => setReviewModalVisible(false)}
            requestData={() => requestData(cur, page_size)}
          />
        )}
      </Modal>

      {/* 不符合项目Modal */}
      <Modal
        title="不符合项目详情"
        open={nonConformityModalVisible}
        onCancel={() => setNonConformityModalVisible(false)}
        footer={null}
        width={1800}
        style={{top: 20}}
      >
        {nonConformityRecord && (
          <NonConformityPage
            record={nonConformityRecord}
            onClose={() => setNonConformityModalVisible(false)}
            isModal={true}
          />
        )}
      </Modal>

      {/* 审核记录Modal */}
      <Modal
        title={auditType === 'auto' ? "审核表单(自动)" : "审核表单"}
        open={auditModalVisible}
        onCancel={() => setAuditModalVisible(false)}
        footer={null}
        width={1800}
        style={{top: 20}}
      >
        {auditRecord && (
          auditType === 'auto' ? (
            <AuditForm_auto
              record={auditRecord}
              onClose={() => setAuditModalVisible(false)}
              isModal={true}
            />
          ) : (
            <AuditForm
              record={auditRecord}
              onClose={() => setAuditModalVisible(false)}
              isModal={true}
            />
          )
        )}
      </Modal>
    </div>
  );
}

export default CustomerComplaint;