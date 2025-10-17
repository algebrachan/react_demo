import {Button, DatePicker, Form, Input, message, Popconfirm, Table} from 'antd'
import {useEffect, useState} from 'react'
import YearPlanModal from './YearPlanModal.jsx'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {deleteMSAYearPlan, readMSAYearPlan} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'
import YearContent from './YearContent.jsx'

const MSAYearPlan = () => {
  const [form] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isEdit, setIsEdit] = useState(false)
  const [yearModalVisible, setYearModalVisible] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const [yearContentVisible, setYearContentVisible] = useState(false)
  const defaultQueryFormData = {
    year: '',
    project_name: '',
    product_name: '',
    product_spec: ''
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
  const generateColumns = () => {
    return [
      {
        title: '计划名称',
        dataIndex: 'name',
        fixed: 'left'
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
      {
        title: '项目名称',
        dataIndex: 'project_name',
        fixed: 'left'
      },
      {
        title: '产品名称',
        dataIndex: 'product_name'
      },
      {
        title: '产品规格',
        dataIndex: 'product_spec'
      },
      {
        title: '操作',
        fixed: 'right',
        render: (_, record) => {
          return (
            <>
              <Button type="text" onClick={() => {
                setCurRowData({...record})
                setYearContentVisible(true)
              }}>添加年度计划内容</Button>
              <Button type="text" onClick={() => {
                setIsEdit(true)
                setYearModalVisible(true)
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
  };
  const deleteRow = (record) => {
    deleteMSAYearPlan({id: record.id}, () => {
      message.success("删除成功")
      getTableData()
    })
  };
  const handleAddRow = () => {
    setIsEdit(false)
    setYearModalVisible(true)
  };
  const getTableData = () => {
    const formData = form.getFieldsValue();
    setTbLoad(true)
    readMSAYearPlan({...formData, year: formData.year ?? '', page: pageNo, limit: pageSize},
      ({data: {data, length}}) => {
        setTbLoad(false)
        setTbData(data.map((item => ({...item, key: item.id}))))
        setTotal(length)
      },
      () => {
        setTbLoad(false)
      })
  };
  const formItems = [
    [
      {
        span: 4,
        label: '计划年份',
        name: 'year',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY')}`,
        formItem: <DatePicker picker="year" />
      },
      {span: 4, label: '项目名称', name: 'project_name', formItem: <Input />},
      {span: 4, label: '产品名称', name: 'product_name', formItem: <Input />},
      {span: 4, label: '产品规格', name: 'product_spec', formItem: <Input />},
      {
        span: 3, formItem: (
          <>
            <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
            <Button style={{width: 'auto'}} type="primary" onClick={getTableData}>查询</Button>
          </>
        )
      },
      {
        span: 5, formItem: (
          <>
            <Button style={{width: 'auto', float: 'right'}} type="primary" onClick={handleAddRow}>新建</Button>
          </>
        )
      }
    ]
  ]
  useEffect(() => {
    getTableData()
  }, [pageNo, pageSize]);
  return (
    <>
      <div className="msa-year-plan" style={{display: yearContentVisible ? 'none' : 'block'}}>
        <CustomForm
          form={form}
          style={{marginBottom: 8}}
          initialValues={defaultQueryFormData}
          formItems={formItems}
        />
        <Table
          loading={tb_load}
          size="small"
          columns={generateColumns()}
          dataSource={tb_data}
          bordered
          scroll={{x: "max-content",}}
          pagination={pagination()}
        />
      </div>
      <YearContent
        style={{display: yearContentVisible ? 'block' : 'none'}}
        className="msa-year-content"
        yearPlan={curRowData}
        visible={yearContentVisible}
        setVisible={setYearContentVisible}
      ></YearContent>
      <YearPlanModal
        row={curRowData}
        refresh={getTableData}
        isEdit={isEdit}
        visible={yearModalVisible}
        setVisible={setYearModalVisible}
      />
    </>
  )
}
export default MSAYearPlan
