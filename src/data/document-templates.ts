import { FileText, Building, Home, Scale, Users } from "lucide-react";

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  icon: any;
  fields: TemplateField[];
  generateContent: (data: Record<string, string>) => string;
}

const styles = {
  body: `font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #333;`,
  container: `max-width: 8.5in; margin: 0 auto; padding: 1in;`,
  header: `text-align: center; margin-bottom: 24pt; padding-bottom: 12pt; border-bottom: 1px solid #ccc;`,
  headerH1: `font-family: Arial, Helvetica, sans-serif; font-size: 28pt; font-weight: bold; color: #000; margin: 0;`,
  docTitle: `font-family: Arial, Helvetica, sans-serif; font-size: 16pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 24pt; color: #000;`,
  sectionTitle: `font-family: Arial, Helvetica, sans-serif; font-size: 14pt; font-weight: bold; margin-top: 20pt; margin-bottom: 10pt; color: #000; border-bottom: 1px solid #eee; padding-bottom: 4pt;`,
  p: `margin-bottom: 12pt; text-align: justify;`,
  signatureSection: `width: 100%; margin-top: 50pt; border-collapse: collapse;`,
  signatureBlock: `width: 50%; vertical-align: bottom;`,
  signatureLine: `margin-top: 40px; border-bottom: 1px solid #000; height: 1px;`,
  signatureName: `margin-top: 8pt;`,
  footer: `text-align: center; font-size: 9pt; color: #888; margin-top: 40pt; border-top: 1px solid #ccc; padding-top: 10pt;`
};

const generateHtmlWrapper = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
</head>
<body style="${styles.body}">
  <div class="document-container" style="${styles.container}">
    <div style="${styles.header}">
      <h1 style="${styles.headerH1}">Justicaa</h1>
    </div>
    <h2 style="${styles.docTitle}">${title}</h2>
    ${content}
    <div style="${styles.footer}">
      This document was generated using Justicaa. It is intended for informational purposes and does not constitute legal advice. Please consult a qualified attorney for your specific needs.
    </div>
  </div>
</body>
</html>
`;

const generateNDAContent = (data: Record<string, string>) => `
    <p style="${styles.p}">This Non-Disclosure Agreement (the "Agreement") is entered into as of <strong>${data.start_date || new Date().toLocaleDateString()}</strong> by and between:</p>
    <p style="${styles.p}"><strong>Disclosing Party:</strong> ${data.disclosing_party || '____________________'}</p>
    <p style="${styles.p}"><strong>Receiving Party:</strong> ${data.receiving_party || '____________________'}</p>
    
    <h3 style="${styles.sectionTitle}">1. Purpose of Disclosure</h3>
    <p style="${styles.p}">The parties intend to engage in discussions concerning: <strong>${data.purpose || '____________________'}</strong>. In connection with these discussions, the Disclosing Party may disclose certain confidential information to the Receiving Party.</p>
    
    <h3 style="${styles.sectionTitle}">2. Definition of Confidential Information</h3>
    <p style="${styles.p}">For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. This includes, but is not limited to, business plans, customer lists, financial information, and technical data.</p>
    
    <h3 style="${styles.sectionTitle}">3. Term of Agreement</h3>
    <p style="${styles.p}">The non-disclosure provisions of this Agreement shall remain in effect for a period of <strong>${data.duration || '____________________'}</strong> from the date of this Agreement.</p>
    
    <h3 style="${styles.sectionTitle}">4. Governing Law</h3>
    <p style="${styles.p}">This Agreement shall be governed by and construed in accordance with the laws of the State of <strong>${data.governing_law || '____________________'}</strong>.</p>
    
    <table style="${styles.signatureSection}">
      <tr>
        <td style="${styles.signatureBlock} padding-right: 20px;">
          <div style="${styles.signatureLine}"></div>
          <p style="${styles.signatureName}"><strong>Disclosing Party Signature</strong></p>
          <p>Name: ${data.disclosing_party || ''}</p>
        </td>
        <td style="${styles.signatureBlock} padding-left: 20px;">
          <div style="${styles.signatureLine}"></div>
          <p style="${styles.signatureName}"><strong>Receiving Party Signature</strong></p>
          <p>Name: ${data.receiving_party || ''}</p>
        </td>
      </tr>
    </table>
