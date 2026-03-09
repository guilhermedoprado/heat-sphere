# Cap. 6 — Introdução à Convecção
> Incropera — Fundamentos de Transferência de Calor e Massa, 6ª Ed.

---

## 1. Lei de Newton do Resfriamento

Fluxo de calor local e taxa total:

> $$q''_s = h(T_s - T_\infty)$$

> $$q = \bar{h} A_s (T_s - T_\infty)$$

Coeficiente médio sobre comprimento $L$:

> $$\bar{h} = \dfrac{1}{L}\int_0^L h_x \, dx$$

---

## 2. Camadas Limite

### 2.1 Camada Limite de Velocidade (CLV)

Espessura $\delta$: valor de $y$ onde $u = 0{,}99 \, u_\infty$

Tensão de cisalhamento na parede e coeficiente de atrito:

> $$\tau_s = \mu \left.\dfrac{\partial u}{\partial y}\right|_{y=0}$$

> $$C_{f,x} = \dfrac{\tau_s}{\rho u_\infty^2 / 2}$$

### 2.2 Camada Limite Térmica (CLT)

Espessura $\delta_t$: valor de $y$ onde $\dfrac{T_s - T}{T_s - T_\infty} = 0{,}99$

Coeficiente local de convecção (Lei de Fourier na parede):

> $$h_x = \dfrac{-k_f \left.\dfrac{\partial T}{\partial y}\right|_{y=0}}{T_s - T_\infty}$$

### 2.3 Camada Limite de Concentração (CLC)

Espessura $\delta_c$: valor de $y$ onde $\dfrac{C_{A,s} - C_A}{C_{A,s} - C_{A,\infty}} = 0{,}99$

Lei de Fick na parede e coeficiente de transferência de massa:

> $$N''_A = -D_{AB} \left.\dfrac{\partial C_A}{\partial y}\right|_{y=0}$$

> $$h_{m,x} = \dfrac{-D_{AB} \left.\dfrac{\partial C_A}{\partial y}\right|_{y=0}}{C_{A,s} - C_{A,\infty}}$$

---

## 3. Equações da Camada Limite (2D, incompressível, estacionário)

| Equação | Expressão |
|---|---|
| Continuidade | $\dfrac{\partial u}{\partial x} + \dfrac{\partial v}{\partial y} = 0$ |
| Momentum (x) | $u\dfrac{\partial u}{\partial x} + v\dfrac{\partial u}{\partial y} = -\dfrac{1}{\rho}\dfrac{dP}{dx} + \nu\dfrac{\partial^2 u}{\partial y^2}$ |
| Energia | $u\dfrac{\partial T}{\partial x} + v\dfrac{\partial T}{\partial y} = \alpha\dfrac{\partial^2 T}{\partial y^2}$ |
| Espécie A | $u\dfrac{\partial C_A}{\partial x} + v\dfrac{\partial C_A}{\partial y} = D_{AB}\dfrac{\partial^2 C_A}{\partial y^2}$ |

---

## 4. Variáveis Adimensionais (Similaridade)

> $$x^* = \dfrac{x}{L}, \quad y^* = \dfrac{y}{L}, \quad u^* = \dfrac{u}{V}, \quad v^* = \dfrac{v}{V}$$

> $$T^* = \dfrac{T - T_s}{T_\infty - T_s}, \qquad C^*_A = \dfrac{C_A - C_{A,s}}{C_{A,\infty} - C_{A,s}}$$

---

## 5. Parâmetros Adimensionais

| Parâmetro | Definição | Interpretação |
|---|---|---|
| Reynolds | $Re_L = \dfrac{VL}{\nu}$ | Inercial / Viscoso |
| Prandtl | $Pr = \dfrac{\nu}{\alpha} = \dfrac{c_p \mu}{k}$ | Difusividade mom. / térmica |
| Schmidt | $Sc = \dfrac{\nu}{D_{AB}}$ | Difusividade mom. / mássica |
| Lewis | $Le = \dfrac{\alpha}{D_{AB}} = \dfrac{Sc}{Pr}$ | Difusividade térmica / mássica |
| Nusselt | $Nu_L = \dfrac{\bar{h}L}{k_f}$ | Gradiente de $T$ adimensional |
| Sherwood | $Sh_L = \dfrac{\bar{h}_m L}{D_{AB}}$ | Gradiente de $C_A$ adimensional |
| Grashof | $Gr_L = \dfrac{g\beta(T_s - T_\infty)L^3}{\nu^2}$ | Empuxo / Viscoso |

> Temperatura de filme: $T_f = \dfrac{T_s + T_\infty}{2}$

---

## 6. Formas Funcionais das Soluções

Convecção forçada (transferência de calor):

> $$Nu_L = f(Re_L,\, Pr)$$

Convecção forçada (transferência de massa):

> $$Sh_L = f(Re_L,\, Sc)$$

Relação entre espessuras de camada limite:

> $$\dfrac{\delta_t}{\delta} \approx Pr^{-1/3} \quad (Pr \gtrsim 0{,}6)$$

> $$\dfrac{\delta_c}{\delta} \approx Sc^{-1/3}, \qquad \dfrac{\delta_t}{\delta_c} = Le^{1/3}$$

---

## 7. Número de Stanton e Analogias

Número de Stanton (calor):

> $$St = \dfrac{h}{\rho u_\infty c_p} = \dfrac{Nu}{Re_L \cdot Pr}$$

Analogia de Reynolds (válida para $Pr = 1$):

> $$St_x = \dfrac{C_{f,x}}{2}$$

Analogia de Chilton–Colburn ($0{,}6 \lesssim Pr \lesssim 60$):

> $$j_H = St \cdot Pr^{2/3} = \dfrac{C_{f}}{2}$$

> $$j_m = St_m \cdot Sc^{2/3} = \dfrac{C_{f}}{2}$$

Como $j_H = j_m$, a relação entre coeficientes é:

> $$\dfrac{h}{h_m} = \rho c_p Le^{2/3}$$

---

## 8. Reynolds Crítico — Transição (Placa Plana)

> $$Re_{x,c} \approx 5 \times 10^5$$
