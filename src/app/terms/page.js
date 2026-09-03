import InfoPage from '../components/InfoPage';

export const metadata = {
  title: 'Terms and Conditions | AskMyMoon',
  description: 'Terms and conditions for using AskMyMoon.',
};

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms and Conditions"
      intro="These terms explain the basic conditions for using AskMyMoon and its personalised astrology reports."
      canonicalPath="/terms"
    >
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Using the service</h2>
        <p className="mt-2">You may use AskMyMoon to generate personal reports for lawful, personal, and informational purposes. Please provide accurate birth details so the generated calculations are as useful as possible.</p>
      </section>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Guidance and responsibility</h2>
        <p className="mt-2">Astrological content and remedies are provided for reflection and spiritual guidance. They are not medical, legal, financial, or mental-health advice. You are responsible for decisions made after reading a report.</p>
      </section>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Availability</h2>
        <p className="mt-2">We work to keep the service available and accurate, but calculations, features, and content may change as the platform improves. We do not promise that the service will always be uninterrupted or error-free.</p>
      </section>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contact</h2>
        <p className="mt-2">Questions about these terms can be raised through the contact channel listed on the AskMyMoon website.</p>
      </section>
    </InfoPage>
  );
}
