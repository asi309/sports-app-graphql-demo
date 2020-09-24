import React, { useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import moment from 'moment';

import api from '../../services/api';

import './registrationRequests.css';

export default function RegistrationRequests () {
    const [registrations, setRegistrations] = useState([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [requestMessageHandler, setRequestMessageHandler] = useState('');
    const [registrationState, setRegistrationState] = useState('');
    
    const user = localStorage.getItem('user');

    useEffect(() => {
        getRegistrations()
    }, []);

    const getRegistrations = async () => {

        try {
            const response = await api.get('/registrations', { headers: { user } });
            const filteredResponse = response.data.filter(data => typeof data.approved === 'undefined');
            setRegistrations(filteredResponse);
        } catch (error) {
            console.log(error);
        }
    }

    const removeNotification = (registrationId) => {
        const filteredReg = registrations.filter(registration => registrationId !== registration._id);
        setRegistrations(filteredReg);
    }

    const acceptEventHandler = async (registrationId) => {
        try{
            await api.post(`/registration/${registrationId}/approval`, {}, { headers: { user } });
            setSuccess(true);
            setRequestMessageHandler('Request Accepted');
            setRegistrationState('success');
            setTimeout(() => {
                setSuccess(false);
                setRequestMessageHandler('');
                removeNotification(registrationId);
                setRegistrationState('');
            }, 3000);
        } catch (error) {
            setError(true);
            setRequestMessageHandler('Cannot perform the selected action');
            setTimeout(() => {
                setError(false);
                setRequestMessageHandler('');
            }, 3000);
        }
    }

    const rejectEventHandler = async (registrationId) => {
        try {
            await api.post(`registration/${registrationId}/rejection`, {}, { headers: { user } });
            setSuccess(true);
            setRequestMessageHandler('Request Rejected');
            setRegistrationState('danger');
            setTimeout(() => {
                setSuccess(false);
                setRequestMessageHandler('');
                setRegistrationState('');
                removeNotification(registrationId);
            }, 3000);
        } catch (error) {
            setError(true);
            setRequestMessageHandler('Cannot perform the selected action');
            setTimeout(() => {
                setError(false);
                setRequestMessageHandler('');
            }, 3000);
        }
    }

    return (
        <ul className='registrations'>
            {registrations.length === 0 ? <h2>No Pending Requests</h2> : ''}
            {
                registrations.map(registration => (
                <li key={ registration._id }>
                    <div className="title">{registration.eventTitle}</div>
                    <div className='event-details'>
                        <span>Date: {moment(registration.eventDate).format('l')}</span>
                        <span>Price: ${parseFloat(registration.eventPrice).toFixed(2)}</span>
                        <span>Email: {registration.userEmail}</span>
                    </div>
                    <ButtonGroup>
                        <Button
                            color='secondary'
                            onClick={ () => acceptEventHandler(registration._id) }
                        >
                            Accept
                        </Button>
                        <Button
                            color='danger'
                            onClick={ () => rejectEventHandler(registration._id) }
                        >
                            Reject
                        </Button>
                    </ButtonGroup>
                </li>
            ))}
            {
                success ? <Alert color={ registrationState }>{ requestMessageHandler }</Alert> : ''
            }
            {
                error ? <Alert color='danger'>{ requestMessageHandler }</Alert> : ''
            }
        </ul>
    )
}