export function storageErrorMessage(error: unknown, action = "save your post") {
  const name =
    error instanceof Error ? `${error.name} ${error.message}` : String(error);
  if (/quota|disk.*full|storage.*full/i.test(name)) {
    return "This browser's storage is full. Free up space or remove a photo, then try again. Your unfinished post is still open.";
  }
  if (/security|denied|InvalidState|UnknownError|open.*database/i.test(name)) {
    return "Local browser storage is unavailable. Enable site storage and try again. Your unfinished post is still open.";
  }
  return error instanceof Error && error.message
    ? error.message
    : `Could not ${action}. Please try again.`;
}
