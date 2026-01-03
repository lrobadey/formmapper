export const exportCanvasPng = (canvas: HTMLCanvasElement, title: string) => {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${title || "Untitled"}.png`;
  link.click();
};
