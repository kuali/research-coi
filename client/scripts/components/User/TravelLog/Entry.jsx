import React from 'react/addons';
import {merge} from '../../../merge';
import {ProminentButton} from '../../ProminentButton.jsx'
import {formatDate} from '../../../formatDate.js';

export class Entry extends React.Component {

    constructor() {
        super();
        this.commonStyles = {
        };
    }

    render() {
        let styles = {
            container: {
                margin: '44px 50px',
                backgroundColor: 'white',
                width: '75%',
                padding: 10
            },
            left: {
                width:'80%',
                display: 'inline-block'
            },
            right: {
                width:'20%',
                display: 'inline-block',
                verticalAlign: 'bottom',
                textAlign: 'center'
            },
            entityName: {
                width:'100%',
                display: 'inline-block',
                fontSize: 20
            },
            date: {
                width:'40%',
                display: 'inline-block'
            },
            field: {
                width:'100%',
                display: 'inline-block',
                marginTop: 10
            }
        };
        styles = merge(this.commonStyles, styles);

        return (
            <div style={styles.container}>
                <div style={styles.left}>
                <div style={styles.entityName}>{this.props.travelLog.entityName}</div>
                <div style={styles.field}>
                    <div style={styles.date}>Dates: {formatDate(this.props.travelLog.startDate)} - {formatDate(this.props.travelLog.endDate)}</div>
                    <div style={styles.date}>Amount: ${this.props.travelLog.amount}</div>
                </div>

                <div style={styles.field}>Reason: {this.props.travelLog.reason} </div>
                <div style={styles.field}>Destination: {this.props.travelLog.destination}</div>
                </div>
                <div style={styles.right}>
                    <ProminentButton>Deactivate</ProminentButton>
                </div>
            </div>
            )
    }
}