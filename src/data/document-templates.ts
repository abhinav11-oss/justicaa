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
  <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 2rem;">
    <h1 style="text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 1rem; margin-bottom: 2rem;">${title}</h1>
    ${content}
  </div>
`;

const generateGenericContent = (title: string, data: Record<string, string>) => {
  let content = `<p>This document, titled <strong>${title}</strong>, was generated on ${new Date().toLocaleDateString()}.</p>`;
  content += '<h2>Details:</h2><ul style="list-style-type: none; padding: 0;">';
  for (const key in data) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    content += `<li style="margin-bottom: 0.5rem;"><strong>${label}:</strong> ${data[key]}</li>`;
  }
  content += '</ul>';
  return generateHtmlWrapper(title, content);
};

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
      generateContent: (data) => generateHtmlWrapper("Non-Disclosure Agreement (NDA)", `
          <p>This Non-Disclosure Agreement (the "Agreement") is entered into as of ${new Date().toLocaleDateString()} between <strong>${data.disclosing_party || '[Disclosing Party Name]'}</strong> ("Disclosing Party") and <strong>${data.receiving_party || '[Receiving Party Name]'}</strong> ("Receiving Party").</p>
          <h2>1. Purpose</h2>
          <p>The parties intend to engage in discussions concerning the following purpose: ${data.purpose || '[Purpose of Disclosure]'}. In connection with these discussions, the Disclosing Party may disclose certain confidential information to the Receiving Party.</p>
          <h2>2. Confidential Information</h2>
          <p>For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.</p>
          <h2>3. Term</h2>
          <p>The non-disclosure provisions of this Agreement shall remain in effect for a period of <strong>${data.duration || '[Duration]'}</strong>.</p>
          <h2>4. Governing Law</h2>
          <p>This Agreement shall be governed by and construed in accordance with the laws of the State of <strong>${data.governing_law || '[State]'}</strong>.</p>
          <br/><br/>
          <table style="width: 100%; margin-top: 50px; border: none;">
            <tr>
              <td style="width: 50%;"><p style="border-top: 1px solid #000; padding-top: 5px;"><strong>Disclosing Party:</strong> ${data.disclosing_party || ''}</p></td>
              <td style="width: 50%;"><p style="border-top: 1px solid #000; padding-top: 5px;"><strong>Receiving Party:</strong> ${data.receiving_party || ''}</p></td>
            </tr>
          </table>
      `)
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
      generateContent: (data) => generateHtmlWrapper("Service Agreement", `
        <p>This Service Agreement is made effective as of ${new Date().toLocaleDateString()} by and between <strong>${data.service_provider || '[Service Provider]'}</strong> and <strong>${data.client_name || '[Client Name]'}</strong>.</p>
        <h2>1. Description of Services</h2>
        <p>The Service Provider will provide the following services: ${data.services_description || '[Services Description]'}.</p>
        <h2>2. Payment</h2>
        <p>The Client will pay a fee of <strong>${data.payment_amount || '[Payment Amount]'}</strong>. Payment will be made according to the following schedule: <strong>${data.payment_schedule || '[Payment Schedule]'}</strong>.</p>
        <h2>3. Term</h2>
        <p>This Agreement will begin on <strong>${data.start_date || '[Start Date]'}</strong> and is expected to be completed by <strong>${data.completion_date || '[Completion Date]'}</strong>.</p>
        <br/><br/>
        <table style="width: 100%; margin-top: 50px; border: none;">
            <tr>
              <td style="width: 50%;"><p style="border-top: 1px solid #000; padding-top: 5px;"><strong>Service Provider:</strong> ${data.service_provider || ''}</p></td>
              <td style="width: 50%;"><p style="border-top: 1px solid #000; padding-top: 5px;"><strong>Client:</strong> ${data.client_name || ''}</p></td>
            </tr>
          </table>
      `)
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
      generateContent: (data) => generateGenericContent("Rental Application Form", data)
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
      generateContent: (data) => generateGenericContent("Consumer Complaint Letter", data)
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
      generateContent: (data) => generateGenericContent("Employment Offer Letter", data)
    }
];