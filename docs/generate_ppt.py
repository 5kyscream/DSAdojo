from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import os

# --- Color Palette ---
BG_COLOR       = RGBColor(0x0A, 0x0A, 0x0A)   # Deep Black
SURFACE_COLOR  = RGBColor(0x1A, 0x1A, 0x1A)   # Gunmetal Grey
PRIMARY_COLOR  = RGBColor(0xB9, 0xA2, 0xF7)   # Lavender
ACCENT_COLOR   = RGBColor(0xFF, 0x3B, 0x3B)   # Tactical Red
TEXT_COLOR     = RGBColor(0xF0, 0xF0, 0xF0)   # Off White
MUTED_COLOR    = RGBColor(0x88, 0x88, 0x88)   # Muted Grey

SLIDE_W = Inches(13.33)
SLIDE_H = Inches(7.5)

prs = Presentation()
prs.slide_width  = SLIDE_W
prs.slide_height = SLIDE_H

SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
DASH_IMG  = os.path.join(SCREENSHOT_DIR, "dashboard.png")
ARENA_IMG = os.path.join(SCREENSHOT_DIR, "arena.png")
WORK_IMG  = os.path.join(SCREENSHOT_DIR, "workspace.png")

# ─────────────────────────────────────────
def blank_slide(prs):
    blank_layout = prs.slide_layouts[6]   # Blank layout
    slide = prs.slides.add_slide(blank_layout)
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG_COLOR
    return slide

def add_text(slide, text, left, top, width, height,
             font_size=18, bold=False, color=TEXT_COLOR,
             align=PP_ALIGN.LEFT, italic=False, word_wrap=True):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = word_wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    return txBox

def add_rect(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(
        1, left, top, width, height)   # MSO_SHAPE_TYPE.RECTANGLE = 1
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape

def slide_header(slide, title, subtitle=None):
    # Top accent bar
    add_rect(slide, 0, 0, SLIDE_W, Inches(0.06), ACCENT_COLOR)
    # Title
    add_text(slide, title,
             Inches(0.5), Inches(0.15), Inches(12), Inches(0.7),
             font_size=28, bold=True, color=PRIMARY_COLOR)
    if subtitle:
        add_text(slide, subtitle,
                 Inches(0.5), Inches(0.8), Inches(12), Inches(0.4),
                 font_size=14, color=MUTED_COLOR, italic=True)
    # Bottom bar
    add_rect(slide, 0, SLIDE_H - Inches(0.3), SLIDE_W, Inches(0.3), SURFACE_COLOR)
    add_text(slide, "TACTICAL OPERATION: DSADojo",
             Inches(0.3), SLIDE_H - Inches(0.28), Inches(6), Inches(0.25),
             font_size=8, color=MUTED_COLOR)

# ─────────────────────────────────────────
# SLIDE 1: TITLE
# ─────────────────────────────────────────
slide = blank_slide(prs)
add_rect(slide, 0, 0, SLIDE_W, Inches(0.06), ACCENT_COLOR)
add_rect(slide, 0, SLIDE_H - Inches(0.06), SLIDE_W, Inches(0.06), ACCENT_COLOR)

add_text(slide, "DSADojo",
         Inches(1), Inches(1.5), Inches(11), Inches(1.5),
         font_size=72, bold=True, color=PRIMARY_COLOR, align=PP_ALIGN.CENTER)

add_text(slide, "Elite Tactical DSA Practice Platform",
         Inches(1), Inches(3.2), Inches(11), Inches(0.6),
         font_size=22, italic=True, color=TEXT_COLOR, align=PP_ALIGN.CENTER)

add_text(slide, "System Prototype & Technical Analysis",
         Inches(1), Inches(3.9), Inches(11), Inches(0.5),
         font_size=16, color=MUTED_COLOR, align=PP_ALIGN.CENTER)

add_text(slide, "<Student Name>  |  <Registration Number>  |  Manipal University Jaipur",
         Inches(1), Inches(5.2), Inches(11), Inches(0.5),
         font_size=13, color=MUTED_COLOR, align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────
# SLIDE 2: THE PROBLEM
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "The Problem: Static Learning Fatigue",
             "Why existing platforms fail serious learners")

POINTS = [
    ("Mindless Grind",
     "Users solve hundreds of problems without understanding their actual weaknesses."),
    ("No Real Pressure",
     "Isolated practice misses the competitive, high-stakes environment of actual interviews."),
    ("Binary Feedback",
     "Platforms show pass/fail only — never explaining the 'Why?' behind a logic failure."),
    ("High Drop-Off Rate",
     "Repetitive, static platforms lead to user burnout and loss of motivation."),
]
for i, (title, body) in enumerate(POINTS):
    top = Inches(1.4) + i * Inches(1.3)
    add_rect(slide, Inches(0.4), top, Inches(0.04), Inches(0.5), ACCENT_COLOR)
    add_text(slide, title, Inches(0.6), top - Inches(0.05), Inches(12), Inches(0.4),
             font_size=15, bold=True, color=PRIMARY_COLOR)
    add_text(slide, body, Inches(0.6), top + Inches(0.32), Inches(11.5), Inches(0.5),
             font_size=13, color=TEXT_COLOR)

# ─────────────────────────────────────────
# SLIDE 3: SOLUTION OVERVIEW
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "The Solution: DSADojo", "Three core pillars that transform DSA practice")

