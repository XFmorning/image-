export interface TemplateItem {
  label: string;
  prompt: string;
  category: string;
}

export const TEMPLATE_CATEGORIES: { key: string; name: string; icon: string }[] = [
  { key: "portrait", name: "人像", icon: "UserOutlined" },
  { key: "landscape", name: "风景", icon: "PictureOutlined" },
  { key: "scifi", name: "科幻", icon: "RocketOutlined" },
  { key: "ancient", name: "古风", icon: "EnvironmentOutlined" },
  { key: "animal", name: "动物", icon: "BugOutlined" },
  { key: "abstract", name: "抽象", icon: "ExperimentOutlined" },
  { key: "video", name: "图生视频", icon: "PlayCircleOutlined" },
];

export const TEMPLATES: TemplateItem[] = [

  // ===================== 人像 =====================
  {
    category: "portrait",
    label: "电影级肖像",
    prompt: "cinematic portrait of a person, golden hour rim lighting creating a halo effect on hair, shallow depth of field with creamy bokeh background, professional 85mm lens, sharp focus on eyes with catchlights visible, natural skin texture with subtle pores, warm color grading with slight teal shadows, editorial photography style, 8K resolution, hyperrealistic detail",
  },
  {
    category: "portrait",
    label: "时尚杂志封面",
    prompt: "high fashion magazine cover portrait, model in avant-garde designer clothing, dramatic studio lighting with strong key light and deep shadows, bold makeup with striking color accents, clean seamless backdrop, editorial composition with intentional negative space for text overlay, luxury aesthetic, Vogue editorial style, sharp details on fabric textures and jewelry, professional medium format photography",
  },
  {
    category: "portrait",
    label: "汉服古装人像",
    prompt: "portrait of a person wearing traditional Chinese Han dynasty clothing with intricate silk embroidery and flowing layered robes, hair styled in classical Chinese hairpin arrangement, posed gracefully in a bamboo garden with morning mist, soft diffused natural light filtering through leaves, ethereal and elegant atmosphere, color palette of warm reds golds and jade greens, historical accuracy in clothing details, cinematic composition, photorealistic skin and fabric rendering",
  },
  {
    category: "portrait",
    label: "日系清新写真",
    prompt: "Japanese style清新 portrait, young person with natural minimal makeup, soft window light creating gentle shadows, pastel color palette dominated by whites creams and light blues, airy and light-filled composition, medium format film aesthetic with subtle grain, relaxed candid expression, minimalist bedroom or garden setting, youth and innocence mood, springtime atmosphere with cherry blossom hints",
  },
  {
    category: "portrait",
    label: "古典油画肖像",
    prompt: "classical oil painting portrait in the style of 17th century Dutch masters, dramatic chiaroscuro lighting with a single candle or window light source illuminating one side of the face, rich deep shadows on the opposite side, visible brushstroke texture on canvas, warm earthy color palette of browns ochres and deep reds, subject in period clothing with lace collar or velvet fabric, dark atmospheric background, timeless and dignified mood, museum quality masterpiece",
  },
  {
    category: "portrait",
    label: "黑白纪实人像",
    prompt: "black and white documentary portrait, elderly person with deeply lined face telling a lifetime of stories, harsh directional light creating strong contrast and dramatic shadows, gritty urban background with peeling paint or weathered textures, photojournalism approach capturing raw unposed emotion, grainy Tri-X 400 film aesthetic, Leica rangefinder style composition, timeless and powerful human connection, monochrome tones from deep blacks to bright whites with full gray range",
  },
  {
    category: "portrait",
    label: "极简商业白底",
    prompt: "clean commercial portrait on pure white seamless background, professional headshot with even three-point studio lighting eliminating all shadows, subject in business attire with confident approachable expression, flawless but natural skin retouching, sharp focus from front to back, high-key lighting style, suitable for corporate profile or LinkedIn, 85mm portrait lens, minimal and polished aesthetic, no distracting elements in frame",
  },
  {
    category: "portrait",
    label: "赛博朋克人物",
    prompt: "cyberpunk character portrait, person with subtle cybernetic facial enhancements and glowing blue LED implants, standing in a rain-soaked neon-lit alley at night, reflections of pink and purple holographic signs in water puddles, one side of face illuminated by warm neon the other by cool blue light, high-tech dystopian atmosphere, detailed mechanical texture on cybernetics, Blade Runner 2049 inspired color grading, cinematic wide composition, rain droplets on skin and clothing",
  },
  {
    category: "portrait",
    label: "复古胶片人像",
    prompt: "vintage 1980s film portrait, subject with retro hairstyle and clothing, warm Kodak Portra 400 color palette with creamy skin tones and slightly muted greens, soft natural window light from one side, cozy interior setting with period-appropriate furniture and decor, subtle film grain and slight color shift toward warm amber, nostalgic and intimate mood, medium format 6x7 composition, candid moment captured feel",
  },

  // ===================== 风景 =====================
  {
    category: "landscape",
    label: "写实山水",
    prompt: "majestic mountain landscape at golden hour, layered mountain ranges receding into atmospheric haze creating depth, a winding river reflecting the warm sunset sky, ancient pine trees clinging to rocky cliffs in the foreground, dramatic clouds catching the last light of day, ultra wide angle composition emphasizing the vast scale, natural colors ranging from deep green to warm orange and purple, National Geographic documentary photography style, 8K ultra high resolution, every rock texture and tree branch sharply defined",
  },
  {
    category: "landscape",
    label: "星空银河",
    prompt: "breathtaking Milky Way arching across a pitch-black night sky over silent mountain silhouettes, millions of stars visible with distinct galactic core dust lanes in purple and blue, a small tent with warm orange glow providing scale and human connection, long exposure astrophotography technique, no light pollution visible, pristine wilderness setting, reflection of stars in a still alpine lake, cosmic awe and solitude mood, professional astrophotography with star tracker, ultra wide fisheye composition",
  },
  {
    category: "landscape",
    label: "日落海滩",
    prompt: "tropical paradise beach at sunset, golden hour light painting the white sand in warm amber tones, silhouettes of leaning palm trees framing the composition, gentle waves creating foam patterns on the shore, the sun a perfect orange disk touching the horizon over calm turquoise ocean, scattered clouds painted in pink and coral by the setting sun, drone aerial perspective showing the full curve of the bay, vacation paradise mood, vibrant but natural color saturation, 8K travel photography",
  },
  {
    category: "landscape",
    label: "樱花季节",
    prompt: "springtime cherry blossom avenue in full bloom, ancient sakura trees forming a natural pink tunnel over a quiet stone pathway, delicate petals falling like pink snow caught in a gentle breeze, soft morning sunlight filtering through the blossom canopy creating dappled light patterns on the ground, a traditional wooden bridge over a calm pond reflecting the pink canopy, romantic and peaceful Japanese spring atmosphere, no people visible, anime-inspired composition with photorealistic rendering, pastel pink and soft green color palette",
  },
  {
    category: "landscape",
    label: "北欧森林",
    prompt: "dense Scandinavian pine forest in early morning, thick ground mist hovering between tree trunks at knee height, first rays of sunrise breaking through the canopy creating god rays in the fog, moss-covered boulders and fallen logs on the forest floor, deep green color palette with soft golden highlights, pristine untouched wilderness atmosphere, medium telephoto compression emphasizing the density of trees, silence and tranquility mood, nature documentary cinematography, hyperrealistic detail on bark moss and ferns",
  },
  {
    category: "landscape",
    label: "沙漠奇观",
    prompt: "vast Sahara desert at golden hour, endless waves of sand dunes sculpted by wind into perfect geometric curves and sharp ridges, dramatic side-lighting emphasizing every dune contour with long shadows, a distant camel caravan creating tiny silhouettes for scale, warm monochromatic palette shifting from deep orange in shadows to bright gold on sunlit faces, clear deep blue sky at the top of frame, Arabian Nights atmosphere, aerial perspective showing the infinite scale, hyperrealistic sand texture visible in foreground",
  },
  {
    category: "landscape",
    label: "冬日雪景村庄",
    prompt: "charming snow-covered Alpine village at blue hour, warm golden light spilling from cottage windows reflecting on the fresh snow, smoke rising gently from chimneys against the deep blue twilight sky, snow-laden pine trees framing the scene, a frozen stream winding through the village center, Christmas card perfect composition, cozy and peaceful winter atmosphere, the first stars becoming visible in the darkening sky, photorealistic architectural details on traditional wooden chalets, soft focus on distant mountains",
  },
  {
    category: "landscape",
    label: "现代城市天际线",
    prompt: "modern metropolitan skyline at blue hour from across a harbor or river, glass skyscrapers with interior office lights beginning to illuminate creating a mosaic pattern, city lights and traffic trails reflecting perfectly on the calm water surface, iconic buildings clearly recognizable in the skyline, clear gradient sky from deep blue at top to warm orange at the horizon where the sun has just set, professional architectural photography, ultra sharp detail on building facades, drone perspective at optimal height showing the full city panorama",
  },
  {
    category: "landscape",
    label: "热带雨林瀑布",
    prompt: "hidden waterfall deep in a lush tropical rainforest, water cascading over moss-covered rock faces into a crystal-clear emerald pool below, dense jungle vegetation with giant ferns broad-leaf plants and hanging vines framing the scene on all sides, sun rays piercing through gaps in the canopy creating highlights on the water spray and mist, exotic birds and butterflies adding life and scale, primordial untouched nature atmosphere, vibrant green color palette with rainbow hints in water spray, National Geographic documentary style, hyperrealistic detail on every leaf and water droplet",
  },

  // ===================== 科幻 =====================
  {
    category: "scifi",
    label: "巨型太空站",
    prompt: "massive orbital space station in low Earth orbit, intricate modular architecture with connecting tunnels solar arrays and docking bays, the blue curve of Earth filling the background with visible continents and swirling white cloud patterns, the Milky Way visible in the deep black of space above, small maintenance spacecraft providing scale against the station's massive hull, highly detailed mechanical and industrial design with visible panel lines heat radiators and antenna arrays, cinematic lighting with strong rim light from the sun creating dramatic shadows, science fiction concept art quality, 8K, photorealistic rendering of metal surfaces and Earth below",
  },
  {
    category: "scifi",
    label: "外星行星地表",
    prompt: "alien exoplanet surface with twin moons visible in the purple sky, strange bioluminescent flora in fluorescent blues pinks and oranges dotting the landscape, unusual crystalline rock formations with geometric patterns suggesting intelligent origin, a shallow methane lake reflecting the alien sky in iridescent colors, thin atmosphere creating a slight haze on the horizon, no Earth-like elements visible, completely original alien ecosystem design, science fiction concept art for film production, cinematic ultra wide composition emphasizing the alien scale, 8K photorealistic detail on crystal formations and organic alien plant structures",
  },
  {
    category: "scifi",
    label: "赛博朋克夜市",
    prompt: "ground-level view of a crowded cyberpunk night market street, multi-level chaos of neon holographic advertisements in Chinese Japanese and English overlapping each other, steam rising from street food vendor carts and subway grates mixing with ambient neon glow, diverse crowd of augmented humans in futuristic street fashion some with visible cybernetic limbs or glowing implants, rain-slicked reflective pavement mirroring the neon chaos above, overhead monorail and drones adding vertical depth, dense atmospheric haze with volumetric lighting, Blade Runner meets Ghost in the Shell aesthetic, ultra detailed environmental storytelling, cinematic wide angle composition",
  },
  {
    category: "scifi",
    label: "高度拟真机器人",
    prompt: "extreme close-up portrait of a highly advanced humanoid robot, face with subtle mechanical seams and panel gaps visible only upon close inspection, one synthetic eye glowing faintly blue with visible micro-circuitry in the iris, brushed titanium and carbon fiber surface textures with precise machining marks, the boundary between machine and human blurred by the elegant design, studio lighting with softbox creating gentle highlights on the metallic surfaces, depth of field focusing on the eye and cheek area, 3D render quality with octane engine, hyperrealistic material rendering of metal polymers and glass lens elements",
  },
  {
    category: "scifi",
    label: "未来飞行器",
    prompt: "advanced futuristic aircraft in mid-flight above a future city, sleek aerodynamic blended-wing body design with no visible seams or rivets, energy-efficient blue plasma propulsion system leaving a subtle ion trail, active camouflage panels mid-transition from sky-matching to visible, the aircraft banking slightly showing its full profile against dramatic sunset clouds, drone escort vehicles visible in formation nearby, the city below with spire-like eco-architecture and vertical gardens, cinematic composition with the aircraft occupying two-thirds of frame, photorealistic rendering of composite materials and atmospheric effects",
  },
  {
    category: "scifi",
    label: "全息数据界面",
    prompt: "futuristic holographic data visualization floating in a dark control room, multiple transparent layers of information screens arranged in a semi-circle around the viewer, glowing cyan and amber data streams flowing between displays, 3D wireframe models of planetary systems rotating in the center, subtle particle effects and light bloom around interactive elements, glass and metal reflections of the holograms on the polished floor, clean minimalist UI design inspired by Iron Man and Minority Report interfaces, the operator visible only as a faint silhouette behind the glowing displays, cinematic composition emphasizing depth and information density",
  },
  {
    category: "scifi",
    label: "地下秘密基地",
    prompt: "underground secret research facility, vast cavern carved into bedrock with industrial metal catwalks staircases and platforms spanning multiple levels, dim amber warning lights and flickering fluorescent tubes providing the only illumination, massive cylindrical containment units in the center glowing with an ominous blue energy, scientists in hazmat suits barely visible on distant walkways for scale, steam venting from pipes and condensation dripping from the rocky ceiling, survival horror science fiction atmosphere, detailed industrial design with visible conduits warning signs and safety railings, cinematic low-angle composition emphasizing the oppressive scale, gritty photorealistic textures",
  },
  {
    category: "scifi",
    label: "机甲格纳库",
    prompt: "giant military mecha standing in a maintenance hangar bay, the robot towering 30 meters tall with armored plating showing battle damage and scorch marks, technicians and engineers on elevated platforms working on various sections providing sense of scale, overhead crane systems and ammunition loaders surrounding the mecha, harsh industrial floodlights creating dramatic shadows across the mecha's form, the robot's head visible in the upper third with sensor eyes glowing red in standby mode, Japanese mecha anime style realized with photorealistic 3D rendering, every hydraulic piston joint actuator and armor panel rendered in extreme detail, epic cinematic composition",
  },

  // ===================== 古风 =====================
  {
    category: "ancient",
    label: "水墨山水",
    prompt: "traditional Chinese ink wash landscape painting, misty vertical mountains composed of layered ink washes from pale gray to deepest black, a solitary waterfall descending from a cliff face into clouds below, ancient twisted pine trees clinging to rocky outcrops, a tiny figure of a scholar with a staff on a mountain path providing scale, rice paper texture visible with ink bleeding effects at edges of washes, red seal stamp in one corner, poetic Tang dynasty composition with intentional empty space for meditation, master calligraphy brushwork, serene and timeless Zen atmosphere",
  },
  {
    category: "ancient",
    label: "敦煌飞天壁画",
    prompt: "Dunhuang Mogao Caves mural style celestial flying Apsara being, graceful figure with flowing multicolored silk ribbons and scarves trailing in sweeping curves suggesting divine flight, playing a pipa instrument while floating among clouds, rich mineral pigment colors dominated by turquoise blue vermillion red and gold leaf, weathered fresco texture on ancient plaster walls with subtle crack patterns, Tang dynasty Buddhist art style with Indian Gandhara influences, circular halo behind the figure's head, flowers and musical instruments scattered in the surrounding space as offerings, museum quality ancient art reproduction",
  },
  {
    category: "ancient",
    label: "江南水乡",
    prompt: "classic Jiangnan water town scene at dawn, ancient whitewashed buildings with dark tiled roofs lining a calm canal, traditional stone arch bridge reflecting perfectly in the still water creating a full circle, weeping willow trees with branches touching the canal surface, a small wooden boat with a solitary boatman poling slowly through morning mist, pink and gray dawn sky reflected in the water, lanterns still glowing softly along the waterfront, nostalgic peaceful atmosphere reminiscent of classical Chinese poetry, ink wash painting aesthetic realized through photorealistic rendering, soft misty color palette of whites grays and muted greens",
  },
  {
    category: "ancient",
    label: "武侠江湖",
    prompt: "solitary swordsman in flowing white robes standing on the peak of a mist-shrouded mountain, long hair and robe edges flowing in the mountain wind, ancient sword held loosely at the side with a tassel dancing in the breeze, sea of clouds below stretching to the horizon with other mountain peaks piercing through like islands, a single ancient pine tree bent by wind beside the figure, golden dawn light breaking over the cloud sea, wuxia cinematic composition with dramatic scale, mood of solitary mastery and inner peace, photorealistic rendering of fabric movement and atmospheric lighting, anamorphic lens flare from the rising sun",
  },
  {
    category: "ancient",
    label: "青花瓷静物",
    prompt: "exquisite Ming dynasty blue and white porcelain vase as the central subject, intricate cobalt blue hand-painted patterns of dragons chasing pearls among clouds and waves wrapping around the vessel, placed on a dark rosewood table, soft natural window light from the left creating subtle highlights on the glossy glaze surface, a single branch of plum blossoms in a simpler vase beside it, antique scroll and brush holder in the background slightly out of focus, museum artifact photography style, every brushstroke of the cobalt pattern and every specular highlight on the ceramic surface rendered with hyperrealistic precision, elegant and timeless composition",
  },
  {
    category: "ancient",
    label: "唐代仕女图",
    prompt: "Tang dynasty court lady portrait inspired by Zhou Fang paintings, full-figured beauty with rounded face and elaborate high chignon hairstyle adorned with gold hairpins and fresh peony flowers, wearing a flowing silk dress with wide sleeves in rich vermillion and gold, holding a round silk fan painted with a landscape, standing in a palace garden with peonies in bloom and a decorative railing, warm soft lighting suggesting late afternoon, classical Chinese figure painting style translated to photorealistic rendering, accurate historical details in clothing patterns makeup and accessories, elegant courtly atmosphere",
  },
  {
    category: "ancient",
    label: "古寺晨钟",
    prompt: "ancient Buddhist temple courtyard at dawn, weathered stone lanterns with moss growing in their crevices lining a path of worn flagstones, a large bronze temple bell hanging from a wooden frame with a suspended log striker, the main hall with curved rooflines and faded vermillion pillars visible through morning fog, a single monk in gray robes walking toward the bell to ring the morning awakening, ginkgo tree with golden autumn leaves partially framing the scene, meditative Zen atmosphere, soft diffused morning light creating a dreamlike quality, photorealistic detail on weathered wood stone textures and autumn leaves, Japanese or Chinese temple architecture",
  },

  // ===================== 动物 =====================
  {
    category: "animal",
    label: "非洲雄狮",
    prompt: "majestic adult male lion in profile against a golden savanna sunset, full mane blowing slightly in the warm breeze, the lion gazing into the distance with piercing amber eyes, every whisker and fur strand sharply defined in the golden hour backlight, the vast African plains with acacia tree silhouettes stretching behind creating a sense of wild freedom, low camera angle from ground level making the lion appear even more powerful and regal, National Geographic Wildlife Photographer of the Year quality, shallow depth of field isolating the lion's head from the distant background, hyperrealistic detail on mane texture and facial features",
  },
  {
    category: "animal",
    label: "灵动家猫",
    prompt: "close-up portrait of a domestic cat with large expressive eyes, the cat looking directly at the camera with curious alert expression, soft natural window light creating beautiful catchlights in the eyes and gentle shadows, shallow depth of field with only the eyes and nose in perfect focus while ears and whiskers softly blur, individual whiskers and fur strands visible with subtle color variations in the coat, cozy home environment barely visible in the creamy bokeh background, pet photography style, warm and intimate mood, 85mm lens at f1.4 for extreme shallow depth, hyperrealistic detail on eye texture and fur",
  },
  {
    category: "animal",
    label: "鲸鱼跃出海面",
    prompt: "magnificent humpback whale fully breaching the ocean surface, its massive body rising vertically out of the water with droplets spraying in all directions, the whale's ventral pleats and barnacle clusters clearly visible on its underside, dramatic sunset sky reflected on the choppy ocean surface in oranges and pinks, the splash creating a crown of white water around the whale, a research boat in the distance providing scale revealing the whale's true size, split second action frozen in time, National Geographic wildlife photography, hyperrealistic detail on whale skin texture water droplets and ocean spray, epic and powerful composition",
  },
  {
    category: "animal",
    label: "北极狐雪景",
    prompt: "pure white Arctic fox curled up in a fresh snowfall, the fox's thick winter coat blending almost perfectly with the surrounding snow, only the black tip of its nose and dark intelligent eyes standing out, soft overcast winter light creating a high-key almost monochromatic scene, delicate snowflakes resting on the fox's fur and whiskers without melting, the arctic tundra stretching to a featureless white horizon behind, cold and pristine atmosphere, wildlife photography with shallow depth of field, hyperrealistic detail on fur texture with each individual guard hair visible, the fox looking directly at camera with curious expression",
  },
  {
    category: "animal",
    label: "金刚鹦鹉",
    prompt: "vibrant scarlet macaw perched on a mossy tropical branch, the parrot's brilliant red blue and yellow plumage in sharp focus showing every feather barb and subtle iridescence, the bird turned slightly to profile showing its curved black beak and intelligent eye with a catchlight, lush green rainforest canopy with out-of-focus foliage creating a natural colorful bokeh background, soft dappled sunlight filtering through leaves above creating natural highlights on the bird's plumage, exotic wildlife photography, 300mm telephoto lens compression, hyperrealistic detail on feather texture beak surface and eye ring, Costa Rica or Amazon jungle setting",
  },
  {
    category: "animal",
    label: "白头鹰翱翔",
    prompt: "bald eagle in mid-flight with wings fully spread in a powerful soaring pose, the eagle captured from below against a dramatic stormy sky with breaks of golden sunlight creating rim lighting on the wing feathers, the iconic white head and tail feathers contrasting with the dark brown body, sharp yellow talons tucked tightly against the body in flight, every primary and secondary flight feather individually defined, the eagle's focused predatory gaze visible, split-second action wildlife photography, National Geographic quality, hyperrealistic feather detail and dramatic natural lighting, symbol of freedom and power",
  },
  {
    category: "animal",
    label: "深海水母",
    prompt: "ethereal bioluminescent jellyfish floating in the absolute darkness of the deep ocean, its translucent bell pulsing with internal blue and purple bioluminescence creating a natural fiber-optic effect, long delicate tentacles trailing below with microscopic stinging cells catching faint light, the only illumination coming from the jellyfish itself against the pitch-black abyss, tiny particles of marine snow floating past creating depth and scale, other smaller jellyfish visible as faint glows in the distant background, underwater macro photography, otherworldly and mesmerizing atmosphere, hyperrealistic detail on the jellyfish's translucent tissues and bioluminescent patterns, full frame composition",
  },
  {
    category: "animal",
    label: "大熊猫竹林",
    prompt: "giant panda sitting peacefully in a bamboo forest, the panda holding a fresh green bamboo stalk with both paws while eating, distinctive black and white fur pattern rendered in hyperrealistic detail showing the coarse texture of the outer guard hairs and the softer undercoat, the panda's gentle expression with dark eye patches and rounded ears, dappled sunlight filtering through the dense bamboo grove creating natural spot lighting, fallen bamboo leaves on the forest floor, the Sichuan mountain mist creating a soft atmospheric haze, wildlife documentary photography, intimate mid-range composition, the panda as China's national treasure captured with dignity and charm",
  },
  {
    category: "animal",
    label: "斑马群迁徙",
    prompt: "aerial drone perspective of a large zebra herd crossing the African savanna during the great migration, hundreds of zebras creating a flowing river of black and white stripes across the golden grassland, dust kicked up by thousands of hooves creating a golden haze backlit by the setting sun, the intricate stripe patterns of individual zebras visible in the foreground while the herd stretches to the horizon, scattered acacia trees providing scale, the Serengeti plains in the dry season with amber grasses, epic wildlife documentary cinematography, hyperrealistic detail on the foreground zebras and atmospheric dust particles, wide panorama composition capturing the scale of the migration",
  },

  // ===================== 抽象 =====================
  {
    category: "abstract",
    label: "流动水墨",
    prompt: "abstract black ink swirling and diffusing in clear water, organic fluid dynamics creating unpredictable branching patterns and cloud-like formations, high contrast monochrome with pure whites and the deepest blacks, the moment of ink drop impact frozen in ultra slow motion, negative space composition with the ink occupying only one third of frame, contemporary art gallery aesthetic, 8K macro cinematography of liquid motion, meditation on chaos and order, minimalist with maximum visual impact",
  },
  {
    category: "abstract",
    label: "液态金属",
    prompt: "flowing liquid mercury and chrome forming organic sculptural shapes, the molten metal surface reflecting a gradient sky from warm sunset orange to cool twilight blue, perfectly smooth surface tension creating mirror-like reflections distorted by gentle ripples, the metal appearing both solid and liquid simultaneously in impossible physics, 3D rendered with octane render engine, hyperrealistic material simulation, modern luxury aesthetic, abstract composition exploring form and reflection, the metal floating in infinite white space",
  },
  {
    category: "abstract",
    label: "几何极简主义",
    prompt: "minimalist geometric composition, pure primary colored circles squares and triangles arranged in Bauhaus style asymmetrical balance, flat vector aesthetic with crisp edges and perfectly uniform colors, generous white negative space surrounding the geometric elements, a single black line intersecting the composition at a precise angle, mid-century modern graphic design influence, the composition feeling both mathematically precise and artistically intentional, clean modern art gallery poster aesthetic, no gradients or shadows, pure form and color relationships",
  },
  {
    category: "abstract",
    label: "宇宙星云",
    prompt: "abstract cosmic nebula formation, swirling clouds of interstellar gas and dust in deep purples electric blues and hot pinks, fractal-like structures suggesting galaxy formation at multiple scales from vast spiral arms to microscopic particle interactions, bright star cluster points scattered throughout creating depth, the boundary between scientific accuracy and abstract art intentionally blurred, Hubble Space Telescope color palette, the composition evoking both the infinite cosmos and the patterns of cellular biology, 8K digital art, ethereal and transcendent atmosphere",
  },

  // ===================== 图生视频专用 =====================
  {
    category: "video",
    label: "角色三视图（标准）",
    prompt: "professional character turnaround reference sheet for animation production, the SAME character shown in five views arranged in a horizontal row: front view facing camera directly, 3/4 view turned 45 degrees, side profile at 90 degrees, 3/4 back view at 135 degrees, and full back view facing away, the character in a neutral A-pose with arms slightly away from body and feet shoulder-width apart, SAME facial features SAME hairstyle SAME body proportions SAME clothing SAME colors in EVERY view, this is critical for character consistency, the character must be IDENTICAL across all views with no variation in face shape eye size nose shape or any features, clean white or light gray background with subtle alignment grid lines, even flat studio lighting with no dramatic shadows, full body shown from head to toe in every view, professional animation or game character design reference sheet format",
  },
  {
    category: "video",
    label: "角色表情变化集",
    prompt: "character expression reference sheet for animation, the SAME single character's head and shoulders shown in a 3x3 grid of nine expressions, expressions: neutral happy sad angry surprised scared disgusted confused amused, the face must be absolutely IDENTICAL in structure proportions and features across all nine panels, only the expression changes through muscle movement around eyes eyebrows and mouth, SAME hairstyle SAME eye color SAME skin tone SAME face shape in every panel, each panel labeled with a tiny text below the expression name, clean white background with thin grid lines separating panels, even studio lighting, professional animation expression sheet used by Disney and Pixar character designers, consistent art style across all panels, the character identity preserved 100% across every expression",
  },
  {
    category: "video",
    label: "图生图角色三视图（面部锁定）",
    prompt: "IMPORTANT: use the uploaded reference image as the EXACT character to depict. Create a professional character turnaround sheet showing this EXACT same character in five views: front facing camera, 3/4 right, side profile right, 3/4 back right, full back. The face in every view must be IDENTICAL to the reference image face — same eye shape and spacing, same nose bridge height and tip shape, same lip fullness and curve, same jawline and cheekbone structure, same eyebrow arch and thickness. Same hairstyle color and cut, same skin tone, same body type, same clothing design and colors across ALL five views. If the reference shows a specific scar mole or facial feature, it MUST appear in every view where visible. Character stands in neutral A-pose. Clean white background. Professional animation character design sheet. This is for video production requiring absolute facial consistency across frames.",
  },
  {
    category: "video",
    label: "角色行走循环序列帧",
    prompt: "professional 2D animation walk cycle reference sheet, the SAME character shown in 8 sequential frames of a complete walking motion cycle viewed from the side profile, frames arranged in two horizontal rows of four, the walk cycle starting and ending at the same pose for seamless looping, SAME character identity SAME proportions SAME clothing in every frame, only the limb positions and slight body rotation change following natural human walk biomechanics, the character must be IDENTICAL across all 8 frames with no feature drift, clean white background with frame numbers below each pose, professional animation production reference used by Studio Ghibli and Disney animators, even lighting no shadows, consistent line quality and art style across all frames, suitable for creating looping video animation",
  },
  {
    category: "video",
    label: "产品360度旋转展示",
    prompt: "professional e-commerce product 360 degree rotation reference photography, the SAME product shown in 8 evenly spaced angles at 45 degree increments completing a full rotation: 0 front 45 90 side 135 180 back 225 270 side 315, the product placed on a motorized turntable with pure white seamless background, absolutely IDENTICAL studio lighting from all angles — three-point lighting with softboxes ensuring no shadow variation between shots, the product must appear at EXACTLY the same scale and height in every frame, same color balance same exposure same white balance across all 8 views, professional commercial product photography for luxury brands, suitable for creating smooth 360 spin video, the product identity and material appearance preserved 100% consistent across the complete rotation",
  },
  {
    category: "video",
    label: "武器/道具三视图蓝图",
    prompt: "professional weapon prop design orthographic blueprint sheet for game production, the EXACT same weapon or prop shown in three technical views: front elevation facing directly, side profile at 90 degrees, and top-down plan view, all three views aligned to the same center line and scaled identically, every detail of the design must be IDENTICAL across all three views — same proportions same ornamentation same material indications same wear patterns, callout lines with measurements and material notes in the margins, blueprint aesthetic with dark blue background and white linework or white background with precise technical linework, professional game studio concept art department output, the design language consistent with fantasy RPG or sci-fi weapon depending on the reference, every rivet engraving and surface detail matching exactly across views",
  },
  {
    category: "video",
    label: "建筑立面与透视图",
    prompt: "professional architectural presentation board for a modern building design, the EXACT same building shown in three coordinated views: front elevation orthographic with exact proportions and window placements, a 3/4 perspective view from eye level showing the main entrance and facade materials, and a bird's eye axonometric view showing the roof design and site context, all three views of the SAME building with identical window counts door placements material choices and overall massing, consistent architectural style across all views, professional rendering with soft natural lighting and entourage elements like trees and people for scale, clean white background presentation board format, suitable for architectural animation establishing shots, photorealistic rendering of glass concrete and landscaping",
  },
  {
    category: "video",
    label: "角色服装设计正背面",
    prompt: "professional fashion costume design reference sheet for animation or film production, the SAME character wearing the EXACT same outfit shown in front view and back view side by side at equal scale, the outfit rendered in precise detail with all seams stitching patterns fabric folds and accessories visible, the character's body proportions and posture must be IDENTICAL in both views, the face and hairstyle consistent between front and back views, fabric swatches and color palette notes in the margin, professional animation costume design department output, the design suitable for a specific genre based on the reference image, even studio lighting on white or light gray background, every button zipper pocket and decorative element matching exactly between front and back, costume continuity essential for video production",
  },
  {
    category: "video",
    label: "场景多角度定场镜头",
    prompt: "film production location scouting reference for a single environment shown from three cinematic camera angles: a wide establishing master shot showing the full environment and its context, a medium shot from a character's eye level at the main focal point, and a close-up detail shot of a key environmental storytelling element, all three shots of the EXACT same location at the same time of day with the same weather and lighting conditions, consistent color grading and atmosphere across all three views, the lighting direction and quality must match perfectly, professional film pre-production location reference photography, cinematic composition with rule of thirds and leading lines, the environment designed to serve as a key setting for a scene, photorealistic rendering with atmospheric depth, shot matching essential for video editing continuity",
  },
  {
    category: "video",
    label: "怪物/生物概念多视图",
    prompt: "professional creature design reference sheet for game or film production, the EXACT same fantasy creature or monster shown in side profile full body, front view, and a dynamic 3/4 action pose, all three views of the identical creature with PERFECT anatomical consistency — same number of limbs same scale same proportions same textures same coloration same distinctive features in every view, if the creature has horns spikes or unique markings they must match exactly across all views, anatomical study callouts in the margins noting scale and special features, professional creature design department output used by Weta Workshop or Industrial Light and Magic, the creature design original and biologically plausible within its fictional context, even lighting revealing all anatomical details, the creature identity preserved 100% across every view for VFX modeling reference",
  },
  {
    category: "video",
    label: "物品图标套装（统一风格）",
    prompt: "professional game UI item icon set, 12 different items arranged in a 4x3 grid, each item in its own square cell with consistent isometric or top-down perspective, all items sharing the EXACT same art style rendering technique lighting direction and level of detail, the items belonging to a coherent category — fantasy RPG potions weapons armor pieces or food ingredients based on the reference, each item clearly distinct from the others but visually unified through consistent style, clean cell borders between items, transparent or clean background for easy game engine integration, professional mobile game or RPG asset quality, the consistency of style across all 12 items is CRITICAL for them to read as a matching set, suitable for extracting individual frames for video game UI animation, crisp edges and vibrant colors optimized for small display sizes",
  },
  {
    category: "video",
    label: "角色多角度动态姿势",
    prompt: "dynamic character action pose reference sheet, the SAME single character shown in 4 different dynamic action poses arranged in a 2x2 grid: fighting stance, leaping through air, landing from height, and defensive crouch, the character identity ABSOLUTELY consistent across all 4 poses — same face same body proportions same costume same hair same distinctive features, only the pose and limb positions change, each pose showing full body with dynamic energy and clear silhouette, professional comic book or animation key frame reference, clean white background with slight motion lines indicating direction of movement in each pose, even studio lighting revealing all details, the poses designed to flow naturally from one to the next for animation sequence planning, suitable for video game character animation or cutscene production",
  },
];

/** 中→英 prompt 关键词映射 */
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
