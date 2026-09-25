import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="card flex flex-col items-center px-6 py-10 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4e8] text-[#9d6328]">
        <AlertCircle size={22} />
      </span>
      <h2 className="mt-4 text-base font-bold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-[#718096]">{description}</p>
      <Button
        className="mt-5 bg-[#17468c] text-white hover:bg-[#0f3672]"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}
