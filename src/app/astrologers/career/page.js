'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Loader2, MapPin, Send, Sparkles } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getBirthTimeZone } from '@/lib/birthTime';
import { getCareerFreeAnswer } from '@/data/careerFreeAnswers';

const suggestedQuestions = [
  'Which career direction is most aligned with my strengths?',
  'What is causing blockages in my career?',
  'When will I get success in my career?',
  'Should I go for a job or business?',
];

const getChartFingerprint = (chart) => JSON.stringify(chart);

const getAscendantLabel = (ascendant) => {
  if (!ascendant || typeof ascendant !== 'object') return ascendant || 'Not available';
  return ascendant.sign || 'Not available';
};

const getAscendantLordLabel = (ascendant) => {
  if (!ascendant?.lord) return '';
  const { name, sign } = ascendant.lord;
  return [name, sign].filter(Boolean).join(' · ');
};

const getUsedFreeCharts = () => {
  try {
    return JSON.parse(localStorage.getItem('career_astrologer_free_charts') || '[]');
  } catch {
    return [];
  }
};

export default function CareerAstrologerPage() {
  const [form, setForm] = useState({ name: '', dob: '', time: '', place: '', lat: null, lon: null, timeZone: '' });
  const [chart, setChart] = useState(null);
  const [chartToken, setChartToken] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const locationTimer = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('career_astrologer_session') || 'null');
      if (saved?.chart) {
        const savedChart = saved.chart.astrology || saved.chart;
        setForm(saved.form || form);
        setChart(savedChart);
        setChartToken(saved.chartToken || '');
        setQuestionCount(saved.questionCount || (getUsedFreeCharts().includes(getChartFingerprint(savedChart)) ? 1 : 0));
        setAnswer('');
        setMessages(saved.messages || (saved.answer ? [{ role: 'assistant', content: saved.answer }] : []));
      }
    } catch {
      sessionStorage.removeItem('career_astrologer_session');
    }
  }, []);

  const searchPlaces = (value) => {
    setForm((current) => ({ ...current, place: value, lat: null, lon: null, timeZone: '' }));
    window.clearTimeout(locationTimer.current);
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    locationTimer.current = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/location-search?q=${encodeURIComponent(value.trim())}`);
        setSuggestions(response.ok ? await response.json() : []);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  const choosePlace = (place) => {
    const lat = Number(place.lat);
    const lon = Number(place.lon);
    setForm((current) => ({ ...current, place: place.display_name, lat, lon, timeZone: getBirthTimeZone(lat, lon) }));
    setSuggestions([]);
  };

  const prepareChart = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    if (form.lat === null || form.lon === null) {
      setError('Choose your place of birth from the location suggestions.');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/career-astrologer/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to prepare the chart.');
      const nextChart = data.chart;
      const nextQuestionCount = getUsedFreeCharts().includes(getChartFingerprint(nextChart)) ? 1 : 0;
      const previousMessages = data.previousFreeQuestion?.question && data.previousFreeQuestion?.answer
        ? [
          { role: 'user', content: data.previousFreeQuestion.question },
          { role: 'assistant', content: data.previousFreeQuestion.answer },
        ]
        : [];
      setChart(nextChart);
      setChartToken(data.chartToken);
      setQuestionCount(data.previousFreeQuestion ? 1 : nextQuestionCount);
      setAnswer('');
      setMessages(previousMessages);
      sessionStorage.setItem('career_astrologer_session', JSON.stringify({ form, chart: nextChart, chartToken: data.chartToken, questionCount: data.previousFreeQuestion ? 1 : nextQuestionCount, answer: data.previousFreeQuestion?.answer || '', messages: previousMessages }));
    } catch {
      setError('We could not prepare the chart. Please check your birth details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const askQuestion = async (eventOrQuestion, isSuggestedQuestion = false) => {
    const selectedQuestion = typeof eventOrQuestion === 'string' ? eventOrQuestion : question;
    if (typeof eventOrQuestion !== 'string') eventOrQuestion.preventDefault();
    if (!selectedQuestion.trim() || !chart) return;
    if (questionCount === 0 && !isSuggestedQuestion) {
      setError('Please select one of the suggested questions for your free reading.');
      return;
    }
    if (questionCount > 0) {
      setShowComingSoon(true);
      return;
    }
    setIsSubmitting(true);
    setIsThinking(true);
    setError('');
    const userMessage = { role: 'user', content: selectedQuestion.trim() };
    try {
      const freeAnswer = getCareerFreeAnswer(selectedQuestion.trim(), chart, form.dob);
      if (!freeAnswer) throw new Error('Please select one of the available career questions.');
      const nextMessages = [
        ...messages,
        userMessage,
        { role: 'assistant', content: freeAnswer },
      ];
      const nextCount = questionCount + 1;
      const fingerprint = getChartFingerprint(chart);
      const usedFreeCharts = getUsedFreeCharts();
      if (!usedFreeCharts.includes(fingerprint)) {
        localStorage.setItem('career_astrologer_free_charts', JSON.stringify([...usedFreeCharts, fingerprint]));
      }
      setMessages(nextMessages);
      setQuestionCount(nextCount);
      sessionStorage.setItem('career_astrologer_session', JSON.stringify({ form, chart, chartToken, questionCount: nextCount, answer: freeAnswer, messages: nextMessages }));
      setQuestion('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsThinking(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5FB] text-[#26233D]">
      <Navbar ctaLabel="Astrologers" ctaHref="/astrologers" />
      <main className={`mx-auto ${chart ? 'h-[calc(100vh-4rem)] max-w-none overflow-hidden px-0 py-0' : 'max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-14'}`}>
        {!chart && <div className="mb-8 max-w-3xl sm:mb-10">
          <div className="mb-4 flex items-center gap-3"><span className="h-px w-8 bg-violet-500" /><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600 sm:text-[11px]">Career astrologer</p></div>
          <h1 className="max-w-2xl text-[2.35rem] font-black leading-[1.04] tracking-tight text-slate-900 sm:text-5xl">A clearer question for your working life.</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">Enter your details once. We calculate your astrology chart once, then use it for every career question.</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Chart-based guidance · One free question to begin</div>
        </div>}

        {!chart ? (
          <form onSubmit={prepareChart} className="max-w-3xl rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(76,29,149,0.09)] sm:p-8">
            <div className="mb-6 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-800"><BriefcaseBusiness className="h-5 w-5" /></div><div><h2 className="font-bold text-slate-900">Create your career chart</h2><p className="text-xs text-slate-500">Your first question is free</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Full name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm outline-none focus:border-violet-500" placeholder="e.g. Rahul Sharma" /></label>
              <label><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Date of birth</span><input required type="date" value={form.dob} onChange={(event) => setForm({ ...form, dob: event.target.value })} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3 text-sm outline-none focus:border-violet-500" /></label>
              <label><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Time of birth</span><input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3 text-sm outline-none focus:border-violet-500" /></label>
              <label className="relative sm:col-span-2"><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Place of birth</span><div className="relative"><input required value={form.place} onChange={(event) => searchPlaces(event.target.value)} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 pr-10 text-sm outline-none focus:border-violet-500" placeholder="Type a city and choose a result" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}</span></div>{suggestions.length > 0 && <div className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-violet-100 bg-white shadow-lg">{suggestions.map((place) => <button type="button" key={place.place_id} onClick={() => choosePlace(place)} className="flex w-full items-start gap-2 border-b border-violet-50 p-3 text-left text-xs text-slate-700 hover:bg-violet-50"><MapPin className="h-4 w-4 shrink-0 text-violet-600" />{place.display_name}</button>)}</div>}</label>
            </div>
            {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
            <button disabled={isSubmitting} type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-400">
              {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating chart...</> : <>Prepare my chart <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        ) : (
          <section className="flex h-full min-h-0 w-full flex-col rounded-none border-0 bg-white p-4 shadow-none sm:p-8">
            <div className="mb-5 shrink-0 rounded-2xl border border-violet-100 bg-[#F8F7FC] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-700">{messages.length > 0 ? 'Birth details' : 'Chart ready'}</p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-900">{form.name}</p>
                </div>
                <button type="button" onClick={() => { setChart(null); setAnswer(''); setMessages([]); setQuestionCount(0); }} className="shrink-0 text-[11px] font-semibold leading-tight text-violet-700 hover:text-violet-900">Regenerate</button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-violet-100 pt-3 text-[11px]">
                <div><span className="block text-slate-500">Ascendant</span><strong>{getAscendantLabel(chart.ascendant)}</strong></div>
                <div><span className="block text-slate-500">Ascendant lord</span><strong>{getAscendantLordLabel(chart.ascendant) || 'Not available'}</strong></div>
              </div>
              <button type="button" onClick={() => setShowMoreDetails((current) => !current)} className="mt-3 text-[11px] font-semibold text-violet-700 hover:text-violet-900">{showMoreDetails ? 'Show less' : 'Show more'}</button>
              {showMoreDetails && (
                <div className="mt-3 grid grid-cols-1 gap-1.5 border-t border-violet-100 pt-3">
                  {Object.entries(chart.career_houses || {}).map(([house, details]) => (
                    <div key={house} className="flex min-w-0 items-center justify-between gap-1 rounded-lg bg-white px-2 py-1.5 text-[10px]">
                      <span className="font-semibold capitalize text-slate-700">{house.replace('_', ' ')}</span>
                      <span className="truncate text-right text-slate-500">{details.lord?.name || 'Not available'} · {details.lord?.sign || 'Sign unavailable'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4 flex shrink-0 items-center gap-2 border-b border-violet-100 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Sparkles className="h-4 w-4" /></div>
              <div><p className="text-sm font-bold text-slate-900">Career astrologer</p><p className="text-[11px] text-slate-500">Your private chart conversation</p></div>
            </div>

            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto pr-1 pb-40">
            {questionCount === 0 && messages.length === 0 && !isThinking && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {suggestedQuestions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => askQuestion(item, true)}
                      className="flex min-h-12 w-full items-center justify-center rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-center text-xs font-medium text-violet-800 transition hover:border-violet-400 hover:bg-violet-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.length === 0 && !isThinking && error && <p className="mt-4 text-sm text-rose-700">{error}</p>}

            {(messages.length > 0 || isThinking) && (
              <>
                <div className="space-y-4">
                  {isThinking && <div className="flex justify-start"><div className="rounded-2xl rounded-bl-md border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm text-slate-500"><span>Career astrologer is thinking</span><span className="ml-1 inline-flex gap-0.5 align-middle"><span className="animate-bounce">.</span><span className="animate-bounce [animation-delay:120ms]">.</span><span className="animate-bounce [animation-delay:240ms]">.</span></span></div></div>}
                  {messages.map((message, index) => (
                    <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-5 ${message.role === 'user' ? 'rounded-br-md bg-violet-700 text-white' : 'rounded-bl-md border border-violet-100 bg-[#F8F7FC] text-slate-700'}`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
                {questionCount > 0 && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                    <div>
                      <p className="text-sm font-bold text-orange-950">Your free question is complete</p>
                      <p className="mt-1 text-xs leading-relaxed text-orange-900">Pay ₹49 to continue this conversation with another focused career question.</p>
                      <button type="button" onClick={() => setShowComingSoon(true)} className="mt-3 rounded-lg bg-orange-700 px-4 py-2 text-xs font-bold text-white hover:bg-orange-800">Unlock next question · ₹49</button>
                    </div>
                  </div>
                )}
              </>
            )}
            </div>
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-violet-100 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(38,35,61,0.08)] backdrop-blur sm:px-8">
              <form onSubmit={askQuestion} className="mx-auto flex max-w-5xl items-center gap-2">
                <textarea required value={question} onChange={(event) => setQuestion(event.target.value)} rows={1} className="hide-scrollbar min-w-0 flex-1 resize-none overflow-y-auto rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm placeholder:text-xs outline-none focus:border-violet-500" placeholder="Write your next career question..." />
                <button aria-label="Send question" title="Send question" disabled={isSubmitting} type="submit" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-700 text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-400">
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
      {!chart && <Footer />}
      {showComingSoon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-700"><Sparkles className="h-5 w-5" /></div>
            <h2 id="coming-soon-title" className="mt-4 text-lg font-bold text-slate-900">Coming soon</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Paid career questions will be available soon.</p>
            <button type="button" onClick={() => setShowComingSoon(false)} className="mt-5 w-full rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white hover:bg-violet-800">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}