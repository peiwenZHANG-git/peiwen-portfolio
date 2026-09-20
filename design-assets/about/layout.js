  const spreads = [
    {
      name:'① Intro',
      left:[
        el(`<div class="polaroid back"></div>`,
            'left:19.2%;top:0.1%;width:62%;filter:saturate(1.44);z-index:0;', 3),
        el(`<div class="polaroid">
              <div class="photo-inner"></div>
              <div class="cap">days @ Paris-Saclay</div>
            </div>`,
            'left:11.1%;top:3.5%;width:68%;', -3),
        st(IMG.flower, 'left:-2.9%;top:27.9%;width:27%;', 17.5),
        st(IMG.camera, 'left:51.2%;top:31.4%;width:50%;', 11),
        el(`<h2 class="title" style="--title-fs:12cqw">Hi, I'm Peiwen.</h2>
            <div class="uline" style="width:78%"></div>`,
            'left:9.6%;top:53.7%;width:94%;z-index:1;', -1),
        el(`<div class="sub" style="text-align:center">product manager · in paris</div>`,
            'left:-0.4%;top:63.2%;width:92%;--sub-fs:5.4cqw;', 0),
        el(`<p class="body">I'm exploring how to become an AI Product Manager.
            I use research, prototyping, and visual design to work with AI and
            make complex problems easier to understand, while bringing a little
            more storytelling into digital experiences.</p>`,
            'left:2.7%;top:70.1%;width:97.2%;--body-fs:4.8cqw;', 0.5),
        st(IMG['tape-pink-check'], 'left:20.4%;top:-2.5%;width:37.5%;', 4.5),
      ],
      right:[
        el(`<div class="note butter big">
              <h3>Quick Facts</h3>
              <div class="uline" style="width:64%;margin:0 auto 7%"></div>
              <div class="facts">
                <div class="fact"><span class="tag2">Now</span><span class="arw">→</span><span class="val">MSc in Human-Computer Interaction</span></div>
                <div class="fact"><span class="tag2">Focus</span><span class="arw">→</span><span class="val">AI Products · Human-AI Interaction · Interaction Design</span></div>
                <div class="fact"><span class="tag2">Languages</span><span class="arw">→</span><span class="val">Chinese · English · French</span></div>
                <div class="fact"><span class="tag2">Location</span><span class="arw">→</span><span class="val">Paris</span></div>
              </div>
            </div>`,
            'left:1.5%;top:5.3%;width:95%;z-index:-4;', -1),
        st(IMG.pin, 'left:6%;top:0%;width:13%;', -4),
        st(IMG.clip1, 'left:88.2%;top:43.4%;width:10%;z-index:-1;', 6),
        el(`<div class="chips" style="justify-content:center;gap:4%">
              <span class="chip">Design Systems</span>
              <span class="chip">Prototyping</span>
              <span class="chip">AI Products</span>
              <span class="chip">Interactive Storytelling</span>
            </div>`,
            'left:2.6%;top:64.1%;width:99.6%;zoom:1.1;filter:saturate(1.17);--chip-fs:4.7cqw;--chip-padx:8cqw;--chip-pady:5cqw;', -0.5),
        el(`<a class="cvfill" href="#" onclick="return false;">↓ Download CV</a>`,
            'left:22.8%;top:81.7%;width:56%;filter:saturate(1.26);', -1),
        el(`<div class="contact" style="justify-content:center;gap:12%"><a href="mailto:peiwen.zhang@universite-paris-saclay.fr"><svg class="ln" viewBox="0 0 24 24"><rect x="2.2" y="5.2" width="19.6" height="13.6" rx="1.6"/><path d="M2.8 6.4 L12 13.4 L21.2 6.4"/></svg><span class="wrap">Email<span class="wave"></span></span></a><a href="https://github.com/peiwenZHANG-git" target="_blank" rel="noopener"><svg class="fl" viewBox="0 0 24 24"><path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.57 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.59-4.04-1.59-.55-1.36-1.34-1.72-1.34-1.72-1.09-.73.08-.72.08-.72 1.21.08 1.84 1.22 1.84 1.22 1.07 1.8 2.81 1.28 3.5.98.1-.76.42-1.28.76-1.58-2.67-.29-5.47-1.31-5.47-5.82 0-1.29.47-2.34 1.24-3.17-.14-.3-.54-1.5.1-3.12 0 0 1.01-.32 3.3 1.21.96-.26 1.98-.39 3-.4 1.02.01 2.04.14 3 .4 2.28-1.53 3.29-1.21 3.29-1.21.65 1.62.24 2.82.12 3.12.77.83 1.23 1.88 1.23 3.17 0 4.53-2.81 5.53-5.48 5.82.42.35.81 1.08.81 2.19 0 1.58-.02 2.86-.02 3.25 0 .31.21.68.83.57C20.57 21.92 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z"/></svg><span class="wrap">GitHub<span class="wave"></span></span></a></div>`,
            'left:3.9%;top:93%;width:96%;--contact-fs:4.3cqw;', 0),
      ]
    },
    {
      name:'② My Journey',
      left:[
        st(IMG['title-myjourney'], 'left:9.3%;top:-1%;width:60.9%;', 0),
        st(IMG.feather, 'left:69.9%;top:-3%;width:19.5%;', 5),
        el(`<div class="tl">
              <div class="item">
                <div class="yr">2021 ~ 2025</div>
                <div class="sch">Communication University of China</div>
                <div class="meta">Beijing, China · BA in Digital Media Tech</div>
                <div class="tag">Found my way into interaction, visual storytelling, and creative technology.</div>
              </div>
              <div class="item">
                <div class="yr">2023</div>
                <div class="sch">Osaka University</div>
                <div class="meta">Osaka, Japan · Exchange</div>
                <div class="tag">Explored HCI through research, experiments, and a different culture.</div>
              </div>
              <div class="item">
                <div class="yr">2025 ~ now</div>
                <div class="sch">Université Paris-Saclay</div>
                <div class="meta">Paris, France · MSc HCI</div>
                <div class="tag">Now exploring Human–AI interaction and how AI products can make complexity feel clearer.</div>
              </div>
            </div>`,
            'left:-1%;top:23.3%;width:96.2%;--yr-fs:5.5cqw;--sch-fs:5.3cqw;--meta-fs:4.2cqw;--tltag-fs:4.6cqw;', 0),
        st(IMG['flower-sakura'], 'left:77.6%;top:45.1%;width:15.7%;', 0),
      ],
      right:[
        st(IMG['route-map'], 'left:-2.1%;top:28.5%;width:106.9%;', 0),
        st(IMG['peiwen-camera'], 'left:17.7%;top:56.2%;width:36.7%;', 0),
        st(IMG.pass, 'left:5%;top:4.9%;width:45.3%;', 7.5),
        el(`<div class="quote">“Different places,<br>same curiosity.”</div>`,
            'left:55.8%;top:0.7%;width:46.8%;', 7.5),
        st(IMG.globe, 'left:5.7%;top:18.5%;width:31%;', -17),
        st(IMG.suitcase, 'left:55.4%;top:75.8%;width:42.7%;', 6),
        st(IMG.clip1, 'left:10.8%;top:78.9%;width:8.3%;', -14),
      ]
    },
    {
      name:'③ Beyond',
      left:[
        el(`<p class="body">Outside of design, I love swimming, taking photos, going somewhere new, cooking, and exploring what life feels like from a different place. I'm always curious about what else life could become.</p>`,
            'left:6.1%;top:21.9%;width:90.8%;--body-fs:4.4cqw;', 0),
        st(IMG['title-beyonddesign'], 'left:7.5%;top:-1.3%;width:78.8%;', 0),
        st(IMG['peiwen-swim'], 'left:-25.6%;top:48.8%;width:64.3%;z-index:3;', 0),
        st(IMG.skillet, 'left:76.6%;top:37.5%;width:23.8%;', 25),
        st(IMG['note-thingsilove'], 'left:28.7%;top:48.5%;width:66.4%;', 0),
      ],
      right:[
        st(IMG.carousel, 'left:8.9%;top:76.7%;width:30.1%;', -6.5),
        // 这张明信片就是写信模块：虚线左侧叠真实 textarea（见 app/about/about-page.tsx 的 PostcardNote）
        st(IMG['postcard-airmail'], 'left:1.8%;top:46.1%;width:69.1%;', 0),
        st(IMG.feather, 'left:55.2%;top:76.2%;width:18.2%;', 0),
        st(IMG.bird, 'left:-5.8%;top:-0.6%;width:26.7%;zoom:1.14;z-index:3;', -4),
        el(`<div class="note blue"><h3>Currently exploring</h3><p class="body">How AI can become more than a tool - and how thoughtful interaction can make complex technology feel clearer, warmer, and easier to trust.</p></div>`,
            'left:16.6%;top:2.7%;width:74.7%;', 1),
        el(`<h2 class="title" style="--title-fs:7cqw">Write me a note…</h2>`,
            'left:4.9%;top:37.2%;width:60%;', -2),
        st(IMG.mailbox, 'left:76.2%;top:44.2%;width:22.4%;', 3),
      ]
    }
  ];