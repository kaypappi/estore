import { defineStore, acceptHMRUpdate } from "pinia";
export const useProductStore = defineStore("ProductStore", {
  state: () => {
    const route = useRoute();
    return {
      /**
       * The listing of all the products
       */
      products: [],

      /**
       * Different ways of fetching the listing of products (filters, order, search)
       */
      filters: {
        "fields.heatLevel": route.query['fields.heatLevel'] || "",
        order: route.query.order || "",
        query: route.query.query || "",
      },
      loadingProducts: false,

      /**
       * A single project to show all the details of
       */
      singleProduct: null,
    };
  },
  getters: {
    activeFilters() {
      const clone = JSON.parse(JSON.stringify(this.filters));
      // remove blank object properties
      return Object.fromEntries(
        Object.entries(clone).filter(([_, v]) => v != null)
      );
    },
  },
  actions: {
    async fetchProducts() {
      const { $contentful } = useNuxtApp()
      this.loadingProducts = true
      try {
        const products = await $contentful.getEntries({
          content_type: "product",
          ...this.filters,
        })

        this.products = products.items
        return this.products
      } catch (err) {
        return err
      } finally {
        this.loadingProducts = false
      }


    },
    async fetchProduct(id) {
      const products = await this.fetchProducts();
      this.singleProduct = products.find((p) => {
        return p.sys.id === id;
      });
      return this.singleProduct;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
