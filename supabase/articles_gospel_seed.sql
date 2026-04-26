-- ============================================================
-- Gospel News Articles Seed — 7 Articles from Gospel news article.docx
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- Safe to re-run (ON CONFLICT DO NOTHING)
-- ============================================================

INSERT INTO public.articles
    (title, slug, excerpt, content, image_url, category, category_color,
     author, author_avatar, read_time, is_published, is_featured, published_at)

VALUES

-- ── 1. IBITARAMO: Bishop Masengo ─────────────────────────────
(
$$Bishop Prof. Dr. Fidèle Masengo agiye gukorera igiterane gikomeye muri USA cyitezweho kubyutsa diaspora$$,
'bishop-masengo-africa-ignite-connection-usa-2026',
$$Umushumba Mukuru w'Itorero CityLight Foursquare, Bishop Prof. Dr. Fidèle Masengo, agiye gukorera muri USA igiterane gikomeye cyiswe Africa Ignite Connection – USA, kizabera i Indianapolis/Avon kuva ku wa 8 kugeza ku wa 10 Gicurasi 2026.$$,
$$<p>Umushumba Mukuru w'Itorero CityLight Foursquare, <strong>Bishop Prof. Dr. Fidèle Masengo</strong>, agiye gukorera muri Leta Zunze Ubumwe za Amerika igiterane gikomeye cyiswe <strong>Africa Ignite Connection – USA</strong>, kigamije kuzamura ubuzima bw'umwuka no gukomeza umurimo w'Imana mu Banyarwanda n'inshuti zabo batuye mu mahanga.</p>

<p>Iki giterane gitegurwa ku bufatanye na Diaspora ya CityLight Foursquare iri muri Amerika hamwe n'abandi bafatanyabikorwa, kikaba kimaze kuba ngarukamwaka ndetse kikaba kizwiho gusiga umusaruro ufatika mu buzima bw'abacyitabira.</p>

<h2>Intego z'igiterane</h2>

<p>Mu kiganiro yagiranye n'itangazamakuru, Bishop Masengo yavuze ko intego nyamukuru y'iki giterane ari ugukangurira abatuye mu mahanga kwishakamo ububyutse. Yagize ati:</p>

<blockquote><p>«Ignite Connection – USA igamije gukangurira diaspora kwishakamo ububyutse (revival awareness), guhugura abashumba n'abayobozi (ministry leadership training), gutegura urubyiruko (Joshua generation empowerment), no kubaka imiryango ikomeye (strengthening marriage &amp; families).»</p></blockquote>

<p>Yatumiye abantu bose bazabishobora kuzitabira iki giterane kizabera mu mujyi wa <strong>Indianapolis, mu gace ka Avon, kuva ku wa 8 kugeza ku wa 10 Gicurasi 2026</strong>, ashimangira ko kwinjira ari ubuntu.</p>

<blockquote><p>«Turasaba ubishoboye wese gufasha kwamamaza iki giterane, ashyira flyers kuri status ndetse anatumira abandi.»</p></blockquote>

<h2>Abazitabira n'abazaririmba</h2>

<p>Iki giterane kizitabirwa n'abakozi b'Imana bafite ubunararibonye barimo:</p>
<ul>
  <li>Bishop Prof. Dr. Fidèle Masengo na Pastor Solange Masengo</li>
  <li>Pastor Stacy Collins</li>
  <li>Rev. Amos Mukiza</li>
  <li>Bishop Joseph Semuhanuka</li>
  <li>Apostle James Haduma</li>
  <li>Pastor Dr. Rachid Masih</li>
</ul>

<p>Mu rwego rwo kuramya no guhimbaza Imana, hazitabira abaririmbyi bakunzwe barimo: <strong>Aime Frank, Tresor Zikama, Abanaziri USA, Abayumbe, Mass Choir Indianapolis, Alexis Bisama Mukongomani</strong> n'abandi benshi.</p>

<h2>Insanganyamatsiko n'ijambo ry'Imana</h2>

<p>Iki giterane gifite insanganyamatsiko igira iti: <strong>«A house of prayer for all nations»</strong>, ishingiye ku ijambo riboneka muri Yesaya 56:7 rigira riti:</p>

<blockquote><p>«Inzu yanjye izitwa inzu yo gusengerwamo n'amahanga yose.»</p></blockquote>

<p>Ni ubutumwa bushishikariza kubaka ubumwe bw'abakristo baturutse imihanda yose y'isi, bahurira mu gusenga no gushaka Imana.</p>

<h2>Gahunda y'ibikorwa</h2>

<p>Mu bikorwa bizaranga iki giterane harimo:</p>
<ul>
  <li>Ijoro ry'ubusabane ku wa 8 Gicurasi 2026</li>
  <li>Inama z'ububyutse (Revival meetings) ku wa 9 no ku wa 10 Gicurasi</li>
  <li>Amahugurwa ku muryango n'urushako</li>
  <li>Seminari zigenewe abashumba n'abayobozi</li>
</ul>

<h2>Bishop Masengo ni muntu ki?</h2>

<p>Bishop Prof. Dr. Fidèle Masengo ni umunyamategeko w'umwuga akaba n'umwarimu muri Kaminuza. Ni umwanditsi w'ibitabo bitandukanye birimo: <em>Intimacy with God</em>, <em>The Grace of God</em>, na <em>Beyond Boundaries</em>. Azwi kandi nk'umwe mu bakozi b'Imana bakoresha neza imbuga nkoranyambaga mu ivugabutumwa.</p>

<p>By'umwihariko, azwiho gushyigikira impano z'abahanzi — aho Itorero ayoboye ryareze mu buryo bw'umwuka abaririmbyi bakomeye mu muziki wa Gospel nka Ben na Chance, Alarm Ministries, Gisubizo Ministries, Aime Frank, James na Daniella, Elysee Bigira, Joyous Melody, Confiance Muhumure n'abandi.</p>

<h2>Icyitezwe</h2>

<p>Igiterane <strong>Ignite Connection 2026 – USA</strong> gitezweho kuzana impinduka nziza mu buzima bw'abazacyitabira, binyuze mu gusenga, guhugurwa no gusabana mu buryo bwubaka ukwizera n'ubumwe bw'Abakristo batuye muri diaspora.</p>$$,
NULL,
'ibitaramo', '#F59E0B',
'Urugero Amakuru', NULL,
'8 min', true, true,
NOW() - INTERVAL '2 hours'
),

