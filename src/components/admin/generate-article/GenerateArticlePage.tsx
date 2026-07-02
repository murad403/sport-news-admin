"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Save, Trash2, Send, Plus, X, Globe, Eye, AlignLeft, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function GenerateArticlePage() {
  const { toast } = useToast();

  // Generator input states
  const [promptTitle, setPromptTitle] = useState("");
  const [promptDescription, setPromptDescription] = useState("");
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
    let title = "";
    let content = "";
    let suggestedTags: string[] = [];

    if (titleLower.includes("messi") || titleLower.includes("miami") || titleLower.includes("soccer") || titleLower.includes("football")) {
      title = promptTitle || "Messi Stuns with Match-Winning Free Kick in Extra Time";
      content = `In a thrilling encounter that kept fans on the edge of their seats, Lionel Messi once again proved why he is considered the greatest of all time. With the score locked at 2-2 in the 94th minute, Inter Miami was awarded a free kick 25 yards out.\n\nTaking a deep breath, the Argentine talisman curled a sublime strike over the wall, leaving the goalkeeper completely stranded as the ball rattled the top-left corner. The crowd erupted into absolute pandemonium.\n\n"We knew it was going to be a tough battle," said the manager in the post-match conference. "But when you have Lionel on the pitch, you always have a chance. That free kick was pure magic."\n\nThis victory extends Inter Miami's undefeated streak to six matches, catapulting them to the top of the conference standings. Fans and analysts alike are marveling at how Messi, even at this stage of his career, continues to deliver match-winning spectacles under maximum pressure.`;
      suggestedTags = ["Soccer", "Messi", "Inter Miami", "MLS"];
    } else if (titleLower.includes("hamilton") || titleLower.includes("f1") || titleLower.includes("grand prix") || titleLower.includes("race")) {
      title = promptTitle || "Hamilton Secures Historic Pole Position at Monaco Grand Prix";
      content = `Lewis Hamilton delivered one of the greatest qualifying laps in Formula 1 history to secure pole position on the streets of Monte Carlo. Navigating the narrow, barrier-lined circuit with millimeter precision, the veteran British driver clocked a blistering time of 1:10.166.\n\nHis teammate finished just 0.082 seconds behind in a tense session, while the current championship leader was forced to settle for third after clipping the guardrail at the swimming pool chicane.\n\n"The car felt like it was on rails today," Hamilton said, visibly emotional after stepping out of the cockpit. "This track requires absolute commitment, and I gave it everything. Starting from pole here is half the battle, but Sunday is where the points are won."\n\nWith overtaking notoriously difficult in Monaco, all eyes will be on the start line. Strategy and tire degradation are expected to play pivotal roles in what promises to be a dramatic grand prix.`;
      suggestedTags = ["F1", "Hamilton", "Monaco GP", "Motorsport"];
    } else if (titleLower.includes("lebron") || titleLower.includes("nba") || titleLower.includes("lakers") || titleLower.includes("basketball")) {
      title = promptTitle || "LeBron James Drops 40 Points in Thrilling Lakers Comeback";
      content = `LeBron James put on a masterclass performance, scoring 40 points to guide the Los Angeles Lakers to a stunning 115-112 comeback victory after trailing by 18 points in the third quarter.\n\nJames was unstoppable in the paint, hitting 14 of 22 field goals while racking up 9 assists and 8 rebounds. His clutch three-pointer with 12 seconds remaining sealed the victory, leaving the home crowd in raptures.\n\n"We never stopped believing," James remarked in his post-game interview. "We were sluggish in the first half, but we locked down defensively when it mattered most. It's a team game, and everybody contributed."\n\nThis crucial win puts the Lakers back in the playoff conversation, showcasing that even in his 23rd season, LeBron's impact on the court remains unmatched.`;
      suggestedTags = ["NBA", "LeBron", "Lakers", "Basketball"];
    } else {
      title = promptTitle || "The Rise of Next-Gen Superstars in Modern Athletics";
      content = `The sports landscape is experiencing a massive paradigm shift as a new generation of athletes takes center stage. From football pitches to tennis courts, young prodigies under the age of 21 are not just competing—they are dominating.\n\nThis analytical overview explores how improvements in youth training academies, data-driven diet plan optimization, and psychological conditioning have enabled teenagers to perform at elite senior levels.\n\nVeterans are finding themselves pushed to their limits by newcomers who play with no fear and showcase athletic parameters previously thought impossible. Sports scientists suggest that this trend will only accelerate over the next decade.\n\n"The game is faster and more demanding than ever before," commented a leading sports analyst. "What we are witnessing is the evolution of athletic performance in real time."`;
      suggestedTags = ["Sports Science", "Youth Athletics", "Next-Gen", "Analysis"];
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
                Article Topic / Working Title
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

            {/* Context/Description Prompt */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Context / Key Notes (Optional)
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