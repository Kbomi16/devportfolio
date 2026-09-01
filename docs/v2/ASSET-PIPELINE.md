# 3D 캐릭터 에셋 파이프라인 — 포트폴리오 v2

> 목표: hip-vinyl-v2 시안의 보미 캐릭터를 **리깅 + 5개 애니메이션 클립이 든 GLB 1개(< 3MB)** 로 만든다.
> AI 에이전트(Cursor)는 캐릭터 메시·리깅을 직접 생성할 수 없다. 메시 생성과 리깅은 외부 도구를 쓰고,
> 최적화·통합·r3f 연결은 에이전트가 담당한다.

## 0. 준비된 재료 (이미 있음)

| 파일 | 용도 |
|------|------|
| `letter/sian-bomi-3d/04-explore/hip-vinyl-v2.png` | 최종 스타일 시안 (드래프트 확정본) |
| `letter/sian-bomi-3d/04-explore/original-tpose.png` | **image-to-3D 입력용 T포즈** ★ 가장 중요 |
| `letter/sian-bomi-3d/04-explore/original-sheet.png` | 멀티뷰 시트 (Tripo 멀티뷰 입력 보조) |
| `letter/sian-bomi-3d/01-look` ~ `03-dynamic` | run/walk/jump 포즈 레퍼런스 (애니메이션 검수용) |

## 1. 메시 생성 — Tripo AI (1순위) 또는 Meshy

1. [Tripo AI](https://www.tripo3d.ai/) → Image to 3D → `original-tpose.png` 입력 (가능하면 `original-sheet.png`로 멀티뷰).
2. 옵션: T/A-pose 유지, PBR 텍스처 온, 폴리곤은 기본값(추후 감축).
3. **검수 기준**: ① 손가락 뭉개짐 허용(멀리서 보임) ② 얼굴·앞머리 실루엣이 시안과 일치하는지 ③ 다리가 붙어있지 않은지(리깅 필수 조건).
4. 결과가 아쉬우면 Meshy로 교차 시도. 3회 이상 실패 시 폴백 사다리(§5).
5. 산출물: `bomi-raw.glb` (또는 fbx).

## 2. 리깅 + 애니메이션 — Mixamo (무료)

1. [mixamo.com](https://www.mixamo.com/) → Upload Character → `bomi-raw` 업로드 → Auto-Rigger (턱·손목·무릎 마커 지정).
2. 아래 5개 클립을 **같은 캐릭터에** 각각 적용해 다운로드 (Format: FBX, Skin 포함은 첫 클립만, 이후는 Without Skin):

| 클립 | Mixamo 검색어 | 쓰이는 챕터 | 비고 |
|------|---------------|-------------|------|
| Run | "Running" (in place ✔) | CH1 PORTAL | In Place 체크 필수 — 이동은 코드가 담당 |
| **Pose** | "Catwalk Idle" / "Standing Idle" 변형 중 힙한 스탠스 | CH2 REVEAL (표지 포즈) | hip-vinyl-v2 시안의 한 손 주머니 스탠스에 가까운 것. 루프 대신 첫 프레임 홀드용 |
| Idle | "Breathing Idle" | CH3 정지·CH4·CH6 | 루프 자연스러운 것 |
| Walk | "Walking" (in place ✔) | CH3 WORK 갤러리 | In Place 체크 필수 |
| Jump 또는 Wave | "Jump" / "Waving" | CH6 클릭 리액션 | 1회 재생용, 루프 아님 |

## 3. 클립 병합 + GLB 내보내기 — Blender

1. Skin 포함 FBX 임포트 → 나머지 클립 FBX를 임포트해 **NLA 트랙으로 액션 병합** (액션 이름을 `Run / Pose / Idle / Walk / Jump`로 정리 — r3f에서 이 이름 그대로 씀).
2. 스케일 적용(Ctrl+A), 원점을 발바닥으로, +Z 전방 확인.
3. glTF 2.0 (.glb) 내보내기 — 애니메이션 전체 포함, 압축은 아직 끄기.
4. 산출물: `bomi-clips.glb`.

## 4. 최적화 — gltf-transform (에이전트 담당)

```bash
bunx @gltf-transform/cli optimize bomi-clips.glb public/models/bomi.glb \
  --compress draco --texture-compress webp --texture-size 1024
```

- 목표: **< 3MB**. 초과 시 텍스처 512px → simplify 순서로 감축.
- 검수: `bunx @gltf-transform/cli inspect` 로 클립 5개·본·용량 확인 후 r3f `useAnimations` 연결 테스트.

## 5. 폴백 사다리 (품질이 안 나올 때)

1. **스타일 단순화**: hip-vinyl-v2 → `tofu-*.png` 시안(단순 실루엣)으로 재생성 — 단순할수록 image-to-3D 품질이 좋다.
2. **텍스처 포기**: 형태만 쓰고 머티리얼은 코드에서 클레이/석고 단색 처리 (`sculptural-plaster` 시안 방향) — 순수 흑백 무드와는 오히려 잘 맞음.
3. **최후**: 프로시저럴 마네킹(캡슐+구 조합) + Mixamo 리깅. 장면 연출(달려옴·방향 전환)은 그대로 살아있으므로 사이트는 성립한다.

## 6. 체크리스트

- [ ] Tripo/Meshy로 `bomi-raw` 생성 및 검수
- [ ] Mixamo 오토리깅 + 클립 5개 (Run/Pose/Idle/Walk/Jump, In Place 확인)
- [ ] Pose 스탠스가 hip-vinyl-v2 시안과 어울리는지 CH2 레이아웃(좌 캐릭터·우 타이포)에서 확인
- [ ] Blender에서 액션 병합 → `bomi-clips.glb`
- [ ] gltf-transform 최적화 → `public/models/bomi.glb` (< 3MB)
- [ ] r3f `useAnimations` 클립 이름·크로스페이드 동작 확인
- [ ] WebGL 폴백용 캐릭터 렌더샷(포스터) 1장 저장
