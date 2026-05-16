import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// ═══════════════════════════════════════════════════════════════
// DATA DEFINITIONS
// ═══════════════════════════════════════════════════════════════

const REGIONS: { name: string }[] = [
  { name: "Auvergne-Rhône-Alpes" },
  { name: "Bourgogne-Franche-Comté" },
  { name: "Bretagne" },
  { name: "Centre-Val de Loire" },
  { name: "Corse" },
  { name: "Grand Est" },
  { name: "Hauts-de-France" },
  { name: "Île-de-France" },
  { name: "Normandie" },
  { name: "Nouvelle-Aquitaine" },
  { name: "Occitanie" },
  { name: "Pays de la Loire" },
  { name: "Provence-Alpes-Côte d'Azur" },
];

const DEPARTMENTS: { code: string; name: string; regionName: string }[] = [
  // Auvergne-Rhône-Alpes
  { code: "01", name: "Ain", regionName: "Auvergne-Rhône-Alpes" },
  { code: "03", name: "Allier", regionName: "Auvergne-Rhône-Alpes" },
  { code: "07", name: "Ardèche", regionName: "Auvergne-Rhône-Alpes" },
  { code: "15", name: "Cantal", regionName: "Auvergne-Rhône-Alpes" },
  { code: "26", name: "Drôme", regionName: "Auvergne-Rhône-Alpes" },
  { code: "38", name: "Isère", regionName: "Auvergne-Rhône-Alpes" },
  { code: "42", name: "Loire", regionName: "Auvergne-Rhône-Alpes" },
  { code: "43", name: "Haute-Loire", regionName: "Auvergne-Rhône-Alpes" },
  { code: "63", name: "Puy-de-Dôme", regionName: "Auvergne-Rhône-Alpes" },
  { code: "69", name: "Rhône", regionName: "Auvergne-Rhône-Alpes" },
  { code: "73", name: "Savoie", regionName: "Auvergne-Rhône-Alpes" },
  { code: "74", name: "Haute-Savoie", regionName: "Auvergne-Rhône-Alpes" },
  // Bourgogne-Franche-Comté
  { code: "21", name: "Côte-d'Or", regionName: "Bourgogne-Franche-Comté" },
  { code: "25", name: "Doubs", regionName: "Bourgogne-Franche-Comté" },
  { code: "39", name: "Jura", regionName: "Bourgogne-Franche-Comté" },
  { code: "58", name: "Nièvre", regionName: "Bourgogne-Franche-Comté" },
  { code: "70", name: "Haute-Saône", regionName: "Bourgogne-Franche-Comté" },
  { code: "71", name: "Saône-et-Loire", regionName: "Bourgogne-Franche-Comté" },
  { code: "89", name: "Yonne", regionName: "Bourgogne-Franche-Comté" },
  { code: "90", name: "Territoire de Belfort", regionName: "Bourgogne-Franche-Comté" },
  // Bretagne
  { code: "22", name: "Côtes-d'Armor", regionName: "Bretagne" },
  { code: "29", name: "Finistère", regionName: "Bretagne" },
  { code: "35", name: "Ille-et-Vilaine", regionName: "Bretagne" },
  { code: "56", name: "Morbihan", regionName: "Bretagne" },
  // Centre-Val de Loire
  { code: "18", name: "Cher", regionName: "Centre-Val de Loire" },
  { code: "28", name: "Eure-et-Loir", regionName: "Centre-Val de Loire" },
  { code: "36", name: "Indre", regionName: "Centre-Val de Loire" },
  { code: "37", name: "Indre-et-Loire", regionName: "Centre-Val de Loire" },
  { code: "41", name: "Loir-et-Cher", regionName: "Centre-Val de Loire" },
  { code: "45", name: "Loiret", regionName: "Centre-Val de Loire" },
  // Corse
  { code: "2A", name: "Corse-du-Sud", regionName: "Corse" },
  { code: "2B", name: "Haute-Corse", regionName: "Corse" },
  // Grand Est
  { code: "08", name: "Ardennes", regionName: "Grand Est" },
  { code: "10", name: "Aube", regionName: "Grand Est" },
  { code: "51", name: "Marne", regionName: "Grand Est" },
  { code: "52", name: "Haute-Marne", regionName: "Grand Est" },
  { code: "54", name: "Meurthe-et-Moselle", regionName: "Grand Est" },
  { code: "55", name: "Meuse", regionName: "Grand Est" },
  { code: "57", name: "Moselle", regionName: "Grand Est" },
  { code: "67", name: "Bas-Rhin", regionName: "Grand Est" },
  { code: "68", name: "Haut-Rhin", regionName: "Grand Est" },
  { code: "88", name: "Vosges", regionName: "Grand Est" },
  // Hauts-de-France
  { code: "02", name: "Aisne", regionName: "Hauts-de-France" },
  { code: "59", name: "Nord", regionName: "Hauts-de-France" },
  { code: "60", name: "Oise", regionName: "Hauts-de-France" },
  { code: "62", name: "Pas-de-Calais", regionName: "Hauts-de-France" },
  { code: "80", name: "Somme", regionName: "Hauts-de-France" },
  // Île-de-France
  { code: "75", name: "Paris", regionName: "Île-de-France" },
  { code: "77", name: "Seine-et-Marne", regionName: "Île-de-France" },
  { code: "78", name: "Yvelines", regionName: "Île-de-France" },
  { code: "91", name: "Essonne", regionName: "Île-de-France" },
  { code: "92", name: "Hauts-de-Seine", regionName: "Île-de-France" },
  { code: "93", name: "Seine-Saint-Denis", regionName: "Île-de-France" },
  { code: "94", name: "Val-de-Marne", regionName: "Île-de-France" },
  { code: "95", name: "Val-d'Oise", regionName: "Île-de-France" },
  // Normandie
  { code: "14", name: "Calvados", regionName: "Normandie" },
  { code: "27", name: "Eure", regionName: "Normandie" },
  { code: "50", name: "Manche", regionName: "Normandie" },
  { code: "61", name: "Orne", regionName: "Normandie" },
  { code: "76", name: "Seine-Maritime", regionName: "Normandie" },
  // Nouvelle-Aquitaine
  { code: "16", name: "Charente", regionName: "Nouvelle-Aquitaine" },
  { code: "17", name: "Charente-Maritime", regionName: "Nouvelle-Aquitaine" },
  { code: "19", name: "Corrèze", regionName: "Nouvelle-Aquitaine" },
  { code: "23", name: "Creuse", regionName: "Nouvelle-Aquitaine" },
  { code: "24", name: "Dordogne", regionName: "Nouvelle-Aquitaine" },
  { code: "33", name: "Gironde", regionName: "Nouvelle-Aquitaine" },
  { code: "40", name: "Landes", regionName: "Nouvelle-Aquitaine" },
  { code: "47", name: "Lot-et-Garonne", regionName: "Nouvelle-Aquitaine" },
  { code: "64", name: "Pyrénées-Atlantiques", regionName: "Nouvelle-Aquitaine" },
  { code: "79", name: "Deux-Sèvres", regionName: "Nouvelle-Aquitaine" },
  { code: "86", name: "Vienne", regionName: "Nouvelle-Aquitaine" },
  { code: "87", name: "Haute-Vienne", regionName: "Nouvelle-Aquitaine" },
  // Occitanie
  { code: "09", name: "Ariège", regionName: "Occitanie" },
  { code: "11", name: "Aude", regionName: "Occitanie" },
  { code: "12", name: "Aveyron", regionName: "Occitanie" },
  { code: "30", name: "Gard", regionName: "Occitanie" },
  { code: "31", name: "Haute-Garonne", regionName: "Occitanie" },
  { code: "32", name: "Gers", regionName: "Occitanie" },
  { code: "34", name: "Hérault", regionName: "Occitanie" },
  { code: "46", name: "Lot", regionName: "Occitanie" },
  { code: "48", name: "Lozère", regionName: "Occitanie" },
  { code: "65", name: "Hautes-Pyrénées", regionName: "Occitanie" },
  { code: "66", name: "Pyrénées-Orientales", regionName: "Occitanie" },
  { code: "81", name: "Tarn", regionName: "Occitanie" },
  { code: "82", name: "Tarn-et-Garonne", regionName: "Occitanie" },
  // Pays de la Loire
  { code: "44", name: "Loire-Atlantique", regionName: "Pays de la Loire" },
  { code: "49", name: "Maine-et-Loire", regionName: "Pays de la Loire" },
  { code: "53", name: "Mayenne", regionName: "Pays de la Loire" },
  { code: "72", name: "Sarthe", regionName: "Pays de la Loire" },
  { code: "85", name: "Vendée", regionName: "Pays de la Loire" },
  // Provence-Alpes-Côte d'Azur
  { code: "04", name: "Alpes-de-Haute-Provence", regionName: "Provence-Alpes-Côte d'Azur" },
  { code: "05", name: "Hautes-Alpes", regionName: "Provence-Alpes-Côte d'Azur" },
  { code: "06", name: "Alpes-Maritimes", regionName: "Provence-Alpes-Côte d'Azur" },
  { code: "13", name: "Bouches-du-Rhône", regionName: "Provence-Alpes-Côte d'Azur" },
  { code: "83", name: "Var", regionName: "Provence-Alpes-Côte d'Azur" },
  { code: "84", name: "Vaucluse", regionName: "Provence-Alpes-Côte d'Azur" },
];

