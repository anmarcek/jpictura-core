/*!
 * jPictura Core v0.1.7
 * https://github.com/anmarcek/jpictura-core.git
 *
 * Copyright (c) 2015-2017 Anton Marček
 * Released under the MIT license
 *
 * Date: 2017-01-17T10:11:12.494Z
 */
var jpictura = {
    core: {
    }
};
jpictura.core.debounce = function (func, wait, immediate) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        var later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };

        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};

jpictura.core.offWindowWidthResize = function (eventNamespace) {
    $(window).off('.' + eventNamespace);
};

jpictura.core.onWindowWidthResize = function (eventNamespace, callback) {
    var $window = $(window);
    var lastWindowWidth = $window.width();
    $window.on('resize.' + eventNamespace, function () {
        var windowWidth = $window.width();
        if (lastWindowWidth !== windowWidth) {
            callback();
            lastWindowWidth = windowWidth;
        }
    });
};
jpictura.core.heightCalculator = function (getItemsWidthForHeightFunc, logFunc, opts) {
    var log = logFunc;
    var getItemsWidthForHeight = getItemsWidthForHeightFunc;
    var options = opts;

    var minHeight;
    var maxHeight;
    var pivotHeight;

    this.getHeight = function (row, desiredItemsWidth) {
        if (row.length === 0) {
            return (0);
        }

        initialize(desiredItemsWidth);

        var height = calculateHeight(row, desiredItemsWidth);
        height = roundHeight(height, row, desiredItemsWidth);

        return height;
    };

    function initialize(desiredItemsWidth) {
        setInitialMinHeight(desiredItemsWidth);
        setInitialMaxHeight(desiredItemsWidth);
        setPivotHeight();
    }

    function setInitialMinHeight(desiredItemsWidth) {
        var epsilon = 0;
        var ho = options.layout.idealRowHeight;
        var rMax = options.layout.maxWidthHeightRatio;
        minHeight = desiredItemsWidth / (((desiredItemsWidth - epsilon) / ho) + rMax);
    }

    function setInitialMaxHeight(desiredItemsWidth) {
        var epsilon = 0;
        var ho = options.layout.idealRowHeight;
        var rMax = options.layout.maxWidthHeightRatio;

        if (rMax * ho >= desiredItemsWidth) {
            if (options.debug) {
                log("The max width/height ratio " + rMax + " is too big for row width " + desiredItemsWidth + "px.");
            }
            maxHeight = desiredItemsWidth * rMax;
        } else {
            maxHeight = desiredItemsWidth / (((desiredItemsWidth + epsilon) / ho) - rMax);
        }
    }

    function calculateHeight(row, desiredItemsWidth) {
        var i = 0;
        var itemsWidth;
        var continueApproximation;

        do {
            itemsWidth = getItemsWidthForHeight(row, pivotHeight, false, options);

            if (itemsWidth > desiredItemsWidth) {
                maxHeight = pivotHeight;
            } else {
                minHeight = pivotHeight;
            }
            setPivotHeight(minHeight, maxHeight);

            continueApproximation = false;
            if (desiredItemsWidth < itemsWidth) {
                continueApproximation = true;
            }
            if ((desiredItemsWidth - itemsWidth) > options.algorithm.epsilon) {
                continueApproximation = true;
            }
            if ((++i) >= options.algorithm.maxIterationCount) {
                continueApproximation = false;
            }
        } while (continueApproximation);

        if ((i >= options.algorithm.maxIterationCount) && (options.debug)) {
            log('Max ' + i + ' iterations reached. Current precision: ' + (desiredItemsWidth - itemsWidth) + '.');
        }

        return pivotHeight;
    }

    function setPivotHeight() {
        pivotHeight = (minHeight + maxHeight) / 2;
    }

    function roundHeight(height, row, desiredItemsWidth) {
        height = Math.floor(height);

        var itemsWidth;
        do {
            itemsWidth = getItemsWidthForHeight(row, height, true, options);
        } while (itemsWidth < desiredItemsWidth && height++);

        return height;
    }
};
