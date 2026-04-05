import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Line,
  Svg,
} from "@react-pdf/renderer";
import type { Portfolio } from "@/lib/schema";
import { calculateYearsOfExperience, getSectionVisibility } from "@/lib/utils";

const BLACK = "#000000";
const DARK = "#111111";
const GREY = "#444444";

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
  jobTitle: { fontSize: 10, color: GREY, marginTop: 15 },
  contactBlock: {
    textAlign: "right",
    fontSize: 9,
    color: DARK,
    lineHeight: 1.7,
  },
  section: { marginTop: 10 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: BLACK,
    marginBottom: 4,
  },
  summaryText: { fontSize: 9.5, color: GREY, lineHeight: 1.55 },
  skillRow: { flexDirection: "row", marginBottom: 3, paddingLeft: 6 },
  skillDot: { width: 10, fontSize: 9.5, color: GREY },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    width: 110,
    flexShrink: 0,
  },
  skillValue: { flex: 1, fontSize: 9.5, color: GREY ,textTransform:'capitalize'},
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
  bullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 6 },
  bulletDot: { width: 10, fontSize: 9.5, color: GREY },
  bulletText: { flex: 1, fontSize: 9.5, color: GREY, lineHeight: 1.45 },
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
  projectUrl: { fontSize: 8.5, color: GREY, textAlign: "right" },
  projectTech: {
    fontSize: 8.5,
    color: GREY,
    fontFamily: "Helvetica-Oblique",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  projectDesc: { fontSize: 9.5, color: GREY, lineHeight: 1.45 },
  eduItem: { marginBottom: 8 },
  eduHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  eduMain: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    flex: 1,
  },
  eduDates: { fontSize: 9, color: GREY, textAlign: "right" },
  eduSub: { fontSize: 9, color: GREY, marginTop: 1 },
  certItem: { marginBottom: 6 },
  certHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  certName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: DARK,
    flex: 1,
  },
  certDate: { fontSize: 9, color: GREY, textAlign: "right" },
  certOrg: { fontSize: 9, color: GREY, marginTop: 1 },
});

function Divider() {
  return (
    <View style={{ marginBottom: 6 }}>
      <Svg height={1} width={528}>
        <Line x1={0} y1={0} x2={528} y2={0} strokeWidth={0.8} stroke={BLACK} />
      </Svg>
    </View>
  );
}

function formatWork(work: Portfolio["WorkExperience"][0]): string {
  const start = [work.startMonth, work.startYear].filter(Boolean).join(" ");
  if (work.isCurrentJob) return `${start} - Present`;
  const end = [work.endMonth, work.endYear].filter(Boolean).join(" ");
  return end ? `${start} - ${end}` : start;
}

function strip(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#+\s/g, "")
    .trim();
}

