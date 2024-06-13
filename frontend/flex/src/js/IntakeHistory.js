import React, { Component, useEffect, useState } from 'react';
import PageHeader from './PageHeader';
import Plot from 'react-plotly.js';
import styles from '../style/History.module.css';
import { WithErrorMessage } from './WithErrorMessage';
import { withRouter } from './withRouter';

class IntakeHistory extends Component {

    componentDidMount() {
        this.getAllIntakes();
        this.getIntakeGoals();
    }

    constructor(props) {
        super(props)

        this.state = {
            intakes: [],
            goals: []
        }
    }

    getAllIntakes() {
        fetch('http://localhost:8081/flex/intake-all', {
            method: 'GET',
            credentials: 'include',
        }).then(response => {
            if (response.status != 200) {
                response.text().then(body => {
                    this.props.showErrorMessage(body);
                });
            }
            response.json().then(intakes0 => {
                //console.log("1");
                //console.log(intakes0);
                this.setState({
                    intakes: intakes0
                })
                //console.log("2");
                //console.log(this.state.intakes);
            })
        })
    }

    getIntakeGoals() {
        fetch('http://localhost:8081/flex/intake-goal', {
            method: 'GET',
            credentials: 'include',
        }).then(response => {
            if (response.status != 200) {
                response.text().then(body => {
                    this.props.showErrorMessage(body);
                });
            }

            response.json().then(goals => {
                this.setState({
                    goals: goals
                })
            })
        })
    }

    setHistories() {
        let cal = [];
        let prot = [];
        let fat = [];
        let carb = [];
        //console.log(this.state.intakes);
        for (let i = 0; i < this.state.intakes.length; i++) {
            cal.push(this.state.intakes[i].calorieSum);
            prot.push(this.state.intakes[i].proteinSum);
            carb.push(this.state.intakes[i].carbSum);
            fat.push(this.state.intakes[i].fatSum);
        }
        return [cal,prot,fat,carb];
    }

    getXVals() {
        let xVals = []
        for (let i = 0; i < this.state.intakes.length; i++) {
            xVals.push(this.state.intakes[i].date);
        }
        return xVals;
    }

    getYScale() {
        let goals = this.state.goals;
        let calorieHistory = this.state.intakes[0];
        let proteinHistory = this.state.intakes[1];
        let carbHistory = this.state.intakes[2];
        let fatHistory = this.state.intakes[3];
        let calMin = Math.max((Math.min(Math.min(calorieHistory), goals.calGoal)) - 100, 0);
        let calMax = (Math.max(Math.max(calorieHistory), goals.calGoal)) + 100;
        let protMin = Math.max((Math.min(Math.min(proteinHistory), goals.proteinGoal)) - 15, 0);
        let protMax = (Math.max(Math.max(proteinHistory), goals.proteinGoal)) + 15;
        let carbMin = Math.max((Math.min(Math.min(carbHistory), goals.carbGoal)) - 15, 0);
        let carbMax = (Math.max(Math.max(carbHistory), goals.carbGoal)) + 15;
        let fatMin = Math.max((Math.min(Math.min(fatHistory), goals.fatGoal)) - 15, 0);
        let fatMax = (Math.max(Math.max(fatHistory), goals.fatGoal)) + 15;
        let ret = [calMin, calMax, protMin, protMax, carbMin, carbMax, fatMin, fatMax];
        //console.log(ret);
        return ret
    }

