<script lang="ts" setup>
const route: any = useRoute()
const router: any = useRouter()
const { $swal } = useNuxtApp() as any

/* 產生隨機數字 */
const generateNum = ref('')
const handleGenerateNums = (numberNum: number = 4) => {
  const uniqueNums: number[] = []
  while (uniqueNums.length < numberNum) {
    const randomNum = Math.floor(Math.random() * 10)
    if (!uniqueNums.includes(randomNum)) {
      uniqueNums.push(randomNum)
    }
  }

  generateNum.value = uniqueNums.join('')
}

const all_number = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
const disable_num = ref<Number[]>([])

/* 變更標記區數字狀態 */
const handleChangeNumStatus = (num: number) => {
  if (disable_num.value.includes(num)) {
    const getIdx = disable_num.value.indexOf(num)
    disable_num.value.splice(getIdx, 1)
  } else {
    disable_num.value.push(num)
  }
}

const insertField1 = ref<Number | String>('')
const insertField2 = ref<Number | String>('')
const insertField3 = ref<Number | String>('')
const insertField4 = ref<Number | String>('')

const nowFocus = ref<String>('insertField1')

const resetInsertFields = () => {
  insertField1.value = ''
  insertField2.value = ''
  insertField3.value = ''
  insertField4.value = ''
  nowFocus.value = 'insertField1'
}

const onInput = (el: any, idx: number) => {
  el.target.value = el.target.value.replace(/[^\d]/g, '')
  const fieldArr = [insertField1, insertField2, insertField3, insertField4]
  for (let i = 0; i < fieldArr.length; i++) {
    if (!!fieldArr[i].value && +fieldArr[i].value > -1 && +fieldArr[i].value === +el.target.value && i !== idx - 1) {
      el.target.value = ''
    }
  }

  if (!!el.target.value) {
    if (idx < 4) {
      nowFocus.value = `insertField${idx + 1}`
    } else {
      handleSubmit()
    }
  } else {
    nowFocus.value = `insertField${idx}`
  }
}

/* 判斷按下BackSpace時退回一格focus */
const handleKeydown = (el: any, idx: number) => {
  if (el.key !== 'Backspace' || !!el.target.value) return
  nowFocus.value = `insertField${idx - 1}`
}

/* 送出 */
interface insertField {
  id: number,
  num: number,
  answer: string
}
const insertList = ref<insertField[]>([])
const handleSubmit = async () => {
  const mixNum = `${insertField1.value}${insertField2.value}${insertField3.value}${insertField4.value}`
  const obj = {
    id: insertList.value.length + 1,
    num: mixNum,
    answer: getResult(mixNum)
  } as any
  insertList.value.unshift(obj)

  resetInsertFields()
}

/* 取得作答結果 */
const getResult = (answer: string) => {
  console.log(answer, generateNum.value);
  const answerStr = answer.toString().split('')
  const resultStr = generateNum.value.toString().split('')
  const commonCount = answerStr.filter((num) => resultStr.includes(num)) // 找出是否有一樣的數字

  if (!commonCount.length) {
    return '0A0B'
  } else {
    const getAnsPosIdx = [] // 存放使用者輸入答案的'正確位置'
    const getResPosIdx: { num: string; idx: number; }[] = [] // 存放正確答案的'正確位置'
    for (let i = 0; i < commonCount.length; i++) {
      const matchNum = commonCount[i];
      // 抓出使用者輸入的答案
      if (answerStr.includes(matchNum)) {
        const obj = {
          num: matchNum,
          idx: answerStr.indexOf(matchNum)
        }
        getAnsPosIdx.push(obj)
      }
      if (resultStr.includes(matchNum)) {
        const obj = {
          num: matchNum,
          idx: resultStr.indexOf(matchNum)
        }
        getResPosIdx.push(obj)
      }
    }
    const resultA = getAnsPosIdx.filter((item) => getResPosIdx.find((i) => item.num === i.num && item.idx === i.idx))
    const resultB = getAnsPosIdx.filter((item) => !getResPosIdx.find((i) => item.num === i.num && item.idx === i.idx))

    if (resultA.length === 4) {
      $swal.fire({
        icon: 'success',
        title: `『${generateNum.value}』恭喜答對！`,
        html: `
          <div class="w-auto flex flex-col items-center gap-5">
            <div class="w-auto flex items-center gap-2 text-lg">
              <p>本次作答次數：</p>
              <strong class="text-2xl">${insertList.value.length + 1}</strong>
              <p>次</p>
            </div>

            <strong class="text-4xl bg-red-200 text-red-500">是否再來一局？</strong>
          </div>`,
        showConfirmButton: true,
        confirmButtonText: '是',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        cancelButtonText: '否',
        cancelButtonColor: '#d33'
      }).then((result: any) => {
        if (result.isConfirmed) {
          window.location.reload()
        } else {
          router.push('/')
        }
      })
    }

    return `${resultA.length}A${resultB.length}B`
  }
}

