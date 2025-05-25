export function getImageToShow(image: string | null, url: string | null): string {
  if (image) {
    return image
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const match = url?.match(urlRegex)

  if (match && match[0]) {
    const siteUrl = encodeURIComponent(match[0])
    return `https://api.microlink.io/?url=${siteUrl}&screenshot=true&meta=false&embed=screenshot.url`
  }

  return 'https://ionicframework.com/docs/img/demos/thumbnail.svg'
}