type CityEntry = { name: string; deptCode: string; population: number };

const CITIES: CityEntry[] = [
  // ══════════════ ÎLE-DE-FRANCE (75, 77, 78, 91, 92, 93, 94, 95) ══════════════
  // 75 Paris
  { name: "Paris", deptCode: "75", population: 2161000 },
  // 77 Seine-et-Marne
  { name: "Meaux", deptCode: "77", population: 55800 },
  { name: "Melun", deptCode: "77", population: 41300 },
  { name: "Chelles", deptCode: "77", population: 54600 },
  { name: "Bussy-Saint-Georges", deptCode: "77", population: 31000 },
  { name: "Montereau-Fault-Yonne", deptCode: "77", population: 21000 },
  { name: "Pontault-Combault", deptCode: "77", population: 38600 },
  // 78 Yvelines
  { name: "Versailles", deptCode: "78", population: 86200 },
  { name: "Mantes-la-Jolie", deptCode: "78", population: 44800 },
  { name: "Sartrouville", deptCode: "78", population: 53400 },
  { name: "Rambouillet", deptCode: "78", population: 27200 },
  { name: "Poissy", deptCode: "78", population: 38000 },
  { name: "Les Mureaux", deptCode: "78", population: 32800 },
  { name: "Plaisir", deptCode: "78", population: 31500 },
  // 91 Essonne
  { name: "Évry-Courcouronnes", deptCode: "91", population: 62000 },
  { name: "Corbeil-Essonnes", deptCode: "91", population: 52400 },
  { name: "Massy", deptCode: "91", population: 48700 },
  { name: "Palaiseau", deptCode: "91", population: 36400 },
  { name: "Viry-Châtillon", deptCode: "91", population: 31600 },
  { name: "Grigny", deptCode: "91", population: 29000 },
  { name: "Ris-Orangis", deptCode: "91", population: 28800 },
  // 92 Hauts-de-Seine
  { name: "Boulogne-Billancourt", deptCode: "92", population: 116000 },
  { name: "Nanterre", deptCode: "92", population: 95000 },
  { name: "Colombes", deptCode: "92", population: 87500 },
  { name: "Asnières-sur-Seine", deptCode: "92", population: 87200 },
  { name: "Rueil-Malmaison", deptCode: "92", population: 79300 },
  { name: "Courbevoie", deptCode: "92", population: 73600 },
  { name: "Antony", deptCode: "92", population: 62800 },
  { name: "Levallois-Perret", deptCode: "92", population: 65000 },
  { name: "Issy-les-Moulineaux", deptCode: "92", population: 68800 },
  { name: "Clamart", deptCode: "92", population: 54500 },
  { name: "Suresnes", deptCode: "92", population: 49000 },
  { name: "Puteaux", deptCode: "92", population: 44600 },
  { name: "Neuilly-sur-Seine", deptCode: "92", population: 62200 },
  // 93 Seine-Saint-Denis
  { name: "Saint-Denis", deptCode: "93", population: 113300 },
  { name: "Montreuil", deptCode: "93", population: 111500 },
  { name: "Aulnay-sous-Bois", deptCode: "93", population: 84400 },
  { name: "Bobigny", deptCode: "93", population: 53000 },
  { name: "Bondy", deptCode: "93", population: 54400 },
  { name: "Saint-Ouen", deptCode: "93", population: 49500 },
  { name: "Drancy", deptCode: "93", population: 70200 },
  { name: "Noisy-le-Grand", deptCode: "93", population: 67800 },
  { name: "Pantin", deptCode: "93", population: 58600 },
  { name: "Le Blanc-Mesnil", deptCode: "93", population: 56800 },
  { name: "Rosny-sous-Bois", deptCode: "93", population: 44500 },
  { name: "Aubervilliers", deptCode: "93", population: 82000 },
  // 94 Val-de-Marne
  { name: "Vitry-sur-Seine", deptCode: "94", population: 95800 },
  { name: "Créteil", deptCode: "94", population: 90500 },
  { name: "Champigny-sur-Marne", deptCode: "94", population: 77300 },
  { name: "Saint-Maur-des-Fossés", deptCode: "94", population: 76600 },
  { name: "Villejuif", deptCode: "94", population: 57300 },
  { name: "Ivry-sur-Seine", deptCode: "94", population: 60100 },
  { name: "Maisons-Alfort", deptCode: "94", population: 55300 },
  { name: "Le Kremlin-Bicêtre", deptCode: "94", population: 27400 },
  // 95 Val-d'Oise
  { name: "Argenteuil", deptCode: "95", population: 104200 },
  { name: "Cergy", deptCode: "95", population: 60200 },
  { name: "Sarcelles", deptCode: "95", population: 60500 },
  { name: "Garges-lès-Gonesse", deptCode: "95", population: 41700 },
  { name: "Franconville", deptCode: "95", population: 35500 },
  { name: "Ermont", deptCode: "95", population: 28600 },
  { name: "Bezons", deptCode: "95", population: 30400 },
  { name: "Pontoise", deptCode: "95", population: 32400 },

  // ══════════════ AUVERGNE-RHÔNE-ALPES (01,03,07,15,26,38,42,43,63,69,73,74) ══════════════
  // 69 Rhône
  { name: "Lyon", deptCode: "69", population: 516000 },
  { name: "Villeurbanne", deptCode: "69", population: 154800 },
  { name: "Bron", deptCode: "69", population: 40200 },
  { name: "Vénissieux", deptCode: "69", population: 67800 },
  { name: "Caluire-et-Cuire", deptCode: "69", population: 42900 },
  { name: "Saint-Priest", deptCode: "69", population: 44600 },
  // 38 Isère
  { name: "Grenoble", deptCode: "38", population: 160000 },
  { name: "Saint-Martin-d'Hères", deptCode: "38", population: 36000 },
  { name: "Échirolles", deptCode: "38", population: 36800 },
  { name: "Vienne", deptCode: "38", population: 31000 },
  // 42 Loire
  { name: "Saint-Étienne", deptCode: "42", population: 172000 },
  { name: "Roanne", deptCode: "42", population: 35100 },
  { name: "Saint-Chamond", deptCode: "42", population: 36000 },
  // 63 Puy-de-Dôme
  { name: "Clermont-Ferrand", deptCode: "63", population: 146000 },
  { name: "Riom", deptCode: "63", population: 20600 },
  { name: "Thiers", deptCode: "63", population: 11500 },
  // 73 Savoie
  { name: "Chambéry", deptCode: "73", population: 61600 },
  { name: "Aix-les-Bains", deptCode: "73", population: 30500 },
  // 74 Haute-Savoie
  { name: "Annecy", deptCode: "74", population: 126000 },
  { name: "Annemasse", deptCode: "74", population: 38800 },
  { name: "Bonneville", deptCode: "74", population: 13500 },
  // 01 Ain
  { name: "Bourg-en-Bresse", deptCode: "01", population: 42400 },
  { name: "Oyonnax", deptCode: "01", population: 22800 },
  // 03 Allier
  { name: "Moulins", deptCode: "03", population: 19900 },
  { name: "Montluçon", deptCode: "03", population: 37000 },
  { name: "Vichy", deptCode: "03", population: 24800 },
  // 07 Ardèche
  { name: "Annonay", deptCode: "07", population: 16800 },
  { name: "Privas", deptCode: "07", population: 8600 },
  // 15 Cantal
  { name: "Aurillac", deptCode: "15", population: 25700 },
  // 26 Drôme
  { name: "Valence", deptCode: "26", population: 63200 },
  { name: "Romans-sur-Isère", deptCode: "26", population: 33700 },
  { name: "Montélimar", deptCode: "26", population: 40000 },
  // 43 Haute-Loire
  { name: "Le Puy-en-Velay", deptCode: "43", population: 19000 },

  // ══════════════ PROVENCE-ALPES-CÔTE D'AZUR (04,05,06,13,83,84) ══════════════
  // 13 Bouches-du-Rhône
  { name: "Marseille", deptCode: "13", population: 870000 },
  { name: "Aix-en-Provence", deptCode: "13", population: 147000 },
  { name: "Martigues", deptCode: "13", population: 48900 },
  { name: "Arles", deptCode: "13", population: 52400 },
  { name: "Istres", deptCode: "13", population: 44800 },
  { name: "Vitrolles", deptCode: "13", population: 36000 },
  // 06 Alpes-Maritimes
  { name: "Nice", deptCode: "06", population: 342000 },
  { name: "Antibes", deptCode: "06", population: 76400 },
  { name: "Cannes", deptCode: "06", population: 73500 },
  { name: "Grasse", deptCode: "06", population: 50900 },
  { name: "Cagnes-sur-Mer", deptCode: "06", population: 48700 },
  { name: "Le Cannet", deptCode: "06", population: 43500 },
  { name: "Menton", deptCode: "06", population: 29000 },
  // 83 Var
  { name: "Toulon", deptCode: "83", population: 176000 },
  { name: "La Seyne-sur-Mer", deptCode: "83", population: 63200 },
  { name: "Hyères", deptCode: "83", population: 55700 },
  { name: "Fréjus", deptCode: "83", population: 53400 },
  { name: "Draguignan", deptCode: "83", population: 39500 },
  // 84 Vaucluse
  { name: "Avignon", deptCode: "84", population: 92100 },
  { name: "Carpentras", deptCode: "84", population: 29300 },
  // 04 Alpes-de-Haute-Provence
  { name: "Digne-les-Bains", deptCode: "04", population: 16500 },
  { name: "Manosque", deptCode: "04", population: 22800 },
  // 05 Hautes-Alpes
  { name: "Gap", deptCode: "05", population: 41300 },
  { name: "Briançon", deptCode: "05", population: 12100 },

  // ══════════════ HAUTS-DE-FRANCE (02,59,60,62,80) ══════════════
  // 59 Nord
  { name: "Lille", deptCode: "59", population: 232000 },
  { name: "Roubaix", deptCode: "59", population: 98800 },
  { name: "Tourcoing", deptCode: "59", population: 98000 },
  { name: "Dunkerque", deptCode: "59", population: 89600 },
  { name: "Villeneuve-d'Ascq", deptCode: "59", population: 64300 },
  { name: "Wattrelos", deptCode: "59", population: 41500 },
  { name: "Valenciennes", deptCode: "59", population: 43200 },
  { name: "Maubeuge", deptCode: "59", population: 31600 },
  { name: "Cambrai", deptCode: "59", population: 32500 },
  // 62 Pas-de-Calais
  { name: "Calais", deptCode: "62", population: 73700 },
  { name: "Béthune", deptCode: "62", population: 44600 },
  { name: "Lens", deptCode: "62", population: 31600 },
  { name: "Liévin", deptCode: "62", population: 31500 },
  { name: "Boulogne-sur-Mer", deptCode: "62", population: 42000 },
  { name: "Arras", deptCode: "62", population: 42000 },
  // 80 Somme
  { name: "Amiens", deptCode: "80", population: 136000 },
  { name: "Abbeville", deptCode: "80", population: 24000 },
  // 60 Oise
  { name: "Beauvais", deptCode: "60", population: 56200 },
  { name: "Compiègne", deptCode: "60", population: 44400 },
  { name: "Creil", deptCode: "60", population: 36000 },
  // 02 Aisne
  { name: "Saint-Quentin", deptCode: "02", population: 55300 },
  { name: "Laon", deptCode: "02", population: 25200 },
  { name: "Soissons", deptCode: "02", population: 28000 },

  // ══════════════ GRAND EST (08,10,51,52,54,55,57,67,68,88) ══════════════
  // 67 Bas-Rhin
  { name: "Strasbourg", deptCode: "67", population: 284000 },
  { name: "Haguenau", deptCode: "67", population: 35800 },
  { name: "Sélestat", deptCode: "67", population: 20200 },
  { name: "Schiltigheim", deptCode: "67", population: 32800 },
  { name: "Illkirch-Graffenstaden", deptCode: "67", population: 27700 },
  // 68 Haut-Rhin
  { name: "Mulhouse", deptCode: "68", population: 111000 },
  { name: "Colmar", deptCode: "68", population: 70600 },
  // 54 Meurthe-et-Moselle
  { name: "Nancy", deptCode: "54", population: 105000 },
  { name: "Lunéville", deptCode: "54", population: 43700 },
  { name: "Vandœuvre-lès-Nancy", deptCode: "54", population: 30600 },
  // 57 Moselle
  { name: "Metz", deptCode: "57", population: 120000 },
  { name: "Thionville", deptCode: "57", population: 42600 },
  { name: "Forbach", deptCode: "57", population: 21900 },
  { name: "Sarreguemines", deptCode: "57", population: 21800 },
  // 51 Marne
  { name: "Reims", deptCode: "51", population: 182000 },
  { name: "Châlons-en-Champagne", deptCode: "51", population: 45800 },
  { name: "Épernay", deptCode: "51", population: 23600 },
  // 10 Aube
  { name: "Troyes", deptCode: "10", population: 61800 },
  // 08 Ardennes
  { name: "Charleville-Mézières", deptCode: "08", population: 50500 },
  // 52 Haute-Marne
  { name: "Chaumont", deptCode: "52", population: 22000 },
  // 55 Meuse
  { name: "Verdun", deptCode: "55", population: 17900 },
  { name: "Bar-le-Duc", deptCode: "55", population: 15000 },
  // 88 Vosges
  { name: "Épinal", deptCode: "88", population: 32200 },

  // ══════════════ NOUVELLE-AQUITAINE (16,17,19,23,24,33,40,47,64,79,86,87) ══════════════
  // 33 Gironde
  { name: "Bordeaux", deptCode: "33", population: 260000 },
  { name: "Mérignac", deptCode: "33", population: 74200 },
  { name: "Pessac", deptCode: "33", population: 62300 },
  { name: "Talence", deptCode: "33", population: 44200 },
  { name: "Le Bouscat", deptCode: "33", population: 25300 },
  // 64 Pyrénées-Atlantiques
  { name: "Pau", deptCode: "64", population: 77400 },
  { name: "Bayonne", deptCode: "64", population: 51200 },
  { name: "Anglet", deptCode: "64", population: 39800 },
  { name: "Biarritz", deptCode: "64", population: 26800 },
  // 17 Charente-Maritime
  { name: "La Rochelle", deptCode: "17", population: 77500 },
  { name: "Rochefort", deptCode: "17", population: 25500 },
  { name: "Royan", deptCode: "17", population: 18300 },
  // 86 Vienne
  { name: "Poitiers", deptCode: "86", population: 91400 },
  { name: "Châtellerault", deptCode: "86", population: 34200 },
  // 87 Haute-Vienne
  { name: "Limoges", deptCode: "87", population: 136000 },
  // 47 Lot-et-Garonne
  { name: "Agen", deptCode: "47", population: 34500 },
  { name: "Marmande", deptCode: "47", population: 19000 },
  // 24 Dordogne
  { name: "Périgueux", deptCode: "24", population: 30400 },
  { name: "Bergerac", deptCode: "24", population: 27700 },
  // 40 Landes
  { name: "Mont-de-Marsan", deptCode: "40", population: 31400 },
  { name: "Dax", deptCode: "40", population: 20800 },
  // 19 Corrèze
  { name: "Brive-la-Gaillarde", deptCode: "19", population: 47100 },
  { name: "Tulle", deptCode: "19", population: 15000 },
  // 16 Charente
  { name: "Angoulême", deptCode: "16", population: 42200 },
  { name: "Cognac", deptCode: "16", population: 18800 },
  // 79 Deux-Sèvres
  { name: "Niort", deptCode: "79", population: 58900 },
  { name: "Bressuire", deptCode: "79", population: 19800 },
  // 23 Creuse
  { name: "Guéret", deptCode: "23", population: 13800 },

  // ══════════════ OCCITANIE (09,11,12,30,31,32,34,46,48,65,66,81,82) ══════════════
  // 31 Haute-Garonne
  { name: "Toulouse", deptCode: "31", population: 493000 },
  { name: "Colomiers", deptCode: "31", population: 40500 },
  { name: "Tournefeuille", deptCode: "31", population: 29300 },
  { name: "Blagnac", deptCode: "31", population: 25500 },
  // 34 Hérault
  { name: "Montpellier", deptCode: "34", population: 285000 },
  { name: "Béziers", deptCode: "34", population: 78300 },
  { name: "Sète", deptCode: "34", population: 44500 },
  { name: "Lunel", deptCode: "34", population: 26800 },
  { name: "Agde", deptCode: "34", population: 27000 },
  // 30 Gard
  { name: "Nîmes", deptCode: "30", population: 147000 },
  { name: "Alès", deptCode: "30", population: 40300 },
  { name: "Bagnols-sur-Cèze", deptCode: "30", population: 18300 },
  // 66 Pyrénées-Orientales
  { name: "Perpignan", deptCode: "66", population: 121000 },
  // 11 Aude
  { name: "Narbonne", deptCode: "11", population: 54500 },
  { name: "Carcassonne", deptCode: "11", population: 46600 },
  // 81 Tarn
  { name: "Albi", deptCode: "81", population: 49400 },
  { name: "Castres", deptCode: "81", population: 42300 },
  // 82 Tarn-et-Garonne
  { name: "Montauban", deptCode: "82", population: 61000 },
  { name: "Castelsarrasin", deptCode: "82", population: 14000 },
  // 12 Aveyron
  { name: "Rodez", deptCode: "12", population: 24600 },
  { name: "Millau", deptCode: "12", population: 22700 },
  // 65 Hautes-Pyrénées
  { name: "Tarbes", deptCode: "65", population: 43500 },
  { name: "Lourdes", deptCode: "65", population: 14300 },
  // 09 Ariège
  { name: "Foix", deptCode: "09", population: 10100 },
  // 32 Gers
  { name: "Auch", deptCode: "32", population: 22200 },
  // 46 Lot
  { name: "Cahors", deptCode: "46", population: 20000 },
  // 48 Lozère
  { name: "Mende", deptCode: "48", population: 13300 },

  // ══════════════ PAYS DE LA LOIRE (44,49,53,72,85) ══════════════
  // 44 Loire-Atlantique
  { name: "Nantes", deptCode: "44", population: 318000 },
  { name: "Saint-Nazaire", deptCode: "44", population: 72100 },
  { name: "Rezé", deptCode: "44", population: 42500 },
  { name: "Saint-Herblain", deptCode: "44", population: 48400 },
  // 49 Maine-et-Loire
  { name: "Angers", deptCode: "49", population: 153000 },
  { name: "Cholet", deptCode: "49", population: 55000 },
  { name: "Saumur", deptCode: "49", population: 26700 },
  // 72 Sarthe
  { name: "Le Mans", deptCode: "72", population: 143800 },
  // 53 Mayenne
  { name: "Laval", deptCode: "53", population: 50900 },
  // 85 Vendée
  { name: "La Roche-sur-Yon", deptCode: "85", population: 54000 },
  { name: "Les Sables-d'Olonne", deptCode: "85", population: 44800 },

  // ══════════════ BRETAGNE (22,29,35,56) ══════════════
  // 35 Ille-et-Vilaine
  { name: "Rennes", deptCode: "35", population: 216000 },
  { name: "Saint-Malo", deptCode: "35", population: 52700 },
  { name: "Fougères", deptCode: "35", population: 20700 },
  { name: "Bruz", deptCode: "35", population: 19300 },
  // 29 Finistère
  { name: "Brest", deptCode: "29", population: 140000 },
  { name: "Quimper", deptCode: "29", population: 62500 },
  { name: "Morlaix", deptCode: "29", population: 15500 },
  // 56 Morbihan
  { name: "Vannes", deptCode: "56", population: 54500 },
  { name: "Lorient", deptCode: "56", population: 57100 },
  // 22 Côtes-d'Armor
  { name: "Saint-Brieuc", deptCode: "22", population: 44500 },
  { name: "Lannion", deptCode: "22", population: 19800 },

  // ══════════════ NORMANDIE (14,27,50,61,76) ══════════════
  // 76 Seine-Maritime
  { name: "Rouen", deptCode: "76", population: 111000 },
  { name: "Le Havre", deptCode: "76", population: 170000 },
  { name: "Dieppe", deptCode: "76", population: 28700 },
  // 14 Calvados
  { name: "Caen", deptCode: "14", population: 105500 },
  { name: "Lisieux", deptCode: "14", population: 21300 },
  { name: "Hérouville-Saint-Clair", deptCode: "14", population: 23400 },
  // 27 Eure
  { name: "Évreux", deptCode: "27", population: 51600 },
  { name: "Vernon", deptCode: "27", population: 24400 },
  { name: "Louviers", deptCode: "27", population: 19000 },
  // 50 Manche
  { name: "Cherbourg-en-Cotentin", deptCode: "50", population: 37600 },
  { name: "Saint-Lô", deptCode: "50", population: 19300 },
  // 61 Orne
  { name: "Alençon", deptCode: "61", population: 26200 },
  { name: "Flers", deptCode: "61", population: 15600 },

  // ══════════════ CENTRE-VAL DE LOIRE (18,28,36,37,41,45) ══════════════
  // 37 Indre-et-Loire
  { name: "Tours", deptCode: "37", population: 136500 },
  { name: "Joué-lès-Tours", deptCode: "37", population: 38200 },
  { name: "Chinon", deptCode: "37", population: 10000 },
  // 45 Loiret
  { name: "Orléans", deptCode: "45", population: 116600 },
  { name: "Fleury-les-Aubrais", deptCode: "45", population: 21400 },
  { name: "Montargis", deptCode: "45", population: 16100 },
  // 41 Loir-et-Cher
  { name: "Blois", deptCode: "41", population: 47000 },
  { name: "Vendôme", deptCode: "41", population: 16100 },
  // 28 Eure-et-Loir
  { name: "Chartres", deptCode: "28", population: 40100 },
  { name: "Dreux", deptCode: "28", population: 31100 },
  // 18 Cher
  { name: "Bourges", deptCode: "18", population: 64000 },
  // 36 Indre
  { name: "Châteauroux", deptCode: "36", population: 42400 },

  // ══════════════ BOURGOGNE-FRANCHE-COMTÉ (21,25,39,58,70,71,89,90) ══════════════
  // 21 Côte-d'Or
  { name: "Dijon", deptCode: "21", population: 156000 },
  { name: "Beaune", deptCode: "21", population: 22100 },
  // 25 Doubs
  { name: "Besançon", deptCode: "25", population: 119800 },
  { name: "Montbéliard", deptCode: "25", population: 26300 },
  { name: "Pontarlier", deptCode: "25", population: 18600 },
  // 71 Saône-et-Loire
  { name: "Chalon-sur-Saône", deptCode: "71", population: 50600 },
  { name: "Mâcon", deptCode: "71", population: 34000 },
  { name: "Le Creusot", deptCode: "71", population: 22000 },
  // 89 Yonne
  { name: "Auxerre", deptCode: "89", population: 34700 },
  { name: "Sens", deptCode: "89", population: 24700 },
  // 39 Jura
  { name: "Lons-le-Saunier", deptCode: "39", population: 17800 },
  // 58 Nièvre
  { name: "Nevers", deptCode: "58", population: 32400 },
  // 70 Haute-Saône
  { name: "Vesoul", deptCode: "70", population: 15300 },
  // 90 Territoire de Belfort
  { name: "Belfort", deptCode: "90", population: 50800 },

  // ══════════════ CORSE (2A,2B) ══════════════
  { name: "Ajaccio", deptCode: "2A", population: 71300 },
  { name: "Bastia", deptCode: "2B", population: 48600 },
  { name: "Porto-Vecchio", deptCode: "2B", population: 12000 },
  { name: "Propriano", deptCode: "2A", population: 6400 },
];

