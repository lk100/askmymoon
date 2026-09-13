  'use client';

  import { useEffect, useRef, useState } from 'react';
  import { useParams, notFound } from 'next/navigation';
  import { ArrowRight, Loader2, MapPin, Send, Sparkles } from 'lucide-react';
  import Navbar from '../../components/Navbar';
  import Footer from '../../components/Footer';
  import DomainReportPayment from '../../components/DomainReportPayment';
  import AuthModal from '../../components/AuthModal';
  import { getBirthTimeZone } from '@/lib/birthTime';
  import { getCategoryConfig, isValidCategory } from '@/lib/astrologerCategories';
  import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

  const loadingMessages = [
    'Reading your birth details...',
    'Calculating planetary positions...',
    'Mapping your chart...',
    'Aligning the stars...',
    'Almost ready...',
  ];

  // Turns an email into a friendly display name for the navbar, e.g.
  // "rahul.sharma99@gmail.com" -> "Rahul.sharma99", "arjun@site.com" -> "Arjun".
  // Falls back to the raw email if something unexpected comes through.
  const getDisplayName = (email) => {
    if (!email || typeof email !== 'string') return '';
    const localPart = email.split('@')[0];
    if (!localPart) return email;
    return localPart.charAt(0).toUpperCase() + localPart.slice(1);
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;
    const paragraphs = content.split(/\n\n+/);

    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n').filter(Boolean);
      const isList = lines.every((line) => line.trim().startsWith('* ') || line.trim().startsWith('- '));

      if (isList) {
        return (
          <ul key={pIdx} className="my-2 space-y-1.5 pl-4 list-disc text-slate-700">
            {lines.map((line, lIdx) => {
              const cleanLine = line.replace(/^[*\-]\s*/, '');
              return <li key={lIdx}>{formatBoldText(cleanLine)}</li>;
            })}
          </ul>
        );
      }

      return (
        <p key={pIdx} className="mb-2 last:mb-0 leading-relaxed text-slate-700">
          {formatBoldText(para)}
        </p>
      );
    });
  };

  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const ChartLoadingScreen = ({ messageIndex }) => (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F5FB]/95 backdrop-blur-sm">
      <div className="relative mb-8 h-28 w-28">
        <span className="absolute inset-0 rounded-full border-4 border-violet-100" />
        <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-violet-600 animate-pulse" />
        </span>
        <span className="absolute inset-0 animate-[spin_2.4s_linear_infinite]">
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-500" />
        </span>
      </div>
      <p key={messageIndex} className="animate-[fadeIn_0.3s_ease-out] text-base font-bold text-slate-900 sm:text-lg">
        {loadingMessages[messageIndex]}
      </p>
      <p className="mt-2 text-xs text-slate-500 sm:text-sm">This usually takes a few seconds</p>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );

  export default function AstrologerCategoryPage() {
    const { category } = useParams();

    if (!category || !isValidCategory(category)) {
      notFound();
    }
    const config = getCategoryConfig(category);
    // Per-category chat thread only — NOT the free-question source of truth
    // anymore. Free-question status is global (one per logged-in user, across
    // all charts, all 4 astrologers, AND all devices) and comes from the
    // server on every /api/astrologer/chart response as `freeQuestionUsed` /
    // `freeQuestionUsedElsewhere`. Paid credits are likewise user-wide.
    const sessionKey = `${category}_astrologer_session`;

    const [form, setForm] = useState({ name: '', dob: '', time: '', place: '', lat: null, lon: null, timeZone: '' });
    const [chart, setChart] = useState(null);
    const [chartToken, setChartToken] = useState('');
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [remainingPaidQuestions, setRemainingPaidQuestions] = useState(0);
    const [contactDetails, setContactDetails] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authedEmail, setAuthedEmail] = useState(null);
    const locationTimer = useRef(null);

    // Track auth state so we know up-front whether "Ask the Astrologer" needs
    // to show the login modal first, and so we can show "Signed in as ...".
    useEffect(() => {
      const supabase = getSupabaseBrowser();
      supabase.auth.getUser().then(({ data }) => {
        setAuthedEmail(data?.user?.email || null);
      });
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuthedEmail(session?.user?.email || null);
      });
      return () => subscription?.subscription?.unsubscribe();
    }, []);

    // Restore from sessionStorage for a snappy initial paint, then immediately
    // re-sync the free-question/credit numbers against the server — the DB is
    // always the source of truth, sessionStorage is just a local cache that
    // can go stale (user logged out, admin cleared rows, credits spent on
    // another device, etc.). We resend the same saved birth details, which is
    // an idempotent "get or create" on the backend (returns the same stored
    // chart if it already exists) and comes back with fresh
    // freeQuestionUsed/freeQuestionUsedElsewhere/remainingPaid.
    useEffect(() => {
      let cancelled = false;

      const restoreAndResync = async () => {
        let saved = null;
        try {
          saved = JSON.parse(sessionStorage.getItem(sessionKey) || 'null');
        } catch {
          sessionStorage.removeItem(sessionKey);
          return;
        }
        if (!saved?.chart) return;

        const savedChart = saved.chart.astrology || saved.chart;
        const savedForm = saved.form || form;
        setForm(savedForm);
        setChart(savedChart);
        setChartToken(saved.chartToken || '');
        setQuestionCount(saved.questionCount || 0);
        setRemainingPaidQuestions(saved.remainingPaidQuestions || 0);
        setContactDetails(saved.contactDetails || null);
        setMessages(saved.messages || (saved.answer ? [{ role: 'assistant', content: saved.answer }] : []));

        // Only re-sync if the person is actually still logged in — if not,
        // leave the cached numbers alone here; the auth-check effect and any
        // subsequent request will already surface the 401/auth modal.
        const supabase = getSupabaseBrowser();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        try {
          const response = await fetch('/api/astrologer/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...savedForm, category }),
          });
          if (cancelled) return;
          if (response.status === 401) {
            // Session isn't actually valid server-side — clear the stale local
            // chat state so the UI doesn't pretend to still be usable.
            sessionStorage.removeItem(sessionKey);
            setChart(null);
            setChartToken('');
            setMessages([]);
            setQuestionCount(0);
            setRemainingPaidQuestions(0);
            return;
          }
          if (!response.ok) return; // keep cached values rather than blow up on a transient error

          const data = await response.json();
          const hasUsedFreeQuestion = Boolean(data.freeQuestionUsed);
          const remainingPaid = data.remainingPaid || 0;

          setQuestionCount(hasUsedFreeQuestion ? 1 : 0);
          setRemainingPaidQuestions(remainingPaid);
          sessionStorage.setItem(sessionKey, JSON.stringify({
            ...saved,
            form: savedForm,
            chart: data.chart || savedChart,
            chartToken: data.chartToken || saved.chartToken,
            questionCount: hasUsedFreeQuestion ? 1 : 0,
            remainingPaidQuestions: remainingPaid,
          }));
        } catch {
          // Network hiccup — keep showing cached values rather than clearing
          // a perfectly good chat session over a transient failure.
        }
      };

      restoreAndResync();
      return () => { cancelled = true; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    useEffect(() => {
      if (!isSubmitting || chart) return;
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1600);
      return () => clearInterval(interval);
    }, [isSubmitting, chart]);

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

    // Does the actual chart-generation request. Called either immediately (if
    // already logged in) or right after successful login from the auth modal.
    const generateChart = async () => {
      try {
        setIsSubmitting(true);
        // `category` comes from the route param — never a typed field.
        const response = await fetch('/api/astrologer/chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, category }),
        });
        const data = await response.json();

        if (response.status === 401) {
          // Session expired or was never established server-side — ask again.
          setShowAuthModal(true);
          return;
        }
        if (!response.ok) throw new Error(data.error || 'Unable to prepare the chart.');

        const nextChart = data.chart;

        const hasUsedFreeQuestion = Boolean(data.freeQuestionUsed);
        const remainingPaid = data.remainingPaid || 0;

        const previousMessages = data.previousFreeQuestion?.question && data.previousFreeQuestion?.answer
          ? [
            { role: 'user', content: data.previousFreeQuestion.question },
            { role: 'assistant', content: data.previousFreeQuestion.answer },
          ]
          : [];

        // Only show the "pay to continue" nudge when the user genuinely has no
        // way to ask a question right now (free already used AND zero credits
        // left). If they have credits, treat this astrologer like a fresh
        // start — suggested questions show below, and the first question just
        // silently consumes a credit instead of the free slot.
        const nextMessages = previousMessages.length > 0
          ? previousMessages
          : (hasUsedFreeQuestion && remainingPaid <= 0)
            ? [{
              role: 'assistant',
              content: data.freeQuestionUsedElsewhere
                ? `Your free question has already been used on this account. More questions: ₹39 each, or ₹121 for 5 — usable with any astrologer.`
                : `Your free ${config.shortLabel} question has already been used. More questions: ₹39 each, or ₹121 for 5.`,
            }]
            : [];

        setChart(nextChart);
        setChartToken(data.chartToken);
        setQuestionCount(hasUsedFreeQuestion ? 1 : 0);
        setRemainingPaidQuestions(remainingPaid);
        setMessages(nextMessages);
        sessionStorage.setItem(sessionKey, JSON.stringify({
          form, chart: nextChart, chartToken: data.chartToken,
          questionCount: hasUsedFreeQuestion ? 1 : 0, remainingPaidQuestions: remainingPaid,
          answer: data.previousFreeQuestion?.answer || '', messages: nextMessages,
        }));
      } catch {
        setError('We could not prepare the chart. Please check your birth details.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const prepareChart = async (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      setError('');
      if (form.lat === null || form.lon === null) {
        setError('Choose your place of birth from the location suggestions.');
        return;
      }

      // Check login status before generating the chart. If not logged in,
      // show the auth modal and resume automatically once verified.
      const supabase = getSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowAuthModal(true);
        return;
      }

      await generateChart();
    };

    const askQuestion = async (eventOrQuestion, isSuggestedQuestion = false) => {
      const selectedQuestion = typeof eventOrQuestion === 'string' ? eventOrQuestion : question;
      if (typeof eventOrQuestion !== 'string') eventOrQuestion.preventDefault();
      if (!selectedQuestion.trim() || !chart) return;

      // Only force "pick a suggestion" when this is a genuinely free question
      // with no credits backing it up. Once credits are available, any typed
      // question is fine — it will simply consume a credit on the backend.
      if (questionCount === 0 && remainingPaidQuestions <= 0 && !isSuggestedQuestion) {
        setError('Please select one of the suggested questions for your free reading.');
        return;
      }
      if (questionCount > 0 && remainingPaidQuestions <= 0) return;

      const userMessage = { role: 'user', content: selectedQuestion.trim() };
      const wasPaidQuestion = questionCount > 0 || remainingPaidQuestions > 0;

      // 1. Show the question immediately.
      const messagesWithQuestion = [...messages, userMessage];
      setMessages(messagesWithQuestion);
      setQuestion('');
      setError('');
      setIsSubmitting(true);
      setIsThinking(true); // 2. Thinking animation shows while we wait for the first chunk.

      try {
        const response = await fetch('/api/astrologer/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: selectedQuestion.trim(),
            chartToken,
            lens: config.lens,
          }),
        });

        if (response.status === 401) {
          setShowAuthModal(true);
          throw new Error('Please sign in to continue.');
        }
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || 'Unable to generate the answer.');
        }
        if (!response.body) throw new Error('The astrologer response could not be streamed.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let answerSoFar = '';
        let assistantMessageAdded = false;
        let currentMessages = messagesWithQuestion;
        let serverUsage = null; // { usage: {total,free,paid}, remainingPaid } from the final ndjson line

        while (true) {
          const { done, value } = await reader.read();
          buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            let chunk;
            try {
              chunk = JSON.parse(line);
            } catch {
              continue;
            }

            // Final summary line — capture it, don't treat it as answer text.
            if (chunk.usage || typeof chunk.remainingPaid === 'number') {
              serverUsage = chunk;
              continue;
            }

            if (!chunk.text) continue;

            answerSoFar += chunk.text;

            // 3. Drop the thinking bubble the moment the first real chunk arrives,
            //    then stream tokens into the assistant message as they come.
            if (!assistantMessageAdded) {
              setIsThinking(false);
              assistantMessageAdded = true;
              currentMessages = [...messagesWithQuestion, { role: 'assistant', content: answerSoFar }];
            } else {
              currentMessages = [...messagesWithQuestion, { role: 'assistant', content: answerSoFar }];
            }
            setMessages(currentMessages);
          }

          if (done) break;
        }

        if (buffer.trim()) {
          try {
            const chunk = JSON.parse(buffer);
            if (chunk.usage || typeof chunk.remainingPaid === 'number') {
              serverUsage = chunk;
            } else if (chunk.text) {
              answerSoFar += chunk.text;
              currentMessages = [...messagesWithQuestion, { role: 'assistant', content: answerSoFar }];
              setMessages(currentMessages);
            }
          } catch {
            // ignore trailing partial line
          }
        }

        if (!answerSoFar) throw new Error('The astrologer did not return an answer.');

        const nextCount = questionCount + 1;
        // Prefer the server's authoritative remaining-credits count (shared
        // across all astrologer categories) when available; fall back to local
        // decrement only if that line didn't come through for some reason.
        const nextRemaining = typeof serverUsage?.remainingPaid === 'number'
          ? serverUsage.remainingPaid
          : (wasPaidQuestion ? Math.max(0, remainingPaidQuestions - 1) : remainingPaidQuestions);
        setQuestionCount(nextCount);
        setRemainingPaidQuestions(nextRemaining);
        sessionStorage.setItem(sessionKey, JSON.stringify({
          form, chart, chartToken, questionCount: nextCount, remainingPaidQuestions: nextRemaining,
          contactDetails, answer: answerSoFar, messages: currentMessages,
        }));
      } catch (requestError) {
        // Keep the optimistically-added question visible so the user knows what
        // failed, just surface the error below it.
        setError(requestError.message);
      } finally {
        setIsThinking(false);
        setIsSubmitting(false);
      }
    };

    const handleLogout = async () => {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
      setAuthedEmail(null);
      // Clear all local chat/credit state so the UI doesn't keep showing a
      // "still usable" chart/session after the account is signed out.
      sessionStorage.removeItem(sessionKey);
      setChart(null);
      setChartToken('');
      setMessages([]);
      setQuestionCount(0);
      setRemainingPaidQuestions(0);
      setContactDetails(null);
      setForm({ name: '', dob: '', time: '', place: '', lat: null, lon: null, timeZone: '' });
    };

    const Icon = config.icon;
    const canShowSuggestions = messages.length === 0 && !isThinking && (questionCount === 0 || remainingPaidQuestions > 0);

    return (
      <div className="min-h-screen bg-[#F7F5FB] text-[#26233D]">
        <Navbar ctaLabel="Astrologers" ctaHref="/astrologers" />
        <main className={`mx-auto ${chart ? 'h-[calc(100vh-4rem)] max-w-none overflow-hidden px-0 py-0' : 'max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-14'}`}>
          {!chart && (
            <div className="mb-8 max-w-3xl sm:mb-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-violet-500" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-600 sm:text-[11px]">{config.title} astrologer</p>
                </div>
                {authedEmail && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="truncate max-w-[160px]">
                      Signed in as <span className="font-semibold text-slate-700">{getDisplayName(authedEmail)}</span>
                    </span>
                    <button type="button" onClick={handleLogout} className="font-semibold text-violet-700 hover:underline">
                      Log out
                    </button>
                  </div>
                )}
              </div>
              <h1 className="max-w-2xl text-[2.35rem] font-black leading-[1.04] tracking-tight text-slate-900 sm:text-5xl">{config.heading}</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{config.subheading}</p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Chart-based guidance · One free question to begin
              </div>
            </div>
          )}

          {isSubmitting && !chart && <ChartLoadingScreen messageIndex={loadingMessageIndex} />}

          {!chart ? (
            <form onSubmit={prepareChart} className="max-w-3xl rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(76,29,149,0.09)] sm:p-8">
              {!isSubmitting && (
                <>
                  <div className="mb-6 flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">Create your {config.shortLabel} chart</h2>
                      <p className="text-xs text-slate-500">Your first question is free</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Full name</span>
                      <input required value={form.name} onChan  ge={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm outline-none focus:border-violet-500" placeholder="e.g. Rahul Sharma" />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Date of birth</span>
                      <input required type="date" value={form.dob} onChange={(event) => setForm({ ...form, dob: event.target.value })} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3 text-sm outline-none focus:border-violet-500" />
                    </label>
                    <label>
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Time of birth</span>
                      <input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-3 py-3 text-sm outline-none focus:border-violet-500" />
                    </label>
                    <label className="relative sm:col-span-2">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Place of birth</span>
                      <div className="relative">
                        <input required value={form.place} onChange={(event) => searchPlaces(event.target.value)} className="w-full rounded-xl border border-violet-100 bg-[#F8F7FC] px-4 py-3 pr-10 text-sm outline-none focus:border-violet-500" placeholder="Type a city and choose a result" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}</span>
                      </div>
                      {suggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-violet-100 bg-white shadow-lg">
                          {suggestions.map((place) => (
                            <button type="button" key={place.place_id} onClick={() => choosePlace(place)} className="flex w-full items-start gap-2 border-b border-violet-50 p-3 text-left text-xs text-slate-700 hover:bg-violet-50">
                              <MapPin className="h-4 w-4 shrink-0 text-violet-600" />
                              {place.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </label>
                  </div>
                  {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
                  <button disabled={isSubmitting} type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-400">
                    Ask the Astrologer <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </form>
          ) : (
            <section className="flex h-full min-h-0 w-full flex-col rounded-none border-0 bg-white p-4 shadow-none sm:p-8">
              <div className="mb-5 shrink-0 rounded-2xl border border-violet-100 bg-[#F8F7FC] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-700">{messages.length > 0 ? 'Birth details' : 'Chart ready'}</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">{form.name}</p>
                    {remainingPaidQuestions > 0 && (
                      <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                        {remainingPaidQuestions} paid question{remainingPaidQuestions > 1 ? 's' : ''} left · usable with any astrologer
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setChart(null);
                      setMessages([]);
                      setQuestionCount(0);
                      setRemainingPaidQuestions(0);
                    }}
                    className="shrink-0 inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[11px] font-semibold leading-tight text-violet-700 shadow-sm transition-colors hover:bg-violet-100 active:bg-violet-200"
                  >
                    New +
                  </button>
                </div>
              </div>

              <div className="mb-4 flex shrink-0 items-center gap-2 border-b border-violet-100 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{config.title} astrologer</p>
                  <p className="text-[11px] text-slate-500">Your private chart conversation</p>
                </div>
              </div>

              <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto pr-1 pb-40">
                {canShowSuggestions && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {config.suggestedQuestions.map((item) => (
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
                      {messages.map((message, index) => (
                        <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md border border-violet-200 bg-violet-100 text-violet-950 font-medium' : 'rounded-bl-md border border-violet-100 bg-[#F8F7FC] text-slate-800'}`}>
                            {message.role === 'user' ? message.content : renderFormattedContent(message.content)}
                          </div>
                        </div>
                      ))}
                      {isThinking && (
                        <div className="flex justify-start">
                          <div className="rounded-2xl rounded-bl-md border border-violet-100 bg-[#F8F7FC] px-4 py-3 text-sm text-slate-500">
                            <span>{config.title} astrologer is thinking</span>
                            <span className="ml-1 inline-flex gap-0.5 align-middle">
                              <span className="animate-bounce">.</span>
                              <span className="animate-bounce [animation-delay:120ms]">.</span>
                              <span className="animate-bounce [animation-delay:240ms]">.</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
                    {questionCount > 0 && (
                      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-violet-100 bg-white p-4">
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Free question complete ✨</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">Go deeper — ask another {config.shortLabel} question</p>
                          <div className="mt-3 space-y-2">
                            {remainingPaidQuestions > 0 ? (
                              <p className="text-xs font-semibold text-emerald-800">
                                {remainingPaidQuestions} question{remainingPaidQuestions > 1 ? 's' : ''} remaining. Send it below.
                              </p>
                            ) : (
                              <>
                                <DomainReportPayment
                                  product="ai_astrologer"
                                  userName={form.name}
                                  reportData={{ type: 'career-question', chart, questionCount, category }}
                                  buttonLabel="Ask 1 question"
                                  contactDetails={contactDetails}
                                  authedEmail={authedEmail}
                                  buttonClassName="!min-h-[32px] w-full max-w-[220px] whitespace-nowrap !px-1.5 !py-0.5 !text-[11px] !leading-none sm:!min-h-[48px] sm:max-w-none sm:!px-4 sm:!py-3 sm:!text-sm"
                                  onSuccess={({ contact, remainingPaid }) => {
                                    const nextRemaining = typeof remainingPaid === 'number'
                                      ? remainingPaid
                                      : remainingPaidQuestions + 1;
                                    setRemainingPaidQuestions(nextRemaining);
                                    setContactDetails(contact);
                                    sessionStorage.setItem(sessionKey, JSON.stringify({ form, chart, chartToken, questionCount, remainingPaidQuestions: nextRemaining, contactDetails: contact, messages }));
                                  }}
                                />
                                <DomainReportPayment
                                  product="ai_astrologer_bundle_5"
                                  userName={form.name}
                                  reportData={{ type: 'career-question-bundle', chart, questionCount, category }}
                                  buttonLabel="Ask 5 questions"
                                  contactDetails={contactDetails}
                                  authedEmail={authedEmail}
                                  buttonClassName="!min-h-[32px] w-full max-w-[220px] whitespace-nowrap !px-1.5 !py-0.5 !text-[11px] !leading-none sm:!min-h-[48px] sm:max-w-none sm:!px-4 sm:!py-3 sm:!text-sm"
                                  onSuccess={({ contact, remainingPaid }) => {
                                    const nextRemaining = typeof remainingPaid === 'number'
                                      ? remainingPaid
                                      : remainingPaidQuestions + 5;
                                    setRemainingPaidQuestions(nextRemaining);
                                    setContactDetails(contact);
                                    sessionStorage.setItem(sessionKey, JSON.stringify({ form, chart, chartToken, questionCount, remainingPaidQuestions: nextRemaining, contactDetails: contact, messages }));
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="fixed inset-x-0 bottom-0 z-20 border-t border-violet-100 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(38,35,61,0.08)] backdrop-blur sm:px-8">
                <form onSubmit={askQuestion} className="mx-auto flex max-w-5xl items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <textarea
                      required
                      maxLength={500}
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      rows={1}
                      className="hide-scrollbar w-full resize-none overflow-y-auto rounded-xl border border-violet-100 bg-[#F8F7FC] py-3 pl-4 pr-16 text-sm placeholder:text-xs outline-none focus:border-violet-500"
                      placeholder="Write your question..."
                    />
                    <span className={`pointer-events-none absolute right-3 bottom-2 text-[10px] font-semibold transition-colors ${question.length >= 480 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                      {question.length}/500
                    </span>
                  </div>
                  <button
                    aria-label="Send question"
                    title="Send question"
                    disabled={isSubmitting || (questionCount > 0 && remainingPaidQuestions <= 0)}
                    type="submit"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-700 text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-400"
                  >
                    {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </form>
              </div>
            </section>
          )}
        </main>
        {!chart && <Footer />}

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={(user) => {
              setAuthedEmail(user?.email || null);
              setShowAuthModal(false);

              generateChart();
            }}
          />
        )}
      </div>
    );
  }