PILLARS = [
    ("Real-Time\nArena", "Topic-segmented matchmaking using Socket.io to create live 1v1 coding duels."),
    ("AI Mentor\nEngine", "Google Gemini delivers tactical conceptual hints — never the solution."),
    ("Brutalist\nWorkspace", "Monaco IDE in an immersive, full-focus environment to maximize retention."),
]
for i, (title, body) in enumerate(PILLARS):
    left = Inches(0.4) + i * Inches(4.3)
    add_rect(slide, left, Inches(1.4), Inches(3.9), Inches(4.7), SURFACE_COLOR)
    add_rect(slide, left, Inches(1.4), Inches(3.9), Inches(0.06), ACCENT_COLOR)
    add_text(slide, title, left + Inches(0.2), Inches(1.6), Inches(3.5), Inches(1.0),
             font_size=20, bold=True, color=PRIMARY_COLOR, align=PP_ALIGN.CENTER)
    add_text(slide, body, left + Inches(0.2), Inches(2.7), Inches(3.5), Inches(2.5),
             font_size=13, color=TEXT_COLOR, align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────
# SLIDE 4: SYSTEM ARCHITECTURE
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "System Architecture", "Full-stack microservice-oriented design")

ARCH = [
    ("Frontend", "React + Vite + TailwindCSS V4 + Framer Motion"),
    ("Backend API", "Node.js + Express + Socket.io  (REST & WebSocket gateway)"),
    ("Database", "Supabase (PostgreSQL) + Prisma ORM for ELO and proficiency tracking"),
    ("Matchmaking", "In-memory queues; designed for Redis ZSET scaling by rating band"),
    ("AI Service", "Google Gemini 2.5 Flash — secured prompt-engineered mentor persona"),
]
for i, (layer, detail) in enumerate(ARCH):
    top = Inches(1.4) + i * Inches(1.1)
    add_rect(slide, Inches(0.4), top, Inches(2.6), Inches(0.8), SURFACE_COLOR)
    add_text(slide, layer, Inches(0.5), top + Inches(0.15), Inches(2.4), Inches(0.5),
             font_size=14, bold=True, color=ACCENT_COLOR)
    add_rect(slide, Inches(3.1), top + Inches(0.3), Inches(0.4), Inches(0.04), PRIMARY_COLOR)
    add_text(slide, detail, Inches(3.6), top + Inches(0.15), Inches(9), Inches(0.5),
             font_size=13, color=TEXT_COLOR)

# ─────────────────────────────────────────
# SLIDE 5: MATCHMAKING ENGINE
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "Matchmaking Engine", "Real-time topic-based pairing lifecycle")

STEPS = [
    "1. User selects a DSA topic (Graphs, Arrays, DP, Trees, etc.)",
    "2. Backend adds user to a topic-specific Socket.io queue.",
    "3. Server scans for a second player in the same topic and ELO band.",
    "4. On match: isolated room is created, both sockets join.",
    "5. An algorithmic problem is dispensed and the countdown begins.",
    "6. First user to reach ACCEPTED status wins the match.",
    "7. ELO scores update; results written to Supabase DB.",
]
for i, step in enumerate(STEPS):
    top = Inches(1.4) + i * Inches(0.8)
    add_rect(slide, Inches(0.4), top + Inches(0.15), Inches(0.35), Inches(0.35), PRIMARY_COLOR)
    add_text(slide, step, Inches(0.9), top + Inches(0.08), Inches(11.8), Inches(0.5),
             font_size=13, color=TEXT_COLOR)

# ─────────────────────────────────────────
# SLIDE 6: AI MENTOR ENGINE
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "AI Mentor Integration", "Contextual diagnostics powered by Google Gemini")

ai_points = [
    ("Trigger",        "Activates on every 'Wrong Answer' submission event."),
    ("Engine",         "Google Gemini 2.5 Flash via secure backend API proxy."),
    ("Prompt Design",  "Enforces 'Elite Cyber Mentor' persona — identifies syntax errors or provides one conceptual hint."),
    ("Anti-Shortcut",  "System prompt explicitly forbids providing the full solution under any circumstances."),
    ("Fallback",       "Graceful offline handling if the API key is missing or rate-limited."),
]
for i, (label, detail) in enumerate(ai_points):
    top = Inches(1.5) + i * Inches(1.0)
    add_text(slide, f"[ {label} ]", Inches(0.5), top, Inches(2.5), Inches(0.5),
             font_size=14, bold=True, color=PRIMARY_COLOR)
    add_text(slide, detail, Inches(3.0), top, Inches(9.8), Inches(0.5),
             font_size=13, color=TEXT_COLOR)
    add_rect(slide, Inches(0.4), top + Inches(0.55), Inches(12.4), Inches(0.02), SURFACE_COLOR)

