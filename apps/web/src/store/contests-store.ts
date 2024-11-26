import { create } from "zustand";
import { Contest } from "@kraft/types";
import * as contestService from "@/services/contests-service";

interface ContestState {
  contests: Contest[];
  loading: boolean;
  error: string | null;
  fetchContests: () => Promise<void>;
  setContests: (contests: Contest[]) => void;
}

export const useContestStore = create<ContestState>((set, get) => ({
  contests: [],
  loading: false,
  error: null,

  fetchContests: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const contests = await contestService.fetchAllContests();
      set({ contests, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setContests: (contests) => {
    set({ contests });
  },
}));
