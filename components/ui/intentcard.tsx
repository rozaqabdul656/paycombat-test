export const IntentCard = ({ intent }: { intent: any }) => {
  if (!intent) return null;

  return (
    <div className="rounded-lg border p-4 bg-zinc-100 dark:bg-zinc-900 shadow">
      <p className="font-semibold text-sm text-muted-foreground mb-2">
        🧠 AI Intent Detected: <span className="uppercase">{intent.action}</span>
      </p>
      <ul className="text-sm space-y-1">
        {Object.entries(intent).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};
