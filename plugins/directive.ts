const focus = (el: HTMLElement, binding: any) => {
  if (binding.value == true || binding.value == undefined) {
    el.focus()
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el, binding) {
      focus(el, binding)
    },
    updated(el, binding) {
      focus(el, binding)
    }
  })
})