import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { randomUUID } from "crypto";

type Nation = "domestic" | "export";

interface CarModel {
  id: string;
  rank: number;
  name: string;
  brand: string;
  sales: number;
  prevSales: number;
  momAbs: number;
  momPct: number;
  rankChange: number;
  score: number;
  isNewEntry: boolean;
  nation: Nation;
  month: string;
  danawaUrl: string;
}

interface RadarData {
  month: string;
  nation: Nation;
  models: CarModel[];
  fetchedAt: string;
}

const domesticModels = [
  { name: "그랜저", brand: "현대", base: 8500 },
  { name: "아반떼", brand: "현대", base: 7200 },
  { name: "쏘나타", brand: "현대", base: 4800 },
  { name: "투싼", brand: "현대", base: 4500 },
  { name: "팰리세이드", brand: "현대", base: 3800 },
  { name: "싼타페", brand: "현대", base: 6200 },
  { name: "코나", brand: "현대", base: 3600 },
  { name: "캐스퍼", brand: "현대", base: 4800 },
  { name: "스타리아", brand: "현대", base: 2700 },
  { name: "아이오닉 5", brand: "현대", base: 3200 },
  { name: "아이오닉 6", brand: "현대", base: 2100 },
  { name: "쏘렌토", brand: "기아", base: 7800 },
  { name: "K5", brand: "기아", base: 4600 },
  { name: "K8", brand: "기아", base: 3200 },
  { name: "스포티지", brand: "기아", base: 5200 },
  { name: "셀토스", brand: "기아", base: 4100 },
  { name: "모닝", brand: "기아", base: 2900 },
  { name: "레이", brand: "기아", base: 3700 },
  { name: "카니발", brand: "기아", base: 5500 },
  { name: "EV6", brand: "기아", base: 2500 },
  { name: "EV9", brand: "기아", base: 1700 },
  { name: "니로", brand: "기아", base: 2600 },
  { name: "G80", brand: "제네시스", base: 2000 },
  { name: "GV70", brand: "제네시스", base: 2400 },
  { name: "GV80", brand: "제네시스", base: 2100 },
  { name: "G90", brand: "제네시스", base: 1200 },
  { name: "GV60", brand: "제네시스", base: 850 },
  { name: "QM6", brand: "르노코리아", base: 1600 },
  { name: "트레일블레이저", brand: "쉐보레", base: 1900 },
  { name: "토레스", brand: "KG모빌리티", base: 2600 },
  { name: "티볼리", brand: "KG모빌리티", base: 1450 },
];

const exportModels = [
  { name: "3시리즈", brand: "BMW", base: 2100 },
  { name: "5시리즈", brand: "BMW", base: 1800 },
  { name: "X3", brand: "BMW", base: 1600 },
  { name: "X5", brand: "BMW", base: 1200 },
  { name: "iX", brand: "BMW", base: 650 },
  { name: "E-클래스", brand: "Mercedes-Benz", base: 1900 },
  { name: "C-클래스", brand: "Mercedes-Benz", base: 1400 },
  { name: "GLC", brand: "Mercedes-Benz", base: 1700 },
  { name: "GLE", brand: "Mercedes-Benz", base: 1100 },
  { name: "EQE", brand: "Mercedes-Benz", base: 580 },
  { name: "A6", brand: "Audi", base: 950 },
  { name: "Q5", brand: "Audi", base: 1100 },
  { name: "e-tron", brand: "Audi", base: 720 },
  { name: "Model Y", brand: "Tesla", base: 3200 },
  { name: "Model 3", brand: "Tesla", base: 2400 },
  { name: "RAV4", brand: "Toyota", base: 980 },
  { name: "Camry", brand: "Toyota", base: 750 },
  { name: "ES", brand: "Lexus", base: 680 },
  { name: "RX", brand: "Lexus", base: 820 },
  { name: "Cayenne", brand: "Porsche", base: 540 },
  { name: "Macan", brand: "Porsche", base: 680 },
  { name: "Taycan", brand: "Porsche", base: 420 },
  { name: "XC60", brand: "Volvo", base: 890 },
  { name: "XC90", brand: "Volvo", base: 520 },
  { name: "Discovery", brand: "Land Rover", base: 380 },
  { name: "Range Rover", brand: "Land Rover", base: 350 },
  { name: "Cooper", brand: "MINI", base: 620 },
];

function getAvailableMonths(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
  }
  return months;
}

function generateModels(
  models: { name: string; brand: string; base: number }[],
  nation: Nation,
  monthStr: string
): CarModel[] {
  const seed = monthStr.replace("-", "") + nation;
  let seedNum = 0;
  for (let i = 0; i < seed.length; i++) {
    seedNum += seed.charCodeAt(i);
  }
  
  const seededRandom = (index: number) => {
    const x = Math.sin(seedNum + index) * 10000;
    return x - Math.floor(x);
  };

  const rawModels = models.map((m, index) => {
    const variance = seededRandom(index) * 0.4 - 0.2;
    const sales = Math.round(m.base * (1 + variance));
    const prevVariance = seededRandom(index + 100) * 0.3 - 0.15;
    const prevSales = Math.round(m.base * (1 + prevVariance));
    const momAbs = sales - prevSales;
    const momPct = prevSales > 0 ? momAbs / prevSales : 0;
    const prevRank = index + 1 + Math.round((seededRandom(index + 200) - 0.5) * 6);
    const currentRank = index + 1;
    const rankChange = prevRank - currentRank;
    const isNewEntry = seededRandom(index + 300) < 0.05;

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
}

function getRadarData(month: string, nation: Nation): RadarData {
  const models = nation === "domestic" ? domesticModels : exportModels;
  return {
    month,
    nation,
    models: generateModels(models, nation, month),
    fetchedAt: new Date().toISOString(),
  };
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace("/.netlify/functions/api", "").replace("/api", "");
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (path === "/radar/months" || path === "/radar/months/") {
    const months = getAvailableMonths();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ months }),
    };
  }

  if (path === "/radar" || path === "/radar/") {
    const params = event.queryStringParameters || {};
    const month = params.month || getAvailableMonths()[0];
    const nation = (params.nation as Nation) || "domestic";

    if (nation !== "domestic" && nation !== "export") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Invalid nation parameter" }),
      };
    }

    const data = getRadarData(month, nation);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: "Not found" }),
  };
};

export { handler };
