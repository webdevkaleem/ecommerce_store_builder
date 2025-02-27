export function isEven(number: number) {
  return number % 2 === 0;
}

// Function that transforms a slug into a readable label, make it industry standard
export function slugToLabel(string: string) {
  return string
    .trim()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Function that transforms a label into a slug, make it industry standard
export function labelToSlug(string: string) {
  return string.trim().toLowerCase().split(" ").join("-");
}

// Create a function which takes in an array and leaves just the starting and ending elements, thus if i enter an array of 10 elements, just the first and last are returned
export function getFirstLastAndDots(array: unknown[]) {
  return [array[0], "...", array[array.length - 1]];
}

export function fakeDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type SearchParamsType = Promise<
  Record<string, string | string[] | undefined>
>;

export type ParamsId = Promise<{ id: string }>;

export function checkCollection({
  pathname,
  collectionCheck,
}: {
  pathname: string;
  collectionCheck: string;
}) {
  const chunks = pathname.split("/");
  return chunks[chunks.length - 1] === labelToSlug(collectionCheck);
}

export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
