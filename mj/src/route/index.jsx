import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Manage from "../pages/Manage";
import Home from "../pages/Manage/Home";
import SpcAnalysis from "../pages/Manage/Spc/SpcAnalysis";
import Alarm from "../pages/Manage/Spc/Alarm";
import DefectiveMaintain from "../pages/Manage/Spc/DefectiveMaintain";
import RuleMaintain from "../pages/Manage/Spc/RuleMaintain";
import ControlConfig from "../pages/Manage/Spc/ControlConfig";
import ErrHandle from "../pages/Manage/Spc/ErrHandle";
import SingleProcessAnalysis from "../pages/Manage/Progress/SingleProcessAnalysis";
import MultiProcessAnalysis from "../pages/Manage/Progress/MultiProcessAnalysis";
import ProgressCurrent from "../pages/Manage/Progress/PorgressCurrent";
import VacuumPressure from "../pages/Manage/Progress/VacuumPressure";
import WaterOutletTemp from "../pages/Manage/Progress/WaterOutletTemp";
import CorrelationAnalysis from "../pages/Manage/Progress/CorrelationAnalysis";
import CategoryAnalysis from "../pages/Manage/Progress/CategoryAnalysis";
import DispatchWork from "../pages/Manage/DispatchWork";
import WorkshopWorkOrder from "../pages/Manage/DispatchWork/WorkshopWorkOrder";
import QualityTrace from "../pages/Manage/Progress/QualityTrace";
import Strategy from "../pages/Manage/Spc/Alarm/Strategy";
import Equipment from "../pages/Manage/Equipment";
import QualityAnls from "../pages/Manage/QualityAnls";
import FdcAnalysis from "../pages/Manage/FDC/FdcAnalysis/index1.jsx";
// import FdcAnalysis from "../pages/Manage/FDC/FdcAnalysis";
import ErrDetails from "../pages/Manage/FDC/ErrDetails";
import ErrRules from "../pages/Manage/FDC/ErrRules";
import DevList from "../pages/Manage/FDC/DevList";
import ParamList from "../pages/Manage/FDC/ParamList";
import DellWith from "../pages/Manage/FDC/ErrDetails/DellWith";
import AuthMngSys from "../pages/AuthMngSys";
import Err404 from "../pages/AuthMngSys/Error/Err404";
import SpecificMaintain from "../pages/Manage/Spc/SpecificMaintain";
import MeltingMonitorInput from "../pages/Manage/MeltingMonitorInput";
import MeltMonitorRecord from "../pages/Manage/MeltingMonitorInput/Record";
import MultProcessAnls from "../pages/Manage/FDC/MultProcessAnls";
import TpmInput from "../pages/Manage/InputModule/TpmInput";
import Ocap from "../pages/Manage/Spc/ErrHandle/Ocap";
import TpmDetailsInput from "../pages/Manage/InputModule/TpmDetailsInput";
import Activation from "../pages/AuthMngSys/Activation";
import MaterialQuery from "../pages/Manage/QueryModule/MaterialQuery";
import MeltingQuery from "../pages/Manage/QueryModule/MeltingQuery";
import ProduceQuery from "../pages/Manage/QueryModule/ProduceQuery";
import IqcQuery from "../pages/Manage/QueryModule/IqcQuery";
import InspectionRecord from "../pages/Manage/QueryModule/InspectionRecord";
import BatchComparison from "../pages/Manage/QueryModule/BatchComparison";
import IncomingDataInput from "../pages/Manage/InputModule/IncomingDataInput";
import SpcPeriodAnalysis from "../pages/Manage/Spc/SpcPeriodAnalysis";
import LargeScreen from "../pages/LargeScreen";
import SpcFileUpload from "../pages/Manage/Spc/SpcFileUpload";
import SpcLailiaoAnalysis from "../pages/Manage/Spc/SpcLailiaoAnalysis";
import SpcShouruAnalysis from "../pages/Manage/Spc/SpcShouruAnalysis";
import CtrLineMng from "../pages/Manage/Spc/CtrLIneMng";
import ProcessRecordData from "../pages/Manage/ProcessRecordData";
import ProductionCondition from "../pages/Manage/QueryModule/ProductionCondition";
import MeltProcessParam from "../pages/Manage/Progress/MeltProcessParam";
import RMSRecipe from "../pages/Manage/RMS/Recipe";
import RMSConfig from "../pages/Manage/RMS/Config";
import HongKaoLengQei from "../pages/Manage/RMS/HongKaoLengQei";
import QingXi from "../pages/Manage/RMS/QingXi";
import ShiYingSha from "../pages/Manage/RMS/ShiYingSha";
import ShiYingShaAdd from "../pages/Manage/RMS/ShiYingSha/Add";
import ShiYingShaEdit from "../pages/Manage/RMS/ShiYingSha/Edit";
import SandManagement from "../pages/Manage/InputModule/SandManagement.jsx";
import CrucibleFigureCodeManagement from "../pages/Manage/RMS/Crucible/CrucibleFigureCodeManagement";
import CrucibleModelManagement from "../pages/Manage/RMS/Crucible/CrucibleModelManagement";
import CrucibleMoldManagement from "../pages/Manage/RMS/Crucible/CrucibleMoldManagement";
import MeltMachinePlanManagement from "../pages/Demo/MeltMachinePlanManagement.jsx";
import MeltingScheme from "../pages/Manage/RMS/MeltingScheme/index.jsx";
import MeltSchemeEditPage from "../pages/Manage/RMS/MeltingScheme/edit.jsx";
import ConditionEditPage from "../pages/Manage/RMS/ConditionTable/edit.jsx";
import ConditionTable from "../pages/Manage/RMS/ConditionTable/index.jsx";
import DataVisualization from "../pages/Manage/Spc/DataVisualization";

