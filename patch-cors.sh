#!/bin/bash
# Patch Next.js to never block cross-origin requests (needed for preview iframe)
PATCHED_MARKER=".next/cors-patched"
if [ ! -f "$PATCHED_MARKER" ]; then
  TARGET="node_modules/next/dist/server/lib/router-utils/block-cross-site.js"
  if [ -f "$TARGET" ]; then
    # Check if already patched
    if ! rg -q "PATCHED: Always allow" "$TARGET" 2>/dev/null; then
      echo "Patching Next.js cross-origin block..."
      cat > "$TARGET" << 'PATCHEOF'
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "blockCrossSite", {
    enumerable: true,
    get: function() {
        return blockCrossSite;
    }
});
// PATCHED: Always allow cross-origin requests for preview iframe support
const blockCrossSite = (req, res, allowedDevOrigins, hostname)=>{
    return false;
};
PATCHEOF
      mkdir -p .next
      touch "$PATCHED_MARKER"
      echo "Next.js CORS patch applied."
    else
      echo "Next.js already patched."
      mkdir -p .next
      touch "$PATCHED_MARKER"
    fi
  else
    echo "Warning: $TARGET not found."
  fi
else
  echo "Already patched (marker exists)."
fi
