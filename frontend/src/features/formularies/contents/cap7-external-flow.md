# Cap. 7 — Escoamento Externo
> Incropera — Fundamentos de Transferência de Calor e Massa, 6ª Ed.

---

## 1. Placa Plana — Laminar ($Re_x < 5 \times 10^5$)

Espessura da camada limite de velocidade e coeficiente de atrito local:

> $$\dfrac{\delta}{x} = \dfrac{5{,}0}{Re_x^{1/2}}$$

> $$C_{f,x} = \dfrac{0{,}664}{Re_x^{1/2}}$$

Nusselt local e médio (Pohlhausen, $Pr \geq 0{,}6$):

> $$Nu_x = 0{,}332 \, Re_x^{1/2} \, Pr^{1/3}$$

> $$\overline{Nu}_L = 0{,}664 \, Re_L^{1/2} \, Pr^{1/3}$$

Coeficiente de atrito médio:

> $$\overline{C}_{f,L} = \dfrac{1{,}328}{Re_L^{1/2}}$$

---

## 2. Placa Plana — Turbulento ($Re_x > 5 \times 10^5$)

Coeficiente de atrito e Nusselt local:

> $$C_{f,x} = \dfrac{0{,}0592}{Re_x^{1/5}}$$

> $$Nu_x = 0{,}0296 \, Re_x^{4/5} \, Pr^{1/3}$$

---

## 3. Placa Plana — Camada Limite Mista

$Re_{x,c} = 5 \times 10^5$, constante $A = 871$:

> $$\overline{Nu}_L = \left(0{,}037 \, Re_L^{4/5} - A\right) Pr^{1/3}$$

> $$\overline{C}_{f,L} = \dfrac{0{,}074}{Re_L^{1/5}} - \dfrac{1742}{Re_L}$$

> Propriedades avaliadas em: $T_f = \dfrac{T_s + T_\infty}{2}$

---

## 4. Cilindro em Escoamento Cruzado

Correlação de Churchill–Bernstein ($Re_D \, Pr \geq 0{,}2$):

> $$\overline{Nu}_D = 0{,}3 + \dfrac{0{,}62 \, Re_D^{1/2} \, Pr^{1/3}}{\left[1 + \left(\dfrac{0{,}4}{Pr}\right)^{2/3}\right]^{1/4}} \left[1 + \left(\dfrac{Re_D}{282000}\right)^{5/8}\right]^{4/5}$$

> Propriedades em $T_f$. Para outros corpos rombudos, consultar Tab. 7.1.

---

## 5. Esfera

Correlação de Whitaker ($3{,}5 \leq Re_D \leq 7{,}6 \times 10^4$, $\; 0{,}71 \leq Pr \leq 380$):

> $$\overline{Nu}_D = 2 + \left(0{,}4 \, Re_D^{1/2} + 0{,}06 \, Re_D^{2/3}\right) Pr^{0{,}4} \left(\dfrac{\mu}{\mu_s}\right)^{1/4}$$

> Propriedades em $T_\infty$, exceto $\mu_s$ em $T_s$.

Para queda livre em líquidos ($\rho_s \gg \rho_f$):

> $$\overline{Nu}_D = 2 + 0{,}6 \, Re_D^{1/2} \, Pr^{1/3}$$

---

## 6. Banco de Tubos

Velocidade máxima (arranjo em linha):

> $$V_{max} = \dfrac{S_T}{S_T - D} \, V$$

Arranjo escalonado — verificar se máximo ocorre em $A_2$:

> $$V_{max} = \dfrac{S_T}{2(S_D - D)} \, V, \quad S_D = \left[S_L^2 + \left(\dfrac{S_T}{2}\right)^2\right]^{1/2}$$

Correlação de Nusselt (Zukauskas, $N_L \geq 20$):

> $$\overline{Nu}_D = C_1 \, C_2 \, Re_{D,max}^m \, Pr^{0{,}36} \left(\dfrac{Pr}{Pr_s}\right)^{1/4}$$

> $C_1$, $C_2$, $m$: Tab. 7.2 e 7.3. Propriedades em $\bar{T} = \tfrac{T_i + T_o}{2}$, exceto $Pr_s$ em $T_s$.

Variação de temperatura e transferência total:

> $$\dfrac{T_s - T_o}{T_s - T_i} = \exp\!\left(-\dfrac{\pi D \, \overline{h} \, N}{\rho V S_T c_p}\right)$$

> $$q = N \, \overline{h} \, (\pi D L) \, \Delta T_{lm}, \quad \Delta T_{lm} = \dfrac{(T_s - T_i) - (T_s - T_o)}{\ln\!\dfrac{T_s - T_i}{T_s - T_o}}$$
