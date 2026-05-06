import { useMemo } from "react";

import celeste from "@/assets/covers/celeste.jpg";
import cuphead from "@/assets/covers/cuphead.jpg";
import deadCells from "@/assets/covers/dead-cells.jpg";
import discoElysium from "@/assets/covers/disco-elysium.jpg";
import gungeon from "@/assets/covers/enter-the-gungeon.jpg";
import hades from "@/assets/covers/hades.jpg";
import hollowKnight from "@/assets/covers/hollow-knight.jpg";
import hotlineMiami from "@/assets/covers/hotline-miami.jpg";
import obraDinn from "@/assets/covers/obra-dinn.jpg";
import outerWilds from "@/assets/covers/outer-wilds.jpg";
import pizzaTower from "@/assets/covers/pizza-tower.jpg";
import risk2 from "@/assets/covers/risk-of-rain-2.jpg";
import slayTheSpire from "@/assets/covers/slay-the-spire.jpg";
import stardew from "@/assets/covers/stardew-valley.jpg";
import terraria from "@/assets/covers/terraria.jpg";
import undertale from "@/assets/covers/undertale.jpg";
import katanaZero from "@/assets/covers/katana-zero.jpg";
import inscryption from "@/assets/covers/inscryption.jpg";
import shortHike from "@/assets/covers/a-short-hike.jpg";
import gris from "@/assets/covers/gris.jpg";
import oriBlind from "@/assets/covers/ori-blind-forest.jpg";
import oriWisps from "@/assets/covers/ori-will-of-wisps.jpg";
import hyperLight from "@/assets/covers/hyper-light-drifter.jpg";
import tunic from "@/assets/covers/tunic.jpg";
import crosscode from "@/assets/covers/crosscode.jpg";
import stray from "@/assets/covers/stray.jpg";
import cultLamb from "@/assets/covers/cult-of-the-lamb.jpg";
import vampireSurvivors from "@/assets/covers/vampire-survivors.jpg";
import loopHero from "@/assets/covers/loop-hero.jpg";
import factorio from "@/assets/covers/factorio.jpg";
import rimworld from "@/assets/covers/rimworld.jpg";
import shovelKnight from "@/assets/covers/shovel-knight.jpg";
import isaac from "@/assets/covers/binding-of-isaac.jpg";
import spelunky2 from "@/assets/covers/spelunky-2.jpg";
import noita from "@/assets/covers/noita.jpg";
import valheim from "@/assets/covers/valheim.jpg";
import hifiRush from "@/assets/covers/hi-fi-rush.jpg";
import signalis from "@/assets/covers/signalis.jpg";
import unpacking from "@/assets/covers/unpacking.jpg";
import chainedEchoes from "@/assets/covers/chained-echoes.jpg";
import deathsDoor from "@/assets/covers/deaths-door.jpg";
import cocoon from "@/assets/covers/cocoon.jpg";
import sable from "@/assets/covers/sable.jpg";
import spiritfarer from "@/assets/covers/spiritfarer.jpg";
import pentiment from "@/assets/covers/pentiment.jpg";
import coralIsland from "@/assets/covers/coral-island.jpg";
import dredge from "@/assets/covers/dredge.jpg";
import seaOfStars from "@/assets/covers/sea-of-stars.jpg";
import blasphemous from "@/assets/covers/blasphemous.jpg";
import blasphemous2 from "@/assets/covers/blasphemous-2.jpg";
import lethalCompany from "@/assets/covers/lethal-company.jpg";
import webfishing from "@/assets/covers/webfishing.jpg";
import balatro from "@/assets/covers/balatro.jpg";
import animalWell from "@/assets/covers/animal-well.jpg";

// 50 capas distribuídas em 4 colunas — direções alternadas
const ALL = [
  hollowKnight, slayTheSpire, hades, undertale,
  stardew, celeste, obraDinn, cuphead,
  outerWilds, deadCells, discoElysium, gungeon,
  hotlineMiami, pizzaTower, terraria, risk2,
  katanaZero, inscryption, shortHike, gris,
  oriBlind, oriWisps, hyperLight, tunic,
  crosscode, stray, cultLamb, vampireSurvivors,
  loopHero, factorio, rimworld, shovelKnight,
  isaac, spelunky2, noita, valheim,
  hifiRush, signalis, unpacking, chainedEchoes,
  enigmaOfFearReplacedSlot1, balatro, dredge, seaOfStars,
  blasphemous, blasphemous2, animalWell, lethalCompany,
  coralIsland, webfishing, deathsDoor, cocoon,
  sable, spiritfarer, pentiment,
];

// Distribui em 4 colunas intercalando para misturar estilos
const COLUMNS: { items: string[]; direction: "up" | "down"; duration: number }[] = [
  { items: ALL.filter((_, i) => i % 4 === 0), direction: "down", duration: 70 },
  { items: ALL.filter((_, i) => i % 4 === 1), direction: "up", duration: 78 },
  { items: ALL.filter((_, i) => i % 4 === 2), direction: "down", duration: 74 },
  { items: ALL.filter((_, i) => i % 4 === 3), direction: "up", duration: 82 },
];

const HeroCoverWall = () => {
  const cols = useMemo(() => COLUMNS, []);

  return (
    <div className="absolute inset-0 overflow-hidden w-full max-w-full" aria-hidden>
      <div className="absolute -inset-x-3 inset-y-0 grid grid-cols-4 gap-3 md:gap-5 px-3 md:px-6 overflow-hidden rotate-[-1deg] scale-[1.03]">
        {cols.map((col, ci) => (
          <div key={ci} className="relative overflow-hidden">
            <div
              className="flex flex-col gap-3 md:gap-5 will-change-transform"
              style={{
                animation: `cover-scroll-${col.direction} ${col.duration}s linear infinite`,
              }}
            >
              {/* duplica para loop infinito */}
              {[...col.items, ...col.items].map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[460/215] w-full overflow-hidden rounded-lg border border-primary/30 shadow-[0_0_22px_hsl(var(--primary)/0.16),0_10px_36px_hsl(270_80%_4%/0.7)] opacity-95"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover saturate-[1.25] contrast-[1.08]"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-primary/10 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* overlays para legibilidade do conteúdo central */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_80%_6%/0.85)_0%,hsl(270_80%_6%/0.55)_35%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default HeroCoverWall;