    render() {
        let goals = this.state.goals;
        let histories = this.setHistories();
        let calorieHistory = histories[0];
        let proteinHistory = histories[1];
        let fatHistory = histories[2];
        let carbHistory = histories[3];
        let xVals = this.getXVals();
        let yScale = this.getYScale();
        //console.log(xVals);
        //console.log(calorieHistory);
        return (
            <>
                <PageHeader title="Intake Logs" />
                <div className={`container ${styles.graphsWrapper}`}>
                    <Plot
                        className={styles.plot}
                        data={[
                            {
                                //name: "Total",
                                x: xVals,
                                y: calorieHistory,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'rgb(87, 0, 229)' },
                            },
                        ]}
                        layout={{
                            paper_bgcolor:'rgba(0,0,0,0)',
                            height: 400,
                            // title: {
                            //     text: 'Calories',
                            //     font: {
                            //         size: 24,
                            //     }
                            // },
                            font: {
                                family: ['Inter', 'sans-serif'],
                                color: 'black'
                            },
                            yaxis: { range: [yScale[0], yScale[1]], title: 'Calories', fixedrange: true },
                            autosize: true,
                            shapes: [
                                {
                                    name: "Goal",
                                    type: 'line',
                                    xref: 'paper',
                                    x0: 0,
                                    x1: 1,
                                    y0: goals.calGoal,
                                    y1: goals.calGoal,
                                    line: {
                                        color: '#0003',
                                        dash: 'dash',
                                    }
                                }
                            ],
                            annotations: [
                                {
                                    showarrow: false,
                                    text: 'Your Goal',
                                    xref: 'paper',
                                    x: 1,
                                    y: goals.calGoal,
                                    xanchor: 'left',
                                    align: 'right',
                                },
                                {
                                    xref: 'paper',
                                    yref: 'paper',
                                    x: 0,
                                    xanchor: 'left',
                                    y: 1.15,
                                    yanchor: 'bottom',
                                    text: '<b>Calorie Intake</b>',
                                    font: {
                                        size: 24,
                                    },
                                    showarrow: false
                                }

                            ],
                            //showlegend: true
                        }}
                        config={{
                            displaylogo: false,
                            displayModeBar: false,
                            responsive: true,
                        }}
                    />
                </div>
                <div className={`container ${styles.graphsWrapper}`}>
                    <Plot
                        className={styles.plot}
                        data={[
                            {
                                x: xVals,
                                y: proteinHistory,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'rgb(56, 183, 255)' },
                            },
                        ]}
                        layout={{
                            paper_bgcolor:'rgba(0,0,0,0)',
                            height: 400,
                            title: {
                                //text: 'Protein Intake',
                                font: {
                                    size: 24,
                                }
                            },
                            font: {
                                family: ['Inter', 'sans-serif'],
                                color: 'black'
                            },
                            yaxis: { range: [yScale[2], yScale[3]], title: 'Protein (g)', fixedrange: true },
                            autosize: true,
                            shapes: [
                                {
                                    type: 'line',
                                    xref: 'paper',
                                    x0: 0,
                                    x1: 1,
                                    y0: goals.proteinGoal,
                                    y1: goals.proteinGoal,
                                    line: {
                                        color: '#0003',
                                        dash: 'dash',
                                    }
                                }
                            ],
                            annotations: [
                                {
                                    showarrow: false,
                                    text: 'Your Goal',
                                    xref: 'paper',
                                    x: 1,
                                    y: goals.proteinGoal,
                                    xanchor: 'left',
                                    align: 'right',
                                },{
                                  xref: 'paper',
                                    yref: 'paper',
                                    x: 0,
                                    xanchor: 'left',
                                    y: 1.15,
                                    yanchor: 'bottom',
                                    text: '<b>Protein Intake</b>',
                                    font: {
                                        size: 24,
                                    },
                                    showarrow: false
                                  }
                            ]
                        }}
                        config={{
                            displaylogo: false,
                            displayModeBar: false,
                            responsive: true,
                        }}
                    />
                </div>
                <div className={`container ${styles.graphsWrapper}`}>
                    <Plot
                        className={styles.plot}
                        data={[
                            {
                                x: xVals,
                                y: carbHistory,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'rgb(45, 189, 9)' },
                            },
                        ]}
                        layout={{
                            paper_bgcolor:'rgba(0,0,0,0)',
                            height: 400,
                            //title: {
                              //  text: 'Carbohydrate Intake',
                                //font: {
                                  //  size: 24,
                                //}
                            //},
                            font: {
                                family: ['Inter', 'sans-serif'],
                                color: 'black'
                            },
                            yaxis: { range: [yScale[4], yScale[5]], title: 'Carbs (g)', fixedrange: true },
                            autosize: true,
                            shapes: [
                                {
                                    type: 'line',
                                    xref: 'paper',
                                    x0: 0,
                                    x1: 1,
                                    y0: goals.carbGoal,
                                    y1: goals.carbGoal,
                                    line: {
                                        color: '#0003',
                                        dash: 'dash',
                                    }
                                }
                            ],
                            annotations: [
                                {
                                    showarrow: false,
                                    text: 'Your Goal',
                                    xref: 'paper',
                                    x: 1,
                                    y: goals.carbGoal,
                                    xanchor: 'left',
                                    align: 'right',
                                },
                                {
                                    xref: 'paper',
                                    yref: 'paper',
                                    x: 0,
                                    xanchor: 'left',
                                    y: 1.15,
                                    yanchor: 'bottom',
                                    text: '<b>Carbohydrate Intake</b>',
                                    font: {
                                        size: 24,
                                    },
                                    showarrow: false
                                  }
                            ]
                        }}
                        config={{
                            displaylogo: false,
                            displayModeBar: false,
                            responsive: true,
                        }}
                    />
                </div>
                <div className={`container ${styles.graphsWrapper}`}>
                    <Plot
                        className={styles.plot}
                        data={[
                            {
                                x: xVals,
                                y: fatHistory,
                                type: 'scatter',
                                mode: 'lines+markers',
                                marker: { color: 'rgb(255, 56, 56)' },
                            },
                        ]}
                        layout={{
                            paper_bgcolor:'rgba(0,0,0,0)',
                            height: 400,
                            title: {
                                //text: 'Fat Intake',
                                font: {
                                    size: 24,
                                }
                            },
                            font: {
                                family: ['Inter', 'sans-serif'],
                                color: 'black'
                            },
                            yaxis: { range: [yScale[6], yScale[7]], title: 'Fat (g)', fixedrange: true },
                            autosize: true,
                            shapes: [
                                {
                                    type: 'line',
                                    xref: 'paper',
                                    x0: 0,
                                    x1: 1,
                                    y0: goals.fatGoal,
                                    y1: goals.fatGoal,
                                    line: {
                                        color: '#0003',
                                        dash: 'dash',
                                    }
                                }
                            ],
                            annotations: [
                                {
                                    showarrow: false,
                                    text: 'Your Goal',
                                    xref: 'paper',
                                    x: 1,
                                    y: goals.fatGoal,
                                    xanchor: 'left',
                                    align: 'right',
                                },
                                {
                                    xref: 'paper',
                                    yref: 'paper',
                                    x: 0,
                                    xanchor: 'left',
                                    y: 1.15,
                                    yanchor: 'bottom',
                                    text: '<b>Fats Intake</b>',
                                    font: {
                                        size: 24,
                                    },
                                    showarrow: false
                                  }
                            ]
                        }}
                        config={{
                            displaylogo: false,
                            displayModeBar: false,
                            responsive: true,
                        }}
                    />
                </div>
            </>
        )
    }
}

export default withRouter(WithErrorMessage(IntakeHistory));