import {Modal, Table} from 'antd'
import {useEffect, useState} from 'react'
import {read_non_conformance_distribution} from '../../../../../../../apis/qms_router.jsx'

const NonConformanceDistModal = ({open, setOpen, planInfo}) => {
  const [tbData, setTbData] = useState([])
  const getTbData = () => {
    read_non_conformance_distribution(
      {review_plan_id: planInfo.id},
      ({data: {data}}) => {
        setTbData(data.map((item, index) => ({...item, key: index})))
      }
    )
  }
  useEffect(() => {
    if (open) getTbData()
  }, [open]);
  return (
    <Modal
      title={'不符合项分布表'}
      open={open}
      width={1200}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Table
        dataSource={tbData}
        size={'small'}
        pagination={false}
        scroll={{x: 'max-content'}}
        columns={[
          {
            title: '管理过程',
            dataIndex: '管理过程',
            fixed: 'left'
          },
          {
            title: '总经理室',
            dataIndex: '总经理室'
          },
          {
            title: '计划部',
            dataIndex: '计划部'
          },
          {
            title: '研发技术部',
            dataIndex: '研发技术部'
          },
          {
            title: '制造部-设备动力科',
            dataIndex: '制造部-设备动力科'
          },
          {
            title: '制造部-原料合成车间',
            dataIndex: '制造部-原料合成车间'
          },
          {
            title: '制造部-长晶生产车间',
            dataIndex: '制造部-长晶生产车间'
          },
          {
            title: '制造部-坩埚车间',
            dataIndex: '制造部-坩埚车间'
          },
          {
            title: '质量管理部',
            dataIndex: '质量管理部'
          },
          {
            title: '安环部',
            dataIndex: '安环部'
          },
          {
            title: '销售部',
            dataIndex: '销售部'
          },
          {
            title: '人力资源部',
            dataIndex: '人力资源部'
          },
          {
            title: '财务部',
            dataIndex: '财务部'
          },
          {
            title: '信息部',
            dataIndex: '信息部'
          },
          {
            title: '园区行政办公室',
            dataIndex: '园区行政办公室'
          },
          {
            title: '项目开发部',
            dataIndex: '项目开发部'
          },
          {
            title: '合计',
            dataIndex: '合计',
            fixed: 'right'
          },
        ]}
      ></Table>
    </Modal>
  )
}
export default NonConformanceDistModal
