// Données du mémo stratégie US (référence : 1–3 juillet 2026).
// Sert de seed initial — tout est modifiable ensuite dans l'application.

export type Block = "coeur" | "satellite" | "speculatif" | "crypto" | "hedge" | "cash";

export interface AssetSeed {
  ticker: string;
  name: string;
  block: Block;
  targetPct: number;
  aiFactor: boolean;
  buyLow?: number;
  buyHigh?: number;
  tp1Low?: number;
  tp1High?: number;
  objLow?: number;
  objHigh?: number;
  stopPrice?: number;
  stopKind: "close" | "weekly_close" | "alert" | "none";
  stopNote?: string;
  timing?: string;
  thesis: string;
  risk: string;
}

export const ASSET_SEEDS: AssetSeed[] = [
  // ——— Cœur (43 %) ———
  {
    ticker: "NVDA", name: "Nvidia", block: "coeur", targetPct: 12, aiFactor: true,
    buyLow: 185, buyHigh: 197, tp1Low: 230, tp1High: 236, objLow: 280, objHigh: 300,
    stopPrice: 165, stopKind: "weekly_close",
    stopNote: "Clôture hebdo < 165 OU guidance capex hyperscaler en baisse",
    timing: "Maintenant (sur MM200 ≈ 190)",
    thesis: "Plateforme compute IA n°1", risk: "Compression du multiple",
  },
  {
    ticker: "AVGO", name: "Broadcom", block: "coeur", targetPct: 7, aiFactor: true,
    buyLow: 330, buyHigh: 365, tp1Low: 450, tp1High: 465, objLow: 520, objHigh: 550,
    stopPrice: 295, stopKind: "close", timing: "Maintenant, par tiers",
    thesis: "ASIC + networking IA", risk: "Concentration clients",
  },
  {
    ticker: "AMD", name: "AMD", block: "coeur", targetPct: 7, aiFactor: true,
    buyLow: 460, buyHigh: 510, tp1Low: 650, tp1High: 680, objLow: 750, objHigh: 800,
    stopPrice: 420, stopKind: "close", timing: "1/3 maintenant",
    thesis: "Data center, rattrapage", risk: "Exécution vs NVDA",
  },
  {
    ticker: "GOOGL", name: "Alphabet", block: "coeur", targetPct: 6, aiFactor: true,
    buyLow: 330, buyHigh: 360, tp1Low: 430, tp1High: 450, objLow: 480, objHigh: 500,
    stopPrice: 300, stopKind: "close", timing: "Maintenant",
    thesis: "IA appliquée + hedge intra-tech", risk: "Antitrust",
  },
  {
    ticker: "JPM", name: "JPMorgan Chase", block: "coeur", targetPct: 6, aiFactor: false,
    buyLow: 315, buyHigh: 336, tp1Low: 385, tp1High: 400, objLow: 420, objHigh: 440,
    stopPrice: 285, stopKind: "close", timing: "Maintenant",
    thesis: "NII, qualité, value", risk: "Crédit",
  },
  {
    ticker: "GS", name: "Goldman Sachs", block: "coeur", targetPct: 5, aiFactor: false,
    buyLow: 950, buyHigh: 1025, tp1Low: 1200, tp1High: 1250, objLow: 1350, objHigh: 1400,
    stopPrice: 870, stopKind: "close", timing: "Maintenant",
    thesis: "Levier M&A / IPO", risk: "Marchés cycliques",
  },
  // ——— Satellites (33 %) ———
  {
    ticker: "MU", name: "Micron", block: "satellite", targetPct: 8, aiFactor: true,
    buyLow: 880, buyHigh: 960, tp1Low: 1230, tp1High: 1255, objLow: 1450, objHigh: 1550,
    stopPrice: 800, stopKind: "weekly_close",
    stopNote: "Clôture hebdo < 800 OU 2 mois de baisse spot DRAM/NAND OU capex hyperscaler en baisse. Règle de cycle : signal spot en baisse → vendre 50 % immédiat, solde sous 20 séances. Jamais moyenner à la baisse.",
    timing: "ATTENDRE (couteau qui tombe, zone = MM200)",
    thesis: "LA ligne mémoire (HBM/DRAM)", risk: "Cyclicité brutale",
  },
  {
    ticker: "GEV", name: "GE Vernova", block: "satellite", targetPct: 6, aiFactor: true,
    buyLow: 980, buyHigh: 1060, tp1Low: 1350, tp1High: 1400, objLow: 1500, objHigh: 1600,
    stopPrice: 900, stopKind: "close", timing: "Attendre repli",
    thesis: "Turbines / réseau = électricité de l'IA", risk: "Valorisation du secteur",
  },
  {
    ticker: "XOM", name: "ExxonMobil", block: "satellite", targetPct: 6, aiFactor: false,
    buyLow: 124, buyHigh: 137, tp1Low: 155, tp1High: 160, objLow: 170, objHigh: 180,
    stopKind: "none", stopNote: "Pas de stop serré ; réduire si brut < 60 $ durable",
    timing: "Maintenant (hedge)",
    thesis: "Hedge pétrole / Iran, dividende", risk: "Normalisation du brut",
  },
  {
    ticker: "VRT", name: "Vertiv", block: "satellite", targetPct: 5, aiFactor: true,
    buyLow: 270, buyHigh: 305, tp1Low: 380, tp1High: 400, objLow: 450, objHigh: 470,
    stopPrice: 245, stopKind: "close", timing: "1/2 maintenant",
    thesis: "Power & cooling data centers", risk: "Corrélé au capex IA",
  },
  {
    ticker: "ABBV", name: "AbbVie", block: "satellite", targetPct: 5, aiFactor: false,
    buyLow: 235, buyHigh: 251, tp1Low: 290, tp1High: 300, objLow: 315, objHigh: 330,
    stopPrice: 215, stopKind: "close", timing: "Maintenant",
    thesis: "Santé value / défensive", risk: "Brevets",
  },
  {
    ticker: "LYFT", name: "Lyft", block: "satellite", targetPct: 3, aiFactor: false,
    buyLow: 13, buyHigh: 14.5, tp1Low: 18, tp1High: 19, objLow: 22, objHigh: 25,
    stopPrice: 11.8, stopKind: "close",
    stopNote: "Clôture < 11,80 OU guidance cassée (résultats 12 août)",
    timing: "Maintenant OK",
    thesis: "Diversification sectorielle (conso, hors IA)", risk: "Robotaxi + conso",
  },
  // ——— Spéculatif (8 %) ———
  {
    ticker: "CRWV", name: "CoreWeave", block: "speculatif", targetPct: 5, aiFactor: true,
    buyLow: 66, buyHigh: 78, tp1Low: 130, tp1High: 143, objLow: 160, objHigh: 185,
    stopPrice: 62, stopKind: "close",
    stopNote: "Clôture < 62 → coupe ; OU Meta vend sa capacité cloud → coupe immédiate. Alternative d'entrée : reconquête > 100–103.",
    timing: "ATTENDRE : (a) 66–78 stabilisé ou (b) reconquête > 100–103",
    thesis: "Neocloud, levier pur du capex IA", risk: "Concurrence Meta, dette",
  },
  {
    ticker: "COHR", name: "Coherent", block: "speculatif", targetPct: 3, aiFactor: true,
    buyLow: 300, buyHigh: 340, tp1Low: 450, tp1High: 470, objLow: 520, objHigh: 560,
    stopPrice: 270, stopKind: "close", timing: "1/2 max maintenant",
    thesis: "Optique / interconnexion IA", risk: "Beta élevé",
  },
  // ——— Crypto (2 %) ———
  {
    ticker: "IBIT", name: "iShares Bitcoin Trust", block: "crypto", targetPct: 2, aiFactor: false,
    stopKind: "alert",
    stopNote: "BTC support 56 200 $ ; zone 50–53k s'ouvre sous 56 200. Signal d'entrée : inflows nets 1 sem.+ ou cassure BTC > 63 800 $.",
    timing: "ATTENDRE / DCA",
    thesis: "Pari de cycle BTC (massacré)", risk: "-40/50 % possible",
  },
  // ——— Hedge (14 %) ———
  {
    ticker: "NEM", name: "Newmont", block: "hedge", targetPct: 4, aiFactor: false,
    buyLow: 85, buyHigh: 95, tp1Low: 115, tp1High: 120, objLow: 130, objHigh: 140,
    stopPrice: 78, stopKind: "alert",
    stopNote: "Alerte < 78 ; invalidation : désinflation + Fed dovish",
    timing: "Maintenant",
    thesis: "Or = hedge stagflation", risk: "C'est une action (beta)",
  },
  {
    ticker: "SGOV", name: "iShares 0-3M Treasury (cash)", block: "cash", targetPct: 10, aiFactor: false,
    stopKind: "none", timing: "Munition permanente",
    thesis: "Munition + seul actif qui gagne si la Fed monte", risk: "Coût d'opportunité",
  },
];

