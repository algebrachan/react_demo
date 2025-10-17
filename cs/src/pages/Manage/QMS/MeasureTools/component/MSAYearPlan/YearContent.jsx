import {Button, Form, Input, message, Popconfirm, Table} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {useEffect, useState} from 'react'
import {deleteMSAYearPlanContent, readMSAYearPlanContent} from '../../../../../../apis/qms_router.jsx'
import YearContentModal from './YearContentModal.jsx'

const YearContent = ({style, className, yearPlan = {}, setVisible, visible}) => {
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const generateColumns = () => {
    return [
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
                setIsEdit(true)
                setModalVisible(true)
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
  const deleteRow = (record) => {
    deleteMSAYearPlanContent({id: record.id}, () => {
      message.success("删除成功")
      getTableData()
    })
  };
  const handleAddRow = () => {
    setIsEdit(false)
    setModalVisible(true)
  };
  const getTableData = () => {
    setTbLoad(true)
    readMSAYearPlanContent({apply_device_id: yearPlan.id}, ({data: {data}}) => {
        setTbLoad(false)
        setTbData(data.map((item => ({...item, key: item.id}))))
      },
      () => {
        setTbLoad(false)
      })
  };
  const formItems = [[
    {span: 6, label: '项目名称', formItem: <Input disabled value={yearPlan.project_name} />},
    {span: 6, label: '产品名称', formItem: <Input disabled value={yearPlan.product_name} />},
    {span: 6, label: '产品规格', formItem: <Input disabled value={yearPlan.product_spec} />},
    {span: 6, formItem: (<Button style={{width: 'auto', float: 'right'}} type="primary" onClick={handleAddRow}>新建</Button>)}
  ]]
  useEffect(() => {
    if (visible) getTableData()
  }, [visible]);
  return (
    <div className={className} style={style}>
      <div style={{display: 'flex', alignItems: 'center', marginBottom: 16}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => setVisible(false)}>返回</Button>
        <span style={{fontSize: 20, fontWeight: 'bold', marginLeft: 16}}>{`${yearPlan?.name}：`}</span>
      </div>
      <CustomForm formItems={formItems} />
      <Table
        loading={tb_load}
        size="small"
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{x: "max-content",}}
        pagination={false}
      />
      <YearContentModal
        yearPlan={yearPlan}
        row={curRowData}
        refresh={getTableData}
        isEdit={isEdit}
        visible={modalVisible}
        setVisible={setModalVisible}
      ></YearContentModal>
    </div>
  );
};
export default YearContent;
