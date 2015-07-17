import React from 'react/addons';
import {merge} from '../../../merge';
import {ProminentButton} from '../../ProminentButton.jsx'
import {TravelLogActions} from '../../../actions/TravelLogActions.js'

export class TravelLogForm extends React.Component {
    constructor() {
        super();
        this.commonStyles = {
        };

        this.addEntry = this.addEntry.bind(this);
    }

    addEntry() {
        TravelLogActions.addEntry(
            this.refs.entityName.getDOMNode().value,
            this.refs.amount.getDOMNode().value,
            this.refs.startDate.getDOMNode().value,
            this.refs.endDate.getDOMNode().value,
            this.refs.reason.getDOMNode().value,
            this.refs.destination.getDOMNode().value);
    }

    render() {
        let styles = {
            container: {
                margin: '44px 50px',
                width: '75%'
            },
            field: {
                display: 'inline-block',
                marginRight: 20,
                width: 275
                // color: this.state.validStatus.entityName === false ? 'red' : 'inherit'
            },
            top: {
                marginTop: 20
            },
            left: {
                width: '40%',
                display: 'inline-block',
                verticalAlign: 'top'
            },
            middle: {
                width: '40%',
                display: 'inline-block',
                verticalAlign: 'top'
            },
            right: {
                width: '20%',
                display: 'inline-block',
                verticalAlign: 'bottom',
                textAlign: 'right'
            },
            input: {
                padding: '2px 8px',
                fontSize: 16,
                borderRadius: 5,
                border: '1px solid #ccc',
                height: 30,
                width: '100%'
                //borderBottom: this.state.validStatus.entityName === false ? '3px solid red' : '1px solid #ccc'
            },
            date: {width:'40%',
                display: 'inline-block'}
            ,
            dateMiddle: {width:'20%',
                display: 'inline-block',
                textAlign:'center'},
            invalidError: {
                fontSize: 10,
                marginTop: 2
            }
        };
        styles = merge(this.commonStyles, styles);

        return(
            <div style={styles.container}>
                <div style={styles.left}>
                    <div style={styles.top}>
                        <span style={styles.field}>
                            <div style={{marginBottom: 5, fontWeight: '500'}}>ENTITY NAME</div>
                            <div>
                            <input required ref="entityName" type="text" style={styles.input}/>
                            </div>
                        </span>
                    </div>
                    <div style={styles.top}>
                        <span style={styles.field}>
                            <div style={{marginBottom: 5, fontWeight: '500'}}>TIME</div>
                            <div style={styles.date}>
                                <input required ref="startDate" type="text" style={styles.input}/>
                            </div>
                            <div style={styles.dateMiddle}>TO</div>
                              <div style={styles.date}>
                                  <input required ref="endDate" type="text" style={styles.input}/>
                              </div>
                        </span>
                    </div>
                    <div style={styles.top}>
                        <span style={styles.field}>
                            <div style={{marginBottom: 5, fontWeight: '500'}}>DESTINATION</div>
                            <div>
                                <input required ref="destination" type="text" style={styles.input}/>
                            </div>
                        </span>
                    </div>
                </div>
                <div style={styles.middle}>
                    <div style={styles.top}>
                        <span style={styles.field}>
                            <div style={{marginBottom: 5, fontWeight: '500'}}>AMOUNT</div>
                            <div>
                                <input required ref="amount" type="text" style={styles.input}/>
                            </div>
                        </span>
                    </div>

                    <div style={styles.top}>
                        <span style={styles.field}>
                            <div style={{marginBottom: 5, fontWeight: '500'}}>REASON</div>
                            <div>
                                <input required ref="reason" type="text" style={styles.input}/>
                            </div>
                        </span>
                    </div>
                </div>
                <div style={styles.right}>
                    <ProminentButton onClick={this.addEntry}>ADD</ProminentButton>
                </div>
             </div>
        )
    }
}