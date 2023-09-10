<script lang="ts" setup>
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" },
  ],
  link: [
    { rel: 'manifest', href: '/manifest.webmanifest' }
  ]
})
</script>

<template>
  <VitePwaManifest />
  <section class="w-full h-screen font-mono">
    <slot />
  </section>
</template>