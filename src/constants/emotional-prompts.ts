import type { Mood } from "@/types";

export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: "excited", label: "Excited", emoji: "🎉" },
  { value: "confident", label: "Confident", emoji: "💪" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "overwhelmed", label: "Overwhelmed", emoji: "😵" },
  { value: "frustrated", label: "Frustrated", emoji: "😤" },
];

export const STAGE_PROMPTS: Record<string, string> = {
  // Buyer stages
  "Pre-Approval":
    "Getting pre-approved is a big first step. How are you feeling about your finances and readiness?",
  "House Hunting":
    "Searching for the right home can be exciting and tiring. How is the process going for you?",
  "Under Contract":
    "You have an accepted offer - things are moving! How are you feeling about the next steps?",
  "Inspections & Appraisal":
    "Waiting on inspections and appraisals can feel uncertain. How are you handling it?",
  Closing:
    "You are almost at the finish line! How are you feeling as closing day approaches?",

  // Seller stages
  "Pre-Listing":
    "Getting your home ready to list is a lot of work. How are you feeling about the preparation?",
  "Active Listing":
    "Your home is on the market. How are you handling showings and the waiting?",

  // Default
  default:
    "Take a moment to check in with yourself. How are you feeling about your real estate journey right now?",
};

export function getPromptForStage(stage: string): string {
  return STAGE_PROMPTS[stage] || STAGE_PROMPTS["default"];
}
