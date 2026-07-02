from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[3]
SCREENSHOT_DIR = ROOT / "tmp" / "pdfs" / "dsa-report" / "screenshots"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
PDF_PATH = OUTPUT_DIR / "dsa-visual-lab-project-report-aikansh.pdf"


PROJECT = {
    "student": "Aikansh",
    "registration": "12303820",
    "section": "9P196",
    "project_id": "WPEP-26-284",
    "title": "DSA Visual Lab",
    "website": "https://aikansh-official.github.io/DSA-Visual-Lab/",
    "repo": "https://github.com/Aikansh-Official/DSA-Visual-Lab",
}


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=34,
        leading=40,
        textColor=colors.HexColor("#0F172A"),
        alignment=TA_CENTER,
        spaceAfter=16,
    )
)
styles.add(
    ParagraphStyle(
        name="Subtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#475569"),
        alignment=TA_CENTER,
        spaceAfter=18,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=19,
        leading=24,
        textColor=colors.HexColor("#1D4ED8"),
        spaceBefore=12,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="Subhead",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12.5,
        leading=16,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=8,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15.5,
        textColor=colors.HexColor("#334155"),
        alignment=TA_LEFT,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Caption",
        parent=styles["BodyText"],
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=12,
    )
)


def para(text, style="Body"):
    return Paragraph(text, styles[style])


def bullet_list(items):
    return ListFlowable(
        [ListItem(para(item), leftIndent=10) for item in items],
        bulletType="bullet",
        start="circle",
        leftIndent=16,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        bulletColor=colors.HexColor("#2563EB"),
    )


def screenshot(name, caption):
    path = SCREENSHOT_DIR / name
    img = Image(str(path))
    img._restrictSize(6.9 * inch, 3.9 * inch)
    return KeepTogether([img, para(caption, "Caption")])


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(colors.HexColor("#DBEAFE"))
    canvas.setLineWidth(1)
    canvas.line(doc.leftMargin, height - 0.52 * inch, width - doc.rightMargin, height - 0.52 * inch)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.setFillColor(colors.HexColor("#2563EB"))
    canvas.drawString(doc.leftMargin, height - 0.42 * inch, "DSA Visual Lab Project Report")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748B"))
    canvas.drawRightString(width - doc.rightMargin, 0.38 * inch, f"Page {doc.page}")
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(colors.HexColor("#F8FAFC"))
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#DBEAFE"))
    canvas.circle(width * 0.15, height * 0.86, 88, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor("#CCFBF1"))
    canvas.circle(width * 0.86, height * 0.18, 118, stroke=0, fill=1)
    canvas.setStrokeColor(colors.HexColor("#2563EB"))
    canvas.setLineWidth(3)
    canvas.roundRect(0.72 * inch, 0.72 * inch, width - 1.44 * inch, height - 1.44 * inch, 18, stroke=1, fill=0)
    canvas.restoreState()


