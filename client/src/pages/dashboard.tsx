import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/theme-toggle";
import { MonthSelector } from "@/components/month-selector";
import { NationToggle } from "@/components/nation-toggle";
import { FilterControls } from "@/components/filter-controls";
import { ModelCard } from "@/components/model-card";
import { ModelCardSkeleton } from "@/components/model-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Nation, RadarData } from "@shared/schema";

function getDefaultMonth(): string {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = prevMonth.getFullYear();
  const month = String(prevMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
  const [nation, setNation] = useState<Nation>("domestic");
  const [minSales, setMinSales] = useState(300);
  const [excludeNewEntries, setExcludeNewEntries] = useState(false);

  const { data: monthsData, isLoading: monthsLoading } = useQuery<{ months: string[] }>({
    queryKey: ["/api/radar/months"],
  });

  const availableMonths = useMemo(() => {
    return monthsData?.months || [getDefaultMonth()];
  }, [monthsData]);

  useEffect(() => {
    if (availableMonths.length > 0 && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  const radarUrl = `/api/radar?month=${encodeURIComponent(selectedMonth)}&nation=${encodeURIComponent(nation)}`;
  
  const { data, isLoading, isError, refetch, isFetching } = useQuery<RadarData>({
    queryKey: [radarUrl],
  });

  const filteredModels = useMemo(() => {
    if (!data?.models) return [];
    return data.models
      .filter((model) => {
        if (model.sales < minSales) return false;
        if (excludeNewEntries && model.isNewEntry) return false;
        return true;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, [data?.models, minSales, excludeNewEntries]);

  const stats = useMemo(() => {
    if (!data?.models) return null;
    const total = data.models.reduce((sum, m) => sum + m.sales, 0);
    const rising = data.models.filter((m) => m.momAbs > 0).length;
    return { total, rising, count: data.models.length };
  }, [data?.models]);

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    return `${year}년 ${parseInt(monthNum)}월`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">급상승 레이더</h1>
                <p className="text-xs text-muted-foreground">다나와 자동차 판매 분석</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <MonthSelector
                value={selectedMonth}
                onChange={setSelectedMonth}
                availableMonths={availableMonths}
                isLoading={monthsLoading}
              />
              <NationToggle value={nation} onChange={setNation} />
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isFetching}
                data-testid="button-refresh"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 shrink-0 space-y-4">
            <FilterControls
              minSales={minSales}
              onMinSalesChange={setMinSales}
              excludeNewEntries={excludeNewEntries}
              onExcludeNewEntriesChange={setExcludeNewEntries}
            />

            {stats && !isLoading && (
              <div className="space-y-3 p-4 rounded-lg border bg-card">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {formatMonth(selectedMonth)} 통계
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">전체 모델</div>
                    <div className="font-semibold">{stats.count}개</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">상승 모델</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">{stats.rising}개</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground text-xs">총 판매량</div>
                    <div className="font-semibold">{new Intl.NumberFormat("ko-KR").format(stats.total)}대</div>
                  </div>
                </div>
              </div>
            )}
          </aside>

          <section className="flex-1">
            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {nation === "domestic" ? "국산" : "수입"}차 급상승 Top 20
                </h2>
                {data?.fetchedAt && (
                  <Badge variant="secondary" className="text-xs">
                    {new Date(data.fetchedAt).toLocaleDateString("ko-KR")} 갱신
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredModels.length}개 모델
              </span>
            </div>

            {isError && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">데이터를 불러올 수 없습니다</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  잠시 후 다시 시도해 주세요
                </p>
                <Button onClick={() => refetch()} data-testid="button-retry">
                  다시 시도
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ModelCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoading && !isError && filteredModels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">필터 조건에 맞는 모델이 없습니다</h3>
                <p className="text-sm text-muted-foreground">
                  필터 조건을 조정해 보세요
                </p>
              </div>
            )}

            {!isLoading && !isError && filteredModels.length > 0 && (
              <div className="space-y-3">
                {filteredModels.map((model, index) => (
                  <ModelCard key={model.id} model={model} displayRank={index + 1} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground space-y-1">
          <p>
            데이터 출처: <a href="https://auto.danawa.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">다나와 자동차</a> (KAMA/KAIDA 공식 자료 기반)
          </p>
          <p>본 서비스는 다나와 원문 데이터 재배포 없이 파생 지표만 제공합니다.</p>
        </div>
      </footer>
    </div>
  );
}
