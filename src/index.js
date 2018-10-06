import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';

class App extends Component {
  state = {
    series: [],
    rangeValue: '1'
  };

  options = {
    title: { text: 'Price returns' },
    chart: {
      height: 680,
      zoomType: 'x'
    },
    xAxis: {
      type: 'datetime',
      title: { text: 'Date' }
    },

    yAxis: {
      title: {
        text: 'Prices'
      },
      plotLines: [
        {
          value: 0,
          width: 2,
          color: 'silver'
        }
      ]
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true
      }
    },

    tooltip: {
      pointFormat:
        '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
      valueDecimals: 2,
      split: true
    }
  };

  async componentDidMount() {
    const response = await fetch(
      'https://raw.githubusercontent.com/jscriptcoder/stuff/master/mktdata.json'
    );
    const json = await response.json();
    const entries = json.mktData;

    this.options.series = entries.map(serie => {
      return {
        type: 'line',
        name: `Instrument ${serie.instrumentId}`,
        data: serie.timeSeries.entries.map(entry => [
          moment(entry.d, 'YYYY-MM-DD').toDate(),
          entry.v
        ])
      };
    });
    this.setState({ series: this.options.series });
  }

  render() {
    return (
      <div className="container">
        {this.state.series && (
          <div>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={'chart'}
              options={{
                ...this.options,
                series: this.state.series.map(serie => {
                  return { ...serie, data: serie.data };
                })
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
