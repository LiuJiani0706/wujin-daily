// ==================== 游戏状态 ====================
const gameState = {
  scores: { credibility: 50, independence: 50, humanity: 50, business: 50, influence: 50 },
  position: { economic: 0, social: 0 },
  cash: 80,
  tags: [],
  choiceLog: [],       // 每次选择的完整记录
  snapshots: [],       // 每期结束时的五维快照
  episodeChoices: [],  // 每期的关键选择（用于头版）
  flags: [],
  stopped: false       // 现金归零导致停印
};

const DIMS = ["credibility", "independence", "humanity", "business", "influence"];
const DIM_LABELS = {
  credibility: "公信力", independence: "独立度", humanity: "人文关怀",
  business: "商业成功", influence: "影响力"
};
const AXIS_LABELS = { economic: "经济轴", social: "社会轴" };

// 维度越界时，改说人话
const THRESHOLD_LINES = {
  "credibility-down": "林：我们能拿出来的，只剩一个信源了。",
  "credibility-up": "林：这一次，每个字都有出处。",
  "independence-down": "周姨：楼下那几位，今天又来了。",
  "independence-up": "老陈：他们打电话来的时候，我按了录音。",
  "humanity-down": "阿美：你昨天那条，没有一个人的名字。",
  "humanity-up": "阿美：读者来信里，有人问那个工人后来怎么样了。",
  "business-down": "周姨：印刷厂的工资，这个月还差一点。",
  "business-up": "周姨：广告部说，这个月不用愁了。",
  "influence-down": "何叔：今天报摊上，没人抬头。",
  "influence-up": "何叔：今天全城都在谈我们那条。"
};

const LOW_MARK = 40;
const HIGH_MARK = 70;
const crossed = {};

// ==================== 应用一次选择 ====================
function applyDelta(delta) {
  const items = [];
  let thresholdLine = null;

  DIMS.forEach(key => {
    if (delta[key] === undefined) return;
    const before = gameState.scores[key];
    const after = Math.max(0, Math.min(100, before + delta[key]));
    const applied = after - before;
    if (applied === 0) return;
    gameState.scores[key] = after;
    items.push({ key, label: DIM_LABELS[key], value: applied, type: "dim" });

    // 只在首次越界时，用一句台词替换数字
    if (before >= LOW_MARK && after < LOW_MARK && !crossed[key + "-down"]) {
      crossed[key + "-down"] = true;
      thresholdLine = THRESHOLD_LINES[key + "-down"];
    } else if (before <= HIGH_MARK && after > HIGH_MARK && !crossed[key + "-up"]) {
      crossed[key + "-up"] = true;
      thresholdLine = THRESHOLD_LINES[key + "-up"];
    }
  });

  if (delta.cash) {
    const before = gameState.cash;
    gameState.cash = Math.max(0, Math.min(120, gameState.cash + delta.cash));
    const applied = gameState.cash - before;
    if (applied !== 0) items.push({ key: "cash", label: "现金", value: applied, type: "cash" });
  }

  if (delta.economic) {
    const before = gameState.position.economic;
    gameState.position.economic = Math.max(-100, Math.min(100, before + delta.economic));
    const applied = gameState.position.economic - before;
    if (applied !== 0) items.push({ key: "economic", label: AXIS_LABELS.economic, value: applied, type: "axis" });
  }

  if (delta.social) {
    const before = gameState.position.social;
    gameState.position.social = Math.max(-100, Math.min(100, before + delta.social));
    const applied = gameState.position.social - before;
    if (applied !== 0) items.push({ key: "social", label: AXIS_LABELS.social, value: applied, type: "axis" });
  }

  // 最多显示四项，取绝对值最大的
  let shown = items;
  if (items.length > 4) {
    shown = items.slice().sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 4);
  }

  return { items, shown, thresholdLine };
}

// ==================== 记录选择 ====================
function logChoice(episode, step, option, result) {
  gameState.choiceLog.push({
    episode: episode.no,
    episodeTitle: episode.title,
    stepType: step.type,
    stepTitle: step.title,
    label: option.label || option.name,
    note: option.note || "",
    toast: result.shown.map(i => `${i.label} ${i.value > 0 ? "+" : "−"}${Math.abs(i.value)}`).join(" · "),
    thresholdLine: result.thresholdLine
  });
  if (option.tag && !gameState.tags.includes(option.tag)) gameState.tags.push(option.tag);
  if (option.flag && !gameState.flags.includes(option.flag)) gameState.flags.push(option.flag);
}

function snapshotEpisode(episode) {
  gameState.snapshots.push({
    no: episode.no,
    title: episode.title,
    scores: { ...gameState.scores },
    cash: gameState.cash,
    position: { ...gameState.position }
  });
}

