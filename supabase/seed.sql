-- ============================================================
-- Urugero Media Group — Seed Data (run AFTER schema.sql)
-- Supabase Dashboard → SQL Editor → New Query → Run
-- This file is safe to run multiple times (ON CONFLICT DO NOTHING)
-- ============================================================

-- ── Articles ─────────────────────────────────────────────
INSERT INTO public.articles
    (title, slug, excerpt, content, image_url, category, category_color,
     author, author_avatar, read_time, is_published, is_featured, published_at)
VALUES

-- Abahanzi
(
    'Gloire Ishimwe atangaje indirimbo nshya "Sinzarakaza"',
    'gloire-ishimwe-sinzarakaza-2026',
    'Umuhanzi Gloire Ishimwe yatangaje indirimbo nshya "Sinzarakaza" izuzuyemo ubuhamya n''urukundo rw''Imana.',
    E'## Intangiriro\n\nGloire Ishimwe ni umuhanzi w''indirimbo z''Imana uzwi cyane mu Rwanda. Indirimbo nshya "Sinzarakaza" yatangajwe mu kwezi gushize kandi yarubashye abantu benshi.\n\n## Ibyerekeranye n''indirimbo\n\nIndirimbo ivuga ku kwizera Imana no kuba ku ruhande rwayo igihe cyose, nubwo hari ibihe bikomeye.\n\n> "Sinzarakaza ngo mvekeshwe ingufu z''isi, ninzira ya Imana nzahamba."\n\n## Ibisobanuro by''umuhanzi\n\nGloire yavuze ati: "Iri dirimbo ryavutse mu bihe bikomeye by''ubuzima bwanjye. Nabiganiraga n''Imana maze irangira indirimbo."',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    'abahanzi',   '#7C3AED',
    'Urugero Music',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    '5 min',
    true, true, NOW() - INTERVAL '1 day'
),
(
    'The Remnant Choir: Amakorali agiye kurekura album nshya mu 2026',
    'remnant-choir-album-nshya-2026',
    'The Remnant Choir itangaje ko bagiye kurekura album nshya izuzuyemo indirimbo 15 zizeye guhesha agaciro Imana.',
    E'## The Remnant Choir\n\nThe Remnant Choir ni rimwe mu makorali azwi cyane mu Rwanda. Indirimbo zabo zizwi cyane mu Rwanda no mu mahanga.\n\n## Album nshya\n\nAlbum nshya izitwa "Ijuru Rifunguka" kandi izarimo indirimbo 15. Buri ndirimbo igira ubuhamya bw''ukuri.\n\n## Itariki yo kurekurwa\n\nAlbum izarekurwa ku itariki ya 15 Gicurasi 2026 mu gitaramo gikomeye mu Kigali Arena.',
    'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format&fit=crop',
    'amakorali',  '#059669',
    'Urugero Music',
    NULL,
    '4 min',
    true, false, NOW() - INTERVAL '2 days'
),

-- Inyigisho
(
    'Inyigisho: Umuryango Wuzuye Amahoro — Gushyira Imana Imbere',
    'inyigisho-umuryango-wuzuye-amahoro',
    'Umuryango wuzuye amahoro ntigerageza gushyira amahoro imbere, ahubwo ubashyira Imana imbere maze amahoro azaza.',
    E'## Intangiriro\n\nInyigisho z''uyu munsi zivuga ku muryango wuzuye amahoro. Ni iyihe mfatizo y''amahoro nyakuri?\n\n## Ibiri muri Bibiliya\n\nNi byinshi Bibiliya ibivuga ku muryango. Inzira nziza yo kugira umuryango wuzuye amahoro ni ugushyira Imana imbere (Matayo 6:33).\n\n## Icyigwa cya mbere: Gusenga hamwe\n\nAbagabo n''abagore bamaraho igihe gusenga hamwe buri munsi, umuryango wabo uzagira amahoro.\n\n## Icyigwa cya kabiri: Gusomana Ijambo ry''Imana\n\nGusoma Bibiliya hamwe buri cyumweru ni inzira nziza yo kugira umuryango wuzuye inyigisho.',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop',
    'inyigisho',  '#1E40AF',
    'Pasteri Emmanuel Nshuti',
    NULL,
    '9 min',
    true, false, NOW() - INTERVAL '3 days'
),
(
    'Ubuzima bw''Umwuka: Gusenga Iminota 30 Buri Munsi Bigutera Iki?',
    'ubuzima-bwumwuka-gusenga-30-min',
    'Ubushakashatsi bugaragaza ko abantu basenga iminota 30 buri munsi bagira ubuzima bwiza bw''umwuka no mu mutwe.',
    E'## Gusenga buri munsi\n\nGusenga ni inzira yo kuvugana n''Imana. Si ugusoma gusa, ni ukuvugana n''Imana uvuga ibiri mu mutima wawe.\n\n## Ibikorwa 5 bigufasha gusenga neza:\n\n1. Tangira umunsi wawe na gusenga mbere na cyose\n2. Banza gushimira Imana\n3. Saba Imana iguhe ubushobozi bwo gukora inshingano zawe\n4. Saba uburenganuzira bw''abantu bafitanye nawe ibibazo\n5. Saba imbaraga zo kuburanira ukuri',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    'inyigisho',  '#1E40AF',
    'Pasteri Sarah Mukamana',
    NULL,
    '7 min',
    true, false, NOW() - INTERVAL '4 days'
),

