const W='var(--line-paper)',I='var(--line-ink)';
const defs=`<defs>
<symbol id="speaker" viewBox="0 0 330 540">
<g stroke="${I}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
<path d="M103 277Q155 284 207 274L215 337L235 455L195 462L164 361L144 461L97 459L100 345Z" fill="${I}"/>
<path d="M161 304L163 360M109 326L122 306M190 320L202 390" fill="none" stroke="${W}" stroke-width="1.8"/>
<path d="M98 452L140 454L143 481Q131 490 85 487L76 480L88 469Z" fill="${W}"/><path d="M81 479L139 479M95 463L119 471M99 459L125 469M86 470L111 474" fill="none" stroke-width="1.7"/>
<path d="M194 452L231 449Q236 466 249 470L264 478Q273 490 255 492L197 489L189 481Z" fill="${W}"/><path d="M192 482L265 485M208 460L230 470M207 467L224 475M200 473L218 480" fill="none" stroke-width="1.7"/>
<path d="M128 111L119 130Q105 132 89 146Q73 184 90 228L98 285Q139 303 210 280L205 224L217 167Q206 143 172 129L168 108Z" fill="${W}"/>
<path d="M124 125Q142 145 172 128M137 142L148 185L152 280M100 197L111 218M188 163L196 199M169 256L188 264M99 275Q144 290 208 270" fill="none" stroke-width="1.9"/>
<path d="M173 169L201 185L224 204L267 185L277 207L223 239Q211 244 199 234L164 204" fill="${W}"/>
<path d="M262 184L277 174L291 169Q299 168 295 175L285 181L310 182Q319 185 312 190L292 190L313 195Q320 199 311 202L290 198L306 207Q310 212 302 212L277 205L267 209Z" fill="${W}"/>
<path d="M165 204L174 182M197 221L204 226" fill="none" stroke-width="1.8"/>
<path d="M100 149Q81 148 76 173L64 215Q62 229 72 238L111 267L130 244L97 216L112 180" fill="${W}"/>
<path d="M110 264L118 277Q127 285 135 278L143 267Q148 259 141 255L131 255L136 247Q138 241 131 242L121 247Z" fill="${W}"/>
<path d="M119 256L128 264M116 263L124 270M72 221L86 227M92 169L99 157" fill="none" stroke-width="1.7"/>
<path d="M128 95L126 122Q150 139 169 123L164 93Z" fill="${W}"/>
<path d="M118 54Q112 26 147 23Q179 24 181 53L178 69L188 79Q190 84 178 86L176 100Q163 116 142 104L128 92L119 78Z" fill="${W}"/>
<path d="M117 78Q104 71 108 51Q95 35 111 24Q114 7 132 14Q150-1 163 13Q185 10 187 31Q194 43 181 54L175 44Q151 58 133 43L128 72Z" fill="${I}"/>
<path d="M119 71Q110 61 117 60Q128 59 129 74M116 25Q131 16 144 23" fill="none" stroke="${W}" stroke-width="1.8"/>
</g></symbol>
<symbol id="listener" viewBox="0 0 300 540"><g stroke="${I}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
<path d="M84 279Q149 298 206 277L215 366L201 466L157 463L157 360L138 469L90 467L87 358Z" fill="${I}"/>
<path d="M151 310L157 360M109 319L100 375M192 317L194 427" stroke="${W}" stroke-width="1.8" fill="none"/>

<path d="M92 462L135 464L139 482Q134 490 118 490H65Q61 482 72 478L89 473Z" fill="${W}"/><path d="M64 485H134M91 473L108 482M101 469L117 479M112 467L126 477" fill="none" stroke-width="1.7"/>
<path d="M158 460L200 462L210 477L225 482Q231 493 216 495L157 492L151 486Z" fill="${W}"/><path d="M155 487L225 489M167 470L191 480M178 468L198 479" fill="none" stroke-width="1.7"/>
<path d="M106 122Q83 131 76 153L70 217L84 282Q146 299 209 276L220 174Q219 137 178 123L160 110L125 109Z" fill="${W}"/>
<path d="M106 126L131 161L146 139L166 165L180 129M147 144L150 287M90 225L103 241M190 207L199 246M84 271Q141 289 207 264" fill="none" stroke-width="1.8"/>
<path d="M84 156Q73 165 71 193L59 237Q61 251 75 254L126 260L133 236L88 227L103 181" fill="${W}"/>
<path d="M123 237L143 238Q160 237 168 245L169 252L144 257L128 256Z" fill="${W}"/><path d="M145 244L163 246M145 250L166 251" fill="none" stroke-width="1.5"/>
<path d="M188 147Q209 155 217 179L230 208L255 194L267 215L232 242Q219 251 208 238L177 204" fill="${W}"/>
<path d="M252 193L257 177L254 161Q256 154 261 159L267 174L271 146Q274 139 278 146L278 177L284 155Q288 150 290 157L285 183L281 202L266 215Z" fill="${W}"/>
<path d="M191 196L200 218M77 235L88 240" fill="none" stroke-width="1.8"/>
<path d="M124 96L123 120L145 138L168 119L166 99Z" fill="${W}"/>
<path d="M114 44Q121 23 149 26Q179 35 176 60L177 86Q167 111 147 112Q121 103 115 84Z" fill="${W}"/>
<path d="M112 81Q91 62 103 40Q105 19 125 19Q133 0 151 12Q178 9 186 37Q191 63 177 89L171 69Q154 64 147 43Q140 61 119 62Z" fill="${I}"/>
<path d="M112 36Q126 22 141 25M123 65Q114 62 115 74" fill="none" stroke="${W}" stroke-width="1.6"/>
</g></symbol>
<symbol id="woman-standing" viewBox="0 0 300 540"><g stroke="${I}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
<path d="M87 280Q134 289 197 276L219 350L223 466L171 467L156 357L142 466L87 466L92 355Z" fill="${I}"/><path d="M151 308L156 357M108 321L101 436M185 310L204 430" stroke="${W}" stroke-width="1.8" fill="none"/>
<path d="M88 460H139L148 479Q145 490 123 492L72 490Q65 483 77 477L85 472Z" fill="${W}"/><path d="M72 485L142 484M90 471L114 481M102 467L124 478" fill="none" stroke-width="1.7"/>
<path d="M173 462L221 460L223 477L244 486Q249 496 233 497L174 493L165 486Z" fill="${W}"/><path d="M168 486L243 491M186 470L204 483M197 468L214 482" fill="none" stroke-width="1.7"/>
<path d="M111 121Q82 127 75 152L68 202L84 279Q142 297 201 279L220 194Q224 150 187 128L168 119Z" fill="${W}"/>
<path d="M117 124Q145 145 175 124M141 138L142 279M85 197L93 224M183 202L188 250M84 270Q143 288 201 268" fill="none" stroke-width="1.8"/>
<path d="M84 149Q61 161 55 188L49 211L86 243L105 224L78 205L106 170" fill="${W}"/>
<path d="M85 240L96 252Q104 261 111 253L118 239L114 230L105 230L103 221L93 225Z" fill="${W}"/><path d="M98 237L108 241M97 244L105 249" fill="none" stroke-width="1.4"/>
<path d="M190 151Q211 158 214 180L205 223L162 244L152 221L181 205L175 178" fill="${W}"/>
<path d="M153 220L136 222L130 216Q125 211 122 216L124 226L112 229Q106 234 114 237L136 236L147 241L162 240Z" fill="${W}"/><path d="M124 228L139 230M193 211L186 216" fill="none" stroke-width="1.5"/>
<path d="M125 98L123 122Q148 137 171 120L165 98Z" fill="${W}"/>
<path d="M115 48Q120 22 149 24Q180 28 184 56L185 82Q177 103 159 110Q137 112 120 92L114 72Z" fill="${W}"/>
<path d="M116 78Q98 76 102 48Q107 17 133 20Q152 5 172 21Q193 28 187 59L182 70Q164 60 153 37Q143 58 119 59Z" fill="${I}"/><path d="M112 43Q82 34 79 58Q68 84 91 114Q105 130 101 150Q132 115 109 83Z" fill="${I}"/>
<path d="M106 44Q116 31 138 28M95 62Q88 77 99 94M122 65Q114 60 114 74" fill="none" stroke="${W}" stroke-width="1.7"/>
</g></symbol>
</defs>`;
const g=(id,x,y,w,h,cl='',rotate=0)=>`<g transform="translate(${x} ${y}) rotate(${rotate} ${w/2} ${h/2})"><g class="${cl}"><use href="#${id}" width="${w}" height="${h}"/></g></g>`;
const svg=(inner,m=false)=>`<svg class="art ${m?'mobile-art':'desktop-art'}" viewBox="0 0 ${m?'390 430':'1440 570'}" aria-hidden="true" data-layout-ignore>${inner}</svg>`;
const floor=`<path d="M237 539C405 535 923 545 1211 538" stroke="${I}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
const networking=`${floor}${g('speaker',238,12,331,542,'network-a',-2)}${g('woman-standing',596,17,298,536,'network-b',1)}<g transform="translate(1194 23) scale(-1 1)">${g('listener',0,0,298,536,'network-c',-1)}</g>`;
const seated=`<g stroke="${I}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M260 525H1192" fill="none"/><path d="M343 355L341 507M588 349L600 503M324 338Q468 327 608 343L608 366L327 371Z" fill="${W}"/>
<path d="M792 349L786 504M1010 348L1031 506M770 331L1031 338L1032 361L770 365Z" fill="${W}"/>
<path d="M418 307Q450 292 498 313L566 369L562 467L518 468L507 394L442 369L454 463L404 467L378 367Z" fill="${I}"/><path d="M450 333L505 371M425 378L439 439M532 382L548 450" stroke="${W}" stroke-width="1.7" fill="none"/>
<path d="M405 459L452 457L463 482L480 490Q485 500 470 502L399 499L393 491Z" fill="${W}"/><path d="M397 491L479 496M418 469L445 484M429 466L453 483" stroke-width="1.6" fill="none"/>
<path d="M520 462L559 460L570 480L590 487Q594 498 579 502L516 498L512 489Z" fill="${W}"/><path d="M516 491L589 494M532 471L554 483M541 467L562 480" stroke-width="1.6" fill="none"/>
<path d="M389 154Q413 134 459 148Q500 168 501 207L482 314Q433 341 374 316L365 252L358 196Q360 169 389 154Z" fill="${W}"/><path d="M386 163L417 188L438 168L460 195L474 172M418 188L425 314M378 260L392 278M458 283L470 294" fill="none" stroke-width="1.8"/>
<path d="M375 176Q355 188 352 216L355 272L401 310L420 288L386 257L392 211" fill="${W}"/>
<path d="M401 306L411 321L432 327Q443 327 441 320L427 312L440 315Q449 313 443 308L424 297L420 288Z" fill="${W}"/><path d="M417 310L435 318M365 262L374 268" fill="none" stroke-width="1.5"/>
<path d="M475 181Q498 183 503 210L523 241L578 227L585 253L524 272Q509 275 499 264L463 223" fill="${W}"/>
<path d="M403 125L396 155Q422 181 447 155L444 125Z" fill="${W}"/><path d="M392 83Q390 48 424 48Q458 52 459 82L457 100L465 109L453 117L452 136Q430 156 408 138L397 118Z" fill="${W}"/>
<path d="M393 113Q377 103 382 83Q371 61 390 50Q394 32 413 39Q434 24 448 40Q471 41 469 65L458 82Q434 78 420 64L404 88L406 111Z" fill="${I}"/><path d="M391 60Q405 48 421 48M392 99Q403 92 406 107" stroke="${W}" stroke-width="1.5" fill="none"/>
<path d="M822 315Q863 299 910 311L976 356L1002 459L956 472L923 394L863 378L851 468L804 463L794 365Z" fill="${I}"/><path d="M840 335L862 376M839 385L827 444M946 377L975 446" stroke="${W}" stroke-width="1.8" fill="none"/>
<path d="M805 459L851 460L855 483L871 492Q875 501 860 504L792 499L789 490Z" fill="${W}"/><path d="M792 490L868 498M817 469L840 484M825 466L848 482" stroke-width="1.6" fill="none"/>
<path d="M956 463L998 453L1013 471L1038 476Q1046 489 1030 496L963 502L954 491Z" fill="${W}"/><path d="M958 490L1038 486M974 468L996 481M984 464L1004 477" stroke-width="1.6" fill="none"/>
<path d="M824 151Q863 138 898 155Q928 170 935 204L918 315Q863 340 804 312L792 232L790 195Q796 165 824 151Z" fill="${W}"/><path d="M828 154Q852 182 881 158M850 180L849 319M814 257L820 279M899 264L909 284" fill="none" stroke-width="1.8"/>
<path d="M810 175Q787 183 776 211L739 235L696 213L684 237L737 268Q751 274 764 263L819 230" fill="${W}"/>
<path d="M697 215L683 207L668 184Q663 179 659 183Q656 188 663 202L647 201Q638 202 642 208L659 214L670 229L685 237Z" fill="${W}"/><path d="M666 209L676 220M753 245L764 244" fill="none" stroke-width="1.5"/>
<path d="M908 182Q934 190 938 218L933 273L885 309L868 286L902 260L890 218" fill="${W}"/>
<path d="M885 307L877 322L855 325Q845 325 850 318L864 309L851 313Q842 312 848 306L867 294L870 286Z" fill="${W}"/><path d="M860 314L875 304" fill="none" stroke-width="1.5"/>
<path d="M833 126L827 156Q852 177 879 157L873 125Z" fill="${W}"/><path d="M824 83Q825 46 859 50Q891 55 891 84L885 112Q877 140 856 141Q833 133 825 112Z" fill="${W}"/>
<path d="M824 113Q803 110 808 83Q803 58 822 47Q846 29 870 44Q898 44 902 72Q905 101 888 120L881 92Q859 79 850 62Q841 91 824 94Z" fill="${I}"/><path d="M808 78Q789 94 799 124Q806 145 792 167Q826 146 817 114Z" fill="${I}"/><path d="M817 68Q829 52 847 52M825 103Q816 97 818 112" fill="none" stroke="${W}" stroke-width="1.5"/>
<g class="tablet"><path d="M571 172L704 181L677 299L546 288Z" fill="${W}"/><path d="M579 185L692 192L671 283L558 276Z" fill="none" stroke-width="1.4"/><path d="M595 226L642 230M590 241L659 247M586 255L630 259" stroke-width="1.6" fill="none"/><circle cx="628" cy="194" r="2" fill="${I}"/><text x="611" y="219" fill="${I}" stroke="none" font-family="Pretendard" font-size="18" font-weight="800">AI</text></g>
<path d="M578 227L591 230Q597 234 593 238L581 241L592 245Q597 250 589 253L575 252L565 246L568 232Z" fill="${W}"/>
</g>`;
const consultation=`<g stroke="${I}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M243 527H1210" fill="none"/><path d="M319 332L304 500M474 337L490 504M300 323L480 330L480 351L301 346Z" fill="${W}"/>
<path d="M935 335L922 503M1097 337L1111 505M917 321L1106 327L1110 350L918 346Z" fill="${W}"/>
<path d="M338 304Q385 287 427 307L496 354L484 462L439 463L440 389L389 368L370 465L324 463L316 368Z" fill="${I}"/><path d="M373 328L389 368M354 377L341 441M469 381L466 444" stroke="${W}" stroke-width="1.7" fill="none"/>
<path d="M325 459L369 459L375 482L391 491Q397 504 381 506L312 501L307 491Z" fill="${W}"/><path d="M312 492L392 498M337 469L359 485M347 465L369 480" stroke-width="1.6" fill="none"/>
<path d="M440 459L483 459L493 480L513 488Q519 501 501 504L434 499L430 490Z" fill="${W}"/><path d="M434 491L512 497M452 469L476 484M462 466L485 481" stroke-width="1.6" fill="none"/>
<path d="M331 161Q362 144 399 153Q433 166 449 196L437 311Q384 334 325 310L309 228Q307 180 331 161Z" fill="${W}"/><path d="M343 156Q359 179 389 161M365 177L370 311M324 249L339 270M414 239L425 277" stroke-width="1.8" fill="none"/>
<path d="M349 124L341 159Q360 179 389 161L392 129Z" fill="${W}"/><path d="M336 80Q343 44 374 51Q407 58 407 86L407 106L415 114L402 124Q402 142 385 151Q360 150 344 129Z" fill="${W}"/>
<path d="M338 116Q321 108 324 81Q321 59 340 49Q361 32 382 44Q410 48 413 74L405 91Q381 90 364 70Q355 89 341 91Z" fill="${I}"/><path d="M331 70Q341 55 361 53M339 109Q348 102 348 119" fill="none" stroke="${W}" stroke-width="1.5"/>
<path d="M942 309Q990 294 1031 312L1059 369L1062 466L1015 469L1000 394L961 372L946 464L899 463L911 354Z" fill="${I}"/><path d="M947 334L961 371M929 376L917 443M1033 385L1041 447" fill="none" stroke="${W}" stroke-width="1.7"/>
<path d="M900 458L945 459L947 482L966 491Q971 503 954 505L886 500L882 491Z" fill="${W}"/><path d="M886 491L966 497M911 469L934 484M921 466L944 480" fill="none" stroke-width="1.6"/>
<path d="M1015 462L1061 459L1069 479L1090 485Q1096 497 1081 502L1011 501L1007 491Z" fill="${W}"/><path d="M1011 493L1090 494M1029 470L1054 484M1038 467L1064 481" fill="none" stroke-width="1.6"/>
<path d="M942 165Q968 151 1003 157Q1044 171 1056 204L1041 313Q990 334 925 310L920 226Q918 180 942 165Z" fill="${W}"/><path d="M951 160Q973 184 1006 165M976 182L979 315M930 257L943 279M1028 254L1039 286" fill="none" stroke-width="1.8"/>
<path d="M960 130L950 165Q975 184 1007 166L1003 131Z" fill="${W}"/><path d="M947 86Q951 52 981 53Q1016 53 1019 84L1016 112Q1004 139 983 142Q961 137 950 117Z" fill="${W}"/>
<path d="M948 118Q932 111 935 83Q928 61 949 49Q963 32 984 43Q1012 38 1023 66Q1031 91 1016 121L1008 92Q985 87 973 66Q963 91 950 96Z" fill="${I}"/><path d="M945 75Q959 55 976 55M950 108Q941 101 943 115" fill="none" stroke="${W}" stroke-width="1.5"/>
<path d="M480 282L936 282L966 321L467 331Z" fill="${W}"/><path d="M467 331L967 321L967 337L467 346Z" fill="${W}"/><path d="M490 344L489 509M934 339L947 509" fill="none" stroke-width="3"/>
<path d="M428 187Q449 194 452 215L463 252L551 270L544 294L442 275Q429 273 423 259L406 220" fill="${W}"/>
<path d="M549 269L570 270L590 260Q599 258 596 265L584 274L607 276Q615 280 607 284L583 281L603 288Q609 293 601 295L574 288L551 294L542 290Z" fill="${W}"/><path d="M440 253L449 263" fill="none" stroke-width="1.6"/>
<path d="M327 185Q304 195 304 222L316 272L397 294L406 268L343 249L349 214" fill="${W}"/>
<path d="M398 268L423 270Q435 271 439 280L435 288L405 292L397 286Z" fill="${W}"/><path d="M419 277L434 280M417 284L433 286" fill="none" stroke-width="1.4"/>
<path d="M940 187Q917 198 912 226L890 260L815 269L816 295L904 285Q917 283 925 269L958 228" fill="${W}"/>
<path d="M817 268L795 268Q779 268 773 278L777 286L803 290L818 289Z" fill="${W}"/><path d="M781 277L799 277M780 283L799 284" fill="none" stroke-width="1.4"/>
<path d="M1035 191Q1058 203 1060 229L1054 273L983 297L972 272L1020 254L1014 218" fill="${W}"/>
<path d="M975 272L954 271L943 279Q936 285 944 289L961 288L978 293L985 286Z" fill="${W}"/><path d="M950 280L966 281" fill="none" stroke-width="1.4"/>
<path d="M632 261L733 255L761 306L658 315Z" fill="${W}"/><path d="M644 269L695 266M650 280L731 274M657 291L728 285" fill="none" stroke-width="1.5"/>
<path d="M865 276L928 271L950 308L883 313Z" fill="${W}"/><path d="M877 283L914 281M883 292L930 288" fill="none" stroke-width="1.5"/>
<path d="M612 308L630 306" stroke-width="4"/>
</g>`;
const scenes=[
{id:'networking',bg:'#7A00EE',light:true,caption:'사람과 사람이 만나는 자리.',n:'01',art:svg(networking)+svg(`<g transform="translate(-305 7) scale(.68)">${networking}</g>`,true)},
{id:'word1',bg:'#111111',caption:'기술보다 먼저,',n:'02',light:true,art:'<div class="genre-word">사람과 사람</div>'},
{id:'experience',bg:'#CCFF00',caption:'AI를 사이에 두고, 함께 경험하다.',n:'03',art:svg(seated)+svg(`<g transform="translate(-308 4) scale(.7)">${seated}</g>`,true)},
{id:'word2',bg:'#DF0221',caption:'서로 다른 창작을 잇는',n:'04',light:true,art:'<div class="genre-word">AI를 사이에 두고</div>'},
{id:'consultation',bg:'#111111',light:true,caption:'질문을 나누고, 다음을 함께 만들다.',n:'05',art:svg(consultation)+svg(`<g transform="translate(-299 4) scale(.68)">${consultation}</g>`,true)},
{id:'finale',bg:'#7A00EE',light:true,caption:'AI를 사이에 두고,',n:'06',art:'<div class="final-title">사람과 사람이<br>만나다.</div><p class="final-note">전시·상영·강의·교류.<br>함께 만드는 다음 장면.</p>'+svg(`<g transform="translate(620 101) scale(.64)">${networking}</g>`)+svg(`<g transform="translate(-234 145) scale(.52)">${networking}</g>`,true)}
];
export {defs,scenes};
