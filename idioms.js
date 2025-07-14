// 成语数据库
const IDIOMS_DATABASE = [
    // 简单成语 (30个)
    { idiom: '春暖花开', pinyin: 'chūn nuǎn huā kāi', meaning: '春天气候温暖，百花盛开，景色优美', difficulty: 'easy', story: '出自明·朱国祯《涌幢小品·南内》："春暖花开，命中贵戚及近侍官员，于西苑马射。"形容春天美好的景象，也比喻大好时机。' },
    { idiom: '万事如意', pinyin: 'wàn shì rú yì', meaning: '一切事情都符合心意，很顺利', difficulty: 'easy', story: '这是一句吉祥话，常用于祝福他人。表达了人们对美好生活的向往和祝愿，希望一切事情都能按照自己的心意发展。' },
    { idiom: '心想事成', pinyin: 'xīn xiǎng shì chéng', meaning: '心里想要做的事情都能成功', difficulty: 'easy', story: '这是一个美好的祝愿成语，表达了人们希望心中的愿望都能实现的美好期盼。常用于新年祝福和各种庆祝场合。' },
    { idiom: '一帆风顺', pinyin: 'yī fān fēng shùn', meaning: '船挂着满帆顺风行驶，比喻非常顺利', difficulty: 'easy', story: '出自唐·孟郊《送崔爽之湖南》："定知一日帆，使得千里风。"原指船只航行时风向正好，后比喻能够毫无阻碍地胜利工作。' },
    { idiom: '龙马精神', pinyin: 'lóng mǎ jīng shén', meaning: '形容健旺的精神', difficulty: 'easy', story: '龙马是古代传说中的神兽，形状像马而有龙鳞，能够日行千里。比喻人精神旺盛，充满活力。' },
    { idiom: '金玉满堂', pinyin: 'jīn yù mǎn táng', meaning: '金银珠宝满堂，形容财富极多', difficulty: 'easy' },
    { idiom: '花好月圆', pinyin: 'huā hǎo yuè yuán', meaning: '花儿正盛开，月亮正圆满，比喻美好圆满', difficulty: 'easy' },
    { idiom: '年年有余', pinyin: 'nián nián yǒu yú', meaning: '每年都有剩余，生活富裕', difficulty: 'easy' },
    { idiom: '步步高升', pinyin: 'bù bù gāo shēng', meaning: '步步上升，职位不断提高', difficulty: 'easy' },
    { idiom: '财源广进', pinyin: 'cái yuán guǎng jìn', meaning: '财富的来源很多', difficulty: 'easy' },
    { idiom: '五福临门', pinyin: 'wǔ fú lín mén', meaning: '五种福气同时降临', difficulty: 'easy' },
    { idiom: '六六大顺', pinyin: 'liù liù dà shùn', meaning: '祝愿一切顺利', difficulty: 'easy' },
    { idiom: '七星高照', pinyin: 'qī xīng gāo zhào', meaning: '七颗星高高照耀，比喻人很幸运', difficulty: 'easy' },
    { idiom: '八方来财', pinyin: 'bā fāng lái cái', meaning: '四面八方，财源滚滚', difficulty: 'easy' },
    { idiom: '九九归一', pinyin: 'jiǔ jiǔ guī yī', meaning: '归根到底', difficulty: 'easy' },
    { idiom: '十全十美', pinyin: 'shí quán shí měi', meaning: '十分完美，毫无欠缺', difficulty: 'easy' },
    { idiom: '百花齐放', pinyin: 'bǎi huā qí fàng', meaning: '形容百花盛开，丰富多彩', difficulty: 'easy' },
    { idiom: '千里之行', pinyin: 'qiān lǐ zhī xíng', meaning: '千里的路程从第一步开始', difficulty: 'easy' },
    { idiom: '万紫千红', pinyin: 'wàn zǐ qiān hóng', meaning: '形容百花齐放，色彩繁多', difficulty: 'easy' },
    { idiom: '鸟语花香', pinyin: 'niǎo yǔ huā xiāng', meaning: '鸟叫得好听，花开得喷香，形容春天的美好景象', difficulty: 'easy' },
    { idiom: '风和日丽', pinyin: 'fēng hé rì lì', meaning: '和风习习，阳光灿烂，形容晴朗暖和的天气', difficulty: 'easy' },
    { idiom: '山清水秀', pinyin: 'shān qīng shuǐ xiù', meaning: '形容风景优美', difficulty: 'easy' },
    { idiom: '国泰民安', pinyin: 'guó tài mín ān', meaning: '国家太平，人民安乐', difficulty: 'easy' },
    { idiom: '家和万事', pinyin: 'jiā hé wàn shì', meaning: '家庭和睦，什么事都能兴旺', difficulty: 'easy' },
    { idiom: '笑口常开', pinyin: 'xiào kǒu cháng kāi', meaning: '经常笑，心情愉快', difficulty: 'easy' },
    { idiom: '健康长寿', pinyin: 'jiàn kāng cháng shòu', meaning: '身体健康，寿命长久', difficulty: 'easy' },
    { idiom: '学业有成', pinyin: 'xué yè yǒu chéng', meaning: '学习取得成就', difficulty: 'easy' },
    { idiom: '工作顺利', pinyin: 'gōng zuò shùn lì', meaning: '工作进展顺畅', difficulty: 'easy' },
    { idiom: '前程似锦', pinyin: 'qián chéng sì jǐn', meaning: '前途像锦绣那样美好', difficulty: 'easy' },
    { idiom: '大展宏图', pinyin: 'dà zhǎn hóng tú', meaning: '比喻宏伟远大的谋略与计划', difficulty: 'easy' },
    
    // 中等成语 (30个)
    { idiom: '画龙点睛', pinyin: 'huà lóng diǎn jīng', meaning: '比喻作文或讲话时在关键地方加上精辟语句，使内容更加生动有力', difficulty: 'medium' },
    { idiom: '守株待兔', pinyin: 'shǒu zhū dài tù', meaning: '比喻不主动努力，而存万一的侥幸心理，希望得到意外的收获', difficulty: 'medium' },
    { idiom: '亡羊补牢', pinyin: 'wáng yáng bǔ láo', meaning: '羊逃跑了再去修补羊圈，还不算晚，比喻出了问题以后想办法补救', difficulty: 'medium' },
    { idiom: '刻舟求剑', pinyin: 'kè zhōu qiú jiàn', meaning: '比喻不懂事物已发展变化而仍静止地看问题', difficulty: 'medium' },
    { idiom: '掩耳盗铃', pinyin: 'yǎn ěr dào líng', meaning: '偷铃铛怕别人听见而捂住自己的耳朵，比喻自己欺骗自己', difficulty: 'medium' },
    { idiom: '杯弓蛇影', pinyin: 'bēi gōng shé yǐng', meaning: '将映在酒杯里的弓影误认为蛇，比喻因疑神疑鬼而引起恐惧', difficulty: 'medium' },
    { idiom: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', meaning: '井底的蛙只能看到井口那么大的一块天，比喻见识狭窄的人', difficulty: 'medium' },
    { idiom: '狐假虎威', pinyin: 'hú jiǎ hǔ wēi', meaning: '狐狸假借老虎的威势，比喻依仗别人的势力欺压人', difficulty: 'medium' },
    { idiom: '叶公好龙', pinyin: 'yè gōng hào lóng', meaning: '比喻口头上说爱好某事物，实际上并不真爱好', difficulty: 'medium' },
    { idiom: '塞翁失马', pinyin: 'sài wēng shī mǎ', meaning: '比喻一时虽然受到损失，也许反而因此能得到好处', difficulty: 'medium' },
    { idiom: '买椟还珠', pinyin: 'mǎi dú huán zhū', meaning: '买下木匣，退还了珍珠，比喻没有眼力，取舍不当', difficulty: 'medium' },
    { idiom: '南辕北辙', pinyin: 'nán yuán běi zhé', meaning: '想往南而车子却向北行，比喻行动和目的正好相反', difficulty: 'medium' },
    { idiom: '画蛇添足', pinyin: 'huà shé tiān zú', meaning: '画蛇时给蛇添上脚，比喻做了多余的事，非但无益，反而不合适', difficulty: 'medium' },
    { idiom: '滥竽充数', pinyin: 'làn yú chōng shù', meaning: '比喻无本领的冒充有本领，次货冒充好货', difficulty: 'medium' },
    { idiom: '邯郸学步', pinyin: 'hán dān xué bù', meaning: '比喻模仿人不到家，反把原来自己会的东西忘了', difficulty: 'medium' },
    { idiom: '东施效颦', pinyin: 'dōng shī xiào pín', meaning: '比喻模仿别人，不但模仿不好，反而出丑', difficulty: 'medium' },
    { idiom: '班门弄斧', pinyin: 'bān mén nòng fǔ', meaning: '在鲁班门前舞弄斧子，比喻在行家面前卖弄本领', difficulty: 'medium' },
    { idiom: '对牛弹琴', pinyin: 'duì niú tán qín', meaning: '比喻说话不看对象，或对愚蠢的人讲深奥的道理', difficulty: 'medium' },
    { idiom: '盲人摸象', pinyin: 'máng rén mō xiàng', meaning: '比喻对事物只凭片面的了解或局部的经验，就乱加猜测，想做出全面的判断', difficulty: 'medium' },
    { idiom: '坐井观天', pinyin: 'zuò jǐng guān tiān', meaning: '坐在井底看天，比喻眼界小，见识少', difficulty: 'medium' },
    { idiom: '一叶障目', pinyin: 'yī yè zhàng mù', meaning: '眼睛被一片树叶挡住，不能看到泰山，比喻被局部现象所迷惑', difficulty: 'medium' },
    { idiom: '管中窥豹', pinyin: 'guǎn zhōng kuī bào', meaning: '从竹管的小孔里看豹，只看到豹身上的一块斑纹，比喻只看到事物的一部分', difficulty: 'medium' },
    { idiom: '夜郎自大', pinyin: 'yè láng zì dà', meaning: '夜郎国的国王以为自己的国家很大，比喻人无知而又狂妄自大', difficulty: 'medium' },
    { idiom: '纸上谈兵', pinyin: 'zhǐ shàng tán bīng', meaning: '在纸面上谈论打仗，比喻空谈理论，不能解决实际问题', difficulty: 'medium' },
    { idiom: '空中楼阁', pinyin: 'kōng zhōng lóu gé', meaning: '悬在半空中的阁楼，比喻虚幻的事物或脱离实际的空想', difficulty: 'medium' },
    { idiom: '海市蜃楼', pinyin: 'hǎi shì shèn lóu', meaning: '比喻虚幻不实的事物', difficulty: 'medium' },
    { idiom: '昙花一现', pinyin: 'tán huā yī xiàn', meaning: '昙花开放后很快就凋谢，比喻美好的事物或景象出现了一下，很快就消失', difficulty: 'medium' },
    { idiom: '过眼云烟', pinyin: 'guò yǎn yún yān', meaning: '从眼前飘过的云烟，比喻很快就消失的事物', difficulty: 'medium' },
    { idiom: '白驹过隙', pinyin: 'bái jū guò xì', meaning: '白色骏马在细小的缝隙前跑过一样，形容时间过得极快', difficulty: 'medium' },
    { idiom: '光阴似箭', pinyin: 'guāng yīn sì jiàn', meaning: '时间的流逝像射出的箭一样快，形容时间过得极快', difficulty: 'medium' },
    
    // 困难成语 (30个)
    { idiom: '鞠躬尽瘁', pinyin: 'jū gōng jìn cuì', meaning: '指勤勤恳恳，竭尽心力', difficulty: 'hard' },
    { idiom: '卧薪尝胆', pinyin: 'wò xīn cháng dǎn', meaning: '形容人刻苦自励，发奋图强', difficulty: 'hard' },
    { idiom: '破釜沉舟', pinyin: 'pò fǔ chén zhōu', meaning: '比喻下决心不顾一切地干到底', difficulty: 'hard' },
    { idiom: '背水一战', pinyin: 'bèi shuǐ yī zhàn', meaning: '比喻在艰难情况下跟敌人决一死战', difficulty: 'hard' },
    { idiom: '闻鸡起舞', pinyin: 'wén jī qǐ wǔ', meaning: '听到鸡叫就起来舞剑，后比喻有志报国的人及时奋起', difficulty: 'hard' },
    { idiom: '悬梁刺股', pinyin: 'xuán liáng cì gǔ', meaning: '形容刻苦学习', difficulty: 'hard' },
    { idiom: '凿壁偷光', pinyin: 'záo bì tōu guāng', meaning: '原指西汉匡衡凿穿墙壁引邻舍之烛光读书，后用来形容家贫而读书刻苦', difficulty: 'hard' },
    { idiom: '囊萤映雪', pinyin: 'náng yíng yìng xuě', meaning: '原是车胤用口袋装萤火虫来照书本，孙康利用雪的反光勤奋苦学的故事', difficulty: 'hard' },
    { idiom: '程门立雪', pinyin: 'chéng mén lì xuě', meaning: '旧指学生恭敬受教，现指尊敬师长', difficulty: 'hard' },
    { idiom: '韦编三绝', pinyin: 'wéi biān sān jué', meaning: '孔丘为读《易》而翻断了多次牛皮带子的简，编连竹简的皮绳断了三次，比喻读书勤奋', difficulty: 'hard' },
    { idiom: '三顾茅庐', pinyin: 'sān gù máo lú', meaning: '原为汉末刘备访聘诸葛亮的故事，比喻真心诚意，一再邀请', difficulty: 'hard' },
    { idiom: '毛遂自荐', pinyin: 'máo suì zì jiàn', meaning: '毛遂自我推荐，比喻自告奋勇，自己推荐自己担任某项工作', difficulty: 'hard' },
    { idiom: '完璧归赵', pinyin: 'wán bì guī zhào', meaning: '本指蔺相如将和氏璧完好地自秦送回赵国，后比喻把原物完好地归还本人', difficulty: 'hard' },
    { idiom: '负荆请罪', pinyin: 'fù jīng qǐng zuì', meaning: '背着荆条向对方请罪，表示向人认错赔罪', difficulty: 'hard' },
    { idiom: '指鹿为马', pinyin: 'zhǐ lù wéi mǎ', meaning: '指着鹿，说是马，比喻故意颠倒黑白，混淆是非', difficulty: 'hard' },
    { idiom: '望梅止渴', pinyin: 'wàng méi zhǐ kě', meaning: '原意是梅子酸，人想吃梅子就会流涎，因而止渴，后比喻愿望无法实现，用空想安慰自己', difficulty: 'hard' },
    { idiom: '画饼充饥', pinyin: 'huà bǐng chōng jī', meaning: '画个饼来解除饥饿，比喻用空想来安慰自己', difficulty: 'hard' },
    { idiom: '望洋兴叹', pinyin: 'wàng yáng xīng tàn', meaning: '望着大海而兴叹，原指在伟大事物面前感叹自己的渺小，现多比喻做事时因力不胜任或没有条件而感到无可奈何', difficulty: 'hard' },
    { idiom: '杞人忧天', pinyin: 'qǐ rén yōu tiān', meaning: '杞国有个人怕天塌下来，比喻不必要的或缺乏根据的忧虑和担心', difficulty: 'hard' },
    { idiom: '庸人自扰', pinyin: 'yōng rén zì rǎo', meaning: '指本来没有问题而自己瞎着急或自找麻烦', difficulty: 'hard' },
    { idiom: '杯水车薪', pinyin: 'bēi shuǐ chē xīn', meaning: '用一杯水去救一车着了火的柴草，比喻力量太小，解决不了问题', difficulty: 'hard' },
    { idiom: '螳臂当车', pinyin: 'táng bì dāng chē', meaning: '当螂举起前肢企图阻挡车子前进，比喻做力量做不到的事情，必然失败', difficulty: 'hard' },
    { idiom: '蚍蜉撼树', pinyin: 'pí fú hàn shù', meaning: '蚂蚁想摇动大树，比喻自不量力', difficulty: 'hard' },
    { idiom: '以卵击石', pinyin: 'yǐ luǎn jī shí', meaning: '拿蛋去碰石头，比喻不估计自己的力量，自取灭亡', difficulty: 'hard' },
    { idiom: '自不量力', pinyin: 'zì bù liàng lì', meaning: '自己不估量自己的能力，指过高地估计自己的实力', difficulty: 'hard' },
    { idiom: '献丑不如藏拙', pinyin: 'xiàn chǒu bù rú cáng zhuō', meaning: '与其显露自己的不足，不如隐藏自己的笨拙', difficulty: 'hard' },
    { idiom: '知难而退', pinyin: 'zhī nán ér tuì', meaning: '知道事情困难就后退，比喻知道事情困难就退缩不前', difficulty: 'hard' },
    { idiom: '知难而进', pinyin: 'zhī nán ér jìn', meaning: '迎着困难上，指明知困难而勇于进取', difficulty: 'hard' },
    { idiom: '迎难而上', pinyin: 'yíng nán ér shàng', meaning: '就算遇到困难也不退缩，迎着困难去克服它', difficulty: 'hard' },
    { idiom: '风调雨顺', pinyin: 'fēng tiáo yǔ shùn', meaning: '风雨及时适宜，形容风雨适合农时', difficulty: 'hard' }
];

// 干扰字符数据库（同音字、谐音字、形近字）
const DISTRACTION_CHARS = {
    "意": ["义", "艺", "易", "议", "益"],
    "事": ["是", "世", "势", "试", "室"],
    "万": ["方", "万", "玩", "完", "晚"],
    "心": ["新", "辛", "欣", "信", "星"],
    "想": ["相", "响", "向", "象", "像"],
    "成": ["城", "诚", "程", "承", "称"],
    "一": ["乙", "已", "以", "义", "衣"],
    "帆": ["凡", "反", "返", "犯", "范"],
    "风": ["封", "疯", "峰", "锋", "丰"],
    "顺": ["瞬", "舜", "润", "闰", "训"],
    "龙": ["隆", "笼", "聋", "拢", "垄"],
    "马": ["妈", "码", "骂", "麻", "玛"],
    "精": ["京", "经", "惊", "晶", "睛"],
    "神": ["申", "身", "深", "伸", "绅"],
    "虎": ["户", "护", "互", "怖", "布"],
    "生": ["声", "升", "胜", "圣", "省"],
    "威": ["为", "围", "维", "违", "微"],
    "鸟": ["岛", "倒", "导", "到", "道"],
    "语": ["雨", "与", "予", "余", "鱼"],
    "花": ["华", "化", "话", "画", "划"],
    "香": ["乡", "相", "想", "响", "向"],
    "春": ["纯", "唇", "蠢", "椿", "淳"],
    "暖": ["软", "缓", "援", "源", "原"],
    "开": ["凯", "楷", "慨", "概", "该"],
    "金": ["今", "津", "斤", "筋", "紧"],
    "玉": ["育", "欲", "浴", "域", "遇"],
    "满": ["慢", "漫", "曼", "蔓", "馒"],
    "堂": ["糖", "塘", "唐", "汤", "躺"],
    "年": ["念", "粘", "拈", "捻", "碾"],
    "有": ["友", "又", "右", "优", "由"],
    "余": ["鱼", "于", "与", "予", "语"],
    "步": ["布", "部", "补", "捕", "不"],
    "高": ["搞", "告", "膏", "糕", "羔"],
    "升": ["声", "生", "胜", "圣", "省"],
    "好": ["号", "豪", "毫", "浩", "耗"],
    "月": ["乐", "约", "跃", "越", "岳"],
    "圆": ["元", "园", "原", "源", "远"],
    "国": ["果", "过", "锅", "郭", "裹"],
    "泰": ["太", "态", "胎", "台", "抬"],
    "民": ["敏", "闽", "皿", "泯", "珉"],
    "安": ["按", "案", "岸", "暗", "鞍"],
    "调": ["条", "跳", "挑", "迢", "眺"],
    "雨": ["语", "与", "予", "余", "鱼"],
    "五": ["午", "伍", "武", "舞", "侮"],
    "谷": ["古", "股", "骨", "鼓", "故"],
    "丰": ["风", "封", "疯", "峰", "锋"],
    "登": ["等", "灯", "邓", "凳", "蹬"]
};

// 根据难度获取成语
function getIdiomsByDifficulty(difficulty) {
    return IDIOMS_DATABASE.filter(idiom => idiom.difficulty === difficulty);
}

// 获取随机成语
function getRandomIdiom(difficulty = null) {
    let availableIdioms = difficulty ? getIdiomsByDifficulty(difficulty) : IDIOMS_DATABASE;
    if (availableIdioms.length === 0) {
        // 如果指定难度没有成语，返回所有成语中的随机一个
        availableIdioms = IDIOMS_DATABASE;
    }
    if (availableIdioms.length === 0) {
        // 如果数据库为空，返回一个默认成语
        return { idiom: '万事如意', pinyin: 'wàn shì rú yì', meaning: '一切事情都符合心意，很顺利', difficulty: 'easy' };
    }
    return availableIdioms[Math.floor(Math.random() * availableIdioms.length)];
}

// 获取干扰字符
function getDistractionChars(targetChar, count = 3) {
    const distractions = DISTRACTION_CHARS[targetChar] || [];
    const shuffled = [...distractions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 创建成语谜题（有空缺的成语）
function createIdiomPuzzle(idiom) {
    const chars = idiom.idiom.split('');
    const missingIndex = Math.floor(Math.random() * chars.length);
    const missingChar = chars[missingIndex];
    
    // 创建显示数组，空缺位置用null表示
    const displayChars = [...chars];
    displayChars[missingIndex] = null;
    
    return {
        original: idiom,
        displayChars: displayChars,
        missingChar: missingChar,
        missingIndex: missingIndex,
        completed: false
    };
}