-- Amatorero
(
    'ADEPR Kigali: Itoero ryakuyemo abantu 1,200 mu gitaramo cy''Ubukirisu',
    'adepr-kigali-1200-ubukirisu',
    'Itorero rya ADEPR Kigali Centre ryateguye gitaramo gikomeye aho abantu 1,200 bakira Yesu nk''Umwami wabo.',
    E'## Gitaramo gikomeye\n\nItorero rya ADEPR Kigali Centre ryateguye iminsi 5 y''ubukirisu hakusanyirijwe abantu barenga 1,200.\n\n## Impamvu z''iki gikorwa\n\nPasteri avuga ati: "Twashakaga guhesha abantu b''u Rwanda amahirwe yo gusobanukirwa ubutumwa bwiza."\n\n## Ibisobanuro by''abakiriwe\n\nAbantu 1,200 bakira Yesu mu izi minsi 5. Ibi ni ikigwi kinini cyane mu mateka y''itorero ryacu.',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    'amatorero',  '#1E40AF',
    'Urugero Amakuru',
    NULL,
    '6 min',
    true, false, NOW() - INTERVAL '5 days'
),

-- Ibitaramo
(
    'Urugero Worship Night 2025: Amafoto n''amashusho',
    'urugero-worship-night-2025-recap',
    'Reba amafoto n''amashusho yo muri Urugero Worship Night 2025 yagiranye abantu 5,000 i Kigali.',
    E'## Urugero Worship Night 2025\n\nIjoro ry''indirimbo z''Imana ryagiranye abantu 5,000 mu Kigali Arena, Taliki ya 20 Ukwakira 2025.\n\n## Abaririmbye\n\n- Gloire Ishimwe\n- The Remnant Choir\n- Amakorali ya EER Kigali\n- Abaririmbye bo mu mahanga\n\n## Igihe gikurikira\n\nUrugero Worship Night 2026 izaba mu Gicurasi 2026. Tangira gushaka amakuru ashya.',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
    'ibitaramo',  '#F59E0B',
    'Urugero Events',
    NULL,
    '5 min',
    true, false, NOW() - INTERVAL '6 days'
),

-- Urubyiruko
(
    'Urubyiruko rw''u Rwanda: 500 barinjiye mu bikorwa by''Imana muri 2025',
    'urubyiruko-rwanda-500-2025',
    'Mu mwaka wa 2025, urubyiruko 500 rwarinjiye mu bikorwa by''Imana binyuze mu Urugero Media Youth Program.',
    E'## Porogaramu y''Urubyiruko\n\nUrugero Media yatangije porogaramu y''urubyiruko mu 2024, igamije gufasha urubyiruko gukora indirimbo z''Imana no kugira ubuhamya.\n\n## Imibare y''imbaraga\n\n- Urubyiruko 500 rwinjiye mu 2025\n- Amatorero 45 yayoboye\n- Amashusho 120 yakozwe\n\n## Ubushobozi bw''urubyiruko\n\nUrubyiruko rwinshi rwigeze gutangaza indirimbo, rwigeze kuririmba mu makirefu, kandi rwinshi rwarinjiye mu Rwanda na hanze.',
    'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop',
    'abahanzi',   '#7C3AED',
    'Urugero Youth',
    NULL,
    '6 min',
    true, false, NOW() - INTERVAL '7 days'
),