-- ── 2. ABAHANZI: Jesca Mucyowera ─────────────────────────────
(
$$Jesca Mucyowera yimukiye muri Amerika: ibyishimo n'agahinda byivanze mu rugendo rushya$$,
'jesca-mucyowera-yimukiye-muri-amerika',
$$Umuramyi ukunzwe na benshi, Jesca Mucyowera, yamaze kwimukira muri Leta Zunze Ubumwe za Amerika ari kumwe n'abana be, aho asanze umugabo we Nkundabatware Gabin (Dr Gaby) wari umaze imyaka ibiri aba muri icyo gihugu.$$,
$$<p>Umuramyi ukunzwe na benshi mu Rwanda, <strong>Jesca Mucyowera</strong>, yamaze kwimukira muri Leta Zunze Ubumwe za Amerika ari kumwe n'abana be, aho asanze umugabo we <strong>Nkundabatware Gabin (Dr Gaby)</strong> wari umaze imyaka ibiri aba muri icyo gihugu.</p>

<p>Uyu mwanzuro wakiriwe n'amarangamutima atandukanye n'abakunzi be n'abo basengana, cyane cyane abamuherekeje ku Kibuga Mpuzamahanga cy'Indege cya Kigali i Kanombe. Hari abishimiye umugisha agize wo kongera kubana n'umuryango we, mu gihe abandi bagaragaje agahinda ko kubura hafi yabo umwe mu baramyi bari bamaze kumenyera.</p>

<h2>«Ni umugisha, ariko birababaje gusiga abawe»</h2>

<p>Mu kiganiro yagiranye n'itangazamakuru mbere yo guhaguruka, Jesca Mucyowera yavuze ko kwimukira muri Amerika ari umugisha udasanzwe, nubwo bivanze n'agahinda ko gusiga igihugu n'abantu be. Yagize ati:</p>

<blockquote><p>«Ndagiye, Imana yaduhaye umugisha wo kwimukira muri Leta Zunze Ubumwe za Amerika. Turimutse n'umuryango. Ni yo mpamvu ndi kuvuga ngo ku rundi ruhande ni byiza kuko papa w'abana ari ho amaze igihe ari, ariko kandi birababaje gusiga umuryango, inshuti, abavandimwe n'igihugu wari umenyereye.»</p></blockquote>

<blockquote><p>«Ni surprise itangaje Imana yankoreye. Nari nzi ko bizaba, ariko sinari nzi ko ari iki gihe.»</p></blockquote>

<h2>Umuryango ugiye kumwongerera imbaraga mu muziki</h2>

<p>Jesca yagaragaje ko igihe yari amaze atandukanye n'umugabo we byari bigoye, cyane cyane mu kurera abana no gukomeza ibikorwa bya muzika ari wenyine. Yavuze ko umugabo we amufasha cyane mu muziki, ndetse akamwita <em>«manager mukuru»</em> — bityo kongera kubana bizatuma ibikorwa bye birushaho gutera imbere.</p>

<blockquote><p>«Hari ibirenze bagiye kubona.»</p></blockquote>

<h2>Urugendo rukomeye mu muziki wa Gospel</h2>

<p>Jesca Mucyowera ni umwe mu baramyi bakomeye mu Rwanda, wubatse izina rikomeye binyuze mu ndirimbo zakunzwe cyane zirimo:</p>
<ul>
  <li>Shimwa</li>
  <li>Yesu Arashoboye</li>
  <li>Jehovah Adonai</li>
  <li>Ntazagutererana</li>
  <li>Ndiwe</li>
  <li>Nta mpamvu</li>
</ul>

<p>Ni we wanditse indirimbo <strong>Shimwa</strong> ya Injili Bora yakunzwe cyane mu Rwanda no hanze yarwo. Mu gihe cya vuba, yari amaze gukora igitaramo gikomeye cyiswe <strong>«Restoring Worship Experience»</strong>, ndetse anasohora indirimbo eshatu ku mushinga wa album ye ya gatatu: <em>Nta mpamvu</em>, <em>Amaraso</em> na <em>Ndiwe</em> yakoranye na Tresor Nguweneza.</p>

<h2>Igitaramo cya Camp Kigali n'inkunga yihariye</h2>

<p>Ku wa 02 Ugushyingo 2025, Jesca yakoze igitaramo gikomeye muri Camp Kigali, aho yari kumwe na Alarm Ministries, True Promises na Rwibutso Emma. Iki gitaramo cyitabiriwe ku rwego rwo hejuru, aho <strong>Apotre Mignonne Kabera</strong> yamushyigikiye anamugenera inkunga ya miliyoni 5 Frw.</p>

<p>Yasobanuye ko iki gitaramo kitari icyo gusezera abakunzi be, kuko no kujya muri Amerika byamubaye nk'igitunguranye.</p>

<h2>Intambwe nshya ku rwego mpuzamahanga</h2>

<p>Nubwo yimukiye muri Amerika, Jesca Mucyowera yijeje abakunzi be ko azakomeza gukora cyane mu muziki, akomeza kwamamaza ubutumwa bwo kuramya no guhimbaza Imana ku rwego mpuzamahanga. Kujya muri Amerika bifatwa nk'intambwe nshya mu buzima bwe no mu murimo we wa muzika, aho benshi bategereje kureba uko azagura impano ye no kugera kure mu ruhando mpuzamahanga.</p>$$,
NULL,
'abahanzi', '#7C3AED',
'Urugero Amakuru', NULL,
'6 min', true, false,
NOW() - INTERVAL '4 hours'
),

