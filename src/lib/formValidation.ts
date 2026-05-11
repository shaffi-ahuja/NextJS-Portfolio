/**
 * Form validation utilities
 * Extracted from UserForm to keep validation logic separate from UI
 */
import { SlugStatus } from "@/hooks/useSlugValidation";
import { PortfolioFormData } from "@/lib/schema";

export interface FormErrors {
  [key: string]: string;
}

export function validateForm(
  form: PortfolioFormData,
  slugStatus: SlugStatus,
): FormErrors {
  const errors: FormErrors = {};

  // Identity validations
  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";
  if (!form.slug || !/^[a-z0-9-]{3,40}$/.test(form.slug))
    errors.slug = "Invalid slug format";
  if (slugStatus === "taken") errors.slug = "This URL is already taken";

  // About you validations
  if (!form.oneLinerIntro || form.oneLinerIntro.length < 10)
    errors.oneLinerIntro = "Intro must be at least 10 characters";
  if (!form.experienceSummary || form.experienceSummary.length < 20)
    errors.experienceSummary = "Summary must be at least 20 characters";
  if (!form.locatedAt.trim()) errors.locatedAt = "Location is required";
  if (!form.timeZone.trim()) errors.timeZone = "Timezone is required";
  if (!form.passionTitle.trim())
    errors.passionTitle = "Passion title is required";
  if (!form.passionDescription || form.passionDescription.length < 20)
    errors.passionDescription = "Description must be at least 20 characters";

  // Skills and contact validations
  if (form.skills.length === 0) errors.skills = "Select at least one skill";
  if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
    errors.email = "Valid email is required";
  if (!form.contactMeFor || form.contactMeFor.length < 10)
    errors.contactMeFor = "Contact description required";

  // Work experience validations
  form.workExperiences.forEach((w, i) => {
    if (!w.company.trim()) errors[`work_company_${i}`] = "Company is required";
    if (!w.title.trim()) errors[`work_title_${i}`] = "Job title is required";
    if (!w.startYear.trim())
      errors[`work_start_${i}`] = "Start year is required";
    if (!w.description.trim())
      errors[`work_desc_${i}`] = "Description is required";
  });

  // Education validations
  form.education.forEach((edu, i) => {
    if (!edu.institutionName.trim())
      errors[`edu_name_${i}`] = "Institution name is required";
  });

  // Certification validations
  form.certifications.forEach((cert, i) => {
    if (!cert.name.trim())
      errors[`cert_name_${i}`] = "Certification name is required";
    if (!cert.organization.trim())
      errors[`cert_org_${i}`] = "Organization is required";
  });

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function scrollToFirstError(): void {
  document
    .querySelector('[data-error="true"]')
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}