-- Hanze y''u Rwanda
(
    'African Gospel Music Festival 2025: Abaririmbye b''u Rwanda bitongoye',
    'african-gospel-festival-2025-rwanda',
    'Abaririmbye b''u Rwanda bashimishije abantu benshi muri African Gospel Music Festival yabaye i Nairobi.',
    E'## African Gospel Music Festival 2025\n\nFestival yabaye i Nairobi, Kenya, ku itariki ya 15-18 Ugushyingo 2025. Abaririmbye b''ibihugu 20 baje gushyiraho imirimo yabo.\n\n## Abaririmbye b''u Rwanda\n\nAbaririmbye b''u Rwanda bari barimo:\n- Gloire Ishimwe\n- The Remnant Choir\n- Urugero Music Academy Students\n\n## Ibisobanuro\n\nAbaririmbye b''u Rwanda barakaye abantu benshi, kandi bagerageje guhesha agaciro indirimbo z''Imana z''ikinyarwanda.',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    'hanze-yu-rwanda', '#0D1B2E',
    'Urugero Global',
    NULL,
    '8 min',
    true, false, NOW() - INTERVAL '8 days'
)

ON CONFLICT (slug) DO NOTHING;

-- ── Events ───────────────────────────────────────────────
INSERT INTO public.events
    (title, slug, description, image_url, event_date, location,
     is_free, price, tag, is_published)
VALUES
(
    'Urugero Worship Night 2026',
    'urugero-worship-night-may-2026',
    'Ijoro ry''indirimbo z''uburambe bw''Imana. Twese hamwe mu gusenga no gusingiza Imana mu ijoro ryo gutuza imitima.',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop',
    '2026-05-10',
    'Kigali Arena, Kigali',
    true, NULL,
    'Indirimbo',
    true
),
(
    'Urugero Bible Quiz Nationals 2026',
    'bible-quiz-nationals-june-2026',
    'Imikino y''igihugu yo gusuzuma ubumenyi bw''Ibyanditswe Byera. Amashuri, amatorero n''imiryango bishyira hamwe.',
    'https://images.unsplash.com/photo-1544531585-9847b68c8c86?q=80&w=800&auto=format&fit=crop',
    '2026-06-07',
    'IPRC Kigali, Kigali',
    true, NULL,
    'Bible Quiz',
    true
),
(
    'Urugero Music Academy — Kwiyandikisha 2026/2027',
    'music-academy-registration-2026',
    'Tangira urugendo rwawe rw''indirimbo z''Imana! Kwiyandikisha kuri porogaramu ya Urugero Music Academy — Vocal, Piano, Composition.',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    '2026-07-01',
    'Urugero Media Center, Remera, Kigali',
    false, '5,000 RWF',
    'Amashuri',
    true
),
(
    'Iminsi yo Gusenga — Prayer & Fasting Week',
    'prayer-fasting-week-august-2026',
    'Iminsi 7 yo gusenga no kwihangana hamwe — inyigisho z''iteka, gusenga, gusangira n''amakonferansi y''ubuzima bw''umwuka.',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    '2026-08-03',
    'ADEPR Centre, Kigali',
    true, NULL,
    'Gusenga',
    true
),
(
    'Urugero Youth Gospel Concert',
    'youth-gospel-concert-sept-2026',
    'Gitaramo cy''urubyiruko — indirimbo z''Imana, ubuhamya, no gusingiza hamwe. Nta gishingwa cyo kwinjira.',
    'https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?q=80&w=800&auto=format&fit=crop',
    '2026-09-20',
    'Amahoro Stadium, Kigali',
    true, NULL,
    'Urubyiruko',
    true
)

ON CONFLICT (slug) DO NOTHING;

-- ── Testimonies ──────────────────────────────────────────
INSERT INTO public.testimonies
    (title, slug, excerpt, content, image_url, person_name, person_church,
     person_avatar, is_published, is_featured, published_at)
