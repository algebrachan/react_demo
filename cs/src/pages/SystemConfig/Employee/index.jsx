import {MyBreadcrumb} from "@/components/CommonCard/index.jsx";
import {Button, Form, Input, message, Popconfirm, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import styles from "./style/index.module.less";
import CustomForm from "@/components/CustomSeries/CustomForm.jsx";
import {delete_employee} from "@/apis/auth_api.jsx";
import ModalForm from "@/pages/SystemConfig/Employee/ModalForm.jsx";
import {useSelector, useDispatch} from 'react-redux';
import {getEmployeeData} from "@/store/employeeSlice.js";
import {getDeptData} from "@/store/deptSlice.js";

const Employee = () => {
  const [form] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curData, setCurData] = useState({})
  const dispatch = useDispatch();
  const {data: fullEmployeeList} = useSelector((state) => state.employee)
  const {data: fullDeptList} = useSelector((state) => state.dept)

  const updateEmployee = (isForceUpdate) => {
    dispatch(getEmployeeData(isForceUpdate))
  }
  const getTableData = () => {
    setTbLoad(true)
    const {value} = form.getFieldsValue()
    const newTbData = fullEmployeeList.filter(({user_name, person_id}) => {
      return ~user_name.indexOf(value) || ~person_id.indexOf(value)
    })
    setTimeout(() => {
      setTbData(newTbData)
      setTbLoad(false)
    }, 500)
  }
  const handleAddRow = () => {
    setOpen(true)
    setIsEdit(false)
  }
  const handleDeleteRow = (row) => {
    delete_employee(
      {id: row.id},
      () => {
        message.success(`删除成功`)
        updateEmployee(true)
      })
  }
  const formItems = [[
    {span: 4, name: 'value', formItem: <Input allowClear />},
    {
      span: 4, formItem: (
        <>
          <Button style={{width: 'auto'}} type="primary" onClick={getTableData}>查询</Button>
        </>
      )
    },
    {
      span: 16, formItem: (
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button onClick={handleAddRow}>新建</Button>
        </div>
      )
    },
  ]]
  const pagination = () => {
    return {
      pageSize: 20,
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      position: ["bottomCenter"],
      showQuickJumper: true,
      showSizeChanger: true
    };
  };
  const columns = () => [
    {
      title: '工号',
      dataIndex: 'person_id',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'org_code',
      width: 120,
      render: (text) => {
        return fullDeptList.find((item) => item.id === text)?.display_name
      }
    },
    {
      title: '岗位',
      dataIndex: 'position_name',
      width: 120,
    },
    {
      title: '上级领导',
      dataIndex: 'manager_id',
      width: 120,
      render: (text) => {
        return fullEmployeeList.find((item) => item.person_id === text)?.user_name
      }
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <Button variant="text" color={'primary'} onClick={() => {
              setIsEdit(true)
              setOpen(true)
              setCurData({...record})
            }}>编辑</Button>
            <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => handleDeleteRow(record)}>
              <Button variant="text" color={'danger'}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  useEffect(() => {
    updateEmployee(false)
    dispatch(getDeptData())
  }, [])
  useEffect(() => {
    if (fullEmployeeList.length) getTableData()
  }, [fullEmployeeList])
  return (
    <>
      <MyBreadcrumb items={[window.sys_name, "员工管理"]} />
      <div className={`content_root ${styles['employee']}`}>
        <CustomForm form={form} formItems={formItems} initialValues={{value: ''}}></CustomForm>
        <Table
          rowKey={'id'}
          loading={tb_load}
          size={'small'}
          columns={columns()}
          dataSource={tb_data}
          scroll={{
            x: 'max-content',
            y: 'calc(100vh - 300px)',
          }}
          pagination={pagination()}
        />
      </div>
      <ModalForm
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
        refresh={updateEmployee}
        row={curData}
      ></ModalForm>
    </>
  )
}
export default Employee;