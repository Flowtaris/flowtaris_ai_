import { Metadata } from 'next'
import { Container, Card, CardContent } from '@repo/ui'
import { Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Flowtaris AI',
  description: 'Flowtaris AI Privacy Policy. Information about how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1 w-full pt-32 pb-24">
      <Container size="lg">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] mb-6">
            <Shield className="h-4 w-4 text-brand-cyan-400" />
            <span className="text-[10px] font-bold tracking-[0.16em] text-white/50 uppercase">Legal & Compliance</span>
          </div>
          <h1 className="text-display-lg text-white mb-6">Privacy Policy</h1>
          <p className="text-headline-sm text-neutral-400">
            Effective Date: September 1, 2026
          </p>
        </div>

        <Card className="glass-card">
          <CardContent className="p-8 md:p-12 prose prose-invert max-w-none prose-p:text-neutral-300 prose-headings:text-white prose-a:text-[#E8A020]">

            <h2>1. Our Commitment to Enterprise Security</h2>
            <p>
              At Flowtaris AI, security and privacy are foundational. This Privacy & Data Protection Policy outlines our strict protocols for handling enterprise data, specifically concerning our AI integrations with ERP systems (NetSuite, SAP, Coupa, Workday). We operate under a <strong>Zero-Trust Architecture</strong> and maintain strict adherence to global privacy frameworks.
            </p>

            <h2>2. Enterprise Data & AI Model Training (Zero Retention)</h2>
            <p>
              Your data remains your data. Flowtaris AI guarantees that <strong>customer data is never used to train foundational AI models</strong>. We employ a strict Zero-Data-Retention policy for all GenAI interactions:
            </p>
            <ul>
              <li><strong>No Cross-Tenant Contamination:</strong> Your proprietary financial data is isolated within single-tenant, dedicated vector databases.</li>
              <li><strong>Ephemeral Processing:</strong> Prompts and completions processed through our LLM gateways are never logged, stored, or reviewed by humans.</li>
              <li><strong>Private Instances:</strong> We utilize private, isolated instances of AI models via secure APIs (Azure OpenAI, AWS Bedrock) governed by strict BAA and DPA agreements preventing data retention.</li>
            </ul>

            <h2>3. Information We Process</h2>
            <p>
              As a Data Processor, Flowtaris AI only processes information strictly necessary to execute the autonomous workflows authorized by your organization:
            </p>
            <ul>
              <li><strong>Transactional Data:</strong> Invoices, purchase orders, and receipts processed via our OCR and document intelligence engine.</li>
              <li><strong>System Telemetry:</strong> Anonymized integration health metrics and API latency logs to ensure SLA compliance.</li>
              <li><strong>Administrative Data:</strong> RBAC (Role-Based Access Control) credentials, SSO tokens, and audit logs of user actions within the Flowtaris portal.</li>
            </ul>

            <h2>4. Encryption & Infrastructure Security</h2>
            <p>
              All customer data is secured using military-grade encryption standards:
            </p>
            <ul>
              <li><strong>Data at Rest:</strong> Encrypted using AES-256 block-level encryption.</li>
              <li><strong>Data in Transit:</strong> Secured via TLS 1.3 across all internal and external network boundaries.</li>
              <li><strong>Data Residency:</strong> Customers may elect to have their data hosted exclusively in US, EU (Frankfurt), or UK data centers to comply with local data sovereignty laws (e.g., GDPR).</li>
            </ul>

            <h2>5. Compliance & Audits</h2>
            <p>
              Flowtaris AI maintains continuous compliance with the following frameworks. Audit reports (Type II) are available to customers under NDA:
            </p>
            <ul>
              <li><strong>SOC 2 Type II:</strong> Audited annually by independent third-party assessors.</li>
              <li><strong>ISO 27001:</strong> Certified Information Security Management System (ISMS).</li>
              <li><strong>GDPR & CCPA:</strong> Fully compliant data processing agreements and subject rights workflows.</li>
              <li><strong>HIPAA:</strong> BAA available for healthcare clients processing PHI.</li>
            </ul>

            <h2>6. Data Subject Rights & Incident Response</h2>
            <p>
              We maintain a 24/7/365 Security Operations Center (SOC). In the highly unlikely event of a data anomaly, our incident response protocol guarantees customer notification within 24 hours. Enterprise administrators have full self-service capabilities to fulfill Data Subject Access Requests (DSARs) directly through the Flowtaris admin console.
            </p>

            <h2>7. Contact Our Data Protection Officer (DPO)</h2>
            <p>
              For security assessments, DPA inquiries, or privacy concerns, please contact our dedicated compliance team:
              <br /><br />
              <strong>Flowtaris AI Office of the CISO</strong><br />
              Email: security@flowtaris.com<br />
              Email: dpo@flowtaris.com
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