VALUES
(
    'Imana Yansohoye mu Ndwara y''Umusonga',
    'imana-yansohoye-indwara-umusonga',
    'Nyuma y''imyaka 2 ndi mu ndwara y''umusonga, inyigisho za Urugero Media zanyunganiye mu kwizera.',
    E'## Ubuhamya bwanjye\n\nNyuma y''imyaka 2 ndi mu ndwara y''umusonga, nabonye ibibazo bikomeye cyane. Abasaza b''itorero bansengera, kandi Imana yanyunganiye.\n\n## Uko nabonye imirimo y''Imana\n\nHabaye rimwe nohereje gusenga, nabonye amahoro menshi cyane mu mutima wanjye. Imana yampaye ikimenyetso ko izansana.\n\n## Nyuma y''ikiraro\n\nNyuma y''amezi 6, abaganga bavugaga ko indwara irangiye. Nari nemera ubu bushobozi bw''Imana kandi ntabwo nzawibagirwa.',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800&auto=format&fit=crop',
    'Claudine Uwimana',     'ADEPR Kimironko',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    true, true,  NOW() - INTERVAL '2 days'
),
(
    'Nkiri mu Buhungiro, Imana Yantegereje',
    'nkiri-buhungiro-imana-yantegereje',
    'Nkiri mu buhungiro bwo mu 1994, nabonye Imana irampagira. Ubuhamya bw''umuturanyi wanjye bwanhinduye.',
    E'## Igihe cya Jenoside\n\nMu 1994, benshi muri twe twemeraga ko Imana idusize. Nari mu buhungiro, ndi umwana w''imyaka 8.\n\n## Umuturanyi wanjye\n\nHabaye rimwe umuturanyi wanjye — umukrisitu nyakuri — yatubikiye mu nzu ye. Yarasenga buri ijoro kandi yatweretse urukundo rw''Imana.\n\n## Imana irakora\n\nNyuma y''igihe ejo, nabonye ubuhamya bwe bwahindura ubuzima bwanjye. Ubu ndi umuyobozi w''itorero kandi nkaba waretse ubuhamya.',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    'Gaspard Nkurunziza',   'EER Remera',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    true, false, NOW() - INTERVAL '5 days'
),
(
    'Imana Yanviriye Akazi Kanjye',
    'imana-yanviriye-akazi',
    'Naburiye akazi kange nk''injeniyeri kandi nabonye ibihe bikomeye, ariko Imana yanviriye burundu.',
    E'## Ibibazo by''akazi\n\nMu 2023, naburiwe akazi kange nk''injeniyeri. Nabonye ibibazo bikomeye cyane mu muryango wanjye.\n\n## Inzira ya Imana\n\nNabwiriwe n''inshuti yanjye gukora porogaramu ya Urugero Music Academy. Nari nzi guitar ariko sinari nzi ko indirimbo z''Imana zari inzira yanjye.\n\n## Ubu buzima\n\nUbu nkora indirimbo z''Imana kandi ngira imikoro nziza. Imana yanviriye mu nzira yanjye yangu ngo inguhe inzira ye nziza.',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    'Eric Habimana',        'Eglise Vivante Nyamirambo',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    true, false, NOW() - INTERVAL '9 days'
),
(
    'Abana Banjye Basubiye ku Nzira y''Imana',
    'abana-banjye-basubiye-imana',
    'Nyuma y''imyaka 5 nsenga ku giti cyanjye ku bana banjye bababaye, Imana yarasubiza inyishu.',
    E'## Gusenga ku bana\n\nNyuma y''imyaka 5 nsenga ku giti cyanjye ku bana banjye baba bababaye, Imana yarasubiza inyishu.\n\nAbana banjye bari bashatse inzira z''isi ntibarangwa n''Imana. Nabansenga buri munsi nkabasengera bukeye.\n\n## Imana irasoma imitima\n\nRimwe, umwana wanjye mukuru yarambwiye ati: "Mama, ndashaka gusenga nawe." Iyo ari imvugo yayanditswe mu mutima wanjye ubuziraherezo.\n\n## Ishimwe\n\nUbu abana banjye bose bari mu itorero kandi umwe muri bo agira inyigisho mu itorero ryacu.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    'Véronique Mukamurenzi', 'Catholic Parish Nyamirambo',
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=100&auto=format&fit=crop',
    true, false, NOW() - INTERVAL '12 days'
)

ON CONFLICT (slug) DO NOTHING;
