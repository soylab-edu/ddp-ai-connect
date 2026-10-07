# C — CONVERGENCE

16초 무음 헤더입니다. 구도와 CSS 좌표는 1600×640을 유지하고, 최종 고화질 영상은 DPR 2로 3200×1280, 30fps, 480프레임으로 출력합니다. 모바일 레이아웃 검수 기준은 390×720입니다.

## 결과물

- `header-c.html`: 실제 웹 헤더. 한 번 재생한 뒤 16초의 행사 포스터를 유지하며 하단 두 줄은 계속 흐릅니다. 일시정지/계속 재생, 다시 재생, 화면 이탈/탭 숨김 정지, 모션 줄이기를 지원합니다.
- `preview-hq.mp4`: 최종 고화질 전체 16초 영상. 3200×1280 / 30fps / H.264 / CRF 10. 영상 파일은 16초에서 끝납니다. 이후의 지속되는 하단 모션은 웹 헤더에서 확인할 수 있습니다.
- `preview.mp4`: 비교용 기존 1600×640 / CRF 16 영상.
- `quality/schedule-comparison.png`: 기존 DPR 1과 새 DPR 2·3 영상에서 추출한 일정/장소 확대 비교. DPR 2를 최종 배포 해상도로 선택했습니다.
- `poster.png`, `poster-mobile.png`: 16초 최종 프레임.
- `snapshots/final/contact-sheet.jpg`: 데스크톱 8개 주요 장면.
- `snapshots/final-mobile/contact-sheet.jpg`: 모바일 6개 주요 장면.
- `contact-preview-4s.mp4`, `explosion-preview-2s.mp4`: 전체 영상에서 잘라낸 접촉/폭발 검토용 클립.

## 동작

0–1.4초에는 파스텔 점 구체와 붉은 입체 SOYLAB이 등장합니다. 1.4–6.8초에는 개별 점이 곡선을 따라 날아와 닿은 위치부터 색이 번지고, 후반부에 도착 빈도가 빨라집니다. 6.8–9.82초에는 검정 유광 글자가 중앙으로 커진 뒤 두 차례 앞뒤로 튕기고 압축됩니다. 9.82–10.6초에는 실제 글자 메시가 파편으로 흩어지며 원본 SOY.LAB 로고가 겹칩니다. 10.6–13.5초의 8줄 타이포그래피가 마지막 포스터와 하단 2줄로 이어집니다.

`index.html`은 HyperFrames 렌더용입니다. `scene.js`는 Three.js 장면과 순수 시간 함수를, `wave.js`/`wave.css`는 외부 시계로 움직이는 문자 행을, `player.js`는 웹 재생을 담당합니다. 웹의 master/canvas는 16초에서 정지하고 하단 문자만 별도 시간으로 움직입니다. 반복 폭은 최종 축소 비율과 화면 너비로 산출하므로 오른쪽 끝까지 이어집니다.

독립 헤더의 CTA는 `../03_NEXT_KCORE_AI_CONNECT_v12.html#program` 및 `#guide`로 이동합니다. iframe에 넣으면 부모 페이지의 동일 앵커로 이동합니다. 화면 폭 620px 이하에서는 모바일 레이아웃을 사용합니다.

## 에셋과 재출력

원본 `D:/DDP/03_assets/soylab-logo.png`를 그대로 복사했습니다. 구체, 글자, 접촉 페인트 및 파편은 코드로 구성했습니다. Three.js r158, GSAP, Outfit 및 IBM Plex Sans KR 폰트는 `assets/`에 로컬 파일로 포함되어 있습니다. 문자 변경 후 `python subset-fonts.py`로 한국어 폰트 서브셋을 갱신합니다.

```powershell
npx --yes hyperframes@0.8.139 preview --background
node render-hires.mjs 2 --quality delivery --crf 10 --fps 30 --output preview-hq.mp4 --workers 2 --skill general-video --quiet
node verify-player.mjs
```

`render-hires.mjs`는 **HyperFrames CLI 0.8.139 고정 버전**의 공식 DPR 렌더 경로를 사용합니다. 기본 `--resolution` 프리셋에는 2.5:1 화면이 없어 해당 Node 프로세스 안에서만 프리셋의 출력 크기를 3200×1280으로 설정합니다. 설치 파일과 CSS viewport는 바꾸지 않습니다. `compositionWidth:1600`, `compositionHeight:640`, `deviceScaleFactor:2`가 적용되고 Chrome screenshot 캡처가 사용됩니다. 다른 CLI 버전으로 업그레이드할 때는 래퍼의 번들 경로와 호환성을 다시 확인해야 합니다. 공식 옵션 설명: https://github.com/heygen-com/hyperframes/blob/main/docs/packages/cli.mdx

현재 `scene.js`의 WebGL 버퍼도 기기의 DPR(최대 3)을 따릅니다. 구체와 이동점의 셰이더에는 같은 DPR을 적용해 점의 화면상 크기를 유지합니다. 등장 애니메이션이 끝난 메타데이터는 `transform:none`, `will-change:auto`로 정착시켜 글자 레이어가 불필요하게 유지되지 않도록 했습니다. 전체 레이아웃, 글꼴, 크기와 타이밍은 유지했습니다.

## 검증

데스크톱/모바일 최종 품질 수정 후 검사 기록은 `quality/check-sharpness-final.json`, `quality/check-sharpness-mobile-final.json`입니다. 두 환경 모두 lint 오류 0, runtime 오류 0, layout 오류/경고 0, 텍스트 대비 28/28 통과입니다. 로컬 Three.js UMD 빌드의 deprecation 경고 1건이 남아 있으며 실행 오류는 없습니다. Canvas 장면의 자동 motion 검사는 비활성이고 animation-map 도구는 로컬 helper 미설치로 실행하지 못했습니다. 따라서 동작 품질 검수는 실제 주요 프레임과 전체 MP4에서 추출한 2fps 표본을 사용했습니다.

`node verify-player.mjs`는 master 마지막 화면 유지, 16초 이후 wave 시간 진행, pause/resume, 화면 이탈 및 탭 숨김 후 시간 점프 없는 복귀, replay 초기화, reduced-motion 정지, 독립/iframe 링크를 검증합니다. 실제 웹의 지속 모션과 화면 너비도 브라우저에서 별도 확인합니다.
