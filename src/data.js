const GAME_DATA = {
  newspaper: {
    name: "雾津日报",
    en: "WUJIN DAILY",
    founded: 1912,
    city: "雾津市",
    slogan: "创刊 112 年"
  },

  dims: {
    credibility: "公信力",
    independence: "独立度",
    humanity: "人文关怀",
    business: "商业成功",
    influence: "影响力"
  },

  episodes: [
    // ==================== 第一期 ====================
    {
      id: "ep1",
      no: "第一期",
      title: "港口的第七天",
      day: "星期三",
      time: "08:00",
      intro: [
        "海峡另一端的两个国家发生武装冲突，重要航道暂时关闭。",
        "一艘载有粮食和医疗物资的商船已经在雾津港外停留七天。船东称运输受阻，商会警告物价即将上涨。码头工人担心停工，而一家救援组织称，船上部分医疗物资原本要送往冲突地区的医院。",
        "早上八点，你的三名记者带着不同的选题走进办公室。同时，报社最大的广告客户打来电话，要求不要将港口危机描述得过于严重。"
      ],
      steps: [
        {
          type: "topic",
          title: "议程设置 · 今天什么值得登上头版？",
          hint: "三条都真实，都有新闻价值。你选的那条，今天全城就只谈那一件事。",
          options: [
            {
              id: "t1",
              label: "《航道封锁第七天，雾津粮价面临上涨》",
              angle: "本地经济",
              sub: "本地经济影响 · 市场与民生",
              facts: ["已停靠第 7 天 · 商会警告物价上涨", "港口吞吐量下降 23%"],
              delta: { business: 6, influence: 5, humanity: -4, economic: 6 },
              bubble: { speaker: "何叔", text: "读者关心菜价。但远方那艘船上的药，可能就没人记得了。" }
            },
            {
              id: "t2",
              label: "《一船药品，仍在等待通往战区的航线》",
              angle: "人道主义",
              sub: "人道主义危机 · 国际视野",
              facts: ["船上载有粮食与医疗物资", "救援组织：部分物资原定送往战区医院"],
              delta: { humanity: 10, influence: 4, credibility: 3, business: -6, economic: -4, social: 6 },
              bubble: { speaker: "何叔", text: "这条有分量。但本地读者会不会觉得，这跟我们没关系？" }
            },
            {
              id: "t3",
              label: "《码头停工，三千工人的工资怎么办？》",
              angle: "社会民生",
              sub: "社会民生 · 劳工权益",
              facts: ["码头全面停工 · 三千人待业待薪", "船东与商会各执一词"],
              delta: { humanity: 8, independence: 3, influence: 5, business: -3, economic: -8 },
              bubble: { speaker: "何叔", text: "工人题材有温度，可商会那边，明天就要来电话了。" }
            }
          ]
        },
        {
          type: "frame",
          title: "新闻框架 · 同一件事，你准备怎样解释？",
          hint: "选择一个框架，意味着突出某些事实，也可能弱化另外一些事实。",
          options: [
            {
              id: "f1",
              name: "市场框架",
              question: "航道中断如何影响贸易与城市经济？",
              highlight: "供应链、物价数据、商会声明",
              downplay: "人道危机、个体苦难",
              delta: { credibility: 5, influence: 5, humanity: -6, economic: 8 },
              bubble: { speaker: "小周", text: "给我数据，我能让读者看清整条链条。" }
            },
            {
              id: "f2",
              name: "民生框架",
              question: "物价上涨会首先伤害哪些家庭？",
              highlight: "低收入家庭、菜市场价格、市民采访",
              downplay: "宏观数据、国际背景",
              delta: { humanity: 8, influence: 4, business: -2, economic: -6, social: 3 },
              bubble: { speaker: "阿美", text: "一条鱼涨了两块钱，对一个家庭意味着什么，这个才有人看。" }
            },
            {
              id: "f3",
              name: "责任框架",
              question: "政府与船运企业有没有提前采取应对措施？",
              highlight: "政策漏洞、企业责任、监管缺失",
              downplay: "市场规律、不可抗力",
              delta: { independence: 8, influence: 6, credibility: 2, business: -5, social: 5 },
              bubble: { speaker: "老陈", text: "禁航令是谁签的、什么时候签的，这个得问清楚。" }
            }
          ]
        },
        {
          type: "headline",
          title: "标题三版 · 同一篇稿，哪个标题见报？",
          hint: "三个标题写的是同一条新闻。差别在于，你愿意让读者记住什么。",
          options: [
            {
              id: "h1",
              label: "航道封锁第七天，雾津粮价面临上涨",
              style: "信息型",
              delta: { credibility: 9, influence: 2, business: -3 },
              bubble: { speaker: "何叔", text: "五个 W 齐全，谁、在哪、什么时候，读者一眼就明白。" }
            },
            {
              id: "h2",
              label: "一船药品，七天了，还在海上",
              style: "细节型",
              delta: { influence: 7, humanity: 7, credibility: -5 },
              bubble: { speaker: "阿美", text: "这个标题有人味。" }
            },
            {
              id: "h3",
              label: "谁让雾津人吃不上饭？",
              style: "追问型",
              delta: { influence: 10, business: 6, credibility: -9, humanity: -3 },
              bubble: { speaker: "林", text: "「谁」是谁？我们核过吗？标题里的指控，是要负责任的。" }
            }
          ]
        },
        {
          type: "reporter",
          title: "记者委派 · 谁去写这篇报道？",
          hint: "三位王牌，各有专长，也各有代价。",
          options: [
            {
              id: "r1", name: "小周", role: "数据记者",
              specialty: "粮价与运输统计，能把账算到每一户",
              delta: { credibility: 8, influence: 3, humanity: -5 },
              bubble: "给我数据，我能让读者看清真相。"
            },
            {
              id: "r2", name: "阿美", role: "情感叙事记者",
              specialty: "找得到具体的人，写得让人心里发酸",
              delta: { influence: 8, humanity: 6, business: 5, credibility: -6 },
              bubble: "没有温度的报道，谁会看？"
            },
            {
              id: "r3", name: "老陈", role: "调查记者",
              specialty: "追查航运公司背后的利益关系，费时、费钱",
              delta: { independence: 8, influence: 8, credibility: 3, cash: -15 },
              bubble: "独家需要代价，但值得。"
            }
          ]
        },
        {
          type: "pressure",
          title: "压力 · 商会来电",
          from: "雾津商会",
          role: "报社最大广告客户",
          content: "港口的事，别写得太吓人。物价这个东西，写得越狠，涨得越快。",
          options: [
            { id: "p1", label: "接受，调整措辞", delta: { cash: 25, independence: -12, economic: 6 } },
            { id: "p2", label: "拒绝", delta: { cash: -20, independence: 10, influence: 4 }, tag: "硬骨头" },
            { id: "p3", label: "要求对方提供可核查的依据", delta: { credibility: 8, independence: 4, cash: -5 } }
          ]
        },
        {
          type: "twist",
          title: "反转 · 一条来自港外的电报",
          content: "原本声称被全面封锁的航道，其实仍允许部分船只通行。船东向报社提供的「官方禁航文件」，目前无法核实。距离付印还有四十分钟。",
          options: [
            { id: "w1", label: "推迟印刷，核查信源", note: "准确性优先于时效性", delta: { credibility: 15, influence: -12, cash: -10 } },
            { id: "w2", label: "保留谨慎报道，明确标注消息源", note: "透明：让读者自己判断", delta: { credibility: 8, influence: 2, independence: 4 } },
            { id: "w3", label: "按原计划发布", note: "抢新闻的代价", delta: { influence: 14, credibility: -18, business: 8 } }
          ]
        }
      ]
    },

    // ==================== 第二期 ====================
    {
      id: "ep2",
      no: "第二期",
      title: "本报印刷厂停工了",
      day: "星期一",
      time: "07:40",
      intro: [
        "报社为了省钱，去年把夜班印刷外包给一家集团旗下的印务中心，只留下十二名老工人和那台 1970 年代的轮转机。",
        "工会要求加薪一成五，否则今晚夜班停印。而你是他们的老板，也是全城唯一会报道这件事的报纸。",
        "罢工的带头人，是跟了你父亲三十年的老师傅。"
      ],
      steps: [
        {
          type: "topic",
          title: "议程设置 · 今天的头版，写谁？",
          hint: "这一次，新闻当事人和新闻生产者是同一个人。",
          options: [
            {
              id: "t1",
              label: "《本报印刷厂工人投票决定停工：他们要求什么》",
              angle: "自我报道",
              delta: { credibility: 8, independence: 6, influence: 6, business: -8, social: 6 },
              bubble: { speaker: "何叔", text: "报纸报道自己的工厂，是应该的。但读者会盯着看，你是不是在替自己说话。" }
            },
            {
              id: "t2",
              label: "《雾津印刷业萎缩，十二个人的手艺正在消失》",
              angle: "产业变迁",
              delta: { humanity: 5, business: 4, influence: -4, independence: -4, social: 4 },
              bubble: { speaker: "周姨", text: "这样写，体面一些。" }
            },
            {
              id: "t3",
              label: "《如果明天没有〈雾津日报〉：一座城市的信息空白》",
              angle: "公共议题",
              delta: { influence: 8, business: 4, humanity: -7, independence: -6, social: 6 },
              bubble: { speaker: "老陈", text: "这个角度有力，但它把工人写成了威胁这座城市的人。" }
            }
          ]
        },
        {
          type: "frame",
          title: "新闻框架 · 这是一场劳资纠纷，还是一场经营危机？",
          hint: "同一件事，框架决定了读者该怪谁。",
          options: [
            {
              id: "f1",
              name: "劳资框架",
              question: "工资、工时、通胀——这十二个人为什么要求加薪？",
              highlight: "工人诉求、三十年工龄、实际购买力",
              downplay: "报社的亏损与纸张成本",
              delta: { humanity: 9, independence: 6, business: -8, economic: -10 },
              bubble: { speaker: "阿美", text: "写这个框架，就得顺带披露高管薪酬。而高管，就是你。" }
            },
            {
              id: "f2",
              name: "公共设施框架",
              question: "如果报纸停印，这座城市会失去什么？",
              highlight: "停印的公共代价、读者的知情权",
              downplay: "工人诉求本身的正当性",
              delta: { influence: 8, business: 3, humanity: -6, social: 8 },
              bubble: { speaker: "何叔", text: "这个框架安全，也很容易让读者站到我们这边。" }
            },
            {
              id: "f3",
              name: "经营框架",
              question: "纸价涨了三成，报社的钱还能撑多久？",
              highlight: "成本、外包、行业衰退",
              downplay: "劳动关系与人的处境",
              delta: { business: 8, credibility: 3, humanity: -8, economic: 10 },
              bubble: { speaker: "周姨", text: "把账摆出来，大家就都理解了。" }
            }
          ]
        },
        {
          type: "headline",
          title: "标题三版 · 见报的是哪一句？",
          hint: "同一篇稿子，三个标题，三个不同的责任人。",
          options: [
            {
              id: "h1",
              label: "本报十二名印刷工停工  要求加薪一成五",
              style: "信息型",
              delta: { credibility: 9, influence: 2, business: -3 },
              bubble: { speaker: "何叔", text: "五个 W 都在。虽然读者一看就知道，这是老板在写自己。" }
            },
            {
              id: "h2",
              label: "三十年老师傅：我把一辈子留在了那台机器上",
              style: "人物型",
              delta: { influence: 7, humanity: 7, credibility: -5 },
              bubble: { speaker: "阿美", text: "这个标题，会有人哭。" }
            },
            {
              id: "h3",
              label: "明天可能没有报纸",
              style: "悬念型",
              delta: { influence: 10, business: 6, credibility: -9, humanity: -3 },
              bubble: { speaker: "林", text: "谁让报纸没有了？主语省掉以后，读者会自己填空——通常填错。" }
            }
          ]
        },
        {
          type: "reporter",
          title: "记者委派 · 谁去写自己家的事？",
          hint: "老陈和工会的人一起喝过酒。这件事，你最好先知道。",
          options: [
            {
              id: "r1", name: "小周", role: "数据记者",
              specialty: "报社真实账本、外包合同里的异常条款",
              delta: { credibility: 7, independence: 5, influence: 2, humanity: -5 },
              bubble: "这份合同，数字不对劲。"
            },
            {
              id: "r2", name: "阿美", role: "情感叙事记者",
              specialty: "老师傅的手、那台机器、十二个人的家庭",
              delta: { humanity: 8, influence: 6, credibility: -6 },
              bubble: "他们不是在闹，他们是在害怕。"
            },
            {
              id: "r3", name: "老陈", role: "调查记者",
              specialty: "外包合同背后的集团，以及谁在从中获利",
              delta: { independence: 10, influence: 7, credibility: 2, cash: -18 },
              bubble: "我查下去，可能查出来的是我们自己。"
            }
          ]
        },
        {
          type: "pressure",
          title: "压力 · 广告部转来一张便条",
          from: "雾津最大的连锁商超",
          role: "季度投放占报社收入四成",
          content: "如果贵报刊登印刷厂停工的消息，我们下季度的投放，可能要重新考虑。",
          options: [
            { id: "p1", label: "照办，淡化处理", delta: { cash: 20, independence: -12, economic: 6 } },
            { id: "p2", label: "拒绝", delta: { cash: -18, independence: 8, influence: 3 } },
            { id: "p3", label: "反问：贵报的读者，也是工人", delta: { credibility: 5, cash: -8, independence: 3 } }
          ]
        },
        {
          type: "pressure",
          title: "压力 · 家族董事会的电话",
          from: "报社董事会（你的两位叔伯）",
          role: "家族股东",
          content: "家丑不可外扬。你要闹到全城都知道，印刷厂的工人是我们养着的吗？",
          options: [
            { id: "p1", label: "服从", delta: { cash: 12, independence: -10, economic: 6 } },
            { id: "p2", label: "顶住", delta: { independence: 8, business: -8, influence: 4 } },
            { id: "p3", label: "把董事会分歧本身写成报道", delta: { independence: 10, credibility: -3, influence: 6 } }
          ]
        },
        {
          type: "twist",
          title: "反转 · 老师傅的那份文件",
          content: "罢工前夜，老师傅私下找到你。你父亲当年为保住这台印刷机，向某家集团借过一笔钱，签了一份「优先印务」条款。外包不是经营不善，是一笔人情债。他愿意把文件交给你——条件是明天的头版上，不要出现他的名字。",
          options: [
            { id: "w1", label: "登报道，隐去他的姓名", note: "保护信源，但读者会问：为什么最关键的那个人是匿名的", delta: { credibility: 10, independence: 8, humanity: 8, influence: -8 } },
            { id: "w2", label: "登报道，公开姓名与文件", note: "最彻底，也最残忍：他会丢掉工作", delta: { influence: 14, credibility: 6, independence: 10, humanity: -14, cash: -10 } },
            { id: "w3", label: "不登，私下与工会谈条件", note: "报纸和工人都保住了，但这一次你选择了自我审查", delta: { cash: 15, business: 8, independence: -16, credibility: -8, influence: -10 } },
            { id: "w4", label: "把文件交给竞争对手", note: "自己干净了。可这份文件，会落在谁手里？", delta: { influence: 8, independence: -10, credibility: -4, business: 3 }, flag: "fileToRival" }
          ]
        }
      ]
    },

    // ==================== 第三期 ====================
    {
      id: "ep3",
      no: "第三期",
      title: "第三码头，二十七个人",
      day: "星期四",
      time: "08:10",
      intro: [
        "自九月起，第三码头有二十七名装卸工出现相似的呼吸道与神经系统症状，两人已无法工作。",
        "市卫生局称「与工作环境无关，属季节性流感并发症」。一名在港口诊所工作的医生匿名联系报社，说他上报的病例数被要求「重新归类」。",
        "你手上有一个随时可能撤回授权的信源、一份采样日期在三个月前的「初步报告」，和二十七个还在咳嗽的人。"
      ],
      steps: [
        {
          type: "topic",
          title: "议程设置 · 二十七个病人，写哪一个角度？",
          hint: "这一期，最难的读者不是官方，是那些不想被写出来的人。",
          options: [
            {
              id: "t1",
              label: "《第三码头二十七人同症：一次尚未命名的疾病》",
              angle: "公共卫生",
              delta: { credibility: 6, humanity: 6, influence: 5, business: -5 },
              bubble: { speaker: "林", text: "「同症」是我们能确认的。「同一种病」，还不是。" }
            },
            {
              id: "t2",
              label: "《谁在删掉这些病历？》",
              angle: "权力监督",
              delta: { independence: 8, influence: 8, credibility: -4, business: -6, social: 6 },
              bubble: { speaker: "老陈", text: "这个问题问得好。但我们只有一个信源，撑不起一个指控。" }
            },
            {
              id: "t3",
              label: "《如果码头停摆，雾津的冬天怎么过》",
              angle: "城市生计",
              delta: { business: 7, influence: 6, humanity: -8, economic: 6 },
              bubble: { speaker: "周姨", text: "供暖的煤还在船上。这个角度，是替全城人问的。" }
            }
          ]
        },
        {
          type: "frame",
          title: "新闻框架 · 这是一场疾病，一次隐瞒，还是一场停摆？",
          hint: "你选的框架，决定了读者先同情谁。",
          options: [
            {
              id: "f1",
              name: "公共卫生框架",
              question: "这些症状从哪里来，会不会扩散？",
              highlight: "病例分布、症状、可能的暴露源",
              downplay: "信息是否被压制、谁该负责",
              delta: { credibility: 8, humanity: 5, influence: 3, business: -4 },
              bubble: { speaker: "小周", text: "按作业班次、货种、风向排一遍，能看出点东西。" }
            },
            {
              id: "f2",
              name: "权力监督框架",
              question: "谁要求把病例「重新归类」？",
              highlight: "上报流程异常、信息压制、责任链",
              downplay: "「尚未确诊」这一事实",
              delta: { independence: 10, influence: 8, credibility: -6, business: -6, social: 10 },
              bubble: { speaker: "何叔", text: "这个框架会有人叫好，也会有人说你在造谣。你要确定，手里的东西够。" }
            },
            {
              id: "f3",
              name: "城市生计框架",
              question: "如果码头停下来，这个冬天怎么办？",
              highlight: "供暖煤、粮食、渔获的连锁反应",
              downplay: "病人的具体面孔",
              delta: { business: 8, influence: 5, humanity: -9, economic: 8, social: -6 },
              bubble: { speaker: "周姨", text: "这才是头版该有的分量。" }
            }
          ]
        },
        {
          type: "headline",
          title: "标题三版 · 三个标题，三种立场",
          hint: "标题是最短的社论。",
          options: [
            {
              id: "h1",
              label: "第三码头二十七名工人出现同种症状  卫生局称与工作环境无关",
              style: "并列型",
              delta: { credibility: 9, influence: 1 },
              bubble: { speaker: "何叔", text: "两个说法并列，谁也没被冤枉。就是……可能没人愿意点开。" }
            },
            {
              id: "h2",
              label: "「我们把名字报上去了，然后名单就变短了」",
              style: "引语型",
              delta: { influence: 7, humanity: 8, credibility: -6 },
              bubble: { speaker: "林", text: "用一句匿名的话做标题。读者会记住，但这句话我们核不了。" }
            },
            {
              id: "h3",
              label: "雾津的冬天，可能等不来那批煤",
              style: "后果型",
              delta: { influence: 9, business: 5, humanity: -9 },
              bubble: { speaker: "阿美", text: "那二十七个人，变成「那批煤」后面的背景了。" }
            }
          ]
        },
        {
          type: "reporter",
          title: "记者委派 · 谁去查这二十七个病例？",
          hint: "这一期，时间就是风险。",
          options: [
            {
              id: "r1", name: "小周", role: "数据记者",
              specialty: "病例地理分布、作业记录、风向与货种",
              delta: { credibility: 9, influence: 4, humanity: -4 },
              bubble: "给我三天，我能画出一张图。"
            },
            {
              id: "r2", name: "阿美", role: "情感叙事记者",
              specialty: "病人和他们的家庭",
              delta: { humanity: 9, influence: 7, credibility: -7 },
              bubble: "有个人咳了四个月，他女儿还在等他下班。"
            },
            {
              id: "r3", name: "老陈", role: "调查记者",
              specialty: "卫生局与港务集团之间的往来",
              delta: { independence: 9, influence: 6, credibility: -3, cash: -20 },
              bubble: "他们的会议记录，不会自己长脚跑掉。"
            }
          ]
        },
        {
          type: "pressure",
          title: "压力 · 港务集团的法务电话",
          from: "雾津港务集团",
          role: "本期最大广告主",
          content: "在确诊之前，任何报道都是对雾津经济的伤害。我们希望贵报慎重。",
          options: [
            { id: "p1", label: "淡化处理", delta: { cash: 25, independence: -14, humanity: -8, economic: 8 } },
            { id: "p2", label: "硬顶，照原样发", delta: { cash: -25, independence: 12, influence: 5 } },
            { id: "p3", label: "照登，同时在同一版刊登集团声明", delta: { credibility: 8, cash: -12, independence: 4 } }
          ]
        },
        {
          type: "pressure",
          title: "压力 · 卫生局的「合作」",
          from: "市卫生局新闻科",
          role: "官方信源",
          content: "我们可以把完整的检测数据给你，独家。条件是，发稿前让我们看一眼。",
          options: [
            { id: "p1", label: "接受", delta: { influence: 14, independence: -18, credibility: -6 } },
            { id: "p2", label: "拒绝", delta: { independence: 10, influence: -4 } },
            { id: "p3", label: "反提：数据同时公开，我们同步发", delta: { credibility: 9, influence: 6, independence: 4 } }
          ]
        },
        {
          type: "pressure",
          title: "压力 · 一位家属在楼下等你",
          from: "码头工人老吴的妻子",
          role: "报道对象家属",
          content: "求你别写我丈夫的名字。他还要回去上班，孩子还在上学。",
          options: [
            { id: "p1", label: "隐去姓名", delta: { humanity: 10, influence: -4 } },
            { id: "p2", label: "使用全名", delta: { influence: 6, humanity: -12 } },
            { id: "p3", label: "只写群体，不写个人", delta: { humanity: 2, influence: -2 } }
          ]
        },
        {
          type: "twist",
          title: "反转 · 撤回的信源，与一份旧报告",
          content: "付印前，匿名医生撤回授权：「如果被发现，我的执照就没了。」同一时间，卫生局送来一份「初步检测报告」，结论是未发现共同暴露源——但采样日期是三个月前，采样点只有两个。",
          options: [
            { id: "w1", label: "只写已确认的事实，疑点用问句呈现", note: "每个字都站得住；但可能被读成「什么都没说」", delta: { credibility: 12, influence: 3, humanity: 2 } },
            { id: "w2", label: "以匿名医生为核心信源，隐去可识别细节", note: "最有力量，也最脆弱", delta: { influence: 13, independence: 8, credibility: -10 } },
            { id: "w3", label: "压一天，去拿第二个信源", note: "处方记录、殡葬数据、工人自述", delta: { credibility: 14, influence: -10, cash: -8 } },
            { id: "w4", label: "接受「先看稿」，换那份独家数据", note: "本期最贵的诱惑", delta: { influence: 12, independence: -16, credibility: -8, cash: 15 } }
          ]
        }
      ]
    }
  ]
};

window.GAME_DATA = GAME_DATA;
