<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
// @ts-expect-error: Importing JS module without type definitions
import db from './firebase.js'
import { collection, getDocs, deleteDoc, updateDoc, doc, setDoc } from 'firebase/firestore/lite'
import TodoTask from './TodoTask.vue'

type TodoItem = {
  fieldId: string
  content: string
  isFinished: boolean
}

const word = ref<string>('')

const todoList = ref<TodoItem[]>([])

const pushItem = () => {
  console.log(todoList.value)
  if (word.value == '') return
  const uniqueId: string = uuidv4()
  pushItemToDatabase(word.value, uniqueId)
  todoList.value.push({ fieldId: uniqueId, content: word.value, isFinished: false })
  word.value = ''
}

async function pushItemToDatabase(w: string, ID: string) {
  await setDoc(doc(db, 'items', ID), {
    content: w,
    isFinished: false,
  })
}

const deleteItem = (i: number) => {
  deleteDoc(doc(db, 'items', todoList.value[i].fieldId))
  todoList.value.splice(i, 1)
}

async function taskEdited(content: string, index: number) {
  todoList.value[index].content = content
  const fieldId = todoList.value[index].fieldId
  await updateDoc(doc(db, 'items', fieldId), {
    content: todoList.value[index].content,
  })
}

const allDeleteItems = () => {
  const newTodoList: TodoItem[] = []
  todoList.value.map(function (item) {
    if (item.isFinished) {
      deleteDoc(doc(db, 'items', item.fieldId))
    } else {
      newTodoList.push(item)
    }
  })
  todoList.value = newTodoList
}

async function fetchItems() {
  const querySnapshot = await getDocs(collection(db, 'items'))
  todoList.value = querySnapshot.docs.map((doc) => ({
    fieldId: doc.id,
    content: doc.data().content,
    isFinished: doc.data().isFinished,
  }))
}

async function updatebool(index: number) {
  todoList.value[index].isFinished = !todoList.value[index].isFinished
  const fieldId = todoList.value[index].fieldId
  await updateDoc(doc(db, 'items', fieldId), {
    isFinished: todoList.value[index].isFinished,
  })
}

onMounted(fetchItems)
</script>

<template>
  <div>
    <h1>TODO-APP</h1>
    <div class="container">
      <form @submit.prevent="pushItem">
        <input
          v-model="word"
          required
          placeholder="TodoListに入れたいものを入力"
          class="input-text"
        />
        <button class="add-button" style="vertical-align: top">追加</button>
      </form>
    </div>
    <div>
      <button v-if="todoList.length > 0" class="delete-all-button" @click="allDeleteItems">
        完了項目を全て削除
      </button>
    </div>
  </div>

  <div>
    <div v-for="(todo, index) in todoList" :key="index" style="font-size: 30px">
      <TodoTask
        :task="todo"
        :index="index"
        @updatebool="updatebool"
        @deleteItem="deleteItem"
        @taskEdited="taskEdited"
      />
    </div>
  </div>
</template>

<style scoped>
.add-button {
  display: inline-flex;
  align-items: center;
  height: 37px;
  background: #6fb5fc;
  color: #fff;
  border: 2px solid #1976d2;
  border-radius: 6px;
  font-size: 20px;
  font-weight: bold;
  padding: 8px 14px;
  cursor: pointer;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  transition:
    background 0.18s,
    box-shadow 0.18s;
}

.add-button:hover {
  background: #53a7f5;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.18);
}

.container {
  display: inline-flex;
  align-items: center;
}

.input-text {
  width: 300px;
  height: 37px;
  max-width: 400px;
  padding: 10px 14px;
  font-size: 18px;
  font-family: inherit;
  color: #2c3e50;
  background-color: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-text:focus {
  border-color: #1976d2;
  box-shadow: 0 0 4px rgba(25, 118, 210, 0.3);
  outline: none;
}

.delete-all-button {
  background: #fffbe6;
  color: #8d8b19;
  border: 2px solid #dbcb54;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  padding: 4px 15px;
  margin: 5px 0 5px 0;
  cursor: pointer;
  transition:
    background 0.15s,
    border 0.15s,
    color 0.13s;
}

.delete-all-button:hover {
  background: #fbf6db;
  color: #df870c;
  border-color: #edc347;
}
</style>
