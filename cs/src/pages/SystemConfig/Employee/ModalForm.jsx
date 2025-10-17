import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, TreeSelect, Upload} from 'antd'
import {useEffect, useState} from 'react'
import {
  create_employee,
  update_employee,
} from '@/apis/auth_api.jsx'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {useSelector} from "react-redux";

const ModalForm = ({isEdit, open, setOpen, refresh, row}) => {
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const {data: fullEmployeeList} = useSelector((state) => state.employee)
  const {selectTreeData} = useSelector((state) => state.dept)
  const handleUserSearch = (param) => {
    const options = fullEmployeeList.filter(({person_id, user_name}) => {
      if (param !== '') return ~person_id.indexOf(param) || ~user_name.indexOf(param)
    })
    setUserOptions(options.map(({person_id, user_name}) => ({label: user_name, value: person_id})))
  }
  const formItems = [
    [
      {
        span: 12,
        label: '工号',
        rules: [{required: true, message: '请输入工号'}],
        name: 'person_id',
        formItem: <Input />
      },
      {
        span: 12,
        label: '姓名',
        name: 'user_name',
        rules: [{required: true, message: '请输入姓名'}],
        formItem: <Input />
      },
    ],
    [
      {
        span: 12,
        label: '邮箱',
        name: 'email',
        rules: [{required: true, message: '请输入邮箱'}],
        formItem: <Input addonAfter={'@jsjd.cc'} />
      },
      {
        span: 12,
        label: '性别',
        name: 'gender',
        formItem: <Select options={[{value: '男'}, {value: '女'}]} />
      },
    ],
    [
      {
        span: 12,
        label: '部门',
        name: 'org_code',
        formItem: <TreeSelect
          styles={{
            popup: {root: {maxHeight: 400, overflow: 'auto'}},
          }}
          allowClear
          treeData={selectTreeData}
          placeholder="请选择部门"
          treeDefaultExpandAll
        />
      },
      {
        span: 12,
        label: '岗位',
        name: 'position_name',
        formItem: <Input />
      }
    ],
    [
      {
        span: 12,
        label: '上级领导',
        name: 'manager_id',
        formItem: <Select
          showSearch={true}
          onSearch={(value) => value && handleUserSearch(value)}
          options={userOptions}
          filterOption={false}
        />
      }
    ],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      const {email} = values
      values.email = `${email}@jsjd.cc`
      if (isEdit) {
        update_employee({id: row.id, ...values}, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh(true)
        })
      } else {
        create_employee(values, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh(true)
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {email, manager_id} = row
      handleUserSearch(manager_id)
      form.setFieldsValue({...row, email: email.replace('@jsjd.cc', '')})
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
      width={800}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 6}}
      />
    </Modal>
  )
}
export default ModalForm;
