import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { Alert, Button, ButtonGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import socketio from 'socket.io-client';

import api from '../../services/api';

import './dashboard.css';

export default function Dashboard ({ history }) {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageHandler, setMessageHandler] = useState('');
    const [requestMessageHandler, setRequestMessageHandler] = useState('');
    const [eventRequest, setEventRequest] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const user = localStorage.getItem('user');
    const userId = localStorage.getItem('userId');

    const toggle = () => setDropdownOpen(!dropdownOpen);
    
    useEffect(() => {
        getEvents()
    }, []);


    const socket = useMemo(() => (
            socketio('https://sports-events-app.herokuapp.com/', { query: { user: userId } })
            ), [userId]);


    useEffect(() => {
        socket.on('registration_req', data => (setEventRequest([...eventRequest, data])))
    }, [eventRequest, socket]);
    
    const filterHandler = (query) => {
        setFilter(query);
        getEvents(query);
    }

    const myEventsHandler = async () => {
        try {
            const response = await api.get('/user/events', { headers: { user } });
            setEvents(response.data.events);
        } catch (error) {
            history.push('/login');
        }
    }

    const getEvents = async (filter) => {
        try{
            const url = filter ? `/dashboard/${filter}` : '/dashboard';
            const response = await api.get(url, { headers: {user} });
    
            setEvents(response.data.events);
        } catch (error) {
            history.push('/login');
        }
    }

    const deleteEventHandler = async (eventId) => {
        try {
            await api.delete(`/event/${eventId}`, { headers: {user} });
            setSuccess(true);
            setMessageHandler('Event deleted successfully')
            setTimeout(() => {
                setSuccess(false);
                setMessageHandler('')
                filterHandler(filter);
            }, 3000);
        } catch (error) {
            setError(true);
            setMessageHandler('Cannot delete event')
            setTimeout(() => {
                setError(false);
                setMessageHandler('');
            }, 5000);
        }
    }

    const registrationRequest = async (eventId) => {
        try{
            await api.post(`/registration/${eventId}`, {}, { headers: { user } });
            setSuccess(true);
            setMessageHandler('Registration Request Sent');
            setTimeout(() => {
                setSuccess(false);
                setMessageHandler('');
            }, 3000);
        } catch (error) {
            setError(true);
            setMessageHandler('Cannot register to this event');
            setTimeout(() => {
                setError(false);
                setMessageHandler('');
            }, 3000);
        }
    }

    const acceptEventHandler = async (registrationId) => {
        try{
            await api.post(`/registration/${registrationId}/approval`, {}, { headers: { user } });
            setSuccess(true);
            setRequestMessageHandler('Request Accepted');
            removeNotification(registrationId);
            setTimeout(() => {
                setSuccess(false);
                setRequestMessageHandler('');
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
            removeNotification(registrationId);
            setTimeout(() => {
                setSuccess(false);
                setRequestMessageHandler('');
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

    const removeNotification = (registrationId) => {
        const newEvents = eventRequest.filter(request => registrationId !== request._id);
        setEventRequest(newEvents);
    }

    return (
        <>
            <ul className='notifications'>
                {
                    eventRequest.map(request => {
                        return (
                            <li key={request._id}>
                                <div>
                                    <p>
                                        <strong>{ request.user.email }</strong> requested to join your event
                                        <strong>&nbsp;{ request.event.title }</strong>
                                    </p>
                                    <ButtonGroup>
                                        <Button
                                            color='secondary'
                                            onClick={ () => acceptEventHandler(request._id) }
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            color='danger'
                                            onClick={ () => rejectEventHandler(request._id) }
                                        >
                                            Reject
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            {success && requestMessageHandler !== '' ? (
                <Alert className='event-validation' color='success'>{ requestMessageHandler }</Alert>
            ) : '' }
            {error && requestMessageHandler !== '' ? (
                <Alert className='event-validation' color="danger">{ requestMessageHandler }</Alert>
            ): '' }
            <div className="filter-panel">
                <Dropdown isOpen={ dropdownOpen } toggle={ toggle }>
                    <DropdownToggle color='primary' caret>
                        Filter
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler(null)}>All Events</DropdownItem>
                        <DropdownItem onClick={ myEventsHandler }>My Events</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem header>Categories</DropdownItem>
                        <DropdownItem onClick={() => filterHandler('cycling')}>Cycling</DropdownItem>
                        <DropdownItem onClick={() => filterHandler('running')}>Running</DropdownItem>
                        <DropdownItem onClick={() => filterHandler('swimming')}>Swimming</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <ul className='events-list'>
                {
                    events.map((event) => (
                        <li key={event._id}>
                            <header style={{ backgroundImage: `url(${event.thumbnail_url})`}}>
                                <div className="list-actions">    
                                    {event.user === userId ? 
                                        <Button
                                            color='danger'
                                            size="sm"
                                            onClick={ () => deleteEventHandler(event._id) }
                                        >
                                            Delete
                                        </Button> : ''
                                    }
                                </div>
                            </header>
                            <strong>{ event.title }</strong>
                            <span>Event Date: { moment(event.date).format('l') }</span>
                            <span>Price: ${ parseFloat(event.price).toFixed(2) }</span>
                            <span>About: { event.description }</span>
                            <Button
                                color='primary'
                                onClick={() => registrationRequest(event._id)}
                            >
                                Register
                            </Button>
                        </li>
                    ))
                }
            </ul>
            { success && messageHandler !== '' ? (
                <Alert className="event-validation" color="success">{ messageHandler }</Alert>
            ) : '' }
            { error && messageHandler !== '' ? (
                <Alert className="event-validation" color="danger">{ messageHandler }</Alert>
            ) : '' }
        </>
    );
}