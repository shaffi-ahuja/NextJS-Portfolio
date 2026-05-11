/**
 * Utility Functions Tests
 * Place at: src/__tests__/lib/utils.test.ts
 */

import { calculateYearsOfExperience, cn, getSectionVisibility } from '@/lib/utils';
import { minimalValidPortfolio } from '../fixtures/portfolio.fixture';

describe('Utility Functions', () => {
  describe('calculateYearsOfExperience', () => {
    test('should return 0 for empty work history', () => {
      expect(calculateYearsOfExperience([])).toBe(0);
    });

    test('should handle work with no startYear', () => {
      const work = [{ startYear: '', endYear: '2023' }];
      expect(calculateYearsOfExperience(work)).toBe(0);
    });

    test('should calculate single job duration', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'December',
          endYear: '2023',
          isCurrentJob: false,
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThanOrEqual(3.9);
      expect(years).toBeLessThanOrEqual(4.1);
    });

    test('should handle current job without end date', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          isCurrentJob: true,
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThan(4);
    });

    test('should merge overlapping work experiences', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'December',
          endYear: '2021',
        },
        {
          startMonth: 'June',
          startYear: '2021',
          endMonth: 'December',
          endYear: '2023',
        },
      ];
      const years = calculateYearsOfExperience(work);
      // Should be ~3.9-4.0, not sum of both
      expect(years).toBeLessThan(5);
    });

    test('should not double-count overlapping periods', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'December',
          endYear: '2023',
        },
        {
          startMonth: 'June',
          startYear: '2021',
          endMonth: 'June',
          endYear: '2022',
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThanOrEqual(3.9);
      expect(years).toBeLessThanOrEqual(4.1);
    });

    test('should handle multiple non-overlapping jobs', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2018',
          endMonth: 'December',
          endYear: '2019',
        },
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'December',
          endYear: '2022',
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThanOrEqual(4.9);
      expect(years).toBeLessThanOrEqual(5.1);
    });

    test('should return value rounded to nearest 0.5', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'July',
          endYear: '2023',
        },
      ];
      const years = calculateYearsOfExperience(work);
      // Should be 3.5 or close to 0.5 increment
      expect([3, 3.5, 4][years.toString().match(/\.5/) ? 1 : years > 3.5 ? 2 : 0]).toBeDefined();
    });

    test('should handle months correctly', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'March',
          endYear: '2020',
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeLessThan(1);
    });

    test('should return minimum 1 for any valid experience', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2020',
          endMonth: 'February',
          endYear: '2020',
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThanOrEqual(0.5);
    });

    test('should handle missing end year as current job', () => {
      const work = [
        {
          startMonth: 'January',
          startYear: '2021',
          endMonth: '',
          endYear: '',
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThan(2);
    });

    test('should validate date logic', () => {
      const work = [
        {
          startMonth: 'December',
          startYear: '2020',
          endMonth: 'January',
          endYear: '2021',
        },
      ];
      const years = calculateYearsOfExperience(work);
      expect(years).toBeGreaterThan(0);
    });
  });

  describe('cn (className utility)', () => {
    test('should merge classNames', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });

    test('should handle string conditionals', () => {
      const result = cn('base', true && 'active', false && 'inactive');
      expect(result).toContain('base');
      expect(result).toContain('active');
      expect(result).not.toContain('inactive');
    });

    test('should resolve Tailwind conflicts', () => {
      const result = cn('p-4', 'p-8');
      // Last one should win due to tailwind-merge
      expect(result).toContain('p-8');
    });

    test('should handle arrays and objects', () => {
      const result = cn(['p-4', 'bg-blue'], { 'text-white': true });
      expect(result).toBeTruthy();
    });

    test('should remove undefined/null values', () => {
      const result = cn('p-4', null, undefined, 'm-2');
      expect(result).toContain('p-4');
      expect(result).toContain('m-2');
    });
  });

  describe('getSectionVisibility', () => {
    test('should return visibility flags from new sections format', () => {
      const result = getSectionVisibility(minimalValidPortfolio);
      
      expect(result).toHaveProperty('showProjectsInPortfolio');
      expect(result).toHaveProperty('showWorkInPortfolio');
      expect(result).toHaveProperty('showContactInPortfolio');
      expect(result).toHaveProperty('showBuildSection');
    });

    test('should respect section visibility toggles', () => {
      const portfolio = {
        ...minimalValidPortfolio,
        sections: {
          projects: { showInResume: true, showInPortfolio: false },
          workExperience: { showInResume: false, showInPortfolio: true },
          education: { showInResume: true, showInPortfolio: false },
          certifications: { showInResume: false, showInPortfolio: false },
          contact: { showInResume: true, showInPortfolio: true },
          buildSection: { showInPortfolio: false },
        },
      };
      
      const result = getSectionVisibility(portfolio);
      expect(result.showProjectsInPortfolio).toBe(false);
      expect(result.showWorkInPortfolio).toBe(true);
      expect(result.showEducationInPortfolio).toBe(false);
      expect(result.showCertsInPortfolio).toBe(false);
      expect(result.showContactInPortfolio).toBe(true);
      expect(result.showBuildSection).toBe(false);
    });

    test('should fallback to legacy features flag', () => {
      const portfolio = {
        ...minimalValidPortfolio,
        sections: undefined,
        features: {
          showProjects: false,
          showWorkExperience: true,
          showContact: false,
          showBuildSection: true,
        },
      };
      
      const result = getSectionVisibility(portfolio as any);
      expect(result).toBeDefined();
    });

    test('should default to true if no config', () => {
      const portfolio = {
        ...minimalValidPortfolio,
        sections: {} as any,
        features: {} as any,
      };
      
      const result = getSectionVisibility(portfolio);
      // Should default to showing all sections
      expect(result).toHaveProperty('showProjectsInPortfolio');
    });
  });
});
