import NumerologyClient from './NumerologyClient';

export const metadata = {
  title: 'Numerology Report | AskMyMoon',
  description: 'Generate a personalized numerology report from your name and birth details.',
  alternates: {
    canonical: '/numerology',
  },
};

export default function NumerologyPage() {
  return <NumerologyClient />;
}
