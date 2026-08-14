<script setup lang="ts">
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="route" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style>
/**
 * Transición entre rutas.
 *
 * Solo se anima `opacity`: FunnelView tiene header y menú con `position: fixed`,
 * y cualquier `transform` en la raíz de la vista crea un containing block que
 * los despega de la ventana durante la animación. El movimiento se hace dentro
 * de cada vista, donde sí es seguro.
 *
 * La duración de salida está sincronizada con el retardo del scrollBehavior en
 * `src/router/index.ts` (ROUTE_LEAVE_MS): la página salta arriba cuando la vista
 * anterior ya es invisible.
 */
.route-enter-active {
  transition: opacity 260ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

.route-leave-active {
  transition: opacity 180ms ease-in;
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .route-enter-active,
  .route-leave-active {
    transition-duration: 1ms;
  }
}
</style>