-- ── 3. ABAHANZI: Patient Bizimana ────────────────────────────
(
$$Patient Bizimana yishimiye Kimber Terry waririmbye Ikinyarwanda mu ndirimbo nshya "Ndi Hano"$$,
'patient-bizimana-ndi-hano-kimber-terry',
$$Umuhanzi Patient Bizimana yashyize hanze indirimbo nshya yise "Ndi Hano" yakoranye n'umunyamerika Kimber Terry, aho Kimber yaririmbye mu rurimi rw'Ikinyarwanda — ibintu byashimishije cyane abakunzi ba Gospel.$$,
$$<p>Umuhanzi w'indirimbo zo kuramya no guhimbaza Imana, <strong>Patient Bizimana</strong>, yashyize hanze amashusho y'indirimbo ye nshya yise <strong>«Ndi Hano»</strong>, yakoranye n'umunyamerika <strong>Kimber Terry</strong> — ibintu byashimishije cyane abakunzi ba Gospel.</p>

<p>Iyi ndirimbo ifite iminota 4 n'amasegonda 37, ikaba ifite umwihariko udasanzwe aho Kimber Terry aririmba mu rurimi rw'Ikinyarwanda — ibintu bitamenyerewe ku bahanzi baturuka hanze y'u Rwanda.</p>

<h2>«Kuririmba Ikinyarwanda kwe byamukoze ku mutima» — Patient Bizimana</h2>

<p>Mu kiganiro yagiranye n'itangazamakuru, Patient Bizimana yavuze ko iki gikorwa cyamunejeje cyane, kuko kigaragaza ko ubutumwa bwiza burenga imbibi z'indimi n'ibihugu. Yagize ati:</p>

<blockquote><p>«Byaranejeje cyane kubona Kimber yemera kuririmba mu Kinyarwanda. Si ibintu bisanzwe, bisaba umutima n'ubushake bwo kumva no kubaha ururimi rw'abandi. Byanyeretse ko ubutumwa turi gutanga bugera kure, kandi bugakoraho imitima y'abantu batandukanye.»</p></blockquote>

<blockquote><p>«Iyo ubona umuntu utavuga ururimi rwawe arushyiramo imbaraga akaruririmba neza, birakunezeza bikanagutera ishema. Ni ikintu cyanyeretse ko Imana ikora mu buryo burenze uko tubitekereza.»</p></blockquote>

<h2>Ubutumwa bwimbitse bugaruka ku nyota y'umwuka</h2>

<p>Indirimbo <strong>«Ndi Hano»</strong> itanga ubutumwa bwimbitse ku muntu ushaka kwegera Imana, agaragaza inyota y'umwuka n'icyizere cyo kubona imbabazi zayo. Mu magambo agize iyi ndirimbo harimo agira ati:</p>

<blockquote><p>«Ese rya riba riracyatanga amazi ko nyotewe,<br/>Ese za mbabazi ziri ku nzira yanjye ngo mpoberane nazo…»</p></blockquote>

<p>Aya magambo agaragaza ishusho y'umuntu wifuza kwegera Imana, ayigereranya n'isoko y'amazi y'ubugingo idakama.</p>

<h2>Uko yakozwe n'ababigizemo uruhare</h2>

<p>Mu buryo bw'amajwi, iyi ndirimbo yakozwe na <strong>Mastola Music</strong>, mu gihe amashusho yayo yakozwe na <strong>Nass Lil</strong> afatanyije na <strong>Dr. Kingsley</strong>. Aba bose bagerageje kuyishyira mu ishusho ijyanye n'ubutumwa bwayo bwo kwegera Imana no gushaka ubuntu bwayo.</p>

<h2>«Ni indirimbo ifite amateka yihariye kuri njye»</h2>

<blockquote><p>«Iyi ndirimbo ifite amateka yihariye kuri njye. Gukorana n'umuntu uturuka ahandi ariko tugahuza umutima n'ubutumwa ni umugisha ukomeye. Ndizera ko izakora ku mitima ya benshi, yaba abumva Ikinyarwanda cyangwa abatacyumva ariko bakumva ubutumwa burimo.»</p></blockquote>

<p>Yakomeje ashimangira ko umuziki wo kuramya Imana ari ururimi rusangi ruhuza abantu bose — bityo kuba Kimber Terry yarahisemo kuririmba mu Kinyarwanda bikaba intambwe ikomeye mu gukomeza kugeza ubutumwa ku rwego mpuzamahanga.</p>$$,
NULL,
'abahanzi', '#7C3AED',
'Urugero Amakuru', NULL,
'5 min', true, false,
NOW() - INTERVAL '6 hours'
),

