export default function parseFigmaUrl(url: string) {
    const fileKeyMatch = url.match(/file\/([^\/]+)/)
    const imageIdMatch = url.match(/node-id=([0-9-]+)/)

    if (fileKeyMatch && imageIdMatch) {
        const fileKey = fileKeyMatch[1]
        const imageId = imageIdMatch[1]

        return { fileKey, imageId }
    }

    return { fileKey: '', imageId: '' }
}
