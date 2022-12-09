import $ from "jquery";
import "flot/source/jquery.canvaswrapper"
import "flot/source/jquery.colorhelpers"
import "flot/source/jquery.flot"
import "flot/source/jquery.flot.uiConstants"
const flotReq = require.context("../../node_modules/flot/source/", true, /flot.*\.js$/);
flotReq.keys().forEach(flotReq);

export default class PlotSeriesSplitter {
    seriesStorage = [];
    seriesStarts = [];
    seriesMedians = [];
    xMax = 0;
    yMax = 0;

    constructor() {
        let series = [[0, 0.0000049557], [0.03, 0.0000081299], [0.06, 0.000013204], [0.09, 0.000021233], [0.12, 0.000033803], [0.15, 0.000053279], [0.18, 0.000083142], [0.21, 0.00012845], [0.24, 0.00019648], [0.27, 0.00029754], [0.30000000000000004, 0.00044610], [0.33000000000000007, 0.00066218], [0.3600000000000001, 0.00097316], [0.3900000000000001, 0.0014159], [0.42000000000000015, 0.0020397], [0.4500000000000002, 0.0029089], [0.4800000000000002, 0.0041074], [0.5100000000000002, 0.0057419], [0.5400000000000003, 0.0079470], [0.5700000000000003, 0.010889], [0.6000000000000003, 0.014773], [0.6300000000000003, 0.019842], [0.6600000000000004, 0.026385], [0.6900000000000004, 0.034736], [0.7200000000000004, 0.045277], [0.7500000000000004, 0.058428], [0.7800000000000005, 0.074648], [0.8100000000000005, 0.094423], [0.8400000000000005, 0.11825], [0.8700000000000006, 0.14661], [0.9000000000000006, 0.17997], [0.9300000000000006, 0.21872], [0.9600000000000006, 0.26317], [0.9900000000000007, 0.31350], [1.0200000000000007, 0.36974], [1.0500000000000007, 0.43173], [1.0800000000000007, 0.49909], [1.1100000000000008, 0.57123], [1.1400000000000008, 0.64729], [1.1700000000000008, 0.72617], [1.2000000000000008, 0.80657], [1.2300000000000009, 0.88695], [1.260000000000001, 0.96564], [1.290000000000001, 1.0408], [1.320000000000001, 1.1107], [1.350000000000001, 1.1736], [1.380000000000001, 1.2276], [1.410000000000001, 1.2713], [1.440000000000001, 1.3035], [1.470000000000001, 1.3232], [1.500000000000001, 1.3298], [1.5300000000000011, 1.3232], [1.5600000000000012, 1.3035], [1.5900000000000012, 1.2713], [1.6200000000000012, 1.2276], [1.6500000000000012, 1.1736], [1.6800000000000013, 1.1107], [1.7100000000000013, 1.0408], [1.7400000000000013, 0.96564], [1.7700000000000014, 0.88695], [1.8000000000000014, 0.80657], [1.8300000000000014, 0.72617], [1.8600000000000014, 0.64729], [1.8900000000000015, 0.57123], [1.9200000000000015, 0.49909], [1.9500000000000015, 0.43173], [1.9800000000000015, 0.36974], [2.0100000000000016, 0.31350], [2.0400000000000014, 0.26317], [2.070000000000001, 0.21872], [2.100000000000001, 0.17997], [2.130000000000001, 0.14661], [2.1600000000000006, 0.11825], [2.1900000000000004, 0.094423], [2.22, 0.074648], [2.25, 0.058428], [2.28, 0.045277], [2.3099999999999996, 0.034736], [2.3399999999999994, 0.026385], [2.369999999999999, 0.019842], [2.399999999999999, 0.014773], [2.429999999999999, 0.010889], [2.4599999999999986, 0.0079470], [2.4899999999999984, 0.0057419], [2.5199999999999982, 0.0041074], [2.549999999999998, 0.0029089], [2.579999999999998, 0.0020397], [2.6099999999999977, 0.0014159], [2.6399999999999975, 0.00097316], [2.6699999999999973, 0.00066218], [2.699999999999997, 0.00044610], [2.729999999999997, 0.00029754], [2.7599999999999967, 0.00019648], [2.7899999999999965, 0.00012845], [2.8199999999999963, 0.000083142], [2.849999999999996, 0.000053279], [2.879999999999996, 0.000033803], [2.9099999999999957, 0.000021233], [2.9399999999999955, 0.000013204], [2.9699999999999953, 0.0000081299], [2.999999999999995, 0.0000049557], [3.029999999999995, 0.0000029908], [3.0599999999999947, 0.0000017870], [3.0899999999999945, 0.0000010571]];
        this.xMax = series[series.length - 1][0];

        this.seriesStorage.push(series);
        this.seriesStarts.push(0);
        this.seriesMedians.push(series[Math.trunc(series.length / 2)][0]);

        // document.getElementById('splitButton').addEventListener("click", splitAndRedraw);

        document.getElementById('splitButton').addEventListener("click", this.splitAndRedraw.bind(this));

        let plot = $.plot("#placeholder", [series]);
        this.xMax = plot.getAxes().xaxis.from;
        this.yMax = plot.getAxes().yaxis.max;
    }

