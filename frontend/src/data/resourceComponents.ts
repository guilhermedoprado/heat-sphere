// src/data/resourceComponents.ts
import { lazy } from "react";
import type { ComponentType } from "react";

export const RESOURCE_COMPONENTS: Record<string, ComponentType> = {
    "solver:cylinder-cross-flow-1": lazy(
        () => import("../features/solvers/CylinderFlow")
            .then(m => ({ default: m.CylinderFlow }))
    ),
    "solver:flat-plate-churchill-ozoe-1": lazy(
        () => import("../features/solvers/FlatPlateChurchillOzoe")
            .then(m => ({ default: m.FlatPlateChurchillOzoe }))
    ),
    "solver:shell-tube-rating-1": lazy(
        () => import("../features/solvers/ShellTubeRating")
            .then(m => ({ default: m.ShellTubeRating }))
    ),
};
