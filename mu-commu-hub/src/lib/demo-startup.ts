let workerPromise: Promise<unknown> | null = null;

// Shared across Strict Mode effect replays and data retries. A failed start must
// be retryable; retaining its rejected promise would permanently poison startup.
export function startMockApi(): Promise<unknown> {
  if (!workerPromise) {
    workerPromise = import("@/mocks/browser")
      .then(async ({ worker }) => {
        try {
          return await worker.start({
            onUnhandledRequest: "bypass",
            serviceWorker: { url: "/mockServiceWorker.js" },
          });
        } catch (error) {
          // MSW can mark its network enabled before registration rejects. Reset
          // that partial start so the next start really enables interception.
          worker.stop();
          throw error;
        }
      })
      .catch((error: unknown) => {
        workerPromise = null;
        throw new Error(
          "The local demo API could not start. Check that this site can use service workers, then try again.",
          { cause: error },
        );
      });
  }
  return workerPromise;
}
