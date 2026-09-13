import NumerologyReportClient from './NumerologyReportClient';

export const metadata = {
  title: 'Your Numerology Report | AskMyMoon',
  description: 'View your personalized numerology numbers and their Vedic meanings.',
  alternates: {
    canonical: '/numerology/report',
  },
};

export default function NumerologyReportPage() {
  return <NumerologyReportClient />;
}
