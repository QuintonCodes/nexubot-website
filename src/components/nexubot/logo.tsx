import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/nexubot-logo.svg"
        alt="Nexubot"
        width={48}
        height={48}
        className="size-12"
        priority
      />
      {showWordmark && (
        <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
          <span className="text-brand-blue">Nexu</span>
          <span className="text-brand-green">bot</span>
        </span>
      )}
    </div>
  );
}
