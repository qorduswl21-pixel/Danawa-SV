import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ModelCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center min-w-[48px]">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-3 w-6 mt-1" />
          </div>

          <div className="flex-1 min-w-0">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