const FIRST_NAMES: { name: string; gender: "M" | "F" }[] = [
  // Male (40)
  { name: "Thomas", gender: "M" },
  { name: "Nicolas", gender: "M" },
  { name: "Antoine", gender: "M" },
  { name: "Maxime", gender: "M" },
  { name: "Kevin", gender: "M" },
  { name: "Mathieu", gender: "M" },
  { name: "Hugo", gender: "M" },
  { name: "Alexandre", gender: "M" },
  { name: "Julien", gender: "M" },
  { name: "Clément", gender: "M" },
  { name: "Romain", gender: "M" },
  { name: "Florian", gender: "M" },
  { name: "Quentin", gender: "M" },
  { name: "Lucas", gender: "M" },
  { name: "Enzo", gender: "M" },
  { name: "Théo", gender: "M" },
  { name: "Nathan", gender: "M" },
  { name: "Raphaël", gender: "M" },
  { name: "Louis", gender: "M" },
  { name: "Gabriel", gender: "M" },
  { name: "Arthur", gender: "M" },
  { name: "Pierre", gender: "M" },
  { name: "Paul", gender: "M" },
  { name: "Léo", gender: "M" },
  { name: "Adam", gender: "M" },
  { name: "Yanis", gender: "M" },
  { name: "Sami", gender: "M" },
  { name: "Mehdi", gender: "M" },
  { name: "Karim", gender: "M" },
  { name: "David", gender: "M" },
  { name: "Sébastien", gender: "M" },
  { name: "Christophe", gender: "M" },
  { name: "Laurent", gender: "M" },
  { name: "Jean", gender: "M" },
  { name: "Philippe", gender: "M" },
  { name: "François", gender: "M" },
  { name: "Olivier", gender: "M" },
  { name: "Marc", gender: "M" },
  { name: "Patrick", gender: "M" },
  { name: "Éric", gender: "M" },
  // Female (40)
  { name: "Sarah", gender: "F" },
  { name: "Julie", gender: "F" },
  { name: "Élodie", gender: "F" },
  { name: "Clara", gender: "F" },
  { name: "Léa", gender: "F" },
  { name: "Camille", gender: "F" },
  { name: "Manon", gender: "F" },
  { name: "Marine", gender: "F" },
  { name: "Pauline", gender: "F" },
  { name: "Laura", gender: "F" },
  { name: "Anaïs", gender: "F" },
  { name: "Chloé", gender: "F" },
  { name: "Emma", gender: "F" },
  { name: "Inès", gender: "F" },
  { name: "Alice", gender: "F" },
  { name: "Lucie", gender: "F" },
  { name: "Marie", gender: "F" },
  { name: "Sophie", gender: "F" },
  { name: "Charlotte", gender: "F" },
  { name: "Amélie", gender: "F" },
  { name: "Juliette", gender: "F" },
  { name: "Margaux", gender: "F" },
  { name: "Justine", gender: "F" },
  { name: "Céline", gender: "F" },
  { name: "Valérie", gender: "F" },
  { name: "Nathalie", gender: "F" },
  { name: "Isabelle", gender: "F" },
  { name: "Sandrine", gender: "F" },
  { name: "Véronique", gender: "F" },
  { name: "Catherine", gender: "F" },
  { name: "Sylvie", gender: "F" },
  { name: "Anne", gender: "F" },
  { name: "Brigitte", gender: "F" },
  { name: "Martine", gender: "F" },
  { name: "Christine", gender: "F" },
  { name: "Monique", gender: "F" },
  { name: "Françoise", gender: "F" },
  { name: "Josiane", gender: "F" },
  { name: "Patricia", gender: "F" },
  { name: "Denise", gender: "F" },
];

