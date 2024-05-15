/* eslint-disable no-unreachable */
//const Chart = require("chart.js");
import Chart from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useState,useEffect } from "react";


Chart.elements.Rectangle.prototype.draw = function () {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  var cornerRadius = 6;

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || "bottom";
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || "left";
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom],
  ];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ["bottom", "left", "top", "right"];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    let nextCornerId = i + 1;
    if (nextCornerId === 4) {
      nextCornerId = 0;
    }

    // let nextCorner = cornerAt(nextCornerId);

    let width = corners[2][0] - corners[1][0];
    let height = corners[0][1] - corners[1][1];
    let x = corners[1][0];
    let y = corners[1][1];
    // eslint-disable-next-line
    var radius = cornerRadius;

    // Fix radius being too large
    if (radius > height / 2) {
      radius = height / 2;
    }
    if (radius > width / 2) {
      radius = width / 2;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

var mode = "light"; //(themeMode) ? themeMode : 'light';
var fonts = {
  base: "Open Sans",
};

// Colors
var colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529",
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340",
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent",
};

// Methods

// Chart.js global options
export function chartOptions() {
  // Options
  var options = {
    defaults: {
      global: {
        responsive: true,
        maintainAspectRatio: false,
        defaultColor: mode === "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontColor: mode === "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontFamily: fonts.base,
        defaultFontSize: 13,
        layout: {
          padding: 0,
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 16,
          },
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: colors.theme["primary"],
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
            borderColor: colors.theme["primary"],
            backgroundColor: colors.transparent,
            borderCapStyle: "rounded",
          },
          rectangle: {
            backgroundColor: colors.theme["warning"],
          },
          arc: {
            backgroundColor: colors.theme["primary"],
            borderColor: mode === "dark" ? colors.gray[800] : colors.white,
            borderWidth: 4,
          },
        },
        tooltips: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function (chart) {
          var data = chart.data;
          var content = "";

          data.labels.forEach(function (label, index) {
            var bgColor = data.datasets[0].backgroundColor[index];

            content += '<span class="chart-legend-item">';
            content +=
              '<i class="chart-legend-indicator" style="background-color: ' +
              bgColor +
              '"></i>';
            content += label;
            content += "</span>";
          });

          return content;
        },
      },
    },
  };

  // yAxes
  Chart.scaleService.updateScaleDefaults("linear", {
    gridLines: {
      borderDash: [2],
      borderDashOffset: [2],
      color: mode === "dark" ? colors.gray[900] : colors.gray[300],
      drawBorder: false,
      drawTicks: false,
      lineWidth: 0,
      zeroLineWidth: 0,
      zeroLineColor: mode === "dark" ? colors.gray[900] : colors.gray[300],
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: [2],
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function (value) {
        if (!(value % 10)) {
          return value;
        }
      },
    },
  });

  // xAxes
  Chart.scaleService.updateScaleDefaults("category", {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false,
    },
    ticks: {
      padding: 20,
    },
  });

  return options;
}

