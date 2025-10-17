import Title from "@/pages/Manage/RMS/component/Title.jsx";
import { Button, message, Popconfirm, Table } from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
  FormOutlined,
  ImportOutlined,
  PlusSquareOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import styles from "../../style/index.module.less";
import React, { useState, useRef, useEffect } from "react";
import ModalForm from "./ModalForm.jsx";
import {
  deleteDeviceGroup,
  deleteDeviceType,
  readDeviceGroup,
  readDeviceType,
} from "@/apis/rms.js";

const DeviceGroup = ({
  deviceGroupList,
  getDeviceGroupList,
  deviceTypeList,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [tbData, setTbData] = useState([]);
  const [tbLoading, setTbLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [curRowData, setCurRowData] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const genColumns = () => {
    return [
      { title: "序号", dataIndex: "Index", width: 100 },
      { title: "设备组名称", dataIndex: "DisplayName", width: 200 },
      {
        title: "设备类型",
        dataIndex: "DeviceTypeId",
        width: 200,
        render: (text) =>
          deviceTypeList.find((item) => item.Id === text)?.DisplayName ?? "",
      },
      { title: "创建者", dataIndex: "Creator", width: 160 },
      { title: "创建时间", dataIndex: "CreateTime", width: 220 },
      { title: "备注", dataIndex: "Description" },
    ];
  };
  const handleRowClick = (record) => {
    setSelectedRowKeys([record.Id]);
    setCurRowData({ ...record });
  };
  const getTbData = () => {
    setTbLoading(true);
    setTimeout(() => {
      setTbLoading(false);
      setTbData(deviceGroupList);
      setSelectedRowKeys([]);
    }, 300);
  };
  const handleAddRow = () => {
    setIsEdit(false);
    setOpen(true);
  };
  const handleEditRow = () => {
    setIsEdit(true);
    setOpen(true);
  };
  const handleDeleteRow = () => {
    const { Id, key, Index, ...rest } = curRowData;
    deleteDeviceGroup(rest).then((res) => {
      message.success("删除成功");
      getDeviceGroupList();
    });
  };
  useEffect(() => {
    getTbData();
  }, [deviceGroupList]);
  return (
    <>
      <Title
        border={false}
        title={"设备分组"}
        style={{ height: `calc(100% - 16)` }}
        margin={`0 0 16`}
        right={
          <div className={styles["button-group"]}>
            <Button
              variant={"outlined"}
              style={{ marginRight: 8 }}
              color={"primary"}
              size={"small"}
              icon={<SyncOutlined />}
              onClick={getDeviceGroupList}
            >
              刷新
            </Button>
            <Button
              variant={"outlined"}
              style={{ marginRight: 8 }}
              color={"primary"}
              size={"small"}
              icon={<PlusSquareOutlined />}
              onClick={handleAddRow}
            >
              新增
            </Button>
            <Button
              variant={"outlined"}
              style={{ marginRight: 8 }}
              color={"primary"}
              size={"small"}
              icon={<FormOutlined />}
              onClick={handleEditRow}
              disabled={!selectedRowKeys.length}
            >
              编辑
            </Button>
            <Popconfirm
              title="警告"
              description="是否删除该条数据？"
              onConfirm={handleDeleteRow}
              okText="确认"
              cancelText="取消"
            >
              <Button
                variant={"outlined"}
                color={"primary"}
                size={"small"}
                icon={<DeleteOutlined />}
                disabled={!selectedRowKeys.length}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        }
      >
        <Table
          loading={tbLoading}
          rowKey={"Id"}
          size={"small"}
          columns={genColumns()}
          scroll={{
            x: "max-content",
            y: `calc(100vh - 246)`,
          }}
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onSelect: (record) => {
              setSelectedRowKeys([record.Id]);
              setCurRowData({ ...record });
            },
          }}
          dataSource={tbData}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          pagination={false}
        ></Table>
      </Title>
      <ModalForm
        deviceTypeList={deviceTypeList}
        isEdit={isEdit}
        open={open}
        refresh={getDeviceGroupList}
        setOpen={setOpen}
        row={curRowData}
      ></ModalForm>
    </>
  );
};
export default DeviceGroup;
