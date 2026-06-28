export interface TemplateItem {
  label: string;
  prompt: string;
  category: string;  // matches TEMPLATE_CATEGORIES[].key
  mode: "t2i" | "i2i" | "both";
}

export const TEMPLATE_CATEGORIES: { key: string; name: string; icon: string; mode: "t2i" | "i2i" | "both" }[] = [
  { key: "portrait", name: "人像写真", icon: "UserOutlined", mode: "t2i" },
  { key: "photography", name: "商业摄影", icon: "CameraOutlined", mode: "t2i" },
  { key: "landscape", name: "风景建筑", icon: "PictureOutlined", mode: "t2i" },
  { key: "illustration", name: "艺术插画", icon: "ExperimentOutlined", mode: "t2i" },
  { key: "ui", name: "UI与界面", icon: "LaptopOutlined", mode: "t2i" },
  { key: "ecommerce", name: "产品电商", icon: "ShoppingOutlined", mode: "both" },
  { key: "brand", name: "品牌海报", icon: "CrownOutlined", mode: "both" },
  { key: "i2i", name: "图生图专用", icon: "SwapOutlined", mode: "i2i" },
];

export const TEMPLATES: TemplateItem[] = [

  // ===================== 人像写真 =====================
  {
    category: "portrait",
    mode: "t2i",
    label: "电影级黄金时刻肖像",
    prompt: "cinematic portrait of a person, golden hour rim lighting creating a halo effect on hair, shallow depth of field with creamy bokeh background, professional 85mm lens, sharp focus on eyes with catchlights visible, natural skin texture with subtle pores, warm color grading with slight teal shadows, editorial photography style, 8K resolution, hyperrealistic detail, the subject posed naturally with relaxed shoulders and a subtle confident expression, outdoor setting with warm sunset tones",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "高级时装杂志封面",
    prompt: "high fashion magazine cover portrait, model in avant-garde designer clothing, dramatic studio lighting with strong key light and deep shadows, bold makeup with striking color accents, clean seamless backdrop, editorial composition with intentional negative space for text overlay, luxury aesthetic, Vogue editorial style, sharp details on fabric textures and jewelry, professional medium format photography, the subject posed with dynamic angles and strong eye contact, clothing featuring intricate textures like silk organza or hand-beaded embellishments",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "汉服古风人像",
    prompt: "portrait of a person wearing traditional Chinese Han dynasty clothing with intricate silk embroidery and flowing layered robes, hair styled in classical Chinese hairpin arrangement with delicate jade and gold ornaments, posed gracefully in a bamboo garden with morning mist, soft diffused natural light filtering through leaves creating dappled patterns, ethereal and elegant atmosphere, color palette of warm reds, golds and jade greens, historical accuracy in clothing details, cinematic composition, photorealistic skin and fabric rendering, the subject holding a silk fan or standing beside a weathered stone lantern",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "古典油画风格肖像",
    prompt: "classical oil painting portrait in the style of 17th century Dutch masters, dramatic chiaroscuro lighting with a single candle or window light source illuminating one side of the face, rich deep shadows on the opposite side, visible brushstroke texture on canvas, warm earthy color palette of browns, ochres and deep reds, subject in period clothing with lace collar or velvet fabric, dark atmospheric background with subtle architectural hints, timeless and dignified mood, museum quality masterpiece, detailed rendering of skin translucency and the play of light across facial features",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "黑白纪实人像",
    prompt: "black and white documentary portrait, elderly person with deeply lined face telling a lifetime of stories, harsh directional light creating strong contrast and dramatic shadows, gritty urban background with peeling paint or weathered brick textures, photojournalism approach capturing raw unposed emotion, grainy Tri-X 400 film aesthetic, Leica rangefinder style composition, timeless and powerful human connection, monochrome tones from deep blacks to bright whites with full gray range, every wrinkle and skin texture rendered in hyperrealistic detail, the subject's eyes holding a direct and piercing gaze",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "赛博朋克人物肖像",
    prompt: "cyberpunk character portrait, person with subtle cybernetic facial enhancements and glowing blue LED implants, standing in a rain-soaked neon-lit alley at night, reflections of pink and purple holographic signs in water puddles on the ground, one side of face illuminated by warm neon the other by cool blue light, high-tech dystopian atmosphere, detailed mechanical texture on cybernetics showing micro-circuitry and brushed metal finishes, Blade Runner 2049 inspired color grading, cinematic wide composition, rain droplets on skin and clothing creating specular highlights, steam rising from street vents adding atmospheric depth",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "90年代胶片复古写真",
    prompt: "vintage 1980s-90s film portrait, subject with retro hairstyle and period-appropriate clothing, warm Kodak Portra 400 color palette with creamy skin tones and slightly muted greens, soft natural window light from one side creating gentle shadow transitions, cozy interior setting with period-appropriate furniture and decor details like a rotary phone or cassette player, subtle film grain and slight color shift toward warm amber, nostalgic and intimate mood, medium format 6x7 composition, candid moment captured feel, the subject in a relaxed unposed posture with a natural gentle smile",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "韩式雾面编辑风写真",
    prompt: "9:16 vertical editorial portrait, single subject, soft black mist filter creating subtle haze and gentle highlight bloom, muted tones, minimal indoor space with clean background and slight texture, young subject with minimal makeup and natural skin texture, fitted ribbed knit top or soft camisole under a loose shirt with high-waisted shorts or skirt, slightly messy hair with natural volume, sitting on floor with one leg bent and the other relaxed, body slightly leaning with shoulders not aligned and head tilted, subject slightly off-center with negative space present, calm slightly distant expression with natural lips, soft side light with gentle shadow falloff, understated quiet mood subtly sensual through natural body lines, fine grain with slight softness and realistic unposed quality",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "极简商业白底人像",
    prompt: "clean commercial portrait on pure white seamless background, professional headshot with even three-point studio lighting eliminating all shadows, subject in business attire with confident approachable expression, flawless but natural skin retouching showing fine pores and subtle texture, sharp focus from front to back, high-key lighting style, suitable for corporate profile or LinkedIn, 85mm portrait lens, minimal and polished aesthetic, no distracting elements in frame, the subject centered with balanced composition and direct warm eye contact",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "逆光美背情绪写真",
    prompt: "vertical high-end female emotional portrait, theme of backlit beauty and elegant back lines, the absolute focus is the back: shoulder blade contours, spine midline, waist curve and backlit silhouette, adult woman with natural poised temperament, face partially visible from side profile or slight turn, low-back dress or off-shoulder silk camisole with soft draping fabric, soft natural window light or warm golden hour backlight creating a luminous edge along shoulders and hair strands, indoor setting with minimal decor: white linen bedding, sheer curtains, wooden floor, overall mood quiet intimate and restrained, shallow depth of field, cinematic film photography style, subtle grain, photorealistic skin texture, no plastic AI look, vertical 3:4 or 9:16 composition",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "夜间手机柔光人像",
    prompt: "a young adult woman with soft refined features, thin metal glasses, and shoulder-length dark tousled hair, leaning forward across a dark upholstered couch at night, she wears a pale cream lace-trim camisole with thin straps and matching soft shorts, one hand holds a smartphone close to the foreground with the screen glow casting cool reflections on her fingers and glasses lenses, her expression is dreamy and softly tired, eyes lifted toward the camera as if she just looked up from scrolling, shot in vertical 3:4 at slightly above eye level, medium close-up to three-quarter portrait, warm dim tungsten room light mixed with cool phone-screen reflections, no flash, soft falloff across the couch and wall, shallow depth of field, soft low-light grain, slight motion blur, natural imperfect sharpness, background plain beige-gray wall with minimal decor, late-night intimate atmosphere, soft glam makeup with subtle eyeliner and glossy lips, realistic social-media night portrait aesthetic",
  },
  {
    category: "portrait",
    mode: "t2i",
    label: "红跑道超低角运动人像",
    prompt: "bright photorealistic outdoor portrait of a young woman lying on a red running track on a modern white arch pedestrian bridge, ultra-wide low-angle selfie perspective, her arm reaching toward the camera in the foreground creating strong depth through foreshortening, relaxed dynamic pose, wired headphones around her neck catching light, white sleeveless top, loose gray pants, black hair spread naturally on the ground, clean blue sky with soft white clouds above, strong midday sunlight creating crisp shadows and high clarity, fresh youthful energetic mood, architectural symmetry of the bridge structure framing the composition, realistic skin texture with subtle sweat sheen, cinematic composition, 3:4 vertical image, shot with wide angle lens for dramatic perspective distortion",
  },

  // ===================== 商业摄影 =====================
  {
    category: "photography",
    mode: "t2i",
    label: "生活感桌面笔记照",
    prompt: "amateur photo of an open notebook lying flat on a desk, filled with handwritten notes in black ballpoint pen, the handwriting is casual and slightly messy like personal study notes with natural imperfections, crossed out words, underlined headings, and margin doodles, shot from slightly above at an angle capturing the texture of the paper and the indentations of the pen, natural daylight from a window creating soft shadows across the page, no flash, casual desk setting with a ceramic coffee cup with slight coffee ring stains and a pen visible at the edges, shot on iPhone, realistic everyday study or work scene, warm and intimate atmosphere, shallow depth of field keeping the notebook sharp while the background softly blurs",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "便利店深夜街头纪实",
    prompt: "ultra-realistic urban street group photo at a convenience store entrance at 10 PM summer night, 3 to 4 young people briefly chatting at the entrance, someone holding drinks with condensation on the bottles, someone sitting on plastic outdoor chairs, someone standing looking at their phone, bright white LED light streaming through the glass doors and windows, warm yellow street lights and distant car headlights outside creating mixed color temperature, characters wearing everyday clothes: T-shirts, shirts, shorts, jeans, sneakers, no internet celebrity styling, faces and postures look like real pedestrians not overly polished, environment includes real convenience store elements: freezer stickers, promotional posters, trash cans, entrance mats, glass reflections, shared bikes on roadside, water droplets from drink bottles on ground, the image should look like a very authentic life slice captured by a street photographer",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "地铁车厢日常抓拍",
    prompt: "a beautiful woman looking at her phone on the subway, a candid unposed photo, natural mixed lighting from train interior fluorescent tubes and tunnel darkness outside windows, slight motion blur from train movement, reflections on glass windows showing other passengers, other commuters partially visible in background out of focus, unposed spontaneous moment caught mid-gesture, photojournalism style, realistic skin texture with subtle imperfections, shot on smartphone, vertical composition, strong sense of being there in the moment, the subject absorbed in the screen unaware of being photographed, everyday urban commute atmosphere",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "35mm胶片温泉旅店",
    prompt: "35mm film photography, warm vintage Japanese onsen ryokan aesthetic, soft ambient wooden lantern lighting mixed with gentle natural window light, subtle film grain, gentle color shift toward warm amber and slight cyan in shadows, high atmosphere editorial style, intimate medium shot, natural relaxed pose sitting on the edge of a traditional wooden engawa veranda, wearing a loose white yukata with natural fabric wrinkles, warm wooden interior with paper sliding doors and distant steaming hot spring in soft focus, gentle rim lighting from behind highlighting hair and fabric edges, authentic vintage film color grading, extremely sharp yet soft skin rendering, natural hair strands catching backlight, realistic fabric texture and drape, no plastic skin, no digital over-sharpening, authentic 35mm film atmosphere",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "直闪灯光运动风",
    prompt: "35mm color film photography with harsh direct on-camera flash, specular highlights on skin and clothing creating a distinctive fashion editorial look, strong catchlights in eyes, high contrast flash illumination with deep shadows behind the subject, authentic film grain and color shift toward slightly cool tones, fresh innocent editorial style, intimate first-person low-angle POV shot from below, direct on-camera flash creating sharp highlights on the face and deep shadows on the neck, background slightly underexposed creating natural vignette, high contrast film color grading with natural flash look, authentic 35mm direct flash aesthetic, realistic skin texture showing fine pores and natural texture, no plastic skin, no digital over-sharpening, no airbrushing, spontaneous party or night-out energy",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "2000年代数码相机家庭照",
    prompt: "a photo from 2003, shot with an early consumer digital camera, of a family in the courtyard of their residential compound, low resolution typical of early 2000s consumer digital cameras around 2-3 megapixels, slight CCD sensor noise with characteristic purple fringing at high contrast edges, limited dynamic range with slightly clipped highlights on faces, dated color reproduction with slight greenish tint typical of that era's white balance limitations, JPEG compression artifacts visible when zooming in, optional timestamp in bottom right corner in orange digital font, natural daylight from slightly overcast sky, unposed family moment with someone mid-laugh and a child caught mid-motion, nostalgic early digital photography aesthetic that evokes the transition from film to digital",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "唱片公司楼梯间写真",
    prompt: "photorealistic cinematic portrait, a fictional adult Korean female idol in her mid-twenties, not resembling any real celebrity, Japanese negative film look: soft overexposure, faded neutrals, low contrast, subtle grain, and imperfect snapshot framing, scene: the back stairwell of a small record label building with moving boxes, scuffed concrete steps, a gray metal handrail, and a pale security light, atmosphere quiet and slightly intimate as if caught in a private moment, subject wears a slightly cropped black blazer casually open over a fitted heather-gray ribbed tee, loose khaki cargo pants, thin silver chain necklace, a roll of black gaffer tape placed beside her, one sneaker lace still half-tied, she is seated on the stairs with one knee slightly raised and one leg relaxed lower, leaning back lightly with one hand braced behind her, head tilted up toward the camera with a calm self-possessed expression, flat stairwell light with understated backstage realism, photorealistic and cinematic with no excessive glamour, 2:3 portrait",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "上海地铁站台晨光",
    prompt: "a candid photograph of a young woman standing on a Shanghai metro platform during the summer morning commute, authentic daily life photography, natural candid moment, half-body framing at eye level from moderate distance, the arriving train a motion-blurred streak behind her, the yellow safety line at her feet, East Asian young woman in her early twenties with almond-shaped eyes, straight refined nose, fair to light beige skin tone with visible subsurface scattering under cool overhead station light, summer fresh look with minimal makeup, she wears a relaxed oversized white shirt dress with collar lightly open and sleeves loosely rolled above the elbow, a structured natural tan canvas tote hangs from her shoulder, a physical novel tucked under one arm, she stands absorbed looking down at the open book, background includes white and grey tiled metro wall, overhead route signage board, other commuters blurred and distant, two or three stray hairs displaced by the train's air displacement, cool overhead fluorescent lighting with a slight greenish cast, subtle ISO 400 film grain in shadow areas, aspect ratio 2:3, no watermark no text overlay",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "城中村鱼市追猫街拍",
    prompt: "hyper-chaotic early-2000s Japanese digicam snapshot aesthetic with raw paparazzi energy and accidental comedy, the main subject is sprinting wildly through a busy city street while yelling and laughing in pure chaos, desperately trying to catch a mischievous cat that just stole a large shiny fish from a market stall, the cat dominates the foreground frame with its face pushed absurdly close into the lens, massive fisheye distortion stretches its features dramatically with huge bulging eyes and exaggerated whiskers, the fish flapping violently with droplets and motion streaks flying outward, behind the cat the human subject is charging forward aggressively with intense energy reaching toward the animal mid-run, randomized layered Y2K Tokyo streetwear inspired by chaotic Shibuya nightlife fashion, extreme low-angle fisheye lens with severe Dutch angle and asymmetrical framing, insanely intense movement blur with radial streaking and shutter drag, CCD sensor smearing and directional speed trails, harsh direct flash combined with bright outdoor sunlight, dirty CCD digicam texture with blown highlights and chromatic aberration, gritty nostalgic cyber-chaos atmosphere, ultra-raw candid energy with messy composition and humorous accidental masterpiece aesthetic",
  },
  {
    category: "photography",
    mode: "t2i",
    label: "烛光侧室古风写真",
    prompt: "medium-shot authentic daily life photograph of an East Asian young woman standing in a small side room lit only by a single candle on a low stone shelf, 85mm lens, waist-up framing, shallow depth of field, the candle is off-frame to the left and the room behind her exists only as dark warm suggestion, East Asian young woman in her early twenties with almond-shaped eyes receiving the candle's warm flicker, straight refined nose with the bridge illuminated in a narrow warm stripe, skin tone fair beige warmed entirely by candlelight into amber, skin subsurface scattering visible under directional candlelight, specular micro-highlights on cheekbones and nose ridge, she wears an aged amber silk qipao with chrysanthemum embroidery in tones of old bronze and dusty ochre, mandarin collar, short sleeves, she stands facing the candle without looking at it, arms at her sides, very still, the room is otherwise empty, two or three stray hairs displaced by faint air movement, single candle: warm amber-orange directional and fragile, it carves the left side of her face from darkness and leaves the right in near-black shadow, deep chiaroscuro with no artificial fill, subtle ISO 400 film grain in shadow areas, aspect ratio 9:16, not cartoon not digitally painted not anime",
  },

  // ===================== 风景建筑 =====================
  {
    category: "landscape",
    mode: "t2i",
    label: "写实山水大景",
    prompt: "majestic mountain landscape at golden hour, layered mountain ranges receding into atmospheric haze creating depth through aerial perspective, a winding river reflecting the warm sunset sky with silver highlights on the water surface, ancient pine trees clinging to rocky cliffs in the foreground with gnarled roots visible, dramatic clouds catching the last light of day in fiery oranges and soft pinks, ultra wide angle composition emphasizing the vast scale, natural colors ranging from deep forest green to warm orange and purple in the sky, National Geographic documentary photography style, 8K ultra high resolution, every rock texture and tree branch sharply defined, the scene conveying both grandeur and serene stillness",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "银河星空",
    prompt: "breathtaking Milky Way arching across a pitch-black night sky over silent mountain silhouettes, millions of stars visible with distinct galactic core dust lanes in deep purple and electric blue, a small tent with warm orange glow providing scale and human connection in the foreground, long exposure astrophotography technique capturing star trails beginning to form at the edges, no light pollution visible, pristine wilderness setting at high altitude, reflection of stars in a perfectly still alpine lake creating mirror symmetry, cosmic awe and solitude mood, professional astrophotography with star tracker, ultra wide fisheye composition, the foreground illuminated by a subtle campfire or lantern glow revealing alpine meadow details",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "日落海滩天堂",
    prompt: "tropical paradise beach at sunset, golden hour light painting the white sand in warm amber and rose tones, silhouettes of leaning palm trees framing the composition on both sides creating a natural frame, gentle waves creating delicate foam patterns on the shore with each receding wave leaving a mirror-like wet sand reflection, the sun a perfect orange disk touching the horizon over calm turquoise ocean water, scattered clouds painted in pink coral and soft lavender by the setting sun, drone aerial perspective showing the full curve of the bay with rocky headlands, vacation paradise mood, vibrant but natural color saturation, 8K travel photography, the composition conveying the transition from day to evening in a tropical setting",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "樱花季古寺",
    prompt: "springtime cherry blossom avenue in full bloom at the peak of sakura season, ancient trees forming a natural pink and white tunnel over a quiet stone pathway leading toward a traditional temple gate, delicate petals falling like pink snow caught in a gentle breeze creating a dreamlike atmosphere, soft morning sunlight filtering through the blossom canopy creating dappled light patterns on the mossy stone ground, a traditional wooden vermillion bridge arching over a calm pond reflecting the pink canopy above, romantic and peaceful Japanese spring atmosphere, a few visitors in the distance wearing kimono providing subtle human scale, photorealistic rendering with pastel pink and soft green color palette, the composition drawing the eye through the blossom tunnel toward the temple beyond",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "北欧晨雾森林",
    prompt: "dense Scandinavian pine and birch forest in early morning, thick ground mist hovering between tree trunks at knee height creating an ethereal layering effect, first rays of sunrise breaking through the canopy creating volumetric god rays cutting diagonally through the fog, moss-covered boulders and fallen logs carpeted in bright green moss on the forest floor, deep green color palette with soft golden highlights where light penetrates, pristine untouched wilderness atmosphere, a small deer partially visible through the mist in the middle distance, medium telephoto compression emphasizing the density and verticality of trees, silence and tranquility mood, nature documentary cinematography, hyperrealistic detail on bark texture, moss, fern fronds, and droplets of morning dew on spider webs",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "冬日雪景村庄",
    prompt: "charming snow-covered Alpine village at blue hour, warm golden light spilling from cottage windows creating warm pools on the fresh snow outside, smoke rising gently from chimneys straight up into the still cold air against the deep blue twilight sky, snow-laden pine trees framing the scene with branches bending under the weight, a frozen stream winding through the village center with a stone bridge arching over it, the village church spire visible against the darkening sky, Christmas card perfect composition, cozy and peaceful winter atmosphere, the first stars becoming visible in the sky above the mountains, photorealistic architectural details on traditional wooden chalets with carved balconies and snow-covered roofs, soft focus on distant mountain peaks",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "现代城市天际线蓝调",
    prompt: "modern metropolitan skyline at blue hour from across a harbor or river, glass skyscrapers with interior office lights beginning to illuminate creating a mosaic pattern of warm and cool dots against the deep blue sky, city lights and traffic trails reflecting perfectly on the calm water surface creating long streaks of gold and red, iconic buildings clearly recognizable in the skyline with distinctive architectural silhouettes, clear gradient sky from deep navy blue at top to warm orange at the horizon where the sun has just set, professional architectural photography, ultra sharp detail on building facades showing individual window frames and structural elements, drone perspective at optimal height showing the full city panorama, the composition conveying the energy and scale of a world-class city at dusk",
  },
  {
    category: "landscape",
    mode: "t2i",
    label: "热带雨林秘境瀑布",
    prompt: "hidden waterfall deep in a lush tropical rainforest, water cascading over multiple tiers of moss-covered dark rock faces into a crystal-clear emerald pool below, dense jungle vegetation with giant tree ferns, broad-leaf monstera plants, hanging lianas and philodendrons framing the scene on all sides creating a natural cathedral-like enclosure, sun rays piercing through gaps in the canopy above creating bright highlights on the water spray and rising mist, colorful exotic birds perched on branches and blue morpho butterflies adding life and scale, primordial untouched nature atmosphere, vibrant green color palette with subtle rainbow hints in the water spray where sunlight refracts, National Geographic documentary style, hyperrealistic detail on every leaf vein, moss texture, water droplet, and the churning surface of the plunge pool",
  },

  // ===================== 艺术插画 =====================
  {
    category: "illustration",
    mode: "t2i",
    label: "传统水墨山水",
    prompt: "traditional Chinese ink wash landscape painting, misty vertical mountains composed of layered ink washes from pale gray to deepest black creating infinite depth, a solitary waterfall descending from a cliff face disappearing into clouds below, ancient twisted pine trees clinging to rocky outcrops with expressive brushwork, a tiny figure of a scholar with a walking staff on a narrow mountain path providing human scale and narrative, rice paper texture visible with ink bleeding effects at edges of washes where the brush lingered, red seal stamp in one corner with archaic characters, poetic composition with intentional empty space for meditation and visual breathing room, master calligraphy brushwork showing both bold strokes and delicate dry brush techniques, serene and timeless Zen atmosphere evoking the great Song and Yuan dynasty landscapists",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "敦煌飞天壁画",
    prompt: "Dunhuang Mogao Caves mural style celestial flying Apsara celestial being, graceful figure with flowing multicolored silk ribbons and scarves trailing in sweeping S-curves suggesting divine flight through heavenly realms, playing an ancient pipa instrument while floating among stylized clouds, rich mineral pigment colors dominated by turquoise blue, vermillion red and gold leaf with subtle cracking patterns, weathered fresco texture on ancient plaster walls with authentic age patina, Tang dynasty Buddhist art style with Indian Gandhara influences visible in the facial features and body proportions, circular halo behind the figure's head rendered in faded gold, scattered lotus flowers and musical instruments in the surrounding space as divine offerings, museum quality ancient art reproduction with scholarly archaeological accuracy",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "剪影宇宙叙事海报",
    prompt: "high-aesthetic silhouette universe collector's edition narrative poster, a single bold outer silhouette dominating the composition: an artifact, building, gate, tower, statue, eye, hand, wing, mask, mirror, or throne, inside the silhouette generate a rich layered narrative world tied to the theme: iconic scenes, key architecture or spaces, symbols and metaphors, foreground-midground-background depth, blend the feeling of a collector's edition film poster with dreamy watercolor texture and fine printed paper: paper grain, feathered edges, watercolor brush marks, gentle diffusion, atmospheric perspective, soft haze, volumetric light, generous negative space occupying at least 30% of the composition, the image should feel premium poetic majestic nostalgic and mythic, low saturation restrained color palette of earthy tones and muted jewel colors, no chaotic neon or plastic digital colors, museum-quality graphic design aesthetic",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "流动水墨抽象",
    prompt: "abstract black ink swirling and diffusing in clear water, organic fluid dynamics creating unpredictable branching patterns and cloud-like formations at multiple scales from fine tendrils to bold masses, high contrast monochrome with pure whites and the deepest blacks, the exact moment of ink drop impact frozen in ultra slow motion showing the beautiful chaos of fluid dynamics, negative space composition with the ink occupying only one third of frame while the surrounding water remains pristine and clear, contemporary art gallery aesthetic suitable for a large-scale fine art print, 8K macro cinematography of liquid motion, meditation on chaos and order, minimalist composition with maximum visual impact, the interplay of ink density creating transparent grays between the solid black and bright white",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "液态金属雕塑",
    prompt: "flowing liquid mercury and polished chrome forming organic sculptural shapes that seem to defy gravity, the molten metal surface reflecting a gradient sky from warm sunset orange to cool twilight blue with perfect mirror-like precision, surface tension creating impossibly smooth meniscus curves and ripples that distort the reflections in mesmerizing patterns, the metal appearing both solid and liquid simultaneously with impossible physics, 3D rendered with octane render engine at the highest quality settings, hyperrealistic material simulation of metal with accurate Fresnel reflections and subsurface scattering at thin edges, modern luxury aesthetic, abstract composition exploring the relationship between form and reflection, the metal floating in infinite white space with subtle contact shadows grounding the forms, every specular highlight sharp and defined",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "几何极简主义构成",
    prompt: "minimalist geometric composition, pure primary colored circles squares and triangles arranged in Bauhaus style asymmetrical balance, flat vector aesthetic with crisp edges and perfectly uniform colors without any gradient or texture, generous white negative space surrounding the geometric elements occupying at least 50% of the frame, a single black line bisecting the composition at a precise calculated angle, mid-century modern graphic design influence with references to Josef Albers and Wassily Kandinsky, the composition feeling both mathematically precise and artistically intentional, clean modern art gallery poster aesthetic, no gradients or shadows, pure exploration of form color relationships and spatial tension, the colors carefully chosen with exact CMYK values for print reproduction, museum poster quality",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "宇宙星云幻境",
    prompt: "abstract cosmic nebula formation, swirling clouds of interstellar gas and dust in deep purples electric blues and hot pinks with subtle transitions between colors, fractal-like structures suggesting galaxy formation at multiple scales from vast spiral arms to microscopic particle interactions, bright star cluster points scattered throughout creating depth through varying sizes and brightness, the boundary between scientific accuracy and abstract art intentionally blurred, Hubble Space Telescope color palette mapped to visible spectrum, the composition evoking both the infinite cosmos and the patterns of cellular biology seen under a microscope, 8K digital art with incredible detail density, ethereal and transcendent atmosphere with a sense of deep space and cosmic scale, the image suitable for a large format fine art print or planetarium dome projection",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "巴洛克静物油画",
    prompt: "exquisite classical still life oil painting in the Flemish Baroque tradition, a dramatic composition featuring a silver gilt chalice, overripe figs split open revealing their jewel-like interior, a partially peeled lemon with its rind spiraling downward, a Venetian glass goblet half-filled with deep red wine catching light, all arranged on a dark wooden table with a rich burgundy velvet drape cascading over one corner, strong chiaroscuro lighting from a single unseen window to the upper left creating dramatic shadows and brilliant highlights, visible brushstrokes and impasto texture on the canvas, deep warm color palette of burnt umber cadmium red ochre and touches of ultramarine blue in the shadows, the composition following classical triangular arrangement, every surface texture rendered with obsessive detail: the cool hard metal of silver the soft fuzz of peach skin the translucent glow of grape flesh the rough wood grain of the table, museum quality masterpiece ready for a National Gallery wall",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "赛博朋克雨夜街景",
    prompt: "ground-level view of a crowded cyberpunk night market street, multi-level chaos of neon holographic advertisements in Chinese Japanese and English overlapping each other in vertical layers up the buildings, steam rising from street food vendor carts and subway grates mixing with ambient neon glow creating volumetric light effects, diverse crowd of augmented humans in futuristic street fashion some with visible cybernetic limbs or glowing subdermal implants, rain-slicked reflective pavement mirroring the neon chaos above in perfect glossy reflections, overhead monorail trains and delivery drones adding vertical depth to the composition, dense atmospheric haze with visible light beams cutting through, Blade Runner meets Ghost in the Shell aesthetic with attention to urban Asian futurism, ultra detailed environmental storytelling through shop signs graffiti and detritus, cinematic wide angle composition capturing the overwhelming sensory density of a future megalopolis at night",
  },
  {
    category: "illustration",
    mode: "t2i",
    label: "新中式国潮山水海�itea",
    prompt: "minimalist neo-Chinese aesthetic composition on pure white matte textured art paper with irregular torn paper edges, an S-shaped winding crack-like negative space dividing the composition revealing a colorful oriental landscape scene within, inside the opening a winding river rendered in varying shades of blue flowing from top to bottom like a silk ribbon, riverbanks dotted with verdant hills and terraced fields in soft greens and warm earth tones, ancient style pavilions and bridges with curved rooflines and white walls black tiles along the water, lush trees with delicate foliage and a solitary fishing boat on the water, the outer white area features subtle paper grain texture and a red Chinese seal stamp, elegant calligraphy at the bottom reading mountain and water poetry, overall atmosphere quiet profound and poetic, 8K ultra detailed, the composition balancing detailed inner landscape with generous white negative space",
  },

  // ===================== UI与界面 =====================
  {
    category: "ui",
    mode: "t2i",
    label: "3A游戏实机画面",
    prompt: "photorealistic in-game screenshot from a fictional AAA open-world game, close-up over-the-shoulder third-person view following a detailed character through a richly detailed urban environment, natural character movement with cloth physics and hair animation, authentic game HUD elements visible including a minimalist health bar compass and objective marker that look like actual gameplay UI, the lighting and color grading matching triple-A open world game aesthetic with physically based rendering, ray-traced reflections on wet surfaces, high quality ambient occlusion, volumetric fog and god rays, the image should look exactly like a screenshot captured during actual gameplay on maximum PC settings rather than promotional material or concept art, slight chromatic aberration at screen edges and subtle film grain for realism, 4K resolution with the slight softness of temporal anti-aliasing",
  },
  {
    category: "ui",
    mode: "t2i",
    label: "未来全息数据界面",
    prompt: "futuristic holographic data visualization floating in a dark command center control room, multiple transparent layers of information screens arranged in a semi-circle around the viewer position, glowing cyan and amber data streams flowing between interconnected displays with particle effects, 3D wireframe models of planetary systems or molecular structures rotating slowly in the center, subtle particle effects and light bloom around interactive elements giving a tangible holographic feel, glass and metal reflections of the holograms visible on the polished dark floor below, clean minimalist UI design inspired by major science fiction film interfaces with readable fictional data and charts, the human operator visible only as a faint silhouette behind the glowing displays for scale, cinematic composition emphasizing depth and information density, the interface showing complex but organized data: orbital trajectories energy readings and system status indicators",
  },
  {
    category: "ui",
    mode: "t2i",
    label: "AI视频生成App界面",
    prompt: "professional dark theme iOS app homepage UI design for an AI Video Generator application, English language interface, professional-level visual design with carefully considered spacing and typography, the screen shows a hero section with a large video preview area displaying a stunning AI-generated cinematic clip, below are category tabs for different video styles: Cinematic Animation Documentary Commercial and Abstract, each with a representative thumbnail, a prominent Generate button with a subtle gradient and glow effect, a bottom navigation bar with Home Discover Create Library and Profile icons, the overall aesthetic is dark charcoal background with vibrant accent colors of electric blue and soft purple, clean modern sans-serif typography with clear hierarchy, subtle glass morphism effects on cards and buttons, iPhone 15 Pro screen proportions, 9:19.5 aspect ratio, the design looking like a shipped production app from a top-tier design team",
  },
  {
    category: "ui",
    mode: "t2i",
    label: "小红书风格图文卡片",
    prompt: "a Xiaohongshu (RED) style social media post card, vertical 3:4 aspect ratio, a visually appealing lifestyle photo occupying the upper two-thirds showing a beautifully styled scene with warm natural lighting and soft pastel color grading, overlaid on the image: a catchy headline in bold Chinese characters at the top, the lower one-third features a clean white card with the post title in large readable font, body text in smaller font describing the experience or recommendation, tag icons at the bottom for likes comments and shares, the overall aesthetic is warm feminine and highly polished, with the characteristic Xiaohongshu visual language of soft filters subtle grain and lifestyle aspiration, product placements or travel scene depending on the prompt context, realistic social media screenshot appearance with status bar at the very top",
  },
  {
    category: "ui",
    mode: "t2i",
    label: "科幻HUD战斗界面",
    prompt: "futuristic military HUD (Heads Up Display) overlay view from inside a mecha cockpit or fighter jet, the central view shows an aerial combat scene with explosions and tracer fire in the distance rendered in photorealistic detail, surrounding the central view are multiple layers of tactical interface elements: a circular targeting reticle with lock-on indicators tracking multiple enemy signatures, altitude speed and heading data displayed in glowing green monochrome on the left, a 3D radar minimap in the bottom right showing terrain and threat positions, weapons status panel showing missile counts and cannon ammunition, damage assessment diagram of the vehicle with a flashing warning on the left wing, communication channel frequencies scrolling on the top edge, all UI elements rendered with subtle screen door effect and scan lines for authenticity, the color palette dominated by military green phosphor with orange warning elements and blue friendly indicators, the overall composition feeling like a still frame from a high-budget science fiction film",
  },

  // ===================== 产品电商 =====================
  {
    category: "ecommerce",
    mode: "both",
    label: "奢华香水广告大片",
    prompt: "luxury perfume advertisement poster, high-end fragrance campaign in the style of Tom Ford and Dior, a stunning young woman with confident sensual expression, voluminous glossy hair with golden highlights softly lifted by wind, soft glam makeup with glowing skin and bold lips, brown tailored blazer with patterned silk scarf and thin transparent eyeglasses, shot on 85mm portrait lens at f/1.6 from a slightly low premium angle, the perfume bottle placed in the foreground on glossy black marble surface: clear crystal glass bottle with golden liquid inside and metallic gold cap, strong reflections and golden glow with subtle condensation on the glass, dark blurred luxury interior background with warm golden light streaks, small scattered flowers near the bottle and golden particles floating in the air, deep black shadows with rich golden highlights, cinematic spotlight plus golden rim light, ultra sharp on face and bottle, the brand name VELORA PARFUMS in elegant serif typography with the tagline Not just a scent it is your Signature, hyper-realistic 4K ultra HD commercial grade advertising",
  },
  {
    category: "ecommerce",
    mode: "both",
    label: "化妆品电商白底图",
    prompt: "ultra-realistic luxury cosmetic product photography on pure white seamless studio background, a premium squeeze tube product with satin-finish periwinkle-blue surface and reflective metallic chrome cap, product positioned vertically centered in the frame, surrounded by ink-like swirling clouds of lavender indigo and icy blue smoke wrapping around the product creating depth and mystery, fresh purple and lilac flowers with intricate petal details and vibrant yellow centers placed at the base, tiny violet blossoms scattered for added dimension, soft directional lighting from upper left highlighting the smooth curvature of the tube and adding subtle sheen to the metallic cap, ethereal floral fragrance aesthetic with seamless cool blue and purple tones, hyper-detailed textures on petals and vapor tendrils, high-end perfumed skincare advertising style, 8K ultra-high resolution with cinematic depth of field, commercial product photography for luxury beauty brand, no text overlay no watermark",
  },
  {
    category: "ecommerce",
    mode: "t2i",
    label: "饮料飞溅商业广告",
    prompt: "three ultra-dynamic soda cans in one vibrant high-end advertising composition, a can of tropical rush soda exploding with dramatic water and tropical fruit splashes including orange slices and passion fruit seeds suspended mid-air, vibrant orange and pink background lighting from colored gels, a can of lemon iced soda splashed with cold water against a glowing green dynamic light background, both cans covered in realistic condensation droplets with motion-blurred water beads flying in all directions, bursting with fruity and refreshing summer energy, deep orange pink and neon green studio lights blending together in a bold commercial setup, captured by a professional photographer using a Canon 50mm lens at high shutter speed to freeze the splashes, hyper-realistic textures on the aluminum cans showing every ridge and printed detail, crisp sharp focus on the product labels, ultra high resolution bright commercial poster aesthetic, rich color vibrancy with cinematic splash effects, 3:4 aspect ratio",
  },
  {
    category: "ecommerce",
    mode: "t2i",
    label: "草莓能量饮料广告",
    prompt: "hyper-realistic commercial advertisement blending energy drink and sports branding, a dynamic athletic woman captured mid-air in a powerful jump pose with hair streaming upward, wearing modern sportswear: a light translucent white windbreaker jacket open to reveal an orange sports bra, matching orange athletic shorts, white chunky sneakers, surrounded by explosive splashes of red strawberry liquid and flying ice cubes frozen mid-motion, a cold metallic energy drink can in strawberry flavor bursting with condensation droplets sits prominently in the foreground, fresh whole strawberries with green leaves scattered across a glossy reflective surface, bright cinematic lighting with dramatic rim light creating separation from the vibrant orange gradient background, bold glowing typography behind the subject reading ENERGY UNLEASHED, ultra-detailed high contrast sharp focus throughout, commercial product photography style at 8K resolution, advertising poster aesthetic with energetic powerful and refreshing summer mood",
  },
  {
    category: "ecommerce",
    mode: "t2i",
    label: "巧克力品牌技术分解图",
    prompt: "branded technical infographic of a premium chocolate bar, combining a photorealistic macro photograph of the chocolate product with technical annotation overlays placed directly on top, black ink style line drawings with strategic gold accent annotations on a pure white studio background, the chocolate bar shown in a three-quarter view with one square broken off revealing the cross-section inside showing layers of ganache caramel and crunchy base, callout lines with precise labels identifying each component: tempered couverture shell caramel layer sea salt crystals cocoa nibs and hazelnut pieces, measurement lines showing exact dimensions in millimeters, material callouts with cocoa percentage and origin notes, arrows indicating the snap line and internal structure, hand-drawn technical sketch feel with architectural blueprint aesthetic, clean composition with balanced negative space, the realistic product remains clearly visible beneath the annotation layer, educational food engineering vibe with premium artisanal branding, 1:1 square format, ultra crisp social feed optimized with no watermark",
  },
  {
    category: "ecommerce",
    mode: "t2i",
    label: "巨型产品街头Campaign",
    prompt: "luxury futuristic streetwear campaign poster featuring a confident young person sitting casually on a gigantic oversized retro gaming controller that dominates the foreground, the controller rendered in hyper-realistic detail with premium matte materials glowing LED accents and subtle button textures, clean editorial advertising aesthetic with massive bold typography in the background saying GAME ON, glossy reflective studio floor beneath, cinematic studio lighting from multiple sources creating dramatic shadows, pastel neon color palette combining lavender silver and soft cyan tones, the subject has an effortless relaxed attitude wearing oversized white graphic t-shirt loose black athletic shorts high white socks and modern sneakers, casual sporty fashion styling with natural makeup and youthful Gen-Z energy, seated with one leg hanging down and one knee raised looking away from the camera with cool confidence, seamless studio backdrop with glossy floor reflections, high-end commercial fashion photography at 8K, 4:3 aspect ratio, hyper detailed photorealistic with the oversized product as the hero element",
  },

  // ===================== 品牌海报 =====================
  {
    category: "brand",
    mode: "both",
    label: "电影级双重曝光海报",
    prompt: "hyper-realistic cinematic double exposure portrait poster, a young person in side profile with intense focused expression detailed skin texture and sharp directional gaze, their facial silhouette seamlessly blended with a futuristic city skyline emerging from within their head and neck area, skyscrapers and urban infrastructure forming the internal structure of their profile, strong contrast of deep blue and vibrant red tones symbolizing conflict duality and inner power, abstract digital scratches fractured glass textures and light leak effects overlaying the face for dramatic visual impact, clean white background with subtle paper grain texture, ultra-detailed cinematic lighting with dramatic blue and red split toning, professional movie poster style with intentional negative space for title placement, high contrast sharp focus 8K resolution, realistic hair strands catching colored light, editorial poster composition with modern graphic design aesthetics, dramatic atmosphere suitable for a psychological thriller or character-driven drama film poster",
  },
  {
    category: "brand",
    mode: "t2i",
    label: "篮球巨星涂鸦海报",
    prompt: "scrapbook doodle-style basketball poster of a legendary player, main photo: realistic action shot of the player in an iconic mid-game pose, dynamic energy frozen in time, hand-drawn white and team-color neon ink doodles overlay the image: arrows tracing movement paths, energetic stars bursting at impact points, sketchy motion lines, hand-drawn circles highlighting key details, a glowing outline tracing the player's body contour, layout with handwritten titles and stats: the player's name in bold graffiti letters at top with their nickname in script below, career stats section showing total points assists and championships in hand-drawn boxes, highlight achievements in sketchy star badges, club and national team career milestones listed with rough icons, the whole composition balancing the realistic photograph with playful notebook doodle aesthetic, modern sports poster meets personal journal style, clean but energetic slightly messy doodles in high contrast, neon accents on dark muted background, all stats realistic and proportional to the player's career",
  },
  {
    category: "brand",
    mode: "t2i",
    label: "东方神话人物志海报",
    prompt: "vertical A4 premium poster for an Eastern mythology character encyclopedia, centered on a single mythological figure from Chinese legend, the design follows ancient Chinese manuscript aesthetics: the central figure rendered in grand portrait style with historically accurate clothing weapons and attributes specific to that deity or hero, symmetrical layout with information panels on both sides like ancient stele inscriptions, title at top in large seal script or Song dynasty calligraphy with a poetic spiritual motto beneath describing the character's essence in 12-28 classical Chinese characters, panels include: divine identity and origin source texts and historical records domains and powers under their control physical appearance and visual traits sacred weapons and artifacts companions and mounts classic tales and legendary episodes symbolic meanings mythological lineage and relationships cultural influence and modern legacy, all text in classical literary Chinese with short precise entries, visual style blending Dunhuang murals blue-green landscape painting bronze vessel motifs and ancient manuscript illumination, paper texture with subtle fiber patterns mineral pigment colors and gilt gold line accents, vermillion seal stamps scattered as authentication marks, the color palette determined by the character's elemental attributes: vermillion and gold for fire and war deities indigo and silver for moon and water spirits jade green and ochre for earth and nature gods, overall feeling of an artifact from a museum archive not a modern graphic design",
  },
  {
    category: "brand",
    mode: "t2i",
    label: "概念字体设计海报",
    prompt: "premium conceptual typography poster, a single bold title word rendered as the dominant visual structure of the entire composition: huge readable powerful and spelled with custom-designed letterforms, the typography is the hero with weight width contrast spacing rhythm distortion negative space edge quality and ink texture all expressing the temperament and meaning of the word, a rich but restrained 4-6 color system: dominant background color primary typography color figure or landscape tone an emotional accent color a muted support color and subtle paper texture tone, composition style: high-end editorial poster museum-quality graphic design dramatic scale with strong hierarchy, few elements maximum impact, intelligent whitespace bold flat color areas sharp cropping, silkscreen lithograph and risograph printing textures with visible paper fibers subtle ink imperfections and refined visual tension, if the title refers to a person or figure a large editorial portrait occupies 40-70% of the composition interacting with the typography through overlapping emerging or breaking through the letterforms, the final image should feel like a complete visual sentence where the title the figure the colors and the typography all explain and enhance each other, avoid generic word art glossy 3D lettering random icons and stock-photo realism",
  },
  {
    category: "brand",
    mode: "t2i",
    label: "极简建筑地标艺术海报",
    prompt: "luxury minimalist poster centered on a famous architectural landmark, the focal element is a precise illustrated rendering of the building in clean geometric lines with subtle architectural detail, behind and interacting with the architecture one giant bold English word in a design-forward modernist typeface whose character matches the building's identity: a brutalist structure gets heavy industrial sans-serif a baroque cathedral gets elegant classical serif a deconstructivist museum gets experimental geometric letterforms, smaller body copy nearby describing the building's design philosophy in 2-3 lines of clean sans-serif text, the composition reads as an ultra high-end art poster: restrained low-key color palette of 3-4 colors where graphic elements interlock with the architecture appearing as if they form part of its structural components or extend outward from its silhouette, generous negative space premium matte paper texture, the overall feeling is of a limited edition architectural print sold at a design museum shop, balanced composition with geometric precision, 2:3 or 3:4 aspect ratio",
  },
  {
    category: "brand",
    mode: "both",
    label: "城市文字旅行海报",
    prompt: "minimalist flat travel poster illustration of an iconic world destination, clean vector art style with Scandinavian color palette of soft pastel tones, calm atmospheric scenery depicting the destination's most recognizable landmarks and natural features reduced to their essential geometric shapes, the specific destination rendered with loving attention to its unique character: lakeside village with alpine mountains and perfect reflections colorful harbor houses with fjord backdrop traditional riverside town with cherry blossoms and pagoda or white cliffside architecture with blue domes overlooking the sea, ultra clean composition with geometric landscape shapes smooth gradients and elegant typography featuring the destination name in refined sans-serif or serif, modern tourism poster aesthetic with serene travel mood crisp vector lines and cinematic wide-angle scenery, peaceful stylized skies with geometric clouds, highly detailed environment art rendered in contemporary flat illustration style, premium editorial travel design with balanced composition and minimal shadows, dreamy vacation atmosphere with soft morning or golden hour lighting, high-end hospitality brand poster vibe, 4K ultra detailed",
  },

  // ===================== 图生图专用 =====================
  {
    category: "i2i",
    mode: "i2i",
    label: "照片转电影级油画风格",
    prompt: "transform the uploaded reference photo into a classical oil painting in the style of 17th century Dutch Golden Age masters, preserve the original subject's identity facial structure and pose while rendering everything with visible brushstrokes rich impasto texture on canvas and the warm earthy color palette of Rembrandt or Vermeer, apply dramatic chiaroscuro lighting with a single light source illuminating the subject while the background falls into deep atmospheric shadow, add subtle aging effects: fine craquelure across the surface slight yellowing of varnish and the soft glow of old master pigments, retain the original composition but reinterpret clothing as period garments with lace collars velvet fabrics and subtle gold embroidery, the background should become a dark atmospheric interior with perhaps the hint of a window or architectural element, the final result should look like a genuine museum-quality painting that has hung in a gallery for centuries, not a digital filter effect, pay special attention to the eyes which should retain the original person's gaze and expression while rendered with the luminous quality of oil paint, the edges should softly dissolve into the dark background as in authentic Baroque portraiture",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片转动漫角色",
    prompt: "using the uploaded photo as the exact character reference, transform this person into a high-quality anime illustration while preserving their core facial identity and recognizable features, the art style should be a polished Japanese animation aesthetic with clean lineart subtle cel shading and soft gradient coloring, the character should have the same eye shape nose structure and face proportions as the original but translated into anime conventions with slightly larger more expressive eyes, the hair should maintain the original color and general style but rendered with anime shine and flowing strands, outfit can be stylized into an anime-appropriate costume in a similar color palette to the original, the background should be a simple atmospheric scene appropriate to the character: a school rooftop at sunset a quiet street under cherry blossoms or a cozy room with warm window light, add subtle lighting effects including rim light and soft bloom for that cinematic anime look, the overall feeling should be as if this person is a character from a high-quality anime series or film, not a cheap filter but a genuine artistic translation between mediums",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "产品白底图场景替换",
    prompt: "take the product from the uploaded image and place it into a premium clean white studio photography setup, carefully extract the product preserving all its details textures colors and labels exactly as they appear in the original, place it on a pure white seamless infinity background with soft studio lighting from above and slightly to the left creating a gentle shadow beneath the product for grounding, the lighting should be even and commercial-grade with softboxes eliminating harsh shadows while maintaining the product's three-dimensionality, add subtle reflections on a glossy white surface below, render the product in hyper-realistic 8K commercial photography quality with every detail of the packaging material and label perfectly sharp and readable, the composition should be centered with the product occupying approximately 70% of the frame leaving clean white space around it suitable for e-commerce listing, the result should look indistinguishable from a professional product photograph shot in a commercial photography studio specifically for Amazon or a luxury brand website, no background objects no hands no props just the product hero shot on pure white",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片转手绘儿童插画",
    prompt: "transform the uploaded photo into a delicate minimalist hand-drawn children's book illustration with a soft whimsical fairy-tale aesthetic, use simple elongated shapes thin imperfect hand-drawn pencil lines flat pastel colors and minimal details, apply a cute doll-like character style with rosy cheeks tiny facial features and simplified charming anatomy while keeping the original person recognizable through their distinctive features like hair color face shape and characteristic expression, stylize the clothing in a playful storybook way with simplified shapes and gentle decorative details like tiny flowers stars or stripes, add subtle paper texture soft pencil and pastel shading watercolor softness in the coloring with gentle color bleeds at the edges, the background should be a clean white or soft cream with small hand-drawn stars sparkles or simple floral elements scattered lightly around, the overall mood should feel airy cozy naive and charming like a modern Scandinavian nursery postcard or a beloved children's book illustration, avoid photorealism 3D rendering cinematic lighting glossy surfaces complex shadows and realistic anatomy, the final result should look like an illustration you would find in a high-quality children's picture book not a digital photo filter",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片转粗糙涂鸦风格",
    prompt: "turn the uploaded photo into a chaotic funny doodle illustration intentionally messy and low-skill as if drawn quickly with cheap markers crayons and worn-out felt pens on scrap paper, create exaggerated facial features with awkward proportions: uneven eyes oversized head tiny body crooked smile and clumsy anatomy while still keeping the person recognizable through their key distinguishing features, use rough childish sketch lines shaky hand-drawn strokes visible scribbles overlapping outlines accidental marks and random doodles around the scene, add a simple cartoon-style background with badly drawn buildings trees clouds street elements and completely uneven perspective, coloring should look careless and imperfect with visible stroke texture inconsistent fill areas that go outside the lines wax crayon texture marker bleed and irregular shading, include playful imperfections: crossed-out redrawn lines unfinished details random arrows pointing at nothing tiny nonsensical notes stars swirls zigzags and abstract scribbles in the margins, the overall aesthetic should feel humorous spontaneous handmade energetic goofy and intentionally unpolished resembling a child's sketchbook mixed with absurd internet meme art, high texture detail with visible paper grain asymmetrical composition awkward framing expressive doodle chaos and raw sketch energy",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片季节场景变换",
    prompt: "take the uploaded photo and completely transform the season and weather conditions while preserving the exact same location architecture and general composition, if the original shows summer change to deep winter: add thick snow covering all surfaces replace green leaves with bare snow-laden branches add a soft grey overcast sky with gentle snowfall particles, change the lighting from warm to cool and diffuse, add winter details like icicles hanging from edges frost on windows and breath mist in the cold air, if showing winter change to vibrant autumn: add warm golden and red foliage to trees scatter fallen leaves on the ground replace the cool lighting with warm golden hour sunlight filtering through colored leaves, add autumn atmosphere with slight atmospheric haze and the long shadows of late afternoon, the people or subjects in the scene should remain in their same positions and general appearance but their clothing should subtly adapt to the new season: lighter and brighter for summer heavier and layered for winter, the overall scene should look completely naturally like it was photographed in the new season not like a digital composite, maintain photorealistic quality throughout with appropriate seasonal lighting atmospheric effects and environmental details",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "老旧照片高清修复上色",
    prompt: "restore and enhance the uploaded old or damaged photograph, carefully repair all visible damage: remove scratches dust spots tears creases and stains while preserving the original image's character and historical authenticity, enhance faded colors back to their original vibrancy using historically appropriate color references for the era, if the photo is black and white add natural historically accurate colorization: research the period-appropriate colors for skin tones clothing fabrics architectural elements and environmental details, sharpen blurred areas using intelligent detail reconstruction while maintaining natural film grain texture, improve overall contrast and dynamic range to reveal details lost in shadows and highlights, keep the original composition and aspect ratio intact, the final result should look like the photograph was professionally restored by a museum conservation specialist: clear vibrant and detailed but still authentically vintage, not over-processed or artificial looking, the emotional impact and historical value of the original image should be preserved and enhanced not erased, the subjects should still look like real people from their era not modern AI-generated faces",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "人像背景替换与重设",
    prompt: "using the uploaded portrait photo as strict identity reference preserving the exact facial features skin tone hair and body proportions of the subject, completely remove the original background and replace it with a carefully chosen new environment that fits the subject's pose lighting direction and overall mood, the new background options based on need: a professional corporate office with warm wood paneling and bookshelves for a business portrait, a sunlit outdoor garden with flowering plants and soft bokeh for a lifestyle portrait, a dramatic studio setup with colored gels and shadow patterns for a creative editorial look, or a minimalist architectural space with clean lines and natural light for a modern aesthetic, the key requirement is that the lighting on the subject must perfectly match the new background: if the background is backlit the subject needs rim light matching that direction, if the background is in warm sunset the subject needs warm tone fill, the subject's edges must be cleanly extracted with natural hair strands preserved and no obvious cutout artifacts, the final composite should be seamless and photorealistic looking like the subject was originally photographed in this new environment with matching perspective depth of field and ambient light color",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "角色多视图参考表",
    prompt: "based on the uploaded character reference image, generate a professional animation production character turnaround sheet showing this EXACT same character in five views arranged in a horizontal row: front view facing directly, 3/4 view turned 45 degrees right, side profile at 90 degrees, 3/4 back view at 135 degrees, and full back view facing away, the character in a neutral A-pose with arms slightly away from body and feet shoulder-width apart, CRITICAL: the face in every view must be IDENTICAL to the reference image face with the same eye shape and spacing same nose bridge height and tip shape same lip fullness and curve same jawline and cheekbone structure same eyebrow arch and thickness, same hairstyle color and cut same skin tone same body type same clothing design and colors across ALL five views with zero variation, correct human body proportions with head-to-body ratio 1:7 to 1:7.5, legs approximately half of total height with natural thigh-to-calf ratio knees at midpoint, arms reaching to mid-thigh, neck of natural length full body entirely visible from top of head to soles of feet in every view, clean white or light gray background with subtle alignment grid lines and horizontal proportion guide markers at head shoulders waist knees and feet, even flat studio lighting with no dramatic shadows, professional animation studio character design reference sheet format",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片转纸艺拼贴风格",
    prompt: "recreate the uploaded image in a charming handcrafted paper craft collage style, simplify the main subject and scene details to make them suitable for layered paper artwork, the composition should use multiple layers of cut paper with visible paper thickness casting subtle drop shadows between layers creating a diorama-like depth effect, the paper textures should be visible: construction paper with slight fiber texture tissue paper with translucency corrugated cardboard edges and patterned scrapbook paper for decorative elements, the color palette should shift to warm pastels and soft muted tones with the characteristic look of colored craft paper, edges should show the slight irregularity of hand-cut shapes with tiny imperfections that add handmade charm, add cute decorative elements around the main subject: small paper birds butterflies flowers stars clouds or hearts depending on the scene, the composition should feel visually pleasing soft and adorable like a handmade greeting card or a children's craft project elevated to fine art, maintain the original subject's recognizable identity and the general composition of the scene but reinterpret everything through the lens of paper craft, soft natural lighting with gentle shadows consistent across all layers, high detail showing paper grain and cut edges, overall feeling of warmth creativity and handmade love",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片转MS Paint拙劣风",
    prompt: "redraw the uploaded image in the most clumsy messy and hopelessly amateur way possible as if created in Microsoft Paint by someone who has never used a computer before, use a flat white background and render everything with the characteristic MS Paint aesthetic: jagged pixelated edges from the lack of anti-aliasing obviously filled areas using the paint bucket tool with gaps where the fill leaked through, use only the default MS Paint color palette with garish bright colors chosen seemingly at random, lines should be drawn with the pencil tool at 1px thickness with shaky mouse-drawn quality and no smooth curves, shapes should be approximated with the rectangle and oval tools creating a blocky geometric interpretation, the image should vaguely resemble the original in concept: the same number of subjects in roughly the same positions with some attempt at the same colors but everything is strangely off and awkwardly proportioned, add accidental MS Paint artifacts: random stray pixels incomplete eraser smudges text tool typos with default font text boxes left in wrong places, emphasize the low-quality pixelated look and make it appear ridiculously badly drawn yet somehow endearing in its earnestness, the final result should look like something that would go viral on social media for being hilariously terrible",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "人物换装与风格改造",
    prompt: "using the uploaded portrait photo as strict facial identity reference preserving every detail of the person's face and body proportions exactly, completely change their outfit and styling to a completely different look, options include: transform casual wear into an elegant red carpet evening gown with jewelry and sophisticated makeup, change to traditional Chinese Hanfu with flowing silk layers and classical hair ornaments, convert to cyberpunk streetwear with neon accents and futuristic accessories, or redesign as a historical period costume with accurate era-specific clothing, the key is that the person must remain unmistakably themselves while wearing completely different clothes in a matching environment, lighting should complement the new outfit: dramatic studio light for evening wear, soft natural light for traditional clothing, neon reflections for cyberpunk, the original background should be replaced with a setting appropriate to the new style, the final result should look like an authentic photograph of this person at a different event or in a different world, photorealistic quality with seamless integration of new clothing onto the original body",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片表情编辑与微调",
    prompt: "take the uploaded portrait photo and subtly adjust the subject's facial expression while keeping everything else absolutely identical: the same lighting same background same clothing same hair same pose same camera angle same skin texture, only the expression changes, adjust as specified: change from neutral to a warm genuine smile with natural eye crinkles and slight cheek elevation, change from smiling to a serious contemplative look with relaxed mouth and focused eyes, add subtle surprise with slightly raised eyebrows and parted lips, the key constraint is maximum realism: the new expression must look completely natural and authentic as if the person was originally photographed making that exact expression, avoid uncanny valley effects overexaggeration or artificial stretching, preserve the exact same skin texture pore detail lighting reflections and facial proportions, the transition between original and edited areas must be completely invisible, this should look like a genuine alternate shot from the same photo session not a digitally altered image",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片真实变老/年轻化",
    prompt: "using the uploaded portrait photo as the identity reference, realistically age this person by 30-40 years to show them as a dignified elderly version of themselves while keeping their facial identity unmistakably recognizable, the aging must be completely natural and photorealistic: add fine lines and wrinkles appropriate to the face structure including crow's feet forehead lines nasolabial folds and subtle age spots, the skin should show natural loss of elasticity with slightly looser contours around the jaw and neck while maintaining the same bone structure, hair should transition to silver gray white or salt-and-pepper while keeping the same hair texture and general style, eyebrows may thin slightly, the eyes should show the same color and general shape but with slightly heavier eyelids and wisdom lines around them, keep the same lighting background clothing and composition as the original, the result should look like a genuine photograph of this person's parent or older self not a caricature or cartoon, alternatively if asked to de-age make the person look 15-20 years younger with smoother skin fuller facial volume and youthful vitality while keeping the same facial identity, in both cases photorealism and identity preservation are the absolute priorities",
  },
  {
    category: "i2i",
    mode: "i2i",
    label: "照片背景扩展与重构",
    prompt: "take the uploaded photo and dramatically expand the background beyond the original frame while keeping the main subject perfectly intact, imagine what exists beyond the cropped edges: extend the environment architecture landscape or interior outward in all directions maintaining consistent perspective lighting and visual style, if the photo shows a person in a room expand to reveal the full room with furniture windows doors and decorative elements that logically complete the space, if outdoors expand to reveal more of the landscape cityscape or natural environment with appropriate depth layers from foreground to distant horizon, the expanded areas must be seamlessly integrated with the original image: matching the same camera angle lens characteristics depth of field white balance color grading and film grain, the original subject remains untouched while the expanded background tells a richer story about the place and context, the final composition can shift the subject to a new position within a wider frame creating a more cinematic or editorial composition, the aspect ratio can change from the original to a wider format like 16:9 or 2.35:1 for a cinematic feel, the overall effect should be like seeing the uncropped original photograph revealing the full scene the photographer actually captured, photorealistic quality throughout with no visible seam between original and expanded areas",
  },
];

