import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createSpace, fetchParkings, fetchSpaces, updateSpace } from '../api/api'
import { toast } from 'react-toastify';
import '../css/createParking.scss'

const SpaceForm = () => {
    const { state } = useLocation()
    const user = useSelector((state) => state.user);

    const [form, setForm] = useState({
        name: '',
        date: '',
        slot_start_time: '',
        slot_end_time: '',
        price: '',
        parking_id: '',
    });

    const [parkings, setParkings] = useState([]);

    const timeOptions = [
        '12:00am', '2:00am', '4:00am', '6:00am', '8:00am', '10:00am',
        '12:00pm', '2:00pm', '4:00pm', '6:00pm', '8:00pm', '10:00pm'
    ];

    const convertTo24 = (timeStr) => {
        const [time, meridian] = timeStr.match(/\d{1,2}:\d{2}/)[0].split(':').map(Number);
        const isPM = timeStr.toLowerCase().includes('pm');
        const hours = isPM && time !== 12 ? time + 12 : !isPM && time === 12 ? 0 : time;
        return hours * 60; // return minutes since midnight
    };

    const isOverlapping = (existingStart, existingEnd, newStart, newEnd) => {
        return !(newEnd <= existingStart || newStart >= existingEnd);
    };

    const handleFormChange = ({ key, value }) => {
        setForm({ ...form, [key]: value });
    };

    const handleCreateSpace = async () => {
        const { name, date, slot_start_time, slot_end_time, price, parking_id } = form;

        if (!name || !date || !slot_start_time || !slot_end_time || !price || !parking_id) {
            toast.error("All fields are required!");
            return;
        }

        const newStart = convertTo24(slot_start_time);
        const newEnd = convertTo24(slot_end_time);

        if (newStart >= newEnd) {
            toast.error("Start time must be before end time!");
            return;
        }

        const existingSpaces = [];
        await fetchSpaces({
            parking_id,
            date,
            setSpaces: (spaces) => existingSpaces.push(...spaces),
        });

        const hasOverlap = existingSpaces.some(space => {
            const existingStart = convertTo24(space.slot_start_time);
            const existingEnd = convertTo24(space.slot_end_time);
            return isOverlapping(existingStart, existingEnd, newStart, newEnd);
        });

        if (hasOverlap) {
            toast.error('This time slot overlaps with an existing space!');
            return;
        }

        const body = {
            name,
            date,
            slot_start_time,
            slot_end_time,
            price,
            parking_id,
            user_id: user?._id,
        };

        createSpace({
            body,
            handleCreateSpaceSuccess,
            handleCreateSpaceFailure,
        });
    };

    const handleCreateSpaceSuccess = () => {
        toast.success('Space created successfully!');
    };

    const handleCreateSpaceFailure = (error) => {
        toast.error(error || 'Failed to create space.');
    };

    const handleUpdateSpace = () => {
        const body = { ...form };

        updateSpace({
            id: state?.space?._id,
            body,
            handleUpdateSpaceSuccess,
            handleUpdateSpaceFailure
        });
    };

    const handleUpdateSpaceSuccess = () => {
        toast.success('Space updated successfully!');
    };

    const handleUpdateSpaceFailure = (error) => {
        toast.error(error || 'Failed to update space.');
    };

    const handleSubmit = () => {
        if (state?.space) {
            handleUpdateSpace();
        } else {
            handleCreateSpace();
        }
    };

    useEffect(() => {
        fetchParkings({ user_id: user?._id, setParkings });
    }, [user]);

    useEffect(() => {
        if (state?.space) {
            setForm({
                name: state.space.name || '',
                date: state.space.date || '',
                slot_start_time: state.space.slot_start_time || '',
                slot_end_time: state.space.slot_end_time || '',
                price: state.space.price || '',
                parking_id: state.space.parking_id || '',
            });
        }
    }, [state]);

    return (
        <div className='container py-5'>
            <div className='card create-parking-card p-5'>
                <h3 className='mb-4'>{state?.space ? 'Edit space' : 'Create space'}</h3>

                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={form.name} onChange={(e) => handleFormChange({ key: 'name', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={form.date} onChange={(e) => handleFormChange({ key: 'date', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Slot start time</label>
                    <select className="form-select" value={form.slot_start_time} onChange={(e) => handleFormChange({ key: 'slot_start_time', value: e.target.value })}>
                        <option value="">Select</option>
                        {timeOptions.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Slot end time</label>
                    <select className="form-select" value={form.slot_end_time} onChange={(e) => handleFormChange({ key: 'slot_end_time', value: e.target.value })}>
                        <option value="">Select</option>
                        {timeOptions.map((item, i) => (
                            <option key={i} value={item}>{item}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input type="number" className="form-control" value={form.price} onChange={(e) => handleFormChange({ key: 'price', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Parking</label>
                    <select className="form-select" value={form.parking_id} onChange={(e) => handleFormChange({ key: 'parking_id', value: e.target.value })}>
                        <option value="">Select</option>
                        {parkings?.map((item) => (
                            <option key={item?._id} value={item?._id}>{item?.name}</option>
                        ))}
                    </select>
                </div>

                <button className="btn btn-primary mt-4" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default SpaceForm;