export const CHECKLIST_SEEDS: { label: string; category: string; due?: string }[] = [
  { label: "Revérifier tous les cours + MM50/MM200 exactes (MU, CRWV, NVDA, IBIT, LYFT bougent de 3-13 %/séance)", category: "Avant exécution" },
  { label: "Probabilité de hausse Fed (CME FedWatch)", category: "Macro" },
  { label: "Prix spot DRAM/NAND — signal de sortie MU", category: "Signaux" },
  { label: "Guidances capex hyperscalers (MSFT/GOOGL/META/AMZN — résultats fin juillet)", category: "Signaux", due: "2026-07-31" },
  { label: "Dossier CRWV / Meta (concurrence cloud)", category: "Signaux" },
  { label: "P/E forward sectoriels (FactSet Earnings Insight, chaque vendredi)", category: "Macro" },
  { label: "Tenue cessez-le-feu Iran + prix WTI (impact XOM + inflation)", category: "Macro" },
  { label: "13F Situational Awareness (positions au 30 juin) — short 4 lignes cœur, à LIRE pas à copier", category: "Signaux", due: "2026-08-14" },
  { label: "Résultats LYFT", category: "Résultats", due: "2026-08-12" },
  { label: "Résultats NVDA", category: "Résultats", due: "2026-08-26" },
  { label: "Résultats MU", category: "Résultats", due: "2026-09-30" },
  { label: "Flux ETF Bitcoin — signal de bottom IBIT = retour des inflows nets", category: "Signaux" },
  { label: "Volet pratique : compte mineur via parent (IBKR), enveloppe CTO, change EUR/USD, résidence fiscale Croatie", category: "Pratique" },
];

