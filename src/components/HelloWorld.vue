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
  <div>
    <h1>TODO-APP</h1>
    <div class="container">
      <form @submit.prevent="pushList">
        <input v-model="word" required placeholder="TodoListに入れたいものを入力" class="textbox" />
        <button class="button">追加</button>
      </form>
    </div>
  </div>

  <div>
    <div v-for="(todo, index) in todoList" :key="index" class="item">
      <input
        type="checkbox"
        id="checkbox"
        v-model="todo.isFinished"
        style="transform: scale(1.5); margin-right: 10px"
      />
      <label
        for="checkbox"
        :class="{ deleteLine: todo.isFinished }"
        style="vertical-align: middle"
        >{{ todo.content }}</label
      >
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
.textbox {
  font-size: 20px;
  width: 300px;
  height: 30px;
}
.button {
  font-size: 15px;
  width: 60px;
  height: 36px;
}
.deleteLine {
  text-decoration: line-through;
}
.item {
  font-size: 30px;
}
</style>
