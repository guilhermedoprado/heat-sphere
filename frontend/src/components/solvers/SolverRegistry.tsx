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

// Agora guarda a referência da função do componente (React.FC) e não a instância em si
export const SolverRegistry: Record<string, React.FC<any>> = {
    "transf-calor": HeatTransferRate,
    "corr-cilindro-cruzado": CylinderCrossFlow,
    "temp-media-const-q": MeanTemperature,
    "temp-media-const-ts": MeanTemperatureConstTs,
    "bal-energia-cruzado": CrossFlowEnergyBalance,
    "parametros-parede-aleta": FinParameters,
    "transf-aleta-caso-b": FinHeatTransferCaseB,
    "transf-aleta-caso-a": FinHeatTransferCaseA,
    "transf-aleta-caso-c": FinHeatTransferCaseC,
    "transf-aleta-caso-d": FinHeatTransferCaseD,
    "dist-temp-aleta-caso-b": FinTempDistCaseB,
    "dist-temp-aleta-caso-a": FinTempDistCaseA,
    "dist-temp-aleta-caso-c": FinTempDistCaseC,
    "dist-temp-aleta-caso-d": FinTempDistCaseD,
    "def-theta": ThetaDefinition,
    "efic-aleta": FlatFinEfficiency,
};
