#!/usr/bin/env python3
"""Generate the site's Arizona-themed cricket illustrations as SVG files.

Run from the repo root:  python3 tools/generate_art.py
Writes to images/ and images/gallery/. Replace any of these with real event photos
(same filenames, or update the <img> paths) whenever you have them.
"""
import math
import os
import random

ROOT = os.path.join(os.path.dirname(__file__), "..", "images")
SIL = "#2a0e05"  # silhouette colour

SKIES = {
    "sunset": ["#3a1306", "#8c2f12", "#D8582A", "#EF9F27", "#FAC775"],
    "dusk": ["#1c1033", "#4b1d4a", "#9c3a3f", "#E0743A", "#F6B657"],
    "noon": ["#2f7fc0", "#5aa5d8", "#9fcbe6", "#f3dfb8", "#f7e9cc"],
    "night": ["#05060f", "#0d1430", "#1d2550", "#3b2f5a", "#6a3f4f"],
    "monsoon": ["#1b1b2a", "#34324a", "#5b4f63", "#a3644a", "#d58b4a"],
}


def sky(w, h, name, gid):
    stops = SKIES[name]
    s = "".join(f'<stop offset="{i/(len(stops)-1):.2f}" stop-color="{c}"/>' for i, c in enumerate(stops))
    return (f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1">{s}</linearGradient></defs>'
            f'<rect width="{w}" height="{h}" fill="url(#{gid})"/>')


def sun(cx, cy, r, color="#FAC775", glow=True):
    out = ""
    if glow:
        for k, op in ((2.4, .10), (1.7, .18), (1.3, .3)):
            out += f'<circle cx="{cx}" cy="{cy}" r="{r*k:.0f}" fill="{color}" opacity="{op}"/>'
    return out + f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>'


def mesa_layer(w, base, peaks, color, seed):
    """A layer of flat-topped mesas/buttes across the width."""
    rnd = random.Random(seed)
    pts = [(0, base)]
    x = 0
    while x < w:
        if rnd.random() < peaks:
            top = base - rnd.randint(40, 120)
            width = rnd.randint(80, 220)
            pts += [(x + 20, top + 6), (x + 32, top), (x + width - 30, top), (x + width - 16, top + 8), (x + width, base)]
            x += width + rnd.randint(10, 60)
        else:
            x += rnd.randint(40, 120)
            pts.append((x, base - rnd.randint(0, 14)))
    pts += [(w, base), (w, base + 600), (0, base + 600)]
    return f'<polygon points="{" ".join(f"{a:.0f},{b:.0f}" for a, b in pts)}" fill="{color}"/>'


def saguaro(x, ground, hgt, color=SIL):
    t = max(8, hgt * .11)
    a = hgt * .45
    return (f'<g fill="{color}">'
            f'<rect x="{x - t/2:.0f}" y="{ground - hgt:.0f}" width="{t:.0f}" height="{hgt:.0f}" rx="{t/2:.0f}"/>'
            f'<rect x="{x - t*2.2:.0f}" y="{ground - a - t*1.2:.0f}" width="{t*.85:.0f}" height="{a*.6:.0f}" rx="{t*.42:.0f}"/>'
            f'<rect x="{x - t*2.2:.0f}" y="{ground - a*0.65:.0f}" width="{t*2:.0f}" height="{t*.8:.0f}" rx="{t*.4:.0f}"/>'
            f'<rect x="{x + t*1.3:.0f}" y="{ground - a*1.35:.0f}" width="{t*.85:.0f}" height="{a*.7:.0f}" rx="{t*.42:.0f}"/>'
            f'<rect x="{x:.0f}" y="{ground - a*0.8:.0f}" width="{t*2.1:.0f}" height="{t*.8:.0f}" rx="{t*.4:.0f}"/>'
            f'</g>')


def seg(p, q, wdt, color=SIL):
    return (f'<line x1="{p[0]:.1f}" y1="{p[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" '
            f'stroke="{color}" stroke-width="{wdt}" stroke-linecap="round"/>')


def bat(hands, tip, color=SIL):
    hx, hy = hands
    tx, ty = tip
    dx, dy = tx - hx, ty - hy
    L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    blade_start = (hx + ux * L * .32, hy + uy * L * .32)
    w = 7.5
    pts = [(blade_start[0] + nx * w, blade_start[1] + ny * w), (tx + nx * w, ty + ny * w),
           (tx - nx * w, ty - ny * w), (blade_start[0] - nx * w, blade_start[1] - ny * w)]
    return seg(hands, blade_start, 5, color) + \
        f'<polygon points="{" ".join(f"{a:.1f},{b:.1f}" for a, b in pts)}" fill="{color}"/>'


