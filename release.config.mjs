/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  preset: "eslint",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { tag: "PATCH", release: "patch" },
          { tag: "MINOR", release: "minor" },
          { tag: "MAJOR", release: "major" },
        ],
        parserOpts: {
          headerPattern: /^(PATCH|MINOR|MAJOR): (.*)$/,
          headerCorrespondence: ["tag", "subject"],
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ],
  branches: [
    "main",
    "master",
  ],
};