// Parse global options
export function parseOptions(parent, options) {
  for (var item in options) {
    if (typeof options[item] !== "object") {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}
// Charts for specific Stats 
export const ChartStructureStats = (props) => {
  const conges = props.structConge;

  // usefull function 
  function formatDate(d) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
  }  
  
  const getCongeMonth = (month) => {
    let total = 0;
    if (conges.length > 0) {
      conges.forEach(element => {
        if (formatDate(element.date_debut_conge).getMonth() === month) {
          total += 1;
        }
      });
    }
    return total;
  };

  const chartOptions = {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[900],
            zeroLineColor: colors.gray[900],
          },
          ticks: {
            callback: function (value) {
              if (Number.isInteger(value)) {
                return  value;
              }
              return '';
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var yLabel = item.yLabel;
          var content = yLabel ;

          return content;
        },
      },
    },
  }

  const totalCongeDatas = Array.from({ length: 12 }, (_, i) => getCongeMonth(i));

  const chartDatas = {
    labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aûo", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data : totalCongeDatas
      },
    ],
  }

  return <Line data={chartDatas} options={chartOptions} />
};
// Example 1 of Chart inside src/views/Index.js (Sales value - Card)
export const ChartExample1 = () => {
  const [conges, setConges] = useState([]);

  function formatDate(d) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
  }  
  
  useEffect(() => {
    const fetchDatas = async () => {
      try {
        window.electronAPI.getConge();
        await window.electronAPI.retrieveConge((event, res) => {
          setConges(res);
        })
      } catch (error) {
        console.error("Erreur : " + error.message);
      }
    }
    fetchDatas();
  }, [])

  const getCongeMonth = (month) => {
    let total = 0;
    if (conges.length > 0) {
      conges.forEach(element => {
        if (formatDate(element.date_debut_conge).getMonth() === month) {
          total += 1;
        }
      });
    }
    return total;
  };

  const chartOptions = {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[900],
            zeroLineColor: colors.gray[900],
          },
          ticks: {
            callback: function (value) {
              if (Number.isInteger(value)) {
                return  value;
              }
              return '';
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var yLabel = item.yLabel;
          var content = yLabel ;

          return content;
        },
      },
    },
  }

  const totalCongeDatas = Array.from({ length: 12 }, (_, i) => getCongeMonth(i));

  const chartDatas = {
    labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aûo", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data : totalCongeDatas
      },
    ],
  }

  return <Line data={chartDatas} options={chartOptions} />
};

// Example 2 of Chart inside src/views/Index.js (Total orders - Card)
export const ChartExample2 = () => {
  const [permissions, setPermissions] = useState([]);
  const [conges, setConges] = useState([]);

  function formatDate(d) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
  }

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        window.electronAPI.getConge();
        await window.electronAPI.retrieveConge((event, res) => {
          setConges(res);
        })
        window.electronAPI.getPermission();
        await window.electronAPI.retrievePermission((event, res) => {
          setPermissions(res);
        })
      } catch (error) {
        console.error("Erreur : " + error.message);
      }
    }
    fetchDatas();
  }, [])

  const getDemandeMonth = (month) => {
    let total = 0;
    if (conges.length > 0) {
      conges.forEach(element => {
        if (formatDate(element.date_debut_conge).getMonth() === month) {
          total += 1;
        }
      });
      if (permissions.length > 0) {
        permissions.forEach(element => {
          if (formatDate(element.date_debut_permission).getMonth() === month) {
            total += 1;
          }
        });
      }
    }
    return total;
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            callback: function (value) {
              if (Number.isInteger(value)) {
                return  value;
              }
              return '';
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";
          if (data.datasets.length > 1) {
            content += label;
          }
          content += yLabel;
          return content;
        },
      },
    },
  }
  // slicing the months 
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonthIndex = new Date().getMonth();
  const lastSixMonths = [];

  for (let i = 1; i <= 5; i++) {
    const prevMonthIndex = (currentMonthIndex - i + 12) % 12; // Handle wrap-around for the beginning of the year
    lastSixMonths.unshift(months[prevMonthIndex]);
  }

  lastSixMonths.push(months[currentMonthIndex]);

  // demandes per month : 
  const totalCongeDatas = Array.from({ length: 12 }, (_, i) => getDemandeMonth(i));
  const lastSixMonthsDemande = [];

  for (let i = 1; i <= 5; i++) {
    const prevMonthIndex = (currentMonthIndex - i + 12) % 12; // Handle wrap-around for the beginning of the year
    lastSixMonthsDemande.unshift(totalCongeDatas[prevMonthIndex]);
  }

  lastSixMonthsDemande.push(totalCongeDatas[currentMonthIndex]);

  const data = {
    labels: lastSixMonths,
    datasets: [
      {
        label: "Sales",
        data: lastSixMonthsDemande,//[25, 20, 30, 22, 17, 29],
        maxBarThickness: 10,
      },
    ],
  }

  return <Bar data={data} options={options} />
};

