import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'

import { deleteParking, fetchParkings } from '../api/api'
import { DeleteModal, ParkingCard } from '../components'
import '../css/parking.scss'

// Fix for default Leaflet marker icons not showing
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})
const FitBounds = ({ parkings }) => {
  const map = useMap();

  useEffect(() => {
    if (parkings.length > 0) {
      const bounds = L.latLngBounds(
        parkings.map(p => [p.lat, p.long])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [parkings, map]);

  return null;
};

const Parking = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [parkings, setParkings] = useState([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(parkings.length / itemsPerPage)

  // Delete state
  const [selectedParking, setSelectedParking] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (user?.type === 'owner') {
      fetchParkings({ user_id: user?._id, setParkings })
    } else {
      fetchParkings({ setParkings })
    }
  }, [])

  // Paginated cards
  const parkingCards = () => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return parkings.slice(start, end).map((item, index) => (
      <div className='col-md-4' key={index}>
        <ParkingCard
          parking={item}
          onClick={() => navigate('/space', { state: { parking: item } })}
          setSelectedParking={setSelectedParking}
          setShowDeleteModal={setShowDeleteModal}
        />
      </div>
    ))
  }

  const handleDeleteParking = () => {
    deleteParking({
      id: selectedParking?._id,
      handleDeleteParkingSuccess,
      handleDeleteParkingFailure
    })
  }

  const handleDeleteParkingSuccess = () => {
    if (user?.type === 'owner') {
      fetchParkings({ user_id: user?._id, setParkings })
    } else {
      fetchParkings({ setParkings })
    }
    setShowDeleteModal(false)
  }

  const handleDeleteParkingFailure = () => {
    setShowDeleteModal(false)
  }

  return (
    <div className='container'>
      <h1 className='mt-5'>Parkings</h1>

      {/* Map Section */}
      <div className='my-4' style={{ height: '400px' }}>
        <MapContainer
          center={[54.5, -3.5]} // Rough center of UK
  zoom={6}              // Zoom level to show most of UK
  scrollWheelZoom={true}
  style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; OpenStreetMap contributors'
          />
          <FitBounds parkings={parkings} />
          {parkings.map((parking, i) => (
            parking.lat && parking.long && (
              <Marker
                key={i}
                position={[parking.lat, parking.long]}
              >
                <Popup>
                  <b>{parking.name}</b>
                  <br />
                  {parking.address}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* Cards Section */}
      <div className='row mt-2 g-5'>{parkingCards()}</div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='text-center my-4'>
          <button
            className='btn btn-secondary me-2'
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className='btn btn-secondary ms-2'
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        value={selectedParking?.name}
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDeleteConfirm={handleDeleteParking}
      />
    </div>
  )
}

export default Parking
