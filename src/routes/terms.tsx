import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms and Conditions — ${site.name}` },
      { name: "description", content: `Terms and Conditions for ${site.name}.` },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-4xl font-semibold">Terms and Conditions</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <p className="mt-4 text-muted-foreground">
        Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the {site.name} website (the "Service") operated by {site.name} ("us", "we", or "our").
      </p>
      <p className="mt-4 text-muted-foreground">
        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
      </p>
      <div className="mt-12 space-y-8 text-sm text-muted-foreground">
        <div>
          <h2 className="text-foreground font-semibold text-lg">1. Use of Site and Services</h2>
          <p className="mt-2">Content is provided for informational purposes about {site.name} and its services. You agree not to use the site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Site, the Services, or the general business of {site.name}.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">2. Intellectual Property Rights</h2>
          <p className="mt-2">The Service and its original content, features, and functionality are and will remain the exclusive property of {site.name} and its licensors. All logos, imagery, 3D models, animations, character designs, environmental art, and portfolio content remain the exclusive property of {site.name}. Unauthorized reproduction, distribution, modification, reverse engineering, or commercial use is strictly prohibited without explicit, written consent from {site.name}.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">3. User Accounts and Employee Access</h2>
          <p className="mt-2">When you create an account or are granted employee access with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. Employee login areas are restricted. Unauthorized access, sharing of credentials, or attempted breaches of our secure portals are strictly prohibited and will result in legal action and termination of employment or contract.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">4. Client Content and Licensing</h2>
          <p className="mt-2">Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness. By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">5. Payment and Billing Terms</h2>
          <p className="mt-2">For client services such as 3D Modeling, Texturing, Animation, and Rigging, payment terms will be specified in the individual Statement of Work (SOW) or contract. Unless otherwise stated, a non-refundable deposit is required before any production begins. Late payments may incur a penalty fee of 1.5% per month. {site.name} reserves the right to halt production or withhold final deliverables until all outstanding invoices are settled in full.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">6. Limitation of Liability</h2>
          <p className="mt-2">In no event shall {site.name}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">7. Indemnification</h2>
          <p className="mt-2">You agree to defend, indemnify and hold harmless {site.name} and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password, or b) a breach of these Terms.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">8. Termination</h2>
          <p className="mt-2">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">9. Governing Law</h2>
          <p className="mt-2">These terms are governed by and construed in accordance with the laws of the jurisdiction where {site.name} is registered, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">10. Modifications to Terms</h2>
          <p className="mt-2">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-lg">11. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about these Terms, please contact us immediately by emailing{" "}
            <a href={`mailto:${site.email}`} className="text-primary hover:underline">
              {site.email}
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
