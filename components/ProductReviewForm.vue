<template>
  <FormKit type="form" submit-label="Save" @submit="save">
    <FormKit
      type="text"
      name="title"
      label="Title"
      validation="required"
      v-model="form.title"
    />
    <FormKit
      type="textarea"
      name="message"
      label="Message"
      validation="required"
      v-model="form.text"
    />
    <FormKit
      v-model.number="form.rating"
      type="range"
      :label="`Rating ${form.rating}`"
      min="1"
      max="5"
    />
  </FormKit>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";

const form = ref({
  title: "",
  text: "",
  rating: 1,
});
const props = defineProps<{
  productId: string;
}>();

const deskree = useDeskree();

const { state, isLoading, execute } = useAsyncState(
  (): any =>
    deskree.reviews.submit({ ...form.value, product_id: props.productId }),
  null,
  { immediate: false }
);

const save = async () => {
  await execute();
  form.value = { title: "", text: "", rating: 1 };
};
</script>

<style>
</style>