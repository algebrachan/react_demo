import {Button, DatePicker, Form, Input, message, Modal, Radio, Select} from 'antd'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {useEffect} from 'react'
import {update_non_conformance} from '../../../../../../../apis/qms_router.jsx'

const SystemVerifyModal = ({open, setOpen, refresh, row}) => {
  const [form] = Form.useForm();
  const formItems = [
    [{
      span: 24,
      label: '验证结果',
      name: 'verify',
      rules: [{required: true, message: '请选择验证结果！'}],
      formItem: (<Radio.Group options={[{label: '通过', value: 'Y'}, {label: '不通过', value: 'N'}]} />)
    }],
    [{
      span: 24,
      label: '验证意见',
      name: 'verifier_signature',
      rules: [{required: true, message: '请输入验证意见！'}],
      formItem: <Input.TextArea rows={4} />
    }]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      const {verify} = values
      update_non_conformance(
        {id: row.id, ...values, status: verify === 'N' ? '2' : row.status, is_confirmed: verify === 'Y'},
        res => {
          message.success(`体系验证填写成功`)
          setOpen(false)
          refresh()
        })
    })
  }
  useEffect(() => {
    if (open) {
      form.setFieldsValue(row)
    }
  }, [open])
  return (
    <Modal
      width={600}
      title={'体系验证'}
      open={open}
      onOk={handleOk}
      onCancel={() => setOpen(false)}>
      <CustomForm
        labelAlign="right"
        labelCol={{span: 4}}
        form={form}
        formItems={formItems}>
      </CustomForm>
    </Modal>
  );
};
export default SystemVerifyModal;
