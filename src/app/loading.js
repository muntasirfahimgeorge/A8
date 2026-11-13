cat << 'EOF' > src/app/loading.js
export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Loading StudioSpace...
      </p>
    </div>
  );
}
EOF