-- ── 4. AMATORERO: Kiliziya Gatolika – Gatanya ────────────────
(
$$Gatanya zikomeje kwiyongera mu Rwanda: Kiliziya Gatolika ivuga ko ari "igikuba cyacitse"$$,
'kiliziya-gatolika-gatanya-igikuba-cyacitse',
$$Imibare mishya y'NISR igaragaza ko mu 2025 ingo 4,479 zatandukanye mu Rwanda. Kiliziya Gatolika yatangaje ko iki kibazo ari "igikuba cyacitse" gikeneye kwitabwaho byihariye.$$,
$$<p>Mu gihe imibare mishya y'Ikigo cy'Igihugu cy'Ibarurishamibare <strong>(NISR)</strong> igaragaza ko gatanya zikomeje kwiyongera mu Rwanda, <strong>Kiliziya Gatolika</strong> yatangaje ko iki kibazo gikomeye kandi gikeneye kwitabwaho byihariye — kuko kigira ingaruka zikomeye ku muryango, ufatwa nk'ishingiro ry'ubuzima bw'abantu n'Igihugu.</p>

<p>Raporo yashyizwe ahagaragara ku wa <strong>15 Mata 2026</strong> igaragaza ko mu mwaka wa 2025, ingo <strong>4,479</strong> zanditswe ko zatandukanye, muri zo <strong>2,629</strong> zikaba zaratandukanye binyuze mu nkiko. Ikindi cyagaragaye ni uko <strong>41.1%</strong> by'izo ngo zari zimaze igihe kitarenze imyaka 10 zubatswe.</p>

<h2>Kiliziya: «Ni igikuba cyacitse»</h2>

<p>Iyi mibare yagarutsweho na <strong>Padiri Fraterne Nahimana</strong>, Umunyamabanga Mukuru wa Komisiyo y'Umuryango mu Nama y'Abepiskopi Gatolika mu Rwanda, nyuma y'inama yabaye ku wa 17 Mata 2026 iyobowe na Musenyeri Edouard Sinayobye. Yagize ati:</p>

<blockquote><p>«Imiryango iyo yahuye n'ibibazo byo gutandukana kwa hato na hato, twebwe nka Kiliziya dusanga ari igikuba kiba cyacitse. Kuko abinjira mu mugambi w'Imana basezerana kubana ubuziraherezo. Iyo icyo gihango gisenyutse, ni igikuba kiba cyacitse.»</p></blockquote>

<h2>Impamvu zigaragara: Kudategura neza abashyingiranwa</h2>

<p>Padiri Nahimana yagaragaje ko imwe mu mpamvu nyamukuru ituma ingo zitandukana ari uko abashyingiranwa batitegura bihagije mbere yo kwinjira mu rushako. Yagize ati:</p>

<blockquote><p>«Byamaze kugaragara ko izo ngo zitandukana akenshi biba byarapfuye hakiri kare. Abantu binjira mu rushako badateguwe neza, batumva inshingano zibategereje.»</p></blockquote>

<h2>Ingamba: Gutegura no guherekeza imiryango</h2>

<p>Mu rwego rwo guhangana n'iki kibazo, Kiliziya Gatolika ikomeje gushyira imbaraga mu:</p>
<ul>
  <li>Gutegura abagiye kurushinga</li>
  <li>Guherekeza ingo zikiri nto</li>
  <li>Gutanga inyigisho ku buzima bw'umuryango</li>
</ul>

<blockquote><p>«Si ukubarushya, ni ukubategura neza ejo hazaza kugira ngo bazubake ingo zihamye.»</p></blockquote>

<p>Yongeyeho ko cyane cyane mu myaka 5 ya mbere y'urushako, ingo zikwiye guherekezwa cyane kuko ari ho ibibazo byinshi bitangira.</p>

<h2>Aho Kiliziya ihagaze kuri gatanya</h2>

<p>Mu nyigisho za Kiliziya Gatolika, ugushyingirwa ni Isakaramentu ridaseswa — bityo gatanya ntifatwa nk'igikwiye gusesa isezerano ry'abashakanye. Kiliziya isaba hashyirwa imbaraga mu gutegura neza abagiye kurushinga, gufasha ingo gukemura ibibazo hakiri kare, no gukomeza kubaka indangagaciro z'umuryango.</p>$$,
NULL,
'amatorero', '#1E40AF',
'Urugero Amakuru', NULL,
'5 min', true, false,
NOW() - INTERVAL '8 hours'
),