/** 中英 prompt 关键词映射 */
const ZH_EN_MAP: Record<string, string> = {
  "4k": "4K",
  "高清": "high definition",
  "超清": "ultra HD",
  "8k": "8K",
  "高细节": "highly detailed",
  "极致画质": "masterpiece quality",
  "超写实": "hyperrealistic",
  "写实": "photorealistic",
  "照片级": "photorealistic",
  "卡通": "cartoon style",
  "动漫": "anime style",
  "油画": "oil painting",
  "水彩": "watercolor painting",
  "素描": "pencil sketch",
  "水墨": "ink wash painting",
  "浮世绘": "ukiyo-e style",
  "像素": "pixel art",
  "3d渲染": "3D render",
  "赛博朋克": "cyberpunk",
  "蒸汽朋克": "steampunk",
  "极简": "minimalist",
  "复古": "vintage",
  "波普": "pop art",
  "抽象": "abstract",
  "印象派": "impressionist",
  "超现实": "surrealist",
  "哥特": "gothic",
  "巴洛克": "baroque",
  "装饰艺术": "art deco",
  "新艺术": "art nouveau",
  "手绘": "hand-drawn",
  "逆光": "backlight",
  "柔光": "soft lighting",
  "硬光": "hard lighting",
  "自然光": "natural lighting",
  "工作室光": "studio lighting",
  "黄金时刻": "golden hour",
  "蓝调时刻": "blue hour",
  "霓虹灯": "neon lights",
  "烛光": "candlelight",
  "暮光": "twilight",
  "晨光": "morning light",
  "夕阳": "sunset lighting",
  "月光": "moonlight",
  "剪影": "silhouette",
  "伦勃朗光": "Rembrandt lighting",
  "蝴蝶光": "butterfly lighting",
  "侧光": "side lighting",
  "顶光": "top lighting",
  "底光": "bottom lighting",
  "漏光": "light leak",
  "特写": "close-up",
  "大特写": "extreme close-up",
  "中景": "medium shot",
  "全景": "wide shot",
  "远景": "long shot",
  "鸟瞰": "bird's eye view",
  "俯视": "top-down view",
  "仰视": "low angle",
  "平视": "eye level",
  "鱼眼": "fisheye lens",
  "广角": "wide angle",
  "长焦": "telephoto lens",
  "微距": "macro photography",
  "对称构图": "symmetrical composition",
  "三分法": "rule of thirds",
  "引导线": "leading lines",
  "框架构图": "frame within a frame",
  "负空间": "negative space",
  "浅景深": "shallow depth of field",
  "深景深": "deep depth of field",
  "暖色调": "warm color tones",
  "冷色调": "cool color tones",
  "黑白": "black and white",
  "单色": "monochrome",
  "鲜艳": "vibrant colors",
  "柔和": "pastel colors",
  "莫兰迪": "Morandi color palette",
  "赛博色调": "synthwave color palette",
  "大地色": "earthy tones",
  "金色调": "golden tones",
  "银色调": "silver tones",
  "高饱和": "high saturation",
  "低饱和": "desaturated",
  "褪色": "faded colors",
  "霓虹色": "neon color palette",
  "互补色": "complementary colors",
  "类似色": "analogous colors",
  "蓝色调": "blue color grading",
  "橙色调": "orange and teal color grading",
  "原色": "primary colors",
  "史诗": "epic",
  "梦幻": "dreamy",
  "神秘": "mysterious",
  "恐怖": "horror",
  "浪漫": "romantic",
  "忧郁": "melancholic",
  "快乐": "joyful",
  "宁静": "serene",
  "戏剧性": "dramatic",
  "未来感": "futuristic",
  "古典": "classical",
  "自然": "natural",
  "奢华": "luxurious",
  "粗糙": "rough texture",
  "光滑": "smooth texture",
  "毛绒": "fluffy",
  "金属": "metallic",
  "玻璃": "glass",
  "木质": "wooden",
  "布料": "fabric texture",
  "云": "clouds",
  "雾": "fog",
  "雨": "rain",
  "雪": "snow",
  "闪电": "lightning",
  "彩虹": "rainbow",
  "火焰": "flames",
  "烟雾": "smoke",
  "水面倒影": "water reflection",
  "镜头光晕": "lens flare",
  "散景": "bokeh",
  "光斑": "light particles",
  "尘埃": "dust particles",
  "花瓣": "flower petals",
  "羽毛": "feathers",
  "水晶": "crystals",
  "宝石": "gemstones",
  "星空": "starry sky",
  "极光": "aurora borealis",
  "海浪": "ocean waves",
  "电影级": "cinematic",
  "电影质感": "cinematic lighting, film grain",
  "大师级": "masterpiece, best quality",
  "获奖作品": "award winning photograph",
  "锐利": "sharp focus",
  "虚化": "blurred background",
  "景深": "depth of field",
  "高清细节": "intricate details",
  "纹理清晰": "detailed texture",
  "真实感": "photorealistic rendering",
};

export function translateToEnglish(chinesePrompt: string): string {
  let result = chinesePrompt;
  const sortedKeys = Object.keys(ZH_EN_MAP).sort(
    (a, b) => b.length - a.length
  );
  for (const zh of sortedKeys) {
    const en = ZH_EN_MAP[zh];
    result = result.split(zh).join(en);
  }
  return result;
}

export function randomTemplate(): TemplateItem {
  const idx = Math.floor(Math.random() * TEMPLATES.length);
  return TEMPLATES[idx];
}

export function templatesByCategory(category: string): TemplateItem[] {
  return TEMPLATES.filter((t) => t.category === category);
}

export function templatesByMode(mode: "t2i" | "i2i" | "both"): TemplateItem[] {
  return TEMPLATES.filter((t) => t.mode === mode);
}
