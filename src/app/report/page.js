'use client';

import { savePDF } from "../utils/savePDF";
import { useState, useEffect, useMemo } from 'react';
import { getAllDoshaAnalysis, getActiveDoshaAnalysis } from '@/data/Doshaanalysis';
import Link from 'next/link';
import { getCareerReport } from '@/data/careerRemedies';
import { getFinanceReport } from '@/data/financeRemedies';
import { getMarriageReport } from '@/data/marriageRemedies';
import { getHealthReport } from '@/data/healthRemedies';
import {
  ArrowLeft,
  Printer,
  Sparkles,
  CheckCircle2,
  Compass,
  ShieldAlert,
  BookOpen,
  Loader2,
  Briefcase,
  Coins,
  Heart,
  Flame,
  AlertCircle,
  ChevronDown,
  Lock,
  Moon,
  Sun as SunIcon,
} from 'lucide-react';

import { ASCENDANT_REMEDIES, getPrimaryBottleneck, getLifelineRemedy } from '@/data/ascendantRemedies';
import { PLANETARY_REMEDIES } from '@/data/planetaryRemedies';
import { getPlanetExplanation, getFunctionalNature } from '@/data/planetaryData';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';
import DomainReportPayment from '../components/DomainReportPayment';

/* ============================================================
  DESIGN TOKENS
  Ink        #14171F   — primary text
  Parchment  #FAF8F4   — page background
  Surface    #FFFFFF   — card background
  Line       #E7E2D8   — hairline borders
  Marigold   #B4571F   — primary accent (auspicious / action)
  Indigo     #362D6B   — secondary accent (mystical / dosha)
  Sage       #3D6B4F   — positive / "clear" signal
  Typeface   Display: font-serif (Georgia stack) — editorial, ceremonial
              Body:    font-sans (system) — clean, legible
  Signature  Hairline "orbit" rule under the identity header +
              small-caps eyebrow labels throughout, evoking a
              printed astrological chart index rather than a
              generic SaaS dashboard.
  ============================================================ */

const SIGN_ELEMENTS = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
};

const ELEMENT_EMOJIS = { Fire: '🔥', Earth: '🌍', Air: '💨', Water: '💧' };

const LIFE_DOMAINS = [
  { key: 'career', label: 'Career & Profession', icon: Briefcase, live: true },
  { key: 'finances', label: 'Finances & Wealth', icon: Coins, live: true },
  { key: 'marriage', label: 'Marriage & Relationships', icon: Heart, live: true },
  { key: 'health', label: 'Health & Vitality', icon: Flame, live: true },
];

/* Small reusable eyebrow label — the recurring "structural device"
  that ties every section back to the printed-chart signature. */
function Eyebrow({ children, tone = 'ink' }) {
  const tones = {
    ink: 'text-[#8A8371]',
    marigold: 'text-[#B4571F]',
    indigo: 'text-[#362D6B]',
    sage: 'text-[#3D6B4F]',
    rose: 'text-[#9C3B3B]',
  };
  return (
    <span className={`block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] ${tones[tone]} mb-1 sm:mb-1.5`}>
      {children}
    </span>
  );
}

