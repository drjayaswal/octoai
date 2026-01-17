import { Loader } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="absolute top-1/2 left-1/2 animate-pulse">
    <Loader
      role="status"
      aria-label="Loading"
      className={cn("size-4 text-white scale-150 animate-spin", className)}
      {...props}
    />
    </div>
  )
}

export { Spinner }
