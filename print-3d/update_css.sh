#!/bin/bash

# Input the new version or path for main.css
new_version=$1

# Check if an argument is provided
if [ -z "$new_version" ]; then
  echo "Usage: $0 new_version (e.g., /css/main.css?v=7.41)"
  exit 1
fi

# Find and replace in all .html files in the current directory
for file in *.html; do
  # Only modify if the file contains the old link tag
  if grep -q '<link rel="stylesheet" href="/css/main.css?v=' "$file"; then
    # Use sed to replace the href path with the new version
    sed -i "s|<link rel=\"stylesheet\" href=\"/css/main.css?v=[^\"]*\">|<link rel=\"stylesheet\" href=\"$new_version\">|g" "$file"
    echo "Updated $file with $new_version"
  else
    echo "No match found in $file"
  fi
done

