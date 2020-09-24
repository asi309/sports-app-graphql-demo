import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import moment from 'moment';

import api from '../../services/api';

import './myRegistrations.css';

export default function MyRegistrations () {
    const [registrations, setRegistrations] = useState([]);
    const user = localStorage.getItem('user');

    useEffect(() => {
        getRegistrations();
    }, []);

    const getRegistrations = async () => {

        try {
            const response = await api.get('/registrations', { headers: { user } });
            const filteredResponse = response.data.filter(data => data.approved === true);
            setRegistrations(filteredResponse);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ul className='registrations'>
            {registrations.map(registration => (
                <li key={registration._id}>
                    <div className="title">{registration.eventTitle}</div>
                    <div className='event-details'>
                        <span>Date: {moment(registration.eventDate).format('l')}</span>
                        <span>Price: ${parseFloat(registration.eventPrice).toFixed(2)}</span>
                        <span>Email: {registration.userEmail}</span>
                    </div>
                </li>
            ))}
        </ul>
    )
}