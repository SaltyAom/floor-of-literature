const fetcher = async (url: string) => {
    let request = await fetch(url);

    return request.json()
}

export default fetcher