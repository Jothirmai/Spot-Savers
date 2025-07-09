import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteSpace, fetchSpaces } from '../api/api';
import { DeleteModal, SpaceCard } from '../components';
import '../css/parking.scss';

const Space = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const spacesPerPage = 6;

  const [searchForm, setSearchForm] = useState({
    city: '',
    date: ''
  });

  const [selectedSpace, setSelectedSpace] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchFilteredSpaces();
  }, [state]);

  const parseTime = (dateString, time12h) => {
    const date = new Date(dateString);
    const time = time12h.toLowerCase().trim();
    const [rawTime, modifier] = time.split(/(am|pm)/);
    const [hhStr, mmStr] = rawTime.trim().split(':');
    let hh = parseInt(hhStr);
    const mm = parseInt(mmStr);

    if (modifier === 'pm' && hh !== 12) hh += 12;
    if (modifier === 'am' && hh === 12) hh = 0;

    date.setHours(hh, mm, 0, 0);
    return date;
  };

  const fetchFilteredSpaces = () => {
    setLoading(true);
    const query = {
      ...(user?.type === 'owner' && { user_id: user?._id }),
      ...(state?.parking?._id && { parking_id: state.parking._id })
    };

    fetchSpaces({
      ...query,
      setSpaces: (data) => {
        const nowPlus2Hours = new Date(Date.now() + 2 * 60 * 60 * 1000);

        const filtered = (data || []).filter(space => {
          try {
            const endTime = parseTime(space.date, space.slot_end_time);
            const notExpired = endTime > nowPlus2Hours;
            const notApproved = space.confirm_booking !== 'approved';
            return notExpired && notApproved;
          } catch {
            return false;
          }
        });

        setSpaces(filtered);
        setLoading(false);
      }
    });
  };

  const handleSearchForm = ({ key, value }) => {
    setSearchForm({ ...searchForm, [key]: value });
  };

  const handleSearch = () => {
    setLoading(true);
    setCurrentPage(1);

    const query = {
      ...(user?.type === 'owner' && { user_id: user?._id }),
      ...(state?.parking?._id && { parking_id: state.parking._id }),
      ...searchForm
    };

    fetchSpaces({
      ...query,
      setSpaces: (data) => {
        const nowPlus2Hours = new Date(Date.now() + 2 * 60 * 60 * 1000);

        const filtered = (data || []).filter(space => {
          try {
            const endTime = parseTime(space.date, space.slot_end_time);

            const cityMatch = !searchForm.city || space.parking_id?.city?.toLowerCase().includes(searchForm.city.toLowerCase());
            const dateMatch = !searchForm.date || new Date(space.date).toISOString().split('T')[0] === searchForm.date;
            const notApproved = space.confirm_booking !== 'approved';

            return endTime > nowPlus2Hours && cityMatch && dateMatch && notApproved;
          } catch {
            return false;
          }
        });

        setSpaces(filtered);
        setLoading(false);
      }
    });
  };

  const handleDeleteSpace = () => {
    deleteSpace({ id: selectedSpace?._id, handleDeleteSpaceSuccess, handleDeleteSpaceFailure });
  };

  const handleDeleteSpaceSuccess = () => {
    fetchFilteredSpaces();
    setShowDeleteModal(false);
  };

  const handleDeleteSpaceFailure = () => {
    setShowDeleteModal(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const spaceCards = () => {
    const indexOfLast = currentPage * spacesPerPage;
    const indexOfFirst = indexOfLast - spacesPerPage;
    const currentSpaces = spaces.slice(indexOfFirst, indexOfLast);

    return currentSpaces.map((item, index) => (
      <div className='col-md-4' key={index}>
        <SpaceCard
          space={item}
          onBooking={() => navigate('/bookingForm', { state: { space: item } })}
          setSelectedSpace={setSelectedSpace}
          setShowDeleteModal={setShowDeleteModal}
        />
      </div>
    ));
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(spaces.length / spacesPerPage);
    return (
      <div className='d-flex justify-content-center mt-4'>
        <nav>
          <ul className='pagination'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                <button className='page-link' onClick={() => setCurrentPage(page)}>{page}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <div className='container'>
      <h1 className='mt-5'>Search Results</h1>

      <div className='card p-4 mt-4'>
        <div className='row g-3 d-flex align-items-center'>
          <div className='col-md-4'>
            <input type='text' placeholder='City' className='form-control'
              value={searchForm.city}
              onChange={(e) => handleSearchForm({ key: 'city', value: e.target.value })} />
          </div>
          <div className='col-md-4'>
            <input type='date' className='form-control'
              value={searchForm.date}
              min={getTodayDate()}
              onChange={(e) => handleSearchForm({ key: 'date', value: e.target.value })} />
          </div>
          <div className='col-md-4'>
            <button className='btn btn-primary form-control' onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <h4 className='mt-4'>Showing {spaces?.length} results</h4>

      {loading ? (
        <div className='d-flex justify-content-center mt-5'>
          <svg className='animate-spinner' xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' fill='none'>
            <circle cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' className='opacity-25' />
            <path fill='currentColor' d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z' className='opacity-75' />
          </svg>
        </div>
      ) : (
        <>
          <div className='row mt-2 g-5'>
            {spaceCards()}
          </div>
          {renderPagination()}
        </>
      )}

      <DeleteModal
        value={selectedSpace?.name}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDeleteConfirm={handleDeleteSpace}
      />
    </div>
  );
};

export default Space;
