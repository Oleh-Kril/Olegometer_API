export default function parseFigmaUrl(url: string) {
    const fileKeyMatch = url.match(/file\/([^\/]+)/)
    const designsFileKeyMatch = url.match(/design\/([^\/]+)/)
    const imageIdMatch = url.match(/node-id=([0-9-]+)/)

    if ((fileKeyMatch || designsFileKeyMatch) && imageIdMatch) {
        const fileKey = fileKeyMatch?.length > 1 ? fileKeyMatch[1] : designsFileKeyMatch[1]
        const imageId = imageIdMatch[1]

        return { fileKey, imageId }
    }

    return { fileKey: '', imageId: '' }
}
