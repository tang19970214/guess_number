<script lang="ts" setup>
const btnList = ref([
  // { id: 1, title: 'Three Numbers', value: 3, icon: 'icon-park-outline:three' },
  { id: 2, title: 'Four Numbers', value: 4, icon: 'icon-park-outline:four' },
  // { id: 3, title: 'Five Numbers', value: 5, icon: 'icon-park-outline:five' },
])

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
  <section class="w-full h-full bg-yellow-100 flex flex-col items-center justify-center gap-10">
    <!-- LOGO -->
    <div class="w-auto flex items-center gap-3">
      <div
        class="min-w-100px max-w-100px min-h-100px max-h-100px rounded-full bg-#F29600 flex items-center justify-center">
        <img src="/images/companylogo_white.svg" title="Donkey Move" alt="Donkey Move" width="100">
      </div>
      <img src="/images/companytext.svg" alt="" width="400" class="hidden md:block">
    </div>

    <!-- 選擇遊戲 -->
    <NuxtLink v-for="item in btnList" :key="item.id" :to="{ path: isMobile ? 'game_mobile' : 'game_web', query: { num: item.value } }"
      class="decoration-none w-auto py-3 md:py-4 px-5 md:px-8 text-2xl md:text-4xl text-white font-bold bg-#F29600 border-5px border-solid border-#F29600 rounded-full cursor-pointer flex items-center gap-3 duration-500 hover:bg-opacity-70">
      <span>{{ item.title }}</span>
      <Icon :name="item.icon" color="white" size="36px" />
    </NuxtLink>
  </section>
</template>
