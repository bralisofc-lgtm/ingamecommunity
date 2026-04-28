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

const ALL = [
  hollowKnight, slayTheSpire, hades, undertale,
  stardew, celeste, obraDinn, cuphead,
  outerWilds, deadCells, discoElysium, gungeon,
  hotlineMiami, pizzaTower, terraria, risk2,
];

// 4 colunas — direções alternadas (down / up / down / up)
const COLUMNS: { items: string[]; direction: "up" | "down"; duration: number }[] = [
  { items: [ALL[0], ALL[4], ALL[8], ALL[12]], direction: "down", duration: 38 },
  { items: [ALL[1], ALL[5], ALL[9], ALL[13]], direction: "up", duration: 46 },
  { items: [ALL[2], ALL[6], ALL[10], ALL[14]], direction: "down", duration: 42 },
  { items: [ALL[3], ALL[7], ALL[11], ALL[15]], direction: "up", duration: 50 },
];

const HeroCoverWall = () => {
  const cols = useMemo(() => COLUMNS, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* parede de capas — 4 colunas */}
      <div className="absolute inset-0 grid grid-cols-4 gap-3 md:gap-4 px-2 md:px-4">
        {cols.map((col, ci) => (
          <div key={ci} className="relative overflow-hidden">
            <div
              className="flex flex-col gap-3 md:gap-4 will-change-transform"
              style={{
                animation: `cover-scroll-${col.direction} ${col.duration}s linear infinite`,
              }}
            >
              {/* duplica a lista para loop infinito sem corte */}
              {[...col.items, ...col.items, ...col.items].map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[460/215] w-full overflow-hidden rounded-lg border border-primary/20 shadow-[0_8px_30px_hsl(270_80%_4%/0.6)]"
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
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
