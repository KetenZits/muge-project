import { Skeleton } from "@/components/ui/skeleton";

function Block({ className }: { className: string }) {
  return <Skeleton className={className} />;
}

function CardSkeleton() {
  return (
    <div className="card p-5">
      <Block className="h-11 w-11 rounded-full" />
      <Block className="mt-5 h-5 w-3/4" />
      <Block className="mt-3 h-3 w-full" />
      <Block className="mt-2 h-3 w-4/5" />
      <Block className="mt-5 h-9 w-32 rounded-xl" />
    </div>
  );
}

export function PageLoading({ pathname }: { pathname: string }) {
  if (pathname.startsWith("/messages")) {
    return (
      <div className="card grid min-h-[480px] overflow-hidden md:grid-cols-[270px_1fr]">
        <div className="space-y-4 border-r border-[#e7edf4] p-4">
          <Block className="h-10 w-full rounded-xl" />
          {Array.from({ length: 5 }, (_, index) => (
            <Block key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
        <div className="hidden p-6 md:block">
          <Block className="h-12 w-1/2 rounded-xl" />
          <Block className="mt-10 h-16 w-2/3 rounded-xl" />
          <Block className="ml-auto mt-5 h-16 w-2/3 rounded-xl" />
        </div>
      </div>
    );
  }
  if (pathname.startsWith("/profile")) {
    return (
      <div className="space-y-5">
        <div className="card overflow-hidden">
          <Block className="h-36 w-full rounded-none" />
          <div className="p-6">
            <Block className="h-20 w-20 rounded-full" />
            <Block className="mt-4 h-7 w-1/2" />
            <Block className="mt-3 h-4 w-3/4" />
          </div>
        </div>
        <CardSkeleton />
      </div>
    );
  }
  if (pathname.startsWith("/notifications")) {
    return (
      <div className="card space-y-4 p-5">
        <Block className="h-8 w-1/2" />
        {Array.from({ length: 6 }, (_, index) => (
          <Block key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <Block className="h-9 w-2/3" />
      <Block className="h-11 w-full rounded-xl" />
      <div
        className={
          pathname.startsWith("/home")
            ? "space-y-4"
            : "grid gap-4 md:grid-cols-2"
        }
      >
        {Array.from({ length: 4 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
