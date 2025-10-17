import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  Input,
  Select,
  DatePicker,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Switch,
  Radio,
  message,
  Pagination,
  Card,
  Space,
  Tag,
  Popconfirm,
  Spin,
  Upload
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  WarningOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { MyBreadcrumb } from '../../../../components/CommonCard';
import './index.less';
import {
quality_warning_put,
quality_warning,
quality_warning_delete,
get_quality_warning,
download_file_zhiliang
} from '../../../../apis/qms_router';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const QualityWarningManagement = () => {
  // 筛选条件
  const [filter, setFilter] = useState({
    keyword: '',
    type: '',
    status: '',
    dateRange: []
  });

  // 分页设置
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 预警数据
  const [warnings, setWarnings] = useState([]);

  // 当前操作的预警
  const [currentWarning, setCurrentWarning] = useState(getEmptyWarning());

  // 对话框控制
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('预警详情');
  const [isEditing, setIsEditing] = useState(false);

  // 加载状态
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // 表单实例
  const [form] = Form.useForm();
  
  // 文件列表
  const [fileList, setFileList] = useState([]);

  // 获取空预警模板
  function getEmptyWarning() {
    return {
      id: null, // 新建时ID为空，由后端生成
      warning_type: '',
      problem_desc: '',
      occur_date: '',
      resolve_date: '',
      quality_managers: [],
      handlers: [],
      start_5WHY: false,
      temporary_measures: [
        { responsible: '', result: '', effectiveness: '', nonconformity: '' }
      ],
      WHY_analysis: [],
      effectiveness: '',
      quality_review: '',
      fileList: [] // 文件列表
    };
  }



  // 打开详情对话框
  const openDetailDialog = (row) => {
    // 处理数据格式转换
    const processedRow = {
      ...row,
      // 将字符串类型的start_5WHY转换为布尔值
      start_5WHY: row.start_5WHY === 'true' || row.start_5WHY === true,
      // 处理日期字段，转换为dayjs对象
      occur_date: row.occur_date ? dayjs(row.occur_date) : null,
      resolve_date: row.resolve_date ? dayjs(row.resolve_date) : null,
      // 处理质量管理员和处理人员字段
      quality_managers: Array.isArray(row.quality_managers) ? row.quality_managers : 
                       (typeof row.quality_managers === 'string' ? [row.quality_managers] : []),
      handlers: Array.isArray(row.handlers) ? row.handlers : 
               (typeof row.handlers === 'string' ? [row.handlers] : []),
      // 确保临时措施和WHY分析是数组
      temporary_measures: row.temporary_measures || [],
      WHY_analysis: row.WHY_analysis || [],
      // 确保 effectiveness 和 quality_review 字段正确传递
      effectiveness: row.effectiveness || '',
      quality_review: row.quality_review || ''
    };
    
    console.log('查看详情 - 原始数据:', row);
    console.log('查看详情 - 处理后数据:', processedRow);
    
    setCurrentWarning(processedRow);
    setModalTitle('预警详情 - ' + row.id);
    setDetailModalVisible(true);
    setIsEditing(false);
    
    // 处理文件列表 - 为每个临时措施构建独立的文件列表
    const globalFileList = [];
    if (row.temporary_measures) {
      row.temporary_measures.forEach((measure, measureIndex) => {
        if (measure.file_path && measure.file_name) {
          globalFileList.push({
            uid: `detail-${measureIndex}-${measure.file_name}`,
            name: measure.file_name,
            status: 'done',
            url: measure.file_path,
            measureIndex: measureIndex, // 标记属于哪个临时措施
            size: 0, // 已上传文件的大小未知，设为0
            type: 'application/octet-stream' // 默认类型
          });
        }
      });
    }
    setFileList(globalFileList);
    
    console.log('查看详情 - 文件列表:', globalFileList);
    console.log('查看详情 - 临时措施数据:', row.temporary_measures);
    
    // 设置表单值
    form.setFieldsValue(processedRow);
  };

  // 添加新预警
  const addNewWarning = () => {
    const newWarning = getEmptyWarning();
    setCurrentWarning(newWarning);
    setModalTitle('新建预警');
    setDetailModalVisible(true);
    setIsEditing(true);
    setFileList([]);
    form.setFieldsValue(newWarning);
  };

  // 编辑预警
  const editWarning = (row) => {
    // 处理数据格式转换
    const processedRow = {
      ...row,
      // 将字符串类型的start_5WHY转换为布尔值
      start_5WHY: row.start_5WHY === 'true' || row.start_5WHY === true,
      // 处理日期字段，转换为dayjs对象
      occur_date: row.occur_date ? dayjs(row.occur_date) : null,
      resolve_date: row.resolve_date ? dayjs(row.resolve_date) : null,
      // 处理质量管理员和处理人员字段
      quality_managers: Array.isArray(row.quality_managers) ? row.quality_managers : 
                       (typeof row.quality_managers === 'string' ? [row.quality_managers] : []),
      handlers: Array.isArray(row.handlers) ? row.handlers : 
               (typeof row.handlers === 'string' ? [row.handlers] : []),
      // 确保临时措施和WHY分析是数组
      temporary_measures: row.temporary_measures || [],
      WHY_analysis: row.WHY_analysis || [],
      // 确保 effectiveness 和 quality_review 字段正确传递
      effectiveness: row.effectiveness || '',
      quality_review: row.quality_review || ''
    };
    
    console.log('编辑预警 - 原始数据:', row);
    console.log('编辑预警 - 处理后数据:', processedRow);
    console.log('编辑预警 - effectiveness值:', processedRow.effectiveness);
    console.log('编辑预警 - quality_review值:', processedRow.quality_review);
    
    setCurrentWarning(processedRow);
    setModalTitle('编辑预警 - ' + row.id);
    setDetailModalVisible(true);
    setIsEditing(true); // 确保设置为编辑模式
    
    // 处理文件列表 - 为每个临时措施构建独立的文件列表
    const globalFileList = [];
    if (row.temporary_measures) {
      row.temporary_measures.forEach((measure, measureIndex) => {
        if (measure.file_path && measure.file_name) {
          globalFileList.push({
            uid: `measure-${measureIndex}-${measure.file_name}`,
            name: measure.file_name,
            status: 'done',
            url: measure.file_path,
            measureIndex: measureIndex, // 标记属于哪个临时措施
            size: 0, // 已上传文件的大小未知，设为0
            type: 'application/octet-stream' // 默认类型
          });
        }
      });
    }
    setFileList(globalFileList);
    
    console.log('编辑预警 - 文件列表:', globalFileList);
    console.log('编辑预警 - 临时措施数据:', row.temporary_measures);
    
    // 设置表单值
    form.setFieldsValue(processedRow);
  };

  // 删除预警
  const deleteWarning = (row) => {
    quality_warning_delete(
      { id: row.id },
      (res) => {
        const { code, msg } = res.data;
        if (code === 200) {
          message.success('删除成功');
          fetchWarnings(); // 重新获取数据
        } else {
          message.error(msg || '删除失败');
        }
      },
      (error) => {
        message.error('网络异常');
      }
    );
  };

  // 添加临时措施
  const addTemporaryMeasure = () => {
    const newMeasures = [...currentWarning.temporary_measures, {
      responsible: '',
      result: '',
      effectiveness: '',
      nonconformity: ''
    }];
    setCurrentWarning(prev => ({ ...prev, temporary_measures: newMeasures }));
  };

  // 移除临时措施
  const removeTemporaryMeasure = (index) => {
    if (currentWarning.temporary_measures.length > 1) {
      const newMeasures = currentWarning.temporary_measures.filter((_, i) => i !== index);
      setCurrentWarning(prev => ({ ...prev, temporary_measures: newMeasures }));
    } else {
      message.warning('至少需要保留一条临时措施');
    }
  };

  // 添加Why分析
  const addWhyAnalysis = () => {
    const newAnalysis = [...currentWarning.WHY_analysis, {
      question: '',
      reason: '',
      corrective_action: '',
      result: ''
    }];
    setCurrentWarning(prev => ({ ...prev, WHY_analysis: newAnalysis }));
  };

  // 移除Why分析
  const removeWhyAnalysis = (index) => {
    const newAnalysis = currentWarning.WHY_analysis.filter((_, i) => i !== index);
    setCurrentWarning(prev => ({ ...prev, WHY_analysis: newAnalysis }));
  };

  // 保存预警
  const saveWarning = () => {
    form.validateFields().then(values => {
      setModalLoading(true)
      
      // 构建API格式的数据
      const apiData = {
        warning_type: values.warning_type,
        occur_date: values.occur_date ? dayjs(values.occur_date).format('YYYY-MM-DD') : '',
        resolve_date: values.resolve_date ? dayjs(values.resolve_date).format('YYYY-MM-DD') : '',
        problem_desc: values.problem_desc,
        quality_managers: values.quality_managers || [],
        handlers: values.handlers || [],
        start_5WHY: values.start_5WHY ? 'true' : 'false',
        temporary_measures: currentWarning.temporary_measures,
        WHY_analysis: currentWarning.WHY_analysis,
        effectiveness: currentWarning.effectiveness || values.effectiveness || '',
        quality_review: currentWarning.quality_review || values.quality_review || ''
      };
      
      console.log('保存预警 - currentWarning.effectiveness:', currentWarning.effectiveness);
      console.log('保存预警 - currentWarning.quality_review:', currentWarning.quality_review);
      console.log('保存预警 - values.effectiveness:', values.effectiveness);
      console.log('保存预警 - values.quality_review:', values.quality_review);
      
      // 判断是新建还是编辑
      const isNewWarning = !currentWarning.id;
      console.log('保存预警 - currentWarning.id:', currentWarning.id);
      console.log('保存预警 - isNewWarning:', isNewWarning);
      console.log('保存预警 - 将调用的API:', isNewWarning ? 'quality_warning' : 'quality_warning_put');
      
      // 如果是编辑模式，在API数据中添加ID
      if (!isNewWarning) {
        apiData.id = currentWarning.id;
        console.log('保存预警 - 编辑模式，在API数据中添加ID:', currentWarning.id);
      } else {
        console.log('保存预警 - 新建模式，不添加ID');
      }
      
      // 准备FormData
      const formData = new FormData();
      formData.append('data', JSON.stringify(apiData));
      
      // 添加文件
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });
      
      const apiCall = isNewWarning ? quality_warning : quality_warning_put;
      
      // 如果是编辑模式，需要在API数据中包含ID
      if (!isNewWarning) {
        apiData.id = currentWarning.id;
        formData.set('data', JSON.stringify(apiData)); // 重新设置包含ID的数据
        console.log('保存预警 - 编辑模式，在API数据中添加ID:', currentWarning.id);
      } else {
        console.log('保存预警 - 新建模式，不添加ID');
      }
      
      apiCall(
        formData,
        (res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            message.success('保存成功');
            setDetailModalVisible(false);
            setFileList([]);
            fetchWarnings(); // 重新获取数据
          } else {
            message.error(msg || '保存失败');
          }
          setModalLoading(false);
        },
        (error) => {
          message.error('网络异常');
          setModalLoading(false);
        }
      );
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  // 提交审核
  const submitWarning = () => {
    form.validateFields().then(values => {
      setModalLoading(true);
      
      console.log('提交审核 - 表单值:', values);
      console.log('提交审核 - effectiveness值:', values.effectiveness);
      console.log('提交审核 - quality_review值:', values.quality_review);
      
      // 构建API格式的数据
      const apiData = {
        warning_type: values.warning_type,
        occur_date: values.occur_date ? dayjs(values.occur_date).format('YYYY-MM-DD') : '',
        resolve_date: values.resolve_date ? dayjs(values.resolve_date).format('YYYY-MM-DD') : '',
        problem_desc: values.problem_desc,
        quality_managers: values.quality_managers || [],
        handlers: values.handlers || [],
        start_5WHY: values.start_5WHY ? 'true' : 'false',
        temporary_measures: currentWarning.temporary_measures,
        WHY_analysis: currentWarning.WHY_analysis,
        effectiveness: currentWarning.effectiveness || values.effectiveness || '',
        quality_review: currentWarning.quality_review || values.quality_review || ''
      };
      
      
      
      // 准备FormData
      const formData = new FormData();
      formData.append('data', JSON.stringify(apiData));
      
      // 添加文件
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      quality_warning(
        formData,
        (res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            message.success('已提交审核');
            setDetailModalVisible(false);
            setFileList([]);
            fetchWarnings(); // 重新获取数据
          } else {
            message.error(msg || '提交失败');
          }
          setModalLoading(false);
        },
        (error) => {
          message.error('网络异常');
          setModalLoading(false);
        }
      );
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  // 获取预警数据
  const fetchWarnings = useCallback(() => {
    setLoading(true);
    get_quality_warning(
      {
        quality_managers: filter.keyword,
        warning_type: filter.type,
        quality_review: filter.quality_review,
        occur_start_date: filter.dateRange?.[0]?.format('YYYY-MM-DD'),
        occur_end_date: filter.dateRange?.[1]?.format('YYYY-MM-DD'),
        page: currentPage,
        limit: pageSize
      },
      (res) => {
        const { code, data, msg,length } = res.data;
        if (code === 200) {
          setWarnings(data || []);
          setTotal( length|| 0);
        } else {
          message.error(msg || '获取数据失败');
        }
        setLoading(false);
      },
      (error) => {
        message.error('网络异常');
        setLoading(false);
      }
    );
  }, [filter, currentPage, pageSize]);



  // 刷新数据
  const refreshData = () => {
    fetchWarnings();
  };

  // 获取状态标签
  const getStatusTag = (status) => {
console.log(status)
    const statusMap = {
      pass: { color: 'processing', text: '通过' },
      fail: { color: 'success', text: '不通过' },
      pending: { color: 'warning', text: '待审核' }
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      spc: { color: 'blue', text: 'SPC预警' },
      process: { color: 'orange', text: '过程预警' },
      material: { color: 'green', text: '材料预警' }
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      align: 'center'
    },
    {
      title: '预警类型',
      dataIndex: 'warning_type',
      key: 'warning_type',
      width: 120,
      render: (type) => getTypeTag(type)
    },
    {
      title: '问题',
      dataIndex: 'problem_desc',
      key: 'problem_desc',
      ellipsis: true,
      width: 200
    },
    {
      title: '发生日期',
      dataIndex: 'occur_date',
      key: 'occur_date',
      width: 120,
      align: 'center'
    },
    {
      title: '解决日期',
      dataIndex: 'resolve_date',
      key: 'resolve_date',
      width: 120,
      align: 'center',
      render: (date) => date || '未解决'
    },
    {
      title: '处理责任人',
      dataIndex: 'handlers',
      key: 'handlers',
      width: 120,
      align: 'center',
      render: (handlers) => Array.isArray(handlers) ? handlers.join(', ') : handlers
    },
    {
      title: '状态',
      dataIndex: 'quality_review',
      key: 'quality_review',
      width: 100,
      align: 'center',
      render: (quality_review) => getStatusTag(quality_review)
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              editWarning(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此预警记录吗?"
            onConfirm={(e) => {
              e.stopPropagation();
              deleteWarning(record);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 临时措施表格列
  const temporaryMeasuresColumns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: '责任人',
      key: 'responsible',
      width: 150,
      render: (_, record, index) => (
        <Input
          value={record.responsible}
          placeholder="请选择"
          style={{ width: '100%' }}
          size="small"
          onChange={(e) => {
            const newMeasures = [...currentWarning.temporary_measures];
            newMeasures[index].responsible = e.target.value;
            setCurrentWarning(prev => ({ ...prev, temporary_measures: newMeasures }));
          }}
        />
      )
    },
    {
      title: '整改结果',
      key: 'result',
      render: (_, record, index) => (
        <Input
          value={record.result}
          size="small"
          placeholder="请输入整改结果"
          onChange={(e) => {
            const newMeasures = [...currentWarning.temporary_measures];
            newMeasures[index].result = e.target.value;
            setCurrentWarning(prev => ({ ...prev, temporary_measures: newMeasures }));
          }}
        />
      )
    },
    {
      title: '附件',
      key: 'attachment',
      width: 200,
      align: 'center',
      render: (_, record, index) => (
        <Upload
          fileList={fileList.filter(file => file.measureIndex === index)}
          beforeUpload={(file) => {
            const newFile = {
              uid: `${index}-${Date.now()}-${file.name}`,
              name: file.name,
              status: 'done',
              originFileObj: file,
              measureIndex: index,
              size: file.size,
              type: file.type
            };
            setFileList(prev => {
              const updated = [...prev, newFile];
              return updated;
            });
            return false; // 阻止自动上传
          }}
          onRemove={(file) => {
            setFileList(prev => prev.filter(f => f.uid !== file.uid));
          }}
          onDownload={(file, event) => {
            // 阻止默认行为和事件冒泡
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            
            // 如果是已上传的文件（有url属性），调用下载接口
            if (file.url) {
              console.log('开始下载文件:', file.name, '路径:', file.url);
              
              download_file_zhiliang(
                { path: file.url },
                (res) => {
                  console.log('下载接口响应:', res);
                  
                  // 检查响应类型
                  if (res.data instanceof Blob) {
                    // 如果已经是Blob，直接使用
                    const blob = res.data;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    message.success('文件下载成功');
                  } else {
                    // 如果不是Blob，创建Blob
                    const blob = new Blob([res.data], { type: 'application/octet-stream' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = file.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    message.success('文件下载成功');
                  }
                },
                (error) => {
                  console.error('下载失败:', error);
                  message.error('文件下载失败');
                }
              );
            } else {
              message.warning('文件路径不存在，无法下载');
            }
            
            // 返回false阻止默认行为
            return false;
          }}
          showUploadList={{
            showPreviewIcon: false,
            showRemoveIcon: true,
            showDownloadIcon: true,
            showLinkIcon: false
          }}
          itemRender={(originNode, file, fileList) => {
            // 自定义文件列表项渲染，移除默认的链接行为
            const modifiedNode = React.cloneElement(originNode, {
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
              }
            });
            return modifiedNode;
          }}
          maxCount={5}
          accept="*"
        >
          <Button size="small" icon={<UploadOutlined />}>
            选择文件
          </Button>
        </Upload>
      )
    },
    {
      title: '有效性验证',
      key: 'effectiveness',
      width: 120,
      render: (_, record, index) => (
        <Select
          value={record.effectiveness}
          placeholder="请选择"
          size="small"
          style={{ width: '100%' }}
          onChange={(value) => {
            const newMeasures = [...currentWarning.temporary_measures];
            newMeasures[index].effectiveness = value;
            setCurrentWarning(prev => ({ ...prev, temporary_measures: newMeasures }));
          }}
        >
          <Option value="effective">有效</Option>
          <Option value="ineffective">无效</Option>
        </Select>
      )
    },
    {
      title: '不合格说明',
      key: 'nonconformity',
      width: 180,
      render: (_, record, index) => (
        <Input
          value={record.nonconformity}
          size="small"
          placeholder="请输入说明"
          onChange={(e) => {
            const newMeasures = [...currentWarning.temporary_measures];
            newMeasures[index].nonconformity = e.target.value;
            setCurrentWarning(prev => ({ ...prev, temporary_measures: newMeasures }));
          }}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          size="small"
          shape="circle"
          onClick={() => removeTemporaryMeasure(index)}
        />
      )
    }
  ];

  // Why分析表格列
  const whyAnalysisColumns = [
    {
      title: '层级',
      key: 'level',
      width: 80,
      align: 'center',
      render: (_, __, index) => `Why${index + 1}`
    },
    {
      title: '问题',
      key: 'question',
      render: (_, record, index) => (
        <Input
          value={record.question}
          size="small"
          placeholder="请输入问题"
          onChange={(e) => {
            const newAnalysis = [...currentWarning.WHY_analysis];
            newAnalysis[index].question = e.target.value;
            setCurrentWarning(prev => ({ ...prev, WHY_analysis: newAnalysis }));
          }}
        />
      )
    },
    {
      title: '原因',
      key: 'reason',
      render: (_, record, index) => (
        <Input
          value={record.reason}
          size="small"
          placeholder="请输入原因"
          onChange={(e) => {
            const newAnalysis = [...currentWarning.WHY_analysis];
            newAnalysis[index].reason = e.target.value;
            setCurrentWarning(prev => ({ ...prev, WHY_analysis: newAnalysis }));
          }}
        />
      )
    },
    {
      title: '纠正措施',
      key: 'corrective_action',
      render: (_, record, index) => (
        <Input
          value={record.corrective_action}
          size="small"
          placeholder="请输入纠正措施"
          onChange={(e) => {
            const newAnalysis = [...currentWarning.WHY_analysis];
            newAnalysis[index].corrective_action = e.target.value;
            setCurrentWarning(prev => ({ ...prev, WHY_analysis: newAnalysis }));
          }}
        />
      )
    },
    {
      title: '整改结果',
      key: 'result',
      render: (_, record, index) => (
        <Input
          value={record.result}
          size="small"
          placeholder="请输入整改结果"
          onChange={(e) => {
            const newAnalysis = [...currentWarning.WHY_analysis];
            newAnalysis[index].result = e.target.value;
            setCurrentWarning(prev => ({ ...prev, WHY_analysis: newAnalysis }));
          }}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          size="small"
          shape="circle"
          onClick={() => removeWhyAnalysis(index)}
        />
      )
    }
  ];

  // 初始化数据
  useEffect(() => {
    fetchWarnings();
  }, [fetchWarnings]);

  // 筛选条件变化时重新获取数据并重置页码
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <div className="quality-warning-management">
      <MyBreadcrumb items={[window.sys_name || '质量管理系统', '质量预警管理']} />
      
      <div className="content_root">
        {/* 头部 */}
        <div className="header-section">
          <div className="header-title">
            <WarningOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <h2>质量预警管理系统</h2>
          </div>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={addNewWarning}>
              新建预警
            </Button>
            <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
              刷新
            </Button>
          </Space>
        </div>

        {/* 筛选栏 */}
        <Card className="filter-card" size="small">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Input
                placeholder="搜索问题/处理人"
                value={filter.keyword}
                onChange={(e) => setFilter(prev => ({ ...prev, keyword: e.target.value }))}
                suffix={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="预警类型"
                value={filter.type}
                onChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="spc">SPC预警</Option>
                <Option value="process">过程预警</Option>
                <Option value="material">材料预警</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="处理状态"
                value={filter.status}
                onChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="processing">处理中</Option>
                <Option value="completed">已完成</Option>
                <Option value="pending">待审核</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                value={filter.dateRange}
                onChange={(dates) => setFilter(prev => ({ ...prev, dateRange: dates }))}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 汇总表格 */}
        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={warnings}
            rowKey="id"
            bordered
            size="small"
            loading={loading}
            onRow={(record) => ({
              onClick: () => openDetailDialog(record),
              style: { cursor: 'pointer' }
            })}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
          
          <div className="pagination-wrapper">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `共 ${total} 条`}
              pageSizeOptions={['10', '20', '50']}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              onShowSizeChange={(current, size) => {
                setCurrentPage(1);
                setPageSize(size);
              }}
            />
          </div>
        </Card>

        {/* 预警详情对话框 */}
        <Modal
          title={
            <div>
              <FileTextOutlined style={{ marginRight: 8 }} />
              {modalTitle}
            </div>
          }
          open={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setFileList([]);
          }}
          width="85%"
          style={{ top: 20 }}
          maskClosable={false}
          footer={[
            <Button key="cancel" onClick={() => setDetailModalVisible(false)} disabled={modalLoading}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={saveWarning}>
              保存
            </Button>
          ]}
        >
          <div className="detail-form">
            <Form form={form} layout="vertical">
              {/* 基本信息 */}
              <div className="form-section">
                <h3>基本信息</h3>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item label="预警类型" name="warning_type">
                      <Select placeholder="请选择">
                        <Option value="spc">SPC预警</Option>
                        <Option value="process">过程预警</Option>
                        <Option value="material">材料预警</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="发生日期" name="occur_date">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="解决日期" name="resolve_date">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="问题描述" name="problem_desc">
                  <TextArea rows={3} placeholder="请输入问题描述" />
                </Form.Item>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="质量负责人" name="quality_managers">
                      <Input placeholder="请输入质量负责人" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="处理责任人" name="handlers">
                       <Input placeholder="请输入处理责任人" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item label="是否启动5WHY" name="start_5WHY" valuePropName="checked">
                      <Switch 
                        onChange={(checked) => {
                          console.log('5WHY开关状态:', checked);
                          setCurrentWarning(prev => {
                            const updated = { 
                              ...prev, 
                              start_5WHY: checked,
                              // 如果启动5WHY且当前没有分析项，则添加第一个
                              WHY_analysis: checked && prev.WHY_analysis.length === 0 
                                ? [{ question: '', reason: '', corrective_action: '', result: '' }]
                                : prev.WHY_analysis
                            };
                            console.log('更新后的currentWarning:', updated);
                            return updated;
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="是否启动8D" name="start8D" valuePropName="checked">
                      <Switch disabled />
                      <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>(待定)</span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* 临时措施 */}
              <div className="form-section">
                <h3>临时措施</h3>
                <Table
                  columns={temporaryMeasuresColumns}
                  dataSource={currentWarning.temporary_measures}
                  rowKey={(_, index) => index}
                  bordered
                  size="small"
                  pagination={false}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  style={{ marginTop: 10 }}
                  onClick={addTemporaryMeasure}
                >
                  添加临时措施
                </Button>
              </div>
              {/* 5WHY分析 */}
              {(() => {
                console.log('5WHY显示条件检查:', currentWarning.start_5WHY, currentWarning);
                return currentWarning.start_5WHY;
              })() && (
                <div className="form-section">
                  <h3>5WHY分析</h3>
                  <Table
                    columns={whyAnalysisColumns}
                    dataSource={currentWarning.WHY_analysis}
                    rowKey={(_, index) => index}
                    bordered
                    size="small"
                    pagination={false}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="small"
                    style={{ marginTop: 10 }}
                    onClick={addWhyAnalysis}
                  >
                    添加Why分析
                  </Button>
                </div>
              )}

              {/* 整改有效性 */}
              <div className="form-section">
                <h3>整改有效性</h3>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="整改有效性" name="effectiveness">
                      <Radio.Group
                        value={currentWarning.effectiveness}
                        onChange={(e) => {
                          const value = e.target.value;
                          console.log('整改有效性变更:', value);
                          setCurrentWarning(prev => ({ ...prev, effectiveness: value }));
                          // 同时更新表单字段
                          form.setFieldValue('effectiveness', value);
                        }}
                      >
                        <Radio value="effective">整改有效</Radio>
                        <Radio value="ineffective">整改无效</Radio>
                      </Radio.Group>
                      <div style={{ color: '#999', fontSize: 12, marginTop: 5 }}>
                        （全部有效才能勾选"整改有效"）
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="质量审核" name="quality_review">
                      <Select 
                        placeholder="请选择"
                        value={currentWarning.quality_review}
                        onChange={(value) => {
                          console.log('质量审核变更:', value);
                          setCurrentWarning(prev => ({ ...prev, quality_review: value }));
                          // 同时更新表单字段
                          form.setFieldValue('quality_review', value);
                        }}
                      >
                        <Option value="pass">通过</Option>
                        <Option value="fail">不通过</Option>
                        <Option value="pending">待审核</Option>
                      </Select>
                      <div style={{ color: '#999', fontSize: 12, marginTop: 5 }}>
                        （填写有效性验证后提交）
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default QualityWarningManagement;