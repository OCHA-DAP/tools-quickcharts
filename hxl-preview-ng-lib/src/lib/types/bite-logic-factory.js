"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var comparison_chart_bite_logic_1 = require("./comparison-chart-bite-logic");
var comparison_chart_bite_1 = require("./comparison-chart-bite");
var key_figure_bite_1 = require("./key-figure-bite");
var key_figure_bite_logic_1 = require("./key-figure-bite-logic");
var chart_bite_1 = require("./chart-bite");
var chart_bite_logic_1 = require("./chart-bite-logic");
var timeseries_chart_bite_1 = require("./timeseries-chart-bite");
var timeseries_chart_bite_logic_1 = require("./timeseries-chart-bite-logic");
var BiteLogicFactory = /** @class */ (function () {
    function BiteLogicFactory() {
    }
    BiteLogicFactory.createBiteLogic = function (bite) {
        if (bite) {
            switch (bite.type) {
                case key_figure_bite_1.KeyFigureBite.type():
                    return new key_figure_bite_logic_1.KeyFigureBiteLogic(bite);
                case chart_bite_1.ChartBite.type():
                    return new chart_bite_logic_1.ChartBiteLogic(bite);
                case timeseries_chart_bite_1.TimeseriesChartBite.type():
                    return new timeseries_chart_bite_logic_1.TimeseriesChartBiteLogic(bite);
                case comparison_chart_bite_1.ComparisonChartBite.type():
                    return new comparison_chart_bite_logic_1.ComparisonChartBiteLogic(bite);
                default:
                    return null;
            }
        }
        return null;
    };
    return BiteLogicFactory;
}());
exports.BiteLogicFactory = BiteLogicFactory;
//# sourceMappingURL=bite-logic-factory.js.map