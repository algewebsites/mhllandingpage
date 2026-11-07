#!/bin/bash
# Builds the clean upload folder "site/" for Netlify.
# Run from anywhere:  bash "build-site.sh"
# Then drag the "site" folder into Netlify (Deploys → drag & drop).
set -euo pipefail
cd "$(dirname "$0")"

rm -rf site
mkdir -p site/assets/quiz/fonts site/downloads

# Pages
cp index.html sleep-quiz.html thanks.html site/

# Landing page assets
cp assets/styles.css assets/main.js assets/favicon-koralle.png site/assets/

# Quiz assets, photos and fonts
cp assets/quiz/quiz.css assets/quiz/quiz.js assets/quiz/*.jpg site/assets/quiz/
cp assets/quiz/fonts/*.woff2 site/assets/quiz/fonts/

# PDFs (general reset + one per sleep type)
cp downloads/*.pdf site/downloads/

echo "Built site/:"
find site -type f | sort
du -sh site
