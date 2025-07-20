<script setup lang="ts">
import editImage from '../assets/editpencil.png'
import { ref } from 'vue'
type TodoItem = {
  fieldId: string
  content: string
  isFinished: boolean
}
const props = defineProps<{
  task: TodoItem
  index: number
}>()

const newText = ref<string>('')
const isEdit = ref<boolean>(false)

const emit = defineEmits<{
  (e: 'updatebool', index: number): void
  (e: 'deleteItem', index: number): void
  (e: 'taskEdited', content: string, index: number): void
}>()

function updatebool(ind: number) {
  emit('updatebool', ind)
}

function deleteItem(ind: number) {
  emit('deleteItem', ind)
}

function taskEdited(ind: number) {
  isEdit.value = false
  emit('taskEdited', newText.value, ind)
}

function editTask() {
  newText.value = props.task.content
  isEdit.value = true
}
</script>

<template>
  <div class="task-box">
    <input
      type="checkbox"
      id="checkbox"
      :checked="task.isFinished"
      style="transform: scale(1.5); margin-right: 10px"
      @click="updatebool(index)"
    />
    <label
      v-if="!isEdit"
      for="checkbox"
      :class="{ deleteLine: task.isFinished }"
      style="vertical-align: middle"
      >{{ task.content }}</label
    >
    <form v-else @submit.prevent="taskEdited(index)">
      <input
        v-model="newText"
        required
        placeholder="変更を入力"
        class="input-text"
        style="vertical-align: middle"
      />
      <button style="vertical-align: middle" class="add-button">完了</button>
    </form>
    <button v-if="!isEdit" @click="editTask" class="edit-button">
      <img :src="editImage" style="width: 150%" />
    </button>
    <button class="delete-button" @click="deleteItem(index)">×</button>
  </div>
</template>

<style scoped>
.deleteLine {
  text-decoration: line-through;
}
.delete-button {
  align-items: center;
  background: #fb6c6c;
  color: #ffffff;
  border: 2px solid #f44336;
  border-radius: 50%; /* 丸 */
  width: 28px;
  height: 28px;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.18s,
    color 0.18s;
}

.delete-button:hover {
  background: #f8d7da;
  color: #f44336;
}
.task-box {
  display: inline-flex;
  align-items: center;
  background-color: #e0f7fa;
  border: 1px solid #81d4fa;
  border-radius: 6px;
  padding: 4px 8px;
  margin: 4px 0;
}

.edit-button {
  background: #d5e5f3;
  border: 2px solid #42a5f5;
  border-radius: 30%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  margin-left: 10px;
  transition:
    background 0.16s,
    color 0.16s;
}

.edit-button:hover {
  background: #f9fcff;
  color: #1565c0;
}

.input-text {
  width: 200px;
  height: 37px;
  max-width: 400px;
  padding: 10px 10px;
  margin-bottom: 4px;
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
  margin-bottom: 4px;
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
</style>
