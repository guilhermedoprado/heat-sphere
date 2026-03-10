# Cap. 8 — Escoamento Interno
> Incropera — Fundamentos de Transferência de Calor e Massa, 6ª Ed.

---

## 1. Parâmetros Fundamentais

Reynolds para tubo circular e diâmetro hidráulico:

> $$Re_D = \dfrac{\rho u_m D}{\mu} = \dfrac{4 \dot{m}}{\pi D \mu}$$

> $$D_h = \dfrac{4 A_c}{P}$$

| Regime | Critério |
|---|---|
| Laminar | $Re_D < 2300$ |
| Transição | $2300 \leq Re_D \leq 10^4$ |
| Turbulento | $Re_D > 10^4$ |

---

## 2. Comprimentos de Entrada

| Tipo | Laminar | Turbulento |
|---|---|---|
| Hidrodinâmico | $x_{fd,h}/D \approx 0{,}05 \, Re_D$ | $10 \lesssim x_{fd,h}/D \lesssim 60$ |
| Térmico | $x_{fd,t}/D \approx 0{,}05 \, Re_D \, Pr$ | $10 \lesssim x_{fd,t}/D \lesssim 60$ |

---

## 3. Escoamento Laminar — Plenamente Desenvolvido

Perfil de velocidade (tubo circular):

> $$u(r) = 2 u_m \left[1 - \left(\dfrac{r}{r_o}\right)^2\right]$$

Fator de atrito de Darcy–Weisbach e queda de pressão:

> $$f = \dfrac{64}{Re_D}$$

> $$\Delta p = f \dfrac{L}{D} \dfrac{\rho u_m^2}{2}$$

Nusselt plenamente desenvolvido:

| Condição de contorno | $Nu_D$ |
|---|---|
| Fluxo uniforme $q''_s = \text{cte}$ | $4{,}364$ |
| Temperatura uniforme $T_s = \text{cte}$ | $3{,}658$ |

---

## 4. Entrada Combinada — Laminar (Sieder–Tate / Hausen)

Correlação de entrada combinada (Sieder–Tate):

> $$\overline{Nu}_D = 1{,}86 \left(\dfrac{Re_D \, Pr}{L/D}\right)^{1/3} \left(\dfrac{\mu}{\mu_s}\right)^{0{,}14}$$

> Válido: $0{,}48 < Pr < 16700$, $\; \left(Re_D Pr / (L/D)\right)^{1/3} (\mu/\mu_s)^{0{,}14} \geq 2$

---

## 5. Escoamento Turbulento — Correlações de Nusselt

Dittus–Boelter ($Re_D > 10^4$, $\; 0{,}6 \leq Pr \leq 160$, $\; L/D > 10$):

> $$Nu_D = 0{,}023 \, Re_D^{4/5} \, Pr^n$$

> $n = 0{,}4$ (aquecimento $T_s > T_m$); $\;\; n = 0{,}3$ (resfriamento $T_s < T_m$)

Gnielinski ($3000 \leq Re_D \leq 5 \times 10^6$, $\; 0{,}5 \leq Pr \leq 2000$):

> $$Nu_D = \dfrac{(f/8)(Re_D - 1000)\,Pr}{1 + 12{,}7\,(f/8)^{1/2}\,(Pr^{2/3} - 1)}$$

Fator de atrito de Petukhov (usar com Gnielinski):

> $$f = (0{,}790 \ln Re_D - 1{,}64)^{-2}$$

---

## 6. Balanço de Energia

Taxa de transferência de calor total:

> $$q = \dot{m} \, c_p \, (T_{m,o} - T_{m,i})$$

Fluxo local na superfície:

> $$q''_s = h \, (T_s - T_m)$$

Temperatura média local — fluxo uniforme ($q''_s = \text{cte}$):

> $$T_m(x) = T_{m,i} + \dfrac{q''_s P}{\dot{m} c_p} \, x$$

---

## 7. Temperatura ao Longo do Tubo

Para $T_s = \text{cte}$ (temperatura de parede uniforme):

> $$\dfrac{T_s - T_m(x)}{T_s - T_{m,i}} = \exp\!\left(-\dfrac{P \bar{h} \, x}{\dot{m} c_p}\right)$$

> $$\dfrac{T_s - T_{m,o}}{T_s - T_{m,i}} = \exp\!\left(-\dfrac{P \bar{h} L}{\dot{m} c_p}\right) = \exp(-NTU)$$

onde $NTU = \dfrac{\bar{h} A_s}{\dot{m} c_p}$

Diferença de temperatura logarítmica média (LMTD):

> $$q = \bar{h} A_s \, \Delta T_{lm}$$

> $$\Delta T_{lm} = \dfrac{\Delta T_i - \Delta T_o}{\ln(\Delta T_i / \Delta T_o)}, \quad \Delta T_i = T_s - T_{m,i}, \quad \Delta T_o = T_s - T_{m,o}$$