`;

const generateServiceAgreementContent = (data: Record<string, string>) => `
    <p style="${styles.p}">This Service Agreement ("Agreement") is made effective as of <strong>${data.start_date || new Date().toLocaleDateString()}</strong> by and between:</p>
    <p style="${styles.p}"><strong>Service Provider:</strong> ${data.service_provider || '____________________'}</p>
    <p style="${styles.p}"><strong>Client:</strong> ${data.client_name || '____________________'}</p>

    <h3 style="${styles.sectionTitle}">1. Description of Services</h3>
    <p style="${styles.p}">The Service Provider will provide the following services to the Client: ${data.services_description || '____________________'}.</p>
    
    <h3 style="${styles.sectionTitle}">2. Payment for Services</h3>
    <p style="${styles.p}">The Client will pay a fee of <strong>${data.payment_amount || '____________________'}</strong> for the services. Payment will be made according to the following schedule: <strong>${data.payment_schedule || '____________________'}</strong>.</p>
    
    <h3 style="${styles.sectionTitle}">3. Term of Agreement</h3>
    <p style="${styles.p}">This Agreement will begin on <strong>${data.start_date || '____________________'}</strong> and is expected to be completed by <strong>${data.completion_date || '____________________'}</strong>.</p>
    
    <table style="${styles.signatureSection}">
      <tr>
        <td style="${styles.signatureBlock} padding-right: 20px;">
          <div style="${styles.signatureLine}"></div>
          <p style="${styles.signatureName}"><strong>Service Provider Signature</strong></p>
          <p>Name: ${data.service_provider || ''}</p>
        </td>
        <td style="${styles.signatureBlock} padding-left: 20px;">
          <div style="${styles.signatureLine}"></div>
          <p style="${styles.signatureName}"><strong>Client Signature</strong></p>
          <p>Name: ${data.client_name || ''}</p>
        </td>
      </tr>
    </table>
`;

const generateRentalApplicationContent = (data: Record<string, string>) => `
    <h3 style="${styles.sectionTitle}">Applicant Information</h3>
    <p style="${styles.p}"><strong>Full Name:</strong> ${data.applicant_name || '____________________'}</p>
    <p style="${styles.p}"><strong>Current Address:</strong> ${data.current_address || '____________________'}</p>
    
    <h3 style="${styles.sectionTitle}">Employment Information</h3>
    <p style="${styles.p}"><strong>Current Employer:</strong> ${data.employer || '____________________'}</p>
    <p style="${styles.p}"><strong>Employment Duration:</strong> ${data.employment_duration || '____________________'}</p>
    <p style="${styles.p}"><strong>Gross Monthly Income:</strong> ${data.monthly_income ? '₹' + data.monthly_income : '____________________'}</p>
    
    <h3 style="${styles.sectionTitle}">References</h3>
    <p style="${styles.p}">${data.references || '____________________'}</p>
    
    <h3 style="${styles.sectionTitle}">Declaration</h3>
    <p style="${styles.p}">I hereby certify that the information provided in this application is true and correct to the best of my knowledge. I authorize the landlord or their agent to verify the information provided, including contacting my employer and references, and to obtain a copy of my credit report.</p>
    
    <table style="${styles.signatureSection}">
      <tr>
        <td style="${styles.signatureBlock} padding-right: 20px;">
          <div style="${styles.signatureLine}"></div>
          <p style="${styles.signatureName}"><strong>Applicant Signature</strong></p>
        </td>
        <td style="${styles.signatureBlock} padding-left: 20px;">
          <div style="${styles.signatureLine}"></div>
          <p style="${styles.signatureName}"><strong>Date</strong></p>
        </td>
      </tr>
    </table>
`;

const generateComplaintLetterContent = (data: Record<string, string>) => `
    <p style="${styles.p}">
        <strong>From:</strong><br>
        ${data.complainant_name || '[Your Name]'}<br>
        [Your Address]<br>
        [Your City, State, Pincode]<br>
        [Your Email]<br>
        [Your Phone Number]
    </p>
    <p style="${styles.p}"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p style="${styles.p}">
        <strong>To:</strong><br>
        Customer Service Department<br>
        <strong>${data.company_name || '[Company Name]'}</strong><br>
        [Company Address]<br>
        [Company City, State, Pincode]
    </p>
    <p style="${styles.p}"><strong>Subject: Formal Complaint Regarding Product/Service</strong></p>
    <p style="${styles.p}">Dear Sir/Madam,</p>
    <p style="${styles.p}">I am writing to file a formal complaint regarding a recent experience with your company. The details of my complaint are as follows:</p>
    <p style="${styles.p}"><em>${data.complaint_details || '[Detailed description of the complaint, including dates, product/service details, and what went wrong.]'}</em></p>
    <p style="${styles.p}">I have attempted to resolve this issue by [mention any previous attempts, e.g., calling customer service]. To resolve this problem, I would appreciate it if you could [state your desired resolution, e.g., provide a full refund, replace the product].</p>
    <p style="${styles.p}">I look forward to your prompt response and a resolution to this matter within 15 business days. If I do not hear from you, I will have no choice but to escalate this matter to the appropriate consumer protection agency.</p>
    <p style="${styles.p}">Sincerely,</p>
    <br><br>
    <div style="width: 50%;"><div style="${styles.signatureLine}"></div><p style="${styles.signatureName}"><strong>${data.complainant_name || '[Your Name]'}</strong></p></div>
