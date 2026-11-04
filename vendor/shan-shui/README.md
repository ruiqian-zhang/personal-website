# Shan, Shui

Original source: https://github.com/LingDong-/shan-shui-inf (master, retrieved November 3, 2026).
Copyright (c) 2018 Lingdong Huang. MIT license; see LICENSE.txt.

The original index.html is preserved here. Run `node scripts/generate-landscapes.mjs`
to regenerate the seeded, compressed panoramic footer illustration. Only the
drawing functions run during generation, in an isolated context without DOM or
network access. The original page's UI and animation loop are not shipped.

Artwork is exported as transparent black ink: original white fills are composited before inverse luminance becomes alpha. This preserves mountain overlap while letting either site theme show through without blend modes.


The footer uses seed 1793758157519 at scroll position 2900, showing the mountain and open-water section chosen by the site owner. Foreground flat islands are omitted to preserve open water. The export fades from 67% to 86% of its width. An optional seed argument can be supplied to the generator for previews.


Desktop uses an extended view from x=0 to 4300, anchored at the original view's right edge so the fisherman keeps its position. The 1920px mobile crop is exported from the right side of the same artwork.
