import { db } from "./index";
import type { Draft } from "@/types";

export const draftService = {
  getCurrent: () => db.drafts.get("current"),
  save: (draft: Draft) => db.drafts.put(draft),
  clear: () => db.drafts.delete("current"),
};