const ANONYMOUS_IDENTITIES = [
  "Un entrepreneur",
  "Un nouveau membre",
  "Un freelance",
  "Un porteur de projet",
  "Un créateur d'entreprise",
  "Une startupper",
];

const SCENARIOS = [
  // ═══ GROUP 1: packs (High Priority = 10) ═══
  {
    group: "packs",
    template: "{prenom} en {region} vient de prendre le Pack {pack}.",
    icon: "ShoppingBag",
    context: null as string | null,
    priority: 10,
  },
  {
    group: "packs",
    template: "Un nouveau membre en {ville} a rejoint le Pack {pack}.",
    icon: "ShoppingBag",
    context: null as string | null,
    priority: 10,
  },
  {
    group: "packs",
    template: "{prenom} de {ville} ({dept}) vient d'activer son Pack {pack}.",
    icon: "ShoppingBag",
    context: null as string | null,
    priority: 10,
  },
  {
    group: "packs",
    template: "Un entrepreneur en {region} a commandé le Pack {pack} il y a {delai}.",
    icon: "ShoppingBag",
    context: null as string | null,
    priority: 10,
  },
  {
    group: "packs",
    template: "{prenom} vient de souscrire au Pack {pack} depuis {ville}.",
    icon: "ShoppingBag",
    context: "tarifs",
    priority: 10,
  },
  {
    group: "packs",
    template: "Un porteur de projet de {region} a choisi le Pack {pack}.",
    icon: "ShoppingBag",
    context: null as string | null,
    priority: 10,
  },
  {
    group: "packs",
    template: "{prenom} ({dept}) vient de finaliser sa commande du Pack {pack}.",
    icon: "ShoppingBag",
    context: "tarifs",
    priority: 10,
  },
  {
    group: "packs",
    template: "Un freelance en {ville} s'est engagé avec le Pack {pack}.",
    icon: "ShoppingBag",
    context: null as string | null,
    priority: 10,
  },

  // ═══ GROUP 2: ressources (Priority = 5) ═══
  {
    group: "ressources",
    template: "{prenom} de {ville} a téléchargé le Guide des aides à la création.",
    icon: "FileDown",
    context: null as string | null,
    priority: 5,
  },
  {
    group: "ressources",
    template: "Un freelance a récupéré le Modèle de contrat de prestation en {region}.",
    icon: "FileDown",
    context: null as string | null,
    priority: 5,
  },
  {
    group: "ressources",
    template: "{prenom} ({dept}) vient de consulter le comparatif des banques pro.",
    icon: "FileDown",
    context: "banque",
    priority: 5,
  },
  {
    group: "ressources",
    template: "Un membre a téléchargé la Checklist SEO pour entrepreneurs.",
    icon: "FileDown",
    context: null as string | null,
    priority: 5,
  },
  {
    group: "ressources",
    template: "{prenom} en {ville} a récupéré le template Business Plan gratuit.",
    icon: "FileDown",
    context: null as string | null,
    priority: 5,
  },
  {
    group: "ressources",
    template: "Un entrepreneur de {region} a consulté le guide RC Pro.",
    icon: "FileDown",
    context: "assurance",
    priority: 5,
  },
  {
    group: "ressources",
    template: "{prenom} ({dept}) vient de télécharger la checklist de lancement.",
    icon: "FileDown",
    context: null as string | null,
    priority: 5,
  },
  {
    group: "ressources",
    template: "Un nouveau membre a consulté le comparatif des assurances pro en {region}.",
    icon: "FileDown",
    context: "assurance",
    priority: 5,
  },
  {
    group: "ressources",
    template: "{prenom} de {ville} a récupéré le guide de la comptabilité en ligne.",
    icon: "FileDown",
    context: "compta",
    priority: 5,
  },

  // ═══ GROUP 3: activite (Priority = 3) ═══
  {
    group: "activite",
    template: "{count} entrepreneurs consultent actuellement les solutions de gestion de trésorerie.",
    icon: "Zap",
    context: "compta",
    priority: 3,
  },
  {
    group: "activite",
    template: "{prenom} vient de poser une question sur le forum juridique.",
    icon: "Zap",
    context: null as string | null,
    priority: 3,
  },
  {
    group: "activite",
    template: "Il ne reste que {count} accès pour l'atelier 'Trouver des clients' de cette semaine.",
    icon: "Zap",
    context: null as string | null,
    priority: 3,
  },
  {
    group: "activite",
    template: "{count} personnes en {region} regardent cette offre en ce moment.",
    icon: "Zap",
    context: "tarifs",
    priority: 3,
  },
  {
    group: "activite",
    template: "Un nouveau guide sur la création d'entreprise vient d'être publié.",
    icon: "Zap",
    context: null as string | null,
    priority: 3,
  },
  {
    group: "activite",
    template: "{count} entrepreneurs ont rejoint la plateforme cette semaine.",
    icon: "Zap",
    context: null as string | null,
    priority: 3,
  },
  {
    group: "activite",
    template: "{prenom} de {ville} vient de compléter son audit de lancement.",
    icon: "Zap",
    context: null as string | null,
    priority: 3,
  },
  {
    group: "activite",
    template: "Le comparatif des outils de facturation a été mis à jour il y a {delai}.",
    icon: "Zap",
    context: "compta",
    priority: 3,
  },
];

