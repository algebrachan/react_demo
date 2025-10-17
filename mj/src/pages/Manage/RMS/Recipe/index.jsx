import { Form, Select, Tabs } from "antd";
import styles from "./style/index.module.less";
import RecipeOverview from "@/pages/Manage/RMS/Recipe/component/Overview/index.jsx";
import RecipeTemplate from "@/pages/Manage/RMS/Recipe/component/Template/index.jsx";
import RecipeGroup from "@/pages/Manage/RMS/Recipe/component/Group/index.jsx";
import DeviceLedger from "@/pages/Manage/RMS/Config/component/DeviceLedger/index.jsx";
import DeviceType from "@/pages/Manage/RMS/Config/component/DeviceType/index.jsx";
import DeviceGroup from "@/pages/Manage/RMS/Config/component/DeviceGroup/index.jsx";
import RMSAlarm from "@/pages/Manage/RMS/Alarm/index.jsx";
import RMSLog from "@/pages/Manage/RMS/Log/index.jsx";
import {
  readDevice,
  readDeviceGroup,
  readDeviceType,
  readRecipeTemplate,
  getAreas,
} from "@/apis/rms.js";
import { useEffect, useState } from "react";
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import MultiSelect from "@/pages/Manage/RMS/component/MultiSelect.jsx";
import { MyBreadcrumb } from "../../../../components/CommonCard";

const RMSRecipe = () => {
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("1");
  const [deviceGroupList, setDeviceGroupList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceTypeList, setDeviceTypeList] = useState([]);
  const [queryDeviceTypeIds, setQueryDeviceTypeIds] = useState([]);
  const [recipeTemplateList, setRecipeTemplateList] = useState([]);
  const formItems = [
    [
      {
        span: 6,
        label: "设备类型",
        name: "DeviceTypeIds",
        formItem: (
          <MultiSelect
            showCheckAll
            options={deviceTypeList.map(({ Id, DisplayName }) => ({
              label: DisplayName,
              value: Id,
            }))}
          ></MultiSelect>
        ),
      },
    ],
  ];
  const getDeviceGroupList = () => {
    return readDeviceGroup()
      .then(({ ListData }) => {
        setDeviceGroupList(
          ListData.map((item, index) => {
            const Id = `${item.DeviceTypeId}-${item.DeviceGroupId}`;
            return { ...item, Index: index + 1, Id, key: Id };
          })
        );
      })
      .catch(() => {
        setDeviceGroupList([]);
      });
  };
  const getDeviceTypeList = () => {
    return readDeviceType()
      .then(({ ListData }) => {
        setDeviceTypeList(
          ListData.map((item, index) => ({
            ...item,
            Index: index + 1,
            key: item.Id,
          }))
        );
      })
      .catch(() => {
        setDeviceTypeList([]);
      });
  };
  const getRecipeTemplateList = () => {
    return readRecipeTemplate()
      .then(({ ListData }) => {
        setRecipeTemplateList(ListData);
      })
      .catch(() => {
        setRecipeTemplateList([]);
      });
  };
  const getAreasList = () => {
    return getAreas()
      .then(({ ListData }) => {
        setAreaList(ListData);
      })
      .catch(() => {
        setAreaList([]);
      });
  };
  const getDeviceList = () => {
    return readDevice()
      .then(({ ListData }) => {
        setDeviceList(
          ListData.map((item, index) => ({ ...item, Index: index + 1 }))
        );
      })
      .catch(() => {
        setDeviceList([]);
      });
  };
  const handleQueryFormValuesChange = (changedValues, allValues) => {
    const { DeviceTypeIds } = changedValues;
    setQueryDeviceTypeIds(DeviceTypeIds);
  };
  useEffect(() => {
    getAreasList();
    getDeviceList();
    getDeviceTypeList();
    getRecipeTemplateList();
    getDeviceGroupList();
  }, []);
  useEffect(() => {
    if (deviceTypeList.length) {
      const initialValues = [deviceTypeList[0].Id];
      form.setFieldValue(["DeviceTypeIds"], initialValues);
      setQueryDeviceTypeIds(initialValues);
    }
  }, [deviceTypeList]);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "配方管理"]} />
      <div style={{ marginTop: 16 }}>
        <CustomForm
          className={styles["rms-query"]}
          form={form}
          formItems={formItems}
          onValuesChange={handleQueryFormValuesChange}
        ></CustomForm>
        <Tabs
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          className={styles["rms-recipe"]}
          items={[
            {
              label: "配方总览",
              key: "1",
              children: (
                <RecipeOverview
                  setActiveKey={setActiveKey}
                  isActive={activeKey === "1"}
                  areaList={areaList}
                  deviceTypeList={deviceTypeList}
                  queryDeviceTypeIds={queryDeviceTypeIds}
                />
              ),
            },
            {
              label: "配方模板",
              key: "2",
              children: (
                <RecipeTemplate
                  recipeTemplateList={recipeTemplateList}
                  getRecipeTemplateList={getRecipeTemplateList}
                  deviceTypeList={deviceTypeList}
                  queryDeviceTypeIds={queryDeviceTypeIds}
                />
              ),
            },
            {
              label: "配方组",
              key: "3",
              children: (
                <RecipeGroup
                  recipeTemplateList={recipeTemplateList}
                  deviceList={deviceList}
                  deviceTypeList={deviceTypeList}
                  queryDeviceTypeIds={queryDeviceTypeIds}
                />
              ),
            },
            {
              label: "报警",
              key: "4",
              children: <RMSAlarm queryDeviceTypeIds={queryDeviceTypeIds} />,
            },
            {
              label: "日志",
              key: "5",
              children: <RMSLog queryDeviceTypeIds={queryDeviceTypeIds} />,
            },
            // {
            //   label: '设备台账',
            //   key: '4',
            //   children: (
            //     <DeviceLedger
            //       deviceList={deviceList}
            //       getDeviceList={getDeviceList}
            //       areaList={areaList}
            //       deviceTypeList={deviceTypeList}
            //       deviceGroupList={deviceGroupList}
            //     >设备台账</DeviceLedger>
            //   )
            // },
            // {
            //   label: '设备类型',
            //   key: '5',
            //   children: (
            //     <DeviceType
            //       deviceTypeList={deviceTypeList}
            //       getDeviceTypeList={getDeviceTypeList}
            //     >设备类型</DeviceType>
            //   )
            // },
            // {
            //   label: '设备分组',
            //   key: '6',
            //   children: (
            //     <DeviceGroup
            //       deviceTypeList={deviceTypeList}
            //       deviceGroupList={deviceGroupList}
            //       getDeviceGroupList={getDeviceGroupList}
            //     >设备分组</DeviceGroup>
            //   )
            // },
          ]}
        />
      </div>
    </div>
  );
};
export default RMSRecipe;