/* 回首頁 */
const handleBack = () => {
  $swal.fire({
    icon: 'warning',
    title: '確定回首頁嗎？',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '確定',
    cancelButtonColor: '#d33',
    cancelButtonText: '取消'
  }).then((result: any) => {
    if (result.isConfirmed) {
      return navigateTo('/')
    }
  })
}

/* 重新開始 */
const handleRestart = () => {
  $swal.fire({
    icon: 'warning',
    title: '確定要重新開始新的一局嗎？',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: '確定',
    cancelButtonColor: '#d33',
    cancelButtonText: '取消'
  }).then((result: any) => {
    if (result.isConfirmed) {
      disable_num.value = []
      insertList.value = []
      handleGenerateNums()
    }
  })
}

onMounted(() => {
  handleGenerateNums(route?.query?.num)
})
</script>

<template>
  <section class="w-full h-full p-2 box-border">
    <div
      class="w-full h-full p-1 md:p-2 box-border rounded-xl border-px border-solid border-#888 flex flex-col gap-2 md:gap-5">
      <!-- tool -->
      <div class="w-full flex items-center justify-between gap-3">
        <button @click="handleBack()"
          class="py-0.5 md:py-1.5 px-3 md:px-4 flex items-center gap-1 text-lg border-none bg-#F29600 text-white rounded-full cursor-pointer duration-300 hover:bg-opacity-80">
          <Icon name="ic:sharp-arrow-back" color="white" size="24px" />
          <span>回首頁</span>
        </button>
        <button @click="handleRestart()"
          class="py-0.5 md:py-1.5 px-3 md:px-4 flex items-center gap-1 text-lg border-none bg-#F29600 text-white rounded-full cursor-pointer duration-300 hover:bg-opacity-80">
          <Icon name="material-symbols:sync-outline" color="white" size="24px" />
          <span>重新開始</span>
        </button>
      </div>

      <!-- 標記區 -->
      <div class="w-full flex items-center justify-center flex-wrap gap-1 md:gap-2">
        <strong class="text-xl">標記區：</strong>
        <button @click="handleChangeNumStatus(number)" v-for="number in all_number" :key="number"
          :class="[disable_num.includes(number) ? 'bg-gray-400 shadow-inner' : 'bg-white shadow-md hover:bg-gray-200']"
          class="min-w-30px max-w-30px min-h-30px max-h-30px md:min-w-40px md:max-w-40px md:min-h-40px md:max-h-40px text-black md:text-lg font-bold border-px border-solid border-#888 rounded-lg border-px border-solid flex items-center justify-center cursor-pointer duration-300">
          {{ number }}
        </button>
      </div>

      <!-- 作答區 -->
      <div
        class="w-full h-[calc(100%-133px)] md:h-[calc(100%-190px)] p-1 border-3px border-dashed border-#888 box-border rounded grid grid-cols-1 place-content-start lg:grid-cols-2 gap-3 overflow-y-auto">
        <div v-for="item in insertList" :key="item.id"
          class="w-full h-content py-1 px-3 box-border border-px border-solid border-#888 rounded md:text-lg tracking-widest flex items-center justify-between">
          <p>{{ item.id }}</p>
          <strong class="font-bold text-lg md:text-2xl tracking-widest">{{ item.num }}</strong>
          <p>{{ item.answer }}</p>
        </div>
      </div>

      <!-- 輸入區 -->
      <div
        class="w-full pt-2 border-t-px border-t-solid border-#bbbbbb mt-auto flex items-center justify-center gap-3 md:gap-5 flex-wrap">
        <input @input="onInput($event, 1)" v-model="insertField1" v-focus="nowFocus === 'insertField1'" type="tel"
          maxlength="1" class="w-35px md:w-60px rounded py-1 px-2 border-px text-lg text-center">
        <input @input="onInput($event, 2)" @keydown="handleKeydown($event, 2)" v-model="insertField2"
          v-focus="nowFocus === 'insertField2'" type="tel" maxlength="1"
          class="w-35px md:w-60px rounded py-1 px-2 border-px text-lg text-center">
        <input @input="onInput($event, 3)" @keydown="handleKeydown($event, 3)" v-model="insertField3"
          v-focus="nowFocus === 'insertField3'" type="tel" maxlength="1"
          class="w-35px md:w-60px rounded py-1 px-2 border-px text-lg text-center">
        <input @input="onInput($event, 4)" @keydown="handleKeydown($event, 4)" v-model="insertField4"
          v-focus="nowFocus === 'insertField4'" type="tel" maxlength="1"
          class="w-35px md:w-60px rounded py-1 px-2 border-px text-lg text-center">
        <button @click="handleSubmit()" :disabled="!insertField1 || !insertField2 || !insertField3 || !insertField4"
          class="py-1 md:py-1.5 px-2.5 md:px-4 text-lg border-none bg-#F29600 text-white rounded-lg cursor-pointer duration-300 hover:bg-opacity-80">送出</button>
      </div>
    </div>
  </section>
</template>
