import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Line,
  Svg,
  Link,
} from "@react-pdf/renderer";
import type { Portfolio } from "@/lib/schema";
import { calculateYearsOfExperience } from "@/lib/utils";

// ─── Palette ─────────────────────────────────────────────────────────────────
const BLACK = "#000000";
const DARK = "#111111";
const GREY = "#444444";

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: DARK,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    lineHeight: 1.45,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: BLACK,
    letterSpacing: 0.3,
  },
  jobTitle: {
    fontSize: 10,
    color: GREY,
    marginTop: 15,
  },
  contactBlock: {
    textAlign: "right",
    fontSize: 9,
    color: DARK,
    lineHeight: 1.7,
  },

  // ── Section ─────────────────────────────────────────────────────────────────
  section: { marginTop: 10 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BLACK,
    marginBottom: 4,
  },

  // ── Summary ──────────────────────────────────────────────────────────────────
  summaryText: { fontSize: 9.5, color: GREY, lineHeight: 1.55 },

  // ── Skills — one row per category ────────────────────────────────────────────
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 6,
  },
  skillDot: {
    width: 10,
    fontSize: 9.5,
    color: GREY,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    // Fixed width so values always start at same column
    width: 110,
    flexShrink: 0,
  },
  skillValue: {
    flex: 1,
    fontSize: 9.5,
    color: GREY,
    textTransform: "capitalize",
  },

  // ── Work Experience ───────────────────────────────────────────────────────────
  workItem: { marginBottom: 10 },
  workHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 3,
  },
  workCompanyRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    flex: 1,
  },
  workDates: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: DARK,
    textAlign: "right",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    fontSize: 9.5,
    color: GREY,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: GREY,
    lineHeight: 1.45,
  },

  // ── Projects ──────────────────────────────────────────────────────────────────
  projectItem: { marginBottom: 8 },
  projectHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 2,
  },
  projectTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    flex: 1,
  },
  projectUrl: {
    fontSize: 8.5,
    color: GREY,
    textAlign: "right",
  },
  projectTech: {
    fontSize: 8.5,
    color: GREY,
    fontFamily: "Helvetica-Oblique",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  projectDesc: {
    fontSize: 9.5,
    color: GREY,
    lineHeight: 1.45,
  },
});

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <View style={{ marginBottom: 6 }}>
      <Svg height={1} width={528}>
        <Line x1={0} y1={0} x2={528} y2={0} strokeWidth={0.8} stroke={BLACK} />
      </Svg>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDuration(work: Portfolio["WorkExperience"][0]): string {
  const start = [work.startMonth, work.startYear].filter(Boolean).join(" ");
  if (work.isCurrentJob) return `${start} - Present`;
  const end = [work.endMonth, work.endYear].filter(Boolean).join(" ");
  return end ? `${start} - ${end}` : start;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#+\s/g, "")
    .trim();
}

