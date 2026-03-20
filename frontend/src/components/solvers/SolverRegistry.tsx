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
import type { ComponentType } from "react";
import { FlatPlateChurchillOzoe } from "../../features/solvers/FlatPlateChurchillOzoe";
import { CylinderFlow } from "../../features/solvers/CylinderFlow";
import { SolverEq719 } from "./incropera-eq/7.19";
import { SolverEq720 } from "./incropera-eq/7.20";
import { SolverEq721 } from "./incropera-eq/7.21";
import { SolverEq722 } from "./incropera-eq/7.22";
import { SolverEq723 } from "./incropera-eq/7.23";
import { SolverEq724 } from "./incropera-eq/7.24";
import { SolverEq729 } from "./incropera-eq/7.29";
import { SolverEq730 } from "./incropera-eq/7.30";
import { SolverEq732 } from "./incropera-eq/7.32";
import { SolverEq734 } from "./incropera-eq/7.34";
import { SolverEq735 } from "./incropera-eq/7.35";
import { SolverEq736 } from "./incropera-eq/7.36";
import { SolverEq738 } from "./incropera-eq/7.38";
import { SolverEq740 } from "./incropera-eq/7.40";
import { SolverEq752 } from "./incropera-eq/7.52";
import { SolverEq753 } from "./incropera-eq/7.53";
import { SolverEq754 } from "./incropera-eq/7.54";
import { SolverEq756 } from "./incropera-eq/7.56";
import { SolverEq757 } from "./incropera-eq/7.57";
import { SolverEq760 } from "./incropera-eq/7.60";
import { SolverEq764 } from "./incropera-eq/7.64";
import { SolverEq770_772 } from "./incropera-eq/7.70-7.72";
import { SolverEq773_775 } from "./incropera-eq/7.73-7.75";
import { SolverEq776_778 } from "./incropera-eq/7.76-7.78";
import { SolverEq779_781 } from "./incropera-eq/7.79-7.81";

export type SolverComponentProps = {
    initialParams?: Record<string, unknown>;
    onParamsChange?: (p: Record<string, unknown>) => void;
    needsScaffolding?: boolean;
};

// Referência ao componente (não à instância)
export const SolverRegistry: Record<string, ComponentType<SolverComponentProps>> = {
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
    // Incropera — Tabela 7.9 (escoamento externo); \7.xx
    "7.19": SolverEq719,
    "7.20": SolverEq720,
    "7.21": SolverEq721,
    "7.22": SolverEq722,
    "7.23": SolverEq723,
    "7.24": SolverEq724,
    "7.29": SolverEq729,
    "7.30": SolverEq730,
    "7.32": SolverEq732,
    "7.34": SolverEq734,
    "7.35": SolverEq735,
    "7.36": SolverEq736,
    "7.38": SolverEq738,
    "7.40": SolverEq740,
    "7.52": SolverEq752,
    "7.53": SolverEq753,
    "7.54": SolverEq754,
    "7.56": SolverEq756,
    "7.57": SolverEq757,
    "7.60": SolverEq760,
    "7.64": SolverEq764,
    "7.70-7.72": SolverEq770_772,
    "7.73-7.75": SolverEq773_775,
    "7.76-7.78": SolverEq776_778,
    "7.79-7.81": SolverEq779_781,
    // Compatibilidade com notas antigas (números da tabela mudaram)
    "7.44": SolverEq752,
    "7.63": SolverEq764,
};
