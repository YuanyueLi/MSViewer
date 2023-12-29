import createModule from './msentropy.mjs';

const wasm = createModule().then((Module) => {
    const arrayMalloc = (arr) => {
        // Get data byte size, allocate memory on Emscripten heap, and get pointer
        var nDataBytes = arr.length * arr.BYTES_PER_ELEMENT;
        var dataPtr = Module._malloc(nDataBytes);

        // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
        var dataHeap = new Uint8Array(
            Module.HEAPU8.buffer,
            dataPtr,
            nDataBytes
        );
        dataHeap.set(new Uint8Array(arr.buffer));

        return dataHeap;
    };
    const arrayFreeAndExtract = (dataHeap, arrayType, bytes) => {
        // Free memory
        let result = new arrayType(
            dataHeap.buffer,
            dataHeap.byteOffset,
            dataHeap.length / bytes
        );
        Module._free(dataHeap.byteOffset);
        return result;
    };
    const arrayFree = (dataHeap) => Module._free(dataHeap.byteOffset);

    const clean_spectrum = Module.cwrap("wasm_clean_spectrum", "number",
        ["number", "number", "number", "number", "number", "number", "number", "number", "number",]);
    const calculate_entropy_similarity = Module.cwrap("wasm_calculate_entropy_similarity", "number",
        ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number",])
    const calculate_unweighted_entropy_similarity = Module.cwrap("wasm_calculate_unweighted_entropy_similarity", "number",
        ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number",])

    return [arrayMalloc, arrayFreeAndExtract, arrayFree, clean_spectrum, calculate_entropy_similarity, calculate_unweighted_entropy_similarity];
});

const calculateEntropySimilarity = async (peaksA, peaksB, options) => {
    return wasm.then(([arrayMalloc,
                          arrayFreeAndExtract,
                          arrayFree,
                          clean_spectrum,
                          calculate_entropy_similarity,
                          calculate_unweighted_entropy_similarity]) => {
        // Set default options
        const defaultOptions = {
            ms2ToleranceInDa: 0.02,
            removeNoise: 0.01,
        }
        options = {...defaultOptions, ...options};
        const {ms2ToleranceInDa, removeNoise} = options;

        // Flatten peaks
        const peaksAFlat = [].concat(...peaksA);
        const peaksBFlat = [].concat(...peaksB);

        // Allocate memory
        const peaksAHeap = arrayMalloc(new Float32Array(peaksAFlat));
        const peaksBHeap = arrayMalloc(new Float32Array(peaksBFlat));

        // Calculate entropy similarity
        const result = calculate_entropy_similarity(
            peaksAHeap.byteOffset, peaksA.length,
            peaksBHeap.byteOffset, peaksB.length,
            ms2ToleranceInDa, -1,
            1, -1, -1, removeNoise, 0);
        arrayFree(peaksAHeap);
        arrayFree(peaksBHeap);

        return result;
    })
};

const calculateUnweightedEntropySimilarity = async (peaksA, peaksB, options) => {
    return wasm.then(([arrayMalloc,
                          arrayFreeAndExtract,
                          arrayFree,
                          clean_spectrum,
                          calculate_entropy_similarity,
                          calculate_unweighted_entropy_similarity]) => {
        // Set default options
        const defaultOptions = {
            ms2ToleranceInDa: 0.02,
            removeNoise: 0.01,
        }
        options = {...defaultOptions, ...options};
        const {ms2ToleranceInDa, removeNoise} = options;

        // Flatten peaks
        const peaksAFlat = [].concat(...peaksA);
        const peaksBFlat = [].concat(...peaksB);

        // Allocate memory
        const peaksAHeap = arrayMalloc(new Float32Array(peaksAFlat));
        const peaksBHeap = arrayMalloc(new Float32Array(peaksBFlat));

        // Calculate entropy similarity
        const result = calculate_unweighted_entropy_similarity(
            peaksAHeap.byteOffset, peaksA.length,
            peaksBHeap.byteOffset, peaksB.length,
            ms2ToleranceInDa, -1,
            1, -1, -1, removeNoise, 0);
        arrayFree(peaksAHeap);
        arrayFree(peaksBHeap);

        return result;
    })
}

export {wasm, calculateEntropySimilarity, calculateUnweightedEntropySimilarity};