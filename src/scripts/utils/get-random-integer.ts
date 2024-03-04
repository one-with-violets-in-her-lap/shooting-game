export function getRandomInteger(minInclusiveNumber: number, maxExclusiveNumber: number) {
    return Math.floor(Math.random() * (maxExclusiveNumber - minInclusiveNumber + 1))
        + minInclusiveNumber;
}
