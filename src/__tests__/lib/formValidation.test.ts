/**
 * Form Validation Tests
 * Place at: src/__tests__/lib/formValidation.test.ts
 */

import { validateForm, hasErrors, scrollToFirstError } from '@/lib/formValidation';
import { portfolioFormData } from '../fixtures/portfolio.fixture';
import type { SlugStatus } from '@/hooks/useSlugValidation';

describe('Form Validation', () => {
  describe('validateForm', () => {
    test('should return empty errors for valid form', () => {
      const errors = validateForm(portfolioFormData, 'available');
      expect(Object.keys(errors).length).toBe(0);
    });

    test('should reject empty firstName', () => {
      const invalid = { ...portfolioFormData, firstName: '' };
      const errors = validateForm(invalid, 'available');
      expect(errors.firstName).toBe('First name is required');
    });

    test('should reject empty lastName', () => {
      const invalid = { ...portfolioFormData, lastName: '' };
      const errors = validateForm(invalid, 'available');
      expect(errors.lastName).toBe('Last name is required');
    });

    test('should reject invalid slug format', () => {
      const invalid = { ...portfolioFormData, slug: 'Invalid_Slug!' };
      const errors = validateForm(invalid, 'available');
      expect(errors.slug).toBeDefined();
    });

    test('should reject taken slug', () => {
      const invalid = { ...portfolioFormData, slug: 'takenslug' };
      const errors = validateForm(invalid, 'taken');
      expect(errors.slug).toBe('This URL is already taken');
    });

    test('should reject short slug', () => {
      const invalid = { ...portfolioFormData, slug: 'ab' };
      const errors = validateForm(invalid, 'available');
      expect(errors.slug).toBeDefined();
    });

    test('should reject intro less than 10 characters', () => {
      const invalid = { ...portfolioFormData, oneLinerIntro: 'short' };
      const errors = validateForm(invalid, 'available');
      expect(errors.oneLinerIntro).toBe('Intro must be at least 10 characters');
    });

    test('should reject summary less than 20 characters', () => {
      const invalid = { ...portfolioFormData, experienceSummary: 'short' };
      const errors = validateForm(invalid, 'available');
      expect(errors.experienceSummary).toBe('Summary must be at least 20 characters');
    });

    test('should reject missing location', () => {
      const invalid = { ...portfolioFormData, locatedAt: '' };
      const errors = validateForm(invalid, 'available');
      expect(errors.locatedAt).toBe('Location is required');
    });

    test('should reject missing timezone', () => {
      const invalid = { ...portfolioFormData, timeZone: '' };
      const errors = validateForm(invalid, 'available');
      expect(errors.timeZone).toBe('Timezone is required');
    });

    test('should reject missing passion title', () => {
      const invalid = { ...portfolioFormData, passionTitle: '' };
      const errors = validateForm(invalid, 'available');
      expect(errors.passionTitle).toBe('Passion title is required');
    });

    test('should reject passion description less than 20 characters', () => {
      const invalid = { ...portfolioFormData, passionDescription: 'short' };
      const errors = validateForm(invalid, 'available');
      expect(errors.passionDescription).toBe('Description must be at least 20 characters');
    });

    test('should reject empty skills', () => {
      const invalid = { ...portfolioFormData, skills: [] };
      const errors = validateForm(invalid, 'available');
      expect(errors.skills).toBe('Select at least one skill');
    });

    test('should reject invalid email format', () => {
      const testCases = [
        { email: '', error: true },
        { email: 'not-an-email', error: true },
        { email: 'missing@domain', error: true },
        { email: 'user@domain.com', error: false },
        { email: 'user+tag@domain.co.uk', error: false },
      ];

      testCases.forEach(({ email, error }) => {
        const invalid = { ...portfolioFormData, email };
        const errors = validateForm(invalid, 'available');
        if (error) {
          expect(errors.email).toBeDefined();
        } else {
          expect(errors.email).toBeUndefined();
        }
      });
    });

    test('should reject short contact description', () => {
      const invalid = { ...portfolioFormData, contactMeFor: 'short' };
      const errors = validateForm(invalid, 'available');
      expect(errors.contactMeFor).toBeDefined();
    });

    test('should reject empty work experiences', () => {
      const invalid = { ...portfolioFormData, workExperiences: [] };
      const errors = validateForm(invalid, 'available');
      expect(errors).toBeDefined();
    });

    test('should reject work experience with missing company', () => {
      const invalid = {
        ...portfolioFormData,
        workExperiences: [
          { ...portfolioFormData.workExperiences[0], company: '' },
        ],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.work_company_0).toBe('Company is required');
    });

    test('should reject work experience with missing title', () => {
      const invalid = {
        ...portfolioFormData,
        workExperiences: [
          { ...portfolioFormData.workExperiences[0], title: '' },
        ],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.work_title_0).toBe('Job title is required');
    });

    test('should reject work experience with missing start year', () => {
      const invalid = {
        ...portfolioFormData,
        workExperiences: [
          { ...portfolioFormData.workExperiences[0], startYear: '' },
        ],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.work_start_0).toBe('Start year is required');
    });

    test('should reject work experience with missing description', () => {
      const invalid = {
        ...portfolioFormData,
        workExperiences: [
          { ...portfolioFormData.workExperiences[0], description: '' },
        ],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.work_desc_0).toBe('Description is required');
    });

    test('should reject education with missing institution name', () => {
      const invalid = {
        ...portfolioFormData,
        education: [{ type: 'degree' as const, institutionName: '', fieldOfStudy: '', startYear: '', endYear: '', grade: '', location: '' }],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.edu_name_0).toBe('Institution name is required');
    });

    test('should reject certification with missing name', () => {
      const invalid = {
        ...portfolioFormData,
        certifications: [{ name: '', organization: 'Udemy', date: '', credentialUrl: '' }],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.cert_name_0).toBe('Certification name is required');
    });

    test('should reject certification with missing organization', () => {
      const invalid = {
        ...portfolioFormData,
        certifications: [{ name: 'AWS', organization: '', date: '', credentialUrl: '' }],
      };
      const errors = validateForm(invalid, 'available');
      expect(errors.cert_org_0).toBe('Organization is required');
    });

    test('should handle checking slug status', () => {
      const slugStatuses: SlugStatus[] = ['idle', 'checking', 'available', 'taken', 'invalid'];
      
      slugStatuses.forEach(status => {
        const errors = validateForm(portfolioFormData, status);
        if (status === 'taken') {
          expect(errors.slug).toBeDefined();
        } else if (status === 'invalid') {
          // Slug format is still valid
          expect(errors.slug).toBeUndefined();
        }
      });
    });
  });

  describe('hasErrors', () => {
    test('should return false when no errors', () => {
      expect(hasErrors({})).toBe(false);
    });

    test('should return true when errors present', () => {
      expect(hasErrors({ firstName: 'Required' })).toBe(true);
    });

    test('should handle multiple errors', () => {
      const errors = {
        firstName: 'Required',
        email: 'Invalid format',
        slug: 'Already taken',
      };
      expect(hasErrors(errors)).toBe(true);
    });
  });

  describe('scrollToFirstError', () => {
    test('should scroll to element with data-error attribute', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('data-error', 'true');
      document.body.appendChild(mockElement);

      const scrollIntoViewMock = jest.fn();
      mockElement.scrollIntoView = scrollIntoViewMock;

      scrollToFirstError();

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });

      document.body.removeChild(mockElement);
    });

    test('should handle no error elements', () => {
      // Should not throw
      expect(() => scrollToFirstError()).not.toThrow();
    });
  });
});
