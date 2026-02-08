import QRCode from "qrcode";

export async function drawQRCode(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  size: number,
  darkColor: string,
  lightColor: string,
): Promise<void> {
  const tempCanvas = document.createElement("canvas");
  await QRCode.toCanvas(tempCanvas, url, {
    width: size,
    margin: 1,
    color: { dark: darkColor, light: lightColor },
    errorCorrectionLevel: "M",
  });
  ctx.drawImage(tempCanvas, x, y, size, size);
}
