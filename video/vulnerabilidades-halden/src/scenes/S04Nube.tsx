import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { CloudLayers, GAP_ANCHOR, PROVIDER_ANCHOR } from './parts/s04-nube/CloudLayers';
import { DoorBubbles } from './parts/s04-nube/DoorBeat';
import { GapRule, KeyList } from './parts/s04-nube/KeyList';
import { LandlordTenant } from './parts/s04-nube/Landlord';
import { RB, RB_ANCHORS, RentalBuilding } from './parts/RentalBuilding';
import { SD, StreetDoor } from './parts/StreetDoor';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's04-nube';
const BIG = { x: 60, y: 84, w: 600 } as const;
const THUMB = { x: 0, y: 150, w: 380 } as const;
const PANEL_X = 440;
const DOOR_BIG = { x: 80, y: 70, w: 450 } as const;
const DOOR_THUMB = { x: 30, y: 120, w: 320 } as const;
const LIST_Y = 322;

/**
 * s04-nube «Lo de abajo, lo de encima y lo de nadie». The rental building comes back (`building`): the landlord's side
 * lights sky (`landlord`: estructura · instalación · paredes) and the tenant's three icons cyan (`tenant`). On `cloud`
 * the building shrinks to the left and the cloud appears in three strips: «proveedor» below (`below`; on «Esa pared…» a
 * dashed line ties the building's wall to it), «según el servicio» half-lit (`middle`), «cliente» on top (`above`)
 * with «siempre» stamped (`always`) and the three reflexes (`reflex`); «shared responsibility model» on its words.
 * On `door` the street door takes the stage with the landlord's and a neighbour's bubbles; on `open-door` (the error
 * sound) it swings open at night: «abierta toda la noche». On `strip` the cloud returns with the amber gap between the
 * layers, tied to the open door; on `sprawl` the lower strips fold away for the example key list, «IAM sprawl», and the
 * rule of the gap on the left.
 */
