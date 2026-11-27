#!/usr/bin/env bash
# Builds the GitHub Pages site: one Mochawesome report per browser and a landing page
# with the results of each one. Expects the artifacts in downloads/mochawesome-<browser>.
set -euo pipefail

site="site"
mkdir -p "$site"
cards=""

for browser in chrome firefox edge; do
  source_dir="downloads/mochawesome-$browser"
  label="$(tr '[:lower:]' '[:upper:]' <<< "${browser:0:1}")${browser:1}"

  if [[ ! -f "$source_dir/index.html" ]]; then
    cards+="<a class=\"card\"><strong>$label</strong>No report for this run.</a>"
    continue
  fi

  cp -r "$source_dir" "$site/$browser"

  # Totals from the JSON files the reporter writes for each spec
  summary="Report"
  if compgen -G "$source_dir/.jsons/*.json" > /dev/null; then
    summary="$(jq -s -r '
      map(.stats) |
      "\(map(.passes) | add) of \(map(.tests) | add) passed · \(map(.failures) | add) failed"
    ' "$source_dir"/.jsons/*.json)"
  fi

  cards+="<a class=\"card\" href=\"$browser/index.html\"><strong>$label</strong><span class=\"numbers\">$summary</span></a>"
done

run_info="#${GITHUB_RUN_NUMBER:-local} · $(date -u '+%Y-%m-%d %H:%M UTC') · ${GITHUB_SHA:0:7}"

sed -e "s|RUN_INFO|$run_info|" -e "s|BROWSER_CARDS|$cards|" report/index.html > "$site/index.html"
touch "$site/.nojekyll"
echo "Site built:" && ls -la "$site"
