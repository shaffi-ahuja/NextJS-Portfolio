const PortfolioTemplate = {
  features: {
    showProjects: true,
    showWorkExperience: true,
    showContact: true,
    showBuildSection: true,
  },

  sections: {
    projects: { showInResume: true, showInPortfolio: true },
    workExperience: { showInResume: true, showInPortfolio: true },
    education: { showInResume: true, showInPortfolio: true },
    certifications: { showInResume: true, showInPortfolio: true },
    contact: { showInResume: false, showInPortfolio: true },
    buildSection: { showInPortfolio: true },
  },

  Intro: {
    FirstName: "",
    LastName: "",
    OneLinerIntro: "",
    Theme: "",
    profileImage: "",
    phone: "",
  },

  AboutMe: {
    gender: "",
    experience: {
      yearsOfExperience: 0,
      experienceSummary: "",
    },

    locationOfWork: {
      timeZone: "",
      locatedAt: "",
    },

    passion: {
      passionTitle: "",
      passionDescription: "",
    },

    skills: [],

    email: "",
  },

  ContactMe: {
    contactMeFor: "",
    email: "",
  },

  Projects: [
    {
      icon: "",
      title: "",
      description: "",
      techstack: [],
      link: "",
    },
  ],

  WorkExperience: [
    {
      image: "",
      company: "",
      title: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      isCurrentJob: false,
      description: "",
    },
  ],

  Education: [
    {
      type: "",
      institutionName: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      grade: "",
      location: "",
    },
  ],

  Certifications: [
    {
      name: "",
      organization: "",
      date: "",
      credentialUrl: "",
    },
  ],

  Footer: {
    FirstName: "",
    LastName: "",
    github: "",
    linkedin: "",
    leetcode: "",
  },
};

export default PortfolioTemplate;
