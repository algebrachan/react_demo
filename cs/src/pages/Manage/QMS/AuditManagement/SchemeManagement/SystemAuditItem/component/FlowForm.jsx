import CommonFlow from '../../../../../../../components/CommonFlow/index.jsx'
import GraphData from './GraphData.js'
import SchemeForm from '../../SchemeForm/index.jsx'
import PlanForm from './PlanForm.jsx'
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {
  gen_manager_review,
  manager_review,
  submit_audit_plan,
  submit_review_plan,
  task_records
} from '../../../../../../../apis/qms_router.jsx'
import {Button, Form, Input, message, Popconfirm, Radio} from 'antd'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'

const PlanNodeForm = ({isDisabled, formData = {}, refreshStatus, setOpen}) => {
  const handlePlanConfirm = () => {
    if (!formData.id) {
      message.error('请先新建实施计划！')
      return
    }
    submit_review_plan({id: formData.id, type: 'system'}, () => {
      message.success('确认成功')
      refreshStatus()
      setOpen(false)
    })
  }
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <div style={{flex: 'none', fontSize: '16px', fontWeight: '700', padding: ' 0 8px'}}>编制审核实施计划：</div>
      <div style={{flex: 'auto', overflow: 'auto', padding: '8px 8px 0'}}>
        <PlanForm isDisabled={true} formData={formData}></PlanForm>
      </div>
      <div style={{flex: 'none', padding: '8px 8px 0'}}>
        <Popconfirm title="确认该实施计划吗？" onConfirm={handlePlanConfirm}>
          <Button style={{float: 'right'}} disabled={isDisabled}>确认</Button>
        </Popconfirm>
      </div>
    </div>
  )
}
const SchemeNodeForm = ({isDisabled = false, formData = {}, refreshStatus, setOpen}) => {
  const handleSchemeConfirm = () => {
    submit_audit_plan({id: formData.id}, () => {
      message.success('确认成功')
      refreshStatus()
      setOpen(false)
    })
  }
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <div style={{flex: 'none', fontSize: '16px', fontWeight: '700', padding: ' 0 8px'}}>编制审核方案：</div>
      <div style={{flex: 'auto', overflow: 'auto', padding: '8px 8px 0'}}>
        <SchemeForm isDisabled={true} formData={formData}></SchemeForm>
      </div>
      <div style={{flex: 'none', padding: '8px 8px 0'}}>
        <Popconfirm title="确认该审核方案吗？" onConfirm={handleSchemeConfirm}>
          <Button style={{float: 'right'}} disabled={isDisabled}>确认</Button>
        </Popconfirm>
      </div>
    </div>
  )
}
const CommonAudit = ({isDisabled, refreshStatus, planData, request, title, formData, setOpen}) => {
  const [form] = Form.useForm()
  const handleConfirm = () => {
    form.validateFields().then((values) => {
      request({
        id: planData.id,
        type: 'system',
        ...values
      }, (res) => {
        message.success('审核完成！')
        refreshStatus()
        setOpen(false)
      })
    })
  }
  const options = [
    {label: '同意', value: true},
    {label: '驳回', value: false}
  ]
  const formItems = [
    [{
      span: 24,
      label: '审核结果',
      name: 'is_pass',
      rules: [{required: true}],
      formItem: <Radio.Group options={options}></Radio.Group>
    },],
    [{
      span: 24,
      label: '审核意见',
      name: 'reject_reason',
      rules: [{required: true}],
      formItem: <Input.TextArea rows={4} />
    }]
  ]
  useEffect(() => {
    form.setFieldsValue(formData)
  }, []);
  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
      <div style={{flex: 'none', fontSize: '16px', fontWeight: '700', padding: ' 0 8px'}}>{title}：</div>
      <div style={{flex: 'auto', overflow: 'auto', padding: '8px 8px 0'}}>
        <CustomForm disabled={isDisabled} formItems={formItems} form={form}></CustomForm>
      </div>
      <div style={{flex: 'none', padding: '8px 8px 0'}}>
        <Button style={{float: 'right'}} disabled={isDisabled} onClick={handleConfirm}>提交</Button>
      </div>
    </div>
  )
};
const FlowForm = forwardRef((props, ref) => {
  const {nodeData, nodeList, planData, schemeData, refreshStatus, currentNode, setOpen} = props
  const nodeListRef = useRef([])
  const [recordData, setRecordData] = useState([])
  const [clickNode, setClickNode] = useState(currentNode)
  const isClickNodeCurrent = currentNode.name === clickNode.name
  const getRecordData = () => {
    task_records({id: schemeData.id, type: 'system'}, ({data: {data}}) => {
      setRecordData(data.map(({time, operator, opinion}) => ({children: `${time} ${operator} ${opinion}`})))
    })
  }
  const userInfo = JSON.parse(sessionStorage.getItem('user_info'))
  const nodeFormMap = {
    A01: <div style={{fontSize: '16px', fontWeight: '700', padding: ' 0 8px'}}>开始：</div>,
    A02: <SchemeNodeForm isDisabled={!isClickNodeCurrent} formData={schemeData} refreshStatus={refreshStatus}
                         setOpen={setOpen} />,
    A03: <PlanNodeForm isDisabled={!isClickNodeCurrent} formData={planData} refreshStatus={refreshStatus}
                       setOpen={setOpen} />,
    A04: (
      <CommonAudit
        key={'A04'}
        setOpen={setOpen}
        isDisabled={!isClickNodeCurrent || userInfo.username !== '10000870' && userInfo.username !== 'admin'}
        planData={planData}
        refreshStatus={refreshStatus}
        request={manager_review}
        formData={isClickNodeCurrent ? {} : clickNode.form_data}
        title={'管理者代表审核'}
      ></CommonAudit>
    ),
    A05: (
      <CommonAudit
        key={'A05'}
        setOpen={setOpen}
        isDisabled={!isClickNodeCurrent || userInfo.username !== '10000411' && userInfo.username !== 'admin'}
        planData={planData}
        refreshStatus={refreshStatus}
        request={gen_manager_review}
        formData={isClickNodeCurrent ? {} : clickNode.form_data}
        title={'总经理审核'}
      ></CommonAudit>
    ),
    A06: <div style={{fontSize: '16px', fontWeight: '700', padding: ' 0 8px'}}>审核计划公示：</div>
  }
  const handleOnNodeClick = (node) => {
    setClickNode(nodeListRef.current.find(({name}) => name === node.id))
  }
  useEffect(() => {
    nodeListRef.current = structuredClone(nodeList)
  }, [nodeList]);
  useEffect(() => {
    getRecordData()
  }, [nodeData])
  useImperativeHandle(ref, () => ({
    setCurrent: (...args) => setClickNode(...args)
  }))
  return (
    <CommonFlow style={{height: '600px'}} graphData={GraphData} nodeData={nodeData} recordData={recordData}
                onNodeClick={handleOnNodeClick}>
      {nodeFormMap[clickNode.node_id]}
    </CommonFlow>
  );
})
export default FlowForm;
