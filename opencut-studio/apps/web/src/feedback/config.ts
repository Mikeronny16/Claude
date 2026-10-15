// Feedback posts to a server database. Builds without one (OpenCut Studio
// desktop) hide the feedback button. Read in client code, so it must be a
// NEXT_PUBLIC_ variable that Next inlines at build time.
export const isFeedbackEnabled =
	process.env.NEXT_PUBLIC_FEEDBACK_ENABLED === "true";
