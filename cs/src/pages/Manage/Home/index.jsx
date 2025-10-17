import React, { useEffect, useRef, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../components/CommonCard";
import { Col, Flex, Image, Row } from "antd";
import "./home.less";
import { useDispatch, useSelector } from "react-redux";
import { setCommonParam } from "../mngSlice";
import dayjs from "dayjs";
import { timeFormat } from "../../../utils/string";
import ImgDev1 from "../../../assets/mng/dev1.png";
import ImgDev2 from "../../../assets/mng/dev2.png";
import ImgDev3 from "../../../assets/mng/dev3.png";
import ImgDev4 from "../../../assets/mng/dev4.png";
import ImgDev5 from "../../../assets/mng/dev5.png";
import {
  RealTimeProcessModal,
  RealTimeProcessModal1,
  RealTimeProcessModal2,
} from "./HomeModal";

const WorkShop = () => {
  const dispatch = useDispatch();
  const cur_work = useSelector((state) => state.mng.workshop["cur_work"]);
  const checkWork = (val) => {
    dispatch(
      setCommonParam({ param_name: "workshop", param_val: { cur_work: val } })
    );
  };
  const ItemLeft = ({ name, num, handleClick, style }) => {
    return (
      <div
        className={name === cur_work ? "item1_checked" : "item1"}
        onClick={() => handleClick(name)}
        style={style}
      >
        <div className="label">{name}</div>
        <div className="num">{num}</div>
      </div>
    );
  };
  const ItemRight = ({ name, num, handleClick, style }) => {
    return (
      <div
        className={name === cur_work ? "item2_checked" : "item2"}
        onClick={() => handleClick(name)}
        style={style}
      >
        <div className="num">{num}</div>
        <div className="label">{name}</div>
      </div>
    );
  };
  return (
    <GeneralCard name="创盛长晶车间总览">
      <Flex justify="center" style={{ padding: 10 }}>
        <div className="home_chejian">
          <ItemLeft
            name="原料"
            num="01"
            handleClick={checkWork}
            style={{ top: 58, left: 0 }}
          />
          <ItemLeft
            name="熔融"
            num="02"
            handleClick={checkWork}
            style={{ top: 148, left: 0 }}
          />
          <ItemLeft
            name="研磨切割"
            num="03"
            handleClick={checkWork}
            style={{ top: 238, left: 0 }}
          />
          <ItemLeft
            name="酸洗"
            num="04"
            handleClick={checkWork}
            style={{ top: 328, left: 0 }}
          />
          <ItemRight
            name="喷钡"
            num="05"
            handleClick={checkWork}
            style={{ top: 328, right: 0 }}
          />
          <ItemRight
            name="锅口打磨"
            num="06"
            handleClick={checkWork}
            style={{ top: 238, right: 0 }}
          />
          <ItemRight
            name="包装"
            num="07"
            handleClick={checkWork}
            style={{ top: 148, right: 0 }}
          />
          <ItemRight
            name="客诉"
            num="08"
            handleClick={checkWork}
            style={{ top: 58, right: 0 }}
          />
        </div>
      </Flex>
    </GeneralCard>
  );
};

const Time = () => {
  const getNowTime = () => {
    let now = dayjs();
    return now.format(timeFormat);
  };
  const [time, setTime] = useState(getNowTime());
  const timer = useRef(-1);
  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(getNowTime());
    }, 500);
    return () => {
      clearInterval(timer.current);
    };
  }, []);
  return (
    <Flex justify="end" style={{ fontSize: 16 }}>
      时间: {time}
    </Flex>
  );
};

