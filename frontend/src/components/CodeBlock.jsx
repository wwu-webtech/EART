export default function CodeBlock({
  code = "",
  language = "html",
  label = "Code block",
}) {
  return (
    <div className="flex relative group">
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="max-w-full  h-72 overflow-y-scroll overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 text-xl font-mono p-4"
      >
        <pre>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
