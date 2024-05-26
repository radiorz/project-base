<!--
 
/**
 * @author
 * @file SimpleForm.vue
 * @fileBase SimpleForm
 * @path packages\simple-form\src\SimpleForm\SimpleForm.vue
 * @from 
 * @desc SimpleForm
 * @todo
 * 
 *
 * @done
 * @example
 */

-->

<script lang="ts">
export default {
  name: "SimpleForm",
};
</script>
<script setup lang="ts">
// import { defineProps } from "vue";
// interface Props {
//   data: Record<string, any>;
//   uiSchema?: Record<string, any>;
//   validate?: (data: any) => boolean;
// }
const { data, uiSchema, validate } = defineProps({
  data: { type: Object, default: () => {} },
  // schema:Object
  uiSchema: Object,
  validate: Function,
});
console.log(`data,uiSchema`, data, uiSchema);
console.log(`validate`, validate?.(data));
function getType(value: any) {
  if (Array.isArray(value)) return "array";
  return typeof value;
}
</script>

<template>
  <div class="SimpleForm">
    <div v-if="data">
      <div v-for="[key, value] of Object.entries(data)">
        key: {{ key }} value: {{ value }} type: {{ getType(value) }}
        <div v-if="getType(value) === 'object'">
          
        </div>
        <div v-else>
          <!-- <Field :key="" value="" :ui-schema="uiSchema[key]"> -->
          isNormal
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
