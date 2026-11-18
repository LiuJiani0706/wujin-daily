#!/usr/bin/env python3
"""把标题页 + 开场页 + 编辑部内页打包成一个离线单文件 HTML。

用法：python3 tools/build_offline.py
产物：项目根目录 / 雾津日报.html
"""
import base64
import io
import pathlib
import re

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "雾津日报.html"


def image_uri(path, max_width, quality=82):
    """压缩并按 MIME 内联为 data URI。"""
    im = Image.open(path)
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    if im.width > max_width:
        im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)

    buf = io.BytesIO()
    if has_alpha:
        im = im.convert("RGBA").quantize(colors=48, method=Image.FASTOCTREE)
        im.save(buf, "PNG", optimize=True)
        mime = "image/png"
    else:
        im.convert("RGB").save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
        mime = "image/jpeg"
    data = base64.b64encode(buf.getvalue()).decode()
    print(f"  {path.name:28s} {im.size[0]}x{im.size[1]}  {len(buf.getvalue()) / 1024:6.1f} KB")
    return f"data:{mime};base64,{data}"


def read(rel_path):
    return (ROOT / rel_path).read_text(encoding="utf-8")


def main():
    index_html = read("index.html")

    # ---- 标题页 / 弹层 ----
    start = index_html.index("<!-- ==================== 标题页")
    end = index_html.index("<!-- 预算 -->")
    title_block = index_html[start:end].strip()
    title_block = title_block.replace('onclick="startGame()"', 'onclick="enterEditorial()"')

    # ---- 内页舞台 + 结算页（最新版 proto）----
    proto_html = read("proto/index.html")
    stage_part, report_part = proto_html.split("<!-- ================= 终版")
    stage_block = re.search(r'<div id="stage">.*?\n</div>', stage_part, re.S).group(0)
    report_block = "<!-- ================= 终版" + report_part.split("\n<script")[0].rstrip()

    # ---- 标题页启动脚本（弹层、开场切换）----
    script_block = index_html.split("<script>", 1)[1]
    start = script_block.index("// ---------- 标题页 ----------")
    end = script_block.index("function startGame()")
    start_js = "const $ = id => document.getElementById(id);\n\n" + script_block[start:end].rstrip()

    # ---- 资源 ----
    print("内联资源：")
    office_uri = image_uri(ROOT / "game_assets/background/editorial_office.jpg", 1800, 76)
    panel_uri = image_uri(ROOT / "proto/assets/panel.jpg", 1400, 78)
    portrait_uri = image_uri(ROOT / "game_assets/portrait/boss_elderly.jpg", 1000, 78)
    logo_uri = image_uri(ROOT / "game_assets/masthead/logo_classic_trim.png", 1200)
    report_logo_uri = image_uri(ROOT / "proto/assets/report-logo.png", 900)
    cutout_uri = image_uri(ROOT / "proto/assets/portrait_cutout.png", 720)

    title_block = title_block.replace(
        "game_assets/masthead/logo_classic_trim.png", logo_uri
    ).replace(
        "game_assets/portrait/boss_elderly.jpg", portrait_uri
    )
    stage_block = stage_block.replace("assets/portrait.jpg", portrait_uri)
    report_block = report_block.replace("assets/report-logo.png", report_logo_uri)
    report_block = report_block.replace("assets/portrait_cutout.png", cutout_uri)

    # ---- CSS ----
    ui_css = read("proto/ui.css")
    ui_css = ui_css.replace("url(assets/office.jpg)", "var(--asset-office)")
    ui_css = ui_css.replace("url(assets/panel.jpg)", "var(--asset-panel)")

    report_css = read("proto/report.css")
    report_css = report_css.replace("url(assets/office.jpg)", "var(--asset-office)")
    report_css = report_css.replace("url(assets/panel.jpg)", "var(--asset-panel)")

    title_css = read("src/title.css")
    title_css = title_css.replace(
        'url("../game_assets/background/editorial_office.jpg")', "var(--asset-office)"
    )

    mobile_css = read("proto/mobile.css")

    extras_css = """
/* ===== 离线整合：点击开始后才进入内页 ===== */
#stage { display: none; }
"""

    # ---- JS ----
    data_js = read("src/data.js")
    engine_js = read("src/engine.js")
    report_js = read("proto/final-report.js")
    app_js = read("proto/app.js")
    app_js, replaced = re.subn(
        r"\n  init\(\);\n\}\)\(\);\n?$",
        "\n  window.__startInnerGame = init;\n})();\n",
        app_js,
    )
    if replaced != 1:
        raise SystemExit("app.js 入口替换失败，请检查文件结尾。")

    bridge_js = """
function enterEditorial() {
  const title = document.getElementById('titleScreen');
  title.classList.add('is-leaving');
  setTimeout(function () { title.style.display = 'none'; }, 700);
  document.getElementById('stage').style.display = 'block';
  window.dispatchEvent(new Event('resize'));
  if (window.__startInnerGame) window.__startInnerGame();
}
"""

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>雾津日报 · 报老板不好当</title>
<style>
:root {{
  --asset-office: url("{office_uri}");
  --asset-panel: url("{panel_uri}");
}}
{ui_css}
{report_css}
{title_css}
{mobile_css}
{extras_css}
</style>
</head>
<body>

{title_block}

{stage_block}

{report_block}

<script>
{data_js}
</script>
<script>
{engine_js}
</script>
<script>
{start_js}
{bridge_js}
</script>
<script>
{report_js}
</script>
<script>
{app_js}
</script>

<div id="rotateHint" aria-hidden="true">
  <svg class="rh-phone" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="22" y="10" width="20" height="44" rx="4"></rect>
    <line x1="28" y1="49" x2="36" y2="49"></line>
    <path d="M50 26a18 18 0 0 1 4 11"></path>
    <path d="M54 20v6h-6"></path>
  </svg>
  <div class="rh-rule"></div>
  <div class="rh-title">请把手机横过来</div>
  <div class="rh-sub">这张报纸是横着排的。<br>转一下屏幕，报头、正文和结算版才摊得开。</div>
</div>

<script>
/* 手机端：首次点击时尝试进入全屏并锁定横屏（支持的浏览器生效） */
(function () {{
  if (!window.matchMedia || !matchMedia('(pointer: coarse)').matches) return;
  function lockLandscape() {{
    var root = document.documentElement;
    try {{
      if (root.requestFullscreen) root.requestFullscreen().catch(function () {{}});
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    }} catch (e) {{}}
    setTimeout(function () {{
      try {{
        if (screen.orientation && screen.orientation.lock) {{
          screen.orientation.lock('landscape').catch(function () {{}});
        }}
      }} catch (e) {{}}
    }}, 120);
  }}
  document.addEventListener('click', function once() {{
    document.removeEventListener('click', once);
    lockLandscape();
  }}, {{ once: true }});
}})();
</script>
</body>
</html>
"""

    OUT.write_text(html, encoding="utf-8")
    size = OUT.stat().st_size / 1024 / 1024
    print(f"\n已生成 {OUT}  ({size:.2f} MB)")


if __name__ == "__main__":
    main()
