/**
 * Schema Validation Tests
 * Place at: src/__tests__/lib/schema.test.ts
 */

import { PortfolioSchema, ProjectSchema, WorkExperienceSchema, EducationSchema, CertificationSchema } from '@/lib/schema';
import { minimalValidPortfolio, invalidPortfolio, edgeCasePortfolios, portfolioFormData } from '../fixtures/portfolio.fixture';

describe('Schema Validation', () => {
  describe('PortfolioSchema', () => {
    test('should validate complete valid portfolio', () => {
      const result = PortfolioSchema.safeParse(minimalValidPortfolio);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe('testuser123');
        expect(result.data.Intro.FirstName).toBe('John');
      }
    });

    test('should reject portfolio with missing required fields', () => {
      const invalid = { ...minimalValidPortfolio, slug: undefined };
      const result = PortfolioSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.slug).toBeDefined();
      }
    });

    test('should reject invalid slug format', () => {
      const invalid = { ...minimalValidPortfolio, slug: 'Invalid_Slug!' };
      const result = PortfolioSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject slug that is too short', () => {
      const invalid = { ...minimalValidPortfolio, slug: 'ab' }; // < 3 chars
      const result = PortfolioSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should reject slug that is too long', () => {
      const invalid = { ...minimalValidPortfolio, slug: 'a'.repeat(41) }; // > 40 chars
      const result = PortfolioSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should accept slug at boundary lengths', () => {
      const valid3 = { ...minimalValidPortfolio, slug: 'abc' };
      const valid40 = { ...minimalValidPortfolio, slug: 'a'.repeat(40) };
      
      expect(PortfolioSchema.safeParse(valid3).success).toBe(true);
      expect(PortfolioSchema.safeParse(valid40).success).toBe(true);
    });

    test('should validate email format in AboutMe', () => {
      const validEmail = { ...minimalValidPortfolio, AboutMe: { ...minimalValidPortfolio.AboutMe, email: 'user@domain.com' } };
      const invalidEmail = { ...minimalValidPortfolio, AboutMe: { ...minimalValidPortfolio.AboutMe, email: 'not-an-email' } };
      
      expect(PortfolioSchema.safeParse(validEmail).success).toBe(true);
      expect(PortfolioSchema.safeParse(invalidEmail).success).toBe(false);
    });

    test('should require at least one work experience', () => {
      const noWork = { ...minimalValidPortfolio, WorkExperience: [] };
      const result = PortfolioSchema.safeParse(noWork);
      expect(result.success).toBe(false);
    });

    test('should require at least one skill', () => {
      const noSkills = { ...minimalValidPortfolio, AboutMe: { ...minimalValidPortfolio.AboutMe, skills: [] } };
      const result = PortfolioSchema.safeParse(noSkills);
      expect(result.success).toBe(false);
    });

    test('should allow optional fields to be undefined', () => {
      const optional = { ...minimalValidPortfolio, Projects: null, Education: [], Certifications: [] };
      const result = PortfolioSchema.safeParse(optional);
      expect(result.success).toBe(true);
    });

    test('should accept max length strings', () => {
      const result = PortfolioSchema.safeParse(edgeCasePortfolios.maxLength);
      expect(result.success).toBe(true);
    });

    test('should accept special characters in names', () => {
      const result = PortfolioSchema.safeParse(edgeCasePortfolios.specialCharacters);
      expect(result.success).toBe(true);
    });

    test('should accept unicode characters', () => {
      const result = PortfolioSchema.safeParse(edgeCasePortfolios.unicode);
      expect(result.success).toBe(true);
    });

    test('should extract proper TypeScript types', () => {
      const result = PortfolioSchema.safeParse(minimalValidPortfolio);
      if (result.success) {
        const portfolio = result.data;
        // Type checking at compile time
        const name: string = portfolio.Intro.FirstName;
        const email: string = portfolio.AboutMe.email;
        expect(typeof name).toBe('string');
        expect(typeof email).toBe('string');
      }
    });

    test('should support legacy features flag', () => {
      const legacy = {
        ...minimalValidPortfolio,
        features: {
          showProjects: false,
          showWorkExperience: false,
          showContact: false,
          showBuildSection: false,
        },
      };
      const result = PortfolioSchema.safeParse(legacy);
      expect(result.success).toBe(true);
    });
  });

  describe('ProjectSchema', () => {
    const validProject = {
      icon: 'project.png',
      title: 'My Project',
      role: 'Creator',
      description: 'This is a great project',
      techstack: ['react', 'typescript'],
      link: 'https://example.com',
      githubUrl: 'https://github.com/example/project',
    };

    test('should validate valid project', () => {
      const result = ProjectSchema.safeParse(validProject);
      expect(result.success).toBe(true);
    });

    test('should require title and description', () => {
      const invalid = { ...validProject, title: '', description: '' };
      const result = ProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should validate URLs', () => {
      const validUrls = { ...validProject, link: 'https://example.com' };
      const invalidUrls = { ...validProject, link: 'not-a-url' };
      
      expect(ProjectSchema.safeParse(validUrls).success).toBe(true);
      expect(ProjectSchema.safeParse(invalidUrls).success).toBe(false);
    });

    test('should allow empty techstack', () => {
      const result = ProjectSchema.safeParse({ ...validProject, techstack: [] });
      expect(result.success).toBe(true);
    });
  });

  describe('WorkExperienceSchema', () => {
    const validWork = {
      image: 'company.png',
      company: 'Tech Corp',
      title: 'Senior Engineer',
      location: 'USA',
      startMonth: 'January',
      startYear: '2021',
      endMonth: 'December',
      endYear: '2023',
      isCurrentJob: false,
      description: 'Lead development efforts',
    };

    test('should validate valid work experience', () => {
      const result = WorkExperienceSchema.safeParse(validWork);
      expect(result.success).toBe(true);
    });

    test('should require company and title', () => {
      const invalid = { ...validWork, company: '', title: '' };
      const result = WorkExperienceSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should allow current job without end date', () => {
      const current = { ...validWork, endMonth: '', endYear: '', isCurrentJob: true };
      const result = WorkExperienceSchema.safeParse(current);
      expect(result.success).toBe(true);
    });

    test('should validate start year is 4 digits', () => {
      const invalid = { ...validWork, startYear: '21' };
      const result = WorkExperienceSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('EducationSchema', () => {
    const validEducation = {
      type: 'degree' as const,
      institutionName: 'University',
      fieldOfStudy: 'Computer Science',
      startYear: '2015',
      endYear: '2019',
      grade: '3.8',
      location: 'USA',
    };

    test('should validate valid education', () => {
      const result = EducationSchema.safeParse(validEducation);
      expect(result.success).toBe(true);
    });

    test('should require institution name', () => {
      const invalid = { ...validEducation, institutionName: '' };
      const result = EducationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should accept valid education types', () => {
      const types = ['degree', '12th', '10th', 'diploma', 'other'];
      types.forEach(type => {
        const result = EducationSchema.safeParse({ ...validEducation, type });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('CertificationSchema', () => {
    const validCert = {
      name: 'AWS Solutions Architect',
      organization: 'Amazon',
      date: '2023',
      credentialUrl: 'https://example.com/cert',
    };

    test('should validate valid certification', () => {
      const result = CertificationSchema.safeParse(validCert);
      expect(result.success).toBe(true);
    });

    test('should require name and organization', () => {
      const invalid = { ...validCert, name: '', organization: '' };
      const result = CertificationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    test('should allow empty credential URL', () => {
      const result = CertificationSchema.safeParse({ ...validCert, credentialUrl: '' });
      expect(result.success).toBe(true);
    });
  });
});
