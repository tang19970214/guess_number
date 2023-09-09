<script lang="ts" setup>
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" },
  ]
})

const checkMobile = () => {
  const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Andriod|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)

  return !!flag
}
const isMobile = ref<Boolean>(false)
onMounted(() => {
  isMobile.value = checkMobile()
})
</script>

<template>
  <section :class="[isMobile ? 'h-[calc(100vh-80px)]' : 'h-screen']" class="w-full font-mono">
    <slot />
  </section>
</template>