function getRouteItem(element, path, children) {
  return {
    element,
    path,
    children,
  };
}

export const routes = [
  getRouteItem(<Navigate to="/mng" />, ""),
  getRouteItem(<Login />, "/login"),
  getRouteItem(<Manage />, "/mng", [
    getRouteItem(<Err404 />, "404"),
    getRouteItem(<AuthMngSys />, "auth_mng_sys"),
    getRouteItem(<Home />, "home"),
    getRouteItem(<SpcAnalysis />, "spc"),
    getRouteItem(<DataVisualization />, "spc_data_visualization"),
    getRouteItem(<SpcFileUpload />, "spc_file_upload"),
    getRouteItem(<SpcPeriodAnalysis />, "period_spc"),
    getRouteItem(<SpcLailiaoAnalysis />, "lailiao_spc"),
    getRouteItem(<SpcShouruAnalysis />, "srjc_spc"),
    getRouteItem(<CtrLineMng />, "spc_ctrl_line"),

    getRouteItem(<Alarm />, "alarm"),
    getRouteItem(<Strategy />, "alarm/strategy"),
    getRouteItem(<SingleProcessAnalysis />, "sigle_process_analysis"),
    getRouteItem(<MultiProcessAnalysis />, "multi_process_analysis"),
    getRouteItem(<DefectiveMaintain />, "defective_maintain"),
    getRouteItem(<RuleMaintain />, "rule_maintain"),
    getRouteItem(<SpecificMaintain />, "specific_maintain"),
    getRouteItem(<ControlConfig />, "control_config"),
    getRouteItem(<ErrHandle />, "err_handle"),
    getRouteItem(<Ocap />, "err_handle_ocap"),
    getRouteItem(<ProgressCurrent />, "progress_current"),
    getRouteItem(<VacuumPressure />, "vacuum_pressure"),
    getRouteItem(<WaterOutletTemp />, "water_out_temp"),
    getRouteItem(<CorrelationAnalysis />, "correlation_analysis"),
    getRouteItem(<CategoryAnalysis />, "category_analysis"),
    getRouteItem(<DispatchWork />, "dispatch_work"),
    getRouteItem(<QualityTrace />, "quality_trace"),
    getRouteItem(<FdcAnalysis />, "fdc"),
    getRouteItem(<MultProcessAnls />, "fdc_mult"),
    getRouteItem(<ErrDetails />, "fdc_err_details"),
    getRouteItem(<DellWith />, "fdc_err_details/dellwith"),
    getRouteItem(<ErrRules />, "fdc_err_rules"),
    getRouteItem(<DevList />, "fdc_dev_list"),
    getRouteItem(<ParamList />, "fdc_param_list"),
    getRouteItem(<Equipment />, "equipment"),
    getRouteItem(<MeltProcessParam />, "melt_process_param"),
    getRouteItem(<QualityAnls />, "quality_anls"),
    getRouteItem(<MaterialQuery />, "material_query"),
    getRouteItem(<MeltingQuery />, "melting_query"),
    getRouteItem(<ProduceQuery />, "produce_query"),
    getRouteItem(<IqcQuery />, "iqc_query"),
    getRouteItem(<InspectionRecord />, "inspection_record"),
    getRouteItem(<BatchComparison />, "batch_comparison"),
    getRouteItem(<ProcessRecordData />, "process_record_data"),
    getRouteItem(<ProductionCondition />, "production_condition"),
    getRouteItem(<SandManagement />, "sand_management_system"),
    getRouteItem(<RMSRecipe />, "rms/recipe"),
    getRouteItem(<RMSConfig />, "rms/config"),
    // 添加Crucible相关路由
    getRouteItem(<CrucibleFigureCodeManagement />, "rms/crucible/figure-code"),
    getRouteItem(<CrucibleModelManagement />, "rms/crucible/model"),
    getRouteItem(<CrucibleMoldManagement />, "rms/crucible/mold"),
    getRouteItem(<HongKaoLengQei />, "rms/crucible/colding_recipe"),
    getRouteItem(<QingXi />, "rms/crucible/washing_recipe"),
    getRouteItem(<ShiYingSha />, "rms/crucible/quartz_sand_recipe_management"),
    getRouteItem(
      <ShiYingShaAdd />,
      "rms/crucible/quartz_sand_recipe_management/add"
    ),
    getRouteItem(
      <ShiYingShaEdit />,
      "rms/crucible/quartz_sand_recipe_management/edit/:id"
    ),
    getRouteItem(<MeltingScheme />, "rms/melting_scheme"),
    getRouteItem(<MeltSchemeEditPage />, "rms/melting_scheme/edit"),
    getRouteItem(<ConditionTable />, "rms/condition_table"),
    getRouteItem(<ConditionEditPage />, "rms/condition_table/edit"),
    // getRouteItem()
  ]),
  getRouteItem(<WorkshopWorkOrder />, "workshop"),
  getRouteItem(<MeltingMonitorInput />, "melting_monitor_input"),
  getRouteItem(<MeltMonitorRecord />, "melting_monitor_record"),
  getRouteItem(<TpmInput />, "input_module_tpm"),
  getRouteItem(<TpmDetailsInput />, "input_module_detail_tpm"),
  getRouteItem(<IncomingDataInput />, "input_module_incoming_data"),
  getRouteItem(<Activation />, "activation"),
  getRouteItem(<LargeScreen />, "large_screen"),
  getRouteItem(<MeltMachinePlanManagement />, "test"),
];