`;

const generateEmploymentOfferContent = (data: Record<string, string>) => `
    <p style="${styles.p}"><strong>${data.company_name || '[Company Name]'}</strong><br>[Company Address]</p>
    <p style="${styles.p}"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p style="${styles.p}">
        <strong>${data.candidate_name || '[Candidate Name]'}</strong><br>
        [Candidate Address]
    </p>
    <p style="${styles.p}"><strong>Subject: Offer of Employment</strong></p>
    <p style="${styles.p}">Dear ${data.candidate_name || '[Candidate Name]'},</p>
    <p style="${styles.p}">On behalf of <strong>${data.company_name || '[Company Name]'}</strong>, I am pleased to offer you the position of <strong>${data.position_title || '[Position Title]'}</strong>. We were very impressed with your qualifications and believe you will be a valuable asset to our team.</p>
    
    <h3 style="${styles.sectionTitle}">Terms of Employment</h3>
    <p style="${styles.p}"><strong>Position:</strong> ${data.position_title || '[Position Title]'}</p>
    <p style="${styles.p}"><strong>Start Date:</strong> ${data.start_date || '[Start Date]'}</p>
    <p style="${styles.p}"><strong>Reporting Manager:</strong> ${data.reporting_manager || '[Reporting Manager]'}</p>
    <p style="${styles.p}"><strong>Salary:</strong> Your starting salary will be <strong>₹${data.salary || '[Salary]'}</strong> per annum, payable in monthly installments.</p>
    <p style="${styles.p}"><strong>Benefits:</strong> You will be eligible for our standard benefits package, which includes: ${data.benefits || '[Benefits Package]'}.</p>
    
    <p style="${styles.p}">This offer is contingent upon the successful completion of a background check.</p>
    <p style="${styles.p}">We are excited about the prospect of you joining our team. Please indicate your acceptance of this offer by signing and returning a copy of this letter by [Offer Expiry Date].</p>
    <p style="${styles.p}">Sincerely,</p>
    <br><br>
    <div style="width: 50%;"><div style="${styles.signatureLine}"></div><p style="${styles.signatureName}">[Hiring Manager Name]<br>[Hiring Manager Title]<br><strong>${data.company_name || '[Company Name]'}</strong></p></div>
    
    <hr style="margin-top: 40px; margin-bottom: 40px;">
    
    <h3 style="${styles.sectionTitle}">Acceptance of Offer</h3>
    <p style="${styles.p}">I, <strong>${data.candidate_name || '[Candidate Name]'}</strong>, accept the offer of employment from <strong>${data.company_name || '[Company Name]'}</strong> on the terms and conditions outlined in this letter.</p>
    <table style="${styles.signatureSection}">
        <tr>
            <td style="${styles.signatureBlock} padding-right: 20px;"><div style="${styles.signatureLine}"></div><p style="${styles.signatureName}"><strong>Signature</strong></p></td>
            <td style="${styles.signatureBlock} padding-left: 20px;"><div style="${styles.signatureLine}"></div><p style="${styles.signatureName}"><strong>Date</strong></p></td>
        </tr>
    </table>