function buildSkillCategories(skills: string[]) {
  const map = [
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
      keywords: ["git", "docker", "aws", "terraform", "webpack", "vite"],
    },
    {
      label: "Backend",
      keywords: [
        "dotnet",
        "cs",
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
    const matched = skills.filter((s) =>
      keywords.some((k) => s.toLowerCase().includes(k)),
    );
    if (matched.length) {
      matched.forEach((s) => used.add(s));
      result.push({ label, value: matched.join(", ") });
    }
  }
  const extras = skills.filter((s) => !used.has(s));
  if (extras.length) result.push({ label: "Other", value: extras.join(", ") });
  return result;
}

const EDU_TYPE: Record<string, string> = {
  degree: "",
  "12th": "Class XII —",
  "10th": "Class X —",
  diploma: "Diploma —",
  other: "",
};

export default function ResumePDF({ portfolio }: { portfolio: Portfolio }) {
  const { Intro, AboutMe, WorkExperience, Projects, Footer: Foot } = portfolio;
  const Education = portfolio.Education ?? [];
  const Certs = portfolio.Certifications ?? [];

  // Resolve section visibility for resume
  const vis = getSectionVisibility(portfolio);

  const years = calculateYearsOfExperience(WorkExperience);
  const yearsDisplay = Number.isInteger(years) ? `${years}` : years.toFixed(1);
  const fullName = `${Intro.FirstName} ${Intro.LastName}`;
  const skillCats = buildSkillCategories(AboutMe.skills);
  const summary = `Frontend Developer with ${yearsDisplay}+ years of experience. ${strip(AboutMe.experience.experienceSummary)}`;

  return (
    <Document title={`${fullName} — Resume`} author={fullName} subject="Resume">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.name}>{fullName}</Text>
            <Text style={s.jobTitle}>{Intro.OneLinerIntro}</Text>
          </View>
          <View style={s.contactBlock}>
            {Intro.phone && <Text>{Intro.phone}</Text>}
            {AboutMe.email && <Text>{AboutMe.email}</Text>}
            {Foot?.github && <Text>{Foot.github.replace("https://", "")}</Text>}
            {Foot?.linkedin && (
              <Text>{Foot.linkedin.replace("https://", "")}</Text>
            )}
          </View>
        </View>

        {/* Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Professional Summary</Text>
          <Divider />
          <Text style={s.summaryText}>{summary}</Text>
        </View>

        {/* Skills */}
        {skillCats.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <Divider />
            {skillCats.map((cat) => (
              <View key={cat.label} style={s.skillRow}>
                <Text style={s.skillDot}>•</Text>
                <Text style={s.skillCategory}>{cat.label}:</Text>
                <Text style={s.skillValue}>{cat.value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Work Experience */}
        {vis.showWorkInResume && WorkExperience.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Work Experience</Text>
            <Divider />
            {WorkExperience.map((w, i) => (
              <View key={i} style={s.workItem}>
                <View style={s.workHeaderRow}>
                  <Text style={s.workCompanyRole}>
                    {w.company} — {w.title}
                  </Text>
                  <Text style={s.workDates}>{formatWork(w)}</Text>
                </View>
                {w.description
                  .split("\n")
                  .filter(Boolean)
                  .map((line, j) => (
                    <View key={j} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{strip(line)}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {vis.showProjectsInResume && Projects && Projects.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects</Text>
            <Divider />
            {Projects.map((p, i) => (
              <View key={i} style={s.projectItem}>
                <View style={s.projectHeaderRow}>
                  <Text style={s.projectTitle}>{p.title}</Text>
                  {p.link && (
                    <Text style={s.projectUrl}>
                      {p.link.replace(/^https?:\/\//, "")}
                    </Text>
                  )}
                </View>
                {p.techstack.length > 0 && (
                  <Text style={s.projectTech}>{p.techstack.join(", ")}</Text>
                )}
                <Text style={s.projectDesc}>
                  {strip(p.description.split("\n\n")[0])}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {vis.showEducationInResume && Education.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            <Divider />
            {Education.map((edu, i) => (
              <View key={i} style={s.eduItem}>
                <View style={s.eduHeaderRow}>
                  <Text style={s.eduMain}>
                    {EDU_TYPE[edu.type] ? `${EDU_TYPE[edu.type]} ` : ""}
                    {edu.institutionName}
                  </Text>
                  {(edu.startYear || edu.endYear) && (
                    <Text style={s.eduDates}>
                      {[edu.startYear, edu.endYear].filter(Boolean).join(" — ")}
                    </Text>
                  )}
                </View>
                {edu.fieldOfStudy && (
                  <Text style={s.eduSub}>{edu.fieldOfStudy}</Text>
                )}
                {(edu.grade || edu.location) && (
                  <Text style={s.eduSub}>
                    {[edu.grade, edu.location].filter(Boolean).join(" · ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {vis.showCertsInResume && Certs.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            <Divider />
            {Certs.map((c, i) => (
              <View key={i} style={s.certItem}>
                <View style={s.certHeaderRow}>
                  <Text style={s.certName}>{c.name}</Text>
                  {c.date && <Text style={s.certDate}>{c.date}</Text>}
                </View>
                <Text style={s.certOrg}>{c.organization}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
