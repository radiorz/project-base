<!--
 
/**
 * @author
 * @file App.vue
 * @fileBase App
 * @path packages\simple-form\src\App.vue
 * @from 
 * @desc App
 * @todo
 * 
 *
 * @done
 * @example
 */

-->

<script lang="ts">
export default {
  name: "App",
};
</script>
<script setup lang="ts">
import SimpleForm from "./SimpleForm/SimpleForm.vue";
import { reactive } from "vue";
const data = reactive({
  n: 1,
  o: {
    b: 2,
  },
});
const uiSchema = reactive({});
function validate(data: any) {
  if (data) {
    return true;
  }
  return false;
}
</script>

<template>
  <div class="App">
    <SimpleForm
      :data="data"
      :ui-schema="uiSchema"
      :validate="validate"
    ></SimpleForm>
  </div>
</template>

<style lang="scss" scoped></style>
