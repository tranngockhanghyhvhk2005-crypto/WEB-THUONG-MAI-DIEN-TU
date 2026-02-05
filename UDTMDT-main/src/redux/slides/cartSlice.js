import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'

const getInitialState = () => {
    const cart = localStorage.getItem('cartItems')
    return cart ? JSON.parse(cart) : { items: [], totalQuantity: 0 }
};

const saveStateToLocalStorage = (state) => {
    localStorage.setItem('cartItems', JSON.stringify(state));
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState: getInitialState(),
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => 
                item.product === newItem.product && 
                item.variantName === newItem.variantName
            );
            
            if (!existingItem) {
                state.items.push({ ...newItem, selected: true });
            } else {
                existingItem.quantity += newItem.quantity;
            }

            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            saveStateToLocalStorage(state);
        },
        
        updateQuantity: (state, action) => {
            const { product, quantity } = action.payload;
            const itemToUpdate = state.items.find(item => item.product === product);
            
            if (itemToUpdate) {
                const diff = quantity - itemToUpdate.quantity;
                state.totalQuantity += diff;
                itemToUpdate.quantity = quantity;
                saveStateToLocalStorage(state);
            }
        },
        
        removeFromCart: (state, action) => {
            const { idProduct, variantName } = action.payload; // Nhận object gồm id và variant
            
            // Lọc bỏ sản phẩm khớp cả ID và Variant
            state.items = state.items.filter(item => 
                !(item.product === idProduct && item.variantName === variantName)
            );
            
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            saveStateToLocalStorage(state);
        },

        toggleSelectItem: (state, action) => {
            const productId = action.payload;
            const item = state.items.find(item => item.product === productId);
            if (item) {
                item.selected = !item.selected;
                saveStateToLocalStorage(state);
            }
        },

        toggleSelectAll: (state, action) => {
            const isSelected = action.payload;
            state.items.forEach(item => {
                item.selected = isSelected;
            });
            saveStateToLocalStorage(state);
        },

        // --- NẠP GIỎ HÀNG TỪ DB (KHI LOGIN) ---
        setCart: (state, action) => {
            const dbItems = action.payload || [];
            state.items = dbItems.map(item => ({
                product: item.product,
                name: item.name,
                image: item.image,
                price: item.price,
                originalPrice: item.originalPrice || item.price,
                stockQuantity: item.stockQuantity || 100,
                quantity: item.amount || item.quantity, 
                selected: false 
            }));
            state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
            saveStateToLocalStorage(state);
        },

        // --- XÓA GIỎ HÀNG (KHI LOGOUT) ---
        resetCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            localStorage.removeItem('cartItems');
        }
    },
})

export const { 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    toggleSelectItem, 
    toggleSelectAll, 
    setCart, 
    resetCart 
} = cartSlice.actions

export default cartSlice.reducer