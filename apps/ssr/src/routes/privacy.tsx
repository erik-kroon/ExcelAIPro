import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl gap-4 text-white/95">
      <h1 className="text-4xl font-bold mb-4  pt-20 pb-4 text-white">Privacy Policy</h1>
      <p className="mb-4">Effective Date: March 16, 2025</p>

      <p className="mb-4">
        This Privacy Policy explains how ExcelAIPro.com ("we", "us", or "this website")
        collects, uses, and protects your personal information when you use our services.
        We are dedicated to safeguarding your privacy.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <p className="mb-4">
        When you visit our website, we may collect limited, non-personally identifiable
        information. This may include your IP address, browser type, referring/exit pages,
        and usage data to analyze trends and enhance our website.
      </p>
      <p className="mb-4">
        In addition to cookies provided by Google Analytics, we also employ Microsoft
        Clarity to further analyze website usage and enhance the user experience.
        Microsoft Clarity helps us understand user interactions with our website through
        features like heatmaps and session recordings. This data is processed in a way
        that does not personally identify you.
      </p>

      <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        The information we gather is used for the following purposes:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          To analyze and improve the content, functionality, and performance of our
          website.
        </li>
        <li>
          To generate automation scripts for Microsoft Excel, Google Sheets, and Airtable.
        </li>
        <li>
          To provide support and assistance related to spreadsheet formulas and SQL
          queries.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Data Sharing and Security</h2>
      <p className="mb-4">
        We recognize the importance of keeping your personal data secure. We do not sell,
        trade, or rent your personal information to third parties. However, we may share
        your information with trusted third-party service providers who help us operate
        our website and deliver our services.
      </p>
      {/* <p className="mb-4">
        We utilize LemonSqueezy as our payment processor to securely handle financial
        transactions. When processing payments, some of your data will be transferred to
        LemonSqueezy as needed to complete the transaction. We do not store or have access
        to your payment card details.
      </p> */}

      <h2 className="text-2xl font-semibold mb-2">Your Choices</h2>
      <p className="mb-4">We respect your privacy rights and offer you the option to:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Opt out of cookie usage by adjusting your browser settings.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
      <p className="mb-2">
        If you have any questions or concerns regarding this Privacy Policy or our
        practices, please reach out to us at:
      </p>
      <div className="">info@excelaipro.com</div>

      <ul className="list-none ml-6 mb-4"></ul>

      <p>
        We reserve the right to update or modify this Privacy Policy at any time. Any
        revisions will be posted on this page and become effective immediately upon
        posting.
      </p>
    </div>
  );
}
