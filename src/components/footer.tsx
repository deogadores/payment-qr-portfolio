export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-3">
        <p className="text-xs text-muted-foreground">
          If this tool made your day a little better, a coffee would mean the world — no pressure though!
        </p>
        <a
          href="https://ko-fi.com/X8X71WQF57"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            height="36"
            style={{ border: '0px', height: '36px' }}
            src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} JDG Tools. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
