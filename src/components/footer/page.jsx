import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-[#07080b] py-8 text-sm text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-xs text-neutral-400 text-center sm:text-left">
          &copy; {currentYear} <span className="text-white font-medium">Karan Govind Malkar</span> — UI/UX & Graphic Designer. All rights reserved.
        </p>

        <div className="flex items-center flex-wrap justify-center gap-6 text-xs font-medium">
          <Link
            href="https://www.linkedin.com/in/karan-malkar-75579a3b4?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            LinkedIn
          </Link>
          <Link
            href="https://github.com/karanmalkar"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </Link>
          <a
            href="/assets/9e46a5bd-0789-4900-a7dc-8ef7bb383ee6.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Resume (PDF) ↗
          </a>
          <a
            href="mailto:karanmalkar6@gmail.com"
            className="transition hover:text-white"
          >
            karanmalkar6@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
