#!/bin/bash

# Input the new version or path for the main.js
new_version=$1

# Check if an argument is provided
if [ -z "$new_version" ]; then
  echo "Usage: $0 new_version (e.g., /java/main.js?v=7.21)"
  exit 1
fi

# Find and replace in all .html files in the current directory
for file in *.html; do
  # Only modify if the file contains the old script tag
  if grep -q '<script src="/java/main.js?v=' "$file"; then
    # Use sed to replace the src path with the new version
    sed -i "s|<script src=\"/java/main.js?v=[^\"]*\">|<script src=\"$new_version\">|g" "$file"
    echo "Updated $file with $new_version"
  else
    echo "No match found in $file"
  fi
done

