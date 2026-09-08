# Plan: Coordination Intelligence Visual Redesign & Landing Page

## Instrucciones de bucle (ralph)

Cada iteración ejecuta **una sola** acción y termina. No encadenes tareas.

1. **Localizar la siguiente subtarea**:
   - Recorre `plan.md` de arriba a abajo y encuentra el primer `[ ]`.
   - Si la línea enlaza a un fichero `task/NN.md`, abre el fichero y repite la búsqueda recursivamente dentro de él hasta llegar a una subtarea `[ ]` hoja (sin enlace).
   - Si no encuentras ningún `[ ]` en ninguna parte ? **crea `plan/stop.md`** con una nota breve ("plan completo, sin subtareas pendientes") y **para**. El fichero `stop.md` es la señal que `ralph-loop.sh` usa para detenerse; sin él el bucle sigue iterando aunque no haya trabajo.
2. **Ejecutar esa única subtarea**:
   - Subtarea normal: realízala y márcala `[x]`.
   - Subtarea `[juez]`: invoca la skill `juez` sobre el repositorio pasándole las instrucciones del fichero `task/NN.md` correspondiente. La skill juzgará la evidencia y actualizará el fichero.
   - Si la subtarea consiste en **añadir** nuevas subtareas o crear un nuevo `task/NN.md`: añádelas y **no las ejecutes**; crear tareas cuenta como la acción única de la iteración.
   - **Excepción**: si al inspeccionar la subtarea descubres que el trabajo **ya está hecho** (el código/artefacto/condición existe sin necesidad de cambios), márcala `[x]` y **continúa con la siguiente subtarea en la misma iteración**. Marcar tareas ya completadas no cuenta como la acción única del bucle; solo el trabajo real (implementar, crear tareas, invocar a la juez) consume la iteración.
3. **Propagar hacia arriba**:
   - Tras marcar una subtarea, si **todas** las subtareas del `task/NN.md` están `[x]`, marca también la entrada correspondiente en `plan.md` como `[x]`.
4. **Parar**. No busques la siguiente subtarea, no encadenes iteraciones.

## Tareas

- [x] Tarea 1: Configurar Tailwind theme y estilos globales AEC (colores carbón, acentos esmeralda, cuadrícula blueprint, líneas técnicas) en `tailwind.config.ts` y `app/globals.css`
- [x] Tarea 2: Crear ruta dedicada de Command Center `/command-center` en `app/command-center/page.tsx` con soporte completo de workspace y enlace de retorno a la landing page
- [x] Tarea 3: Implementar componentes visuales de Landing: `LandingNavbar.tsx` y `HeroSection.tsx` con previsualización funcional del dashboard y métricas
- [x] Tarea 4: Implementar componentes visuales de Landing: `CapabilitiesStrip.tsx` (6 capacidades interconectadas + logotipos AEC) y `ProblemImpactSection.tsx` (diagrama técnico de impacto)
- [x] Tarea 5: Implementar componentes visuales de Landing: `HowItWorksSection.tsx` (5 fases de ingeniería conectadas) y `RealScenarioSection.tsx` (escenario Apex Chiller con datos en vivo del store y plano CAD)
- [x] Tarea 6: Implementar componentes visuales de Landing: `CommandCenterPreviewSection.tsx` (embed funcional del dashboard), `StakeholderNetworkSection.tsx` y `ProjectMemorySection.tsx`
- [x] Tarea 7: Implementar componentes visuales de Landing: `FinalCtaSection.tsx`, `LandingFooter.tsx` y modal interactivo `DemoVideoModal.tsx`
- [x] Tarea 8: Integrar todas las 11 secciones en `app/page.tsx` y pulir componentes del Command Center (`Navbar.tsx`, `DependencyGraph.tsx`, `TaskNode.tsx`, etc.)
- [x] Tarea 9: Ejecutar build de Next.js (`npm run build`), verificar fidelidad visual, enlaces, rutas, ausencia de errores de hidratación y responsividad
