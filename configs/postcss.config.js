const { v2, v3 } = require("./tailwind.config.js");

// These are used in shared-rails-engine...
const baseSafelist = [
  // From shared_icons_helper.rb
  "mr-3", "mb-1", "ml-1",
  "h-4", "w-4",
  "h-5", "w-5",
  "h-6", "w-6",
  "h-10", "w-10",
  "text-green-500", "text-yellow-600", "text-blue-400", "text-gray-600",
  "inline", "inline-block", "fill-current", "flex-shrink-0",
  "hover:fill-current", "hover:text-gray-800",

  // From view_component_preview layout
  "min-h-screen", "p-16", "bg-white", "text-gray-800",

  // From SharedUI::ButtonComponent
  "whitespace-nowrap",

  // From SharedUI::LabelComponent
  "bg-green-50", "text-green-900",
  "bg-blue-100", "text-blue-800",
  "bg-red-50", "text-red-700",
  "bg-gray-100", "text-gray-800",
  "bg-purple-100", "text-indigo-800",
  "bg-yellow-50", "text-yellow-800",
  "fuschia-label-background", "fuschia-label-text",

  "inline-flex", "items-center", "justify-start", "rounded", "mr-4", "space-x-2", "px-2", "text-sm", "font-medium",
];

const buildConfig = (tailwindVersion = 2, tailwindSafelist) => {
  const tailwindConfig = (tailwindVersion === 2 ? v2 : v3);

  const safelist = [
    ...baseSafelist,
    ...(tailwindSafelist || []),
  ];

  if (tailwindVersion === 2) {
    tailwindConfig.purge.safelist = safelist;
  } else {
    tailwindConfig.safelist = safelist;
  }

  return ({
    parser: "postcss-scss",
    plugins: [
      require("postcss-easy-import")({ prefix: "_", extensions: [".css", ".scss"] }),
      require("postcss-nested-vars"),
      require("tailwindcss/nesting"),
      require("tailwindcss")(tailwindConfig),
      require("postcss-flexbugs-fixes"),
      require("postcss-preset-env")({
        autoprefixer: {
          flexbox: "no-2009",
        },
        features: {
          "nesting-rules": false, // Will be handled by tailwindcss/nesting, instead
        },
        stage: 3,
      }),
      require("cssnano")({ preset: "default" }),
      require("postcss-reporter")({ clearReportedMessages: true }),
    ],
  });
};

module.exports = {
  buildConfig,
};
