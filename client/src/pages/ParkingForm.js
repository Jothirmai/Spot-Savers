import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createParking, fetchParkings, updateParking } from '../api/api'
import { toast } from 'react-toastify';
import '../css/createParking.scss'

const ParkingForm = () => {
    const { state } = useLocation();
    const user = useSelector((state) => state.user);

    const [form, setForm] = useState({
        name: '',
        address: '',
        city: '',
        lat: '',
        long: ''
    });

    const [loading, setLoading] = useState(false);
    const [existingParkings, setExistingParkings] = useState([]);

    useEffect(() => {
        if (user?._id) {
            fetchParkings({
                user_id: user._id,
                setParkings: (data) => setExistingParkings(data),
            });
        }
    }, [user]);

    const handleFormChange = ({ key, value }) => {
        setForm({ ...form, [key]: value });
    };

    const isDuplicate = () => {
        return existingParkings.some(p =>
            p.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
            p.address.trim().toLowerCase() === form.address.trim().toLowerCase() &&
            p.city.trim().toLowerCase() === form.city.trim().toLowerCase()
        );
    };

    const handleCreateParking = () => {
        if (isDuplicate()) {
            toast.error("Duplicate parking already exists!");
            return;
        }

        setLoading(true);
        const body = { ...form, user_id: user?._id };

        createParking({
            body,
            handleCreateParkingSuccess: () => {
                setLoading(false);
                toast.success("Created successfully!");
            },
            handleCreateParkingFailure: (error) => {
                setLoading(false);
                toast.error(error || "Creation failed");
            }
        });
    };

    const handleUpdateParking = () => {
        setLoading(true);
        const body = { ...form };

        updateParking({
            id: state?.parking?._id,
            body,
            handleUpdateParkingSuccess: () => {
                setLoading(false);
                toast.success("Updated successfully!");
            },
            handleUpdateParkingFailure: (error) => {
                setLoading(false);
                toast.error(error || "Update failed");
            }
        });
    };

    const handleSubmit = () => {
        if (state?.parking) {
            handleUpdateParking();
        } else {
            handleCreateParking();
        }
    };

    useEffect(() => {
        if (state?.parking) {
            setForm({
                name: state.parking.name || '',
                address: state.parking.address || '',
                city: state.parking.city || '',
                lat: state.parking.lat || '',
                long: state.parking.long || ''
            });
        }
    }, [state]);

    return (
        <div className='container py-5'>
            <div className='card create-parking-card p-5'>
                <h3 className='mb-4'>{state?.parking ? 'Update' : 'Create'} parking</h3>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={form.name} onChange={(e) => handleFormChange({ key: 'name', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea rows={2} className="form-control" id="address" value={form.address} onChange={(e) => handleFormChange({ key: 'address', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" value={form.city} onChange={(e) => handleFormChange({ key: 'city', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label htmlFor="lat" className="form-label">Lat</label>
                    <input type="number" className="form-control" id="lat" value={form.lat} onChange={(e) => handleFormChange({ key: 'lat', value: e.target.value })} />
                </div>

                <div className="mb-3">
                    <label htmlFor="long" className="form-label">Long</label>
                    <input type="number" className="form-control" id="long" value={form.long} onChange={(e) => handleFormChange({ key: 'long', value: e.target.value })} />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary mt-4"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        "Submit"
                    )}
                </button>
            </div>
        </div>
    )
};

export default ParkingForm;
