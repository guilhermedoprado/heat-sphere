// src/data/resourceComponents.ts
import { lazy } from "react";
import type { ComponentType } from "react";

export const RESOURCE_COMPONENTS: Record<string, ComponentType> = {
    "calculation:cylinder-cross-flow-1": lazy(
        () => import("../features/external-flow/calculations/CylinderFlow")
            .then(m => ({ default: m.CylinderFlow }))
    ),
};
