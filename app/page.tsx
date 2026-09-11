// Temporary positioning copy; replace here when Peiwen approves final wording.
const positioning = "Exploring how people and AI agents work together.";

export default function Home() {
  return (
    <main className="world">
      <a className="skip-link" href="#hero">Skip the scenery</a>

      <svg className="terrain" viewBox="0 0 1440 3500" preserveAspectRatio="none" aria-hidden="true">
        <path className="far-ground" d="M724 803 Q771 768 809 772 L826 762 Q857 748 895 754 L904 750 Q976 705 1031 721 L1047 715 Q1108 696 1170 709 M1195 710 Q1314 665 1456 703" />
        <path className="ground-line" d="M-32 995 Q53 949 102 964 L117 958 Q151 954 179 962 M762 1031 Q867 1014 937 1034 L949 1031 Q1163 1086 1235 1066 M-50 1798 Q85 1834 177 1819 L188 1825 Q311 1833 421 1779 L436 1783 Q585 1730 718 1764" />
        <path className="path-line" d="M1220 824 Q1368 865 1389 961 L1386 979 Q1389 1080 1284 1159 L1277 1171 Q1111 1285 1138 1437 L1132 1452 Q1129 1572 1073 1635 L1065 1634 Q1002 1739 926 1781 L914 1795 Q835 1841 748 1929 M727 1943 Q568 2054 519 2169 L521 2181 Q464 2308 481 2441 L477 2455 Q489 2686 545 2823 L546 2842 Q548 3031 703 3181 L720 3186 Q875 3355 1091 3417 M1114 3420 L1207 3451 Q1347 3489 1477 3510" />
        <path className="path-line" d="M1210 838 Q1341 880 1358 964 L1353 981 Q1347 1063 1245 1131 L1239 1141 Q1061 1260 1091 1440 L1086 1456 Q1103 1553 1031 1620 L1024 1631 Q977 1691 886 1748 L879 1760 Q798 1813 703 1889 M685 1907 Q509 2008 452 2158 L450 2178 Q392 2312 409 2465 L406 2482 Q403 2651 460 2817 L456 2836 Q462 3071 638 3232 L659 3241 Q841 3448 1066 3485 L1085 3487 Q1262 3552 1450 3558" />
        <path className="ground-line" d="M-28 2880 Q73 2857 139 2878 L150 2875 Q196 2894 222 2891 M964 3198 Q1009 3190 1036 3204 L1049 3202 Q1200 3256 1281 3235 L1299 3239 Q1378 3222 1459 3251" />
        <g className="grass">
          <path d="M93 969 l-8 -20 13 12 -1 -26 7 31 12 -17 -5 22 M974 1042 l-7 -18 12 9 2 -21 7 30 M1202 1649 l-10 -23 14 11 4 -27 5 32 10 -16" />
          <path d="M323 2060 l-10 -18 13 6 2 -23 8 34 M958 2993 l-5 -22 12 11 2 -28 7 31 12 -11" />
        </g>
      </svg>

      <section className="opening" aria-label="Enter Peiwen's world">
        <p className="opening-name">Peiwen Zhang</p>
        <svg className="cloud" viewBox="0 0 210 95" aria-hidden="true">
          <path d="M21 67 Q3 68 8 54 L18 49 Q11 27 31 29 L41 33 Q43 10 59 16 L70 24 Q92 3 109 21 L111 33 Q143 17 150 42 L147 50 Q173 32 183 53 L184 59 Q207 60 199 72 L172 75 148 73 123 78 104 75 72 77 51 72 30 73 Z" />
          <path className="pencil" d="M34 78 l19 3 31 -1 M148 80 l28 -1" />
        </svg>
        <svg className="seed seed-air" viewBox="0 0 65 70" aria-hidden="true">
          <path d="M35 27 Q24 49 16 57 M34 26 L17 14 M34 26 L31 5 M34 26 L49 9 M34 26 L57 25 M34 26 L50 37 M13 13 l7 -4 M27 4 l9 1 M47 6 l6 6 M56 21 l3 7" />
        </svg>
        <a className="text-link explore-link" href="#hero">Explore <span aria-hidden="true">↓</span></a>
      </section>

      {/* One house across the fold: scrolling reveals its door, fence and flowers. */}
      <svg className="little-house" viewBox="0 0 480 460" aria-hidden="true">
        <path className="paper-fill" d="M100 170 L230 35 393 188 378 206 384 345 87 331 Z" />
        <path className="house-roof" d="M62 182 L95 155 125 120 156 94 187 67 222 34 237 37 263 68 296 92 321 123 356 149 394 181 418 201 392 209 360 203 325 205 286 196 245 199 205 191 167 195 128 187 90 191 Z" />
        <path className="pencil" d="M88 170 l33 -37 27 -21 M270 79 l22 22 12 4 M142 194 l41 5 24 -1" />
        <path d="M102 192 L99 229 102 264 94 294 96 325 139 330 178 329 212 336 M216 336 L263 335 309 344 348 341 387 347 381 307 385 273 380 235 382 210" />
        <path className="house-window" d="M132 224 l53 -4 -3 59 -48 -5 -2 -25 Z M157 223 l-3 50 M133 247 l50 5" />
        <path className="house-door" d="M244 337 l-4 -41 3 -65 55 7 7 105 M252 242 l33 3" />
        <path d="M281 288 l3 2 -2 3 -3 -2 Z M234 350 l27 2 37 5 12 -4" />
        <g className="front-fence">
          <path d="M26 389 l1 -39 9 -8 6 10 -2 53 M63 406 l-4 -62 7 -12 8 13 3 59 M104 409 l4 -47 7 -8 7 9 -4 49 M147 414 l-3 -69 8 -10 6 12 4 67 M187 413 l5 -48 8 -8 5 11 -4 49" />
          <path d="M17 368 l48 5 51 0 47 9 48 -2 M20 390 l36 4 54 1 47 9 50 -1" />
        </g>
        <g className="flowers">
          <path d="M220 409 l3 -18 M228 396 l-6 4 M321 406 l-3 -22 M313 394 l7 5 M338 415 l2 -13" />
          <path className="flower-rose" d="M220 389 q-7 -1 -4 -5 l6 1 q0 -8 4 -5 l1 6 q9 -2 5 4 l-5 2 q1 7 -4 4 Z" />
          <path className="flower-blue" d="M315 382 l-6 -3 3 -4 5 2 1 -5 4 1 0 6 5 1 -3 5 -5 -1 -2 4 Z" />
          <path className="flower-rose" d="M338 401 l-4 -2 2 -4 4 2 3 -3 2 4 -3 5 Z" />
        </g>
        <g className="firefly">
          <path d="M427 324 q-7 -10 -11 -3 q0 5 10 6 M429 325 q3 -12 9 -8 q4 5 -8 10" />
          <path className="firefly-light" d="M425 326 q4 -3 7 1 l-2 5 -4 -1 Z" />
        </g>
        <path className="pencil" d="M72 424 l20 1 17 -2 M275 423 l37 4 28 -3 M362 365 l22 1" />
      </svg>

      <section id="hero" className="hero" aria-labelledby="hero-title" tabIndex={-1}>
        <div className="hero-copy">
          <h1 id="hero-title">Peiwen Zhang</h1>
          <p className="hero-identity">Human-Computer Interaction</p>
          <p className="hero-university">Université Paris-Saclay</p>
          <p className="positioning">{positioning}</p>
          <a className="text-link experience-link" href="#experience">Explore experience <span aria-hidden="true">↓</span></a>
        </div>
        <svg className="seed seed-path" viewBox="0 0 65 70" aria-hidden="true">
          <path d="M32 25 Q41 48 52 57 M32 25 L10 24 M32 25 L17 9 M32 25 L35 4 M32 25 L51 13 M32 25 L54 31 M7 21 l4 7 M15 7 l7 -2 M31 3 l7 2 M50 10 l5 6" />
        </svg>
      </section>

      <section id="experience" className="experience" aria-labelledby="experience-title" tabIndex={-1}>
        <h2 id="experience-title" className="section-label">Experience</h2>
        <article className="landmark" aria-labelledby="saclay-title">
          <svg className="learning-place" viewBox="0 0 480 460" aria-hidden="true">
            <path className="paper-fill" d="M164 201 Q139 186 150 169 Q121 155 142 139 Q120 113 145 105 Q137 78 162 80 Q152 55 181 56 Q194 32 211 48 Q239 22 254 51 Q287 44 285 68 Q319 66 312 95 Q340 111 318 130 Q337 150 316 166 Q331 196 301 193 Q287 217 258 203 Q232 225 215 209 Q190 229 164 201 Z" />
            <path d="M224 210 l-2 34 5 22 -2 31 6 31 -6 29 M240 209 l5 35 -2 34 6 35 1 41 M229 279 l-25 -29 -12 -3 M242 260 l26 -25 7 -19 M212 250 l-24 -37" />
            <path className="pencil" d="M174 184 q-11 -8 -10 -16 M291 93 q10 9 5 17 M248 349 l16 4 M205 355 l17 2" />
            <path className="paper-fill" d="M53 283 l99 -5 9 22 -106 5 Z M45 326 l117 -9 25 17 -121 10 Z" />
            <path d="M53 283 l27 -3 32 1 40 -3 9 22 -43 1 -36 5 -27 -1 Z M61 305 l-2 27 M147 300 l5 25 M45 326 l35 -4 34 0 48 -5 25 17 -43 5 -34 -1 -44 6 Z M67 345 l-5 39 10 -2 3 -36 M164 339 l7 44 8 -2 -3 -41" />
            <path d="M346 309 l28 -5 31 3 22 -2 15 14 -18 15 -28 -3 -48 7 Z M380 335 l-5 61 M389 337 l-5 57 M362 321 l40 -3 -7 -6 M402 318 l-8 10" />
            <path className="grass" d="M43 396 l-9 -17 11 7 2 -23 7 30 M281 382 l-6 -24 12 11 3 -29 8 35 11 -17 M405 408 l-8 -18 11 6 3 -22 7 28" />
            <g className="firefly">
              <path d="M91 245 q-10 -10 -13 -3 q2 6 12 6 M94 244 q0 -12 6 -9 q5 4 -4 13" />
              <path className="firefly-light" d="M91 245 l6 1 -1 5 -5 0 Z" />
            </g>
            <g className="firefly">
              <path d="M429 377 q-7 -9 -11 -4 q0 5 9 7 M433 378 q0 -10 6 -8 q4 5 -5 10" />
              <path className="firefly-light" d="M428 378 l5 -1 2 5 -4 2 -4 -3 Z" />
            </g>
            <path className="pencil" d="M47 412 l31 -1 19 3 M127 398 l24 2 24 -3 M354 410 l22 1" />
          </svg>
          <div className="landmark-copy">
            <h3 id="saclay-title">Université<br />Paris-Saclay</h3>
            <p className="landmark-identity">Human-Computer Interaction</p>
            <p className="landmark-note">Details coming soon.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
