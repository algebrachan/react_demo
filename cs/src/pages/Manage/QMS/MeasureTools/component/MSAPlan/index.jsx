import {Button, Form, Input, message, Popconfirm, Table} from 'antd'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {useEffect, useState} from 'react'
import {deleteMSAPlanContent, readMSAPlanContent} from '../../../../../../apis/qms_router.jsx'
import MSAPlanModal from './MSAPlanModal.jsx'
import MSAReportModal from './MSAReportModal.jsx'

const MSAPlan = () => {
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [form] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [planModalVisible, setPlanModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const generateColumns = () => {
    return [
      {
        title: '单号',
        dataIndex: 'odd_number',
        width: 200,
        fixed: 'left'
      },
      {
        title: '检测设备名称',
        dataIndex: 'detection_device_name',
        width: 200,
        fixed: 'left'
      },
      {
        title: '检测设备编号',
        dataIndex: 'detection_device_id',
        width: 200,
        fixed: 'left'
      },
      {
        title: '测量范围',
        dataIndex: 'measurement_range',
        width: 200
      },
      {
        title: '分辨率',
        dataIndex: 'resolution',
        width: 200
      },
      {
        title: '被测特性',
        dataIndex: 'measured_characteristic',
        width: 200
      },
      {
        title: '工序名称',
        dataIndex: 'process_name',
        width: 200
      },
      {
        title: 'MSA分析项目',
        dataIndex: 'msa_analysis_item',
        width: 200
      },
      {
        title: '分析人',
        dataIndex: 'analyst',
        width: 200
      },
      {
        title: '测量人员',
        dataIndex: 'measurement_personnel',
        width: 200
      },
      {
        title: '计划完成日期',
        dataIndex: 'planned_completion_date',
        width: 200
      },
      {
        title: '分析结果',
        dataIndex: 'result',
        width: 200
      },
      {
        title: '数据来源',
        dataIndex: 'typeof',
        width: 200
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        width: 200
      },
      {
        title: '操作',
        fixed: 'right',
        render: (_, record) => {
          return (
            <>
              <Button type="text" onClick={() => {
                setReportModalVisible(true)
                setCurRowData({...record})
              }}>MSA报告</Button>
              <Button type="text" onClick={() => {
                setIsEdit(true)
                setPlanModalVisible(true)
                setCurRowData({...record})
              }}>编辑</Button>
              <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => deleteRow(record)}>
                <Button type="text">删除</Button>
              </Popconfirm>
            </>
          )
        }
      }
    ]
  }
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSize,
      current: pageNo,
      onChange: (page, size) => {
        setPageSize(size);
        setPageNo(page);
      },
    };
  };
  const deleteRow = (record) => {
    deleteMSAPlanContent({id: record.id}, () => {
      message.success("删除成功")
      getTableData()
    })
  };
  const handleAddRow = () => {
    setIsEdit(false)
    setPlanModalVisible(true)
  };
  const getTableData = () => {
    const formData = form.getFieldsValue();
    setTbLoad(true)
    readMSAPlanContent({...formData, page: pageNo, limit: pageSize},
      ({data: {data, length}}) => {
        setTbLoad(false)
        setTotal(length)
        setTbData(data.map((item => ({...item, key: item.id}))))
      },
      () => {
        setTbLoad(false)
      })
  };
  const defaultQueryFormData = {
    detection_device_name: '',
    detection_device_id: '',
  }
  const formItems = [[
    {span: 6, label: '检测设备名称', name: 'detection_device_name', formItem: <Input />},
    {span: 6, label: '检测设备编号', name: 'detection_device_id', formItem: <Input />},
    {
      span: 5, formItem: (
        <>
          <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
          <Button style={{width: 'auto'}} type="primary" onClick={getTableData}>查询</Button>
        </>
      )
    },
    {span: 7, formItem: (<Button style={{width: 'auto', float: 'right'}} type="primary" onClick={handleAddRow}>新建</Button>)}
  ]]
  useEffect(() => {
    getTableData()
  }, [pageNo, pageSize]);
  return (
    <>
      <CustomForm form={form} formItems={formItems} initialValues={defaultQueryFormData} />
      <Table
        loading={tb_load}
        size="small"
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{x: "max-content",}}
        pagination={pagination()} />
      <MSAPlanModal
        row={curRowData}
        refresh={getTableData}
        isEdit={isEdit}
        visible={planModalVisible}
        setVisible={setPlanModalVisible}
      ></MSAPlanModal>
      <MSAReportModal
        row={curRowData}
        refresh={getTableData}
        visible={reportModalVisible}
        setVisible={setReportModalVisible}
      ></MSAReportModal>
    </>
  );
}
export default MSAPlan
