import React, { useEffect, useState, useMemo } from 'react';
import { 
    Alert, Button, ButtonDropdown, DropdownToggle, 
    DropdownMenu, DropdownItem, Container, 
    Form, FormGroup, Label , Input
} from 'reactstrap';

import api from '../../services/api';
import CameraIcon from '../../assets/camera.png';
import './events.css';

export default function Events ({ history }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sport, setSport] = useState('Sport');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [date, setDate] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');

    const toggle = () => setOpen(!dropdownOpen);

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
    }, []);

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        const eventData = new FormData();

        eventData.append('thumbnail', thumbnail);
        eventData.append('sport', sport);
        eventData.append('title', title);
        eventData.append('description', description);
        eventData.append('price', price);
        eventData.append('date', date);

        try {
            if (
                title !== '' &&
                thumbnail !== '' &&
                description !== '' &&
                sport !== 'Sport' &&
                price !== 0 &&
                date !== ''
            ) {
                const response = await api.post('/event', eventData, { headers: { user }})
                setSuccess(true);
                setSuccessMessage(response.data.message);
                setTimeout(() => {
                    setSuccess(false);
                    setSuccessMessage('');
                    history.push('/');
                }, 3000);
            } else {
                setError(true);
                setErrorMessage('Missing required information');
                setTimeout(() => {
                    setError(false);
                    setErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container>
            <h2>Create New Event</h2>
            <Form onSubmit={ handleSubmit }>
                <div className="input-group">
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="thumbnail" className="mr -sm-2">Upload Image</Label>
                        <Label 
                            className={ thumbnail ? 'has-thumbnail' : '' }
                            id="thumbnail"
                            style={{ backgroundImage: `url(${preview})` }}
                        >
                            <Input
                                type="file"
                                onChange={ e => setThumbnail(e.target.files[0]) }
                            />
                            <img src={ CameraIcon } style={{ maxWidth: "50px" }} alt="upload image icon" />
                        </Label>
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type="text"
                            name="title"
                            id="title"
                            onChange={ e => setTitle(e.target.value) }
                            placeholder="Title for your event"
                            value={ title }
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type="text"
                            name="description"
                            id="description"
                            onChange={ e => setDescription(e.target.value) }
                            placeholder="Describe your event"
                            value={ description }
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type="text"
                            name="price"
                            id="price"
                            onChange={ e => setPrice(e.target.value.replace(/\D/g, '')) }
                            placeholder="Price for your event - ($0.00)"
                            value={ price }
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input
                            type="date"
                            name="date"
                            id="date"
                            onChange={ e => setDate(e.target.value) }
                            value={ date }
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <ButtonDropdown isOpen={ dropdownOpen } toggle={toggle}>
                            <Button id="caret" disabled>{ sport }</Button>
                            <DropdownToggle caret />
                            <DropdownMenu>
                                <DropdownItem header>Sport</DropdownItem>
                                <DropdownItem
                                    onClick={ () => setSport('cycling') }
                                >
                                    Cycling
                                </DropdownItem>
                                <DropdownItem
                                    onClick={ () => setSport('running') }
                                >
                                    Running
                                </DropdownItem>
                                <DropdownItem
                                    onClick={ () => setSport('swimming') }
                                >
                                    Swimming
                                </DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </FormGroup>
                </div>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <button className="btn submit-btn">Create Event</button>
                    <button className="btn secondary-btn" onClick={ () => history.push('/') }>
                        Cancel
                    </button>
                </FormGroup>
            </Form>
            { success ? (
                <Alert className="event-validation" color="success">{ successMessage }</Alert>
            ) : '' }
            { error ? (
                <Alert className="event-validation" color="danger">{ errorMessage }</Alert>
            ) : '' }
        </Container>
    )
}