const Dev = () => {
  const timer = useRef(-1);
  const [dev_count, setDevCount] = useState({
    设备总量: 4,
    运行总量: 4,
    维修总量: 0,
    待机总量: 0,
    停机总量: 0,
  });
  const [dev_list, setDevList] = useState([]);

  const [rtp_modal, setRtpModal] = useState(false);
  const [rtp_modal1, setRtpModal1] = useState(false);
  const [rtp_modal2, setRtpModal2] = useState(false);
  const [rtp_data, setRtpData] = useState({});
  const getImgae = (stat) => {
    let img = "";
    switch (stat) {
      case "设备":
        img = ImgDev1;
        break;
      case "运行":
        img = ImgDev2;
        break;
      case "维修":
        img = ImgDev3;
        break;
      case "待机":
        img = ImgDev4;
        break;
      case "停机":
        img = ImgDev5;
        break;
      default:
        break;
    }
    return img;
  };
  const reqeustData = () => {};
  const getDevStatClass = (stat) => {
    let cls = "bg_purple";
    switch (stat) {
      case "运行":
        cls = "bg_blue";
        break;
      case "维修":
        cls = "bg_orange";
        break;
      case "待机":
        cls = "bg_yellow";
        break;
      case "停机":
        cls = "bg_grey";
        break;
      default:
        break;
    }

    return cls;
  };

  // 运行状态
  const DevItem = ({ data = {} }) => {
    const {
      company = "融熔机",
      设备号 = "11#",
      设备状态 = "运行",
      图号 = "",
      批号 = "",
      原料 = "",
      引弧时间 = "",
    } = data;
    const getCls = () => {
      let cls = "dev_item1";
      switch (设备状态) {
        case "运行":
          cls = "dev_item1";
          break;
        case "维修":
          cls = "dev_item2";
          break;
        case "待机":
          cls = "dev_item3";
          break;
        case "停机":
          cls = "dev_item4";
          break;
        default:
          break;
      }
      return cls;
    };
    const handleRealtime = () => {
      setRtpData(data);
      setRtpModal(true);
    };
    return (
      <div className={getCls()}>
        <div className="head">
          <div className="title">{`${company}  ${设备号}`}</div>
          <div className="stat">{设备状态}</div>
        </div>
        <Flex vertical style={{ padding: 10 }} gap={12}>
          <div>
            <span>图号:</span>
            <span style={{ marginLeft: 10 }}>{图号}</span>
          </div>
          <div>
            <span>批号:</span>
            <span style={{ marginLeft: 10 }}>{批号}</span>
          </div>
          <div>
            <span>原料:</span>
            <span style={{ marginLeft: 10 }}>{原料}</span>
          </div>
          <div>
            <span>引弧时间:</span>
            <span style={{ marginLeft: 10 }}>{引弧时间}</span>
          </div>
          <Flex
            justify="space-between"
            style={{ cursor: "pointer" }}
            onClick={handleRealtime}
          >
            <div>查看实时加工情况</div>
            <div>{`>>>`}</div>
          </Flex>
          <Flex justify="space-between" style={{ cursor: "pointer" }}>
            <div>查看历史报警记录</div>
            <div>{`>>>`}</div>
          </Flex>
          <Flex justify="space-between" style={{ cursor: "pointer" }}>
            <div>查看历史维保记录</div>
            <div>{`>>>`}</div>
          </Flex>
        </Flex>
      </div>
    );
  };
  const DevItem1 = ({ data = {} }) => {
    const {
      company = "屏通",
      设备号 = "11#",
      设备状态 = "运行",
      图号 = "",
      批号 = "",
    } = data;
    const getCls = () => {
      let cls = "dev_item1";
      switch (设备状态) {
        case "运行":
          cls = "dev_item1";
          break;
        case "维修":
          cls = "dev_item2";
          break;
        case "待机":
          cls = "dev_item3";
          break;
        case "停机":
          cls = "dev_item4";
          break;
        default:
          break;
      }
      return cls;
    };
    const handleRealtime = () => {
      setRtpData(data);
      setRtpModal1(true);
    };
    return (
      <div className={getCls()}>
        <div className="head">
          <div className="title">{`${company}  ${设备号}`}</div>
          <div className="stat">{设备状态}</div>
        </div>
        <Flex vertical style={{ padding: 10 }} gap={12}>
          <div>
            <span>图号:</span>
            <span style={{ marginLeft: 10 }}>{图号}</span>
          </div>
          <div>
            <span>批号:</span>
            <span style={{ marginLeft: 10 }}>{批号}</span>
          </div>
          <Flex
            justify="space-between"
            style={{ cursor: "pointer" }}
            onClick={handleRealtime}
          >
            <div>查看实时加工情况</div>
            <div>{`>>>`}</div>
          </Flex>
          <Flex justify="space-between" style={{ cursor: "pointer" }}>
            <div>查看历史报警记录</div>
            <div>{`>>>`}</div>
          </Flex>
          <Flex justify="space-between" style={{ cursor: "pointer" }}>
            <div>查看历史维保记录</div>
            <div>{`>>>`}</div>
          </Flex>
        </Flex>
      </div>
    );
  };
  const DevItem2 = ({ data = {} }) => {
    const {
      company = "屏通",
      设备号 = "11#",
      设备状态 = "运行",
      图号 = "",
      批号 = "",
    } = data;
    const getCls = () => {
      let cls = "dev_item1";
      switch (设备状态) {
        case "运行":
          cls = "dev_item1";
          break;
        case "维修":
          cls = "dev_item2";
          break;
        case "待机":
          cls = "dev_item3";
          break;
        case "停机":
          cls = "dev_item4";
          break;
        default:
          break;
      }
      return cls;
    };
    const handleRealtime = () => {
      setRtpData(data);
      setRtpModal2(true);
    };
    return (
      <div className={getCls()}>
        <div className="head">
          <div className="title">{`${company}  ${设备号}`}</div>
          <div className="stat">{设备状态}</div>
        </div>
        <Flex vertical style={{ padding: 10 }} gap={12}>
          <div>
            <span>图号:</span>
            <span style={{ marginLeft: 10 }}>{图号}</span>
          </div>
          <div>
            <span>批号:</span>
            <span style={{ marginLeft: 10 }}>{批号}</span>
          </div>
          <Flex
            justify="space-between"
            style={{ cursor: "pointer" }}
            onClick={handleRealtime}
          >
            <div>查看实时加工情况</div>
            <div>{`>>>`}</div>
          </Flex>
          <Flex justify="space-between" style={{ cursor: "pointer" }}>
            <div>查看历史报警记录</div>
            <div>{`>>>`}</div>
          </Flex>
          <Flex justify="space-between" style={{ cursor: "pointer" }}>
            <div>查看历史维保记录</div>
            <div>{`>>>`}</div>
          </Flex>
        </Flex>
      </div>
    );
  };

  useEffect(() => {
    reqeustData();
    timer.current = setInterval(() => {
      reqeustData();
    }, 5000);
    return () => {
      clearInterval(timer.current);
    };
  }, []);
  return (
    <div className="home_dev">
      <Flex justify="space-between" style={{ marginBottom: 20 }}>
        {["设备", "运行", "维修", "待机", "停机"].map((item, _) => (
          <div className={`dev_total_item ${getDevStatClass(item)}`} key={_}>
            <Image src={getImgae(item)} width={40} preview={false} />
            <div className="label">{item}总量:</div>
            <div className="num">{dev_count[`${item}总量`]}</div>
          </div>
        ))}
      </Flex>
      <GeneralCard name="设备列表">
        <Flex
          wrap
          gap={30}
          style={{
            height: 700,
            padding: 20,
            width: "100%",
            overflowY: "auto",
          }}
        >
          {dev_list.map((e, _) => (
            <DevItem data={e} key={_} />
          ))}
          <DevItem1
            data={{ company: "研磨机", 设备号: "1#", 设备状态: "待机" }}
          />
          <DevItem2
            data={{ company: "切割机", 设备号: "3#", 设备状态: "待机" }}
          />
        </Flex>
      </GeneralCard>
      <RealTimeProcessModal
        data={rtp_data}
        open={rtp_modal}
        onCancel={() => setRtpModal(false)}
      />
      <RealTimeProcessModal1
        data={rtp_data}
        open={rtp_modal1}
        onCancel={() => setRtpModal1(false)}
      />
      <RealTimeProcessModal2
        data={rtp_data}
        open={rtp_modal2}
        onCancel={() => setRtpModal2(false)}
      />
    </div>
  );
};

function Home() {
  return (
    <div>
      <MyBreadcrumb items={["创盛长晶智能集控系统", "创盛长晶车间总览"]} />
      <div className="content_root">
        <Row gutter={[10, 10]}>
          <Col
            span={6}
            style={{
              display: "flex",
              rowGap: 16,
              flexDirection: "column",
            }}
          >
            <WorkShop />
            <GeneralCard name="产量统计点线图">
              <div style={{ height: 320 }}></div>
            </GeneralCard>
          </Col>
          <Col span={18}>
            <Time />
            <Dev />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