// ==================== 报格 ====================
function getNewspaperTitle() {
  const { economic, social } = gameState.position;
  const { business, credibility } = gameState.scores;

  if (business >= 75 && credibility <= 30) {
    return { title: "街头小报", description: "销量惊人，但没人再把你当严肃新闻。你的报纸在报摊上最显眼，在图书馆里最容易被撕掉。" };
  }
  if (Math.abs(economic) < 20 && Math.abs(social) < 20) {
    return { title: "地方良心", description: "平衡型媒体。你没有站到任何一边，代价是，也没有人把你当成谁的武器。" };
  }
  if (economic < 0 && social < 0) {
    return { title: "建制喉舌", description: "国家主义左派。你相信秩序，也相信集体；批评者说，你替权力说话说得太顺了。" };
  }
  if (economic > 0 && social < 0) {
    return { title: "商界传声", description: "保守主义右派。你相信效率与传统；批评者说，你的头版读起来像一份招商手册。" };
  }
  if (economic < 0 && social > 0) {
    return { title: "民间号角", description: "进步主义左派。你替被忽略的人说话；批评者说，你有时先站队，再核实。" };
  }
  return { title: "自由瞭望", description: "自由主义右派。你相信市场，也相信个人；批评者说，你高估了自由的成本承受力。" };
}

function getHistoricalVerdict() {
  const title = getNewspaperTitle().title;
  const verdicts = {
    "街头小报": "三十年后，历史学家在故纸堆里翻到你的头版，摇摇头：「这是那个年代最好的注脚——所有重要的事，都被写成了不重要的样子。」",
    "地方良心": "三十年后，雾津的老人还记得你的报纸：「那时候，有一份真正把我们当回事的报纸。」",
    "建制喉舌": "三十年后，历史学家引用你的头版，作为那个时代官方叙事的典型样本。引用时，他们不加任何评论。",
    "商界传声": "三十年后，经济史学者频繁引用你的报道：「这是了解当时商业氛围最完整的一手材料。」",
    "民间号角": "三十年后，社会运动史学者把你的报纸列为研究底层处境的重要文献。有一页被翻得最烂，是第二期。",
    "自由瞭望": "三十年后，你的头版被收入新闻自由陈列馆。说明牌上写着：「在那个年代，仍然有人坚持自己核实。」"
  };
  return verdicts[title] || "三十年后，你的报纸成了那个时代的一个缩影。";
}

// ==================== 评分档位 ====================
const TIERS = [
  { min: 90, text: "业界标杆" },
  { min: 70, text: "值得信赖" },
  { min: 50, text: "中规中矩" },
  { min: 30, text: "争议频发" },
  { min: 0,  text: "几近失守" }
];
const TIER_WORDS = {
  credibility: ["业界标杆", "值得信赖", "中规中矩", "争议频发", "标题党"],
  independence: ["完全独立", "基本独立", "平衡各方", "明显倾向", "完全依附"],
  humanity: ["弱者之声", "关注民生", "平衡报道", "精英视角", "冷酷无情"],
  business: ["盈利丰厚", "稳健经营", "收支平衡", "资金紧张", "濒临破产"],
  influence: ["议程设置者", "区域标杆", "本地知名", "影响力有限", "无人问津"]
};
function getScoreTier(key) {
  const v = gameState.scores[key];
  const idx = TIERS.findIndex(t => v >= t.min);
  return TIER_WORDS[key][idx];
}

// ==================== 结尾：三个月后的数字 ====================
function computeEpilogue() {
  let cases = 27;
  const f = gameState.flags;
  const log = gameState.choiceLog;

  const last = (epNo) => {
    const items = log.filter(c => c.episode === epNo);
    return items.length ? items[items.length - 1] : null;
  };

  const ep1 = last("第一期");
  const ep2 = last("第二期");
  const ep3 = last("第三期");

  if (ep1) {
    if (ep1.label.includes("按原计划发布")) cases += 7;
    if (ep1.label.includes("推迟印刷")) cases -= 3;
  }
  if (ep2) {
    if (ep2.label.includes("不登")) cases += 5;
    if (ep2.label.includes("竞争对手")) cases += 4;
  }
  if (ep3) {
    if (ep3.label.includes("匿名医生")) cases += 9;
    else if (ep3.label.includes("先看稿")) cases += 11;
    else if (ep3.label.includes("只写已确认")) cases += 6;
    else if (ep3.label.includes("压一天")) cases += 4;
  }
  if (f.includes("fileToRival")) cases += 2;

  cases = Math.max(27, cases);
  return {
    cases,
    delta: cases - 27,
    recovered: gameState.scores.credibility >= 60 ? "半年后，卫生局公布了第二轮检测结果。你的报道被引用了两次。" : "半年后，那份报告被归档，再没有人提起。"
  };
}

window.gameState = gameState;
window.DIM_LABELS = DIM_LABELS;
window.applyDelta = applyDelta;
window.logChoice = logChoice;
window.snapshotEpisode = snapshotEpisode;
window.getNewspaperTitle = getNewspaperTitle;
window.getHistoricalVerdict = getHistoricalVerdict;
window.getScoreTier = getScoreTier;
window.computeEpilogue = computeEpilogue;
