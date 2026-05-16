import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════
// SOCIAL PROOF - RANDOM NOTIFICATION GENERATOR
// ═══════════════════════════════════════════════════════════════

const PACK_NAMES = ["Starter", "Pro", "Premium"];

const DELAYS = [
  "2 min",
  "3 min",
  "5 min",
  "il y a quelques minutes",
  "quelques instants",
  "10 min",
  "15 min",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isNightHours(): boolean {
  const hour = new Date().getHours();
  return hour >= 0 && hour < 6;
}

function getContextFromPath(path: string): string | null {
  if (path.includes("/tarifs")) return "tarifs";
  if (path.includes("/comparatifs")) {
    if (path.includes("banque")) return "banque";
    if (path.includes("compta") || path.includes("comptabilite")) return "compta";
    if (path.includes("assurance")) return "assurance";
    return null;
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Night hours: 80% chance to skip between 00h and 06h
    if (isNightHours() && Math.random() < 0.8) {
      return NextResponse.json({ skip: true, reason: "night_hours" });
    }

    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get("page") || "/";
    const context = searchParams.get("context") || getContextFromPath(pagePath) || null;
    const seenIds = searchParams.get("seen") ? searchParams.get("seen")!.split(",").map(Number) : [];

    // Auto-seed if tables are empty
    const regionCount = await db.spRegion.count();
    if (regionCount === 0) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        await fetch(`${baseUrl}/api/social-proof/seed?auto=true`);
      } catch {
        // Continue
      }
    }

    // Fetch all needed data in parallel
    const [regions, departments, cities, firstNames, scenarios] = await Promise.all([
      db.spRegion.findMany({ where: { active: true } }),
      db.spDepartment.findMany({ where: { active: true } }),
      db.spCity.findMany({ where: { active: true } }),
      db.spFirstName.findMany({ where: { active: true } }),
      db.spScenario.findMany({
        where: {
          active: true,
          ...(context ? { OR: [{ context: context }, { context: null }] } : {}),
        },
      }),
    ]);

    if (regions.length === 0 || scenarios.length === 0) {
      return NextResponse.json({ skip: true, reason: "no_data" });
    }

    // Filter out already-seen scenarios
    let availableScenarios = scenarios.filter((s) => !seenIds.includes(s.id));
    if (availableScenarios.length === 0) {
      availableScenarios = scenarios;
    }

    // Weighted selection: packs 50%, ressources 30%, activite 20%
    const packs = availableScenarios.filter((s) => s.group === "packs");
    const ressources = availableScenarios.filter((s) => s.group === "ressources");
    const activites = availableScenarios.filter((s) => s.group === "activite");

    let selectedScenario;
    const roll = Math.random();
    if (roll < 0.5 && packs.length > 0) {
      selectedScenario = randomPick(packs);
    } else if (roll < 0.8 && ressources.length > 0) {
      selectedScenario = randomPick(ressources);
    } else if (activites.length > 0) {
      selectedScenario = randomPick(activites);
    } else if (packs.length > 0) {
      selectedScenario = randomPick(packs);
    } else if (ressources.length > 0) {
      selectedScenario = randomPick(ressources);
    } else {
      return NextResponse.json({ skip: true, reason: "no_scenarios" });
    }

    // Build location data
    const selectedRegion = randomPick(regions);
    const regionDepts = departments.filter((d) => d.regionId === selectedRegion.id);
    const selectedDept =
      regionDepts.length > 0 ? randomPick(regionDepts) : randomPick(departments);
    const deptCities = cities.filter((c) => c.departmentId === selectedDept.id);
    const selectedCity = deptCities.length > 0 ? randomPick(deptCities) : randomPick(cities);

    // Pick identity: 25% anonymous
    const useAnonymous = Math.random() < 0.25;
    const selectedName = randomPick(firstNames);

    // Fill template
    let message = selectedScenario.template;

    if (useAnonymous) {
      message = message.replace(
        "{prenom}",
        randomPick(["Un entrepreneur", "Un nouveau membre", "Un freelance", "Un porteur de projet"])
      );
    } else {
      message = message.replace("{prenom}", selectedName.name);
    }

    message = message.replace("{ville}", selectedCity.name);
    message = message.replace("{dept}", selectedDept.name);
    message = message.replace("{region}", selectedRegion.name);
    message = message.replace("{pack}", randomPick(PACK_NAMES));
    message = message.replace("{count}", String(randomInt(3, 47)));
    message = message.replace("{delai}", randomPick(DELAYS));

    return NextResponse.json({
      id: `sp-${Date.now()}-${randomInt(1000, 9999)}`,
      message,
      icon: selectedScenario.icon,
      group: selectedScenario.group,
      scenarioId: selectedScenario.id,
      location: {
        city: selectedCity.name,
        department: selectedDept.name,
        departmentCode: selectedDept.code,
        region: selectedRegion.name,
      },
      displayDuration: 6000,
      nextInterval: randomInt(120000, 480000),
    });
  } catch (error) {
    console.error("Social proof random error:", error);
    return NextResponse.json({ skip: true, reason: "error" }, { status: 500 });
  }
}
