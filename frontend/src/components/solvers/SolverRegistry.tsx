import { CrossFlowEnergyBalance } from "./CrossFlowEnergyBalance";
import { CylinderCrossFlow } from "./CylinderCrossFlow";
import { FinHeatTransferCaseA } from "./FinHeatTransferCaseA";
import { FinHeatTransferCaseB } from "./FinHeatTransferCaseB";
import { FinHeatTransferCaseC } from "./FinHeatTransferCaseC";
import { FinHeatTransferCaseD } from "./FinHeatTransferCaseD";
import { FinParameters } from "./FinParameters";
import { FinTempDistCaseA } from "./FinTempDistCaseA";
import { FinTempDistCaseB } from "./FinTempDistCaseB";
import { FinTempDistCaseC } from "./FinTempDistCaseC";
import { FinTempDistCaseD } from "./FinTempDistCaseD";
import { FlatFinEfficiency } from "./FlatFinEfficiency";
import { HeatTransferRate } from "./HeatTransferRate"; // ou ConvectionSolver, dependendo do nome do seu arquivo
import { MeanTemperature } from "./MeanTemperature";
import { MeanTemperatureConstTs } from "./MeanTemperatureTsConstant";
import { ThetaDefinition } from "./ThetaDefinition";
import { LinearInterpolation } from "./LinearInterpolation";
import { FlatPlateChurchillOzoe } from "../../features/solvers/FlatPlateChurchillOzoe";
import { CylinderFlow } from "../../features/solvers/CylinderFlow";

// Agora guarda a referência da função do componente (React.FC) e não a instância em si
export const SolverRegistry: Record<string, React.FC<any>> = {
    "linear-interpolation": LinearInterpolation,
    "heat-transfer-rate": HeatTransferRate,
    "churchill-ozoe": FlatPlateChurchillOzoe,
    "churchill-bernstein-1": CylinderCrossFlow,
    "churchill-bernstein-2": CylinderFlow,
    "internal-flow-avg-temp-q-const": MeanTemperature,
    "internal-flow-avg-temp-ts-const": MeanTemperatureConstTs,
    "cross-flow-energy-balance-ts-const": CrossFlowEnergyBalance,
    "fin-parameters": FinParameters,
    "fin-excess-temp": ThetaDefinition,
    "fin-heat-transfer-case-b": FinHeatTransferCaseB,
    "fin-heat-transfer-case-a": FinHeatTransferCaseA,
    "fin-heat-transfer-case-c": FinHeatTransferCaseC,
    "fin-heat-transfer-case-d": FinHeatTransferCaseD,
    "fin-temp-dist-case-b": FinTempDistCaseB,
    "fin-temp-dist-case-a": FinTempDistCaseA,
    "fin-temp-dist-case-c": FinTempDistCaseC,
    "fin-temp-dist-case-d": FinTempDistCaseD,
    "fin-rect-profile-efficiency": FlatFinEfficiency,
};
