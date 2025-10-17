import {DatePicker, Form, Input, message, Modal, Select} from 'antd'
import MultiSelect from '../../../../../../../components/CustomSeries/MultiSelect.jsx'
import {dutiesOptions} from '../../../SchemeManagement/SchemeForm/index.jsx'
import dayjs from 'dayjs'
import {useEffect} from 'react'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {create_audit_checklist_item, update_audit_checklist, update_audit_checklist_item} from '../../../../../../../apis/qms_router.jsx'

const CheckItemModal = ({listData, isEdit, open, setOpen, refresh, row}) => {
  const [form] = Form.useForm()
  const formItems = [
    [{
      span: 24,
      label: '检查要点',
      rules: [{required: true, message: '请输入检查要点'}],
      name: 'inspection_point',
      formItem: <Select options={dutiesOptions} />
    }],
    [{
      span: 24,
      label: '支持过程',
      name: 'process',
      formItem: <Input />
    }],
    [{
      span: 24,
      label: '标准条款',
      name: 'standard_terms',
      rules: [{required: true, message: '请输入标准条款'}],
      formItem: <Input />
    }],
    [{
      span: 24,
      label: '判定结果',
      name: 'judge',
      formItem: <Select options={[{value: 'Y'}, {value: 'N'}]} />
    }],
    [{
      span: 24,
      label: '审核记录',
      name: 'audit_records',
      rules: [{required: true, message: '请输入审核记录'}],
      formItem: <Input.TextArea rows={4} />
    }]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update_audit_checklist_item({id: row.id, ...values}, () => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_audit_checklist_item({checklist_id: listData.id, ...values}, () => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      form.setFieldsValue(row)
    } else if (!isEdit && open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={500}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 4}}
      />
    </Modal>
  )
}
export default CheckItemModal;
