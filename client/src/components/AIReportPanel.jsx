export default function AIReportPanel({ report, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse-dot inline-block" />
        <span className="text-xs text-[var(--color-muted)]">Generating AI resilience report...</span>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="animate-fade-in">
      <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-3">◆ AI Resilience Report</p>
      <div className="bg-[var(--color-surface2)] border border-[var(--color-border)] border-l-[3px] border-l-[var(--color-accent)] rounded-r-xl p-5 text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-wrap">
        {report}
      </div>
    </div>
  )
}