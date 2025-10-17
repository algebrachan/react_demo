import {MyBreadcrumb} from "@/components/CommonCard/index.jsx";
import {Button, Form, Input, message, Popconfirm, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import styles from "./style/index.module.less";
import CustomForm from "@/components/CustomSeries/CustomForm.jsx";
import {delete_department} from "@/apis/auth_api.jsx";
import ModalForm from "@/pages/SystemConfig/Dept/ModalForm.jsx";
import {useSelector, useDispatch} from 'react-redux';
import {getDeptData} from "@/store/deptSlice.js";
import {getEmployeeData} from "@/store/employeeSlice.js";

const Dept = () => {
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curData, setCurData] = useState({})
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const dispatch = useDispatch();
  const {data: fullEmployeeList} = useSelector((state) => state.employee)
  const {data: fullDeptList, rawTreeData} = useSelector((state) => state.dept)
  const updateDept = (isForceUpdate) => {
    dispatch(getDeptData(isForceUpdate))
  }
  const getTableData = () => {
    setTbLoad(true)
    setTimeout(() => {
      setTbData(rawTreeData)
      setTbLoad(false)
    }, 500)
  }
  const handleAddRow = () => {
    setOpen(true)
    setIsEdit(false)
  }
  const handleDeleteRow = (row) => {
    delete_department(
      {id: row.id},
      () => {
        message.success(`删除成功`)
        updateDept(true)
      })
  }
  const formItems = [[
    {
      span: 24, formItem: (
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button onClick={handleAddRow}>新建</Button>
        </div>
      )
    },
  ]]
  const columns = () => [
    {
      title: '部门名称',
      dataIndex: 'display_name',
      width: 120,
    },
    {
      title: '上级部门',
      dataIndex: 'parent_id',
      width: 120,
      render: (text) => {
        return fullDeptList.find((item) => item.id === text)?.display_name
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 120,
    },
    {
      title: '部门领导人',
      dataIndex: 'leader',
      width: 120,
      render: (text) => {
        const list = text?.split(',') ?? []
        return list.map(id => fullEmployeeList.find((item) => item.person_id === id)?.user_name).join()
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
    updateDept(false)
    dispatch(getEmployeeData())
  }, [])
  useEffect(() => {
    if (fullDeptList.length) {
      setExpandedRowKeys(fullDeptList.map(({id}) => id))
      getTableData()
    }
  }, [fullDeptList])
  return (
    <>
      <MyBreadcrumb items={[window.sys_name, "部门管理"]} />
      <div className={`content_root ${styles['dept']}`}>
        <CustomForm formItems={formItems}></CustomForm>
        <Table
          rowKey={'id'}
          loading={tb_load}
          size={'small'}
          columns={columns()}
          dataSource={tb_data}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowKeys,
            onExpandedRowsChange: setExpandedRowKeys,
          }}
          scroll={{
            x: 'max-content',
            y: 'calc(100vh - 300px)',
          }}
          pagination={false}
        />
      </div>
      <ModalForm
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
        refresh={updateDept}
        row={curData}
      ></ModalForm>
    </>
  )
}
export default Dept;