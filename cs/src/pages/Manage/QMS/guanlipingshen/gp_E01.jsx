import React, { useState, useMemo,useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Modal, 
  Upload, 
  message,
  Tag,
  Form 
} from 'antd';
import { 
  PlusOutlined,
  UploadOutlined,
  FileOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './gp_E01.less';
import {item_tracking,item_tracking_delete,review_plan_put,nick_name,get_item_tracking,upload_file,download_file,delete_file,item_tracking_put} from '../../../../apis/qms_router'
import { use } from 'react';

const { TextArea } = Input;
const { Option } = Select;
let rejectReasonData=''
export default function GpE01({ planData }) {
  const [currentUser, setCurrentUser] = useState('systemEngineer');
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const [tb_total, setTbTotal] = useState(3);
  const [tableData, setTableData] = useState([]);

  const [evidenceDialogVisible, setEvidenceDialogVisible] = useState(false);
  const [currentEvidenceRow, setCurrentEvidenceRow] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([
  ]);
const [form] = Form.useForm()
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
  const [rejectDialogTitle, setRejectDialogTitle] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [currentRejectRow, setCurrentRejectRow] = useState(null);



  const isSystemEngineer = useMemo(() => currentUser === 'systemEngineer', [currentUser]);
  const isQualityDirector = useMemo(() => currentUser === 'qualityDirector', [currentUser]);

  const isResponsiblePerson = (row) => {
    return currentUser === 'responsiblePerson' && row.step >= 1;
  };

  // 判断当前用户是否可以操作指定步骤
  const canOperateStep = (row, step) => {
    if (currentUser === 'systemEngineer' && (step === 0 || step === 2)) {
      return row.step === step;
    }
    if (currentUser === 'responsiblePerson' && step === 1) {
      return row.step === step;
    }
    if (currentUser === 'qualityDirector' && step === 3) {
      return row.step === step;
    }
    return false;
  };
const handleSave = async () => {
  try {
    await form.validateFields();
    
    const values = form.getFieldsValue();
    
    const formattedValues = {
      ...values,
      prepared_date: values.prepared_date ? values.prepared_date.format('YYYY-MM-DD') : '',
      countersign_date: values.countersign_date ? values.countersign_date.format('YYYY-MM-DD') : '',
      final_approved_date: values.final_approved_date ? values.final_approved_date.format('YYYY-MM-DD') : '',
       id:planData.id,
    };
    
    review_plan_put(formattedValues,res=>{
   message.success(res.data.msg)
    })
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};
  // 分页配置
  const pagination = () => {
    return {
      current: cur,
      pageSize: page_size,
      position: ["bottomCenter"],
      total: tb_total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      onChange: (page, pageSize) => {
        setCur(page);
        setPageSize(pageSize);
        // 这里可以添加数据请求逻辑
      },
    };
  };
  // 获取表格数据
  const fetchTableData = () => {
    return new Promise((resolve) => {
      get_item_tracking({plan_id: planData.id}, (res) => {
        let latestData = [];
        if (res.data && res.data.code === 200) {
          latestData = res.data.data || [];
          setTableData(latestData);
          setTbTotal(latestData.length);
        }
        resolve(latestData);
      });
    });
  };
useEffect(() => {
    form.setFieldsValue({
      prepared: planData.prepared,
      prepared_date: planData.prepared_date ? dayjs(planData.prepared_date) : null,
      countersign: planData.countersign,
      countersign_date: planData.countersign_date ? dayjs(planData.countersign_date) : null,
      final_approved: planData.final_approved,
      final_approved_date: planData.final_approved_date ? dayjs(planData.final_approved_date) : null
    });
})

  useEffect(() => {
    fetchTableData();
  }, [planData.id]);
  const updateTableData = (id, field, value) => {
    setTableData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 保存单行数据
  const saveRowData = (rowData, step) => {
    const params = {
      plan_id: rowData.plan_id,
      project: rowData.project || '',
      department: rowData.department || '',
      responsible: rowData.responsible || '',
      plan_date: rowData.plan_date || '',
      measures: rowData.measures || '',
      actual_date: rowData.actual_date || '',
      verifier: rowData.verifier || '',
      verify_date: rowData.verify_date || '',
      verify_result: rowData.verify_result || '',
      prepared: rowData.prepared || '',
      prepared_date: rowData.prepared_date || '',
      countersign: rowData.countersign || '',
      countersign_date: rowData.countersign_date || '',
      final_approved: rowData.final_approved || '',
      final_approved_date: rowData.final_approved_date || '',
      step: step,
      reject_reason: rejectReasonData
    };

    // 如果是临时ID（新项目），使用POST请求创建
    if (rowData.id && rowData.id.toString().startsWith('temp_')) {
      item_tracking(params, (res) => {
        if (res.data && res.data.code === 200) {
          message.success('保存成功');
          fetchTableData(); // 刷新表格
          rejectReasonData=''
        } else {
          message.error('保存失败');
        }
      });
    } else {
      // 如果是已存在的项目，使用PUT请求更新
      params.id = rowData.id;
      item_tracking_put(params, (res) => {
        if (res.data && res.data.code === 200) {
          message.success('保存成功');
          fetchTableData(); // 刷新表格
          rejectReasonData=''
        } else {
          message.error('保存失败');
        }
      });
    }
  };

  const addNewItem = () => {
    const newItem = {
      // id: `temp_${Date.now()}_${Math.random()}`, // 生成唯一的临时ID
      plan_id: planData.id,
      project: "",
      department: "",
      responsible: "",
      plan_date: "",
      measures: "",
      actual_date: "",
      verifier: "",
      verify_date: "",
      verify_result: "",
      prepared: "",
      prepared_date: "",
      countersign: "",
      countersign_date: "",
      final_approved: "",
      final_approved_date: "",
      step: -1
    };
    item_tracking(newItem, (res) => {
      if (res.data && res.data.code === 200) {    
        fetchTableData(); // 刷新表格 
        }}
      )
   
  };

  const removeItem = (itemId) => {
    // 如果是临时ID（未保存到服务器的新项目），直接从本地删除
    if (itemId.toString().startsWith('temp_')) {
      setTableData(prev => {
        const newData = prev.filter(item => item.id !== itemId);
        setTbTotal(newData.length);
        return newData;
      });
      message.success("改进项目已删除");
      return;
    }
    
    // 如果是服务器数据，调用API删除
    item_tracking_delete({id: itemId}, (res) => {
      if (res.data && res.data.code === 200) {
        fetchTableData(); // 刷新表格
        message.success("改进项目已删除");
      } else {
        message.error("删除失败");
      }
    });
  };


  const openEvidenceDialog = (row) => {
    setCurrentEvidenceRow(row);
    // 将file_name和file_path数组转换为evidenceFiles格式
    const files = [];
    if (row.file_name && row.file_path && Array.isArray(row.file_name) && Array.isArray(row.file_path)) {
      for (let i = 0; i < row.file_name.length; i++) {
        if (row.file_name[i] && row.file_path[i]) {
          files.push({
            uid: `file-${i}`,
            name: row.file_name[i],
            fileName: row.file_name[i],
            url: row.file_path[i],
            filePath: row.file_path[i],
            status: 'done'
          });
        }
      }
    }
    setEvidenceFiles(files);
    setEvidenceDialogVisible(true);
  };

  // 更新当前弹窗的文件列表
  const updateCurrentRowFiles = (latestTableData = null) => {

    if (!currentEvidenceRow) return;
    
    // 使用传入的最新数据或当前tableData状态
    const dataToUse = latestTableData || tableData;
    const updatedRow = dataToUse.find(item => item.id === currentEvidenceRow.id);

    if (updatedRow) {
      const files = [];
      if (updatedRow.file_name && updatedRow.file_path && Array.isArray(updatedRow.file_name) && Array.isArray(updatedRow.file_path)) {
        for (let i = 0; i < updatedRow.file_name.length; i++) {
          if (updatedRow.file_name[i] && updatedRow.file_path[i]) {
            files.push({
              uid: `file-${i}`,
              name: updatedRow.file_name[i],
              fileName: updatedRow.file_name[i],
              url: updatedRow.file_path[i],
              filePath: updatedRow.file_path[i],
              status: 'done'
            });
          }
        }
      }
      setEvidenceFiles(files);
      setCurrentEvidenceRow(updatedRow); // 更新当前行数据
    }
  };

  // 文件上传
  const handleFileUpload = (file, onSuccess, onError) => {
    if (!currentEvidenceRow) return;
    
    const formData = new FormData();
    formData.append('files', file);
    
    upload_file(
      {id: currentEvidenceRow.id, typeof: 2}, 
      formData,
      (res) => {
        if (res.data.code == 200) {
          onSuccess(res.data, file);
          
          // 立即刷新表格数据，然后同步更新弹窗
          fetchTableData().then((latestData) => {
            // 表格数据刷新完成后，立即使用最新数据更新弹窗文件列表
            updateCurrentRowFiles(latestData);
          });
        } else {
          onError(new Error('上传失败'));
        }
      },
      (err) => {
        onError(err);
      }
    );
  };

  // 文件下载
  const handleFileDownload = (filePath) => {
    if (!currentEvidenceRow) return;
    
    download_file({
      id: currentEvidenceRow.id,
      typeof: 2,
      path: filePath
    }, (res) => {
      if (res.data && res.data.code === 200) {
         const { url } = res.data.data;
          window.open(url, "_blank");
      } else {
        message.error(res.data.msg);
      }
    });
  };

  // 文件删除
  const handleFileDelete = (filePath) => {
   
    if (!currentEvidenceRow) return;
    
    delete_file({
      id: currentEvidenceRow.id,
      typeof: 2,
      path: filePath
    }, (res) => {
      if ( res.data.code === 200) {
        message.success(res.data.msg);
        
        // 立即刷新表格数据，然后同步更新弹窗
        fetchTableData().then((latestData) => {
          // 表格数据刷新完成后，立即使用最新数据更新弹窗文件列表
          updateCurrentRowFiles(latestData);
        });
      } else {
        message.error(res.data.msg);
      }
    });
  };



  const handleVerifyResultChange = (row, value) => {
    if (value == "reject") {
      setCurrentRejectRow(row);
      setRejectDialogTitle(`驳回改进项目：${row.project}`);
      setRejectDialogVisible(true);
    } else if (value === "pass") {
      updateTableData(row.id, 'verify_result', value);
      // saveRowData({...row, verify_result: value}, 2);
    }
    updateTableData(row.id, 'verify_result', value);
  };

  const confirmReject = () => {
    if (rejectReason) {
      const updatedRow = {...currentRejectRow, verify_result: 'reject', reject_reason: rejectReason};
    //  saveRowData(updatedRow,2)
      setRejectDialogVisible(false);
      setRejectReason("");
    } else {
      message.error("请输入驳回原因");
    }
  };

  const closeItem = (row) => {
    Modal.confirm({
      title: '提示',
      content: `确定要结案 "${row.project}" 项目吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        saveRowData(row, 3);
      }
    });
  };

  const getStatusTag = (step) => {
    const statusMap = {
      0: { color: 'default', text: '待填写' },
      1: { color: 'processing', text: '负责人处理中' },
      2: { color: 'warning', text: '待验证' },
      3: { color: 'success', text: '已完成' },
      4: { color: 'success', text: '已结案' }
    };
    const config = statusMap[step] || statusMap[0];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'No.',
      dataIndex: 'plan_id',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '改进项目',
      dataIndex: 'project',
      width: 200,
      className: 'orange-cell',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateTableData(record.id, 'project', e.target.value)}
          placeholder="请输入改进项目"
          disabled={!canOperateStep(record, 0)}
        />
      )
    },
    {
      title: '负责部门',
      dataIndex: 'department',
      width: 160,
      className: 'orange-cell',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateTableData(record.id, 'department', e.target.value)}
          placeholder="请输入负责部门"
          disabled={!canOperateStep(record, 0)}
        />
      )
    },
    {
      title: '负责人',
      dataIndex: 'responsible',
      width: 160,
      className: 'orange-cell',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateTableData(record.id, 'responsible', e.target.value)}
          placeholder="请输入负责人"
          disabled={!canOperateStep(record, 0)}
        />
      )
    },
    {
      title: '计划完成时间',
      dataIndex: 'plan_date',
      width: 180,
      className: 'orange-cell',
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(date, dateString) => updateTableData(record.id, 'plan_date', dateString)}
          placeholder="选择日期"
          disabled={!canOperateStep(record, 0)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '改进措施',
      dataIndex: 'measures',
      width: 220,
      className: 'green-cell',
      render: (text, record) => (
        <TextArea
          value={text}
          onChange={(e) => updateTableData(record.id, 'measures', e.target.value)}
          placeholder="请输入改进措施"
          rows={2}
          disabled={!canOperateStep(record, 1)}
        />
      )
    },
    {
      title: '改进证据',
      dataIndex: 'evidence',
      width: 140,
      className: 'green-cell',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          disabled={!canOperateStep(record, 1)}
          onClick={() => openEvidenceDialog(record)}
        >
          上传证据
        </Button>
      )
    },
    {
      title: '实际完成时间',
      dataIndex: 'actual_date',
      width: 180,
      className: 'green-cell',
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(date, dateString) => updateTableData(record.id, 'actual_date', dateString)}
          placeholder="选择日期"
          disabled={!canOperateStep(record, 1)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '验证人',
      dataIndex: 'verifier',
      width: 160,
      className: 'blue-cell',
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => updateTableData(record.id, 'verifier', e.target.value)}
          placeholder="请输入验证人"
          disabled={!canOperateStep(record, 2)}
        />
      )
    },
    {
      title: '验证时间',
      dataIndex: 'verify_date',
      width: 180,
      className: 'blue-cell',
      render: (text, record) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(date, dateString) => updateTableData(record.id, 'verify_date', dateString)}
          placeholder="选择日期"
          disabled={!canOperateStep(record, 2)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: '跟踪验证结果',
      dataIndex: 'verify_result',
      width: 180,
      className: 'blue-cell',
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleVerifyResultChange(record, value)}
          placeholder="选择结果"
          disabled={!canOperateStep(record, 2)}
          style={{ width: '100%' }}
        >
          <Option value="pass">通过</Option>
          <Option value="reject">驳回</Option>
        </Select>
      )
    },
    {
      title: '驳回原因',
      dataIndex: 'reject_reason',
      width: 180,
      className: 'blue-cell',
     
    },
    {
      title: '状态',
       fixed: 'right',
      dataIndex: 'step',
      width: 120,
      className: 'status-cell',
      render: (step) => getStatusTag(step)
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* 体系工程师操作橙色区域 */}
          {canOperateStep(record, 0) && (
            <Button
              type="primary"
              size="small"
              onClick={() => saveRowData(record, 0)}
            >
              保存
            </Button>
          )}
          
          {/* 负责人操作绿色区域 */}
          {canOperateStep(record, 1) && (
            <Button
              type="primary"
              size="small"
              onClick={() => saveRowData(record, 1)}
            >
              保存
            </Button>
          )}
          
          {/* 体系工程师操作蓝色区域 */}
          {canOperateStep(record, 2) && (
            <Button
              type="primary"
              size="small"
              onClick={() => saveRowData(record, 2)}
            >
              保存
            </Button>
          )}
          
          {/* 质量部长最后操作 */}
          {canOperateStep(record, 3) && (
            <Button
              type="primary"
              size="small"
              onClick={() => closeItem(record)}
            >
              结案
            </Button>
          )}
          
          {/* 删除按钮 */}
          {isSystemEngineer && record.step !== 3 && (
            <Button
              danger
              size="small"
              onClick={() => removeItem(record.id)}
            >
              删除
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="content_root">
        <div id="gp-e01-app">
          <div className="gp-e01-management-review-container">
            <Card className="gp-e01-header-card">
              <div className="gp-e01-header-content">
                <h1 className="gp-e01-title">管理评审改进事项跟踪表</h1>
                <h2 className="gp-e01-subtitle">Management Review Improvement Item Tracking Form</h2>
                <div className="gp-e01-document-info">
                  <span>编号：{planData.number}</span>
                  <span>版本：{planData.version}</span>
                </div>
              </div>
            </Card>

            <Card className="gp-e01-main-card">
              <div className="gp-e01-instructions-section">
                <div className="gp-e01-instruction-block gp-e01-orange">
                  <span className="gp-e01-color-label"></span>
                  <span>橙色部分由体系工程师填写</span>
                </div>
                <div className="gp-e01-instruction-block gp-e01-green">
                  <span className="gp-e01-color-label"></span>
                  <span>绿色部分由负责人填写</span>
                </div>
                <div className="gp-e01-instruction-block gp-e01-blue">
                  <span className="gp-e01-color-label"></span>
                  <span>蓝色部分由体系工程师填写</span>
                </div>
              </div>

              <div className="gp-e01-role-selector">
                <Button
                  type={currentUser === 'systemEngineer' ? 'primary' : 'default'}
                  className={`gp-e01-role-btn gp-e01-engineer-btn ${currentUser === 'systemEngineer' ? 'active' : ''}`}
                  onClick={() => setCurrentUser('systemEngineer')}

                  style={{
                    backgroundColor: currentUser === 'systemEngineer' ? '#ff7f00' : undefined,
                    borderColor: currentUser === 'systemEngineer' ? '#ff7f00' : undefined,
                    color: currentUser === 'systemEngineer' ? '#fff' : undefined,
                    marginRight: 16
                  }}
                >
                  体系工程师
                </Button>
                <Button
                  type={currentUser === 'responsiblePerson' ? 'primary' : 'default'}
                  className={`gp-e01-role-btn gp-e01-responsible-btn ${currentUser === 'responsiblePerson' ? 'active' : ''}`}
                  onClick={() => setCurrentUser('responsiblePerson')}
                  style={{
                    backgroundColor: currentUser === 'responsiblePerson' ? '#52c41a' : undefined,
                    borderColor: currentUser === 'responsiblePerson' ? '#52c41a' : undefined,
                    color: currentUser === 'responsiblePerson' ? '#fff' : undefined,
                     marginRight: 16
                  }}
                >
                  负责人
                </Button>
                <Button
                  type={currentUser === 'qualityDirector' ? 'primary' : 'default'}
                  className={`gp-e01-role-btn gp-e01-director-btn ${currentUser === 'qualityDirector' ? 'active' : ''}`}
                  onClick={() => setCurrentUser('qualityDirector')}
                  style={{
                    backgroundColor: currentUser === 'qualityDirector' ? '#1890ff' : undefined,
                    borderColor: currentUser === 'qualityDirector' ? '#1890ff' : undefined,
                    color: currentUser === 'qualityDirector' ? '#fff' : undefined
                  }}
                >
                  质量部长
                </Button>
              </div>

              <Table
                dataSource={tableData}
                columns={columns}
                rowKey="id"
                bordered
                loading={false}
                size="small"
                scroll={{ x: 'max-content' }}
                className="gp-e01-improvement-table"
                pagination={pagination()}
              />

              <div className="gp-e01-action-buttons">
                {isSystemEngineer && (
                  <Button
                    type="primary"
                    className="gp-e01-add-btn"
                    onClick={addNewItem}
                    icon={<PlusOutlined />}
                  >
                    添加改进项目
                  </Button>
                )}
              </div>
            </Card>

 <Form
    form={form}
    layout="vertical"
    className="gp-approval-section"
    style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}
  >
    <div className="gp-approval-item" style={{ flex: 1 }}>
      <Form.Item 
        name="prepared" 
        label="编制"
        rules={[{ required: true, message: '请输入编制人姓名' }]}
      >
        <Input placeholder="编制人姓名" />
      </Form.Item>
      <Form.Item 
        name="prepared_date" 
        label="编制日期"
        rules={[{ required: true, message: '请选择编制日期' }]}
      >
        <DatePicker 
          placeholder="选择日期"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>

    <div className="gp-approval-item" style={{ flex: 1 }}>
      <Form.Item 
        name="countersign" 
        label="审批"
        rules={[{ required: true, message: '请输入审批人姓名' }]}
      >
        <Input placeholder="审批人姓名" />
      </Form.Item>
      <Form.Item 
        name="countersign_date" 
        label="审批日期"
        rules={[{ required: true, message: '请选择审批日期' }]}
      >
        <DatePicker 
          placeholder="选择日期"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>

    <div className="gp-approval-item" style={{ flex: 1 }}>
      <Form.Item 
        name="final_approved" 
        label="批准"
        rules={[{ required: true, message: '请输入批准人姓名' }]}
      >
        <Input placeholder="批准人姓名" />
      </Form.Item>
      <Form.Item 
        name="final_approved_date" 
        label="批准日期"
        rules={[{ required: true, message: '请选择批准日期' }]}
      >
        <DatePicker 
          placeholder="选择日期"
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>
  </Form>
            {/* 证据上传对话框 */}
            <Modal
              open={evidenceDialogVisible}
              title="改进证据上传"
              width={600}
              onCancel={() => setEvidenceDialogVisible(false)}
           footer={[
                 <Button key="cancel" onClick={() => setEvidenceDialogVisible(false)}>
               取消
                 </Button>
                      ]}
            >
              <div className="gp-e01-evidence-dialog">
                <Upload
                  customRequest={({ file, onSuccess, onError }) => handleFileUpload(file, onSuccess, onError)}
                  multiple
                  fileList={evidenceFiles}
                  onChange={({ fileList }) => setEvidenceFiles(fileList)}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
                <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                  支持上传多个文件，格式不限（支持图片、文档、PDF等）
                </div>

                <div className="gp-e01-evidence-preview">
                  <h4>已上传证据：</h4>
                  {evidenceFiles.length === 0 ? (
                    <div className="gp-e01-empty-state">暂无上传的证据文件</div>
                  ) : (
                    evidenceFiles.map((file, index) => (
                      <div key={index} className="gp-e01-file-item">
                        <FileOutlined className="gp-e01-file-icon" />
                        <span className="gp-e01-file-name">{file.name || file.fileName}</span>
                        <Button 
                          type="text" 
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleFileDownload(file.url || file.filePath)}
                        >
                          下载
                        </Button>
                        <Button 
                          type="text" 
                          size="small"
                          danger
                          onClick={() => handleFileDelete(file.url || file.filePath)}
                        >
                          删除
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Modal>

            {/* 驳回意见对话框 */}
            <Modal
              open={rejectDialogVisible}
              title={rejectDialogTitle}
              width={500}
              onCancel={() => setRejectDialogVisible(false)}
              onOk={confirmReject}
              okText="提交"
              cancelText="取消"
            >
              <TextArea
                value={rejectReason}
                onChange={(e) => {setRejectReason(e.target.value)
                  rejectReasonData=e.target.value
                }}
                rows={4}
                placeholder="请输入驳回原因和建议"
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}