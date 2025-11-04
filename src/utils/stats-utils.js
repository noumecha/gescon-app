const makeBreakable = (str) => {
    if (!str) return str;
    return str.replace(/\//g, '/ ');
};

const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
};

export { makeBreakable, chunkArray };