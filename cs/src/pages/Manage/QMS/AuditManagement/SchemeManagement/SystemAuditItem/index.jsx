import {Button, message, Modal, Popconfirm} from 'antd'
import {useEffect, useMemo, useRef, useState} from 'react'
import FlowForm from './component/FlowForm.jsx'
import PlanForm from './component/PlanForm.jsx'
import {create_review_plan, get_task_status, read_review_plan, submit_audit_plan, submit_review_plan, update_review_plan} from '../../../../../../apis/qms_router.jsx'
import {cloneDeep} from 'lodash'

const StatusIcon = ({status}) => {
  const nodeColorMap = {
    'A02': '#9b9b9b',
    'A03': '#9b9b9b',
    'A04': '#9b9b9b',
    'A05': '#9b9b9b',
    'A06': '#1fa741',
  }
  return (
    <div style={{width: 6, height: 6, borderRadius: '50%', backgroundColor: nodeColorMap[status]}}></div>
  )
}
const SystemAuditItem = ({schemeData}) => {
  const statusNameMap = {
    passed: '通过',
    current: '进行中',
    not_started: '未开始',
    rejected: '驳回'
  }
  const flowFormRef = useRef(null)
  const [currentNode, setCurrentNode] = useState({status: 'A01'})
  const [nodeList, setNodeList] = useState([])
  const [nodeStatus, setNodeStatus] = useState({})
  const [flowOpen, setFlowOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [planFormData, setPlanFormData] = useState({})
  // 新增or编辑
  const [isPlanFormEdit, setIsPlanFormEdit] = useState(false)
  // 表单是否可编辑
  const [isPlanFormDisabled, setIsPlanFormDisabled] = useState(false)
  const currentNodeId = useMemo(() => {
    return currentNode.node_id ?? 'A02'
  }, [currentNode])
  const planFormRef = useRef(null)
  const defaultPlanFormData = {
    audit_plan_id: schemeData.id,
    purpose: schemeData.system.purpose,
    scope: schemeData.system.scope,
    criteria_methods: schemeData.criteria_methods,
    audit_team: [],
    review_time: [],
    first_meeting_time: '',
    last_meeting_time: '',
    release_date: '',
    audit_schedule: []
  }
  const statusBtnMap = {
    'A02': {
      status: '审核方案待确认',
      color: 'default',
      operateNode: (
        <Button
          variant="solid"
          color="primary"
          style={{marginTop: 10}}
          onClick={() => {
            setFlowOpen(true)
          }}
        >去确认</Button>
      )
    },
    'A03': {
      status: isPlanFormEdit ? '实施计划待确认' : '实施计划待新建',
      color: 'default',
      operateNode: (
        isPlanFormEdit ?
          <Button
            variant="solid"
            color="primary"
            style={{marginTop: 10}}
            onClick={() => {
              setFlowOpen(true)
            }}
          >去确认</Button> :
          <Button
            onClick={() => {
              setPlanOpen(true)
              setIsPlanFormDisabled(false)
            }}
            variant="solid"
            color="primary"
            style={{marginTop: 10}}
          >去新建</Button>
      )
    },
    'A04': {
      status: '管理者代表待审核',
      color: 'default',
      operateNode: (
        <Button
          onClick={() => {
            setFlowOpen(true)
          }}
          variant="solid"
          color="primary"
          style={{marginTop: 10}}
        >去审核</Button>
      )
    },
    'A05': {
      status: '总经理待审核',
      color: 'default',
      operateNode: <Button
        onClick={() => {
          setFlowOpen(true)
        }}
        variant="solid"
        color="primary"
        style={{marginTop: 10}}
      >去审核</Button>
    },
    'A06': {status: '实施计划已公示', color: 'green', operateNode: <Button style={{marginTop: 10, visibility: 'hidden'}} />},
  }
  const handlePlanOk = () => {
    const nowData = planFormRef.current.getFieldsValue()
    if (isPlanFormEdit) {
      update_review_plan(nowData, () => {
        setPlanOpen(false);
        getImplementationPlan()
        message.success('修改成功')
      })
    } else {
      create_review_plan(nowData, () => {
        setPlanOpen(false);
        getImplementationPlan()
        message.success('新增成功')
      })
    }
  }
  const getImplementationPlan = () => {
    read_review_plan({id: schemeData.id, type: 'system'}, ({data: {data}}) => {
      if (data?.length) {
        setIsPlanFormEdit(true)
        setPlanFormData(data[0])
      } else {
        setIsPlanFormEdit(false)
        setPlanFormData(cloneDeep(defaultPlanFormData))
      }
    })
  }
  const getFlowStatus = () => {
    get_task_status({id: schemeData.id, type: 'system'}, ({data: {data}}) => {
      const currentNode = data.find(i => i.status === 'current')
      setNodeStatus(data.reduce((acc, item) => {
        acc[item.name] = statusNameMap[item.status]
        return acc
      }, {}))
      setCurrentNode(currentNode)
      setNodeList(data)
      setIsPlanFormDisabled(currentNode.node_id !== 'A03')
      schemeData.is_check = currentNode.node_id !== 'A02'
    })
  }
  useEffect(() => {
    getImplementationPlan()
    getFlowStatus()
  }, [schemeData]);
  useEffect(() => {
    if (flowOpen) flowFormRef.current.setCurrent(currentNode)
  }, [flowOpen]);
  return (
    <div style={{display: "flex", flexDirection: "column", padding: 20}}>
      <div style={{fontSize: "16px", fontWeight: "500"}}>体系内审</div>
      <Button
        variant="filled"
        color={statusBtnMap[currentNodeId]?.color}
        style={{marginTop: 10}}
        icon={<StatusIcon status={currentNodeId} />}>{statusBtnMap[currentNodeId]?.status}</Button>
      {statusBtnMap[currentNodeId].operateNode}
      <Button variant="filled" color="primary" style={{marginTop: 50}} onClick={() => {
        setFlowOpen(true)
      }}>查看流程</Button>
      <Button variant="filled" color="primary" style={{marginTop: 10}} disabled={currentNode.node_id === 'A02' || !isPlanFormEdit} onClick={() => {
        setPlanOpen(true)
      }}>查看实施计划</Button>
      <Modal
        keyboard={false}
        maskClosable={false}
        title="流程明细"
        open={flowOpen}
        onCancel={() => setFlowOpen(false)}
        width={1500}
        footer={null}
      ><FlowForm
        ref={flowFormRef}
        setOpen={setFlowOpen}
        nodeData={nodeStatus}
        nodeList={nodeList}
        currentNode={currentNode}
        schemeData={schemeData}
        planData={planFormData}
        refreshStatus={getFlowStatus}
      ></FlowForm>
      </Modal>
      <Modal
        keyboard={false}
        maskClosable={false}
        title="实施计划"
        open={planOpen}
        onCancel={() => setPlanOpen(false)}
        width={1500}
        okButtonProps={{disabled: isPlanFormDisabled}}
        onOk={handlePlanOk}
      ><PlanForm ref={planFormRef} formData={planFormData} isDisabled={isPlanFormDisabled} schemeId={schemeData.id}></PlanForm>
      </Modal>
    </div>
  );
};
export default SystemAuditItem;
