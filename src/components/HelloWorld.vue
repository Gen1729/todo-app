<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
// @ts-ignore
import db from './firebase.js'
import { collection, getDocs, deleteDoc, updateDoc, doc, setDoc } from 'firebase/firestore/lite'

type TodoItem = {
  fieldId: string
  content: string
  isFinished: boolean
}

const word = ref<string>('')

const todoList = ref<TodoItem[]>([])

const pushItem = () => {
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

const allDeleteItems = () => {
  let newTodoList: TodoItem[] = []
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
      <form @submit.prevent="pushItem">
        <input v-model="word" required placeholder="TodoListに入れたいものを入力" class="textbox" />
        <button class="button">追加</button>
      </form>
      <span :class="{ status, cogreen: isGreen, cored: !isGreen }">{{ status }}</span>
    </div>
    <div>
      <button v-if="todoList.length > 0" class="all-delete-button" @click="allDeleteItems">
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
      />
      <label
        for="checkbox"
        :class="{ deleteLine: todo.isFinished }"
        style="vertical-align: middle"
        >{{ todo.content }}</label
      >
      <button class="delete-botton" @click="deleteItem(index)">削除</button>
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