-- ── 5. AMAKORALI: True Promises – Goligota ───────────────────
(
$$Umuryango wa True Promises washyize hanze "Goligota", Rene Patrick ayigaragaramo aririmba live$$,
'true-promises-goligota-rene-patrick',
$$Umuryango wa True Promises washyize hanze indirimbo nshya yise "Goligota" — live worship ifite iminota 12, aho umuramyi Rene Patrick agaragara ahabwa microfone akayiririmbamo. Ikomeje kuvugisha benshi mu bakunzi ba Gospel.$$,
$$<p>Umuryango wa <strong>True Promises</strong>, ukunzwe n'abatari bake mu muziki wo kuramya no guhimbaza Imana, washyize hanze indirimbo nshya yise <strong>«Goligota»</strong>, ikomeje kuvugisha benshi mu bakunzi ba Gospel.</p>

<p>Iyi ndirimbo ije ikurikira indi baherutse gushyira hanze yitwa <strong>«Yesu ni mwiza»</strong> — yakozwe mu buryo bwa live worship, ifite iminota 12 n'amasegonda 32. Yakiriwe neza kubera uburyo bwimbitse bwo kuramya Imana.</p>

<h2>Rene Patrick agaragara aririmba live</h2>

<p>Indirimbo <strong>«Goligota»</strong> igaragaramo umuramyi <strong>Rene Patrick</strong>, aho agaragara ahabwa microfone akayiririmbamo mu buryo bwa live. Uko kuyiririmba mu buryo bwa live bituma ubutumwa bwayo bugera ku mitima ya benshi mu buryo bwihariye, bigafasha abayumva kwinjira mu mwuka wo kuramya Imana byimbitse.</p>

<h2>Ubutumwa bushingiye ku gitambo cya Yesu</h2>

<p>Nk'uko izina ry'iyo ndirimbo ribigaragaza, <strong>«Goligota»</strong> igaruka ku gitambo cya Yesu Kristo — kikaba ishingiro ry'agakiza ku bakristo. Ni indirimbo ifite amagambo akora ku mutima, ashimangira urukundo n'imbabazi by'Imana.</p>

<h2>True Promises ikomeje kwagura ibikorwa</h2>

<p>True Promises ikomeje kugaragaza ko iri mu makipe akomeye mu muziki wa Gospel, by'umwihariko mu gukora indirimbo za live worship zifasha abakunzi babo kwegera Imana. Uyu muryango umaze kubaka izina rikomeye binyuze mu ndirimbo zifite uburebure n'ubutumwa bwimbitse, zituma abantu benshi baguma babakurikira.</p>

<p>Gushyira hanze «Goligota» ni indi ntambwe ikomeye kuri True Promises — igaragaza ko bakomeje gushyira imbaraga mu kugeza ubutumwa bwiza ku bantu banyuranye. Abakunzi babo bakomeje gutegereza ibindi bikorwa bishya.</p>$$,
NULL,
'amakorali', '#059669',
'Urugero Amakuru', NULL,
'4 min', true, false,
NOW() - INTERVAL '12 hours'
),

