# 승인된 본문 개선 — 구현 기록

편집 파일: page-review-v7.html, dark-body.css. 원본 03_NEXT_KCORE_AI_CONNECT_v12.html은 보존했습니다.

- 교육 과정의 경쟁률·지원자·기수별 인원 통계 블록을 삭제했습니다.
- 기업 참여의 120명 및 1기 60명 / 2기 60명 통계를 삭제했습니다. 양일 프로그램 안내는 유지했습니다.
- 블랙·딥퍼플 배경과 어두운 카드·선·내비게이션, 밝은 본문 색을 적용했습니다.
- 한글은 모션 헤더와 같은 로컬 Pretendard로 통일했습니다. 카드 반경은 12px 중심으로 정리했습니다.
- 시간축 라벨 컨테이너를 두 번째 grid 트랙에 명시해 좌측 중첩을 수정했습니다.
- 작품 정보가 전부 미공개일 때는 세 장르 요약만 노출합니다. 실제 제목·이미지·영상이 공개되면 기존 전체 작품과 필터 동작으로 복귀합니다.
- 강의 제목이 전부 미공개일 때는 오전 1개 / 오후 3개 세션으로 요약합니다. 실제 제목이 공개되면 기존 강의 카드로 복귀합니다.
- 참여 안내의 중복 경로 카드를 제거했습니다. 기존 대상 탭 하나로 상세 안내와 추천 동선을 함께 연결합니다.
- 반복되는 소개의 마지막 문단을 삭제했습니다.
- root가 제공한 임베드 높이 설정과 ?embed=1을 적용했습니다. 헤더 CTA 메시지는 origin·source·target을 검증한 뒤 본문 앵커로 연결합니다.

검증: 인라인 스크립트 5개가 node --check를 통과했습니다. 통계 aside 없음, 120명 블록 없음, 중복 door 없음, 대상 탭 그룹 1개를 확인했습니다. 브라우저 시각 및 실제 탭·CTA 검증은 root와 진행 중입니다.

## Final responsive verification
- At widths <=719px, the duplicate horizontal Gantt is hidden; the day cards retain the complete schedule.
- Parent CUA verification at 390px viewport after reload: document.scrollWidth=375, innerWidth=390, Gantt display=none. Horizontal overflow resolved.
- Desktop guide screenshot and free-lecture participation tab transition verified by parent. Desktop header and mobile vertical header visually reviewed using audit-v8 captures.

