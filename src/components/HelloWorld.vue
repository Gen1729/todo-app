<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
// @ts-ignore
import db from './firebase.js'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
} from 'firebase/firestore/lite'

type TodoItem = {
  fieldId: string
  content: string
  isFinished: boolean
}

const word = ref<string>('')

const status = ref<string>('最新の状態です')

const isGreen = ref<boolean>(true)

const todoList = ref<TodoItem[]>([])

const pushItem = () => {
  if (word.value == '') return
  const uniqueId: string = uuidv4()
  pushItemToDatabase(word.value, uniqueId)
  todoList.value.push({ fieldId: uniqueId, content: word.value, isFinished: false })
  word.value = ''
  status.value = '未保存の状態です'
  isGreen.value = false
}

const pushItemToDatabase = (w: string, ID: string) => {
  setDoc(doc(db, 'items', ID), {
    content: w,
    isFinished: false,
  })
}

const deleteItem = (i: number) => {
  todoList.value.splice(i, 1)
  status.value = '未保存の状態です'
  isGreen.value = false
}

const allDelete = () => {
  const newTodoList: TodoItem[] = todoList.value.filter(function (item) {
    return !item.isFinished
  })
  todoList.value = newTodoList
  status.value = '未保存の状態です'
  isGreen.value = false
}

async function fetchItems() {
  const querySnapshot = await getDocs(collection(db, 'items'))
  todoList.value = querySnapshot.docs.map((doc) => ({
    fieldId: doc.id,
    content: doc.data().content,
    isFinished: doc.data().isFinished,
  }))
}

async function updateDatabase() {
  status.value = '保存中...'
  const snapshot = await getDocs(collection(db, 'items'))
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, 'items', document.id))
  }

  for (const item of todoList.value) {
    await addDoc(collection(db, 'items'), {
      content: item.content,
      isFinished: item.isFinished,
    })
  }

  alert('保存完了')
  status.value = '最新の状態です'
  isGreen.value = true
}

async function updatebool(fieldId: string, index: number) {
  await updateDoc(doc(db, 'items', fieldId), {
    isFinished: !todoList.value[index].isFinished,
  })
}

onMounted(fetchItems)
</script>

<template>
  <div>
    <h1>TODO-APP</h1>
    <div class="container">
      <form @submit.prevent="pushItem" :disabled="status == '保存中...'">
        <input
          v-model="word"
          required
          placeholder="TodoListに入れたいものを入力"
          class="textbox"
          :disabled="status == '保存中...'"
        />
        <button class="button" :disabled="status == '保存中...'">追加</button>
      </form>
      <span :class="{ status, cogreen: isGreen, cored: !isGreen }">{{ status }}</span>
    </div>
    <div>
      <button class="save-button" @click="updateDatabase" :disabled="status == '保存中...'">
        リストを保存
      </button>
      <button
        v-if="todoList.length > 0"
        class="all-delete-button"
        @click="allDelete"
        :disabled="status == '保存中...'"
      >
        完了項目を全て削除
      </button>
    </div>
  </div>

  <div>
    <div v-for="(todo, index) in todoList" :key="index" class="item">
      <input
        type="checkbox"
        id="checkbox"
        v-model="todo.isFinished"
        style="transform: scale(1.5); margin-right: 10px"
        @click="updatebool(todo.fieldId, index)"
        :disabled="status == '保存中...'"
      />
      <label
        for="checkbox"
        :class="{ deleteLine: todo.isFinished }"
        style="vertical-align: middle"
        >{{ todo.content }}</label
      >
      <button class="delete-botton" @click="deleteItem(index)" :disabled="status == '保存中...'">
        削除
      </button>
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
.all-delete-button {
  font-size: 15px;
  width: 170px;
  height: 36px;
  margin-top: 10px;
}
.save-button {
  font-size: 15px;
  width: 120px;
  height: 36px;
  margin-top: 10px;
}
.deleteLine {
  text-decoration: line-through;
}
.item {
  font-size: 30px;
}
.delete-botton {
  height: 30px;
  font-size: 15px;
  margin-left: 10px;
}
.status {
  font-size: 20px;
  margin-left: 10px;
}

.cogreen {
  color: green;
}
.cored {
  color: red;
}
</style>
