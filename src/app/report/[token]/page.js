import ReportPage from '../page';

export const metadata = {
  title: 'Personalised Astrology Report',
  robots: { index: false, follow: false },
};

export default async function SharedReportPage({ params }) {
  const { token } = await params;
  return <ReportPage initialReportToken={token} />;
}