-- ── 6. AMAKURU YO HANZE: Papa Leo XIV ────────────────────────
(
$$Papa Leo XIV yamaganye imyanzuro y'Abepiskopi b'u Budage ku guha umugisha abaryamana bahuje ibitsina$$,
'papa-leo-xiv-abepiskopi-budage-abahuje-ibitsina',
$$Umushumba wa Kiliziya Gatolika ku isi, Papa Leo XIV, yamaganye ku mugaragaro imyanzuro y'Abepiskopi b'u Budage bemeye gutanga umugisha ku bashakanye bahuje ibitsina, agaragaza ko bitajyanye n'inyigisho za Kiliziya.$$,
$$<p>Umushumba wa Kiliziya Gatolika ku isi, <strong>Papa Leo XIV</strong>, yamaganye ku mugaragaro imyanzuro y'Abepiskopi b'u Budage bemeye gutanga umugisha ku bashakanye bahuje ibitsina — agaragaza ko bitajyanye n'inyigisho za Kiliziya.</p>

<p>Ibi Papa Leo XIV yabivuze ubwo yari mu rugendo asubira i Roma avuye mu ruzinduko rw'iminsi itandukanye yagiriye ku mugabane wa Afurika.</p>

<h2>«Kiliziya ntiyemera umugisha wemeza ayo masezerano»</h2>

<p>Mu kiganiro yagiranye n'abanyamakuru, Papa Leo XIV yavuze ko ubuyobozi bwa Kiliziya bwamaze kuganira n'Abepiskopi b'u Budage. Yagize ati:</p>

<blockquote><p>«Ubuyobozi bwa Kiliziya bwamaze kuvugana n'Abepiskopi b'u Budage, bubasobanurira ko butemera umugisha wemeza ku mugaragaro abashakanye bahuje ibitsina cyangwa abari mu mibanire idasanzwe, uretse kuba abantu bose bashobora guhabwa umugisha nk'uko byavuzwe na Papa Fransisiko.»</p></blockquote>

<h2>Byatewe n'icyemezo cya Kardinali Reinhard Marx</h2>

<p>Aya magambo aje nyuma y'uko <strong>Kardinali Reinhard Marx</strong>, Umushumba Mukuru wa Munich na Freising, yemeye ko mu diyosezi ayobora hatangwa umugisha ku bashakanye bahuje ibitsina. Iki cyemezo cyari gishingiye ku mabwiriza yatanzwe n'Inama y'Abepiskopi Gatolika mu Budage.</p>

<h2>Papa Leo XIV akomeje kugaragaza umurongo mushya</h2>

<p>Papa Leo XIV — usimbuye Papa Fransisiko kandi akaba ari we Papa wa mbere ukomoka muri Leta Zunze Ubumwe za Amerika — azwiho kugira umurongo ukomeye ku bijyanye n'imyitwarire n'imyemerere ya Kiliziya mu mibereho y'abakirisitu. Yashimangiye ko ibibazo nk'ibi bidakwiye guteza amacakubiri muri Kiliziya. Ati:</p>

<blockquote><p>«Ubumwe cyangwa amacakubiri ntibikwiye gushingira ku bibazo by'imibonano mpuzabitsina. Hari ibindi bibazo bikomeye kurushaho nko kurengera uburenganzira, uburinganire hagati y'umugabo n'umugore, n'ubwisanzure mu myemerere — bikwiye guhabwa umwanya wa mbere.»</p></blockquote>

<h2>Icyo bivuze kuri Kiliziya ku isi</h2>

<p>Iyi mvugo ya Papa Leo XIV igaragaza itandukaniro riri hagati y'ibitekerezo by'Abepiskopi bamwe n'umurongo rusange wa Kiliziya Gatolika ku isi. Ni ikibazo gikomeje kugibwaho impaka hirya no hino ku isi — aho bamwe bashyigikira impinduka mu myemerere, mu gihe abandi bashimangira ko inyigisho za Kiliziya zitagomba guhinduka.</p>$$,
NULL,
'hanze-yu-rwanda', '#0D1B2E',
'Urugero Amakuru', NULL,
'5 min', true, false,
NOW() - INTERVAL '1 day'
),

