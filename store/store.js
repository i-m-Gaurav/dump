import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Create store with persistence
const useStore = create(
  persist(
    (set) => ({
      items: [],
      
      // Add a new item to the canvas
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      
      // Update the position of an item
      updateItemPosition: (id, position) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, position } : item
          ),
        })),
      
      // Delete an item
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      
      // Clear all items
      clearItems: () => set({ items: [] }),
    }),
    {
      name: 'canvas-storage', // name for the localStorage key
    }
  )
);

export default useStore;