import { create } from "zustand";

/** Whether the Copilot panel is shown in place of the Inspector. */
export const useCopilotStore = create<{
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
}>()((set) => ({
	isOpen: false,
	setOpen: (isOpen) => set({ isOpen }),
}));
