import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor } from "@/editor/use-editor";

/** Saves pending work, closes the project and returns to the projects list. */
export function useExitProject() {
	const router = useRouter();
	const editor = useEditor();
	const [isExiting, setIsExiting] = useState(false);

	const exitProject = async () => {
		if (isExiting) return;
		setIsExiting(true);

		try {
			await editor.project.prepareExit();
			editor.project.closeProject();
		} catch (error) {
			console.error("Failed to prepare project exit:", error);
		} finally {
			editor.project.closeProject();
			router.push("/projects");
		}
	};

	return { exitProject, isExiting };
}
