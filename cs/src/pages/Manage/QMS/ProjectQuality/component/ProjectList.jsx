import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Form, Input, message, Popconfirm, Select, Table, Upload} from 'antd'
import styles from '../style/index.module.less'
import {delete_project_quality, read_project_quality} from '@/apis/qms_router.jsx'
import {UploadOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import ProjectListModal from '@/pages/Manage/QMS/ProjectQuality/component/ProjectListModal.jsx'
import StageList from '@/pages/Manage/QMS/ProjectQuality/component/StageList.jsx'

const ProjectList = () => {
  const [form] = Form.useForm()
  const [modalOpen, setModalOpen] = useState(false)
  const [stageOpen, setStageOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [tb_data, setTbData] = useState([])
  const [tb_load, setTbLoad] = useState(false)
  const getProjectList = () => {
    const formData = form.getFieldsValue()
    const {date_range, ...rest} = formData
    const [project_plan_start, project_plan_end] = (date_range ?? [])
    setTbLoad(true)
    read_project_quality(
      {...rest, project_plan_start, project_plan_end, page: pageNo, limit: pageSize},
      ({data: {data, length}}) => {
        setTotal(length)
        setTbData(data.map(item => ({key: item.id, ...item})))
        setTbLoad(false)
      },
      () => {
        setTbLoad(false)
      }
    )
  }
  const handleAddRow = () => {
    setIsEdit(false)
    setModalOpen(true)
  }
  const handleDeleteRow = (row) => {
    delete_project_quality(
      {id: row.id},
      () => {
        message.success('删除成功')
        getProjectList()
      }
    )
  };
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
  const generateColumns = () => ([
    {title: '项目名称', dataIndex: 'project_name', fixed: 'left'},
    {title: '项目编号', dataIndex: 'project_code'},
    {title: '项目负责人', dataIndex: 'project_charge_person'},
    {title: '项目计划开始时间', dataIndex: 'project_plan_start'},
    {title: '项目计划结束时间', dataIndex: 'project_plan_end'},
    {
      title: '操作', fixed: 'right', render: (text, record) => {
        return (
          <>
            <Button variant={'text'} color={'primary'} onClick={() => {
              setCurRowData(record)
              setStageOpen(true)
            }}>查看项目阶段</Button>
            <Button variant={'text'} color={'orange'} onClick={() => {
              setCurRowData(record)
              setIsEdit(true)
              setModalOpen(true)
            }}>编辑</Button>
            <Popconfirm
              title="确定删除该条数据吗？"
              onConfirm={() => handleDeleteRow(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button variant={'text'} color={'danger'}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ])
  const formItems = [[
    {
      span: 4,
      name: 'project_name',
      label: '项目名称',
      formItem: <Input />
    },
    {
      span: 4,
      name: 'project_code',
      label: '项目编号',
      formItem: <Input />
    },
    {
      span: 8,
      name: 'date_range',
      label: '项目时间',
      getValueProps: value => ({value: value && value.map(i => dayjs(i))}),
      normalize: value => value && value.map(i => `${dayjs(i).format('YYYY-MM-DD')}`),
      formItem: <DatePicker.RangePicker />
    },
    {
      span: 4, formItem: (
        <>
          <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
          <Button style={{width: 'auto'}} type="primary" onClick={getProjectList}>查询</Button>
        </>
      )
    },
    {
      span: 4, formItem: (
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button onClick={handleAddRow}>新建</Button>
        </div>
      )
    }
  ]]
  useEffect(() => {
    getProjectList()
  }, [pageNo, pageSize]);
  return (
    <>
      <div className={styles['project']} style={{display: stageOpen ? 'none' : 'block'}}>
        <CustomForm form={form} formItems={formItems}></CustomForm>
        <Table
          loading={tb_load}
          size="small"
          columns={generateColumns()}
          dataSource={tb_data}
          bordered
          scroll={{
            x: "max-content",
            y: 600,
          }}
          pagination={pagination()}
        ></Table>
        <ProjectListModal open={modalOpen} setOpen={setModalOpen} isEdit={isEdit} refresh={getProjectList} row={curRowData}></ProjectListModal>
      </div>
      <StageList style={{display: stageOpen ? 'block' : 'none'}} open={stageOpen} setOpen={setStageOpen} projectInfo={curRowData}></StageList>
    </>
  )
}
export default ProjectList;
