import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Table, Upload} from 'antd'
import {useEffect, useRef, useState} from 'react'
import {
  create_inspection_record,
  update_inspection_record,
} from '@/apis/qms_router.jsx'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {EditTable} from '@/pages/Manage/QMS/ChangeMng/ChangeTracking/component/EditTable.jsx'
import {DefectCoefficient} from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionStandard/ModalForm.jsx'
import {cloneDeep} from 'lodash'
import dayjs from 'dayjs'
import {readUsers} from '@/apis/auth_api.jsx'

const DefectCoefficientMap = {
  A: 10, B: 5, C: 1
}
const ModalForm = ({isEdit, open, setOpen, refresh, row, planInfo}) => {
  const recordsDataRef = useRef([])
  const [form] = Form.useForm()
  const [recordsData, setRecordsData] = useState([])
  const QKZRef = useRef('')
  const totalSampleRef = useRef(0)
  const aClassRef = useRef(0)
  const bClassRef = useRef(0)
  const cClassRef = useRef(0)
  const preColumns = [
    {
      dataIndex: 'technical_specification',
      title: '检测项目/技术规范',
      width: 150,
      type: 'Input',
    },
    {
      dataIndex: 'evaluation_technique',
      title: '测量评价技术',
      width: 120,
      type: 'Input',
    },
    {
      dataIndex: 'testing_equipment',
      title: '检测设备',
      width: 150,
      type: 'Input',
    },
    {
      dataIndex: 'defect_coefficient',
      title: '缺陷系数',
      width: 230,
      type: 'Radio.Group',
      props: (text, record, index) => ({
        options: DefectCoefficient,
        onChange: (e) => {
          const dataSource = (recordsDataRef.current)
          record['defect_coefficient'] = e.target.value
          dataSource[index] = handleRowData(record)
          setRecordsData(dataSource)
        }
      })
    },
    {
      dataIndex: 'sample_quantity',
      title: '抽样数量',
      width: 100,
      type: 'InputNumber',
      props: (text, record, index) => ({
        onChange: null,
        controls: false,
        onBlur: (e) => {
          const dataSource = (recordsDataRef.current)
          const value = Number(e.target.value)
          record['sample_quantity'] = isNaN(value) ? 0 : value
          dataSource[index] = handleRowData(record)
          handleRecordItems(dataSource)
        }
      })
    },
    {
      dataIndex: 'nXf',
      title: 'nXf',
      width: 80,
      type: 'InputNumber',
      disabled: true
    },
  ]
  const sufColumns = [
    {
      dataIndex: 'defect_number',
      title: '缺陷个数',
      width: 80,
      type: 'InputNumber',
      disabled: true
    },
    {
      dataIndex: 'defect_score',
      title: '缺陷分数',
      width: 80,
      type: 'InputNumber',
      disabled: true
    },
  ]
  const [columns, setColumns] = useState(
    [...preColumns, ...sufColumns]
  )
  const [userOptions, setUserOptions] = useState([])
  const handleUserSearch = (params) => {
    readUsers(
      params,
      ({data: {data: {user}}}) => {
        setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
      }
    )
  }
  const formItems = [
    [
      {
        span: 8,
        label: '产品名称',
        rules: [{required: true, message: '请输入产品名称'}],
        name: 'product_name',
        formItem: <Input disabled={true}/>
      },
      {
        span: 8,
        label: '产品编号',
        name: 'product_number',
        rules: [{required: true, message: '请输入产品编号'}],
        formItem: <Input />
      },
      {
        span: 8,
        label: '取样时间',
        name: 'sample_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        rules: [{required: true, message: '请输入取样时间'}],
        formItem: <DatePicker />
      },
    ],
    [
      {
        span: 8,
        label: '取样地点',
        name: 'sampling_location',
        rules: [{required: true, message: '请输入生产日期'}],
        formItem: <Input />
      },
      {
        span: 8,
        label: '生产日期',
        name: 'manufacture_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        rules: [{required: true, message: '请输入生产日期'}],
        formItem: <DatePicker />
      },
      {
        span: 8,
        label: '审核日期',
        name: 'approved_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        rules: [{required: true, message: '请输入审核日期'}],
        formItem: <DatePicker />
      },
    ],
    [
      {
        span: 8,
        name: 'auditor',
        label: '审核人员',
        rules: [{required: true, message: '请选择审核人员'}],
        formItem: (
          <Select
            showSearch
            filterOption={false}
            onSearch={(value) => value && handleUserSearch({value})}
            options={userOptions}
          />
        )
      },
      {
        span: 8,
        label: '审核日期',
        name: 'auditor_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        rules: [{required: true, message: '请输入审核人员审核日期'}],
        formItem: <DatePicker />
      },
      {
        span: 8,
        name: 'team_leader',
        label: '审核组长',
        rules: [{required: true, message: '请选择审核组长'}],
        formItem: (
          <Select
            showSearch
            filterOption={false}
            onSearch={(value) => value && handleUserSearch({value})}
            options={userOptions}
          />
        )
      },
    ],
    [
      {
        span: 8,
        label: '审核日期',
        name: 'team_leader_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        rules: [{required: true, message: '请输入审核组长审核日期'}],
        formItem: <DatePicker />
      },
      {
        span: 16,
        label: '检验依据',
        name: 'inspection_basis',
        rules: [{required: true, message: '请输入检验依据'}],
        formItem: <Input.TextArea />
      },
    ],
    [
      {
        span: 24,
        formItem: (
          <EditTable
            title={() => '检验记录：'}
            columns_text={columns}
            dataSource={recordsData}
            setTbData={setRecordsData}
            handleAddRow={() => {
              const newRow = {
                key: recordsData.length,
                technical_specification: '',
                evaluation_technique: '',
                testing_equipment: '',
                defect_coefficient: '',
                sample_quantity: 0,
                nXf: 0,
                sample_testing_records: [],
                defect_number: 0,
                defect_score: 0,
              };
              setRecordsData([...recordsData, newRow]);
            }}
            tableProps={{
              summary: pageData => {
                const sumRecordTimes = pageData.reduce((sum, item) => {
                  sum = Math.max(sum, item.sample_quantity)
                  return sum
                }, 0)
                let total_nXf = 0;
                let total_defect_number = 0;
                let total_defect_score = 0;
                let total_sample = 0;
                let total_a_class_defect = 0;
                let total_b_class_defect = 0;
                let total_c_class_defect = 0;
                pageData.forEach(({nXf, defect_number, defect_score, sample_quantity, defect_coefficient}) => {
                  const defectNumber = isNaN(Number(defect_number)) ? 0 : Number(defect_number);
                  total_defect_number += defectNumber
                  total_sample += isNaN(Number(sample_quantity)) ? 0 : Number(sample_quantity);
                  total_nXf += isNaN(Number(nXf)) ? 0 : Number(nXf);
                  total_defect_score += isNaN(Number(defect_score)) ? 0 : Number(defect_score);
                  if (defect_coefficient === 'A') total_a_class_defect += defectNumber
                  else if (defect_coefficient === 'B') total_b_class_defect += defectNumber
                  else if (defect_coefficient === 'C') total_c_class_defect += defectNumber
                });
                QKZRef.current = `${((1 - total_defect_score / total_nXf) * 100).toFixed(2)}%`
                totalSampleRef.current = total_sample
                aClassRef.current = total_a_class_defect
                bClassRef.current = total_b_class_defect
                cClassRef.current = total_c_class_defect
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={6}>
                        <div style={{textAlign: 'right'}}>合计</div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        {total_nXf}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={sumRecordTimes}>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        {total_defect_number}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} colSpan={2}>
                        {total_defect_score}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={6}>
                        <div style={{textAlign: 'right'}}>评价结果：QKZ</div>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={sumRecordTimes + 4}>
                        {QKZRef.current}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }
            }}>
          </EditTable>
        )
      }
    ]
  ]
  const handleRecordItems = (recordItems = []) => {
    const sumRecordTimes = recordItems.reduce((sum, item) => {
      sum = Math.max(sum, item.sample_quantity)
      return sum
    }, 0)
    const sumRecordColumns = []
    for (let i = 0, l = sumRecordTimes; i < l; i++) {
      sumRecordColumns.push({
        dataIndex: [`sample_testing_records`, i],
        title: `记录${i + 1}`,
        width: 200,
        type: 'Radio.Group',
        props: (text, record, index) => ({
          showCell: text !== undefined,
          options: [{label: 'OK', value: 'OK'}, {label: 'NG', value: 'NG'}],
          onChange: (e) => {
            const dataSource = recordsDataRef.current
            record[`sample_testing_records`][i] = e.target.value
            dataSource[index] = handleRowData(record)
            setRecordsData(dataSource)
          }
        })
      })
    }
    setColumns([...preColumns, ...sumRecordColumns, ...sufColumns])
    setRecordsData(recordItems.map(item => {
      const newItem = {...item}
      const new_sample_testing_records = newItem.sample_testing_records
      // 重新根据样本数生成数据
      for (let i = 0, l = newItem.sample_quantity; i < l; i++) {
        new_sample_testing_records[i] = new_sample_testing_records[i] ?? ''
      }
      return {...newItem, sample_testing_records: new_sample_testing_records}
    }))
  }
  const handleRowData = (record) => {
    const coefficient = DefectCoefficientMap[record.defect_coefficient]
    const ngNumber = record.sample_testing_records.filter(i => i === 'NG').length
    record.nXf = record.sample_quantity * coefficient
    record.defect_score = ngNumber * coefficient
    record.defect_number = ngNumber
    return record
  }
  const handleOk = () => {
    form.validateFields().then(values => {
      const extraData = {
        record_items: recordsData,
        QKZ: QKZRef.current,
        total_sample: totalSampleRef.current,
        A_class_defect: aClassRef.current,
        B_class_defect: bClassRef.current,
        C_class_defect: cClassRef.current
      }
      if (isEdit) {
        update_inspection_record({
          id: row.id,
          ...values,
          ...extraData
        }, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_inspection_record({
          product_review_plan_id: planInfo.id,
          ...values,
          ...extraData
        }, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {record_items, team_leader, auditor, ...rest} = row
      const userList = []
      typeof team_leader === 'number' && userList.push(team_leader)
      typeof auditor === 'number' && userList.push(auditor)
      handleUserSearch({user_id: Array.from(new Set(userList)).join()})
      form.setFieldsValue({team_leader, auditor, ...rest})
    } else if (!isEdit && open) {
      form.resetFields()
      setRecordsData([])
    }
  }, [open])
  useEffect(() => {
    recordsDataRef.current = cloneDeep(recordsData)
  }, [recordsData]);
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={1200}>
      <CustomForm
        form={form}
        formItems={formItems}
      />
    </Modal>
  )
}
export default ModalForm;