// Règles transverses de sortie / rééquilibrage (affichées dans l'app)
export const RULES = [
  "Écrêtage : ligne > 1,5× son poids cible → ramener à la cible.",
  "MU = règle de cycle, pas de prix : spot DRAM/NAND en baisse → vendre 50 % immédiat, solde sous 20 séances. Jamais moyenner à la baisse sur la mémoire.",
  "Spéculatif : -35 % sans nouvelle → couper la moitié ; thèse cassée → couper 100 %.",
  "Take profit : +100 % → vendre 25-30 %.",
  "Trigger macro : 2 hausses Fed cumulées OU 10 ans US > 5,25 % → réduire le bloc IA de ~55 % vers ~40 %.",
  "Revue à chaque saison de résultats (juil./oct./janv./avr.) + rééquilibrage semestriel.",
  "Stops = CLÔTURES (pas de mèches intraday). Un stop « événement » prime toujours sur le stop prix.",
  "Corrélations interdites : pas de SNDK/WDC/STX en plus de MU ; pas de NBIS en plus de CRWV ; pas d'ETN en plus de GEV+VRT.",
  "Exclusions = SWAPS, jamais des ajouts : MSFT, META (swap GOOGL possible), RDDT, VST (swap GEV), MRVL (swap COHR), BE.",
];

export const BLOCK_LABELS: Record<Block, string> = {
  coeur: "Cœur",
  satellite: "Satellites",
  speculatif: "Spéculatif",
  crypto: "Crypto",
  hedge: "Hedge",
  cash: "Cash",
};

export const BLOCK_ORDER: Block[] = ["coeur", "satellite", "speculatif", "crypto", "hedge", "cash"];

export const DEFAULT_SETTINGS: Record<string, string> = {
  portfolio_target_usd: "15000",
  monthly_dca_usd: "2200",
  monthly_dca_eur: "2000",
};