def details_table():
    data = [
        ["Student Name", PROJECT["student"]],
        ["Registration Number", PROJECT["registration"]],
        ["Class Section", PROJECT["section"]],
        ["Project ID", PROJECT["project_id"]],
        ["Live Website", f'<link href="{PROJECT["website"]}">{PROJECT["website"]}</link>'],
        ["GitHub Repository", f'<link href="{PROJECT["repo"]}">Aikansh-Official/DSA-Visual-Lab</link>'],
    ]
    table = Table([[para(k, "Small"), para(v, "Small")] for k, v in data], colWidths=[1.75 * inch, 4.75 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EFF6FF")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#1D4ED8")),
                ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#BFDBFE")),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#DBEAFE")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build_story():
    story = []

    story.extend(
        [
            Spacer(1, 1.55 * inch),
            para("Project Report", "Subtitle"),
            para(PROJECT["title"], "CoverTitle"),
            para(
                "An interactive educational website for visually understanding Data Structures and Algorithms.",
                "Subtitle",
            ),
            Spacer(1, 0.35 * inch),
            details_table(),
            Spacer(1, 0.45 * inch),
            para(
                "Prepared as a web project submission demonstrating visual learning, frontend engineering, and practical deployment using GitHub Pages.",
                "Subtitle",
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            para("1. Abstract", "SectionTitle"),
            para(
                "DSA Visual Lab is a web-based learning platform designed to help school students understand Data Structures and Algorithms through direct visual interaction. Instead of beginning with code syntax, the website first shows how a structure behaves when operations are performed on it. This approach makes abstract topics like stacks, queues, arrays, trees, and tries easier to observe, discuss, and remember.",
            ),
            para(
                "The project combines animated visualizations, simple real-world analogies, operation controls, complexity summaries, and multi-language code snippets. It is deployed publicly through GitHub Pages so students, teachers, and evaluators can access it directly from a browser.",
            ),
            para("2. Project Objectives", "SectionTitle"),
            bullet_list(
                [
                    "To make foundational DSA concepts easier for school students to understand visually.",
                    "To provide interactive controls for operations such as push, pop, enqueue, dequeue, insert, search, and traversal.",
                    "To connect visual behavior with code examples in JavaScript, C, C++, and Java.",
                    "To create a clean and responsive educational website suitable for classroom demonstration and self-study.",
                    "To host the completed project online using GitHub Pages for easy access and presentation.",
                ]
            ),
            para("3. Student And Project Details", "SectionTitle"),
            details_table(),
            PageBreak(),
        ]
    )

    story.extend(
        [
            para("4. Technology Stack", "SectionTitle"),
            bullet_list(
                [
                    "<b>React:</b> Used to build reusable UI components and manage interactive learning views.",
                    "<b>TypeScript:</b> Provides typed development and safer component logic.",
                    "<b>Vite:</b> Used as the frontend build tool and development server.",
                    "<b>Tailwind CSS:</b> Provides the visual styling system, spacing, layout, and responsive design utilities.",
                    "<b>Lucide React:</b> Supplies consistent icons for controls, actions, and concept cards.",
                    "<b>Motion:</b> Adds smooth animation for transitions and visual state changes.",
                    "<b>GitHub Pages:</b> Hosts the live website as a static production build.",
                ]
            ),
            para("5. System Overview", "SectionTitle"),
            para(
                "The application is structured as a single-page React website. The top navigation lets users switch between DSA topics. Each topic page combines a hero explanation, a visualizer, core idea notes, operation buttons, complexity cards, and a code block. The code block includes language tabs so the same concept can be compared across multiple programming languages.",
            ),
            para("Core modules currently included:", "Subhead"),
            bullet_list(
                [
                    "Stack visualization using a plate-stack analogy for LIFO behavior.",
                    "Queue visualization using a ticket-line analogy for FIFO behavior.",
                    "Array visualization showing indexed contiguous memory cells.",
                    "Tree section covering Binary Tree, Binary Search Tree, AVL Tree, Red-Black Tree, B-Tree, and Trie concepts.",
                    "Premium unlock prompt and multi-language code snippet support.",
                ]
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            para("6. Website Screenshots", "SectionTitle"),
            para(
                "The following screenshots were captured from the live GitHub Pages deployment. They show the working user interface and the main educational sections of the project.",
            ),
            screenshot("01-stack.png", "Figure 1: Stack page showing the LIFO plate-stack explanation and interactive visualizer."),
            screenshot("02-queue.png", "Figure 2: Queue page showing the FIFO ticket-line explanation and queue visualizer."),
            PageBreak(),
            para("6. Website Screenshots", "SectionTitle"),
            screenshot("03-array.png", "Figure 3: Array page showing indexed memory cells and array operation controls."),
            screenshot("04-trees.png", "Figure 4: Tree architectures page with relevant visual diagrams for different tree types."),
            PageBreak(),
            para("6. Website Screenshots", "SectionTitle"),
            screenshot("05-premium-code.png", "Figure 5: Premium unlock message and multi-language code tabs for JavaScript, C, C++, and Java."),
            para("7. Key Features", "SectionTitle"),
            bullet_list(
                [
                    "Topic-based navigation for fast switching between DSA concepts.",
                    "Animated visual states that show how operations affect each structure.",
                    "Real-world analogies that make abstract concepts easier for beginners.",
                    "Complexity cards for quick revision of time and space complexity.",
                    "Multi-language code examples to support wider programming learning.",
                    "Public deployment through GitHub Pages.",
                ]
            ),
            PageBreak(),
        ]
    )

    story.extend(
        [
            para("8. Educational Value", "SectionTitle"),
            para(
                "The project is especially useful for school students because it introduces the behavior of data structures before showing full code. This visual-first approach supports logical thinking and reduces the fear that beginners often feel when DSA is presented only through syntax.",
            ),
            para(
                "Teachers can use the website during classroom explanation, while students can use it for revision and self-study. The combination of interaction, animation, code, and complexity summaries makes the website a bridge between textbook learning and practical programming.",
            ),
            para("9. Future Scope", "SectionTitle"),
            bullet_list(
                [
                    "Add linked list, graph traversal, heap, hashing, sorting, and dynamic programming visualizations.",
                    "Add quizzes after each visualization to test conceptual understanding.",
                    "Introduce progress tracking for students and a classroom dashboard for teachers.",
                    "Add an AI hint assistant to explain mistakes in simple language.",
                    "Improve metadata, search visibility, and certificate-style project documentation.",
                ]
            ),
            para("10. Conclusion", "SectionTitle"),
            para(
                "DSA Visual Lab successfully demonstrates how a modern web application can make core computer science topics more understandable for young learners. By combining visual models, interactive controls, code references, and live deployment, the project shows both educational purpose and practical frontend implementation.",
            ),
            para("11. References", "SectionTitle"),
            bullet_list(
                [
                    f'Live website: <link href="{PROJECT["website"]}">{PROJECT["website"]}</link>',
                    f'GitHub repository: <link href="{PROJECT["repo"]}">Aikansh-Official/DSA-Visual-Lab</link>',
                    "React, Vite, Tailwind CSS, and GitHub Pages official documentation.",
                ]
            ),
        ]
    )

    return story


def main():
    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        rightMargin=0.72 * inch,
        leftMargin=0.72 * inch,
        topMargin=0.72 * inch,
        bottomMargin=0.62 * inch,
        title="DSA Visual Lab Project Report",
        author=PROJECT["student"],
    )
    doc.build(build_story(), onFirstPage=cover_page, onLaterPages=draw_page)
    print(PDF_PATH)


if __name__ == "__main__":
    main()
