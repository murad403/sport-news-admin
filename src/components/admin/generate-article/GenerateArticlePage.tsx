"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, Globe, Eye, AlignLeft, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function GenerateArticlePage() {
  const { toast } = useToast();

  // Generator input states
  const [promptTitle, setPromptTitle] = useState("");
  const [promptDescription, setPromptDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [wordCount, setWordCount] = useState("");
  const tone = "Professional";

  // Status states
  const [status, setStatus] = useState<"idle" | "generating" | "completed">("idle");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Initializing AI engine...");

  // Generated outputs
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [publishing, setPublishing] = useState(false);

  // New Image States
  const [articleImage, setArticleImage] = useState("");

  // Simulated AI generation steps
  useEffect(() => {
    if (status !== "generating") return;

    setProgress(0);
    setProgressText("Initializing AI engine...");

    const steps = [
      { p: 15, text: "Analyzing context & title prompt..." },
      { p: 35, text: "Gathering statistical sports data..." },
      { p: 60, text: "Applying professional writing tone style..." },
      { p: 85, text: "Refining headers and suggesting tags..." },
      { p: 100, text: "Assembling article preview..." },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setProgressText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        generateMockArticle();
      }
    }, 600);

    return () => clearInterval(interval);
  }, [status]);

  // Generate article details depending on user prompt keywords
  const generateMockArticle = () => {
    const titleLower = promptTitle.toLowerCase();
    const isItalian = language === "Italian";
    let title = "";
    let content = "";
    let suggestedTags: string[] = [];

    // Helper to adjust word count dynamically
    const adjustWordCount = (text: string, targetCount: number): string => {
      const words = text.split(/\s+/);
      if (words.length >= targetCount) {
        return words.slice(0, targetCount).join(" ") + "...";
      }
      
      let currentText = text;
      let currentWords = words.length;
      
      const englishFiller = [
        "\n\nFurthermore, this development has sparked intense debates among experts who question the long-term sustainability of such high-performance regimes.",
        "\n\nIn addition, fans are expressing their excitement across social media platforms, making it one of the most talked-about topics of the week.",
        "\n\nAs the season progresses, team coordinators are looking to adjust their training protocols to harness these findings for future matches.",
        "\n\nUltimately, only time will tell if this milestone will serve as a turning point for the franchise or merely a temporary flash in the pan."
      ];

      const italianFiller = [
        "\n\nInoltre, questo sviluppo ha suscitato intensi dibattiti tra gli esperti, che mettono in dubbio la sostenibilità a lungo termine di regimi così ad alte prestazioni.",
        "\n\nInoltre, i fan stanno esprimendo il loro entusiasmo sulle piattaforme di social media, rendendolo uno degli argomenti più discussi della settimana.",
        "\n\nCon il progredire della stagione, i coordinatori del team stanno cercando di adattare i loro protocolli di allenamento per sfruttare questi risultati per le partite future.",
        "\n\nIn definitiva, solo il tempo dirà se questa pietra miliare servirà da punto di svolta per la franchigia o semplicemente come un fuoco di paglia temporaneo."
      ];

      const filler = isItalian ? italianFiller : englishFiller;
      let fillerIdx = 0;

      while (currentWords < targetCount && fillerIdx < filler.length) {
        currentText += filler[fillerIdx];
        currentWords = currentText.split(/\s+/).length;
        fillerIdx++;
      }

      const finalWords = currentText.split(/\s+/);
      if (finalWords.length > targetCount) {
        return finalWords.slice(0, targetCount).join(" ") + "...";
      }
      return currentText;
    };

    if (titleLower.includes("messi") || titleLower.includes("miami") || titleLower.includes("soccer") || titleLower.includes("football")) {
      if (isItalian) {
        title = promptTitle || "Messi stupisce con una punizione vincente nei tempi supplementari";
        content = `In un incontro emozionante che ha tenuto i tifosi con il fiato sospeso, Lionel Messi ha dimostrato ancora una volta perché è considerato il più grande di tutti i tempi. Con il punteggio bloccato sul 2-2 al 94° minuto, l'Inter Miami ha ottenuto una punizione da 25 metri.\n\nPrendendo un profondo respiro, il talismano argentino ha curvato una traiettoria sublime sopra la barriera, lasciando il portiere completamente immobile mentre la palla si insaccava nell'incrocio dei pali a sinistra. Il pubblico è esploso in un vero e proprio delirio.\n\n"Sapevamo che sarebbe stata una dura battaglia", ha detto l'allenatore nella conferenza stampa post-partita. "Ma quando hai Lionel in campo, hai sempre una possibilità. Quella punizione è stata pura magia."\n\nQuesta vittoria estende la striscia di imbattibilità dell'Inter Miami a sei partite, proiettandola in vetta alla classifica della conference. Tifosi e analisti sono meravigliati di come Messi, anche in questa fase della sua carriera, continui a regalare spettacoli decisivi sotto la massima pressione.`;
        suggestedTags = ["Calcio", "Messi", "Inter Miami", "MLS"];
      } else {
        title = promptTitle || "Messi Stuns with Match-Winning Free Kick in Extra Time";
        content = `In a thrilling encounter that kept fans on the edge of their seats, Lionel Messi once again proved why he is considered the greatest of all time. With the score locked at 2-2 in the 94th minute, Inter Miami was awarded a free kick 25 yards out.\n\nTaking a deep breath, the Argentine talisman curled a sublime strike over the wall, leaving the goalkeeper completely stranded as the ball rattled the top-left corner. The crowd erupted into absolute pandemonium.\n\n"We knew it was going to be a tough battle," said the manager in the post-match conference. "But when you have Lionel on the pitch, you always have a chance. That free kick was pure magic."\n\nThis victory extends Inter Miami's undefeated streak to six matches, catapulting them to the top of the conference standings. Fans and analysts alike are marveling at how Messi, even at this stage of his career, continues to deliver match-winning spectacles under maximum pressure.`;
        suggestedTags = ["Soccer", "Messi", "Inter Miami", "MLS"];
      }
    } else if (titleLower.includes("hamilton") || titleLower.includes("f1") || titleLower.includes("grand prix") || titleLower.includes("race")) {
      if (isItalian) {
        title = promptTitle || "Hamilton conquista una storica pole position al Gran Premio di Monaco";
        content = `Lewis Hamilton ha regalato uno dei più grandi giri di qualificazione nella storia della Formula 1 per assicurarsi la pole position sulle strade di Monte Carlo. Navigando nel circuito stretto e delimitato da barriere con precisione millimetrica, il veterano pilota britannico ha registrato un tempo strabiliante di 1:10.166.\n\nIl suo compagno di squadra ha concluso a soli 0,082 secondi di distacco in una sessione tesissima, mentre l'attuale leader del campionato si è dovuto accontentare del terzo posto dopo aver toccato la barriera alla chicane delle Piscine.\n\n"La macchina sembrava sui binari oggi", ha detto Hamilton, visibilmente emozionato dopo essere uscito dall'abitacolo. "Questo tracciato richiede un impegno assoluto e ho dato tutto. Partire dalla pole qui è metà dell'opera, ma la domenica è il giorno in cui si conquistano i punti."\n\nCon i sorpassi notoriamente difficili a Monaco, tutti gli occhi saranno puntati sulla linea di partenza. La strategia e il degrado degli pneumatici dovrebbero giocare ruoli cruciali in quello che si preannuncia come un gran premio drammatico.`;
        suggestedTags = ["F1", "Hamilton", "Monaco GP", "Automobilismo"];
      } else {
        title = promptTitle || "Hamilton Secures Historic Pole Position at Monaco Grand Prix";
        content = `Lewis Hamilton delivered one of the greatest qualifying laps in Formula 1 history to secure pole position on the streets of Monte Carlo. Navigating the narrow, barrier-lined circuit with millimeter precision, the veteran British driver clocked a blistering time of 1:10.166.\n\nHis teammate finished just 0.082 seconds behind in a tense session, while the current championship leader was forced to settle for third after clipping the guardrail at the swimming pool chicane.\n\n"The car felt like it was on rails today," Hamilton said, visibly emotional after stepping out of the cockpit. "This track requires absolute commitment, and I gave it everything. Starting from pole here is half the battle, but Sunday is where the points are won."\n\nWith overtaking notoriously difficult in Monaco, all eyes will be on the start line. Strategy and tire degradation are expected to play pivotal roles in what promises to be a dramatic grand prix.`;
        suggestedTags = ["F1", "Hamilton", "Monaco GP", "Motorsport"];
      }
    } else if (titleLower.includes("lebron") || titleLower.includes("nba") || titleLower.includes("lakers") || titleLower.includes("basketball")) {
      if (isItalian) {
        title = promptTitle || "LeBron James segna 40 punti nell'emozionante rimonta dei Lakers";
        content = `LeBron James ha offerto una prestazione magistrale, segnando 40 punti per guidare i Los Angeles Lakers a una straordinaria vittoria in rimonta per 115-112 dopo essere stati sotto di 18 punti nel terzo quarto.\n\nJames è stato inarrestabile in area, realizzando 14 tiri dal campo su 22 e collezionando 9 assist e 8 rimbalzi. La sua tripla decisiva a 12 secondi dalla fine ha sigillato la vittoria, mandando in estasi il pubblico di casa.\n\n"Non abbiamo mai smesso di crederci", ha commentato James nella sua intervista post-partita. "Siamo stati lenti nel primo tempo, ma ci siamo sbloccati in difesa quando contava di più. È un gioco di squadra e tutti hanno contribuito."\n\nQuesta vittoria cruciale riporta i Lakers nella corsa ai playoff, dimostrando che anche nella sua 23esima stagione, l'impatto di LeBron sul campo rimane ineguagliabile.`;
        suggestedTags = ["NBA", "LeBron", "Lakers", "Pallacanestro"];
      } else {
        title = promptTitle || "LeBron James Drops 40 Points in Thrilling Lakers Comeback";
        content = `LeBron James put on a masterclass performance, scoring 40 points to guide the Los Angeles Lakers to a stunning 115-112 comeback victory after trailing by 18 points in the third quarter.\n\nJames was unstoppable in the paint, hitting 14 of 22 field goals while racking up 9 assists and 8 rebounds. His clutch three-pointer with 12 seconds remaining sealed the victory, leaving the home crowd in raptures.\n\n"We never stopped believing," James remarked in his post-game interview. "We were sluggish in the first half, but we locked down defensively when it mattered most. It's a team game, and everybody contributed."\n\nThis crucial win puts the Lakers back in the playoff conversation, showcasing that even in his 23rd season, LeBron's impact on the court remains unmatched.`;
        suggestedTags = ["NBA", "LeBron", "Lakers", "Basketball"];
      }
    } else {
      if (isItalian) {
        title = promptTitle || "L'ascesa delle superstar di nuova generazione nell'atletica moderna";
        content = `Il panorama sportivo sta vivendo un enorme cambio di paradigma mentre una nuova generazione di atleti sale alla ribalta. Dai campi di calcio a quelli da tennis, giovani prodigi sotto i 21 anni non stanno solo gareggiando: stanno dominando.\n\nQuesta panoramica analitica esplora come i miglioramenti nelle accademie giovanili, l'ottimizzazione del piano alimentare basata sui dati e il condizionamento psicologico abbiano permesso ai giovani di esibirsi a livelli senior d'élite.\n\nI veterani si trovano spinti al limite da nuovi arrivati che giocano senza paura e mostrano parametri atletici precedentemente ritenuti impossibili. Gli scienziati dello sport suggeriscono che questa tendenza subirà solo un'accelerazione nel prossimo decennio.\n\n"Il gioco è più veloce e impegnativo che mai", ha commentato un importante analista sportivo. "Ciò a cui stiamo assistendo è l'evoluzione delle prestazioni atletiche in tempo reale."`;
        suggestedTags = ["Scienza dello Sport", "Atletica Giovani", "Next-Gen", "Analisi"];
      } else {
        title = promptTitle || "The Rise of Next-Gen Superstars in Modern Athletics";
        content = `The sports landscape is experiencing a massive paradigm shift as a new generation of athletes takes center stage. From football pitches to tennis courts, young prodigies under the age of 21 are not just competing—they are dominating.\n\nThis analytical overview explores how improvements in youth training academies, data-driven diet plan optimization, and psychological conditioning have enabled teenagers to perform at elite senior levels.\n\nVeterans are finding themselves pushed to their limits by newcomers who play with no fear and showcase athletic parameters previously thought impossible. Sports scientists suggest that this trend will only accelerate over the next decade.\n\n"The game is faster and more demanding than ever before," commented a leading sports analyst. "What we are witnessing is the evolution of athletic performance in real time."`;
        suggestedTags = ["Sports Science", "Youth Athletics", "Next-Gen", "Analysis"];
      }
    }

    if (wordCount && !isNaN(Number(wordCount))) {
      content = adjustWordCount(content, Number(wordCount));
    }

    setGeneratedTitle(title);
    setGeneratedContent(content);
    setTags(suggestedTags);
    setArticleImage("");
    setStatus("completed");
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle.trim()) {
      toast("Please enter a title topic first!", "error");
      return;
    }
    setStatus("generating");
  };

  const handlePublish = () => {
    if (!generatedTitle.trim()) {
      toast("Article title cannot be empty", "error");
      return;
    }
    if (!generatedContent.trim()) {
      toast("Article content cannot be empty", "error");
      return;
    }

    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      toast("Article successfully published to live feed!", "success");
      // Reset page
      setStatus("idle");
      setPromptTitle("");
      setPromptDescription("");
      setWordCount("");
      setLanguage("English");
      setArticleImage("");
    }, 1500);
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput("");
    }
  };

  // Handle local image file load
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setArticleImage(reader.result as string);
        toast("Header image uploaded successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          AI Article Generator
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Draft high-quality sports news articles instantly using advanced linguistic models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Form Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg">
          <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800/60 pb-3 mb-5 flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-indigo-400" />
            Generator Parameters
          </h3>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Title / Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Messi's winning free kick, F1 Monaco GP, Lakers comeback"
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                disabled={status === "generating"}
                className="w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Language & Word Count Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Language Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Language
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={status === "generating"}
                    className="w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-sm text-slate-100 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="English" className="bg-slate-900 text-slate-100">English</option>
                    <option value="Italian" className="bg-slate-900 text-slate-100">Italian</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Word Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Word Count
                </label>
                <input
                  type="number"
                  placeholder="e.g. 300"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  disabled={status === "generating"}
                  className="w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                  min={50}
                  max={5000}
                />
              </div>
            </div>

            {/* Context/Description Prompt */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Instructions (Optional)
              </label>
              <textarea
                placeholder="List specific events, scores, quotes, or player statistics you want the AI to include..."
                rows={5}
                value={promptDescription}
                onChange={(e) => setPromptDescription(e.target.value)}
                disabled={status === "generating"}
                className="w-full px-4 py-3 bg-slate-950/50 focus:bg-slate-950 border border-slate-800 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Generate CTA */}
            <button
              type="submit"
              disabled={status === "generating"}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className={`w-4 h-4 ${status === "generating" ? "animate-spin text-indigo-400" : ""}`} />
              {status === "generating" ? "Generating Draft..." : "Generate AI Article"}
            </button>
          </form>
        </div>

        {/* Right Output/Preview Panel */}
        <div className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg min-h-[460px] flex flex-col">
          {/* Default/Idle State */}
          {status === "idle" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-center mb-4 text-slate-400">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">Live Preview Desk</h4>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                Configure your options on the left and click generate to view your AI sports article draft here.
              </p>
            </div>
          )}

          {/* Loading/Generating State */}
          {status === "generating" && (
            <div className="flex-1 flex flex-col justify-center p-6 space-y-6">
              {/* Spinning progress loader */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-indigo-400">{progressText}</span>
                  <span className="text-slate-400">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Pulsing skeleton structures */}
              <div className="space-y-3.5 animate-pulse">
                <div className="h-7 bg-slate-800/60 rounded-xl w-3/4" />
                <div className="h-4.5 bg-slate-800/60 rounded-xl w-1/4" />
                <div className="space-y-2 pt-4">
                  <div className="h-4 bg-slate-800/40 rounded-lg w-full" />
                  <div className="h-4 bg-slate-800/40 rounded-lg w-full" />
                  <div className="h-4 bg-slate-800/40 rounded-lg w-5/6" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-slate-800/40 rounded-lg w-full" />
                  <div className="h-4 bg-slate-800/40 rounded-lg w-4/5" />
                </div>
              </div>
            </div>
          )}

          {/* Generated/Completed State */}
          {status === "completed" && (
            <div className="flex-1 flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/5 px-2.5 py-1 border border-emerald-500/10 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Draft Generated
                </span>
              </div>

              {/* Dynamic Image Preview & Add Image Input Section */}
              <div className="space-y-2.5">
                {articleImage ? (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-800/85 group animate-in fade-in duration-300">
                    <img
                      src={articleImage}
                      alt="Article Cover"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setArticleImage("")}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-slate-950/80 hover:bg-rose-950/80 text-slate-350 hover:text-rose-455 border border-slate-800 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative border border-dashed border-slate-800 hover:border-indigo-500/40 rounded-xl p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-955/20 hover:bg-slate-950/40 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-200">
                      Click to upload header image
                    </span>
                    <span className="text-[9px] text-slate-600">
                      PNG, JPG or WEBP (Max 2MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Editable Title */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Editable Article Title
                </label>
                <input
                  type="text"
                  value={generatedTitle}
                  onChange={(e) => setGeneratedTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/40 border border-slate-800/60 focus:border-indigo-500/40 rounded-xl text-xs font-semibold text-slate-100 outline-none"
                />
              </div>

              {/* Editable Content */}
              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Editable Article Content
                </label>
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={8}
                  className="w-full flex-1 p-3 bg-slate-950/40 border border-slate-800/60 focus:border-indigo-500/40 rounded-xl text-xs text-slate-350 leading-relaxed outline-none resize-none overflow-y-auto no-scrollbar"
                />
              </div>

              {/* Removable Tags section */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Suggested Category Tags
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 animate-in fade-in zoom-in-95 duration-200"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(index)}
                        className="text-indigo-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Add Tag Input Box */}
                  <form onSubmit={addTag} className="inline-block relative">
                    <input
                      type="text"
                      placeholder="+ Add Tag"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-300 placeholder-slate-500 outline-none w-20 focus:w-28 transition-all"
                    />
                  </form>
                </div>
              </div>

              {/* Publish Trigger */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-4">
                <button
                  onClick={() => setStatus("idle")}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Discard Draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98] flex items-center gap-2"
                >
                  {publishing ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      Publish Article Live
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}