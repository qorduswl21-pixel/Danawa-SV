import type { CarModel, RadarData, Nation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getRadarData(month: string, nation: Nation): Promise<RadarData | undefined>;
  setRadarData(data: RadarData): Promise<void>;
  getAvailableMonths(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private radarDataStore: Map<string, RadarData>;

  constructor() {
    this.radarDataStore = new Map();
    this.initializeSampleData();
  }

  private getKey(month: string, nation: Nation): string {
    return `${month}-${nation}`;
  }

  private initializeSampleData() {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = prevMonth.getFullYear();
    const month = String(prevMonth.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    const domesticBrands = ["현대", "기아", "제네시스", "르노코리아", "쉐보레", "KG모빌리티"];
    const domesticModels = [
      { name: "그랜저", brand: "현대", base: 8500 },
      { name: "아반떼", brand: "현대", base: 7200 },
      { name: "쏘나타", brand: "현대", base: 4800 },
      { name: "투싼", brand: "현대", base: 5600 },
      { name: "팰리세이드", brand: "현대", base: 4200 },
      { name: "싼타페", brand: "현대", base: 6800 },
      { name: "코나", brand: "현대", base: 3900 },
      { name: "캐스퍼", brand: "현대", base: 4500 },
      { name: "스타리아", brand: "현대", base: 3200 },
      { name: "아이오닉 5", brand: "현대", base: 3800 },
      { name: "아이오닉 6", brand: "현대", base: 2100 },
      { name: "쏘렌토", brand: "기아", base: 7800 },
      { name: "K5", brand: "기아", base: 4600 },
      { name: "K8", brand: "기아", base: 3500 },
      { name: "스포티지", brand: "기아", base: 6200 },
      { name: "셀토스", brand: "기아", base: 4100 },
      { name: "모닝", brand: "기아", base: 2800 },
      { name: "레이", brand: "기아", base: 3300 },
      { name: "카니발", brand: "기아", base: 5500 },
      { name: "EV6", brand: "기아", base: 2600 },
      { name: "EV9", brand: "기아", base: 1800 },
      { name: "니로", brand: "기아", base: 2400 },
      { name: "G80", brand: "제네시스", base: 2200 },
      { name: "GV70", brand: "제네시스", base: 2500 },
      { name: "GV80", brand: "제네시스", base: 2000 },
      { name: "G90", brand: "제네시스", base: 1200 },
      { name: "GV60", brand: "제네시스", base: 900 },
      { name: "QM6", brand: "르노코리아", base: 1800 },
      { name: "트레일블레이저", brand: "쉐보레", base: 2100 },
      { name: "토레스", brand: "KG모빌리티", base: 2800 },
      { name: "티볼리", brand: "KG모빌리티", base: 1600 },
    ];

    const exportBrands = ["BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Volvo", "Lexus", "Toyota", "Honda", "Tesla", "Porsche", "Land Rover", "MINI"];
    const exportModels = [
      { name: "520d", brand: "BMW", base: 1800 },
      { name: "530i", brand: "BMW", base: 1200 },
      { name: "X3", brand: "BMW", base: 1600 },
      { name: "X5", brand: "BMW", base: 900 },
      { name: "3시리즈", brand: "BMW", base: 2200 },
      { name: "iX", brand: "BMW", base: 450 },
      { name: "E-Class", brand: "Mercedes-Benz", base: 1900 },
      { name: "S-Class", brand: "Mercedes-Benz", base: 650 },
      { name: "GLC", brand: "Mercedes-Benz", base: 1700 },
      { name: "GLE", brand: "Mercedes-Benz", base: 800 },
      { name: "EQE", brand: "Mercedes-Benz", base: 380 },
      { name: "A4", brand: "Audi", base: 900 },
      { name: "A6", brand: "Audi", base: 1100 },
      { name: "Q5", brand: "Audi", base: 850 },
      { name: "Q7", brand: "Audi", base: 420 },
      { name: "e-tron GT", brand: "Audi", base: 220 },
      { name: "Tiguan", brand: "Volkswagen", base: 950 },
      { name: "Golf", brand: "Volkswagen", base: 580 },
      { name: "Passat", brand: "Volkswagen", base: 320 },
      { name: "XC60", brand: "Volvo", base: 1100 },
      { name: "XC90", brand: "Volvo", base: 650 },
      { name: "ES300h", brand: "Lexus", base: 1300 },
      { name: "RX350", brand: "Lexus", base: 900 },
      { name: "NX350h", brand: "Lexus", base: 700 },
      { name: "RAV4", brand: "Toyota", base: 1500 },
      { name: "Camry", brand: "Toyota", base: 800 },
      { name: "Model 3", brand: "Tesla", base: 1800 },
      { name: "Model Y", brand: "Tesla", base: 2400 },
      { name: "Model X", brand: "Tesla", base: 180 },
      { name: "Cayenne", brand: "Porsche", base: 480 },
      { name: "Range Rover", brand: "Land Rover", base: 350 },
      { name: "Cooper", brand: "MINI", base: 620 },
    ];

    const generateModels = (
      models: { name: string; brand: string; base: number }[],
      nation: Nation,
      monthStr: string
    ): CarModel[] => {
      const rawModels = models.map((m, index) => {
        const variance = Math.random() * 0.4 - 0.2;
        const sales = Math.round(m.base * (1 + variance));
        const prevVariance = Math.random() * 0.3 - 0.15;
        const prevSales = Math.round(m.base * (1 + prevVariance));
        const momAbs = sales - prevSales;
        const momPct = prevSales > 0 ? momAbs / prevSales : 0;
        const prevRank = index + 1 + Math.round((Math.random() - 0.5) * 6);
        const currentRank = index + 1;
        const rankChange = prevRank - currentRank;
        const isNewEntry = Math.random() < 0.05;

        const zMomAbs = momAbs / 500;
        const zMomPct = Math.min(momPct, 5);
        const zRankChange = rankChange / 5;
        const score = 0.55 * zMomAbs + 0.35 * zMomPct + 0.10 * zRankChange;

        return {
          id: randomUUID(),
          rank: currentRank,
          name: m.name,
          brand: m.brand,
          sales,
          prevSales: isNewEntry ? 0 : prevSales,
          momAbs: isNewEntry ? sales : momAbs,
          momPct: isNewEntry ? 0 : momPct,
          rankChange: isNewEntry ? 0 : rankChange,
          score,
          isNewEntry,
          nation,
          month: monthStr,
          danawaUrl: `https://auto.danawa.com/auto/?Month=${monthStr}-00&Nation=${nation}&Tab=Model&Work=record`,
        };
      });

      rawModels.sort((a, b) => b.score - a.score);

      return rawModels.map((model, index) => ({
        ...model,
        rank: index + 1,
      }));
    };

    const domesticData: RadarData = {
      month: currentMonth,
      nation: "domestic",
      models: generateModels(domesticModels, "domestic", currentMonth),
      fetchedAt: new Date().toISOString(),
    };

    const exportData: RadarData = {
      month: currentMonth,
      nation: "export",
      models: generateModels(exportModels, "export", currentMonth),
      fetchedAt: new Date().toISOString(),
    };

    this.radarDataStore.set(this.getKey(currentMonth, "domestic"), domesticData);
    this.radarDataStore.set(this.getKey(currentMonth, "export"), exportData);

    const prevMonth2 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const year2 = prevMonth2.getFullYear();
    const month2 = String(prevMonth2.getMonth() + 1).padStart(2, "0");
    const prevMonthStr = `${year2}-${month2}`;

    const domesticData2: RadarData = {
      month: prevMonthStr,
      nation: "domestic",
      models: generateModels(domesticModels, "domestic", prevMonthStr),
      fetchedAt: new Date().toISOString(),
    };

    const exportData2: RadarData = {
      month: prevMonthStr,
      nation: "export",
      models: generateModels(exportModels, "export", prevMonthStr),
      fetchedAt: new Date().toISOString(),
    };

    this.radarDataStore.set(this.getKey(prevMonthStr, "domestic"), domesticData2);
    this.radarDataStore.set(this.getKey(prevMonthStr, "export"), exportData2);
  }

  async getRadarData(month: string, nation: Nation): Promise<RadarData | undefined> {
    const key = this.getKey(month, nation);
    return this.radarDataStore.get(key);
  }

  async setRadarData(data: RadarData): Promise<void> {
    const key = this.getKey(data.month, data.nation);
    this.radarDataStore.set(key, data);
  }

  async getAvailableMonths(): Promise<string[]> {
    const months = new Set<string>();
    for (const key of this.radarDataStore.keys()) {
      const [year, month] = key.split("-");
      months.add(`${year}-${month}`);
    }
    return Array.from(months).sort().reverse();
  }
}

export const storage = new MemStorage();