-- ── 7. INYIGISHO / UMURYANGO: Gusengera hamwe ────────────────
(
$$Ikintu kimwe kibura mu ngo nyinshi z'Abakristo: Gusengera hamwe nk'abashakanye$$,
'gusengera-hamwe-nkubakanye-ikintu-kibura',
$$Mu bashakanye b'Abakristo, gusengerana buri munsi ni kimwe mu bikorwa bigira ingaruka nziza cyane mu mubano. Reba impamvu gusengera hamwe ari ingenzi mu kugeza urugo ku ntego ya Imana.$$,
$$<p>Mu bashakanye b'Abakristo, hari igihe bibwira ko urugo rwabo rukomeye kubera kwizera bafite — ko rutazahura n'ibibazo nk'amakimbirane, ububabare cyangwa no gucikamo ibice. Ariko ukuri ni uko nta mubano n'umwe ufite garanti y'ubuzima bwose.</p>

<p>Ndetse n'abakurira mu miryango myiza, bajya mu rusengero kandi bakavuga bati <em>«tuzabana kugeza urupfu rutandukanye»</em> — na bo bashobora guhura n'ibibazo bikomeye mu rushako. Nubwo Abakristo tuzi ko gukurikiza amahame ya Bibiliya bituma urugo rukomera, hari aho tugwa, cyane cyane mu gushyira mu bikorwa ibyo twizera.</p>

<h2>Ikibura mu ngo nyinshi: Gusengera hamwe buri munsi</h2>

<p>Ikintu kimwe kibura mu ngo nyinshi z'Abakristo ni kwiyemeza gusengerana buri munsi. Akenshi usanga abashakanye basenga buri wese ku giti cye, ariko ntibafate umwanya wo gusengera hamwe, basaba Imana ku buzima bwabo n'urugo rwabo.</p>

<p>Gusengera uwo mwashakanye no gusengera hamwe ni ingenzi cyane. Iyo musenga buri wese ukwe, hari impinduka nziza ziba mu mubano wanyu. Ariko iyo musenganye, izo mbaraga ziriyongera cyane, n'ingaruka zabyo zikaba nziza kurushaho.</p>

<h2>Gusenga bituma mwicisha bugufi kandi mukavugisha ukuri</h2>

<p>Ubumwe bw'imitima hagati y'abashakanye ntibwizana — busaba imbaraga z'abantu bombi. Yesu yigishije ko umutima wicisha bugufi kandi uvugisha ukuri ari ingenzi mu gusenga. Ni nako bigenda no mu rushako: gusengera hamwe bisaba gufunguka no kubwizanya ukuri. Iyo wicishije bugufi imbere y'Imana, uba ugaragariza uwo mwashakanye ko uri umuntu witeguye kumwiyegereza, utamuhisha, kandi w'umunyakuri.</p>

<h2>Gusenga bituma mwunga ubumwe</h2>

<p>Mu isezerano ry'urushako, abashakanye baba babaye umwe mu maso y'Imana. Ariko buri munsi bagomba gukomeza kubyubaka. Urushako ruhuza abantu babiri bafite inzozi, ibyifuzo, n'imico bitandukanye — ibi bishobora guteza kutumvikana. Ariko iyo musengera hamwe, mwegerezwa ku Mana, kandi bigatuma murushaho kunga ubumwe hagati yanyu.</p>

<h2>Gusenga byongera urukundo rwimbitse</h2>

<p>Mu ntangiriro z'umubano, abantu baba bafitanye urukundo rukomeye n'amarangamutima yimbitse. Ariko uko ibibazo bitangiye, iryo huriro rishobora kugabanuka. Gusengera hamwe bifasha kongera urukundo n'ubusabane bwimbitse <em>(emotional intimacy)</em>. Iyo musenganye, muba muvugana n'Imana — ariko nanone mukavugana hagati yanyu. Ibi bituma murushaho kumenyana no gusobanukirwa ibyifuzo by'umutima wa buri wese.</p>

<h2>Gusenga byinjiza Imana mu rugo rwanyu</h2>

<p>Akenshi bavuga ko urugo rukomeye rugizwe n'abantu batatu: umugabo, umugore, n'Imana. Nubwo abashakanye baba bafite intege nke, iyo Imana iri kumwe nabo, ibafasha gukemura ibibazo no kongera kubunga. Mu bihe bigoye, Imana ishobora guhindura imitima, kugarura amahoro, no kongera ubumwe.</p>

<p>Bibiliya iravuga iti: <em>«Nuko rero muhumurizanye kandi muhugurane nk'uko musanzwe mubikora.»</em> (1 Abatesalonike 5:11)</p>

<p>Zaburi 51:10 iravuga iti: <em>«Mana, undememo umutima wera, Unsubizemo umutima ukomeye.»</em> Iyo ufite umutima mwiza, ushobora gusengera uwo mwashakanye mu buryo bwiza kandi bufite imbaraga.</p>

<h2>Gusenga ntibigomba kuba amahitamo ya nyuma</h2>

<p>Akenshi, abantu basenga gusa iyo ibintu byabaye bibi cyane mu rushako. Ariko gusenga si umuti wa nyuma — ni ubuzima bwa buri munsi. Iyo dushyize Imana imbere mu rushako rwacu, idufasha kubona ibisubizo tutari twiteze.</p>

<h2>Umwanzuro</h2>

<p>Urushako ntiruhinduka mu buryo bw'igitangaza gusa — ruhinduka iyo mwiyemeje gusengera hamwe, mwegereye Imana buri munsi, mukabaho ubuzima bwo gusenga. Nusenga, saba Imana kuyobora urugo rwawe, kubigisha gusengera hamwe, no kububakira urushako ruyishimisha. <strong>Iyo mushyize Imana imbere, urugo rwanyu rubona imbaraga zo gutsinda ibigeragezo byose.</strong></p>$$,
NULL,
'inyigisho', '#1E40AF',
'Urugero Amakuru', NULL,
'7 min', true, false,
NOW() - INTERVAL '2 days'
)

ON CONFLICT (slug) DO NOTHING;
