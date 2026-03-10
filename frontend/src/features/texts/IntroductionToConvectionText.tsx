import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";

export function IntroductionToConvectionText() {
  const markdown = `# Introduction to Convection
Convection is the transfer of heat through the movement of fluids (liquids or gases). It occurs when a fluid is heated, causing it to expand, decrease in density, and rise, while cooler fluid sinks to take its place. This creates a circulation pattern that facilitates heat transfer.

## Key Dimensionless Numbers
- **Reynolds Number (Re)**: Indicates whether the flow is laminar or turbulent. It is defined as Re = (ρ * v * L) / μ, where ρ is the fluid density, v is the velocity, L is a characteristic length, and μ is the dynamic viscosity.
- **Prandtl Number (Pr)**: Represents the ratio of momentum diffusivity to thermal diffusivity. It is defined as Pr = ν / α, where ν is the kinematic viscosity and α is the thermal diffusivity.
- **Nusselt Number (Nu)**: Represents the ratio of convective to conductive heat transfer across a boundary. It is defined as Nu = h * L / k, where h is the convective heat transfer coefficient, L is a characteristic length, and k is the thermal conductivity of the fluid.`;

    return <MarkdownEditor value={markdown} onChange={() => {}} />;}

export default IntroductionToConvectionText;