import { watchDebounced } from "@vueuse/core"


export const useCartStore = defineStore("CartStore", () => {

    const items = ref([] as any[]);
    const deskree = useDeskree()
    const taxRate = 0.1


    const totalCount = computed(() => items.value.reduce((acc: number, item: any) => acc + item.amount, 0))
    const subTotal: any = computed(() => items.value.reduce((acc: number, item: any) => acc + item.item.fields.price * item.amount, 0))
    const taxTotal = computed(() => subTotal.value * taxRate)
    const total = computed(() => taxTotal.value + subTotal.value)
    const isFirstLoad = ref(false)

    watchDebounced(items, () => {
        if (isFirstLoad.value) return isFirstLoad.value = false
        deskree.user.updateCart(items.value)
    }, { deep: true, debounce: 500 })

    deskree.auth.onAuthStateChange(async (user: any) => {
        if (!user) return
        isFirstLoad.value = true
        const route= useRouter()
        if(route.currentRoute.value.path==='/checkout/success'){
            items.value=[]
            return
        }
        const res = await deskree.user.getCart()
        items.value = res.products
    })

    function addToCart(item: any) {
        const existingItem = items.value.find((i: any) => i.item.sys.id === item.sys.id)
        if (existingItem) {
            existingItem.amount++
        } else {
            items.value.push({ item, amount: 1 })
        }
    }

    const removeFromCart = (cartItems: any) => {
        console.log(cartItems)
        for (const id of cartItems) {
            const index = items.value.findIndex((i: any) => i.item.sys.id === id)
            if (index > -1) {
                items.value.splice(index, 1)
            }
        }

    }

    return { items, totalCount, subTotal, taxTotal, total, addToCart, removeFromCart }
}

/* {
    state: () => ({
        items: [] as any[]
    }),

    getters: {
        totalCount: state => state.items.reduce((acc, item) => acc + item.amount, 0),
        subTotal: state => state.items.reduce((acc, item) => acc + item.item.fields.price * item.amount, 0),
        taxTotal(): number {
            return this.subTotal * 0.1
        },
        total(): number {
            return this.taxTotal + this.subTotal
        }
    },

    actions: {
        addToCart(item: any) {
            const existingItem = this.items.find((i: any) => i.item.sys.id === item.sys.id)
            if (existingItem) {
                existingItem.amount++
            } else {
                this.items.push({ item, amount: 1 })
            }
        },

        removeFromCart(items: any) {
            console.log(items)
            for (const id of items) {
                const index = this.items.findIndex((i:any) => i.item.sys.id === id)
                if (index > -1) {
                    this.items.splice(index, 1)
                }
            }

        }
    },

    
} */);

/* if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
} */