export function S04Nube(props: SceneProps) {
  const frame = useCurrentFrame();
  const wordAt = (seg: string, word: string) => wordFrame(S, seg, word);
  const cloudAt = props.cue('cloud');
  const doorAt = props.cue('door');
  const openAt = props.cue('open-door');
  const stripAt = props.cue('strip');
  const sprawlAt = props.cue('sprawl');

  // The building: big, then a thumbnail; gone while the door has the stage.
  const shrink = progress(frame, cloudAt - 16, 26, EASE.inOut);
  const bx = mix(BIG.x, THUMB.x, shrink);
  const by = mix(BIG.y, THUMB.y, shrink);
  const bw = mix(BIG.w, THUMB.w, shrink);
  const bOut = progress(frame, doorAt - 10, 14, EASE.inOut);
  const wallTie = progress(frame, wordAt('s04-03', 'pared') - 6, 14) * (1 - progress(frame, props.cue('middle'), 14));

  // The door: centre stage from `door`, then a thumbnail on `strip`, gone on `sprawl`.
  const dIn = enter(frame, doorAt - 4, { distance: 18 });
  const toThumb = progress(frame, stripAt - 12, 22, EASE.inOut);
  const dx = mix(DOOR_BIG.x, DOOR_THUMB.x, toThumb);
  const dy = mix(DOOR_BIG.y, DOOR_THUMB.y, toThumb);
  const dw = mix(DOOR_BIG.w, DOOR_THUMB.w, toThumb);
  const dOut = progress(frame, sprawlAt - 12, 14, EASE.inOut);
  const open = progress(frame, openAt, 22, EASE.out);
  const jolt = frame >= openAt ? progress(frame, openAt, 16, EASE.linear) : 0;
  const night = progress(frame, wordAt('s04-06', 'creen') - 4, 30);
  const doorTie = progress(frame, stripAt + 10, 14) * (1 - dOut);
  const bubblesOut = progress(frame, stripAt - 14, 12, EASE.inOut);

  // The cloud panel: away while the door has the stage.
  const panelAway = progress(frame, doorAt - 8, 14, EASE.inOut) * (1 - progress(frame, stripAt - 12, 16, EASE.inOut));
  const tagOut = progress(frame, sprawlAt - 12, 12);

  const slabK = THUMB.w / RB.w;
  const slab: [number, number] = [THUMB.x + RB_ANCHORS.slab[0] * slabK, THUMB.y + RB_ANCHORS.slab[1] * slabK];
  const prov: [number, number] = [PANEL_X + PROVIDER_ANCHOR[0] - 6, PROVIDER_ANCHOR[1]];
  const doorEdge: [number, number] = [DOOR_THUMB.x + DOOR_THUMB.w + 4, DOOR_THUMB.y + (DOOR_THUMB.w * SD.h) / SD.w / 2];
  const gap: [number, number] = [PANEL_X + GAP_ANCHOR[0] - 6, GAP_ANCHOR[1]];

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: (1 - tagOut) * progress(frame, props.cue('building'), 14) }}>
        <ImageTag />
      </div>

      {bOut < 1 ? (
        <div style={{ position: 'absolute', left: bx, top: by, opacity: (1 - bOut) * enter(frame, props.cue('building') - 4, { distance: 0 }).opacity }}>
          <RentalBuilding width={bw} landlord={progress(frame, props.cue('landlord'), 14) * (1 - 0.6 * progress(frame, props.cue('tenant'), 12)) + wallTie * 0.8} tenant={progress(frame, props.cue('tenant'), 14)} wall={wallTie} />
        </div>
      ) : null}
      {shrink < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - shrink }}>
          <LandlordTenant frame={frame} left={740} top={60} landlordAt={props.cue('landlord')} tenantAt={props.cue('tenant')} wordAt={wordAt} />
        </div>
      ) : null}

      {frame >= cloudAt - 6 && panelAway < 1 ? (
        <div style={{ position: 'absolute', left: PANEL_X, top: 0, opacity: 1 - panelAway }}>
          <CloudLayers
            frame={frame}
            t={{
              cloud: cloudAt,
              below: props.cue('below'),
              middle: props.cue('middle'),
              above: props.cue('above'),
              always: props.cue('always'),
              reflex: props.cue('reflex'),
              model: wordAt('s04-05', 'shared') - 6,
              strip: stripAt,
              sprawl: sprawlAt,
              wordAt,
            }}
          />
        </div>
      ) : null}

      {frame >= doorAt - 6 && dOut < 1 ? (
        <div style={{ position: 'absolute', left: dx, top: dy, opacity: dIn.opacity * (1 - dOut) }}>
          <StreetDoor width={dw} open={open} night={night} jolt={jolt} />
        </div>
      ) : null}
      {frame >= doorAt - 6 && bubblesOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - bubblesOut }}>
          <DoorBubbles frame={frame} landlordAt={wordAt('s04-06', 'cierra') - 6} neighbourAt={wordAt('s04-06', 'creen') - 6} openAt={openAt} />
        </div>
      ) : null}

      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {wallTie > 0.01 ? (
          <g opacity={wallTie * (1 - bOut)}>
            <path d={`M ${slab[0]} ${slab[1]} L ${prov[0]} ${prov[1]}`} stroke={C.sky} strokeWidth={4} strokeDasharray="10 8" fill="none" />
            <circle cx={slab[0]} cy={slab[1]} r={8} fill={C.sky} />
            <circle cx={prov[0]} cy={prov[1]} r={8} fill={C.sky} />
          </g>
        ) : null}
        {doorTie > 0.01 ? (
          <g opacity={doorTie}>
            <path d={`M ${doorEdge[0]} ${doorEdge[1]} L ${gap[0]} ${gap[1]}`} stroke={C.amber} strokeWidth={4} strokeDasharray="10 8" fill="none" />
            <circle cx={doorEdge[0]} cy={doorEdge[1]} r={8} fill={C.amber} />
            <circle cx={gap[0]} cy={gap[1]} r={8} fill={alpha(C.amber, 0.9)} />
          </g>
        ) : null}
      </svg>

      {frame >= sprawlAt - 4 ? (
        <div style={{ position: 'absolute', left: PANEL_X, top: LIST_Y }}>
          <KeyList frame={frame} at={sprawlAt} keysAt={wordAt('s04-08', 'claves')} termAt={wordAt('s04-08', 'IAM') - 6} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 0, top: 290 }}>
        <GapRule frame={frame} at={wordAt('s04-08', 'revisa') - 4} />
      </div>
    </Stage>
  );
}