export const ChartExample3 = () => {
  const [conges, setConges] = useState([]);
  const [structureNames, setStructureNames] = useState([]);

  function formatDate(d) {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return new Date(year, month, day);
  }

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        window.electronAPI.getStructuresNames();
        await window.electronAPI.retrieveStructuresNames((event, res) => {
          setStructureNames(res);
        })
        window.electronAPI.getConge();
        await window.electronAPI.retrieveConge((event, res) => {
          setConges(res);
        })
        /*window.electronAPI.getPermission();
        await window.electronAPI.retrievePermission((event, res) => {
          setPermissions(res);
        })*/
      } catch (error) {
        console.error("Erreur : " + error.message);
      }
    }
    fetchDatas();
  }, [])

  const getDemandeMonth = (month, struc) => {
    let total = 0;
    if (conges.length > 0) {
      conges.forEach(element => {
        /**/
        if (element.structure_personnel === struc && formatDate(element.date_debut_conge).getMonth() === month) {
          total += 1;
        }
      });
    }
    return total;
  };

  let mths = ["Dec", "Nov", "Oct", "Sep", "Auo", "Juil", "Juin", "Mai", "Avr", "Mar", "Fev", "Jan"];
  const options_1 = {
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }],
    },
    plugins: {
      datalabels: {
        formatter: function(value, context) {
          const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
          return total;
        },
        color: 'top',
        anchor: 'end',
        align: 'end'
      }
    }
  };
  /*const options = {
    scales: {
      yAxes: [
        {
          
          ticks: {
            /*callback: function (value, index) {
              return mths[index]
            },
            callback: function (value) {
              if (Number.isInteger(value)) {
                return  value;
              }
              return '';
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label;
          var yLabel = tooltipItem.yLabel;
          var content = "";
          if (data.datasets.length > 1) {
            content += label;
          }
          content += yLabel;;
          return content;
        },
      },
    },
  }*/

  let tab = [];
  structureNames.forEach(element => {
    tab.push(element.structure_personnel);
  });
  //console.log(`simple tab : ${tab}`);
  const struc = ["DGB","[SO]","SGDB","SGCCC","[SDAG]","SDCF","DI","DPC","DREF","DPB","DCOB","DDPP"];
  let finalStrucNames = [];
  let strucLabels = [];
  tab.forEach(t => {
    for(let i = 0; i < struc.length; i++) {
      if (t.includes(struc[i])) {
        //console.log(`tab ${t}`);
        strucLabels.push(struc[i]);
        finalStrucNames.push(t);
      }
    }
  })
  //console.log(`stucture tried : ${finalStrucNames}`);
  let datas = []
  for (let index = 0; index < finalStrucNames.length; index++) {
    datas.push(getDemandeMonth(index, finalStrucNames[index]));
  }
  //console.log(`datas : ${datas}`);
  function getMonthNumber(month) {
    switch (month) {
      case "Jan":
        return 0;
        break;
      case "Fev":
        return 1;
        break;
      case "Mar":
        return 2;
        break;
      case "Avr":
        return 3;
        break;
      case "Mai":
        return 4;
        break;
      case "Juin":
        return 5;
        break;
      case "Juil":
        return 6;
        break;
      case "Auo":
        return 7;
        break;
      case "Sep":
        return 8;
        break;
      case "Oct":
        return 9;
        break;
      case "Nov":
        return 10;
        break;
      case "Dec":
        return 11;
        break;
      default:
        return 0;
        break;
    }
  }

  const datasets = mths.map(month => {
    const data = finalStrucNames.map(structure => getDemandeMonth(getMonthNumber(month), structure));
    return {
      label: month,
      data: data,
      maxBarThickness: 10,
    };
  });

  const data = {
    labels: strucLabels,
    /*datasets: [
      {
        label: "Sales",
        data: datas,
        maxBarThickness: 10,
      },
    ],*/
    datasets: datasets,
  }

  return <Line data={data} options={options_1} />
};

/*module.exports = {
  chartOptions, // used inside src/views/Index.js
  parseOptions, // used inside src/views/Index.js
  chartExample1, // used inside src/views/Index.js
  chartExample2, // used inside src/views/Index.js
};*/