def figure(pose, x, y, s, color=SIL, ball=None, helmet=True):
    """Draw a silhouette from joint coordinates in a ~200x260 box, placed at (x,y), scaled by s."""
    P = {k: (x + v[0] * s, y + v[1] * s) for k, v in pose.items() if isinstance(v, tuple)}
    out = []
    # legs (pads look thicker)
    out.append(seg(P["hip"], P["bk"], 17 * s, color) + seg(P["bk"], P["bf"], 15 * s, color))
    out.append(seg(P["hip"], P["fk"], 17 * s, color) + seg(P["fk"], P["ff"], 15 * s, color))
    out.append(seg(P["bf"], (P["bf"][0] - 8 * s, P["bf"][1]), 9 * s, color))
    out.append(seg(P["ff"], (P["ff"][0] + 10 * s, P["ff"][1]), 9 * s, color))
    # torso
    out.append(seg(P["neck"], P["hip"], 30 * s, color))
    # arms
    out.append(seg(P["sh"], P["be"], 11 * s, color) + seg(P["be"], P["bh"], 10 * s, color))
    out.append(seg(P["sh"], P["fe"], 11 * s, color) + seg(P["fe"], P["fh"], 10 * s, color))
    # head
    hx, hy = P["head"]
    out.append(f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="{15 * s:.1f}" fill="{color}"/>')
    if helmet:
        d = pose.get("face", 1)
        out.append(seg((hx - 4 * s * d, hy - 2 * s), (hx + 19 * s * d, hy + 1 * s), 5 * s, color))
    if "bat" in pose:
        out.append(bat(P["bh"] if pose.get("bat_from") == "bh" else P["fh"], (x + pose["bat"][0] * s, y + pose["bat"][1] * s), color))
    if ball:
        bx, by = x + ball[0] * s, y + ball[1] * s
        out.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{6 * s:.1f}" fill="#c0261b" stroke="#fff3" stroke-width="1"/>')
    return "".join(out)


POSES = {
    "drive": dict(head=(102, 38), neck=(100, 60), sh=(102, 66), hip=(92, 132), fk=(134, 176), ff=(156, 246),
                  bk=(72, 186), bf=(48, 246), fe=(128, 96), fh=(146, 122), be=(118, 104), bh=(146, 122),
                  bat=(196, 212), face=1),
    "loft": dict(head=(96, 40), neck=(96, 62), sh=(96, 68), hip=(96, 134), fk=(128, 186), ff=(140, 246),
                 bk=(70, 188), bf=(52, 246), fe=(126, 48), fh=(140, 18), be=(112, 46), bh=(140, 18),
                 bat=(108, -62), face=1),
    "pull": dict(head=(100, 40), neck=(100, 62), sh=(100, 68), hip=(98, 134), fk=(126, 186), ff=(134, 246),
                 bk=(74, 188), bf=(62, 246), fe=(70, 82), fh=(48, 70), be=(80, 92), bh=(48, 70),
                 bat=(-40, 52), face=-1),
    "bowl": dict(head=(112, 38), neck=(108, 60), sh=(108, 64), hip=(98, 128), fk=(128, 184), ff=(152, 246),
                 bk=(70, 178), bf=(40, 232), be=(98, 14), bh=(90, -30), fe=(142, 84), fh=(166, 108), face=1),
    "runup": dict(head=(104, 40), neck=(102, 62), sh=(102, 66), hip=(96, 132), fk=(138, 168), ff=(130, 230),
                  bk=(76, 186), bf=(40, 214), be=(74, 96), bh=(66, 128), fe=(132, 92), fh=(150, 74), face=1),
    "keeper": dict(head=(110, 120), neck=(104, 136), sh=(104, 140), hip=(80, 184), fk=(120, 200), ff=(124, 246),
                   bk=(48, 206), bf=(56, 246), be=(120, 172), bh=(132, 196), fe=(128, 170), fh=(138, 194), face=1),
    "stand": dict(head=(100, 40), neck=(100, 62), sh=(100, 66), hip=(100, 134), fk=(110, 190), ff=(112, 246),
                  bk=(90, 190), bf=(88, 246), be=(84, 100), bh=(80, 134), fe=(116, 100), fh=(120, 134), face=1),
    "cheer": dict(head=(100, 40), neck=(100, 62), sh=(100, 66), hip=(100, 134), fk=(116, 190), ff=(124, 246),
                  bk=(84, 190), bf=(76, 246), be=(70, 30), bh=(62, -6), fe=(130, 30), fh=(138, -6), face=1),
}


def dive(x, y, s, color=SIL):
    """Horizontal diving fielder reaching to the right."""
    P = lambda a, b: (x + a * s, y + b * s)
    return (seg(P(20, 30), P(-30, 10), 16 * s, color) + seg(P(-30, 10), P(-80, 0), 14 * s, color)
            + seg(P(20, 34), P(-28, 44), 16 * s, color) + seg(P(-28, 44), P(-70, 60), 14 * s, color)
            + seg(P(20, 30), P(110, 14), 30 * s, color)
            + seg(P(104, 12), P(160, -6), 11 * s, color) + seg(P(160, -6), P(206, -20), 10 * s, color)
            + seg(P(104, 20), P(150, 30), 11 * s, color) + seg(P(150, 30), P(196, 22), 10 * s, color)
            + f'<circle cx="{x + 134 * s:.1f}" cy="{y - 8 * s:.1f}" r="{15 * s:.1f}" fill="{color}"/>'
            + f'<circle cx="{x + 214 * s:.1f}" cy="{y - 24 * s:.1f}" r="{6 * s:.1f}" fill="#c0261b"/>')


def stumps(x, ground, s, color=SIL, flying=False):
    out = ""
    for i in range(3):
        sx = x + i * 11 * s
        if flying and i == 1:
            out += f'<rect x="{sx:.1f}" y="{ground - 72 * s:.1f}" width="{4.5 * s:.1f}" height="{72 * s:.1f}" fill="{color}" transform="rotate(-24 {sx:.1f} {ground:.1f})"/>'
        elif flying and i == 2:
            out += f'<rect x="{sx:.1f}" y="{ground - 72 * s:.1f}" width="{4.5 * s:.1f}" height="{72 * s:.1f}" fill="{color}" transform="rotate(12 {sx:.1f} {ground:.1f})"/>'
        else:
            out += f'<rect x="{sx:.1f}" y="{ground - 72 * s:.1f}" width="{4.5 * s:.1f}" height="{72 * s:.1f}" fill="{color}"/>'
    if flying:
        out += f'<rect x="{x - 6 * s:.1f}" y="{ground - 104 * s:.1f}" width="{12 * s:.1f}" height="{3.5 * s:.1f}" fill="{color}" transform="rotate(-35 {x:.1f} {ground - 104 * s:.1f})"/>'
        out += f'<rect x="{x + 24 * s:.1f}" y="{ground - 118 * s:.1f}" width="{12 * s:.1f}" height="{3.5 * s:.1f}" fill="{color}" transform="rotate(40 {x + 30 * s:.1f} {ground - 118 * s:.1f})"/>'
    else:
        out += f'<rect x="{x:.1f}" y="{ground - 75 * s:.1f}" width="{26.5 * s:.1f}" height="{3.5 * s:.1f}" fill="{color}"/>'
    return out


def ground_band(w, h, top, color1="#3B6D11", color2="#2c520c", gid="g"):
    return (f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{color1}"/>'
            f'<stop offset="1" stop-color="{color2}"/></linearGradient></defs>'
            f'<path d="M0 {top + 16} Q {w/2} {top - 18} {w} {top + 16} L {w} {h} L 0 {h} Z" fill="url(#{gid})"/>')


def pitch_strip(cx, top, h, w=90):
    return f'<polygon points="{cx - w*.3:.0f},{top} {cx + w*.3:.0f},{top} {cx + w*.55:.0f},{h} {cx - w*.55:.0f},{h}" fill="#d9b779" opacity=".85"/>'


def desert(w, base, seed, colors=("#7a2e10", "#5a200b", "#3d1407")):
    return "".join(mesa_layer(w, base + i * 22, .35 + i * .1, c, seed + i) for i, c in enumerate(colors))


def svg(w, h, body, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-label="{label}">{body}</svg>\n')


def write(name, content):
    path = os.path.join(ROOT, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    print("wrote", os.path.relpath(path))


def stars(w, h, n, seed):
    rnd = random.Random(seed)
    return "".join(f'<circle cx="{rnd.random()*w:.0f}" cy="{rnd.random()*h:.0f}" r="{rnd.random()*1.6+.3:.1f}" fill="#fff" opacity="{rnd.random()*.7+.3:.2f}"/>' for _ in range(n))


def crowd(w, y, seed, color=SIL, scale=1.0):
    rnd = random.Random(seed)
    out = ""
    x = -10
    while x < w + 10:
        r = rnd.uniform(9, 13) * scale
        yy = y + rnd.uniform(-6, 6) * scale
        out += f'<circle cx="{x:.0f}" cy="{yy:.0f}" r="{r:.1f}" fill="{color}"/>'
        out += f'<rect x="{x - r*1.4:.0f}" y="{yy + r*.7:.0f}" width="{r*2.8:.0f}" height="{60*scale:.0f}" rx="{r:.0f}" fill="{color}"/>'
        x += rnd.uniform(22, 32) * scale
    return out


# ---------------------------------------------------------------- scenes
def hero():
    w, h = 1600, 800
    b = sky(w, h, "sunset", "sk")
    b += sun(1060, 430, 120)
    b += desert(w, 470, 7)
    b += saguaro(150, 600, 190) + saguaro(1480, 610, 150) + saguaro(330, 590, 90)
    b += ground_band(w, h, 590, gid="gr")
    b += pitch_strip(1130, 610, 800, 160)
    b += stumps(1050, 640, 1.2, "#f3e6d4")
    b += figure(POSES["drive"], 1090, 420, 1.3, ball=(212, 236))
    b += f'<path d="M0 790 Q 800 740 1600 790" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none"/>'
    return svg(w, h, b, "A batter plays a cover drive at sunset in front of Arizona mesas and saguaro cacti")


def bowler():
    w, h = 900, 700
    b = sky(w, h, "dusk", "sk")
    b += sun(240, 380, 80, "#F6B657")
    b += desert(w, 420, 21, ("#6b2a2a", "#4a1b1d", "#2f1112"))
    b += saguaro(780, 540, 140)
    b += ground_band(w, h, 520, gid="gr")
    b += pitch_strip(470, 530, 700, 150)
    b += stumps(420, 600, 1.1, "#f3e6d4")
    b += figure(POSES["bowl"], 360, 210, 1.55, ball=(88, -36))
    return svg(w, h, b, "A fast bowler at the point of delivery against a desert dusk sky")


def g_drive():
    w, h = 800, 600
    b = sky(w, h, "sunset", "sk") + sun(560, 300, 70) + desert(w, 330, 3)
    b += saguaro(90, 450, 120) + ground_band(w, h, 440, gid="gr") + pitch_strip(520, 450, 600, 120)
    b += stumps(470, 500, .9, "#f3e6d4") + figure(POSES["drive"], 490, 290, 1.05, ball=(210, 236))
    return svg(w, h, b, "Cover drive at sunset")


def g_bowler_portrait():
    w, h = 600, 800
    b = sky(w, h, "sunset", "sk") + sun(300, 380, 90) + desert(w, 470, 33)
    b += ground_band(w, h, 560, gid="gr") + pitch_strip(300, 570, 800, 130)
    b += figure(POSES["bowl"], 210, 260, 1.6, ball=(88, -36))
    return svg(w, h, b, "Opening bowler silhouetted against the setting sun")


def g_trophy():
    w, h = 800, 600
    b = sky(w, h, "dusk", "sk") + sun(400, 250, 60, "#F6B657") + desert(w, 300, 41)
    b += f'<rect x="0" y="380" width="{w}" height="220" fill="#EFE3CF"/>'
    b += f'<rect x="230" y="330" width="340" height="60" fill="#8C5A3C"/><rect x="220" y="320" width="360" height="14" fill="#5a3522"/>'
    # trophy
    b += ('<g fill="#EF9F27"><path d="M370 180 h60 v20 q0 50 -30 60 q-30 -10 -30 -60z"/>'
          '<rect x="392" y="258" width="16" height="30"/><rect x="376" y="286" width="48" height="12" rx="3"/>'
          '<path d="M370 190 q-28 0 -24 22 q4 18 26 20" fill="none" stroke="#EF9F27" stroke-width="7"/>'
          '<path d="M430 190 q28 0 24 22 q-4 18 -26 20" fill="none" stroke="#EF9F27" stroke-width="7"/></g>')
    b += figure(POSES["cheer"], 260, 150, .78, helmet=False) + figure(POSES["cheer"], 470, 150, .78, helmet=False)
    b += crowd(w, 470, 5, scale=1.3)
    return svg(w, h, b, "Trophy presentation on the plaza stage")


def g_nets():
    w, h = 960, 540
    b = sky(w, h, "noon", "sk") + desert(w, 250, 51, ("#c98f63", "#a8683f", "#8a4f2c"))
    b += f'<rect x="0" y="300" width="{w}" height="240" fill="#d9c7a7"/>'
    # canopy + frame
    b += '<polygon points="60,120 900,120 940,150 20,150" fill="#EFE3CF" stroke="#8a4f2c" stroke-width="3"/>'
    for px in (60, 340, 620, 900):
        b += f'<rect x="{px - 5}" y="150" width="10" height="320" fill="#5F5E5A"/>'
    for lx in (200, 480, 760):
        b += f'<polygon points="{lx - 90},470 {lx + 90},470 {lx + 50},310 {lx - 50},310" fill="#1D9E75"/>'
    # netting
    net = "".join(f'<line x1="{x}" y1="150" x2="{x}" y2="470" stroke="#444" stroke-opacity=".25"/>' for x in range(60, 905, 14))
    net += "".join(f'<line x1="60" y1="{y}" x2="900" y2="{y}" stroke="#444" stroke-opacity=".25"/>' for y in range(150, 471, 14))
    b += net + f'<rect x="0" y="470" width="{w}" height="70" fill="#b9a586"/>'
    b += figure(POSES["drive"], 150, 300, .62) + figure(POSES["pull"], 450, 300, .62) + figure(POSES["stand"], 720, 300, .62)
    return svg(w, h, b, "Junior academy batters training in the covered practice nets")


def g_monsoon():
    w, h = 800, 600
    b = sky(w, h, "monsoon", "sk")
    b += '<g fill="#2b2940" opacity=".9"><ellipse cx="200" cy="120" rx="240" ry="80"/><ellipse cx="520" cy="90" rx="300" ry="90"/><ellipse cx="700" cy="160" rx="200" ry="60"/></g>'
    b += '<polyline points="470,150 440,250 480,250 430,380" fill="none" stroke="#fff6c8" stroke-width="5" stroke-linejoin="round"/>'
    b += "".join(f'<line x1="{x}" y1="{180 + (x*7) % 40}" x2="{x - 16}" y2="{300 + (x*5) % 60}" stroke="#cdd6ff" stroke-opacity=".35" stroke-width="2"/>' for x in range(20, 800, 28))
    b += desert(w, 360, 61, ("#6d4635", "#4f3127", "#33201a")) + ground_band(w, h, 460, gid="gr")
    b += '<rect x="330" y="470" width="140" height="40" fill="#cfd6dd" opacity=".9" rx="4"/>'
    b += saguaro(680, 520, 110)
    return svg(w, h, b, "Monsoon storm rolling over the grounds, pitch covers on")


def g_dive():
    w, h = 800, 600
    b = sky(w, h, "noon", "sk") + desert(w, 300, 71, ("#c98f63", "#a8683f", "#8a4f2c"))
    b += ground_band(w, h, 380, "#4f8a1a", "#3B6D11", "gr")
    b += dive(300, 420, 1.3)
    b += saguaro(80, 400, 100, "#5c2a12")
    return svg(w, h, b, "Fielder taking a diving catch at point")


def g_family():
    w, h = 800, 600
    b = sky(w, h, "noon", "sk") + sun(650, 110, 50, "#fff3c9") + desert(w, 300, 81, ("#c98f63", "#a8683f", "#8a4f2c"))
    b += ground_band(w, h, 390, "#4f8a1a", "#3B6D11", "gr")
    b += figure(POSES["drive"], 110, 300, .85, helmet=False, ball=(210, 236))
    b += figure(POSES["bowl"], 480, 340, .62, helmet=False, ball=(88, -36))
    b += figure(POSES["cheer"], 330, 380, .5, helmet=False) + figure(POSES["stand"], 640, 330, .8, helmet=False)
    b += stumps(110, 520, .8)
    return svg(w, h, b, "Kids and parents playing at Family Cricket Day")


def g_clubhouse():
    w, h = 960, 540
    b = sky(w, h, "sunset", "sk") + sun(780, 250, 60) + desert(w, 290, 91)
    b += f'<rect x="0" y="380" width="{w}" height="160" fill="#3B6D11"/>'
    b += '<rect x="140" y="230" width="640" height="150" fill="#C98F63"/><rect x="120" y="215" width="680" height="20" fill="#8C5A3C"/>'
    b += '<rect x="200" y="260" width="520" height="80" fill="#2a0e05" opacity=".75"/>'
    b += "".join(f'<rect x="{x}" y="262" width="60" height="76" fill="#FAC775" opacity=".55"/>' for x in range(206, 715, 66))
    b += '<rect x="100" y="340" width="720" height="10" fill="#5a3522"/>'
    b += "".join(f'<rect x="{x}" y="350" width="6" height="34" fill="#5a3522"/>' for x in range(110, 820, 60))
    b += '<text x="460" y="208" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="#FAC775" letter-spacing="6">SUNSTONE</text>'
    b += saguaro(60, 400, 140) + saguaro(890, 400, 110)
    return svg(w, h, b, "The clubhouse and shaded viewing terrace at sunset")


def g_wicket():
    w, h = 700, 700
    b = sky(w, h, "sunset", "sk") + sun(350, 300, 110)
    b += desert(w, 400, 101) + ground_band(w, h, 520, gid="gr") + pitch_strip(350, 520, 700, 300)
    b += stumps(300, 600, 3.2, flying=True)
    b += '<circle cx="250" cy="470" r="16" fill="#c0261b"/>'
    return svg(w, h, b, "Stumps shattered and bails flying")


def g_night():
    w, h = 600, 800
    b = sky(w, h, "night", "sk") + stars(w, 420, 120, 3) + sun(440, 140, 46, "#f7f1d6", glow=True)
    b += desert(w, 470, 111, ("#2c1a2c", "#1e1220", "#120a14"))
    b += ground_band(w, h, 580, "#2e5410", "#1e3a09", "gr")
    b += figure(POSES["loft"], 190, 360, 1.25)
    b += '<circle cx="380" cy="160" r="0"/>'
    b += '<path d="M330 290 Q 420 160 500 210" stroke="#fff" stroke-opacity=".5" stroke-dasharray="4 8" fill="none" stroke-width="3"/><circle cx="500" cy="210" r="8" fill="#f5f5f5"/>'
    return svg(w, h, b, "Lofted six under a desert moon")


def g_keeper():
    w, h = 800, 600
    b = sky(w, h, "dusk", "sk") + sun(620, 260, 60, "#F6B657") + desert(w, 300, 121, ("#6b2a2a", "#4a1b1d", "#2f1112"))
    b += ground_band(w, h, 420, gid="gr") + pitch_strip(330, 430, 600, 200)
    b += stumps(300, 520, 1.1, "#f3e6d4") + figure(POSES["keeper"], 140, 290, 1.0)
    b += figure(POSES["pull"], 360, 250, 1.1)
    return svg(w, h, b, "Batter pulls as the keeper crouches behind the stumps")


def logo():
    b = ('<defs><clipPath id="lc"><circle cx="50" cy="50" r="46"/></clipPath></defs>'
         '<circle cx="50" cy="50" r="48" fill="#4A1B0C"/><g clip-path="url(#lc)">'
         '<circle cx="50" cy="46" r="22" fill="#EF9F27"/>'
         + "".join(f'<line x1="{50 + 27*math.cos(math.radians(a)):.1f}" y1="{46 + 27*math.sin(math.radians(a)):.1f}" '
                   f'x2="{50 + 36*math.cos(math.radians(a)):.1f}" y2="{46 + 36*math.sin(math.radians(a)):.1f}" '
                   f'stroke="#FAC775" stroke-width="4" stroke-linecap="round"/>' for a in range(-180, 1, 30))
         + '<rect x="4" y="60" width="92" height="38" fill="#4A1B0C"/>'
         + '<polygon points="10,72 24,62 40,62 46,68 60,68 64,62 80,62 90,72" fill="#C4622D"/>'
         + '<g fill="#FBFAF6"><rect x="40" y="70" width="4" height="20"/><rect x="48" y="70" width="4" height="20"/><rect x="56" y="70" width="4" height="20"/><rect x="39" y="67" width="22" height="2.5"/></g>'
         + '</g><circle cx="50" cy="50" r="46" fill="none" stroke="#EF9F27" stroke-width="3"/>')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">{b}</svg>\n'


if __name__ == "__main__":
    random.seed(1)
    write("logo.svg", logo())
    write("hero-batter.svg", hero())
    write("bowler.svg", bowler())
    for name, fn in [("cover-drive", g_drive), ("opening-spell", g_bowler_portrait), ("trophy", g_trophy),
                     ("nets", g_nets), ("monsoon", g_monsoon), ("diving-catch", g_dive), ("family-day", g_family),
                     ("clubhouse", g_clubhouse), ("wicket", g_wicket), ("moonlight-six", g_night),
                     ("keeper", g_keeper)]:
        write(f"gallery/{name}.svg", fn())
