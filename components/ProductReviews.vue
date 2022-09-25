<template>
  <div>
    <hr class="my-10" />
    <h4 class="mb-5 text-2xl">Customer Ratings and Reviews</h4>

    <p v-if="isLoading">Loading...</p>
    <template v-else-if="state"
      ><div class="flex w-full">
        <div class="average__ratings border-2 border-red-600 p-6 rounded-3xl">
          <p>
            <span class="text-4xl">{{ averageRatings }}</span> out of
            <span class="text-4xl">5</span>
          </p>
          <p class="text-sm text-gray-500">({{ state.meta.total }} reviews)</p>
        </div>
        <div class="ratings__ranges flex flex-col justify-between w-96 ml-4">
          <div
            v-for="n in 5"
            :key="`starStats-${n}`"
            class="flex w-full align-middle"
          >
            <span>{{ n }} stars</span>
            <input
              type="range"
              min="0"
              :max="state.meta.total"
              :value="countPerStar(n)"
              disabled
              class="range range-xs w-2/4 mx-4 align-middle mt-1"
            />
            ({{ countPerStar(n) }} reviews)
          </div>
        </div>
      </div>
      <div class="flex my-8">
        <span
          @click="showReviewForm = !showReviewForm"
          class="underline cursor-pointer"
          >Write Review</span
        >
        <span class="mx-4">|</span>
        <span
          @click="showReviews = !showReviews"
          class="underline cursor-pointer"
          >{{ showReviews ? "Hide" : "Show" }} All Reviews</span
        >
      </div>

      <product-review-form v-if="showReviewForm" :productId="productId" />
      <template v-if="showReviews">
        <product-review-card
          v-for="{ uid, attributes } in state.data"
          :key="uid"
          :review="attributes"
        />
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";

const props = defineProps<{
  productId: string;
}>();

const deskree = useDeskree();

const showReviewForm = ref(false);
const showReviews = ref(true);

const { state, isLoading, execute } = useAsyncState(
  () => deskree.reviews.get(props.productId),
  null,
  {
    immediate: false,
  }
);
const averageRatings = computed(() => {
  if (!state.value) return 0;

  const count = state.value.meta.total;
  const ratingSum = state.value.data
    .map((i: any) => i.attributes.rating)
    .reduce((a: any, b: any) => a + b, 0);
  return (ratingSum / count).toFixed(2);
});

const countPerStar = (star: any) => {
  if (!state.value) return 0;
  const reviewCount = state.value.data.filter(
    (review: any) => review.attributes.rating === star
  );
  return reviewCount.length;
};
onMounted(async () => {
  execute();
});
</script>

