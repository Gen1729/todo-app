<script setup lang="ts">
type TodoItem = {
  fieldId: string
  content: string
  isFinished: boolean
}

defineProps<{
  task: TodoItem
  index: number
}>()

const emit = defineEmits<{
  (e: 'updatebool', id: string, index: number): void
  (e: 'deleteItem', index: number): void
}>()

function updatebool(Id: string, ind: number) {
  emit('updatebool', Id, ind)
}

function deleteItem(ind: number) {
  emit('deleteItem', ind)
}
</script>

<template>
  <div class="task-box">
    <input
      type="checkbox"
      id="checkbox"
      :checked="task.isFinished"
      style="transform: scale(1.5); margin-right: 10px"
      @click="updatebool(task.fieldId, index)"
    />
    <label for="checkbox" :class="{ deleteLine: task.isFinished }" style="vertical-align: middle">{{
      task.content
    }}</label>
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
</style>