`;

export const templates: DocumentTemplate[] = [
    {
      id: "nda",
      title: "Non-Disclosure Agreement (NDA)",
      description: "Protect confidential information shared between parties",
      category: "business",
      difficulty: "Beginner",
      estimatedTime: "10-15 min",
      icon: FileText,
      fields: [
        { id: "disclosing_party", label: "Disclosing Party Name", type: "text", required: true, placeholder: "Company or Individual Name" },
        { id: "receiving_party", label: "Receiving Party Name", type: "text", required: true, placeholder: "Company or Individual Name" },
        { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "Describe the reason for sharing confidential information" },
        { id: "duration", label: "Agreement Duration", type: "select", required: true, options: ["1 Year", "2 Years", "3 Years", "5 Years", "Indefinite"] },
        { id: "governing_law", label: "Governing Law (State)", type: "text", required: true, placeholder: "e.g., California" }
      ],
      generateContent: (data) => generateHtmlWrapper("Non-Disclosure Agreement (NDA)", generateNDAContent(data))
    },
    {
      id: "service-agreement",
      title: "Service Agreement Contract",
      description: "Contract for professional services between client and provider",
      category: "business",
      difficulty: "Intermediate",
      estimatedTime: "20-25 min",
      icon: Building,
      fields: [
        { id: "service_provider", label: "Service Provider", type: "text", required: true, placeholder: "Your business name" },
        { id: "client_name", label: "Client Name", type: "text", required: true, placeholder: "Client's name or company" },
        { id: "services_description", label: "Services Description", type: "textarea", required: true, placeholder: "Detailed description of services to be provided" },
        { id: "payment_amount", label: "Payment Amount", type: "text", required: true, placeholder: "e.g., $5,000 or $100/hour" },
        { id: "payment_schedule", label: "Payment Schedule", type: "select", required: true, options: ["Upon completion", "Monthly", "Bi-weekly", "Weekly", "50% upfront, 50% completion"] },
        { id: "start_date", label: "Start Date", type: "date", required: true },
        { id: "completion_date", label: "Expected Completion", type: "date", required: true }
      ],
      generateContent: (data) => generateHtmlWrapper("Service Agreement", generateServiceAgreementContent(data))
    },
    {
      id: "rent-agreement",
      title: "Rental Application Form",
      description: "Standard application for prospective tenants",
      category: "real-estate",
      difficulty: "Beginner",
      estimatedTime: "15-20 min",
      icon: Home,
      fields: [
        { id: "applicant_name", label: "Full Name", type: "text", required: true, placeholder: "Applicant's full legal name" },
        { id: "current_address", label: "Current Address", type: "textarea", required: true, placeholder: "Current residence address" },
        { id: "monthly_income", label: "Monthly Income", type: "text", required: true, placeholder: "Gross monthly income" },
        { id: "employer", label: "Current Employer", type: "text", required: true, placeholder: "Company name" },
        { id: "employment_duration", label: "Employment Duration", type: "text", required: true, placeholder: "How long at current job" },
        { id: "references", label: "References", type: "textarea", required: true, placeholder: "Previous landlord or personal references" }
      ],
      generateContent: (data) => generateHtmlWrapper("Rental Application Form", generateRentalApplicationContent(data))
    },
    {
      id: "complaint-letter",
      title: "Consumer Complaint Letter",
      description: "Letter to file a consumer complaint",
      category: "legal",
      difficulty: "Beginner",
      estimatedTime: "10 min",
      icon: FileText,
      fields: [
        { id: "complainant_name", label: "Your Name", type: "text", required: true },
        { id: "company_name", label: "Company Name", type: "text", required: true },
        { id: "complaint_details", label: "Complaint Details", type: "textarea", required: true },
      ],
      generateContent: (data) => generateHtmlWrapper("Consumer Complaint Letter", generateComplaintLetterContent(data))
    },
    {
      id: "employment-contract",
      title: "Employment Offer Letter",
      description: "Formal job offer with terms and conditions",
      category: "business",
      difficulty: "Intermediate",
      estimatedTime: "15-20 min",
      icon: Users,
      fields: [
        { id: "company_name", label: "Company Name", type: "text", required: true, placeholder: "Your company name" },
        { id: "candidate_name", label: "Candidate Name", type: "text", required: true, placeholder: "Job candidate's name" },
        { id: "position_title", label: "Position Title", type: "text", required: true, placeholder: "Job title" },
        { id: "salary", label: "Annual Salary", type: "text", required: true, placeholder: "e.g., $75,000" },
        { id: "start_date", label: "Start Date", type: "date", required: true },
        { id: "benefits", label: "Benefits Package", type: "textarea", required: true, placeholder: "Health insurance, PTO, etc." },
        { id: "reporting_manager", label: "Reporting Manager", type: "text", required: true, placeholder: "Direct supervisor's name" }
      ],
      generateContent: (data) => generateHtmlWrapper("Employment Offer Letter", generateEmploymentOfferContent(data))
    }
];