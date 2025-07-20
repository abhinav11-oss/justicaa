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

const generateHtmlWrapper = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:wght@400;700&display=swap');
  body {
    font-family: 'Lora', 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #333333;
  }
  .document-container {
    max-width: 6.5in;
    margin: 0 auto;
    padding: 0.5in 1in;
  }
  .header {
    text-align: center;
    margin-bottom: 30pt;
    border-bottom: 1px solid #cccccc;
    padding-bottom: 15pt;
  }
  .header h1 {
    font-family: 'Inter', sans-serif;
    font-size: 24pt;
    font-weight: bold;
    color: #262626;
    margin: 0;
  }
  .document-title {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 24pt;
  }
  h2 {
    font-family: 'Inter', sans-serif;
    font-size: 14pt;
    font-weight: bold;
    margin-top: 20pt;
    margin-bottom: 10pt;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 4pt;
    color: #333333;
  }
  p {
    margin-bottom: 12pt;
    text-align: justify;
  }
  strong {
    font-weight: bold;
  }
  ul {
    list-style-type: disc;
    padding-left: 20pt;
  }
  li {
    margin-bottom: 8pt;
  }
  .signature-section {
    width: 100%;
    margin-top: 50pt;
    border: none;
    border-collapse: collapse;
  }
  .signature-block {
    width: 50%;
    vertical-align: bottom;
  }
  .signature-line {
    border-top: 1px solid #000000;
    padding-top: 5px;
    margin-top: 40px;
  }
  .footer {
    text-align: center;
    font-size: 9pt;
    color: #888888;
    margin-top: 50pt;
    border-top: 1px solid #cccccc;
    padding-top: 10pt;
  }
</style>
</head>
<body>
  <div class="document-container">
    <div class="header">
      <h1>Justicaa</h1>
    </div>
    <h2 class="document-title">${title}</h2>
    ${content}
    <div class="footer">
      This document was generated using Justicaa. It is intended for informational purposes and does not constitute legal advice. Please consult a qualified attorney for your specific needs.
    </div>
  </div>
</body>
</html>
`;

const generateNDAContent = (data: Record<string, string>) => `
    <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of <strong>${new Date().toLocaleDateString()}</strong> by and between:</p>
    <p><strong>Disclosing Party:</strong> ${data.disclosing_party || '____________________'}</p>
    <p><strong>Receiving Party:</strong> ${data.receiving_party || '____________________'}</p>
    
    <h2>1. Purpose of Disclosure</h2>
    <p>The parties intend to engage in discussions concerning: <strong>${data.purpose || '____________________'}</strong>. In connection with these discussions, the Disclosing Party may disclose certain confidential information to the Receiving Party.</p>
    
    <h2>2. Definition of Confidential Information</h2>
    <p>For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. This includes, but is not limited to, business plans, customer lists, financial information, and technical data.</p>
    
    <h2>3. Term of Agreement</h2>
    <p>The non-disclosure provisions of this Agreement shall remain in effect for a period of <strong>${data.duration || '____________________'}</strong> from the date of this Agreement.</p>
    
    <h2>4. Governing Law</h2>
    <p>This Agreement shall be governed by and construed in accordance with the laws of the State of <strong>${data.governing_law || '____________________'}</strong>.</p>
    
    <table class="signature-section">
      <tr>
        <td class="signature-block" style="padding-right: 20px;">
          <p class="signature-line"><strong>Disclosing Party Signature</strong></p>
          <p>Name: ${data.disclosing_party || ''}</p>
        </td>
        <td class="signature-block" style="padding-left: 20px;">
          <p class="signature-line"><strong>Receiving Party Signature</strong></p>
          <p>Name: ${data.receiving_party || ''}</p>
        </td>
      </tr>
    </table>
`;

const generateServiceAgreementContent = (data: Record<string, string>) => `
    <p>This Service Agreement ("Agreement") is made effective as of <strong>${data.start_date || new Date().toLocaleDateString()}</strong> by and between:</p>
    <p><strong>Service Provider:</strong> ${data.service_provider || '____________________'}</p>
    <p><strong>Client:</strong> ${data.client_name || '____________________'}</p>

    <h2>1. Description of Services</h2>
    <p>The Service Provider will provide the following services to the Client: ${data.services_description || '____________________'}.</p>
    
    <h2>2. Payment for Services</h2>
    <p>The Client will pay a fee of <strong>${data.payment_amount || '____________________'}</strong> for the services. Payment will be made according to the following schedule: <strong>${data.payment_schedule || '____________________'}</strong>.</p>
    
    <h2>3. Term of Agreement</h2>
    <p>This Agreement will begin on <strong>${data.start_date || '____________________'}</strong> and is expected to be completed by <strong>${data.completion_date || '____________________'}</strong>.</p>
    
    <table class="signature-section">
      <tr>
        <td class="signature-block" style="padding-right: 20px;">
          <p class="signature-line"><strong>Service Provider Signature</strong></p>
          <p>Name: ${data.service_provider || ''}</p>
        </td>
        <td class="signature-block" style="padding-left: 20px;">
          <p class="signature-line"><strong>Client Signature</strong></p>
          <p>Name: ${data.client_name || ''}</p>
        </td>
      </tr>
    </table>
