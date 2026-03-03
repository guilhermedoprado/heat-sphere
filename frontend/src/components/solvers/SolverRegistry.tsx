import { HeatTransferRate } from "./HeatTransferRate"; // ou ConvectionSolver, dependendo do nome do seu arquivo

// Agora guarda a referência da função do componente (React.FC) e não a instância em si
export const SolverRegistry: Record<string, React.FC<any>> = {
    "heat-transfer-rate": HeatTransferRate,
};
