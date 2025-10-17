import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Tpm from "../pages/Tpm/index.jsx";
import Manage from "../pages/Manage";
import Home from "../pages/Manage/Home";
import SpcAnalysis from "../pages/Manage/Spc/SpcAnalysis";
import Alarm from "../pages/Manage/Spc/Alarm";
import RuleMaintain from "../pages/Manage/Spc/RuleMaintain";
import ControlConfig from "../pages/Manage/Spc/ControlConfig";
import ErrHandle from "../pages/Manage/Spc/ErrHandle";
import FdcAnalysis from "../pages/Manage/FDC/FdcAnalysis";
import ErrDetails from "../pages/Manage/FDC/ErrDetails";
import ErrRules from "../pages/Manage/FDC/ErrRules";
import DevList from "../pages/Manage/FDC/DevList";
import ParamList from "../pages/Manage/FDC/ParamList";
import DellWith from "../pages/Manage/FDC/ErrDetails/DellWith";
import MultProcessAnls from "../pages/Manage/FDC/MultProcessAnls";
import MultProcessAnls1 from "../pages/Manage/FDC/MultProcessAnls1";
import AuthMngSys from "../pages/AuthMngSys";
import Err404 from "../pages/AuthMngSys/Error/Err404";
import QualityDataUpload from "../pages/Manage/InputModule/QualityDataUpload";
import AxisSet from "../pages/Manage/FDC/AxisSet";
import ReviewNoProduct from "../pages/Manage/QMS/ReviewNoProduct";
import NoProductBpm from "../pages/Manage/QMS/ReviewNoProduct/Bpm/index.jsx";
import Ocap from "../pages/Manage/QMS/ReviewNoProduct/Ocap";
import LOP from "../pages/Manage/QMS/LOP";
import ChangeMng from "../pages/Manage/QMS/ChangeMng";
import CustomerComplaint from "../pages/Manage/QMS/CustomerComplaint";
import ParameterSettings from "../pages/Manage/QMS/CustomerComplaint/ParameterSettings";
import QualityQuery from "../pages/Manage/QueryModule/QualityQuery";
import Specification from "../pages/Manage/Spc/Specification";
import Dcc from "../pages/Manage/QMS/Dcc";
import MeasureTools from "../pages/Manage/QMS/MeasureTools/index.jsx";
import StandardMng from "../pages/Manage/QMS/StandardMng";
import InspectionReport from "../pages/Manage/QMS/QualityInspection/InspectionReport";
import ProcessInspection from "../pages/Manage/QMS/QualityInspection/ProcessInspection";
import ProductInspection from "../pages/Manage/QMS/QualityInspection/ProductInspection";
import ProcessInspectionZG from "../pages/Manage/QMS/QualityInspection/ProcessInspection_zg";
import ShipmentInspection from "../pages/Manage/QMS/QualityInspection/ShipmentInspection";
import FenCengShenHe from "../pages/Manage/QMS/FenCengShenHe";
import ChengBenZhiLiang from "../pages/Manage/QMS/ChengBenZhiLiang";
import WeiWaiSongJian from "../pages/Manage/QMS/WeiWaiSongJian";
import FenCengShenHeBuFuHeXiang from "../pages/Manage/QMS/FenCengShenHe/NonConformityPage";
import FenCengShenHeAudit from "../pages/Manage/QMS/FenCengShenHe/AuditForm";
import FenCengShenHeAudit_auto from "../pages/Manage/QMS/FenCengShenHe/AuditForm_auto.jsx";
import FlowDemo from "../components/CommonFlow/demo.jsx";
import SchemeManagement from "@/pages/Manage/QMS/AuditManagement/SchemeManagement/index.jsx";
import ProcessAlarmData from "../pages/Manage/SpcDispatch/ProcessAlarmData/index.jsx";
import ChangeBpm from "../pages/Manage/QMS/ChangeMng/Bpm/index.jsx";
import SystemAudit from "../pages/Manage/QMS/AuditManagement/SystemAudit/index.jsx";
import TaskModel from "../pages/Manage/SpcDispatch/TaskModel/index.jsx";
import ProjectQuality from "@/pages/Manage/QMS/ProjectQuality/index.jsx";
import DccBpm from "../pages/Manage/QMS/Dcc/Bpm/index.jsx";
import TaskAssignment from "../pages/Manage/SpcDispatch/TaskAssignment/index.jsx";
import QualityInspectionBoard from "../pages/Manage/QMS/QualityInspectionBoard";
import AlarmDetails from "../pages/Manage/FDC/AlarmDetails/index.jsx";
import DocLedger from "../pages/Manage/QMS/Dcc/DocLedger/index.jsx";
import GpB01Report from "../pages/Manage/QMS/guanlipingshen/gp_B01_report";
import GpB01 from "../pages/Manage/QMS/guanlipingshen/gp_B01";
import GpE01 from "../pages/Manage/QMS/guanlipingshen/gp_E01";
import GpMain from "../pages/Manage/QMS/guanlipingshen/gp_main";
import SpcPaiGong from "../pages/Manage/QMS/spc_paigong";
import ZhiLiangYuJing from "../pages/Manage/QMS/zhiliangyujing";
import TongJiFenXi from "@/pages/Manage/QMS/TongJiFenXi";
import ProductAudit from "@/pages/Manage/QMS/AuditManagement/ProductAudit/index.jsx";
import QualityTrace from "@/pages/Manage/QMS/QualityTrace/index.jsx";
import GuoChangShenHe from "@/pages/Manage/QMS/GuoChangShenHe/gp_main.jsx";
import XiangGuanXinFenXi from "@/pages/Manage/XiangGuanXinFenXi/XiangGuanXinFenXi/index.jsx";
import Employee from "@/pages/SystemConfig/Employee/index.jsx";
import Dept from "@/pages/SystemConfig/Dept/index.jsx";
import DispatchConfig from "../pages/Manage/SpcDispatch/Config/index.jsx";
import QMS_Mobile from "@/pages/QMS_Mobile/index.jsx";

