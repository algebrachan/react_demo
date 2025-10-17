import { useEffect, useState } from "react";
import { Tabs } from "antd";
import styles from "./style/index.module.less";
import DeviceType from "@/pages/Manage/RMS/Config/component/DeviceType/index.jsx";
import DeviceLedger from "@/pages/Manage/RMS/Config/component/DeviceLedger/index.jsx";
import DeviceGroup from "@/pages/Manage/RMS/Config/component/DeviceGroup/index.jsx";
import {
  readDeviceGroup,
  readDeviceType,
  getAreas,
  readDevice,
} from "@/apis/rms.js";
import { MyBreadcrumb } from "../../../../components/CommonCard";

const RMSConfig = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [deviceTypeList, setDeviceTypeList] = useState([]);
  const [deviceGroupList, setDeviceGroupList] = useState([]);
  const getDeviceGroupList = () => {
    return readDeviceGroup({ pageInfo: { index: 1, pageSize: 1000 } }).then(
      ({ ListData }) => {
        setDeviceGroupList(
          ListData.map((item, index) => {
            const Id = `${item.DeviceTypeId}-${item.DeviceGroupId}`;
            return { ...item, Index: index + 1, Id, key: Id };
          })
        );
      }
    );
  };
  const getDeviceTypeList = () => {
    return readDeviceType({ pageInfo: { index: 1, pageSize: 1000 } }).then(
      ({ ListData }) => {
        setDeviceTypeList(
          ListData.map((item, index) => ({
            ...item,
            Index: index + 1,
            key: item.Id,
          }))
        );
      }
    );
  };
  const getAreasList = () => {
    getAreas()
      .then(({ ListData }) => {
        setAreaList(ListData);
      })
      .catch(() => {
        setAreaList([]);
      });
  };
  const getDeviceList = () => {
    readDevice({ pageInfo: { index: 1, pageSize: 1000 } }).then(
      ({ ListData }) => {
        setDeviceList(
          ListData.map((item, index) => ({ ...item, Index: index + 1 }))
        );
      }
    );
  };
  useEffect(() => {
    getDeviceGroupList();
    getDeviceTypeList();
    getDeviceList();
    getAreasList();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "配置管理"]} />
      <Tabs
        defaultActiveKey="1"
        className={styles["rms-config"]}
        style={{marginTop:16}}
        items={[
          {
            label: "设备台账",
            key: "1",
            children: (
              <DeviceLedger
                deviceList={deviceList}
                getDeviceList={getDeviceList}
                areaList={areaList}
                deviceTypeList={deviceTypeList}
                deviceGroupList={deviceGroupList}
              >
                设备台账
              </DeviceLedger>
            ),
          },
          {
            label: "设备类型",
            key: "2",
            children: (
              <DeviceType
                deviceTypeList={deviceTypeList}
                getDeviceTypeList={getDeviceTypeList}
              >
                设备类型
              </DeviceType>
            ),
          },
          {
            label: "设备分组",
            key: "3",
            children: (
              <DeviceGroup
                deviceTypeList={deviceTypeList}
                deviceGroupList={deviceGroupList}
                getDeviceGroupList={getDeviceGroupList}
              >
                设备分组
              </DeviceGroup>
            ),
          },
        ]}
      />
    </div>
  );
};
export default RMSConfig;
