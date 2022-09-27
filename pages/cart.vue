<script setup>
const selected = ref([]);
const checkAll = ref();
const cartStore= useCartStore()

async function handleCheckout() {
  const res = await $fetch("/api/cart",{
    method:"POST",
    body:{
      products:cartStore.items.map(product=>({
        id:product.item.sys.id,
        quantity:product.amount
      }))
    }
  })
  window.location=res.url
  console.log(res);
}

const removeSelectedItems=()=>{
  cartStore.removeFromCart(selected.value)
}
</script>
<template>
  <div class="m-10">
    <h1 class="text-3xl mb-5 font-bold">Your Cart</h1>
    <div class="md:flex w-full">
      <div class="md:w-3/4">
        <!-- Use this markup to display an empty cart -->
        <div  v-if="cartStore.items.length<1" class="italic text-center pt-10">
          Cart is empty
        </div>
        <div v-else class="overflow-x-auto">
          <div class="table w-full">
            <table class="w-full">
              <!-- head -->
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" class="checkbox" ref="checkAll" />
                    </label>
                  </th>
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Number of Items</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="({item},i) in cartStore.items" :key="item.sys.id">
                  <th>
                    <label>
                      <input
                        v-model="selected"
                        type="checkbox"
                        class="checkbox"
                        @change="checkAll.checked = false"
                        :value="item.sys.id"
                      />
                    </label>
                  </th>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="mask mask-squircle w-12 h-12">
                          <img
                            :src="item.fields.image[0].fields.file.url"
                            :alt="item.fields.image[0].fields.title"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="font-bold">
                     {{item.fields.name}}
                    </div>
                    <ProductHeat heat-level="Mild" />
                  </td>
                  <td>
                    <ProductPrice :price="item.fields.price" />
                  </td>

                  <td>
                    <input
                      class="input input-bordered w-20"
                      type="number"
                      v-model="cartStore.items[i].amount"
                      min="0"
                      
                    />
                  </td>
                  <th>
                    <NuxtLink
                      :to="{
                        name: 'products-id',
                        params: { id: '5ijmFfTSEqj0G8h73g3CrI' },
                      }"
                    >
                      <button class="btn btn-ghost btn-xs">details</button>
                    </NuxtLink>
                  </th>
                </tr>
              </tbody>
            </table>
            <button @click="removeSelectedItems" v-if="selected.length" class="text-sm text-red-500">
              Remove Selected
            </button>
          </div>
        </div>
      </div>

      <div class="md:w-1/4 pl-5">
        <div class="card bg-slate-50">
          <div class="card-body">
            <ul>
              <li><strong>Subtotal</strong>: <product-price :price="cartStore.subTotal"/></li>
              <li><strong>Estimated Taxes </strong>: <product-price :price="cartStore.taxTotal"/></li>
              <li><strong>Total</strong>: <product-price :price="cartStore.total"/></li>
            </ul>
            <div class="card-actions justify-end w-full">
              <button class="btn btn-primary w-full" @click="handleCheckout">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
