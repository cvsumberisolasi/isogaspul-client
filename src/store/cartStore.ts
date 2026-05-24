import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, Product } from '../types';
import { calculateTierPrice } from '../api/insforge';
import type { TierPricing } from '../types';

interface CartStore extends CartState {
  addItem: (product: Product, quantity: number, tiers?: TierPricing[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, tiers?: TierPricing[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      shippingCost: 0,
      couponDiscount: 0,
      couponCode: undefined,

      addItem: (product: Product, quantity: number, tiers?: TierPricing[]) => {
        set((state) => {
          const existing = state.items.find(item => item.product.id === product.id);
          if (existing) {
            const newQuantity = existing.quantity + quantity;
            const tierPrice = calculateTierPrice(product.price, newQuantity, tiers);
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity, tier_price: tierPrice }
                  : item
              ),
            };
          }
          const tierPrice = calculateTierPrice(product.price, quantity, tiers);
          return { items: [...state.items, { product, quantity, tier_price: tierPrice }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number, tiers?: TierPricing[]) => {
        set((state) => ({
          items: state.items.map(item => {
            if (item.product.id === productId) {
              const tierPrice = calculateTierPrice(item.product.price, quantity, tiers);
              return { ...item, quantity, tier_price: tierPrice };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, item) => {
        const price = item.tier_price || item.product.price;
        return sum + (price * item.quantity);
      }, 0),
    }),
    { name: 'isogaspul-cart' }
  )
);
