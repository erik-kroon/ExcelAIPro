import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_pages/terms")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl gap-4 text-white/95">
      <h1 className="text-4xl font-bold mb-4  pt-20 pb-4 text-white">Terms of Service</h1>
      <p className="mb-4">Effective Date: 2025-03-16</p>

      <p className="mb-4">
        By accessing and using the services offered on ExcelAIPro ("this website"), you
        agree to comply with and be bound by these Terms of Service. If you do not agree
        with any part of these terms, please refrain from using our services.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Use of Services</h2>
      <p className="mb-4">
        This website provides explanations of spreadsheet formulas using artificial
        intelligence, generates automation scripts for Microsoft Excel, Google Sheets, and
        Airtable, and generates SQL queries. The generated content and results are
        provided "as is" and we do not guarantee their accuracy or reliability although we
        try to ensure the best possible results.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
      <p className="mb-4">
        The content and materials available on this website, including but not limited to
        text, graphics, logos, button icons, images, audio clips, and software, are the
        property of ExcelAIPro and protected by applicable copyright and intellectual
        property laws.
      </p>
      <p className="mb-4">
        By using our services, you are granted a limited, revocable, non-exclusive, and
        non-transferable license to access and make personal use of the content. However,
        you must not reproduce, modify, distribute, display, perform or create derivative
        works based upon any part of the website or its content without our prior written
        consent.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
      <p className="mb-4">
        To the fullest extent permitted by law, we shall not be liable for any direct,
        indirect, incidental, special, consequential, or exemplary damages arising out of
        or in connection with the use or performance of our services. This includes, but
        is not limited to, damages for loss of profits, business interruption, or loss of
        data.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Indemnification</h2>
      <p className="mb-4">
        You agree to defend, indemnify and hold ExcelAIPro harmless from and against any
        claims, liabilities, damages, losses, costs, or expenses arising out of or related
        to your use of our services or any violation of these Terms of Service.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Termination</h2>
      <p className="mb-4">
        We reserve the right to terminate or suspend access to our services without prior
        notice or liability for any reason, including without limitation if you breach
        these Terms of Service. All provisions of the Terms of Service which by their
        nature should survive termination shall survive termination, including, without
        limitation, ownership provisions, warranty disclaimers, indemnity and limitations
        of liability.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Refund Policy</h2>
      <p className="mb-2">1. Refund Eligibility</p>
      <p className="mb-4">
        We offer refunds for subscription fees under the following conditions:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Technical Issues: If you encounter technical issues with our service that we are
          unable to resolve, we will provide a refund for the current subscription period.
        </li>
      </ul>
      <p className="mb-4">
        Please note that under normal circumstances, subscription fees are non-refundable.
      </p>
      <p className="mb-2">2. Cancellation of Subscription</p>
      <p className="mb-4">
        Users may cancel their subscription at any time, but such cancellations will not
        result in refunds for previous subscription periods.
      </p>

      <p className="mb-4">
        Note: If you cancel your subscription, pro features will still be available until
        the end of the billing cycle.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Governing Law</h2>
      <p className="mb-4">
        These Terms of Service shall be governed by and construed in accordance with the
        laws of the State of Delaware, United States. Any dispute arising out of or
        relating to these terms and conditions shall be subject to the exclusive
        jurisdiction of the courts of the State of Delaware, United States.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
      <p className="mb-4">
        If you have any questions or concerns about these Terms of Service, please contact
        us at:
      </p>
      <div className="">info@excelaipro.com</div>

      <ul className="list-none ml-6 mb-4"></ul>

      <p>
        We reserve the right to update or change these Terms of Service at any time. Any
        revisions will be posted on this page and become effective immediately upon
        posting.
      </p>
    </div>
  );
}