    splitAndRedraw () {
        this.splitSeries();

        let placeholder = $("#placeholder");

        let plot = $.plot(placeholder, this.seriesStorage);

        let leftBottom = plot.pointOffset({ x: 0, y: 0 });
        let rightTop = plot.pointOffset({ x: this.xMax, y: this.yMax });

        // Append max marks
        let circlePoints = [];
        for (let i = 0; i < this.seriesStorage.length; i++) {
            let series = this.seriesStorage[i];
            let median = this.seriesMedians[i];
            let values = series.map(point => point[0]);
            let medianIndex = this.binarySearch(values, median, this.compare_number);

            let point = [median, series[medianIndex][1]]
            circlePoints.splice(1, 0, point);

            let o = plot.pointOffset({ x: point[0], y: point[1] });

            placeholder.append("<div style='position:absolute;left:" + (o.left - 5) + "px;top:" + (o.top - 20) + "px;color:#666;font-size:smaller'>" + median.toPrecision(2) + "</div>");
        }

        let beauty = {
            data: circlePoints,
            points: { show: true, radius: 2 },
            lines: { show: false },
            color: 'rgb(255, 100, 123)'
        };

        let seriesStorageWithBeauty = [...this.seriesStorage]
        seriesStorageWithBeauty.push(beauty);

        plot.setData(seriesStorageWithBeauty);
        plot.draw();
    }

    splitSeries() {
        let splitRange = 0.05;
        let splitPoint = document.getElementById('splitPoint').value;

        if (isNaN(splitPoint) || splitPoint < 0 || splitPoint >= this.xMax) {
            console.log('LOG', 'not splitting - all done for ' + splitPoint);
            return;
        }

        splitPoint = parseFloat(splitPoint)

        // find series in which split point is
        let seriesIndex = this.getInsertionPoint(this.binarySearch(this.seriesStarts, splitPoint, this.compare_number));

        if (splitPoint === this.seriesStarts[seriesIndex]) {
            return;
        } else if (seriesIndex !== 0) {
            seriesIndex--;
        }

        // split this series
        let splitted = this.splitSeriesInternal(this.seriesStorage[seriesIndex], splitPoint, splitRange);
        this.seriesStorage[seriesIndex] = splitted[0];

        let nextIndex = seriesIndex + 1;
        this.seriesStorage.splice(nextIndex, 0, splitted[1]);
        this.seriesStarts.splice(nextIndex, 0, splitPoint);

        let median1 = this.probabilityMedian(this.seriesStorage[seriesIndex]);
        let median2 = this.probabilityMedian(this.seriesStorage[nextIndex]);

        this.seriesMedians[seriesIndex] = median1;
        this.seriesMedians.splice(nextIndex, 0, median2);
    }

    probabilityMedian(probabilities) {
        let sum = 0;
        for (let i = 0; i < probabilities.length; i++) {
            sum += probabilities[i][1];
        }

        let halfSum = 0;
        for (let i = 0; i < probabilities.length; i++) {
            halfSum += probabilities[i][1];
            if (halfSum > sum / 2) {
                return probabilities[i - 1][0];
            }
        }
        return probabilities[probabilities.length - 1][0];
    }

    splitSeriesInternal(series, splitPoint, splitRange) {
        let series1 = [];
        let i = 0;
        while (i < series.length && series[i][0] < splitPoint - splitRange) {
            series1.push(series[i]);
            i++;
        }

        let series2 = [];
        let startSplitIndex = i;
        let endSplitIndex = this.indexOfValueHigherThan(series, splitPoint + splitRange);

        while (i < endSplitIndex) {
            let firstRatio = 1 - (i - startSplitIndex) / (endSplitIndex - startSplitIndex);
            series1.push([series[i][0], series[i][1] * firstRatio]);

            series2.push([series[i][0], series[i][1] * (1 - firstRatio)]);
            i++;
        }

        while (i < series.length) {
            series2.push([series[i][0], series[i][1]]);
            i++;
        }
        return [series1, series2];
    }

    indexOfValueHigherThan(array, value) {
        let highestLowerValueIndex = 0;
        while (highestLowerValueIndex < array.length && array[highestLowerValueIndex][0] < value) {
            highestLowerValueIndex++;
        }

        if (highestLowerValueIndex == array.length) {
            highestLowerValueIndex--;
        }

        return highestLowerValueIndex;
    }

    getInsertionPoint(binarySearchResult) {
        if (binarySearchResult < 0) {
            binarySearchResult = -binarySearchResult - 1;
        }
        return binarySearchResult;
    }

    binarySearch(ar, el, compare_fn) {
        let m = 0;
        let n = ar.length - 1;
        while (m <= n) {
            let k = (n + m) >> 1;
            let cmp = compare_fn(el, ar[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if (cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return -m - 1;
    }

    compare_number(a, b) {
        return a - b;
    }

    NormalDensityZx(x, Mean, StdDev) {
        let a = x - Mean;
        return Math.exp(-(a * a) / (2 * StdDev * StdDev)) / (Math.sqrt(2 * Math.PI) * StdDev);
    }

    generateTestSeries() {
        let series = [];
        for (let i = 0; i < 3.1; i += 0.03)
            series.push([i, NormalDensityZx(i, 1.5, 0.3).toPrecision(5)]);

        return series;
    }
}