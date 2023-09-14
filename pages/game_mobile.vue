<script lang="ts" setup>
const route: any = useRoute()
const { $swal } = useNuxtApp() as any

const gameFinish = ref(false) // 遊戲是否已結束
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

const all_number = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
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

const insertFields = ref(['', '', '', ''])

/* 輸入 */
const handleInsertNum = (num: number) => {
  if (insertFields.value.includes(num.toString())) return

  // 找出為空值的第一個欄位
  const findEmptyIdx = insertFields.value.indexOf('')
  if (findEmptyIdx > -1) {
    insertFields.value[findEmptyIdx] = num.toString()
  }
}
/* 往前刪除鈕 */
const handleBackSpace = () => {
  // 找出insertFields內有值的位置
  const findAllVal = insertFields.value.filter((n) => n !== '') as any
  if (findAllVal.length) {
    const findValIdx = insertFields.value.indexOf(findAllVal.at(-1))
    insertFields.value[findValIdx] = ''
  }
}

/* 檢查是否已填滿所有數字 */
const checkValid = computed(() => insertFields.value.filter((n) => !n).length === 0)

/* 送出 */
interface insertField {
  id: number,
  num: number,
  answer: string
}
const insertList = ref<insertField[]>([])
const handleSubmit = async () => {
  const obj = {
    id: insertList.value.length + 1,
    num: insertFields.value.join(''),
    answer: getResult(insertFields.value.join(''))
  } as any
  insertList.value.unshift(obj)

  insertFields.value = ['', '', '', '']
}

/* 取得作答結果 */
const getResult = (answer: string) => {
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
      gameFinish.value = true

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
            <div class="w-auto flex items-center gap-2 text-lg">
              <p>本次用時：</p>
              <strong class="text-2xl">${getTimerFormat.value}</strong>
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
        timer.value = 0

        if (result.isConfirmed) {
          window.location.reload()
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

      gameFinish.value = false
    }
  })
}

const timer = ref(0) as any
const getTimerFormat = computed(() => {
  let min: string | number = Math.floor(timer.value / 60)
  let sec: string | number = timer.value % 60

  return `${min < 10 ? `0${min}` : min}` + ':' + `${sec < 10 ? `0${sec}` : sec}`;
})
const timerControl = setInterval(() => {
  timer.value += 1
}, 1000)

watch(gameFinish, () => {
  clearInterval(timerControl)
})

onMounted(() => {
  handleGenerateNums(route?.query?.num)
})
</script>

<template>
  <section class="w-full h-full p-1 box-border">
    <div
      class="w-full h-full p-1 box-border rounded-t-xl rounded-b-45px border-px border-solid border-#888 flex flex-col gap-2">
      <!-- tool -->
      <div class="w-full flex items-center justify-between gap-3">
        <button @click="handleBack()"
          class="px-1.5 flex items-center gap-1 text-lg border-none bg-#F29600 text-white rounded-full duration-300 hover:bg-opacity-80">
          <Icon name="ic:sharp-arrow-back" color="white" size="24px" />
          <span>回首頁</span>
        </button>
        <p>{{ getTimerFormat }}</p>
        <button @click="handleRestart()"
          class="px-1.5 flex items-center gap-1 text-lg border-none bg-#F29600 text-white rounded-full duration-300 hover:bg-opacity-80">
          <Icon name="material-symbols:sync-outline" color="white" size="24px" />
          <span>重新開始</span>
        </button>
      </div>

      <!-- 標記區 -->
      <div class="w-full mt-2 flex items-center justify-center flex-wrap gap-1">
        <strong class="text-sm">標記區：</strong>
        <button @click="handleChangeNumStatus(number)" v-for="number in all_number" :key="number" :disabled="gameFinish"
          :class="[disable_num.includes(number) ? 'bg-gray-400 shadow-inner' : 'bg-white shadow-md']"
          class="min-w-27px max-w-27px min-h-27px max-h-27px text-black font-bold border-px border-solid border-#888 rounded-lg border-px border-solid flex items-center justify-center">
          {{ number }}
        </button>
      </div>

      <!-- 作答區 -->
      <div
        class="w-full h-[calc(100%-258px)] p-1 border-3px border-dashed border-#888 box-border rounded grid grid-cols-1 place-content-start lg:grid-cols-2 gap-3 overflow-y-auto">
        <div v-for="item in insertList" :key="item.id"
          class="w-full h-content py-1 px-3 box-border border-px border-solid border-#888 rounded tracking-widest flex items-center justify-between">
          <p>{{ item.id }}</p>
          <strong class="font-bold text-lg tracking-widest">{{ item.num }}</strong>
          <p>{{ item.answer }}</p>
        </div>
      </div>

      <!-- 輸入區 -->
      <div class="w-full pb-2 flex items-center justify-around gap-2 border-b border-b-solid border-b-#888">
        <div v-for="num in insertFields" :key="num"
          class="w-50px mx-auto h-8 border-b border-b-solid border-#888 flex items-center justify-center text-2xl">
          <span>{{ num }}</span>
        </div>

        <div class="w-auto ml-auto flex items-center gap-2">
          <button @click="handleBackSpace()" :disabled="gameFinish"
            class="py-1 px-2.5 text-lg border-none bg-#F29600 text-white rounded-lg">
            <Icon name="ic:outline-backspace" color="white" size="20px" />
          </button>
          <button @click="handleSubmit()" :disabled="!checkValid || gameFinish"
            class="py-1 px-2.5 text-lg border-none bg-#F29600 text-white rounded-lg">送出</button>
        </div>
      </div>

      <div class="w-full grid grid-cols-5 place-content-center place-items-center gap-2">
        <button @click="handleInsertNum(i - 1)" v-for="i in 10" :key="i"
          :disabled="disable_num.includes(i - 1) || gameFinish"
          :class="[disable_num.includes(i - 1) ? 'bg-gray-400 shadow-inner' : 'bg-white shadow-md']"
          class="min-w-50px max-w-50px min-h-50px max-h-50px text-xl text-black font-bold border-px border-solid border-#888 rounded-lg border-px border-solid flex items-center justify-center">
          {{ i - 1 }}
        </button>
      </div>
    </div>
  </section>
</template>
