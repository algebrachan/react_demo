import Title from "@/pages/Manage/RMS/component/Title.jsx";
import styles from "../../style/index.module.less";
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import { Button, Descriptions, Form, Input, Spin, Table } from "antd";
import {
  ExclamationCircleOutlined,
  HistoryOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDeviceRealAlarmList,
  getDeviceRealtimeList,
} from "@/apis/rms.js";
import DetailModal from "./DetailModal.jsx";

const RecipeOverview = ({
  isActive,
  areaList,
  queryDeviceTypeIds,
  setActiveKey,
}) => {
  const timeoutRef = useRef(null);
  const displayOverviewListRef = useRef([]);
  const isFirstRef = useRef(true);
  const [form] = Form.useForm();
  const [queryValue, setQueryValue] = useState(undefined);
  const [detailOpen, setDetailOpen] = useState(false);
  const [overviewLoad, setOverviewLoad] = useState(false);
  const [alarmTbLoad, setAlarmTbLoad] = useState(false);
  const [curOverviewActiveItem, setCurOverviewActiveItem] = useState({});
  const [alarmTbData, setAlarmTbData] = useState([]);
  const [overviewList, setOverviewList] = useState([]);
  const [displayOverviewList, setDisplayOverviewList] = useState([]);
  const getOverviewList = (isInterval) => {
    !isInterval && setOverviewLoad(true);
    getDeviceRealtimeList()
      .then(({ ListData }) => {
        setOverviewList(ListData);
      })
      .finally(() => {
        setOverviewLoad(false);
      });
  };
  const getRealAlarmList = (isInterval) => {
    !isInterval && setAlarmTbLoad(true);
    getDeviceRealAlarmList({ deviceTypeIds: queryDeviceTypeIds })
      .then(({ ListData }) => {
        setAlarmTbData(
          ListData.map((item, index) => ({ ...item, Index: index + 1 }))
        );
      })
      .finally(() => {
        setAlarmTbLoad(false);
      });
  };
  const getData = (isInterval = false) => {
    getOverviewList(isInterval);
    getRealAlarmList(isInterval);
  };
  const isArraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };
  const interval = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      getData(true);
      interval();
    }, 10000);
  };
  const formItems = [
    [
      {
        label: "搜索",
        name: "filter",
        span: 6,
        formItem: (
          <Input
            onChange={(e) => setQueryValue(e.target.value)}
            placeholder={"请输入设备名称或设定配方"}
          />
        ),
      },
      {
        span: 18,
        formItem: (
          <div className={styles["rms-btn-group"]}>
            <div className={styles["overview-color-desc"]}>
              <div
                className={`${styles["overview-color-desc__item"]} ${styles["online"]}`}
              >
                在线
              </div>
              <div
                className={`${styles["overview-color-desc__item"]} ${styles["offline"]}`}
              >
                离线
              </div>
              <div
                className={`${styles["overview-color-desc__item"]} ${styles["checked"]}`}
              >
                选中
              </div>
            </div>
            <Button
              variant={"outlined"}
              color={"primary"}
              icon={<SyncOutlined />}
              onClick={() => {
                setCurOverviewActiveItem(displayOverviewList[0] ?? {});
                getData();
                interval();
              }}
            >
              刷新
            </Button>
            <Button
              variant={"outlined"}
              color={"primary"}
              icon={<ExclamationCircleOutlined />}
              disabled={
                curOverviewActiveItem.DeviceId === undefined ||
                !curOverviewActiveItem.SetRecipeTemplate
              }
              onClick={() => setDetailOpen(true)}
            >
              配方详情
            </Button>
          </div>
        ),
      },
    ],
  ];
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (isActive && !detailOpen) {
      if (isFirstRef.current) {
        isFirstRef.current = false;
        return;
      }
      getData();
      interval();
    }
  }, [isActive, detailOpen, queryDeviceTypeIds]);
  useEffect(() => {
    if (overviewList.length > 0) {
      const newDisplayOverviewList = overviewList.filter((item) => {
        const isInDeviceType =
          queryDeviceTypeIds.length > 0
            ? queryDeviceTypeIds.includes(item.DeviceTypeId)
            : true;
        const DisplayName = item.DisplayName ?? "";
        const SetRecipeGroup = item.SetRecipeGroup ?? "";
        return (
          isInDeviceType &&
          (queryValue === undefined ||
            queryValue === "" ||
            ~DisplayName.indexOf(queryValue) ||
            ~SetRecipeGroup.indexOf(queryValue))
        );
      });
      setDisplayOverviewList(newDisplayOverviewList);
    }
  }, [queryDeviceTypeIds, overviewList, queryValue]);
  useEffect(() => {
    if (displayOverviewList.length > 0) {
      const newDisplayIds = displayOverviewList.map((item) => item.DeviceId);
      const oldDisplayIds = displayOverviewListRef.current.map(
        (item) => item.DeviceId
      );
      const isEqual = isArraysAreEqual(newDisplayIds, oldDisplayIds);
      setCurOverviewActiveItem((prev) => {
        return prev.DeviceId === undefined || !isEqual
          ? displayOverviewList[0] ?? {}
          : prev;
      });
    }
    displayOverviewListRef.current = displayOverviewList;
  }, [displayOverviewList]);
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <>
      <Title
        style={{
          display: detailOpen ? "block" : "none",
          marginBottom: 16,
          height: `calc(100% - 16)`,
        }}
        margin={0}
        border={false}
        title={"配方详情"}
      >
        <DetailModal
          areaList={areaList}
          open={detailOpen}
          setOpen={setDetailOpen}
          row={curOverviewActiveItem}
        />
      </Title>
      <div
        className={styles["rms-recipe-overview__container"]}
        style={{ display: detailOpen ? "none" : "flex" }}
      >
        <Title
          style={{ margin: `0` }}
          margin={0}
          className={styles["rms-recipe-overview"]}
          border={false}
          title={"配方总览"}
          contentStyle={{ padding: `0`, overflow: "hidden" }}
        >
          <CustomForm
            form={form}
            formItems={formItems}
            style={{ padding: "0 16px", marginBottom: "8px" }}
          ></CustomForm>
          <Spin spinning={overviewLoad}>
            <div className={styles["rms-recipe-overview__list"]}>
              {displayOverviewList.map((item, index) => {
                const isActiveClassName =
                  item.DeviceId === curOverviewActiveItem.DeviceId
                    ? styles["rms-recipe-overview__item--active"]
                    : "";
                const isDisabledClassName =
                  item.DeviceStatus === false
                    ? styles["rms-recipe-overview__item--disabled"]
                    : "";
                const descriptionItems = [
                  {
                    key: "3",
                    label: "当前配方",
                    children: item.CurrentRecipeGroup,
                  },
                  {
                    key: "4",
                    label: "设定配方组",
                    children: item.SetRecipeGroup,
                  },
                ];
                return (
                  <Descriptions
                    key={item.DeviceId}
                    className={`${styles["rms-recipe-overview__item"]} ${isActiveClassName} ${isDisabledClassName}`}
                    onClick={() => setCurOverviewActiveItem(item)}
                    column={1}
                    size={"small"}
                    title={item.DisplayName}
                    items={descriptionItems}
                  />
                );
              })}
            </div>
          </Spin>
        </Title>
        <Title
          margin={0}
          className={styles["rms-recipe-realtime-alarm"]}
          border={false}
          title={"实时报警"}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
            }}
          >
            <Button
              variant={"outlined"}
              color={"primary"}
              icon={<HistoryOutlined />}
              onClick={() => {
                setActiveKey("4");
              }}
            >
              历史记录
            </Button>
          </div>
          <Table
            size="small"
            loading={alarmTbLoad}
            rowKey={"Index"}
            columns={[
              { title: "序号", dataIndex: "Index", width: 50 },
              { title: "设备名称", dataIndex: "DeviceName", width: 120 },
              { title: "报警时间", dataIndex: "CheckTime", width: 150 },
              {
                title: "报警内容",
                dataIndex: "CheckContent",
                render: (text, record) =>
                  record.IsVariableSameRecipe ? "" : text,
              },
            ]}
            dataSource={alarmTbData}
            pagination={false}
            scroll={{ x: "max-content", y: `calc(100vh - 352)` }}
          ></Table>
        </Title>
      </div>
    </>
  );
};
export default RecipeOverview;
