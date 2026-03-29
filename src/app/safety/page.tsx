import { LegalLayout } from "@/components/shared/LegalLayout";

export default function SafetyPage() {
  return (
    <LegalLayout 
      title="Safety Information" 
      subtitle="Your safety is our priority. We're committed to ensuring your experience is as secure as possible."
    >
      <h2>Working with Verified Hosts</h2>
      <p>
        We verify every host who lists on our platform. This provides a safe and secure environment for all users.
      </p>

      <h2>Communication is Key</h2>
      <p>
        Always communicate with your host through the Urugostay platform. This creates a secure record of your interactions.
      </p>

      <h2>Payment Security</h2>
      <p>
        We use industry-standard encryption for all payments. Our third-party processors are top-tier and provide security at every step.
      </p>

      <h2>Handling Concerns</h2>
      <p>
        If you have any safety concerns during your stay, please contact our support team immediately.
      </p>
    </LegalLayout>
  );
}
