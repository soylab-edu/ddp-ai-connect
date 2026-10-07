# A안 — 사람과 사람 사이

상태: 사용자 피드백으로 현재의 텍스트 중심 방향은 채택되지 않았습니다. 이 폴더는 비교·진단용 보존본이며, 디자인 완성 납품물이 아닙니다. 실제 01 레퍼런스 시퀀스를 확인한 뒤 재설계합니다.

헤더 전체가 하나의 모션 포스터가 되는 키네틱 타이포 시안입니다. `사람 → 사이 → 창작 → 함께 → 행사 포스터`로 14초 동안 진행합니다. 사람을 가장 크게, AI를 두 사람 사이의 작은 매개로 다룹니다.

## 결과물

- `header-a.html`: 반응형 웹 헤더. 폰트와 GSAP을 `assets/`에서 읽으므로 함께 보관하세요.
- `preview.mp4`: 데스크톱 1440×900, 14초, 30fps, 무음.
- `poster.png`: 데스크톱의 마지막 장면.
- `mobile/preview-mobile.mp4`: 모바일 390×844, 14초, 30fps, 무음.
- `poster-mobile.png`: 모바일의 마지막 장면.
- `video-contact-sheet.jpg`: 실제 데스크톱 MP4에서 추출한 장면 모음.

웹 헤더는 한 번 재생한 뒤 멈추며, 일시정지·계속 재생·다시보기를 지원합니다. 시스템의 모션 줄이기 설정이 켜져 있으면 마지막 장면으로 시작합니다. 화면 밖이나 다른 탭으로 이동하면 자동으로 일시정지합니다. 행사명·브랜드·일시·장소·관람시간·설명·CTA는 첫 장면부터 고정됩니다.

프로그램 보기와 참여 안내는 HTML 아래의 실제 안내 영역으로 이동합니다. 상세 프로그램·강의 신청 링크는 추후 공개로, 기업 참여는 미확정으로 표시했습니다. 이 파일은 헤더 시안이며 전체 행사 홈페이지를 재현하지 않습니다.

## 편집과 재생성

`poster.css`, `poster-body.template`, `motion.js`를 편집한 뒤 실행합니다. 웹 재생 제어는 `live.js`에 있습니다.

```powershell
node build.mjs
npx --yes hyperframes@0.8.139 check
npx --yes hyperframes@0.8.139 preview --background --port 3131
npx --yes hyperframes@0.8.139 render --quality looks --fps 30 --workers 2 --output preview.mp4
```

모바일 렌더는 `mobile` 폴더에서 같은 렌더 명령의 출력 이름을 `preview-mobile.mp4`로 바꿔 실행합니다. 미리보기 검토 후에는 `npx --yes hyperframes@0.8.139 preview --stop`으로 서버를 종료할 수 있습니다.

## 참고와 검증

- 주 참고: [hyperframes-student-kit / motion-showreel](https://github.com/nateherkai/hyperframes-student-kit). 하나의 모티프가 장면마다 의미를 바꾸고 마지막에 정착하는 구성을 참고했습니다.
- 주 참고: [motion-graphics-skills](https://github.com/imMamdouhaboammar/motion-graphics-skills). 키네틱 타이포, Four Steps Events, The Curve의 크기 대비·박자·연속성을 참고했고 코드는 직접 구현했습니다.
- 사용자 제공 01 원본의 대형 타이포·단색 면·명확한 전환을 소스로 분석했습니다. 원본을 우회 렌더링하지 않았습니다.
- 검증 결과와 한계는 `VERIFY.md`에 기록했습니다.
