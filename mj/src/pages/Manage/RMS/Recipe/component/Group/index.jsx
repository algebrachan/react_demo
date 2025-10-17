import Title from "@/pages/Manage/RMS/component/Title.jsx";
import { Button, Form, message, Popconfirm, Select, Table } from "antd";
import {
  CloudDownloadOutlined,
  CloudOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
  EyeOutlined,
  FormOutlined,
  ImportOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import styles from "../../style/index.module.less";
import React, { useState, useRef, useEffect, useMemo } from "react";
import GroupModal from "@/pages/Manage/RMS/Recipe/component/Group/GroupModal.jsx";
import {
  deleteRecipeFile,
  deleteRecipeGroup,
  exportRecipeFile,
  readRecipeDocList,
  readRecipeGroup,
  readUnboundDeviceList,
  GetProductionStepEnum,
} from "@/apis/rms.js";
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import DocModal from "@/pages/Manage/RMS/Recipe/component/Group/DocModal.jsx";
import DeliveryModal from "@/pages/Manage/RMS/Recipe/component/Group/DeliveryModal.jsx";
import PreviewModal from "@/pages/Manage/RMS/Recipe/component/Group/PreviewModal.jsx";
import BindModal from "./BindModal";
import { Input } from "antd";
import { Flex } from "antd";

const DeliveryTypeOptions = [
  { label: "变量", value: 0 },
  { label: "文件", value: 1 },
  { label: "变量&文件", value: 2 },
];
const RecipeGroup = ({
  deviceTypeList,
  recipeTemplateList,
  deviceList,
  queryDeviceTypeIds,
}) => {
  const [unboundDeviceIds, setUnboundDeviceIds] = useState([]);
  const [recipeTemplateOptions, setRecipeTemplateOptions] = useState([]);
  const [groupIsEdit, setGroupIsEdit] = useState(false);
  const [docIsEdit, setDocIsEdit] = useState(false);
  const [groupRawList, setGroupRawList] = useState([]);
  const [groupTbData, setGroupTbData] = useState([]);
  const [docTbData, setDocTbData] = useState([]);
  const [groupTbLoading, setGroupTbLoading] = useState(false);
  const [docTbLoading, setDocTbLoading] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [bindOpen, setBindOpen] = useState(false); // 新增绑定对话框状态
  const [groupCurRowData, setGroupCurRowData] = useState({});
  const [docCurRowData, setDocCurRowData] = useState({});
  const groupSelectedRowKeys = useMemo(
    () =>
      groupCurRowData?.RecipeGroupId ? [groupCurRowData.RecipeGroupId] : [],
    [groupCurRowData]
  );
  const docSelectedRowKeys = useMemo(
    () => (docCurRowData?.RecipeFileId ? [docCurRowData.RecipeFileId] : []),
    [docCurRowData]
  );
  const [groupForm] = Form.useForm();
  const [gc_list, setGclist] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  // 过滤后的文档列表
  const [filteredDocData, setFilteredDocData] = useState(docTbData);
  const handleGroupAddRow = () => {
    setGroupIsEdit(false);
    setGroupOpen(true);
  };
  const handleDocAddRow = () => {
    setDocIsEdit(false);
    setDocOpen(true);
  };
  const handleGroupEditRow = () => {
    setGroupIsEdit(true);
    setGroupOpen(true);
  };
  const handleDocEditRow = () => {
    setDocIsEdit(true);
    setDocOpen(true);
  };
  const handleGroupDeleteRow = () => {
    deleteRecipeGroup(groupCurRowData.RecipeGroupId).then((res) => {
      message.success("删除成功");
      getNeedRefreshData();
    });
  };
  const handleDocDeleteRow = () => {
    deleteRecipeFile(docCurRowData.RecipeFileId).then((res) => {
      message.success("删除成功");
      getDocTbData();
    });
  };
  const getNeedRefreshData = () => {
    getRawGroupList();
    getUnboundDeviceList();
  };
  const getRawGroupList = () => {
    readRecipeGroup()
      .then(({ ListData }) => {
        setGroupRawList(ListData);
      })
      .catch(() => {
        setGroupRawList([]);
      });
  };
  const getUnboundDeviceList = () => {
    readUnboundDeviceList("").then(({ ListData }) =>
      setUnboundDeviceIds(ListData.map(({ DeviceId }) => DeviceId))
    );
  };
  const getGroupTbData = () => {
    const {
      queryItem: { item3: queryRecipeTemplateId },
    } = groupForm.getFieldsValue();
    setGroupTbLoading(true);
    setTimeout(() => {
      const newTbData = groupRawList
        .filter(
          ({ DeviceTypeId }) =>
            queryDeviceTypeIds.length === 0 ||
            queryDeviceTypeIds.includes(DeviceTypeId)
        )
        .filter(
          ({ RecipeTemplateId }) =>
            queryRecipeTemplateId === undefined ||
            RecipeTemplateId === queryRecipeTemplateId
        );
      setGroupTbLoading(false);
      setGroupTbData(newTbData);
      setGroupCurRowData(newTbData?.length ? { ...newTbData[0] } : {});
    }, 300);
  };
  const getDocTbData = () => {
    setDocTbLoading(true);
    readRecipeDocList({ id: groupSelectedRowKeys[0] })
      .then(({ ListData }) => {
        setDocTbData(ListData);
        setDocCurRowData(ListData?.length ? { ...ListData[0] } : {});
      })
      .finally(() => {
        setDocTbLoading(false);
      });
  };
  const convertBase642Blob = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes]);
  };
  const handleDocExport = () => {
    const { RecipeFileId, RecipeFileName } = docCurRowData;
    exportRecipeFile({ RecipeFileId }).then(({ Data }) => {
      if (Data) {
        const blob = convertBase642Blob(Data);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = RecipeFileName;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        message.error("配方文件不存在，导出失败！");
      }
    });
  };
  const groupFormItems = [
    [
      {
        span: 4,
        label: "配方模板",
        name: ["queryItem", "item3"],
        formItem: <Select options={recipeTemplateOptions}></Select>,
      },
      {
        span: 20,
        formItem: (
          <div className={styles["rms-btn-group"]}>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<SyncOutlined />}
              onClick={getGroupTbData}
            >
              刷新
            </Button>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<PlusSquareOutlined />}
              onClick={handleGroupAddRow}
            >
              新增
            </Button>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<FormOutlined />}
              onClick={handleGroupEditRow}
              disabled={!groupSelectedRowKeys.length}
            >
              编辑
            </Button>
            <Popconfirm
              title="警告"
              description="是否删除该条数据？"
              onConfirm={handleGroupDeleteRow}
              okText="确认"
              cancelText="取消"
            >
              <Button
                variant={"outlined"}
                color={"primary"}
                size={"small"}
                icon={<DeleteOutlined />}
                disabled={!groupSelectedRowKeys.length}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ],
  ];
  const genGroupColumns = () => {
    return [
      { title: "配方组名称", dataIndex: "RecipeGroupName", width: 200 },
      { title: "创建者", dataIndex: "Creator", width: 100 },
      { title: "创建时间", dataIndex: "CreateTime", width: 200 },
      {
        title: "下发方式",
        dataIndex: "DeliveryType",
        width: 100,
        render: (text) =>
          DeliveryTypeOptions.find((item) => item.value === text).label,
      },
      {
        title: "绑定设备",
        dataIndex: "DeviceIdArray",
        render: (text) =>
          deviceList
            .filter((item) => text?.includes(item.DeviceId))
            .map((item) => item.DisplayName)
            .join(";"),
      },
    ];
  };
  const genDocColumns = () => {
    return [
      { title: "配方文件", dataIndex: "RecipeFileName", width: 300 },
      { title: "创建者", dataIndex: "Creator", width: 300 },
      { title: "上传时间", dataIndex: "UploadTime", width: 300 },
      { title: "图号", dataIndex: "FigureCode", width: 300 },
      {
        title: "过程",
        dataIndex: "ProductionStep",
        width: 300,
        render: (text) =>
          gc_list.find((item) => item.ProductionStep === text)
            ?.ProductionStepName || text,
      },
    ];
  };
  const handleGroupRowClick = (record) => {
    setGroupCurRowData({ ...record });
  };
  const handleDocRowClick = (record) => {
    setDocCurRowData({ ...record });
  };
  const handleSearch = (value) => {
    setSearchKeyword(value);

    // 如果搜索关键词为空，显示所有数据
    if (!value.trim()) {
      setFilteredDocData(docTbData);
      return;
    }

    // 对配方文件进行模糊查询
    const filteredData = docTbData.filter((item) => {
      // 可以根据需要调整搜索的字段，这里搜索文件名、图号、过程等
      // return (
      //   (item.RecipeFileName && item.RecipeFileName.toLowerCase().includes(value.toLowerCase())) ||
      //   (item.FigureCode && item.FigureCode.toLowerCase().includes(value.toLowerCase())) ||
      //   (item.ProductionStep && item.ProductionStep.toLowerCase().includes(value.toLowerCase())) ||
      //   (item.MakeVersion && item.MakeVersion.toLowerCase().includes(value.toLowerCase()))
      // );
      return (
        item.RecipeFileName &&
        item.RecipeFileName.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredDocData(filteredData);
  };
  useEffect(() => {
    handleSearch(searchKeyword);
  }, [docTbData]);
  useEffect(() => {
    getNeedRefreshData();
  }, []);
  useEffect(() => {
    getGroupTbData();
  }, [groupRawList]);
  useEffect(() => {
    const recipeTemplateOptions = recipeTemplateList.filter(
      ({ DeviceTypeId }) =>
        queryDeviceTypeIds.length === 0 ||
        queryDeviceTypeIds.includes(DeviceTypeId)
    );
    setRecipeTemplateOptions(
      recipeTemplateOptions.map(
        ({ TemplateId: value, TemplateName: label }) => ({ label, value })
      )
    );
    groupForm.setFieldValue(
      ["queryItem", "item3"],
      recipeTemplateOptions[0]?.TemplateId
    );
    getGroupTbData();
  }, [queryDeviceTypeIds]);
  useEffect(() => {
    if (groupSelectedRowKeys.length > 0) {
      getDocTbData();
    } else {
      setDocTbData([]);
      setDocCurRowData({});
    }
  }, [groupSelectedRowKeys]);

  useEffect(() => {
    GetProductionStepEnum({}).then((res) => {
      const { ListData = [] } = res;
      setGclist(ListData);
    });
  }, []);

  return (
    <div className={styles["rms-recipe-group-container"]}>
      <Title
        className={styles["rms-recipe-group"]}
        border={false}
        title={"配方组"}
        margin={`0 0 8`}
      >
        <CustomForm
          form={groupForm}
          formItems={groupFormItems}
          onValuesChange={getGroupTbData}
        ></CustomForm>
        <Table
          loading={groupTbLoading}
          rowKey={"RecipeGroupId"}
          size={"small"}
          columns={genGroupColumns()}
          scroll={{ x: "max-content", y: `calc((100vh - 210)/2 - 120)` }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: groupSelectedRowKeys,
            onSelect: (record) => {
              setGroupCurRowData({ ...record });
            },
          }}
          dataSource={groupTbData}
          onRow={(record) => ({ onClick: () => handleGroupRowClick(record) })}
          pagination={false}
        ></Table>
      </Title>
      <Title
        className={styles["rms-recipe-doc"]}
        border={false}
        title={"配方文件"}
        margin={`0 0 16`}
        right={
          <div className={styles["rms-btn-group"]}>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<CloudOutlined />}
              disabled={!docSelectedRowKeys.length}
              onClick={() => setBindOpen(true)}
            >
              绑定
            </Button>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<CloudDownloadOutlined />}
              disabled={!docSelectedRowKeys.length}
              onClick={handleDocExport}
            >
              导出
            </Button>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<PlusSquareOutlined />}
              onClick={handleDocAddRow}
            >
              新增
            </Button>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<FormOutlined />}
              onClick={handleDocEditRow}
              disabled={!docSelectedRowKeys.length}
              // disabled={true}
            >
              编辑
            </Button>
            <Popconfirm
              title="警告"
              description="是否删除该条数据？"
              onConfirm={handleDocDeleteRow}
              okText="确认"
              cancelText="取消"
            >
              <Button
                variant={"outlined"}
                color={"primary"}
                size={"small"}
                icon={<DeleteOutlined />}
                // disabled={!docSelectedRowKeys.length}
                disabled={true}
              >
                删除
              </Button>
            </Popconfirm>
            <Button
              variant={"outlined"}
              color={"primary"}
              size={"small"}
              icon={<EyeOutlined />}
              disabled={!docSelectedRowKeys.length}
              onClick={() => setPreviewOpen(true)}
            >
              预览
            </Button>
            <Button
              variant={"solid"}
              color={"primary"}
              size={"small"}
              icon={<DownloadOutlined />}
              // disabled={!docSelectedRowKeys.length}
              disabled={true}
              onClick={() => setDeliveryOpen(true)}
            >
              下发
            </Button>
          </div>
        }
      >
        <Flex vertical gap={10}>
          <Input
            placeholder="请输入关键词搜索配方文件"
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Table
            loading={docTbLoading}
            rowKey={"RecipeFileId"}
            size={"small"}
            columns={genDocColumns()}
            scroll={{ x: "max-content", y: `calc((100vh - 210)/2 - 80)` }}
            rowSelection={{
              type: "radio",
              selectedRowKeys: docSelectedRowKeys,
              onSelect: (record) => {
                setDocCurRowData({ ...record });
              },
            }}
            dataSource={filteredDocData}
            onRow={(record) => ({ onClick: () => handleDocRowClick(record) })}
            pagination={false}
          />
        </Flex>
      </Title>
      <GroupModal
        isEdit={groupIsEdit}
        open={groupOpen}
        setOpen={setGroupOpen}
        refresh={getNeedRefreshData}
        row={groupCurRowData}
        DeliveryTypeOptions={DeliveryTypeOptions}
        deviceTypeList={deviceTypeList}
        unboundDeviceIds={unboundDeviceIds}
        getUnboundDeviceList={getUnboundDeviceList}
        deviceList={deviceList}
        recipeTemplateList={recipeTemplateList}
      />
      <DocModal
        isEdit={docIsEdit}
        open={docOpen}
        setOpen={setDocOpen}
        refresh={getDocTbData}
        groupRow={groupCurRowData}
        docRow={docCurRowData}
      />
      <DeliveryModal
        open={deliveryOpen}
        setOpen={setDeliveryOpen}
        groupRow={groupCurRowData}
        docRow={docCurRowData}
        deviceList={deviceList}
        DeliveryTypeOptions={DeliveryTypeOptions}
      />
      <PreviewModal
        open={previewOpen}
        setOpen={setPreviewOpen}
        docRow={docCurRowData}
      />
      <BindModal
        gc_list={gc_list}
        refresh={getNeedRefreshData}
        open={bindOpen}
        setOpen={setBindOpen}
        docRow={docCurRowData}
      />
    </div>
  );
};
export default RecipeGroup;
