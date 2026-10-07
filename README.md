# DDP — NEXT K-CORE AI CONNECT

행사 소개 웹사이트, 편집 소스와 영상 자료를 보관하는 저장소입니다. 최종 정리: 2026-10-08 (Asia/Seoul).

## 최종본

- 웹사이트: [AI_CONNECT_FINAL_REVIEWED.html](FINAL_AI_CONNECT/AI_CONNECT_FINAL_REVIEWED.html)
- 동일한 빌드 출력: [AI_CONNECT_FINAL.html](FINAL_AI_CONNECT/AI_CONNECT_FINAL.html)
- 공간 영상: [SEEDANCE25_ORIGINAL_1080P.mp4](FINAL_AI_CONNECT/room-360-loop/SEEDANCE25_ORIGINAL_1080P.mp4)
- 공간 영상 단독 재생: [PREVIEW.html](FINAL_AI_CONNECT/room-360-loop/PREVIEW.html)
- 보관된 16초 오프닝 렌더: [AI_CONNECT_FINAL_3360x1440.mp4](FINAL_AI_CONNECT/AI_CONNECT_FINAL_3360x1440.mp4)
- 확정 내용과 수정 지침: [HANDOFF.md](HANDOFF.md)

웹사이트 HTML에는 헤더, 스타일, 스크립트, 폰트, 이미지, 헤더 음원이 포함되어 있습니다. **공간 영상은 외부 파일**이므로 HTML을 전달할 때 `room-360-loop/SEEDANCE25_ORIGINAL_1080P.mp4`를 같은 상대 경로에 함께 두어야 합니다. 원본 공간 영상은 HEVC 형식이므로 재생 가능한 브라우저/장치가 필요합니다.

## 미리보기

저장소 루트에서 실행합니다.

```bash
python -m http.server 3045 --bind 127.0.0.1
```

[최종 웹사이트 열기](http://127.0.0.1:3045/FINAL_AI_CONNECT/AI_CONNECT_FINAL_REVIEWED.html). 로컬 파일로 직접 열 수도 있습니다. 소리는 사용자 조작으로 켭니다. 클라우드 환경에서는 해당 환경의 포트 전달 설정에 맞춰 서버 주소를 조정합니다.

## 편집과 재빌드

- 본문: `03_header_rebuild_20261007/page-review-v7.html`
- 스타일: `03_header_rebuild_20261007/dark-body.css`
- 웹 헤더 모션·음원: `reference-reset/motion/`
- 공식 브랜드 이미지 편집 자료: `03_assets/*-official.webp`
- 현재 가입 장면 이미지: `FINAL_AI_CONNECT/brand-corrections/event-previews/02-bbanana-signup.png`

Python 3 표준 라이브러리만 사용합니다. 첫 명령은 기본 HTML을 생성하고, 두 번째 명령은 검토본에 반영합니다.

```bash
python FINAL_AI_CONNECT/build_full_html.py
python -c "from pathlib import Path; import shutil; p=Path('FINAL_AI_CONNECT'); shutil.copy2(p/'AI_CONNECT_FINAL.html',p/'AI_CONNECT_FINAL_REVIEWED.html')"
```

변경 후 실제 브라우저에서 데스크톱·모바일 화면, 날짜 탭, 무료강의 노출, 공간 영상과 소리 버튼을 확인합니다. 웹 HTML 재빌드는 보관된 MP4 렌더를 갱신하지 않습니다.

## 보관 범위

이번 최종본에 필요한 영상·포스터·이미지와 재빌드 소스를 포함했습니다. 실험 영상, 검수 캡처, 생성 요청 기록, 백업, 이번에 추가된 원본 공간 사진은 로컬에 보존하고 Git에서는 제외합니다. 기존에 커밋한 과거 디자인과 자료는 유지하며, 최신본의 기준은 위 경로입니다.

클라우드에서 이어서 작업할 때는 이 저장소를 연결하고 `HANDOFF.md`부터 확인합니다. 로컬 채팅과 도구 설정은 저장소에 포함되지 않습니다. 음원·아이콘 등의 출처와 이용 조건은 각 자료의 credits/license 파일을 따릅니다.