const RESOURCES: { name: string; type: string; context: string | null }[] = [
  { name: "Guide des aides à la création", type: "guide", context: null },
  { name: "Modèle de contrat de prestation", type: "template", context: null },
  { name: "Comparatif des banques pro", type: "comparatif", context: "banque" },
  { name: "Checklist SEO pour entrepreneurs", type: "checklist", context: null },
  { name: "Template Business Plan", type: "template", context: null },
  { name: "Guide RC Pro", type: "guide", context: "assurance" },
  { name: "Checklist de lancement", type: "checklist", context: null },
  { name: "Comparatif des assurances pro", type: "comparatif", context: "assurance" },
  { name: "Guide de la comptabilité en ligne", type: "guide", context: "compta" },
  { name: "Kit de démarrage entrepreneur", type: "kit", context: null },
  { name: "Modèle de devis freelance", type: "template", context: null },
  { name: "Guide des financements publics", type: "guide", context: null },
  { name: "Checklist administrative création", type: "checklist", context: null },
  { name: "Comparatif des solutions de facturation", type: "comparatif", context: "compta" },
  { name: "Guide juridique pour auto-entrepreneur", type: "guide", context: null },
];

// ═══════════════════════════════════════════════════════════════
// SEED LOGIC
// ═══════════════════════════════════════════════════════════════