function SectionHeading({ icon: Icon, eyebrow, title, subtitle, tone = 'marigold' }) {
  const bg = {
    marigold: 'bg-[#B4571F]/10 text-[#B4571F]',
    indigo: 'bg-[#362D6B]/10 text-[#362D6B]',
  }[tone];
  return (
    <div className="flex items-center gap-2.5 sm:gap-3.5">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </div>
      <div className="min-w-0">
        {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
        <h2 className="text-[16px] sm:text-[19px] font-serif font-semibold text-[#14171F] tracking-tight leading-snug">{title}</h2>
        {subtitle && <p className="text-[11px] sm:text-xs text-[#78715F] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

/* Renders a domain's placements without ever naming the planet/house —
   full remedy cards for functional malefics, one grouped gemstone
   block for functional benefics/neutrals. Shared by career + finance. */
function DomainPlacements({ placements, emptyMessage }) {
  const maleficPlacements = placements.filter((p) => p.nature === 'malefic');
  const beneficPlacements = placements.filter((p) => p.nature !== 'malefic');

  if (placements.length === 0) {
    return <p className="text-xs text-[#78715F] italic">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {maleficPlacements.map((p, i) => (
        <div key={`malefic-${i}`} className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
          <p className="text-[13px] font-medium text-[#14171F]">{p.theme}</p>
          <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold text-[#9C3B3B]">Core problem: </span>{p.coreProblem}</p>
          <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold text-[#3D6B4F]">Practical: </span>{p.practicalRemedy}</p>
          <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold text-[#362D6B]">Donation: </span>{p.quickRemedy}</p>
        </div>
      ))}

      {beneficPlacements.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#B4571F]">Supporting gemstone remedies</span>
          {beneficPlacements.map((p, i) => (
            <p key={`benefic-${i}`} className="text-[13px] text-[#3A362C] leading-relaxed">
              {p.coreRemedy}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* PDF-only mirror of DomainPlacements — same logic, PDF-scaled text sizes. */
function DomainPlacementsPdf({ placements }) {
  const maleficPlacements = placements.filter((p) => p.nature === 'malefic');
  const beneficPlacements = placements.filter((p) => p.nature !== 'malefic');

  return (
    <div className="space-y-3">
      {maleficPlacements.map((p, i) => (
        <div key={`pdf-malefic-${i}`} className="pdf-block p-3 rounded-xl border border-[#E7E2D8]">
          <p className="text-[11px] font-semibold text-[#14171F]">{p.theme}</p>
          <p className="text-[11px] mt-1 leading-relaxed"><b>Core Problem:</b> {p.coreProblem}</p>
          <p className="text-[11px] mt-1 leading-relaxed"><b>Practical:</b> {p.practicalRemedy}</p>
          <p className="text-[11px] mt-1 leading-relaxed"><b>Donation:</b> {p.quickRemedy}</p>
        </div>
      ))}
      {beneficPlacements.length > 0 && (
        <div className="pdf-block p-3 rounded-xl border border-[#E7E2D8]">
          <p className="text-[11px] font-bold uppercase text-[#B4571F]">Supporting Gemstone Remedies</p>
          {beneficPlacements.map((p, i) => (
            <p key={`pdf-benefic-${i}`} className="text-[11px] mt-1 leading-relaxed">{p.coreRemedy}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState('Sun');
  const [selectedDomain, setSelectedDomain] = useState('career');
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = sessionStorage.getItem('astro_user_data') || localStorage.getItem('astro_user_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const merged = { ...parsed, ...(parsed.chartResults || {}) };
        setUserData(merged);
        setIsPaid(parsed.paymentStatus === 'verified');
        const availablePlanets = merged.planetPositions ? Object.keys(merged.planetPositions) : [];
        if (availablePlanets.length > 0) setSelectedPlanet(availablePlanets[0]);
      } else {
        setUserData(null);
        setIsPaid(false);
      }
      setLoading(false);
    }
  }, []);

  const careerData = useMemo(() => {
    if (!userData?.planetPositions || !userData?.ascendant) {
      return {
        placements: [],
        tenthHouseSign: null,
        tenthHouseTheme: null,
        tenthHouseExpansion: null,
        tenthLord: null,
        tenthLordPlacement: null,
        tenthLordPlacementRemedy: null,
        tenthLordNature: null,
        tenthLordRemedy: null,
      };
    }
    return getCareerReport(userData.planetPositions, userData.ascendant, [6, 10, 11]);
  }, [userData]);

  const financeData = useMemo(() => {
    if (!userData?.planetPositions || !userData?.ascendant) {
      return {
        placements: [],
        secondHouseSign: null,
        secondHouseTheme: null,
        secondHouseExpansion: null,
        secondLord: null,
        secondLordPlacement: null,
        secondLordPlacementRemedy: null,
        secondLordNature: null,
        secondLordRemedy: null,
      };
    }
    return getFinanceReport(userData.planetPositions, userData.ascendant, [5, 6, 9, 10, 11]);
  }, [userData]);

  const marriageData = useMemo(() => (
    userData?.planetPositions && userData?.ascendant
      ? getMarriageReport(userData.planetPositions, userData.ascendant)
      : { placements: [], seventhHouseSign: null, seventhHouseTheme: null, seventhLord: null, seventhLordPlacement: null, seventhLordPlacementRemedy: null }
  ), [userData]);

  const healthData = useMemo(() => (
    userData?.planetPositions && userData?.ascendant
      ? getHealthReport(userData.planetPositions, userData.ascendant)
      : { placements: [], sixthHouseSign: null, sixthHouseTheme: null, sixthLord: null, sixthLordPlacement: null, sixthLordPlacementRemedy: null }
  ), [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center text-[#14171F]">
        <Loader2 className="w-6 h-6 animate-spin text-[#B4571F] mb-3" />
        <p className="text-[13px] font-medium text-[#78715F] tracking-wide">Calculating sidereal planetary coordinates…</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#B4571F]/10 flex items-center justify-center mb-5">
          <ShieldAlert className="w-6 h-6 text-[#B4571F]" />
        </div>
        <h1 className="text-2xl font-serif font-semibold text-[#14171F] mb-2 tracking-tight">No birth details found</h1>
        <p className="text-[#6B6455] text-sm mb-6 max-w-md leading-relaxed">
          Please fill in your birth details on the home page first so we can generate your chart.
        </p>
        <Link
          href="/"
          className="bg-[#14171F] hover:bg-[#2A2E38] active:scale-[0.98] text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200"
        >
          Return to home form
        </Link>
      </div>
    );
  }

  const ascendantSign = userData.ascendant || 'Aries';
  const rulerHouse = userData.rulerHouse ?? 1;
  const moonSign = userData.moonSign || 'Not calculated';
  const sunSign = userData.sunSign || 'Not calculated';
  const getElement = (sign) => SIGN_ELEMENTS[sign] || 'Unknown';
  const getElementLabel = (sign) => `${ELEMENT_EMOJIS[getElement(sign)] || ''} ${getElement(sign)}`.trim();

  const ascendantKey = Object.keys(ASCENDANT_REMEDIES || {}).find(
    (key) => key.toLowerCase() === ascendantSign.toLowerCase()
  ) || ascendantSign;

  const ascendantData = ASCENDANT_REMEDIES?.[ascendantKey] || {};

  const bottleneckProblem = typeof getPrimaryBottleneck === 'function'
    ? getPrimaryBottleneck(ascendantSign, rulerHouse) : null;

  const lifelineRemedy = typeof getLifelineRemedy === 'function'
    ? getLifelineRemedy(ascendantSign, rulerHouse) : null;

  const availablePlanets = userData.planetPositions
    ? Object.keys(userData.planetPositions)
    : Object.keys(PLANETARY_REMEDIES);

  const activePlanetPos = userData.planetPositions?.[selectedPlanet] || { sign: ascendantSign, house: 1 };

  const activePlanetData =
    PLANETARY_REMEDIES?.[selectedPlanet]?.[ascendantSign]?.[String(activePlanetPos.house)] || {};

  const doshaAnalysis = userData.planetPositions ? getAllDoshaAnalysis(userData.planetPositions) : [];
  const orderedDoshaAnalysis = [...doshaAnalysis].sort(
    (first, second) => Number(second.present) - Number(first.present)
  );
  const activeFunctionalNature = typeof getFunctionalNature === 'function'
    ? getFunctionalNature(selectedPlanet, ascendantSign) : 'Benefic Planet';

  const activeExplanation = typeof getPlanetExplanation === 'function'
    ? getPlanetExplanation(selectedPlanet, activePlanetPos.sign, ascendantSign, activePlanetPos.house) : null;

  const activeDomain = LIFE_DOMAINS.find((d) => d.key === selectedDomain) || LIFE_DOMAINS[0];
  const ActiveDomainIcon = activeDomain.icon;

  const domainData = { career: careerData, finances: financeData, marriage: marriageData, health: healthData }[selectedDomain];
  const domainConfig = {
    career: { signLabel: '10th house sign', sign: careerData.tenthHouseSign, theme: careerData.tenthHouseTheme, expansion: careerData.tenthHouseExpansion, lordLabel: '10th lord', lord: careerData.tenthLord, placement: careerData.tenthLordPlacement, placementRemedy: careerData.tenthLordPlacementRemedy },
    finances: { signLabel: '2nd house sign', sign: financeData.secondHouseSign, theme: financeData.secondHouseTheme, expansion: financeData.secondHouseExpansion, lordLabel: '2nd lord', lord: financeData.secondLord, placement: financeData.secondLordPlacement, placementRemedy: financeData.secondLordPlacementRemedy },
    marriage: { signLabel: '7th house sign', sign: marriageData.seventhHouseSign, theme: marriageData.seventhHouseTheme, lordLabel: '7th lord', lord: marriageData.seventhLord, placement: marriageData.seventhLordPlacement, placementRemedy: marriageData.seventhLordPlacementRemedy },
    health: { signLabel: '6th house sign', sign: healthData.sixthHouseSign, theme: healthData.sixthHouseTheme, lordLabel: '6th lord', lord: healthData.sixthLord, placement: healthData.sixthLordPlacement, placementRemedy: healthData.sixthLordPlacementRemedy },
  }[selectedDomain];
  const activeEmptyMessage = `No additional ${activeDomain.label.toLowerCase()} placements found for this chart.`;

  const handlePaymentSuccess = (paymentResult) => {
    const updatedUserData = {
      ...userData,
      ...(paymentResult?.contact || {}),
      paymentStatus: 'verified',
    };
    sessionStorage.setItem('astro_user_data', JSON.stringify(updatedUserData));
    localStorage.setItem('astro_user_data', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    setIsPaid(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#14171F] font-sans antialiased pb-20">
      {/* ============ HEADER ============ */}
      <header className="border-b border-[#E7E2D8] bg-[#FAF8F4]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 text-xs font-medium text-[#6B6455] hover:text-[#14171F] transition-colors duration-150">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>

          <BrandLogo />

          <button
            onClick={savePDF}
            className="flex items-center gap-2 bg-[#14171F] hover:bg-[#2A2E38] active:scale-[0.97] text-white text-[11px] sm:text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-lg transition-all duration-150"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save PDF</span>
          </button>
        </div>
      </header>

      {/* ============ ON-SCREEN CONTENT ============ */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-5 sm:pt-10 space-y-3.5 sm:space-y-5">

        {/* Identity */}
        <section className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-7 md:p-9">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-3 sm:gap-6 pb-4 sm:pb-6">
            <div>
              <Eyebrow tone="marigold">Personal chart index</Eyebrow>
              <h1 className="text-[26px] sm:text-4xl font-serif font-semibold tracking-tight leading-[1.08]">
                {userData.name || 'User Chart'}
              </h1>
              <p className="text-[13px] sm:text-sm text-[#78715F] mt-1.5 sm:mt-2 italic">
                {ascendantData?.tagline || `${ascendantSign} Persona`}
              </p>
            </div>
            {userData.dob && (
              <div className="text-[11px] sm:text-xs text-[#78715F] space-y-0.5 sm:space-y-1 md:text-right shrink-0">
                <div>{userData.dob} {userData.time ? `· ${userData.time}` : ''}</div>
                <div>{userData.place}</div>
              </div>
            )}
          </div>

          {/* orbit rule — signature divider */}
          <div className="h-px w-full bg-gradient-to-r from-[#B4571F]/50 via-[#E7E2D8] to-[#362D6B]/50 mb-4 sm:mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8]">
              <Eyebrow>Ascendant</Eyebrow>
              <span className="text-[15px] sm:text-base font-serif font-medium">{ascendantSign}</span>
              <span className="text-[11px] sm:text-xs text-[#B4571F] ml-2">{getElementLabel(ascendantSign)}</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8]">
              <Eyebrow>Moon sign</Eyebrow>
              <span className="text-[15px] sm:text-base font-serif font-medium">{moonSign}</span>
              {moonSign !== 'Not calculated' && <span className="text-[11px] sm:text-xs text-[#B4571F] ml-2">{getElementLabel(moonSign)}</span>}
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8]">
              <Eyebrow>Sun sign</Eyebrow>
              <span className="text-[15px] sm:text-base font-serif font-medium">{sunSign}</span>
              {sunSign !== 'Not calculated' && <span className="text-[11px] sm:text-xs text-[#B4571F] ml-2">{getElementLabel(sunSign)}</span>}
            </div>
          </div>
        </section>

        {/* Core Conflict / Lifeline */}
        <section className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-7 md:p-9 space-y-5">
          <SectionHeading icon={AlertCircle} eyebrow="Diagnosis" title="Core conflict & lifeline" tone="marigold" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
              <Eyebrow tone="rose">Primary bottleneck</Eyebrow>
              <p className="text-[13px] text-[#3A362C] leading-relaxed">
                {bottleneckProblem || `Challenges related to ${ascendantSign} placements.`}
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
              <Eyebrow tone="sage">Lifeline reading</Eyebrow>
              <p className="text-[13px] text-[#3A362C] leading-relaxed">
                {lifelineRemedy || `General alignment guidance for ${ascendantSign} placements.`}
              </p>
            </div>
          </div>
        </section>

        {/* Planetary Diagnostics */}
        <section className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-7 md:p-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E2D8]">
            <SectionHeading icon={BookOpen} eyebrow="Index of nine" title="Planetary remedies" subtitle="Select a planet for a tailored reading" tone="marigold" />

            <div className="relative w-full sm:min-w-[170px] sm:w-auto">
              <select
                value={selectedPlanet}
                onChange={(e) => setSelectedPlanet(e.target.value)}
                className="w-full appearance-none bg-[#FAF8F4] border border-[#E7E2D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#14171F] focus:outline-none focus:ring-2 focus:ring-[#B4571F]/25 hover:border-[#B4571F]/40 cursor-pointer pr-9 transition-colors duration-150"
              >
                {availablePlanets.map((planet) => (
                  <option key={planet} value={planet}>{planet} placement</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#B4571F] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#14171F] text-white font-semibold text-[10px] sm:text-[11px] rounded-lg">
              {selectedPlanet}
            </span>
            <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 font-semibold text-[11px] rounded-lg border ${activeFunctionalNature.toLowerCase().includes('benefic')
              ? 'bg-[#3D6B4F]/10 text-[#3D6B4F] border-[#3D6B4F]/25'
              : 'bg-[#9C3B3B]/10 text-[#9C3B3B] border-[#9C3B3B]/25'
              }`}>
              {activeFunctionalNature}
            </span>
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#362D6B]/10 text-[#362D6B] font-semibold text-[11px] rounded-lg border border-[#362D6B]/20">
              {activePlanetPos.sign}
            </span>
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#362D6B]/10 text-[#362D6B] font-semibold text-[11px] rounded-lg border border-[#362D6B]/20">
              House {activePlanetPos.house}
            </span>
          </div>

          {activeExplanation?.dignityText && (
            <p className="text-[13px] font-medium text-[#B4571F] bg-[#B4571F]/[0.06] p-3.5 rounded-xl border border-[#B4571F]/15 leading-relaxed">
              {activeExplanation.dignityText}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
              <Eyebrow tone="rose">Core problem & affliction</Eyebrow>
              <p className="text-[13px] text-[#3A362C] leading-relaxed">{activePlanetData.coreProblem}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
              <Eyebrow tone="indigo">Fast & quick donation remedies</Eyebrow>
              <p className="text-[13px] text-[#3A362C] leading-relaxed">{activePlanetData.quickRemedy}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
              <Eyebrow tone="sage">Practical lifestyle habits</Eyebrow>
              <p className="text-[13px] text-[#3A362C] leading-relaxed">{activePlanetData.practicalRemedy}</p>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
              <Eyebrow tone="marigold">Gemstone & core solution</Eyebrow>
              <p className="text-[13px] text-[#3A362C] leading-relaxed">{activePlanetData.coreRemedy}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#14171F] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <Eyebrow tone="marigold">Vedic sound frequency (mantra)</Eyebrow>
              <span className="text-sm font-serif font-medium text-white leading-relaxed">{activePlanetData.mantraRemedy}</span>
            </div>
            <span className="px-3 py-1 bg-white/10 font-semibold text-[11px] text-white rounded-lg shrink-0">
              108 recitations
            </span>
          </div>
        </section>

        {/* Dosha Diagnostics */}
        <section className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-7 md:p-9 space-y-5">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#362D6B]/10 text-[#362D6B] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Eyebrow tone="indigo">Automated balance checks</Eyebrow>
                <span className="px-2 py-0.5 bg-[#3D6B4F]/10 text-[#3D6B4F] text-[9.5px] sm:text-[10px] font-bold rounded-full -mt-1">FREE</span>
              </div>
              <h2 className="text-[16px] sm:text-[19px] font-serif font-semibold text-[#14171F] tracking-tight leading-snug -mt-0.5 sm:-mt-1">Special dosha diagnostics</h2>
              <p className="text-[11px] sm:text-xs text-[#78715F] mt-0.5">For {ascendantSign} Lagna</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {orderedDoshaAnalysis.map((dosha) => {
              const isPresent = dosha.present;
              const isUnknown = dosha.severity === 'unknown';
              return (
                <div key={dosha.key} className="p-4 rounded-xl border border-[#E7E2D8] bg-[#FAF8F4]">
                  <div className="flex items-start gap-3">
                    {isPresent ? (
                      <AlertCircle className="w-4 h-4 text-[#B4571F] shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isUnknown ? 'text-[#9A9482]' : 'text-[#3D6B4F]'}`} />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-serif font-semibold text-[#14171F] text-sm">{dosha.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isPresent ? 'bg-[#B4571F]/10 text-[#B4571F]'
                          : isUnknown ? 'bg-[#E7E2D8] text-[#78715F]'
                            : 'bg-[#3D6B4F]/10 text-[#3D6B4F]'
                          }`}>
                          {isPresent ? dosha.severity : isUnknown ? 'Unknown' : 'Clear'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6455] mt-1.5 leading-relaxed">{dosha.description}</p>
                      {dosha.remedies && (
                        <div className="mt-3 space-y-1.5 text-xs text-[#3A362C] leading-relaxed">
                          <p><span className="font-semibold text-[#362D6B]">Practical:</span> {dosha.remedies.practical}</p>
                          <p><span className="font-semibold text-[#362D6B]">Spiritual:</span> {dosha.remedies.spiritual}</p>
                          <p><span className="font-semibold text-[#362D6B]">Mantra:</span> {dosha.remedies.mantra}</p>
                          <p><span className="font-semibold text-[#362D6B]">Puja:</span> {dosha.remedies.puja}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================== Deep Life Domain Analysis ===================== */}
        <section className="bg-white border border-[#E7E2D8] rounded-2xl p-4 sm:p-7 md:p-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E2D8]">
            <SectionHeading icon={Compass} eyebrow="₹99 per report" title="Deep life domain analysis" subtitle="Pick a domain for a full remedial reading" tone="indigo" />

            <div className="relative w-full sm:min-w-[210px] sm:w-auto">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full appearance-none bg-[#FAF8F4] border border-[#E7E2D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#14171F] focus:outline-none focus:ring-2 focus:ring-[#362D6B]/25 hover:border-[#362D6B]/40 cursor-pointer pr-9 transition-colors duration-150"
              >
                {LIFE_DOMAINS.map((domain) => (
                  <option key={domain.key} value={domain.key}>
                    {domain.label}{domain.live ? '' : ' (Coming soon)'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#362D6B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* ---- CAREER / FINANCES: live data ---- */}
          {activeDomain.live && isPaid && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#3D6B4F]/25 bg-[#3D6B4F]/[0.06] p-4">
                <div>
                  <span className="mt-1 text-xs text-[#3D6B4F]">Your complete report is ready to download.</span>
                </div>
                <button
                  type="button"
                  onClick={savePDF}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3D6B4F] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#2A4C38]"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Download full PDF
                </button>
              </div>

              {domainConfig.theme && (
                <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F4] border border-[#E7E2D8] space-y-2">
                  {selectedDomain === 'career' || selectedDomain === 'finances' ? (
                    <>
                      <Eyebrow tone="marigold">{domainConfig.signLabel} — {domainConfig.sign}</Eyebrow>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed">{domainConfig.theme}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Strengths: </span>{domainConfig.expansion?.strengths}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Watch-out: </span>{domainConfig.expansion?.watchOut}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Best direction: </span>{domainConfig.expansion?.direction}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">{domainConfig.lordLabel} placement: </span>{domainConfig.lord} in house {domainConfig.placement}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Placement theme: </span>{domainConfig.placementRemedy?.theme}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Remedy: </span>{domainConfig.placementRemedy?.remedy || domainConfig.placementRemedy}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Action: </span>{domainConfig.placementRemedy?.action}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Avoid: </span>{domainConfig.placementRemedy?.watchOut}</p>
                    </>
                  ) : (
                    <>
                      <Eyebrow tone="marigold">{domainConfig.signLabel} — {domainConfig.sign}</Eyebrow>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed">{domainConfig.theme}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">{domainConfig.lordLabel} placement: </span>{domainConfig.lord} in house {domainConfig.placement}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Placement theme: </span>{domainConfig.placementRemedy?.theme}</p>
                      <p className="text-[13px] text-[#3A362C] leading-relaxed"><span className="font-semibold">Remedy: </span>{domainConfig.placementRemedy?.remedy || domainConfig.placementRemedy}</p>
                    </>
                  )}
                </div>
              )}

              <DomainPlacements placements={domainData.placements} emptyMessage={activeEmptyMessage} />
            </div>
          )}

          {/* ---- MARRIAGE / HEALTH (or unpaid CAREER/FINANCES): locked ---- */}
          {(!isPaid || !activeDomain.live) && (
            <div className="relative min-h-[260px] rounded-xl overflow-hidden border border-[#E7E2D8] bg-[#FAF8F4]">
              <div className="p-5 blur-sm select-none pointer-events-none opacity-40 space-y-2">
                <div className="flex items-center gap-2 text-[#B4571F]">
                  <ActiveDomainIcon className="w-4 h-4" />
                  <h3 className="font-serif font-semibold text-[#14171F] text-sm">{activeDomain.label}</h3>
                </div>
                <p className="text-xs text-[#78715F] leading-relaxed">
                  Detailed {activeDomain.label.toLowerCase()} remedies based on your relevant house placements and lords.
                </p>
              </div>

              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto p-4 text-center bg-white/85 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-[#14171F] text-white flex items-center justify-center mb-3">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-semibold text-[#14171F]">
                  {!isPaid && activeDomain.live ? `Unlock ${activeDomain.label.toLowerCase()} analysis` : `${activeDomain.label} — coming soon`}
                </h3>
                <p className="text-xs text-[#78715F] mt-1.5 max-w-sm leading-relaxed">
                  {!isPaid && activeDomain.live
                    ? 'Complete payment to unlock your analysis on this screen and receive it by email.'
                    : 'This report is being calibrated and will launch soon.'}
                </p>
                {!isPaid && activeDomain.live ? (
                  <div className="mt-4 w-full max-w-xs">
                    <DomainReportPayment
                      userName={userData.name}
                      reportData={{ ...userData, careerReport: careerData, financeReport: financeData, marriageReport: marriageData, healthReport: healthData }}
                      onSuccess={handlePaymentSuccess}
                    />
                  </div>
                ) : (
                  <div className="mt-4 bg-[#B4571F]/10 text-[#B4571F] font-semibold py-2.5 px-5 rounded-xl text-xs border border-[#B4571F]/20 flex items-center gap-2 cursor-not-allowed">
                    <Sparkles className="w-4 h-4" />
                    <span>Launching soon</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ============ HIDDEN PDF-ONLY CONTENT ============
            Never visible on screen. html2canvas renders this off-DOM-flow
            when savePDF() runs. Contains only free content:
            Identity + Ascendant + all planets Sun→Ketu + Dosha, plus
            unlocked Career and Finance analysis if paid. */}
      <div
        id="pdf-content"
        style={{ display: 'none' }}
        className="px-10 py-10 max-w-4xl mx-auto text-[#14171F] bg-white"
      >
        <div className="mb-6 pb-4 border-b border-[#E7E2D8]">
          <h1 className="text-2xl font-serif font-semibold">{userData.name || 'User Chart'}</h1>
          <p className="text-xs text-[#78715F] mt-1 italic">{ascendantData?.tagline || `${ascendantSign} Persona`}</p>
          <div className="flex gap-6 mt-2 text-xs text-[#3A362C]">
            <span><b>Ascendant:</b> {ascendantSign} ({getElementLabel(ascendantSign)})</span>
            <span><b>Moon Sign:</b> {moonSign}{moonSign !== 'Not calculated' ? ` (${getElementLabel(moonSign)})` : ''}</span>
            <span><b>Sun Sign:</b> {sunSign}{sunSign !== 'Not calculated' ? ` (${getElementLabel(sunSign)})` : ''}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-serif font-semibold mb-2">Core Ascendant Conflict & Lifeline</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl border border-[#E7E2D8] bg-[#FAF8F4]">
              <Eyebrow tone="rose">Primary Bottleneck</Eyebrow>
              <p className="text-xs leading-relaxed">{bottleneckProblem || `Challenges related to ${ascendantSign} placements.`}</p>
            </div>
            <div className="p-3 rounded-xl border border-[#E7E2D8] bg-[#FAF8F4]">
              <Eyebrow tone="sage">Lifeline Position Reading</Eyebrow>
              <p className="text-xs leading-relaxed">{lifelineRemedy || `General alignment guidance for ${ascendantSign} placements.`}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-serif font-semibold mb-3">Planetary Remedies</h2>
          <div className="space-y-0">
            {availablePlanets.map((planet) => {
              const pos = userData.planetPositions?.[planet] || { sign: ascendantSign, house: 1 };
              const data = PLANETARY_REMEDIES?.[planet]?.[ascendantSign]?.[String(pos.house)] || {};
              const nature = typeof getFunctionalNature === 'function' ? getFunctionalNature(planet, ascendantSign) : 'Benefic Planet';
              const explanation = typeof getPlanetExplanation === 'function'
                ? getPlanetExplanation(planet, pos.sign, ascendantSign, pos.house) : null;

              return (
                <div key={planet} className="pdf-block mb-4 p-4 rounded-xl border border-[#E7E2D8]">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#14171F] text-white font-semibold text-[11px] rounded">{planet}</span>
                    <span className="px-2 py-0.5 bg-[#FAF8F4] text-[#3A362C] text-[11px] rounded border border-[#E7E2D8]">{nature}</span>
                    <span className="px-2 py-0.5 bg-[#FAF8F4] text-[#3A362C] text-[11px] rounded border border-[#E7E2D8]">Sign: {pos.sign}</span>
                    <span className="px-2 py-0.5 bg-[#FAF8F4] text-[#3A362C] text-[11px] rounded border border-[#E7E2D8]">House {pos.house}</span>
                  </div>

                  {explanation?.dignityText && (
                    <p className="text-[11px] text-[#B4571F] bg-[#B4571F]/[0.06] p-2 rounded mb-2">{explanation.dignityText}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed">
                    <p><span className="font-semibold text-[#9C3B3B]">Core Problem: </span>{data.coreProblem}</p>
                    <p><span className="font-semibold text-[#B4571F]">Gemstone: </span>{data.coreRemedy}</p>
                    <p><span className="font-semibold text-[#3D6B4F]">Lifestyle: </span>{data.practicalRemedy}</p>
                    <p><span className="font-semibold text-[#362D6B]">Donation: </span>{data.quickRemedy}</p>
                  </div>

                  <p className="text-[11px] mt-2"><span className="font-semibold text-[#B4571F]">Mantra: </span>{data.mantraRemedy} <span className="text-[#78715F]">(108 Recitations Daily)</span></p>
                </div>
              );
            })}
          </div>
        </div>

        {isPaid && (
          <div className="mb-6">
            <h2 className="text-lg font-serif font-semibold mb-3">Unlocked Career Analysis</h2>
            {careerData.tenthHouseTheme && (
              <div className="pdf-block mb-4 p-4 rounded-xl border border-[#E7E2D8]">
                <Eyebrow tone="marigold">10th house sign: {careerData.tenthHouseSign}</Eyebrow>
                <p className="text-[11px] mt-2 leading-relaxed">{careerData.tenthHouseTheme}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Career strengths:</b> {careerData.tenthHouseExpansion?.strengths}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Watch-out:</b> {careerData.tenthHouseExpansion?.watchOut}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Best direction:</b> {careerData.tenthHouseExpansion?.direction}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>10th Lord placement:</b> {careerData.tenthLord} in house {careerData.tenthLordPlacement}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Placement theme:</b> {careerData.tenthLordPlacementRemedy?.theme}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Remedy:</b> {careerData.tenthLordPlacementRemedy?.remedy}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Action:</b> {careerData.tenthLordPlacementRemedy?.action}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Avoid:</b> {careerData.tenthLordPlacementRemedy?.watchOut}</p>
              </div>
            )}
            <DomainPlacementsPdf placements={careerData.placements} />
          </div>
        )}

        {isPaid && (
          <div className="mb-6">
            <h2 className="text-lg font-serif font-semibold mb-3">Unlocked Finance Analysis</h2>
            {financeData.secondHouseTheme && (
              <div className="pdf-block mb-4 p-4 rounded-xl border border-[#E7E2D8]">
                <Eyebrow tone="marigold">2nd house sign: {financeData.secondHouseSign}</Eyebrow>
                <p className="text-[11px] mt-2 leading-relaxed">{financeData.secondHouseTheme}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Financial strengths:</b> {financeData.secondHouseExpansion?.strengths}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Watch-out:</b> {financeData.secondHouseExpansion?.watchOut}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Best direction:</b> {financeData.secondHouseExpansion?.direction}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>2nd lord placement:</b> {financeData.secondLord} in house {financeData.secondLordPlacement}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Placement theme:</b> {financeData.secondLordPlacementRemedy?.theme}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Remedy:</b> {financeData.secondLordPlacementRemedy?.remedy}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Action:</b> {financeData.secondLordPlacementRemedy?.action}</p>
                <p className="text-[11px] mt-1 leading-relaxed"><b>Avoid:</b> {financeData.secondLordPlacementRemedy?.watchOut}</p>
              </div>
            )}
            <DomainPlacementsPdf placements={financeData.placements} />
          </div>
        )}

        {isPaid && (
          <div className="mb-6">
            <h2 className="text-lg font-serif font-semibold mb-3">Unlocked Marriage & Relationship Analysis</h2>
            <div className="pdf-block mb-4 p-4 rounded-xl border border-[#E7E2D8]">
              <Eyebrow tone="marigold">7th house sign: {marriageData.seventhHouseSign}</Eyebrow>
              <p className="text-[11px] mt-2 leading-relaxed">{marriageData.seventhHouseTheme}</p>
              <p className="text-[11px] mt-1 leading-relaxed"><b>7th lord placement:</b> {marriageData.seventhLord} in house {marriageData.seventhLordPlacement}</p>
              <p className="text-[11px] mt-1 leading-relaxed"><b>Placement theme:</b> {marriageData.seventhLordPlacementRemedy?.theme}</p>
              <p className="text-[11px] mt-1 leading-relaxed"><b>Remedy:</b> {marriageData.seventhLordPlacementRemedy?.remedy || marriageData.seventhLordPlacementRemedy}</p>
            </div>
            <DomainPlacementsPdf placements={marriageData.placements} />
          </div>
        )}

        {isPaid && (
          <div className="mb-6">
            <h2 className="text-lg font-serif font-semibold mb-3">Unlocked Health & Vitality Analysis</h2>
            <div className="pdf-block mb-4 p-4 rounded-xl border border-[#E7E2D8]">
              <Eyebrow tone="marigold">6th house sign: {healthData.sixthHouseSign}</Eyebrow>
              <p className="text-[11px] mt-2 leading-relaxed">{healthData.sixthHouseTheme}</p>
              <p className="text-[11px] mt-1 leading-relaxed"><b>6th lord placement:</b> {healthData.sixthLord} in house {healthData.sixthLordPlacement}</p>
              <p className="text-[11px] mt-1 leading-relaxed"><b>Placement theme:</b> {healthData.sixthLordPlacementRemedy?.theme}</p>
              <p className="text-[11px] mt-1 leading-relaxed"><b>Remedy:</b> {healthData.sixthLordPlacementRemedy?.remedy || healthData.sixthLordPlacementRemedy}</p>
            </div>
            <DomainPlacementsPdf placements={healthData.placements} />
          </div>
        )}

        <div className="mb-2">
          <h2 className="text-lg font-serif font-semibold mb-2">Special Dosha Diagnostics</h2>
          <div className="grid grid-cols-2 gap-6">
            {orderedDoshaAnalysis.map((dosha) => (
              <div key={dosha.key} className="pdf-block p-3 rounded-xl border border-[#E7E2D8]">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-serif font-semibold text-[#14171F] text-sm">{dosha.name}</h4>
                  <span className="text-[10px] font-bold uppercase text-[#78715F]">
                    {dosha.present ? dosha.severity : dosha.severity === 'unknown' ? 'Unknown' : 'Clear'}
                  </span>
                </div>
                <p className="text-xs text-[#6B6455] mt-1 leading-relaxed">{dosha.description}</p>
                {dosha.remedies && (
                  <div className="mt-2 space-y-1 text-[11px] leading-relaxed text-[#3A362C]">
                    <p><span className="font-semibold">Practical:</span> {dosha.remedies.practical}</p>
                    <p><span className="font-semibold">Spiritual:</span> {dosha.remedies.spiritual}</p>
                    <p><span className="font-semibold">Mantra:</span> {dosha.remedies.mantra}</p>
                    <p><span className="font-semibold">Puja:</span> {dosha.remedies.puja}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}