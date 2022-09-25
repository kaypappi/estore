<template>
  <div class="border border-gray-300 rounded-lg p-8 mb-5">
    <div class="rating">
      <input
        type="radio"
        name="rating-2"
        :class="`mask mask-star-2 ${n>review.rating ? 'bg-orange-100':'bg-orange-300'}`"
        v-for="n in 5"
        :key="`rating-${n}`"
        disabled
      />
      
      
    </div>
    <h4 class="text-2xl my-2">{{ review.title }}</h4>
    <p class=" text-lg">
      {{ review.text }}
    </p>
    <p class=" text-sm text-gray-400">{{timeStamp}}</p>
  </div>
</template>

<script setup lang='ts'>
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
  review: {
    product_id: string;
    rating: number;
    createdAt: string;
    author: string;
    updatedAt: string;
    title: string;
    text: string;
  };
}>();

const timeStamp = useTimeAgo(props.review.createdAt);
</script>

<style>
</style>