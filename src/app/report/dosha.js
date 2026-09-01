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