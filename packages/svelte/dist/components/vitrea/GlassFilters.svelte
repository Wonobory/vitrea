<!--
  SVG filters the glass surfaces need. Render once in the root layout.
  `#glass-null` does nothing on purpose: Safari draws the text of a scaled element
  ~1 px lower than unscaled, so glass buttons jumped on press or hover. With an SVG
  filter Safari rasterises the button unscaled and scales the image.
-->
<svg width="0" height="0" class="absolute" aria-hidden="true">
	<filter id="glass-null" x="-25%" y="-50%" width="150%" height="200%"><feOffset /></filter>
</svg>