async function seedData() {
  const result = await db.$transaction(
    async (tx) => {
      // ── 1. SEED REGIONS ──────────────────────────────────────
      const existingRegions = await tx.spRegion.count();
      let regionMap: Map<string, number>;

      if (existingRegions === 0) {
        for (const region of REGIONS) {
          await tx.spRegion.create({ data: region });
        }
        const created = await tx.spRegion.findMany();
        regionMap = new Map(created.map((r) => [r.name, r.id]));
      } else {
        const existing = await tx.spRegion.findMany();
        regionMap = new Map(existing.map((r) => [r.name, r.id]));
      }

      // ── 2. SEED DEPARTMENTS ──────────────────────────────────
      const existingDepts = await tx.spDepartment.count();
      let deptMap: Map<string, number>;

      if (existingDepts === 0) {
        for (const dept of DEPARTMENTS) {
          const regionId = regionMap.get(dept.regionName);
          if (!regionId) {
            throw new Error(`Region "${dept.regionName}" not found for department ${dept.code}`);
          }
          await tx.spDepartment.create({
            data: {
              code: dept.code,
              name: dept.name,
              regionId,
            },
          });
        }
        const created = await tx.spDepartment.findMany();
        deptMap = new Map(created.map((d) => [d.code, d.id]));
      } else {
        const existing = await tx.spDepartment.findMany();
        deptMap = new Map(existing.map((d) => [d.code, d.id]));
      }

      // ── 3. SEED CITIES ───────────────────────────────────────
      const existingCities = await tx.spCity.count();
      if (existingCities === 0) {
        const cityBatches: Prisma.SpCityCreateManyInput[] = [];
        for (const city of CITIES) {
          const departmentId = deptMap.get(city.deptCode);
          if (!departmentId) {
            throw new Error(`Department "${city.deptCode}" not found for city ${city.name}`);
          }
          cityBatches.push({
            name: city.name,
            departmentId,
            population: city.population,
          });
        }
        // Insert in batches of 100 for safety
        const BATCH_SIZE = 100;
        for (let i = 0; i < cityBatches.length; i += BATCH_SIZE) {
          const batch = cityBatches.slice(i, i + BATCH_SIZE);
          await tx.spCity.createMany({ data: batch });
        }
      }

      // ── 4. SEED FIRST NAMES ──────────────────────────────────
      const existingNames = await tx.spFirstName.count();
      if (existingNames === 0) {
        await tx.spFirstName.createMany({
          data: FIRST_NAMES.map((n) => ({ name: n.name, gender: n.gender })),
        });
      }

      // ── 5. SEED ANONYMOUS IDENTITIES ─────────────────────────
      const existingIdentities = await tx.spAnonymousIdentity.count();
      if (existingIdentities === 0) {
        await tx.spAnonymousIdentity.createMany({
          data: ANONYMOUS_IDENTITIES.map((label) => ({ label })),
        });
      }

      // ── 6. SEED SCENARIOS ────────────────────────────────────
      const existingScenarios = await tx.spScenario.count();
      if (existingScenarios === 0) {
        await tx.spScenario.createMany({ data: SCENARIOS });
      }

      // ── 7. SEED RESOURCES ────────────────────────────────────
      const existingResources = await tx.spResource.count();
      if (existingResources === 0) {
        await tx.spResource.createMany({ data: RESOURCES });
      }

      // ── Return summary ───────────────────────────────────────
      const [
        finalRegions,
        finalDepts,
        finalCities,
        finalNames,
        finalIdentities,
        finalScenarios,
        finalResources,
      ] = await Promise.all([
        tx.spRegion.count(),
        tx.spDepartment.count(),
        tx.spCity.count(),
        tx.spFirstName.count(),
        tx.spAnonymousIdentity.count(),
        tx.spScenario.count(),
        tx.spResource.count(),
      ]);

      return {
        regions: finalRegions,
        departments: finalDepts,
        cities: finalCities,
        firstNames: finalNames,
        anonymousIdentities: finalIdentities,
        scenarios: finalScenarios,
        resources: finalResources,
      };
    },
    {
      timeout: 60000,
    }
  );

  return result;
}