// ─── Skill category builder ───────────────────────────────────────────────────
function buildSkillCategories(
  skills: string[],
): { label: string; value: string }[] {
  const map: { label: string; keywords: string[] }[] = [
    {
      label: "Frontend",
      keywords: [
        "react",
        "next",
        "javascript",
        "typescript",
        "html",
        "css",
        "tailwind",
        "mui",
        "bootstrap",
        "angular",
        "svelte",
        "vue",
        "css",
      ],
    },
    {
      label: "State Management",
      keywords: ["redux", "zustand", "context", "mobx", "jotai"],
    },
    {
      label: "UI/UX",
      keywords: ["storybook", "figma", "accessibility", "wcag", "sketch"],
    },
    {
      label: "Testing",
      keywords: ["jest", "cypress", "playwright", "vitest", "testing"],
    },
    {
      label: "Tools & DevOps",
      keywords: [
        "git",
        "docker",
        "aws",
        "terraform",
        "ci",
        "cd",
        "webpack",
        "vite",
      ],
    },
    {
      label: "Backend",
      keywords: [
        "dotnet",
        "python",
        "sqlite",
        "node",
        "express",
        "postgres",
        "mongo",
      ],
    },
  ];

  const used = new Set<string>();
  const result: { label: string; value: string }[] = [];

  for (const { label, keywords } of map) {
    const matched = skills.filter((s) => {
      const sl = s.toLowerCase();
      return keywords.some((k) => sl.includes(k));
    });
    if (matched.length) {
      matched.forEach((s) => used.add(s));
      result.push({ label, value: matched.join(", ") });
    }
  }

  const extras = skills.filter((s) => !used.has(s));
  if (extras.length) result.push({ label: "Other", value: extras.join(", ") });

  return result;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export default function ResumePDF({ portfolio }: { portfolio: Portfolio }) {
  const {
    Intro,
    AboutMe,
    WorkExperience,
    Projects,
    Footer: FooterData,
  } = portfolio;

  const years = calculateYearsOfExperience(WorkExperience);
  const yearsDisplay = Number.isInteger(years) ? `${years}` : years.toFixed(1);
  const fullName = `${Intro.FirstName} ${Intro.LastName}`;
  const skillCategories = buildSkillCategories(AboutMe.skills);

  const summary =
    `Frontend Developer with ${yearsDisplay}+ years of experience. ` +
    stripMarkdown(AboutMe.experience.experienceSummary);

  return (
    <Document title={`${fullName} — Resume`} author={fullName} subject="Resume">
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.name}>{fullName}</Text>
            <Text style={s.jobTitle}>{Intro.OneLinerIntro}</Text>
          </View>
          <View style={s.contactBlock}>
            {FooterData?.github && (
              <Link>{FooterData.github.replace("https://", "")}</Link>
            )}
            {FooterData?.linkedin && (
              <Link>{FooterData.linkedin.replace("https://", "")}</Link>
            )}
            <Link href={`mailto:${AboutMe.email}`}>{AboutMe.email}</Link>
          </View>
        </View>

        {/* ── Professional Summary ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Professional Summary</Text>
          <Divider />
          <Text style={s.summaryText}>{summary}</Text>
        </View>

        {/* ── Skills ── */}
        {skillCategories.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <Divider />
            {skillCategories.map((cat) => (
              <View key={cat.label} style={s.skillRow}>
                <Text style={s.skillDot}>•</Text>
                {/* Category label and value as SEPARATE Text nodes in a row —
                    avoids react-pdf hyphenating mixed bold/normal inline text */}
                <Text style={s.skillCategory}>{cat.label}:</Text>
                <Text style={s.skillValue}>{cat.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Work Experience ── */}
        {WorkExperience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Work Experience</Text>
            <Divider />
            {WorkExperience.map((work, i) => (
              <View key={i} style={s.workItem}>
                <View style={s.workHeaderRow}>
                  <Text style={s.workCompanyRole}>
                    {work.company} — {work.title}
                  </Text>
                  <Text style={s.workDates}>{formatDuration(work)}</Text>
                </View>
                {work.description
                  .split("\n")
                  .filter(Boolean)
                  .map((line, j) => (
                    <View key={j} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{stripMarkdown(line)}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Projects ── */}
        {Projects && Projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects</Text>
            <Divider />
            {Projects.map((project, i) => (
              <View key={i} style={s.projectItem}>
                <View style={s.projectHeaderRow}>
                  <Text style={s.projectTitle}>{project.title}</Text>
                  {project.link && (
                    <Link style={s.projectUrl}>
                      {project.link.replace(/^https?:\/\//, "")}
                    </Link>
                  )}
                </View>
                {project.techstack.length > 0 && (
                  <Text style={s.projectTech}>
                    {project.techstack.join(", ")}
                  </Text>
                )}
                <Text style={s.projectDesc}>
                  {stripMarkdown(project.description.split("\n\n")[0])}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