`;

const generateRentalApplicationContent = (data: Record<string, string>) => `
    <h2>Applicant Information</h2>
    <p><strong>Full Name:</strong> ${data.applicant_name || '____________________'}</p>
    <p><strong>Current Address:</strong> ${data.current_address || '____________________'}</p>
    
    <h2>Employment Information</h2>
    <p><strong>Current Employer:</strong> ${data.employer || '____________________'}</p>
    <p><strong>Employment Duration:</strong> ${data.employment_duration || '____________________'}</p>
    <p><strong>Gross Monthly Income:</strong> ${data.monthly_income ? '₹' + data.monthly_income : '____________________'}</p>
    
    <h2>References</h2>
    <p>${data.references || '____________________'}</p>
    
    <h2>Declaration</h2>
    <p>I hereby certify that the information provided in this application is true and correct to the best of my knowledge. I authorize the landlord or their agent to verify the information provided, including contacting my employer and references, and to obtain a copy of my credit report.</p>
    
    <table class="signature-section">
      <tr>
        <td class="signature-block" style="padding-right: 20px;">
          <p class="signature-line"><strong>Applicant Signature</strong></p>
        </td>
        <td class="signature-block" style="padding-left: 20px;">
          <p class="signature-line"><strong>Date</strong></p>
        </td>
      </tr>
    </table>
`;

const generateComplaintLetterContent = (data: Record<string, string>) => `
    <p>
        <strong>From:</strong><br>
        ${data.complainant_name || '[Your Name]'}<br>
        [Your Address]<br>
        [Your City, State, Pincode]<br>
        [Your Email]<br>
        [Your Phone Number]
    </p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p>
        <strong>To:</strong><br>
        Customer Service Department<br>
        <strong>${data.company_name || '[Company Name]'}</strong><br>
        [Company Address]<br>
        [Company City, State, Pincode]
    </p>
    <p><strong>Subject: Formal Complaint Regarding Product/Service</strong></p>
    <p>Dear Sir/Madam,</p>
    <p>I am writing to file a formal complaint regarding a recent experience with your company. The details of my complaint are as follows:</p>
    <p><em>${data.complaint_details || '[Detailed description of the complaint, including dates, product/service details, and what went wrong.]'}</em></p>
    <p>I have attempted to resolve this issue by [mention any previous attempts, e.g., calling customer service]. To resolve this problem, I would appreciate it if you could [state your desired resolution, e.g., provide a full refund, replace the product].</p>
    <p>I look forward to your prompt response and a resolution to this matter within 15 business days. If I do not hear from you, I will have no choice but to escalate this matter to the appropriate consumer protection agency.</p>
    <p>Sincerely,</p>
    <br><br>
    <p class="signature-line" style="width: 50%;"><strong>${data.complainant_name || '[Your Name]'}</strong></p>
`;

const generateEmploymentOfferContent = (data: Record<string, string>) => `
    <p><strong>${data.company_name || '[Company Name]'}</strong><br>[Company Address]</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <p>
        <strong>${data.candidate_name || '[Candidate Name]'}</strong><br>
        [Candidate Address]
    </p>
    <p><strong>Subject: Offer of Employment</strong></p>
    <p>Dear ${data.candidate_name || '[Candidate Name]'},</p>
    <p>On behalf of <strong>${data.company_name || '[Company Name]'}</strong>, I am pleased to offer you the position of <strong>${data.position_title || '[Position Title]'}</strong>. We were very impressed with your qualifications and believe you will be a valuable asset to our team.</p>
    
    <h2>Terms of Employment</h2>
    <p><strong>Position:</strong> ${data.position_title || '[Position Title]'}</p>
    <p><strong>Start Date:</strong> ${data.start_date || '[Start Date]'}</p>
    <p><strong>Reporting Manager:</strong> ${data.reporting_manager || '[Reporting Manager]'}</p>
    <p><strong>Salary:</strong> Your starting salary will be <strong>₹${data.salary || '[Salary]'}</strong> per annum, payable in monthly installments.</p>
    <p><strong>Benefits:</strong> You will be eligible for our standard benefits package, which includes: ${data.benefits || '[Benefits Package]'}.</p>
    
    <p>This offer is contingent upon the successful completion of a background check.</p>
    <p>We are excited about the prospect of you joining our team. Please indicate your acceptance of this offer by signing and returning a copy of this letter by [Offer Expiry Date].</p>
    <p>Sincerely,</p>
    <br><br>
    <p class="signature-line" style="width: 50%;">[Hiring Manager Name]<br>[Hiring Manager Title]<br><strong>${data.company_name || '[Company Name]'}</strong></p>
    
    <hr style="margin-top: 40px; margin-bottom: 40px;">
    
    <h2>Acceptance of Offer</h2>
    <p>I, <strong>${data.candidate_name || '[Candidate Name]'}</strong>, accept the offer of employment from <strong>${data.company_name || '[Company Name]'}</strong> on the terms and conditions outlined in this letter.</p>
    <table class="signature-section">
        <tr>
            <td class="signature-block" style="padding-right: 20px;"><p class="signature-line"><strong>Signature</strong></p></td>
            <td class="signature-block" style="padding-left: 20px;"><p class="signature-line"><strong>Date</strong></p></td>
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