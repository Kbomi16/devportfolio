# 에셋 파이프라인 — v2.1 (영상·이미지)

> 3D GLB 파이프라인(Tripo·Mixamo)은 v2.1에서 폐기. 필요 에셋은 영상 1개 + 시안 이미지뿐이다.

## 1. CH1 필름 — `public/video/hero.mp4`

- 원본: Firefly 생성 한 컷 영상 (3D 바이닐 피규어, 검은 보이드 시작, 무자막).
- **스크럽 요구사항**: `video.currentTime`을 스크롤에 바인딩하므로 임의 탐색이 빨라야 한다 → **all-intra(키프레임 매 프레임) 재인코딩**.

```bash
ffmpeg -i original.mp4 -an -vf "scale=1280:-2" \
  -c:v libx264 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -crf 27 -movflags +faststart public/video/hero.mp4
```

- `-an` 무음(자동재생 정책) · `-g 1` 전체 키프레임 · faststart 필수.
- 용량 가이드: 10MB 이하. 초과 시 crf 상향 또는 960px 캡.
- 폴백: poster는 첫 프레임 대신 `images/bomi-landing.jpg` 사용 가능.

## 2. CH2 표지 — `public/images/bomi-landing.jpg`

- 원본: `letter/sian-bomi-3d/03-dynamic/landing.png` (1536×1024).
- 검은 배경 제거하지 않는다 — 필름의 한 컷을 무대에 세운 **카드 프레이밍**이 의도. 웹 배포용은 jpg 품질 82 내외.
