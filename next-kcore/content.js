/* Edit the content here, then run python build.py to update the portable HTML. */
const EVENT = {
  subtitle: 'AI로 이어진 사람들',
  // Set an https:// form URL when applications open. Until then, buttons show an announcement.
  registrationUrl: '',
  sessions: [
    { id: 1, speaker: '강사 1', period: '오전', title: '세션 1 · 추후 공개', description: '첫 번째 세션의 주제와 강의 소개가 곧 공개됩니다.', time: '추후 공개', capacity: '추후 공개', bio: '추후 공개', takeaways: '추후 공개', formUrl: '' },
    { id: 2, speaker: '강사 2', period: '오후', title: '세션 2 · 추후 공개', description: '두 번째 세션의 주제와 강의 소개가 곧 공개됩니다.', time: '추후 공개', capacity: '추후 공개', bio: '추후 공개', takeaways: '추후 공개', formUrl: '' },
    { id: 3, speaker: '강사 3', period: '오후', title: '세션 3 · 추후 공개', description: '세 번째 세션의 주제와 강의 소개가 곧 공개됩니다.', time: '추후 공개', capacity: '추후 공개', bio: '추후 공개', takeaways: '추후 공개', formUrl: '' },
    { id: 4, speaker: '강사 4', period: '오후', title: '세션 4 · 추후 공개', description: '네 번째 세션의 주제와 강의 소개가 곧 공개됩니다.', time: '추후 공개', capacity: '추후 공개', bio: '추후 공개', takeaways: '추후 공개', formUrl: '' }
  ],
  partners: [
    {
      id: 'com2us', display: 'com2us', name: '컴투스', domain: 'GAME × AX', symbol: '✳',
      headline: '게임을 만드는 방식의 다음',
      description: '게임 개발과 아트, 개발 도구 등 다양한 직무의 AI 활용을 추진하는 컴투스. AX HUB의 시도를 창작자의 경험과 연결합니다.',
      tags: ['게임 제작', 'AX HUB', '창작 프로세스'],
      scenario: '게임 제작 사례를 보고, 만드는 과정과 현업의 변화를 직접 묻는 부스.',
      details: ['AX HUB의 게임·아트 제작 사례와 AI 활용 과정을 소개하는 쇼케이스', '담당자의 제작 과정 설명과 현장 질의응답', '창작자와 현업의 접점을 넓히는 대화 및 굿즈 이벤트 제안'],
      benefit: '게임과 AI에 관심 있는 창작자에게 실제 활용 사례를 전하고, 미래의 동료와 새로운 접점을 만듭니다.',
      source: 'https://on.com2us.com/press/컴투스-ai-경쟁력-확대-본격화-내부-전문-조직-신설/',
      sourceLabel: '컴투스 공식 소개', sourceNote: '컴투스 공식 AX HUB 발표를 참고해 구성한 행사 참여 제안입니다.'
    },
    {
      id: 'fastcampus', display: 'fast campus', name: '패스트캠퍼스', domain: 'LEARNING × WORK', symbol: '↗',
      headline: '배움이 실제 업무가 되도록',
      description: '직무·직급·산업에 맞춘 실습 중심 AI 교육. 개인의 관심과 조직의 과제를 구체적인 학습 방향으로 연결합니다.',
      tags: ['실무 AI 교육', '직무별 활용', '교육 상담'],
      scenario: '“우리 팀은 무엇부터 배울까?”를 함께 생각하는 AI 교육 상담 공간.',
      details: ['직무별 AI 활용 사례와 교육 로드맵 소개', '개인·기업의 활용 목적에 맞춘 현장 교육 상담', '관심 분야별 학습 방향을 살펴보는 무료 초기 상담 제안'],
      benefit: '막연한 교육 수요를 현장의 질문으로 구체화하고, 개인과 조직이 다음 학습을 시작할 접점을 만듭니다.',
      source: 'https://b2b.fastcampus.co.kr/service_aieducation', sourceLabel: '패스트캠퍼스 공식 소개', sourceNote: '패스트캠퍼스 기업교육의 맞춤형 AI 실무 교육 소개를 참고했습니다.'
    },
    {
      id: 'ona', display: 'ONA', name: 'ONA Creation', domain: 'BRAND × EXPERIENCE', symbol: '◎',
      headline: '브랜드의 이야기를 경험으로',
      description: 'UX/UI 기획과 모션·3D·AI 생성 콘텐츠를 결합하는 크리에이티브 에이전시. 디자인과 기술로 브랜드의 경험을 만듭니다.',
      tags: ['브랜딩', 'UX/UI', '모션 · 3D · AIGC'],
      scenario: '기획에서 비주얼까지, 브랜드 콘텐츠가 완성되는 과정을 함께 보는 공간.',
      details: ['브랜드 콘텐츠와 디지털 캠페인 포트폴리오 소개', '기획·모션·3D·AI 생성 콘텐츠를 연결하는 제작 과정 공유', '브랜딩과 콘텐츠 프로젝트에 관한 현장 대화 및 협업 상담 제안'],
      benefit: '브랜드의 문제를 풀어내는 기획력과 표현 방식을 보여주고, 새로운 프로젝트와 창작 파트너를 만납니다.',
      source: 'https://www.ona.co.kr/about', sourceLabel: 'ONA 공식 소개', sourceNote: 'ONA Creation 공식 소개의 UX/UI, Immersive Visual, Creating Growth AI 내용을 참고했습니다.'
    },
    {
      id: 'bbanana', display: 'BBANANA', name: '빠나나AI', domain: 'IDEA × GENERATION', symbol: '↝',
      headline: '상상이 결과물이 되는 현장',
      description: '이미지·영상·음성 생성과 제작 자동화를 한곳에 모은 AI 플랫폼. 아이디어가 콘텐츠로 이어지는 과정을 직접 경험합니다.',
      tags: ['이미지 · 영상', 'AI 사운드', '제작 자동화'],
      scenario: '관람객의 아이디어를 현장에서 이미지와 영상으로 발전시키는 라이브 시연.',
      details: ['이미지·영상·음성 생성 도구를 활용한 제작 시연', '제품 이미지와 짧은 광고 콘텐츠 등 활용 장면 소개', '관람객의 아이디어를 함께 구체화하는 미니 데모와 질의응답 제안'],
      benefit: '완성된 결과뿐 아니라 만드는 과정을 보여주어 도구의 활용 가능성을 전하고, 사용자의 생생한 반응을 만납니다.',
      source: 'https://www.bbanana.ai/', sourceLabel: '빠나나AI 공식 소개', sourceNote: '빠나나AI 공식 서비스 화면의 통합생성·캔버스·사운드·AI 마케팅 기능을 참고했습니다.'
    }
  ],
  zones: {
    meet: {number:'01', label:'MEET & TRY', title:'서비스를 경험하고,<br>사람을 만나는 곳.', description:'기업 부스와 라이브 시연, 홍보·채용·교육 상담을 중심으로 구성합니다. 설명을 듣고, 직접 경험하고, 대화를 이어가는 공간입니다.', points:['기업별 서비스 소개와 체험', 'AI 제작 라이브 시연', '창작자·기업 담당자와의 자유로운 대화']},
    view: {number:'02', label:'WATCH & TALK', title:'작품 앞에 머물고,<br>이야기를 나누는 곳.', description:'반복 상영과 프로젝션, 이미지 작품을 통해 창작자의 시선을 만납니다. 작품명과 짧은 기획 의도를 함께 소개해 감상이 대화로 이어지도록 합니다.', points:['AI 영상 루프 상영과 프로젝션', '이미지 작품과 제작 과정 소개', '작품의 음향과 감상을 고려한 편안한 분위기']},
    entry: {number:'03', label:'WELCOME & CONNECT', title:'오늘의 경험이<br>시작되는 곳.', description:'입구와 연결 구역의 사이니지로 행사 주제와 당일 프로그램을 안내합니다. 관람객이 자신의 관심에 맞는 경험을 쉽게 찾을 수 있도록 구성합니다.', points:['입구·엘리베이터 주변 프로그램 안내', '벽면과 바닥 그래픽을 활용한 동선 유도', '포토 공간과 굿즈 등 머무를 계기 마련']}
  }
};
