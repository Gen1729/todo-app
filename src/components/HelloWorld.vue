<script setup lang="ts">
import { ref } from 'vue'

type TodoItem = {
  content: string
  isFinished: boolean
}

const word = ref<string>('')

const todoList = ref<TodoItem[]>([])

const pushList = () => {
  if (word.value == '') return
  todoList.value.push({ content: word.value, isFinished: false })
  word.value = ''
  console.log(todoList.value)
}
</script>

<template>
  <h1>TODO-APP</h1>
  <form @submit.prevent="pushList">
    <input v-model="word" required placeholder="TodoListに入れたいものを入力" />
    <button>追加</button>
  </form>
</template>

<style scoped></style>
