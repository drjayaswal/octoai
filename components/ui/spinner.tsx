import { Loader } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="animate-pulse">
    <Loader
      role="status"
      aria-label="Loading"
      className={cn("size-4 text-fuchsia-700 scale-150 animate-spin", className)}
      {...props}
    />
    </div>
  )
}

export { Spinner }
