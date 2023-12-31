import { barycenter, centroid } from "./helpers.js";

/**
 * 
 * @param {import("./helpers.js").Quadrangle} quadrangle 
 * @returns {import("./helpers.js").Quadrangle[]}
 */
export function simplePeano(quadrangle) {
    const [A, B, C, D] = quadrangle;
    /** @type {import("./helpers.js").Quadrangle[]} */
    const quadrangles = [
        [barycenter([A, 1], [B, 0], [C, 0], [D, 2]), barycenter([A, 2], [B, 1], [C, 2], [D, 4]), barycenter([A, 0], [B, 0], [C, 1], [D, 2]), barycenter([A, 0], [B, 0], [C, 0], [D, 1])],
        [barycenter([A, 4], [B, 2], [C, 1], [D, 2]), barycenter([A, 2], [B, 0], [C, 0], [D, 1]), barycenter([A, 1], [B, 0], [C, 0], [D, 2]), barycenter([A, 2], [B, 1], [C, 2], [D, 4])],
        [barycenter([A, 1], [B, 0], [C, 0], [D, 0]), barycenter([A, 2], [B, 1], [C, 0], [D, 0]), barycenter([A, 4], [B, 2], [C, 1], [D, 2]), barycenter([A, 2], [B, 0], [C, 0], [D, 1])],
        [barycenter([A, 4], [B, 2], [C, 1], [D, 2]), barycenter([A, 2], [B, 4], [C, 2], [D, 1]), barycenter([A, 1], [B, 2], [C, 0], [D, 0]), barycenter([A, 2], [B, 1], [C, 0], [D, 0])],
        [barycenter([A, 1], [B, 2], [C, 4], [D, 2]), barycenter([A, 2], [B, 1], [C, 2], [D, 4]), barycenter([A, 4], [B, 2], [C, 1], [D, 2]), barycenter([A, 2], [B, 4], [C, 2], [D, 1])],
        [barycenter([A, 0], [B, 0], [C, 1], [D, 2]), barycenter([A, 0], [B, 0], [C, 2], [D, 1]), barycenter([A, 1], [B, 2], [C, 4], [D, 2]), barycenter([A, 2], [B, 1], [C, 2], [D, 4])],
        [barycenter([A, 1], [B, 2], [C, 4], [D, 2]), barycenter([A, 0], [B, 1], [C, 2], [D, 0]), barycenter([A, 0], [B, 0], [C, 1], [D, 0]), barycenter([A, 0], [B, 0], [C, 2], [D, 1])],
        [barycenter([A, 0], [B, 2], [C, 1], [D, 0]), barycenter([A, 2], [B, 4], [C, 2], [D, 1]), barycenter([A, 1], [B, 2], [C, 4], [D, 2]), barycenter([A, 0], [B, 1], [C, 2], [D, 0])],
        [barycenter([A, 1], [B, 2], [C, 0], [D, 0]), barycenter([A, 0], [B, 1], [C, 0], [D, 0]), barycenter([A, 0], [B, 2], [C, 1], [D, 0]), barycenter([A, 2], [B, 4], [C, 2], [D, 1])]
    ];
    return quadrangles;
}

/**
 * 
 * @param {import("./helpers.js").Quadrangle} quadrangle 
 * @param {number} iteration 
 */
export function peanoCurve(quadrangle, iteration) {
    /**
     * 
     * @param {import("./helpers.js").Quadrangle[]} result 
     * @param {number} step 
     * @returns {import("./helpers.js").Quadrangle[]}
     */
    function recur(result, step) {
        if (step >= iteration) {
            return result;
        }

        return recur(result.flatMap((element) => simplePeano(element)), step + 1);
    }

    return recur([quadrangle], 0);
}

/**
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {[number, string][]} colors
 * @param {import("./helpers.js").Quadrangle} quadrangle 
 * @param {number} iteration 
 */
export function drawPeanoCurve(context, colors, quadrangle, iteration) {
    const quadrangles = peanoCurve(quadrangle, iteration);
    const centroids = quadrangles.map((element) => centroid(...element));

    context.beginPath();
    const linearGradient = context.createLinearGradient(centroids[0][0], centroids[0][1], centroids[centroids.length - 1][0], centroids[centroids.length - 1][1]);
    colors.forEach(([key, val]) => linearGradient.addColorStop(key, val));
    centroids.forEach((point, index) => {
        if (index === 0) {
            context.moveTo(...point);
        } else {
            context.lineTo(...point);
        }
    });
    context.strokeStyle = linearGradient;
    context.stroke();
}