import { ref, computed } from 'vue';
import type { PaginationState } from '@/types/trajet';

export function usePagination(itemsPerPage: number = 500) {
  const state = ref<PaginationState>({
    startValue: 1,
    endValue: itemsPerPage,
    totalItems: 0,
    itemsPerPage
  });

  const canGoPrevious = computed(() => state.value.startValue > 1);
  const canGoNext = computed(() => state.value.endValue < state.value.totalItems);

  const goToFirstPage = () => {
    state.value.startValue = 1;
    state.value.endValue = state.value.itemsPerPage;
  };

  const goToPreviousPage = () => {
    if (canGoPrevious.value) {
      state.value.startValue -= state.value.itemsPerPage;
      state.value.endValue -= state.value.itemsPerPage;
    }
  };

  const goToNextPage = () => {
    if (canGoNext.value) {
      state.value.startValue += state.value.itemsPerPage;
      state.value.endValue += state.value.itemsPerPage;
    }
  };

  const goToLastPage = () => {
    state.value.startValue = state.value.totalItems - state.value.itemsPerPage;
    state.value.endValue = state.value.totalItems;
  };

  const setTotalItems = (total: number) => {
    state.value.totalItems = total;
  };

  return {
    state,
    canGoPrevious,
    canGoNext,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    setTotalItems
  };
}