import InfoPage from '../components/InfoPage';

export const metadata = {
  title: 'Privacy Policy | AskMyMoon',
  description: 'Learn how AskMyMoon handles information used to generate personalised reports.',
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="AskMyMoon is designed to collect only the information needed to generate and deliver a personalised report."
      canonicalPath="/privacy"
    >
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Information you provide</h2>
        <p className="mt-2">This may include your name, birth date, birth time, birth place, and optional location details. These details are used to calculate chart positions and prepare your report.</p>
      </section>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">How information is used</h2>
        <p className="mt-2">We use submitted information to provide chart calculations, remedy recommendations, report navigation, and PDF generation. We do not use your birth details to make decisions about your eligibility for unrelated services.</p>
      </section>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Storage and control</h2>
        <p className="mt-2">Report data may be stored locally in your browser to allow the report page to work. You can clear this information by clearing the site’s browser storage. Avoid submitting information you do not want processed.</p>
      </section>
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Third-party services</h2>
        <p className="mt-2">Location suggestions may use OpenStreetMap’s Nominatim service. When you search for a place, your search text may be sent to that service to return location results.</p>
      </section>
    </InfoPage>
  );
}