# ─────────────────────────────────────────
# SLIDE 7: SCREENSHOT — DASHBOARD
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "Operational Dashboard", "Live ELO tracking, AI insights, match history")
if os.path.exists(DASH_IMG):
    slide.shapes.add_picture(DASH_IMG, Inches(1.0), Inches(1.3), Inches(11.3), Inches(5.5))

# ─────────────────────────────────────────
# SLIDE 8: SCREENSHOT — ARENA
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "Real-Time Arena", "Live matchmaking queue and opponent pairing")
if os.path.exists(ARENA_IMG):
    slide.shapes.add_picture(ARENA_IMG, Inches(1.0), Inches(1.3), Inches(11.3), Inches(5.5))

# ─────────────────────────────────────────
# SLIDE 9: SCREENSHOT — WORKSPACE
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "Brutalist Workspace", "Monaco IDE integrated with the AI Mentor hint panel")
if os.path.exists(WORK_IMG):
    slide.shapes.add_picture(WORK_IMG, Inches(1.0), Inches(1.3), Inches(11.3), Inches(5.5))

# ─────────────────────────────────────────
# SLIDE 10: IMPLEMENTATION MILESTONES
# ─────────────────────────────────────────
slide = blank_slide(prs)
slide_header(slide, "Implementation Milestones", "Key deliverables completed during PBL")

MILESTONES = [
    ("Requirement Analysis",   "Identified critical pain points vs. platforms like LeetCode."),
    ("UI Architecture",        "Designed Tactical Dashboard, Arena, and Workspace components."),
    ("WebSocket Core",         "Built the Socket.io matchmaking lifecycle end-to-end."),
    ("AI Integration",         "Integrated the Gemini-powered mentor feedback loop."),
    ("Database Schema",        "Designed Prisma schema for ELO, proficiency, and match history."),
    ("End-to-End System",      "Full prototype running; matchmaking and AI Mentor verified."),
]
for i, (phase, deliverable) in enumerate(MILESTONES):
    top = Inches(1.4) + i * Inches(0.9)
    add_rect(slide, Inches(0.4), top, Inches(3.2), Inches(0.7), SURFACE_COLOR)
    add_text(slide, phase, Inches(0.5), top + Inches(0.12), Inches(3.0), Inches(0.5),
             font_size=13, bold=True, color=PRIMARY_COLOR)
    add_text(slide, deliverable, Inches(3.8), top + Inches(0.12), Inches(9.0), Inches(0.5),
             font_size=13, color=TEXT_COLOR)

# ─────────────────────────────────────────
# SLIDE 11: CONCLUSION
# ─────────────────────────────────────────
slide = blank_slide(prs)
add_rect(slide, 0, 0, SLIDE_W, Inches(0.06), ACCENT_COLOR)
add_rect(slide, 0, SLIDE_H - Inches(0.06), SLIDE_W, Inches(0.06), ACCENT_COLOR)

add_text(slide, "Conclusion", Inches(1), Inches(0.8), Inches(11), Inches(0.7),
         font_size=32, bold=True, color=PRIMARY_COLOR, align=PP_ALIGN.CENTER)

CONCLUDING = [
    "Successfully transformed solo DSA practice into an engaging, competitive platform.",
    "Built a scalable real-time infrastructure using WebSockets and an AI diagnostic loop.",
    "Proven that an immersive UI/UX significantly improves user focus and session duration.",
    "Integrated Google Gemini as an intelligent 'tactical mentor' — a first-of-its-kind approach.",
]
for i, point in enumerate(CONCLUDING):
    top = Inches(1.8) + i * Inches(0.85)
    add_rect(slide, Inches(1.8), top + Inches(0.2), Inches(0.15), Inches(0.15), ACCENT_COLOR)
    add_text(slide, point, Inches(2.1), top + Inches(0.05), Inches(10.5), Inches(0.6),
             font_size=15, color=TEXT_COLOR)

add_text(slide, "Elite Practice. Tactical Logic. Mission Complete.",
         Inches(1), Inches(5.8), Inches(11), Inches(0.6),
         font_size=18, bold=True, italic=True, color=PRIMARY_COLOR, align=PP_ALIGN.CENTER)

# ─────────────────────────────────────────
# SAVE
# ─────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), "DSADojo_Presentation.pptx")
prs.save(out_path)
print(f"[DONE] Saved: {out_path}")
