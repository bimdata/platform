#! /bin/bash

set -e

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Missing GITHUB_TOKEN environment variable.";
  exit 1;
fi

remote="https://$GITHUB_ACTOR:$GITHUB_TOKEN@github.com/$GITHUB_REPOSITORY.git"
base_branch=$INPUT_BASE-BRANCH
head_branch="chore/npm-check-updates-$(date -u +'%Y-%m-%dT%H%M%S')"

# Update dependencies
git cko $base_branch
npx ncu -u
npm install

# Commit and push changes
git cko -b $head_branch
git add package.json package-lock.json
git commit -m "chore(deps): update dependencies with ncu"

git push $remote $head_branch

# Create pull request
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$GITHUB_REPOSITORY/pulls \
  -d "{ \"title\": \"Update Dependencies\", \"head\": \"$head_branch\", \"base\": \"$base_branch\" }"

exit 0
