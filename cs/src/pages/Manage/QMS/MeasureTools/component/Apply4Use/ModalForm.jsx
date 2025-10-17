import {DatePicker, Form, Input, InputNumber, Modal, Select, message, Upload, Button} from 'antd'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {deviceApplyType, isTrue, measureTypes as typeOptions} from '../../dict.js'
import {addDeviceApply, addToolsLedger, editToolsLedger, updateDeviceApply, uploadToolsLedger, getToolsLedger} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'
import {EditTable} from '../../../ChangeMng/ChangeTracking/component/EditTable.jsx'

const ModalForm = ({isEdit, visible, setVisible, refresh, row}) => {
  const [form] = Form.useForm()
  const [isOldEquipmentReplaceTbData, setIsOldEquipmentReplaceTbData] = useState([])
  const [oldEquipmentNumberOptions, setOldEquipmentNumberOptions] = useState([])
  const [materialNumberOptions, setMaterialNumberOptions] = useState([])
  const isOldEquipmentReplaceColumns = [
    {
      dataIndex: 'is_exist',
      title: '是否旧设备替换',
      type: 'Select',
      width: 260,
      props: {options: isTrue}
    },
    {
      dataIndex: 'old_number',
      title: '旧设备编号',
      width: 260,
      type: 'Select',
      props: {
        options: oldEquipmentNumberOptions,
        showSearch: true,
        notFoundContent: null,
        filterOption: false,
        onSearch: (value) => {
          getToolsLedger({management_number: value}, ({data: {data}}) => {
            if (data?.length) {
              setOldEquipmentNumberOptions(data.map(({management_number, id}) => ({key: id, label: management_number, value: management_number})))
            } else {
              setOldEquipmentNumberOptions([])
            }
          })
        }
      }
    },
    {
      dataIndex: 'reason',
      title: '原因',
      type: 'Input',
    }
  ]
  const formItems = [
    [
      {
        span: 6,
        label: '申请主题',
        name: 'theme',
        rules: [{required: true, message: '请输入主题'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '申请人',
        name: 'applicant',
        rules: [{required: true, message: '请输入申请人'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '申请部门',
        name: 'department',
        rules: [{required: true, message: '请输入申请部门'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '申请类型',
        name: 'application_type',
        rules: [{required: true, message: '请输入申请类型'}],
        formItem: <Select disabled={isEdit} options={deviceApplyType} />
      }
    ],
    [
      {
        span: 6,
        label: '设备名称',
        name: 'equipment_name',
        rules: [{required: true, message: '请输入设备名称'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '物料号',
        name: 'material_number',
        rules: [{required: true, message: '请输入物料号'}],
        formItem: (
          <Select
            options={materialNumberOptions}
            showSearch={true}
            notFoundContent={null}
            filterOption={false}
            optionLabelProp={'material_number'}
            onSearch={(value) => {
              getToolsLedger({material_number: value}, ({data: {data}}) => {
                if (data?.length) {
                  setMaterialNumberOptions(data.map(({measuring_tool_name, material_number, id, ...rest}) => ({
                    measuring_tool_name, material_number, id,
                    ...rest,
                    key: id,
                    label: `${measuring_tool_name}-${material_number ?? ''}`,
                    value: material_number,
                  })))
                } else {
                  setMaterialNumberOptions([])
                }
              })
            }}
            onSelect={(value, option) => {
              const {measuring_tool_name, model, measurement_span, accuracy} = option
              form.setFieldsValue({
                equipment_name: measuring_tool_name,
                equipment_model: model,
                equipment_range: measurement_span,
                unit: accuracy
              })
            }}
          />
        )
      },
      {
        span: 6,
        label: '设备型号',
        name: 'equipment_model',
        rules: [{required: true, message: '请输入物料号'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '设备量程',
        name: 'equipment_range',
        formItem: <Input disabled={isEdit} />
      },
    ],
    [
      {
        span: 6,
        label: '设备精度',
        name: 'unit',
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '数量',
        name: 'quantity',
        formItem: <InputNumber onBlur={(e) => {
          const val = Number(e.target.value)
          const tbLength = isOldEquipmentReplaceTbData.length
          const list = [...isOldEquipmentReplaceTbData]
          for (let i = 0, l = Math.abs(val - tbLength); i < l; i++) {
            if (val > tbLength) {
              list.push({key: i + tbLength, is_exist: null, reason: null, old_number: null})
            } else {
              list.pop()
            }
          }
          setIsOldEquipmentReplaceTbData(list)
        }} />
      },
      {
        span: 6,
        label: '申请原因',
        name: 'reason',
        formItem: <Input />
      },
    ],
    [
      {
        span: 24,
        formItem: (
          <EditTable
            isOperate={false}
            title={() => "是否有旧设备替换："}
            columns_text={isOldEquipmentReplaceColumns}
            dataSource={isOldEquipmentReplaceTbData}
            setTbData={setIsOldEquipmentReplaceTbData}
          ></EditTable>
        )
      }
    ],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      const equipment_replacement = isOldEquipmentReplaceTbData.map(({key, is_exist, reason, old_number}) => {
        if (is_exist) {
          return {is_exist, old_number, reason: ''}
        } else {
          return {is_exist, old_number: '', reason}
        }
      })
      if (isEdit) {
        const {key, ...rest} = row
        updateDeviceApply({...rest, ...values, equipment_replacement}, () => {
          message.success(`编辑成功`)
          setVisible(false)
          form.resetFields()
          setIsOldEquipmentReplaceTbData([])
          refresh()
        })
      } else {
        addDeviceApply({...values, equipment_replacement}, () => {
          message.success(`添加成功`)
          setVisible(false)
          form.resetFields()
          setIsOldEquipmentReplaceTbData([])
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && visible) {
      const {equipment_replacement, ...rest} = row
      setIsOldEquipmentReplaceTbData(equipment_replacement.map((item, index) => ({key: index, ...item})))
      form.setFieldsValue(rest)
    } else if (!isEdit && visible) {
      form.resetFields()
      setIsOldEquipmentReplaceTbData([])
    }
  }, [visible])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={visible}
      onOk={() => handleOk()}
      onCancel={() => setVisible(false)}
      width={1500}>
      <CustomForm
        form={form}
        formItems={formItems}
      />
    </Modal>
  )
}
export default ModalForm;
