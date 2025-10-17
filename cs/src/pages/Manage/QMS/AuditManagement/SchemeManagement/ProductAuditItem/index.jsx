import {Button, message, Modal} from 'antd'
import {useEffect, useRef, useState} from 'react'
import PlanForm from '@/pages/Manage/QMS/AuditManagement/SchemeManagement/ProductAuditItem/component/PlanForm.jsx'
import {create_product_review_plan, create_review_plan, read_review_plan, update_product_review_plan, update_review_plan} from '@/apis/qms_router.jsx'
import {cloneDeep} from 'lodash'

const ProcessAuditItem = ({schemeData}) => {
  const [planOpen, setPlanOpen] = useState(false)
  const planFormRef = useRef(null)
  const [planFormData, setPlanFormData] = useState({})
  const [isPlanFormEdit, setIsPlanFormEdit] = useState(false)
  const [isPlanFormDisabled, setIsPlanFormDisabled] = useState(false)
  const defaultPlanFormData = {
    audit_plan_id: schemeData.id,
    purpose: schemeData.product.purpose,
    scope: schemeData.product.scope,
    criteria_methods: schemeData.criteria_methods,
    plan_items: schemeData.product.customer_product.map(({customer, product, audit_time}) => ({
      customer_name: customer,
      product_name: product,
      product_specification: null,
      note: null,
      plan_time: audit_time,
      plan_person_in_charge: null,
      actual_time: null,
      actual_person_in_charge: null
    }))
  }
  const handlePlanOk = () => {
    const nowData = planFormRef.current.getFieldsValue()
    if (isPlanFormEdit) {
      update_product_review_plan(nowData, () => {
        setPlanOpen(false);
        getImplementationPlan()
        message.success('修改成功')
      })
    } else {
      create_product_review_plan(nowData, () => {
        setPlanOpen(false);
        getImplementationPlan()
        message.success('新增成功')
      })
    }
  }
  const getImplementationPlan = () => {
    read_review_plan({id: schemeData.id, type: 'product'}, ({data: {data}}) => {
      if (data?.length) {
        setIsPlanFormEdit(true)
        setPlanFormData(data[0])
      } else {
        setIsPlanFormEdit(false)
        setPlanFormData(cloneDeep(defaultPlanFormData))
      }
    })
  }
  useEffect(() => {
    getImplementationPlan()
  }, [schemeData]);
  return (
    <div style={{display: "flex", flexDirection: "column", padding: 20}}>
      <div style={{fontSize: "16px", fontWeight: "500"}}>产品审核</div>
      <Button variant="filled" color="primary" style={{marginTop: 10}} onClick={() => {
        setPlanOpen(true)
      }}>查看实施计划</Button>
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
  )
}
export default ProcessAuditItem