// ═══════════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════════

export async function POST(_request: NextRequest) {
  try {
    const result = await seedData();

    return NextResponse.json(
      {
        success: true,
        message: "Données de preuve sociale ensemencées avec succès",
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Social proof seed error:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'ensemencement des données de preuve sociale" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const auto = searchParams.get("auto");

    if (auto === "true") {
      // Check if any data already exists
      const [regions, departments, cities, names, identities, scenarios, resources] =
        await Promise.all([
          db.spRegion.count(),
          db.spDepartment.count(),
          db.spCity.count(),
          db.spFirstName.count(),
          db.spAnonymousIdentity.count(),
          db.spScenario.count(),
          db.spResource.count(),
        ]);

      const total = regions + departments + cities + names + identities + scenarios + resources;

      if (total > 0) {
        return NextResponse.json({
          success: true,
          message: "Les données de preuve sociale existent déjà",
          data: { regions, departments, cities, firstNames: names, anonymousIdentities: identities, scenarios, resources },
        });
      }

      const result = await seedData();

      return NextResponse.json({
        success: true,
        message: "Données de preuve sociale ensemencées automatiquement",
        data: result,
      });
    }

    // Return current counts without seeding
    const [regions, departments, cities, names, identities, scenarios, resources] =
      await Promise.all([
        db.spRegion.count(),
        db.spDepartment.count(),
        db.spCity.count(),
        db.spFirstName.count(),
        db.spAnonymousIdentity.count(),
        db.spScenario.count(),
        db.spResource.count(),
      ]);

    return NextResponse.json({
      success: true,
      message: "Statistiques des données de preuve sociale",
      data: { regions, departments, cities, firstNames: names, anonymousIdentities: identities, scenarios, resources },
    });
  } catch (error) {
    console.error("Social proof GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture des données de preuve sociale" },
      { status: 500 }
    );
  }
}
