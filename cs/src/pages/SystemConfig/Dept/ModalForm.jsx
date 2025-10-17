import {Form, Input, InputNumber, message, Modal, TreeSelect} from 'antd'
import {useEffect, useState} from 'react'
import {create_department, update_department,} from '@/apis/auth_api.jsx'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {useSelector} from "react-redux";
import MultiSelect from "@/components/CustomSeries/MultiSelect.jsx";

const filterTreeData = (data, value) => {
  const newData = structuredClone(data);
  for (let i = 0, l = newData.length; i < l; i++) {
    const {value: id, children} = newData[i]
    if (id === value) {
      newData.splice(i, 1);
      break;
    } else if (children?.length) {
      newData[i].children = filterTreeData(children, value)
    }
  }
  return newData;
}
const ModalForm = ({isEdit, open, setOpen, refresh, row}) => {
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const {data: fullEmployeeList} = useSelector((state) => state.employee)
  const {data: fullDeptList, selectTreeData} = useSelector((state) => state.dept)
  const [treeData, setTreeData] = useState([])
  const handleUserSearch = (param) => {
    const options = fullEmployeeList.filter(({person_id, user_name}) => {
      if (~param.indexOf(',')) {
        const arr = param.split(',')
        return arr.some(txt => ~person_id.indexOf(txt) || ~user_name.indexOf(txt))
      } else if (param !== '') {
        return ~person_id.indexOf(param) || ~user_name.indexOf(param)
      }
    })
    setUserOptions(options.map(({person_id, user_name}) => ({label: user_name, value: person_id})))
  }
  const formItems = [
    [
      {
        span: 12,
        label: '部门名称',
        rules: [{required: true, message: '请输入部门名称'}],
        name: 'display_name',
        formItem: <Input />
      },
      {
        span: 12,
        label: '上级部门',
        name: 'parent_id',
        // rules: [{required: true, message: '请选择上级部门'}],
        formItem: <TreeSelect
          styles={{
            popup: {root: {maxHeight: 400, overflow: 'auto'}},
          }}
          allowClear
          treeData={treeData}
          placeholder="请选择上级部门"
          treeDefaultExpandAll
        />
      },
    ],
    [
      {
        span: 12,
        label: '排序',
        name: 'sort',
        formItem: <InputNumber min={1} />
      },
      {
        span: 12,
        label: '部门领导人',
        name: 'leader',
        // rules: [{required: true, message: '请选择部门领导人'}],
        formItem: <MultiSelect
          showSearch={true}
          onSearch={(value) => value && handleUserSearch(value)}
          options={userOptions}
          filterOption={false}
        />
      },
    ]
  ]
  const handleOk = () => {
    form.validateFields()
    .then(values => {
      const {leader, parent_id} = values
      values.leader = leader?.join() ?? ''
      values.parent_id = parent_id ?? null
      let ancestors = fullDeptList.find(({id}) => id === parent_id)?.ancestors
      if (typeof parent_id === 'number') {
        ancestors = ancestors?.split(',') ?? []
        ancestors.push(parent_id)
        ancestors = ancestors.join()
      }
      if (isEdit) {
        update_department({id: row.id, ...values, ancestors}, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh(true)
        })
      } else {
        create_department({...values, ancestors}, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh(true)
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      let {leader, id} = row
      handleUserSearch(leader)
      leader = leader === '' ? [] : leader.split(',')
      form.setFieldsValue({...row, leader})
      setTreeData(filterTreeData(selectTreeData, id))
    } else if (!isEdit && open) {
      form.resetFields()
      setTreeData(selectTreeData)
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