function getRouteItem(element, path, children) {
  return {
    element,
    path,
    children,
  };
}

// 产品审核- 新增检验标准
export const create_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/create_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 查询检验标准
export const read_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/read_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 修改验标准
export const update_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/update_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 删除验标准
export const del_inspection_standard = (param, then, error) => {
  const url = `/api/system_audit_router/del_inspection_standard`;
  postJson(url, param, then, error);
};
// 产品审核- 新增检验记录
export const create_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/create_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 查询检验记录
export const read_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/read_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 修改验记录
export const update_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/update_inspection_record`;
  postJson(url, param, then, error);
};
// 产品审核- 删除验记录
export const del_inspection_record = (param, then, error) => {
  const url = `/api/system_audit_router/del_inspection_record`;
  postJson(url, param, then, error);
};
export const routes = [
  getRouteItem(<Navigate to="/mng" />, ""),
  getRouteItem(<Login />, "/login"),
  getRouteItem(<QMS_Mobile />, "/qms_mobile"),
  getRouteItem(<Manage />, "/mng", [
    getRouteItem(<Err404 />, "404"),
    getRouteItem(<AuthMngSys />, "auth_mng_sys"),
    getRouteItem(<Home />, "home"),
    getRouteItem(<SpcAnalysis />, "spc_analysis"),
    getRouteItem(<Specification />, "spc_analysis_spec"),
    getRouteItem(<Alarm />, "alarm"),
    getRouteItem(<RuleMaintain />, "rule_maintain"),
    getRouteItem(<ControlConfig />, "control_config"),
    getRouteItem(<ErrHandle />, "err_handle"),
    getRouteItem(<FdcAnalysis />, "fdc"),
    getRouteItem(<MultProcessAnls />, "fdc_mult"),
    getRouteItem(<MultProcessAnls1 />, "fdc_mult_axis"),
    getRouteItem(<ErrDetails />, "fdc_err_details"),
    getRouteItem(<AlarmDetails />, "fdc_alarm_details"),
    getRouteItem(<DellWith />, "fdc_err_details/dellwith"),
    getRouteItem(<ErrRules />, "fdc_err_rules"),
    getRouteItem(<DevList />, "fdc_dev_list"),
    getRouteItem(<ParamList />, "fdc_param_list"),
    getRouteItem(<AxisSet />, "axis_set"),
    getRouteItem(<ReviewNoProduct />, "qms_reviewnoproduct"),
    // getRouteItem(<Ocap />, "qms_reviewnoproduct/ocap"),
    getRouteItem(<NoProductBpm />, "qms_reviewnoproduct/bpm"),
    getRouteItem(<InspectionReport />, "qms_inspection_report"),
    getRouteItem(<ProcessInspection />, "qms_process_inspection"),
    getRouteItem(<ProcessInspectionZG />, "qms_process_inspection_zg"),
    getRouteItem(<ProductInspection />, "qms_product_inspection"),
    getRouteItem(<ShipmentInspection />, "qms_shipment_inspection"),
    getRouteItem(<FenCengShenHe />, "qms_fen_ceng_shen_he"),
    getRouteItem(<FenCengShenHeBuFuHeXiang />, "qms_bu_fu_he_xiang"),
    getRouteItem(<FenCengShenHeAudit />, "qms_fen_ceng_shen_he_audit"),
    getRouteItem(<QualityDataUpload />, "quality_data_upload"),
    getRouteItem(
      <FenCengShenHeAudit_auto />,
      "qms_fen_ceng_shen_he_audit_auto"
    ),
    getRouteItem(<ChengBenZhiLiang />, "qms_cost_quality"),
    getRouteItem(<WeiWaiSongJian />, "qms_wei_wai_song_jian"),
    getRouteItem(<Ocap />, "qms_reviewnoproduct/ocap"),
    getRouteItem(<ChangeMng />, "qms_change"),
    getRouteItem(<ChangeBpm />, "qms_change/bpm"),
    getRouteItem(<MeasureTools />, "qms_measure_tools"),
    getRouteItem(<StandardMng />, "qms_standard_mng"),
    getRouteItem(<CustomerComplaint />, "qms_customer_complaint"),
    getRouteItem(<ParameterSettings />, "qms_customer_complaint_settings"),
    getRouteItem(<Dcc />, "qms_dcc"),
    getRouteItem(<DocLedger />, "qms_dcc_ledger"),
    getRouteItem(<DccBpm />, "qms_dcc/bpm"),
    getRouteItem(<SchemeManagement />, "qms_scheme_management"),
    getRouteItem(<SystemAudit />, "qms_system_audit"),
    getRouteItem(<ProductAudit />, "qms_product_audit"),
    getRouteItem(<ProjectQuality />, "qms_project_quality"),
    getRouteItem(<QualityQuery />, "quality_query"),
    getRouteItem(<LOP />, "lop"),
    getRouteItem(<ProcessAlarmData />, "spc_dispatch_process_alarm_data"),
    getRouteItem(<TaskModel />, "spc_dispatch_task_model"),
    getRouteItem(<TaskAssignment />, "spc_dispatch_task_assignment"),
    getRouteItem(<QualityInspectionBoard />, "qms_quality_inspection_board"),
    getRouteItem(<DispatchConfig />, "spc_dispatch_config"),
    getRouteItem(<GpB01Report />, "qms_guanlipingshen/gp_b01_report"),
    getRouteItem(<GpB01 />, "qms_guanlipingshen/gp_b01"),
    getRouteItem(<GpE01 />, "qms_guanlipingshen/gp_e01"),
    getRouteItem(<GpMain />, "qms_guanlipingshen/gp_main"),
    getRouteItem(<SpcPaiGong />, "spc_dispatch_qms"),
    getRouteItem(<TongJiFenXi />, "qms_fen_ceng_shen_he_tongji"),
    getRouteItem(<ZhiLiangYuJing />, "qms_zhiliangyujing"),
    getRouteItem(<QualityTrace />, "qms_quality_trace"),
    getRouteItem(<GuoChangShenHe />, "qms_guochengshenhe"),
    getRouteItem(<XiangGuanXinFenXi />, "xiang_guan_xi"),
    getRouteItem(<Employee />, "system_employee"),
    getRouteItem(<Dept />, "system_dept"),
  ]),
  getRouteItem(<Tpm />, "/tpm"),
  getRouteItem(<FlowDemo />, "test"),
];
