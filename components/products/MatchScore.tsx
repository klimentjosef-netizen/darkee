export default function MatchScore({ score }: { score: number }) {
  return (
    <span className="text-[11px] font-bold text-teal bg-[rgba(78,205,196,0.10)] px-2 py-[3px] rounded-md">
      {score}% shoda
    </span>
  )
}
